import { NextRequest, NextResponse } from "next/server"
import { gradeBlanks, gradeEssay, GradingError } from "@/lib/ai-grading"
import type { BlankInput } from "@/lib/grading-prompts"
import { checkUsage, incrementUsage, FREE_LIMIT } from "@/lib/usage"

export const maxDuration = 60

const MAX_BLANK_LEN = 300
const MAX_ESSAY_LEN = 2000
const MAX_TASK_LEN = 4000

const text = (v: unknown) => (typeof v === "string" ? v : "")

function readBlanks(body: Record<string, unknown>): BlankInput[] {
  if (Array.isArray(body.blanks)) {
    return (body.blanks as Record<string, unknown>[]).slice(0, 2).map((b) => ({
      key: text(b.key) || "ㄱ",
      answer: text(b.answer),
      hint: text(b.hint),
      reference: text(b.reference),
    }))
  }
  // Single-blank shape from clients loaded before rubric v2
  return [{ key: text(body.blank_key) || "ㄱ", answer: text(body.student_answer), hint: text(body.context_hint) }]
}

export async function POST(req: NextRequest) {
  const usage = await checkUsage()
  if (!usage.allowed) {
    return NextResponse.json(
      {
        error: "free_limit_reached",
        message: `Bạn đã dùng hết ${FREE_LIMIT} lượt chấm miễn phí tháng này. Nâng cấp Pro để luyện không giới hạn.`,
        used: usage.used,
        remaining: 0,
      },
      { status: 402 }
    )
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "Máy chấm chưa được cấu hình" }, { status: 500 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ" }, { status: 400 })
  }
  const questionType = body.question_type

  try {
    if (questionType === "q51" || questionType === "q52") {
      const passage = text(body.prompt_text)
      const blanks = readBlanks(body)
      if (!passage || blanks.some((b) => !b.answer.trim())) {
        return NextResponse.json({ error: "Thiếu đề bài hoặc câu trả lời" }, { status: 400 })
      }
      if (passage.length > MAX_TASK_LEN || blanks.some((b) => b.answer.length > MAX_BLANK_LEN)) {
        return NextResponse.json({ error: "Câu trả lời vượt quá độ dài cho phép" }, { status: 400 })
      }
      const results = await gradeBlanks({ questionType, passage, blanks })
      await incrementUsage()
      return NextResponse.json(Array.isArray(body.blanks) ? { results } : results[0])
    }

    if (questionType === "q53" || questionType === "q54") {
      const task = text(body.task) || text(questionType === "q53" ? body.chart_description : body.topic)
      const essay = text(body.student_essay)
      if (!task || !essay.trim()) {
        return NextResponse.json({ error: "Thiếu đề bài hoặc bài viết" }, { status: 400 })
      }
      if (task.length > MAX_TASK_LEN || essay.length > MAX_ESSAY_LEN) {
        return NextResponse.json({ error: "Bài viết vượt quá độ dài cho phép" }, { status: 400 })
      }
      const result = await gradeEssay({ questionType, task, essay })
      await incrementUsage()
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Loại câu hỏi không hợp lệ" }, { status: 400 })
  } catch (err) {
    console.error("[/api/grade]", err)
    const message = err instanceof GradingError
      ? "Máy chấm đang bận, vui lòng thử lại. Lượt chấm của bạn chưa bị trừ."
      : "Lỗi máy chủ, vui lòng thử lại. Lượt chấm của bạn chưa bị trừ."
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
