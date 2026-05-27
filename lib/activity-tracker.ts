/**
 * Lightweight activity tracker — lưu vào localStorage
 * Key: hv_activity  →  { "2025-05-27": 2, "2025-05-20": 1, ... }
 */

const KEY = "hv_activity"

function today(): string {
  return new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
}

export function trackActivity() {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem(KEY)
    const data: Record<string, number> = raw ? JSON.parse(raw) : {}
    const d = today()
    data[d] = (data[d] ?? 0) + 1
    localStorage.setItem(KEY, JSON.stringify(data))
    updateStreak(data)
  } catch {}
}

function updateStreak(data: Record<string, number>) {
  let streak = 0
  const d = new Date()
  // Start from today or yesterday (allow same-day check)
  for (let i = 0; i < 365; i++) {
    const key = d.toISOString().slice(0, 10)
    if (data[key]) {
      streak++
      d.setDate(d.getDate() - 1)
    } else if (i === 0) {
      // Today has no activity yet — check from yesterday
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  localStorage.setItem("hv_streak", String(streak))
}

export function getActivity(): Record<string, number> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getStreak(): number {
  if (typeof window === "undefined") return 0
  return parseInt(localStorage.getItem("hv_streak") ?? "0")
}

export function getTotalEssays(): number {
  const data = getActivity()
  return Object.values(data).reduce((s, v) => s + v, 0)
}
