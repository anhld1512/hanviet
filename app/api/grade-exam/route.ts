import { NextRequest, NextResponse } from "next/server"
import { gradeQ51Q52, gradeQ53, gradeQ54 } from "@/lib/ai-grading"
import { checkUsage, incrementUsage } from "@/lib/usage"

export const maxDuration = 120

/**
 * Batch grading endpoint for mock exam.
 * Grades all 6 answers (Q51×2 + Q52×2 + Q53 + Q54) in one request.
 * Counts as 1 grading use instead of 6.
 */
export async function POST(req: NextRequest) {
  try {
    // ── Usage gate — checked once for the whole exam ──────────
    const usage = await checkUsage()
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: "free_limit_reached",
          message: `Bạn đã dùng hết ${5} lượt chấm miễn phí tháng này. Nâng cấp Pro để thi thử không giới hạn.`,
          used: usage.used,
          remaining: 0,
        },
        { status: 402 }
      )
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: "DEEPSEEK_API_KEY chưa được cấu hình" }, { status: 500 })
    }

    const body = await req.json()
    const { q51, q52, q53, q54 } = body

    // Validate required fields
    if (!q51?.prompt_text || !q51?.answer_a || !q51?.answer_b) {
      return NextResponse.json({ error: "Thiếu dữ liệu Q51" }, { status: 400 })
    }
    if (!q52?.prompt_text || !q52?.answer_a || !q52?.answer_b) {
      return NextResponse.json({ error: "Thiếu dữ liệu Q52" }, { status: 400 })
    }
    if (!q53?.chart_description || !q53?.essay) {
      return NextResponse.json({ error: "Thiếu dữ liệu Q53" }, { status: 400 })
    }
    if (!q54?.topic || !q54?.essay) {
      return NextResponse.json({ error: "Thiếu dữ liệu Q54" }, { status: 400 })
    }

    // ── Grade all 6 in parallel ───────────────────────────────
    const [r51A, r51B, r52A, r52B, r53, r54] = await Promise.all([
      gradeQ51Q52({
        questionType: "q51",
        promptText: q51.prompt_text,
        blankKey: "ㄱ",
        studentAnswer: q51.answer_a,
        contextHint: q51.hint_a ?? "",
      }),
      gradeQ51Q52({
        questionType: "q51",
        promptText: q51.prompt_text,
        blankKey: "ㄴ",
        studentAnswer: q51.answer_b,
        contextHint: q51.hint_b ?? "",
      }),
      gradeQ51Q52({
        questionType: "q52",
        promptText: q52.prompt_text,
        blankKey: "ㄱ",
        studentAnswer: q52.answer_a,
        contextHint: q52.hint_a ?? "",
      }),
      gradeQ51Q52({
        questionType: "q52",
        promptText: q52.prompt_text,
        blankKey: "ㄴ",
        studentAnswer: q52.answer_b,
        contextHint: q52.hint_b ?? "",
      }),
      gradeQ53({
        chartDescription: q53.chart_description,
        studentEssay: q53.essay,
      }),
      gradeQ54({
        topic: q54.topic,
        studentEssay: q54.essay,
      }),
    ])

    // ── Increment usage ONCE for the entire exam ──────────────
    incrementUsage().catch(() => {})

    return NextResponse.json({ r51A, r51B, r52A, r52B, r53, r54 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("[/api/grade-exam] ERROR:", msg)
    return NextResponse.json({ error: `Lỗi: ${msg}` }, { status: 500 })
  }
}
