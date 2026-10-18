import OpenAI from "openai"
import {
  buildBlankPrompt,
  buildEssayPrompt,
  MAX_SCORES,
  type BlankChecks,
  type BlankInput,
  type ErrorCategory,
  type GradeResult,
  type PromptPair,
} from "./grading-prompts"
import {
  analyzeRegister,
  blankEchoWarning,
  countChars,
  describeRegister,
  detectInjection,
  fenceUserText,
  REGISTER_LABEL,
} from "./korean-text"

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
})

const MODEL = process.env.GRADING_MODEL ?? "deepseek-chat"

export class GradingError extends Error {}

type Json = Record<string, unknown>

function parseJSON(text: string): Json | null {
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim()
  try {
    return JSON.parse(cleaned)
  } catch {}
  const start = cleaned.indexOf("{")
  const end = cleaned.lastIndexOf("}")
  if (start === -1 || end <= start) return null
  try {
    return JSON.parse(cleaned.slice(start, end + 1))
  } catch {
    return null
  }
}

async function callModel<T>(prompt: PromptPair, maxTokens: number, validate: (j: Json) => T | null): Promise<T> {
  let lastError = "empty response"
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user },
        ],
        max_tokens: maxTokens,
        temperature: 0,
        response_format: { type: "json_object" },
      })
      const json = parseJSON(res.choices[0]?.message?.content ?? "")
      const valid = json && validate(json)
      if (valid) return valid
      lastError = json ? "invalid schema" : "unparseable JSON"
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e)
    }
    console.warn(`[ai-grading] attempt ${attempt + 1} failed: ${lastError}`)
  }
  throw new GradingError(lastError)
}

// ─── Normalization helpers ───────────────────────────────────────────────────

function clampInt(v: unknown, max: number): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN
  if (!Number.isFinite(n)) return null
  return Math.min(max, Math.max(0, Math.round(n)))
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "")

const ERROR_TYPES: ErrorCategory[] = ["grammar", "vocabulary", "style", "logic", "content"]

function normCorrections(v: unknown, limit: number): GradeResult["corrections"] {
  if (!Array.isArray(v)) return []
  return v
    .filter((c): c is Json => !!c && typeof c === "object")
    .map((c) => ({
      original: str(c.original),
      corrected: str(c.corrected),
      explanation: str(c.explanation),
      type: ERROR_TYPES.includes(c.type as ErrorCategory) ? (c.type as ErrorCategory) : undefined,
      pattern: str(c.pattern) || undefined,
    }))
    .filter((c) => c.original && c.corrected && c.original !== c.corrected)
    .slice(0, limit)
}

function normCoaching(v: unknown): GradeResult["coaching"] {
  const c = (v && typeof v === "object" ? v : {}) as Json
  const out = {
    strength: str(c.strength),
    weakness: str(c.weakness),
    focus_pattern: str(c.focus_pattern),
    level_tip: str(c.level_tip),
  }
  return Object.values(out).some(Boolean) ? out : undefined
}

// ─── Q51 / Q52 ────────────────────────────────────────────────────────────────

const DEDUCTION_REASONS = [
  "spelling", "particle", "grammar", "hoeung", "register",
  "meaning", "partial_meaning", "extra", "multi_sentence", "echo",
] as const
type DeductionReason = (typeof DEDUCTION_REASONS)[number]

export async function gradeBlanks(params: {
  questionType: "q51" | "q52"
  passage: string
  blanks: BlankInput[]
}): Promise<GradeResult[]> {
  const { questionType, passage } = params
  const blanks = params.blanks.map((b) => {
    const answer = fenceUserText(b.answer.trim())
    const echo = blankEchoWarning(passage, b.key, answer)
    return { ...b, answer, echo, warnings: echo ? [echo] : [] }
  })
  const reg = analyzeRegister(passage)

  const prompt = buildBlankPrompt({
    questionType,
    passage: fenceUserText(passage),
    passageRegister: reg.dominant ? REGISTER_LABEL[reg.dominant] : "không xác định",
    blanks,
    injectionHits: detectInjection(blanks.map((b) => b.answer).join("\n")),
  })

  const graded = await callModel(prompt, 1500 * blanks.length, (j) => {
    const arr = Array.isArray(j.blanks) ? (j.blanks as Json[]) : null
    if (!arr || arr.length < blanks.length) return null
    const scores = arr.map((b) => clampInt(b?.score, 5))
    return scores.every((s) => s !== null) ? arr.slice(0, blanks.length) : null
  })

  return graded.map((g, i): GradeResult => {
    const answer = blanks[i].answer
    // Blank or non-Korean answers can't score regardless of what the model says.
    const reasons = new Set(
      (Array.isArray(g.deductions) ? (g.deductions as Json[]) : [])
        .map((d) => d?.reason)
        .filter((r): r is DeductionReason => DEDUCTION_REASONS.includes(r as DeductionReason))
    )
    if (blanks[i].echo) reasons.add("echo")
    // Only listed error types may cost points; style preferences don't.
    let total = reasons.size === 0 ? 5 : Math.min(clampInt(g.score, 5)!, 4)
    if (reasons.has("echo") || reasons.has("multi_sentence")) total = Math.min(total, 3)
    if (!/[가-힣]/.test(answer)) total = 0
    const has = (...rs: DeductionReason[]) => rs.some((r) => reasons.has(r))
    const checks: BlankChecks = {
      context: !has("meaning", "partial_meaning", "extra"),
      grammar: !has("spelling", "particle", "grammar", "hoeung"),
      register: !has("register"),
      form: !has("multi_sentence", "echo"),
    }
    const tip = str(g.tip)
    let betterExample = str(g.better_example)
    if (betterExample && blankEchoWarning(passage, blanks[i].key, betterExample)) betterExample = blanks[i].reference ?? ""
    return {
      question_type: questionType,
      rubric_version: 2,
      scores: { content: 0, organization: 0, language: 0, style: 0, total },
      max_scores: { ...MAX_SCORES.blank },
      feedback: { overall: str(g.feedback), content: "", organization: "", language: "", style: "" },
      corrections: total === 5 ? [] : normCorrections(g.corrections, 4),
      checks,
      coaching: tip ? { strength: "", weakness: "", focus_pattern: tip, level_tip: "" } : undefined,
      better_example: betterExample || undefined,
    }
  })
}

