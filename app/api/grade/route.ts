import { NextRequest, NextResponse } from "next/server"
import { gradeQ51Q52, gradeQ53, gradeQ54 } from "@/lib/ai-grading"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { question_type } = body

    if (!question_type) {
      return NextResponse.json({ error: "Thieu question_type" }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY chua duoc cau hinh" },
        { status: 500 }
      )
    }

    switch (question_type) {
      case "q51":
      case "q52": {
        const { prompt_text, blank_key, student_answer, context_hint } = body
        if (!student_answer?.trim()) {
          return NextResponse.json({ error: "Thieu noi dung bai viet" }, { status: 400 })
        }
        const result = await gradeQ51Q52({
          questionType: question_type,
          promptText: prompt_text ?? "",
          blankKey: blank_key ?? "ㄱ",
          studentAnswer: student_answer,
          contextHint: context_hint ?? "",
        })
        return NextResponse.json(result)
      }

      case "q53": {
        const { chart_description, student_essay } = body
        if (!student_essay?.trim()) {
          return NextResponse.json({ error: "Thieu noi dung bai viet" }, { status: 400 })
        }
        const result = await gradeQ53({
          chartDescription: chart_description ?? "",
          studentEssay: student_essay,
        })
        return NextResponse.json(result)
      }

      case "q54": {
        const { topic, student_essay } = body
        if (!student_essay?.trim()) {
          return NextResponse.json({ error: "Thieu noi dung bai viet" }, { status: 400 })
        }
        const result = await gradeQ54({
          topic: topic ?? "",
          studentEssay: student_essay,
        })
        return NextResponse.json(result)
      }

      default:
        return NextResponse.json({ error: "question_type khong hop le" }, { status: 400 })
    }
  } catch (err) {
    console.error("[/api/grade]", err)
    return NextResponse.json(
      { error: "Loi may chu khi cham bai. Vui long thu lai." },
      { status: 500 }
    )
  }
}
