import Anthropic from "@anthropic-ai/sdk"
import {
  buildQ51Prompt,
  buildQ52Prompt,
  buildQ53Prompt,
  buildQ54Prompt,
  type GradeResult,
} from "./grading-prompts"

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const MODEL = "claude-sonnet-4-5"
const MAX_TOKENS = 1500

// Parse JSON safely from Claude response
function parseGradeJSON(text: string): Record<string, unknown> | null {
  try {
    // Extract JSON from response (sometimes Claude adds extra text)
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return null
    return JSON.parse(match[0])
  } catch {
    return null
  }
}

// ============================================================
// Grade Q51 / Q52 single blank answer
// ============================================================
export async function gradeQ51Q52(params: {
  questionType: "q51" | "q52"
  promptText: string
  blankKey: string
  studentAnswer: string
  contextHint: string
}): Promise<GradeResult> {
  const { questionType, promptText, blankKey, studentAnswer, contextHint } = params

  const systemPrompt =
    questionType === "q51"
      ? buildQ51Prompt(promptText, blankKey, studentAnswer, contextHint)
      : buildQ52Prompt(promptText, blankKey, studentAnswer, contextHint)

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      { role: "user", content: systemPrompt },
    ],
  })

  const text = response.content[0].type === "text" ? response.content[0].text : ""
  const data = parseGradeJSON(text)

  if (!data) {
    return defaultResult(questionType, "Khong the phan tich ket qua cham diem.")
  }

  const scores = (data.scores as Record<string, number>) || {}
  const feedback = (data.feedback as Record<string, string>) || {}
  const corrections = (data.corrections as Array<{original: string; corrected: string; explanation: string}>) || []

  return {
    question_type: questionType,
    scores: {
      content: scores.content ?? 0,
      organization: 0,
      language: scores.language ?? 0,
      style: scores.style ?? 0,
      total: scores.total ?? 0,
    },
    max_scores: {
      content: 2,
      organization: 0,
      language: 2,
      style: 1,
      total: 5,
    },
    feedback: {
      overall: feedback.overall ?? "",
      content: feedback.content ?? "",
      organization: "",
      language: feedback.language ?? "",
      style: feedback.style ?? "",
    },
    corrections,
    better_example: (data.better_example as string) ?? undefined,
  }
}

// ============================================================
// Grade Q53
// ============================================================
export async function gradeQ53(params: {
  chartDescription: string
  studentEssay: string
}): Promise<GradeResult> {
  const { chartDescription, studentEssay } = params
  const charCount = studentEssay.replace(/\n/g, "").length

  const systemPrompt = buildQ53Prompt(chartDescription, studentEssay, charCount)

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      { role: "user", content: systemPrompt },
    ],
  })

  const text = response.content[0].type === "text" ? response.content[0].text : ""
  const data = parseGradeJSON(text)

  if (!data) {
    return defaultResult("q53", "Khong the phan tich ket qua cham diem.")
  }

  const scores = (data.scores as Record<string, number>) || {}
  const feedback = (data.feedback as Record<string, string>) || {}
  const corrections = (data.corrections as Array<{original: string; corrected: string; explanation: string}>) || []

  return {
    question_type: "q53",
    scores: {
      content: scores.content ?? 0,
      organization: scores.organization ?? 0,
      language: scores.language ?? 0,
      style: 0,
      total: scores.total ?? 0,
    },
    max_scores: {
      content: 12,
      organization: 9,
      language: 9,
      style: 0,
      total: 30,
    },
    feedback: {
      overall: (data.char_count_feedback as string ?? "") + " " + (feedback.overall ?? ""),
      content: feedback.content ?? "",
      organization: feedback.organization ?? "",
      language: feedback.language ?? "",
      style: "",
    },
    corrections,
    better_example: (data.better_example as string) ?? undefined,
  }
}

// ============================================================
// Grade Q54
// ============================================================
export async function gradeQ54(params: {
  topic: string
  studentEssay: string
}): Promise<GradeResult> {
  const { topic, studentEssay } = params
  const charCount = studentEssay.replace(/\n/g, "").length

  const systemPrompt = buildQ54Prompt(topic, studentEssay, charCount)

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      { role: "user", content: systemPrompt },
    ],
  })

  const text = response.content[0].type === "text" ? response.content[0].text : ""
  const data = parseGradeJSON(text)

  if (!data) {
    return defaultResult("q54", "Khong the phan tich ket qua cham diem.")
  }

  const scores = (data.scores as Record<string, number>) || {}
  const feedback = (data.feedback as Record<string, string>) || {}
  const corrections = (data.corrections as Array<{original: string; corrected: string; explanation: string}>) || []

  return {
    question_type: "q54",
    scores: {
      content: scores.content ?? 0,
      organization: scores.organization ?? 0,
      language: scores.language ?? 0,
      style: scores.style ?? 0,
      total: scores.total ?? 0,
    },
    max_scores: {
      content: 12,
      organization: 12,
      language: 14,
      style: 12,
      total: 50,
    },
    feedback: {
      overall: feedback.overall ?? "",
      content: feedback.content ?? "",
      organization: feedback.organization ?? "",
      language: feedback.language ?? "",
      style: feedback.style ?? "",
    },
    corrections,
    better_example: (data.better_opening as string) ?? undefined,
  }
}

// ============================================================
// Default result on error
// ============================================================
function defaultResult(type: "q51" | "q52" | "q53" | "q54", message: string): GradeResult {
  const maxMap = {
    q51: { content: 2, organization: 0, language: 2, style: 1, total: 5 },
    q52: { content: 2, organization: 0, language: 2, style: 1, total: 5 },
    q53: { content: 12, organization: 9, language: 9, style: 0, total: 30 },
    q54: { content: 12, organization: 12, language: 14, style: 12, total: 50 },
  }
  return {
    question_type: type,
    scores: { content: 0, organization: 0, language: 0, style: 0, total: 0 },
    max_scores: maxMap[type],
    feedback: {
      overall: message,
      content: "",
      organization: "",
      language: "",
      style: "",
    },
    corrections: [],
  }
}
