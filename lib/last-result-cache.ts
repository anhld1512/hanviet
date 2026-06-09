/**
 * last-result-cache.ts
 * Lưu kết quả chấm bài vào localStorage theo (questionType, promptId).
 * Khi user quay lại đề đã làm → restore result view thay vì blank editor.
 * TTL: 30 ngày
 */

import type { GradeResult } from "./grading-prompts"

const TTL = 30 * 24 * 60 * 60 * 1000 // 30 ngày

// ── Types ─────────────────────────────────────────────────────────────────────

export type CachedResultQ51Q52 = {
  answerA: string
  answerB: string
  gradeA: GradeResult
  gradeB: GradeResult
  savedAt: number
}

export type CachedResultQ53Q54 = {
  answer: string
  gradeResult: GradeResult
  savedAt: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function key(qType: string, promptId: number) {
  return `topeak_result_${qType}_${promptId}`
}

// ── Q51 / Q52 ─────────────────────────────────────────────────────────────────

export function saveResultQ51Q52(
  qType: "q51" | "q52",
  promptId: number,
  data: Omit<CachedResultQ51Q52, "savedAt">
) {
  try {
    localStorage.setItem(key(qType, promptId), JSON.stringify({ ...data, savedAt: Date.now() }))
  } catch {}
}

export function loadResultQ51Q52(
  qType: "q51" | "q52",
  promptId: number
): CachedResultQ51Q52 | null {
  try {
    const raw = localStorage.getItem(key(qType, promptId))
    if (!raw) return null
    const data: CachedResultQ51Q52 = JSON.parse(raw)
    if (Date.now() - data.savedAt > TTL) {
      localStorage.removeItem(key(qType, promptId))
      return null
    }
    return data
  } catch { return null }
}

// ── Q53 / Q54 ─────────────────────────────────────────────────────────────────

export function saveResultQ53Q54(
  qType: "q53" | "q54",
  promptId: number,
  data: Omit<CachedResultQ53Q54, "savedAt">
) {
  try {
    localStorage.setItem(key(qType, promptId), JSON.stringify({ ...data, savedAt: Date.now() }))
  } catch {}
}

export function loadResultQ53Q54(
  qType: "q53" | "q54",
  promptId: number
): CachedResultQ53Q54 | null {
  try {
    const raw = localStorage.getItem(key(qType, promptId))
    if (!raw) return null
    const data: CachedResultQ53Q54 = JSON.parse(raw)
    if (Date.now() - data.savedAt > TTL) {
      localStorage.removeItem(key(qType, promptId))
      return null
    }
    return data
  } catch { return null }
}

// ── Clear ─────────────────────────────────────────────────────────────────────

export function clearResult(qType: string, promptId: number) {
  try { localStorage.removeItem(key(qType, promptId)) } catch {}
}
