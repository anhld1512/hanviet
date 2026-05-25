// Score persistence — Supabase per user + localStorage fallback

import { createClient } from "@/lib/supabase-client"

// ── LocalStorage (fallback / guest) ──────────────────────────────────────────

function lsKey(qType: string, promptId: number) {
  return `hanviet_best_${qType}_${promptId}`
}

function lsGet(qType: string, promptId: number): number | null {
  if (typeof window === "undefined") return null
  const v = localStorage.getItem(lsKey(qType, promptId))
  return v !== null ? parseInt(v, 10) : null
}

function lsSet(qType: string, promptId: number, pct: number) {
  if (typeof window === "undefined") return
  const existing = lsGet(qType, promptId)
  if (existing === null || pct > existing) {
    localStorage.setItem(lsKey(qType, promptId), String(pct))
  }
}

// ── Supabase per-user best scores ─────────────────────────────────────────────

/**
 * Fetch all best scores for a question type from Supabase submissions.
 * Returns a map of { promptId: bestPct }.
 * Falls back to empty map on error.
 */
export async function loadBestScoresFromDB(
  qType: "q51" | "q52" | "q53" | "q54"
): Promise<Record<number, number>> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return {}

    const { data } = await supabase
      .from("submissions")
      .select("prompt_id, total_score, max_score")
      .eq("user_id", user.id)
      .eq("question_type", qType)
      .not("prompt_id", "is", null)

    if (!data) return {}

    // Keep best pct per prompt_id
    const best: Record<number, number> = {}
    for (const row of data) {
      if (!row.prompt_id || !row.max_score) continue
      const pct = Math.round((row.total_score / row.max_score) * 100)
      if (best[row.prompt_id] === undefined || pct > best[row.prompt_id]) {
        best[row.prompt_id] = pct
      }
    }
    return best
  } catch {
    return {}
  }
}

/**
 * Save best pct — writes to Supabase (via prompt_id on submission) AND localStorage.
 * Skip for AI-generated prompts (id = -1).
 */
export function saveBestPct(qType: string, promptId: number, pct: number) {
  if (promptId === -1) return // AI-generated prompt — don't persist
  lsSet(qType, promptId, pct)
  // Supabase best score is derived from submissions table — no extra write needed
  // (the submission insert in saveSubmission already stores the score)
}

/**
 * Get best pct from localStorage (fast, sync).
 * Used as initial value before Supabase data loads.
 */
export function getBestPct(qType: string, promptId: number): number | null {
  if (promptId === -1) return null
  return lsGet(qType, promptId)
}

/**
 * Merge Supabase best scores into localStorage for offline consistency.
 * Call this after loadBestScoresFromDB resolves.
 */
export function mergeBestScoresToLocalStorage(qType: string, dbScores: Record<number, number>) {
  for (const [idStr, pct] of Object.entries(dbScores)) {
    lsSet(qType, parseInt(idStr), pct)
  }
}

// ── Color helpers ──────────────────────────────────────────────────────────────

export function scoreColor(pct: number | null): string {
  if (pct === null) return "border-gray-100 bg-white"
  if (pct >= 80) return "border-green-300 bg-green-50"
  if (pct >= 60) return "border-yellow-300 bg-yellow-50"
  return "border-orange-200 bg-orange-50"
}

export function scoreBadgeColor(pct: number | null): string {
  if (pct === null) return "text-gray-400"
  if (pct >= 80) return "text-green-600 font-bold"
  if (pct >= 60) return "text-yellow-600 font-bold"
  return "text-orange-500 font-bold"
}

export function difficultyLabel(d: string): string {
  return d === "easy" ? "Dễ" : d === "hard" ? "Khó" : "TB"
}

export function difficultyColor(d: string): string {
  return d === "easy"
    ? "bg-green-100 text-green-700"
    : d === "hard"
    ? "bg-red-100 text-red-700"
    : "bg-yellow-100 text-yellow-700"
}
