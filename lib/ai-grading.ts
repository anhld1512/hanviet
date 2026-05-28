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
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://hanviet.app",
    "X-Title": "HanViet Writing Coach",
  },
})

// V4 Flash: reasoning model, 13B active params, nhanh + re hon V3
// Fix content:null: bo response_format json_object (ko tuong thich voi reasoning models)
// Parser da xu ly output tu do (strip markdown, bracket-count JSON)
const MODEL_SIMPLE = "deepseek/deepseek-v4-flash"
const MODEL_ADVANCED = "deepseek/deepseek-v4-flash"

// Parse JSON an toan tu response (xu ly ca markdown code blocks)
function parseGradeJSON(text: string): Record<string, unknown> | null {
  try {
    // Strip markdown code fences
    const cleaned = text
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim()

    // Thu parse toan bo truoc
    try {
      return JSON.parse(cleaned)
    } catch {}

    // Tim JSON object lon nhat bang cach dem ngoac mo/dong
    let start = cleaned.indexOf("{")
    if (start === -1) {
      console.error("[parseGradeJSON] No JSON found:", text.slice(0, 200))
      return null
    }
    let depth = 0
    let end = -1
    for (let i = start; i < cleaned.length; i++) {
      if (cleaned[i] === "{") depth++
      else if (cleaned[i] === "}") {
        depth--
        if (depth === 0) { end = i; break }
      }
    }
    if (end === -1) {
      console.error("[parseGradeJSON] Unclosed JSON:", cleaned.slice(0, 200))
      return null
    }
    return JSON.parse(cleaned.slice(start, end + 1))
  } catch (e) {
    console.error("[parseGradeJSON] Parse error:", e, "Raw:", text.slice(0, 200))
    return null
  }
}

async function callDeepSeek(prompt: string, model: string, maxTokens = 1000): Promise<string> {
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.1,
    // Khong dung response_format json_object — reasoning models tra content:null voi param nay
    // Parser xu ly output tu do (strip markdown, bracket-count JSON)
  })
  const msg = response.choices[0]?.message
  // Fallback sang reasoning_content neu content null (reasoning model edge case)
  const text = msg?.content ?? (msg as unknown as Record<string, string>)?.reasoning_content ?? ""
  console.log("[DeepSeek RAW]", model, text.slice(0, 300))
  return text
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

  const text = await callDeepSeek(prompt, MODEL_SIMPLE, 1500)
  const data = parseGradeJSON(text)

  if (!data) {
    return defaultResult(questionType, text || "Không thể phân tích kết quả chấm điểm.")
  }

  const scores = (data.scores as Record<string, number>) || {}
  const feedback = (data.feedback as Record<string, string>) || {}
  const corrections = (data.corrections as GradeResult["corrections"]) || []
  const coachingRaw = data.coaching as Record<string, string> | undefined

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
    coaching: coachingRaw ? {
      strength: coachingRaw.strength ?? "",
      weakness: coachingRaw.weakness ?? "",
      focus_pattern: coachingRaw.focus_pattern ?? "",
      level_tip: coachingRaw.level_tip ?? "",
    } : undefined,
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
  const text = await callDeepSeek(prompt, MODEL_ADVANCED, 2000)
  const data = parseGradeJSON(text)

  if (!data) {
    return defaultResult("q53", "Không thể phân tích kết quả chấm điểm.")
  }

  const scores = (data.scores as Record<string, number>) || {}
  const feedback = (data.feedback as Record<string, string>) || {}
  const corrections = (data.corrections as GradeResult["corrections"]) || []
  const coachingRaw = data.coaching as Record<string, string> | undefined

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
      overall: feedback.overall ?? "",
      content: feedback.content ?? "",
      organization: feedback.organization ?? "",
      language: feedback.language ?? "",
      style: "",
    },
    corrections,
    coaching: coachingRaw ? {
      strength: coachingRaw.strength ?? "",
      weakness: coachingRaw.weakness ?? "",
      focus_pattern: coachingRaw.focus_pattern ?? "",
      level_tip: coachingRaw.level_tip ?? "",
    } : undefined,
    char_count_feedback: (data.char_count_feedback as string) ?? undefined,
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
  const text = await callDeepSeek(prompt, MODEL_ADVANCED, 2000)
  const data = parseGradeJSON(text)

  if (!data) {
    return defaultResult("q54", "Không thể phân tích kết quả chấm điểm.")
  }

  const scores = (data.scores as Record<string, number>) || {}
  const feedback = (data.feedback as Record<string, string>) || {}
  const corrections = (data.corrections as GradeResult["corrections"]) || []
  const coachingRaw = data.coaching as Record<string, string> | undefined

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
    coaching: coachingRaw ? {
      strength: coachingRaw.strength ?? "",
      weakness: coachingRaw.weakness ?? "",
      focus_pattern: coachingRaw.focus_pattern ?? "",
      level_tip: coachingRaw.level_tip ?? "",
    } : undefined,
    char_count_feedback: (data.char_count_feedback as string) ?? undefined,
    thesis_feedback: (data.thesis_feedback as string) ?? undefined,
    better_opening: (data.better_opening as string) ?? undefined,
    better_example: (data.better_example as string) ?? undefined,
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
