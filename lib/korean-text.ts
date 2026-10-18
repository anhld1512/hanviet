// Deterministic Korean text analysis used to ground the AI grader.
// Pure functions — safe for both server and client.

// 원고지 counts every cell including spaces; line breaks don't occupy cells.
export function countChars(text: string): number {
  return text.replace(/\r?\n/g, "").length
}

export type Register = "hapsyo" | "haeyo" | "da" | "other"

export const REGISTER_LABEL: Record<Register, string> = {
  hapsyo: "합쇼체 (-ㅂ/습니다)",
  haeyo: "해요체 (-아/어요)",
  da: "다체 (-ㄴ/는다, -다)",
  other: "khác",
}

export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.?!。])\s+|\r?\n+/)
    .map((s) => s.trim())
    .filter((s) => /[가-힣]/.test(s))
}

export function sentenceRegister(sentence: string): Register {
  const s = sentence.replace(/[\s.?!。,"'”’)\]]+$/u, "")
  if (/(니다|니까|십시오|시오|읍시다|ㅂ시다)$/.test(s)) return "hapsyo"
  if (/요$/.test(s)) return "haeyo"
  if (/다$/.test(s)) return "da"
  return "other"
}

export type RegisterReport = {
  counts: Record<Register, number>
  dominant: Register | null
  samples: Partial<Record<Register, string[]>>
}

export function analyzeRegister(text: string): RegisterReport {
  const counts: Record<Register, number> = { hapsyo: 0, haeyo: 0, da: 0, other: 0 }
  const samples: Partial<Record<Register, string[]>> = {}
  for (const s of splitSentences(text)) {
    const r = sentenceRegister(s)
    counts[r]++
    const list = (samples[r] ??= [])
    if (list.length < 3) list.push(s.length > 40 ? "…" + s.slice(-40) : s)
  }
  const ranked = (Object.keys(counts) as Register[])
    .filter((r) => r !== "other" && counts[r] > 0)
    .sort((a, b) => counts[b] - counts[a])
  return { counts, dominant: ranked[0] ?? null, samples }
}

export function describeRegister(report: RegisterReport): string {
  const parts = (Object.keys(report.counts) as Register[])
    .filter((r) => report.counts[r] > 0)
    .map((r) => `${report.counts[r]} câu ${REGISTER_LABEL[r]}`)
  if (parts.length === 0) return "không xác định được câu tiếng Hàn hoàn chỉnh"
  const offenders = (["hapsyo", "haeyo"] as Register[])
    .filter((r) => report.samples[r]?.length)
    .map((r) => `${REGISTER_LABEL[r]}: ${report.samples[r]!.map((x) => `"${x}"`).join(", ")}`)
  return parts.join(", ") + (offenders.length ? `\nCâu ví dụ — ${offenders.join(" | ")}` : "")
}

// Text addressed to the grader instead of being part of the essay.
const INJECTION_PATTERNS = [
  /만점/,
  /채점\s*(자|자님|시스템|기준을|지시|안내|하는\s*분)/,
  /(점수|총점)[을를]?\s*\d*\s*(점\s*)?(으로|로)?\s*(주|부여|설정|매기)/,
  /모든\s*항목/,
  /\bignore\b|\bdisregard\b|full\s*marks|system\s*prompt|\binstructions?\b|\btotal\s*[:=]/i,
  /(cho|chấm)\s*(tôi\s*)?(điểm\s*)?(tối đa|cao nhất|full)|bỏ qua\s*(rubric|hướng dẫn|tiêu chí)/i,
]

export function detectInjection(text: string): string[] {
  const hits: string[] = []
  for (const s of splitSentences(text).concat(text.split(/[\[\]{}]/))) {
    if (INJECTION_PATTERNS.some((p) => p.test(s))) {
      const snippet = s.trim().slice(0, 80)
      if (snippet && !hits.includes(snippet)) hits.push(snippet)
    }
  }
  return hits.slice(0, 3)
}

const CIRCLED: Record<string, string> = { "ㄱ": "㉠", "ㄴ": "㉡" }
const bare = (s: string) => s.replace(/[\s.,?!。"'“”‘’()]/g, "")

// NIIED: the answer must not repeat the words printed right before/after the blank.
export function blankEchoWarning(passage: string, key: string, answer: string): string | null {
  const marker = new RegExp(`\\(\\s*(${key}|${CIRCLED[key] ?? key})\\s*\\)`)
  const m = marker.exec(passage)
  if (!m) return null
  const ans = bare(answer)
  const before = passage.slice(0, m.index).split(/\r?\n/).pop()!.trim().split(/\s+/).filter(Boolean)
  for (const n of [2, 1]) {
    const tail = bare(before.slice(-n).join(""))
    if (tail.length >= 2 && before.length >= n && ans.startsWith(tail)) {
      return `đáp án lặp lại chữ "${before.slice(-n).join(" ")}" in sẵn ngay trước chỗ trống`
    }
  }
  const after = passage.slice(m.index + m[0].length).split(/\r?\n/)[0].trim().split(/\s+/).filter(Boolean)
  const head = bare(after[0] ?? "")
  if (head.length >= 2 && ans.endsWith(head)) {
    return `đáp án lặp lại chữ "${after[0]}" in sẵn ngay sau chỗ trống`
  }
  return null
}

// Student text is wrapped in tags; make sure it cannot close them.
export function fenceUserText(text: string): string {
  return text.replace(/<\/?\s*(bai_viet|dap_an|de_bai|du_lieu)[^>]*>/gi, "")
}
