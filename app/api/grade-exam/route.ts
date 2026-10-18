import { NextRequest, NextResponse } from "next/server"
import { gradeBlanks, gradeEssay } from "@/lib/ai-grading"
import { checkUsage, incrementUsage, FREE_LIMIT } from "@/lib/usage"

export const maxDuration = 120

/**
 * Batch grading endpoint for mock exam.
 * Grades Q51 + Q52 (two blanks each) + Q53 + Q54 in one request.
 * Counts as 1 grading use, charged only when every question was graded.
 */

type BlankQ = { prompt_text?: string; answer_a?: string; answer_b?: string; hint_a?: string; hint_b?: string; ref_a?: string; ref_b?: string }

const MAX_LEN = 4000
const s = (v: unknown) => (typeof v === "string" ? v : "")

export async function POST(req: NextRequest) {
  const usage = await checkUsage()
  if (!usage.allowed) {
    return NextResponse.json(
      {
        error: "free_limit_reached",
        message: `Bạn đã dùng hết ${FREE_LIMIT} lượt chấm miễn phí tháng này. Nâng cấp Pro để thi thử không giới hạn.`,
        used: usage.used,
        remaining: 0,
      },
      { status: 402 }
    )
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: "Máy chấm chưa được cấu hình" }, { status: 500 })
  }

  const body = await req.json().catch(() => null)
  const q51: BlankQ = body?.q51 ?? {}
  const q52: BlankQ = body?.q52 ?? {}
  const q53Task = s(body?.q53?.task) || s(body?.q53?.chart_description)
  const q54Task = s(body?.q54?.task) || s(body?.q54?.topic)
  const q53Essay = s(body?.q53?.essay)
  const q54Essay = s(body?.q54?.essay)

  for (const [label, q] of [["Q51", q51], ["Q52", q52]] as const) {
    if (!q.prompt_text || !q.answer_a || !q.answer_b) {
      return NextResponse.json({ error: `Thiếu dữ liệu ${label}` }, { status: 400 })
    }
  }
  if (!q53Task || !q53Essay) return NextResponse.json({ error: "Thiếu dữ liệu Q53" }, { status: 400 })
  if (!q54Task || !q54Essay) return NextResponse.json({ error: "Thiếu dữ liệu Q54" }, { status: 400 })

  const allTexts = [
    q51.prompt_text, q51.answer_a, q51.answer_b,
    q52.prompt_text, q52.answer_a, q52.answer_b,
    q53Task, q53Essay, q54Task, q54Essay,
  ]
  if (allTexts.some((t) => s(t).length > MAX_LEN)) {
    return NextResponse.json({ error: "Nội dung vượt quá độ dài cho phép" }, { status: 400 })
  }

  const blanksOf = (q: BlankQ) => [
    { key: "ㄱ", answer: s(q.answer_a), hint: s(q.hint_a), reference: s(q.ref_a) },
    { key: "ㄴ", answer: s(q.answer_b), hint: s(q.hint_b), reference: s(q.ref_b) },
  ]

  try {
    const [[r51A, r51B], [r52A, r52B], r53, r54] = await Promise.all([
      gradeBlanks({ questionType: "q51", passage: s(q51.prompt_text), blanks: blanksOf(q51) }),
      gradeBlanks({ questionType: "q52", passage: s(q52.prompt_text), blanks: blanksOf(q52) }),
      gradeEssay({ questionType: "q53", task: q53Task, essay: q53Essay }),
      gradeEssay({ questionType: "q54", task: q54Task, essay: q54Essay }),
    ])

    await incrementUsage()

    return NextResponse.json({ r51A, r51B, r52A, r52B, r53, r54 })
  } catch (err) {
    console.error("[/api/grade-exam]", err)
    return NextResponse.json(
      { error: "Máy chấm đang bận, vui lòng nộp lại. Lượt chấm của bạn chưa bị trừ." },
      { status: 502 }
    )
  }
}
