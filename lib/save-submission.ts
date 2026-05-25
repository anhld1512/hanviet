import { createClient } from "@/lib/supabase-client"
import type { GradeResult } from "@/lib/grading-prompts"

const MAX_SCORE: Record<string, number> = {
  q51: 10, q52: 10, q53: 30, q54: 50, mock_exam: 100,
}

export async function saveSubmission(params: {
  questionType: "q51" | "q52" | "q53" | "q54" | "mock_exam"
  promptId?: number       // for linking best score per prompt (pass -1 for AI-generated prompts)
  userAnswer: string
  gradeResult: GradeResult
  timeSpentSeconds?: number
}): Promise<void> {
  const { questionType, promptId, userAnswer, gradeResult, timeSpentSeconds } = params

  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Insert submission — DB trigger (submissions_count) automatically handles:
    //   • total_essays_written + 1
    //   • study_streak (extend / reset / no-change)
    //   • last_study_date = CURRENT_DATE
    await supabase.from("submissions").insert({
      user_id: user.id,
      question_type: questionType,
      prompt_id: (promptId && promptId !== -1) ? promptId : null,
      user_answer: userAnswer,
      character_count: userAnswer.replace(/\n/g, "").length,
      time_spent_seconds: timeSpentSeconds ?? null,
      total_score: gradeResult.scores.total,
      max_score: MAX_SCORE[questionType] ?? 100,
      criteria_scores: gradeResult.scores,
      errors: gradeResult.corrections,
      overall_feedback_vi: gradeResult.feedback.overall,
    })
  } catch (e) {
    // Silent — submission errors must not block UX
    console.warn("[saveSubmission] failed:", e)
  }
}
