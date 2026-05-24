import OpenAI from "openai"
import {
  buildQ51Prompt,
  buildQ52Prompt,
  buildQ53Prompt,
  buildQ54Prompt,
  type GradeResult,
} from "./grading-prompts"

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
})

// Q51/Q52: dung Flash (don gian, re)
const MODEL_SIMPLE = "deepseek-v4-flash"
// Q53/Q54: dung Pro (phan tich sau hon)
const MODEL_ADVANCED = "deepseek-v4-pro"

// Parse JSON an toan tu response (xu ly ca markdown code blocks)
function parseGradeJSON(text: string): Record<string, unknown> | null {
  try {
    // Strip markdown code fences: ```json ... ``` hoac ``` ... ```
    const cleaned = text
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim()

    // Tim JSON object
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (!match) {
      console.error("[parseGradeJSON] No JSON found in response:", text.slice(0, 300))
      return null
    }
    return JSON.parse(match[0])
  } catch (e) {
    console.error("[parseGradeJSON] Parse error:", e, "Raw text:", text.slice(0, 300))
    return null
  }
}

async function callDeepSeek(prompt: string, model: string): Promise<string> {
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1500,
    temperature: 0.1, // thap de output on dinh, JSON chinh xac
  })
  return response.choices[0]?.message?.content ?? ""
}

// ============================================================
// Grade Q51 / Q52 - dung DeepSeek V4 Flash
// ============================================================
export async function gradeQ51Q52(params: {
  questionType: "q51" | "q52"
  promptText: string
  blankKey: string
  studentAnswer: string
  contextHint: string
}): Promise<GradeResult> {
  const { questionType, promptText, blankKey, studentAnswer, contextHint } = params

  const prompt =
    questionType === "q51"
      ? buildQ51Prompt(promptText, blankKey, studentAnswer, contextHint)
      : buildQ52Prompt(promptText, blankKey, studentAnswer, contextHint)

  const text = await callDeepSeek(prompt, MODEL_SIMPLE)
  const data = parseGradeJSON(text)

  if (!data) {
    return defaultResult(questionType, "Khong the phan tich ket qua cham diem.")
  }

  const scores = (data.scores as Record<string, number>) || {}
  const feedback = (data.feedback as Record<string, string>) || {}
  const corrections = (data.corrections as Array<{ original: string; corrected: string; explanation: string }>) || []

  return {
    question_type: questionType,
    scores: {
      content: scores.content ?? 0,
      organization: 0,
      language: scores.language ?? 0,
      style: scores.style ?? 0,
      total: scores.total ?? 0,
    },
    max_scores: { content: 2, organization: 0, language: 2, style: 1, total: 5 },
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
// Grade Q53 - dung DeepSeek V4 Pro
// ============================================================
export async function gradeQ53(params: {
  chartDescription: string
  studentEssay: string
}): Promise<GradeResult> {
  const { chartDescription, studentEssay } = params
  const charCount = studentEssay.replace(/\n/g, "").length

  const prompt = buildQ53Prompt(chartDescription, studentEssay, charCount)
  const text = await callDeepSeek(prompt, MODEL_ADVANCED)
  const data = parseGradeJSON(text)

  if (!data) {
    return defaultResult("q53", "Khong the phan tich ket qua cham diem.")
  }

  const scores = (data.scores as Record<string, number>) || {}
  const feedback = (data.feedback as Record<string, string>) || {}
  const corrections = (data.corrections as Array<{ original: string; corrected: string; explanation: string }>) || []

  return {
    question_type: "q53",
    scores: {
      content: scores.content ?? 0,
      organization: scores.organization ?? 0,
      language: scores.language ?? 0,
      style: 0,
      total: scores.total ?? 0,
    },
    max_scores: { content: 12, organization: 9, language: 9, style: 0, total: 30 },
    feedback: {
      overall: ((data.char_count_feedback as string) ?? "") + " " + (feedback.overall ?? ""),
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
// Grade Q54 - dung DeepSeek V4 Pro
// ============================================================
export async function gradeQ54(params: {
  topic: string
  studentEssay: string
}): Promise<GradeResult> {
  const { topic, studentEssay } = params
  const charCount = studentEssay.replace(/\n/g, "").length

  const prompt = buildQ54Prompt(topic, studentEssay, charCount)
  const text = await callDeepSeek(prompt, MODEL_ADVANCED)
  const data = parseGradeJSON(text)

  if (!data) {
    return defaultResult("q54", "Khong the phan tich ket qua cham diem.")
  }

  const scores = (data.scores as Record<string, number>) || {}
  const feedback = (data.feedback as Record<string, string>) || {}
  const corrections = (data.corrections as Array<{ original: string; corrected: string; explanation: string }>) || []

  return {
    question_type: "q54",
    scores: {
      content: scores.content ?? 0,
      organization: scores.organization ?? 0,
      language: scores.language ?? 0,
      style: scores.style ?? 0,
      total: scores.total ?? 0,
    },
    max_scores: { content: 12, organization: 12, language: 14, style: 12, total: 50 },
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
// Default khi loi
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
    feedback: { overall: message, content: "", organization: "", language: "", style: "" },
    corrections: [],
  }
}