// ─── Q53 / Q54 ────────────────────────────────────────────────────────────────

function lengthFeedback(questionType: "q53" | "q54", n: number): string {
  const [min, max] = questionType === "q53" ? [200, 300] : [600, 700]
  if (n < min) return `${n}자 — thiếu ${min - n}자 so với yêu cầu ${min}~${max}자`
  if (n > max) return `${n}자 — vượt ${n - max}자 so với yêu cầu ${min}~${max}자`
  return `${n}자 — đạt yêu cầu ${min}~${max}자`
}

export async function gradeEssay(params: {
  questionType: "q53" | "q54"
  task: string
  essay: string
}): Promise<GradeResult> {
  const { questionType } = params
  const essay = fenceUserText(params.essay.trim())
  const m = MAX_SCORES[questionType]
  const charCount = countChars(essay)
  const register = analyzeRegister(essay)

  const prompt = buildEssayPrompt({
    questionType,
    task: fenceUserText(params.task),
    essay,
    charCount,
    registerSummary: describeRegister(register),
    injectionHits: detectInjection(essay),
  })

  const g = await callModel(prompt, 4500, (j) => {
    const s = (j.scores ?? {}) as Json
    const content = clampInt(s.content, m.content)
    const organization = clampInt(s.organization, m.organization)
    const level = clampInt(s.language_level, m.language / 2)
    if (content === null || organization === null || level === null) return null
    return { j, content, organization, language: level * 2 }
  })

  const fb = (g.j.feedback ?? {}) as Json
  const hasKorean = /[가-힣]/.test(essay)
  const scores = hasKorean
    ? { content: g.content, organization: g.organization, language: g.language, style: 0, total: 0 }
    : { content: 0, organization: 0, language: 0, style: 0, total: 0 }
  // Under half the minimum length: every criterion capped at NIIED band E.
  if (charCount < (questionType === "q53" ? 100 : 300)) {
    const cap = questionType === "q53" ? { c: 2, l: 6 } : { c: 4, l: 10 }
    scores.content = Math.min(scores.content, cap.c)
    scores.organization = Math.min(scores.organization, cap.c)
    scores.language = Math.min(scores.language, cap.l)
  }
  // Mostly the wrong register: language capped at band C (-ㅂ/습니다) or D (-아/어요).
  const sentences = register.counts.da + register.counts.hapsyo + register.counts.haeyo + register.counts.other
  if (sentences > 0) {
    const caps = questionType === "q53" ? { C: 12, D: 8 } : { C: 18, D: 14 }
    if (register.counts.haeyo * 2 >= sentences) scores.language = Math.min(scores.language, caps.D)
    else if ((register.counts.haeyo + register.counts.hapsyo) * 2 >= sentences) scores.language = Math.min(scores.language, caps.C)
  }
  scores.total = scores.content + scores.organization + scores.language

  return {
    question_type: questionType,
    rubric_version: 2,
    scores,
    max_scores: { ...m },
    feedback: {
      overall: str(fb.overall),
      content: str(fb.content),
      organization: str(fb.organization),
      language: str(fb.language),
      style: "",
    },
    corrections: normCorrections(g.j.corrections, 8),
    coaching: normCoaching(g.j.coaching),
    char_count_feedback: lengthFeedback(questionType, charCount),
    better_example: str(g.j.better_example) || undefined,
    thesis_feedback: str(g.j.thesis_feedback) || undefined,
    better_opening: str(g.j.better_opening) || undefined,
  }
}
