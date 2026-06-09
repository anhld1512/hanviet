/**
 * last-result-cache.ts
 *
 * Two-layer result persistence:
 *   L1 — localStorage: instant, same device, survives page refresh
 *   L2 — Supabase submissions.full_result: cross-device, survives cache clear
 *
 * Load priority: L1 first → if miss, fetch L2 → cache into L1
 * Save: write L1 synchronously, L2 is handled by saveSubmission (called separately)
 * Clear: write L1 tombstone → prevents L2 restore on same device (user wants fresh start)
 */

import { createClient } from "@/lib/supabase-client"
import type { GradeResult } from "./grading-prompts"

const TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 ngày

// ── Types ─────────────────────────────────────────────────────────────────────

export type CachedResultQ51Q52 = {
  answerA: string
  answerB: string
  gradeA: GradeResult
  gradeB: GradeResult
}

export type CachedResultQ53Q54 = {
  answer: string
  gradeResult: GradeResult
}

type L1Entry<T> = { data: T; savedAt: number } | { cleared: true; savedAt: number }

// ── localStorage helpers ──────────────────────────────────────────────────────

function lsKey(qType: string, promptId: number) {
  return `topeak_result_${qType}_${promptId}`
}

function lsRead<T>(qType: string, promptId: number): L1Entry<T> | null {
  try {
    const raw = localStorage.getItem(lsKey(qType, promptId))
    if (!raw) return null
    const entry: L1Entry<T> = JSON.parse(raw)
    if (Date.now() - entry.savedAt > TTL_MS) {
      localStorage.removeItem(lsKey(qType, promptId))
      return null
    }
    return entry
  } catch { return null }
}

function lsWrite<T>(qType: string, promptId: number, data: T) {
  try {
    localStorage.setItem(lsKey(qType, promptId), JSON.stringify({ data, savedAt: Date.now() }))
  } catch {}
}

function lsWriteTombstone(qType: string, promptId: number) {
  try {
    localStorage.setItem(lsKey(qType, promptId), JSON.stringify({ cleared: true, savedAt: Date.now() }))
  } catch {}
}

// ── Q51 / Q52 ─────────────────────────────────────────────────────────────────

/** Lưu kết quả Q51/Q52 vào L1 (sync). L2 được xử lý trong saveSubmission. */
export function saveResultQ51Q52(
  qType: "q51" | "q52",
  promptId: number,
  data: CachedResultQ51Q52
) {
  lsWrite(qType, promptId, data)
}

/**
 * Load kết quả Q51/Q52.
 * L1 → nếu miss và không bị cleared → L2 (Supabase) → cache vào L1.
 */
export async function loadResultQ51Q52(
  qType: "q51" | "q52",
  promptId: number
): Promise<CachedResultQ51Q52 | null> {
  const l1 = lsRead<CachedResultQ51Q52>(qType, promptId)

  // Tombstone: user muốn làm lại, không restore từ DB
  if (l1 && "cleared" in l1) return null

  // L1 hit
  if (l1 && "data" in l1) return l1.data

  // L2 fallback: fetch từ Supabase
  const fromDB = await fetchLastResultFromDB(qType, promptId)
  if (fromDB) {
    const typed = fromDB as CachedResultQ51Q52
    lsWrite(qType, promptId, typed) // cache lại vào L1
    return typed
  }

  return null
}

// ── Q53 / Q54 ─────────────────────────────────────────────────────────────────

/** Lưu kết quả Q53/Q54 vào L1. */
export function saveResultQ53Q54(
  qType: "q53" | "q54",
  promptId: number,
  data: CachedResultQ53Q54
) {
  lsWrite(qType, promptId, data)
}

/** Load kết quả Q53/Q54 — L1 → L2. */
export async function loadResultQ53Q54(
  qType: "q53" | "q54",
  promptId: number
): Promise<CachedResultQ53Q54 | null> {
  const l1 = lsRead<CachedResultQ53Q54>(qType, promptId)

  if (l1 && "cleared" in l1) return null
  if (l1 && "data" in l1) return l1.data

  const fromDB = await fetchLastResultFromDB(qType, promptId)
  if (fromDB) {
    const typed = fromDB as CachedResultQ53Q54
    lsWrite(qType, promptId, typed)
    return typed
  }

  return null
}

// ── Preload tất cả kết quả của 1 question type (1 DB call cho cả trang) ───────

/**
 * Fetch latest full_result cho tất cả prompts của 1 question type.
 * Dùng trong useEffect trên trang list để preload sẵn, tránh per-prompt DB call.
 * Returns { [promptId]: CachedResult }
 */
export async function preloadResultsFromDB(
  qType: string
): Promise<Record<number, unknown>> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return {}

    const { data } = await supabase
      .from("submissions")
      .select("prompt_id, full_result, created_at")
      .eq("user_id", user.id)
      .eq("question_type", qType)
      .not("full_result", "is", null)
      .not("prompt_id", "is", null)
      .order("created_at", { ascending: false })

    if (!data) return {}

    // Keep latest per prompt_id
    const map: Record<number, unknown> = {}
    for (const row of data) {
      if (row.prompt_id && !(row.prompt_id in map)) {
        map[row.prompt_id] = row.full_result
      }
    }
    return map
  } catch { return {} }
}

/**
 * Merge DB results vào localStorage (cache warm-up).
 * Chỉ write nếu L1 chưa có hoặc đã expired (không override tombstone / fresh data).
 */
export function mergeDBResultsToLocalStorage(
  qType: string,
  dbResults: Record<number, unknown>
) {
  for (const [idStr, result] of Object.entries(dbResults)) {
    const promptId = parseInt(idStr)
    const l1 = lsRead(qType, promptId)
    if (!l1) {
      // L1 miss → cache từ DB
      lsWrite(qType, promptId, result)
    }
    // L1 có (tombstone hoặc fresh data) → giữ nguyên L1, không override
  }
}

// ── Clear (tombstone) ─────────────────────────────────────────────────────────

/**
 * "Làm lại đề này" — ghi tombstone vào L1.
 * Tombstone ngăn DB restore trên cùng device nhưng không xóa DB record.
 * Device khác (không có tombstone) sẽ vẫn thấy kết quả cũ từ DB.
 */
export function clearResult(qType: string, promptId: number) {
  lsWriteTombstone(qType, promptId)
}

// ── Internal DB fetch ─────────────────────────────────────────────────────────

async function fetchLastResultFromDB(
  qType: string,
  promptId: number
): Promise<unknown | null> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
      .from("submissions")
      .select("full_result")
      .eq("user_id", user.id)
      .eq("question_type", qType)
      .eq("prompt_id", promptId)
      .not("full_result", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    return data?.full_result ?? null
  } catch { return null }
}
