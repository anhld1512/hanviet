import { NextRequest, NextResponse } from "next/server"
import { gradeQ51Q52, gradeQ53, gradeQ54 } from "@/lib/ai-grading"
import { checkUsage, incrementUsage } from "@/lib/usage"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    // ── Usage gate ──────────────────────────────────────────
    const usage = await checkUsage()
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: "free_limit_reached",
          message: `Bạn đã dùng hết ${5} lượt chấm miễn phí tháng này. Nâng cấp Pro để luyện không giới hạn.`,
          used: usage.used,
          remaining: 0,
        },
        { status: 402 }
      )
    }
    // ────────────────────────────────────────────────────────

    const body = await req.json()
    const { question_type } = body

    if (!question_type) {
      return NextResponse.json({ error: "Thieu question_type" }, { status: 400 })
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: "DEEPSEEK_API_KEY chưa được cấu hình. Thêm vào file .env.local" },
        { status: 500 }
      )
    }

    let result
    switch (question_type) {
      case "q51":
      case "q52": {
        const { prompt_text, blank_key, student_answer, context_hint } = body
        if (!student_answer?.trim()) {
          return NextResponse.json({ error: "Thiếu nội dung bài viết" }, { status: 400 })
        }
        result = await gradeQ51Q52({
          questionType: question_type,
          promptText: prompt_text ?? "",
          blankKey: blank_key ?? "ㄱ",
          studentAnswer: student_answer,
          contextHint: context_hint ?? "",
        })
        break
      }
      case "q53": {
        const { chart_description, student_essay } = body
        if (!student_essay?.trim()) {
          return NextResponse.json({ error: "Thiếu nội dung bài viết" }, { status: 400 })
        }
        result = await gradeQ53({
          chartDescription: chart_description ?? "",
          studentEssay: student_essay,
        })
        break
      }
      case "q54": {
        const { topic, student_essay } = body
        if (!student_essay?.trim()) {
          return NextResponse.json({ error: "Thiếu nội dung bài viết" }, { status: 400 })
        }
        result = await gradeQ54({
          topic: topic ?? "",
          studentEssay: student_essay,
        })
        break
      }
      default:
        return NextResponse.json({ error: "question_type khong hop le" }, { status: 400 })
    }

    // ── Increment usage after successful grading ─────────────
    // Fire-and-forget, don't await
    incrementUsage().catch(() => {})
    // ────────────────────────────────────────────────────────

    return NextResponse.json(result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("[/api/grade] ERROR:", msg)
    return NextResponse.json({ error: `Loi: ${msg}` }, { status: 500 })
  }
}
