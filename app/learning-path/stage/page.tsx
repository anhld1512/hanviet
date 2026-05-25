import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { getStages, getCurrentStageIdx } from "@/lib/learning-path-data"
import StageClient from "./StageClient"

export default async function StagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("learning_path, total_essays_written")
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/onboarding")

  // Lay diem trung binh theo loai cau
  const { data: submissions } = await supabase
    .from("submissions")
    .select("question_type, total_score, max_score")
    .eq("user_id", user.id)

  const scoreByType: Record<string, { totalPct: number; count: number }> = {}
  for (const s of submissions ?? []) {
    if (!scoreByType[s.question_type]) scoreByType[s.question_type] = { totalPct: 0, count: 0 }
    scoreByType[s.question_type].totalPct += s.max_score > 0 ? s.total_score / s.max_score : 0
    scoreByType[s.question_type].count++
  }
  const avgPct: Record<string, number> = {}
  for (const [qt, val] of Object.entries(scoreByType)) {
    avgPct[qt] = val.count > 0 ? Math.round((val.totalPct / val.count) * 100) : 0
  }

  // Dem so bai theo loai
  const countByType: Record<string, number> = {}
  for (const s of submissions ?? []) {
    countByType[s.question_type] = (countByType[s.question_type] ?? 0) + 1
  }

  const stages = getStages(profile.learning_path)
  const currentIdx = getCurrentStageIdx(stages, profile.total_essays_written, avgPct)
  const stage = stages[currentIdx]

  return (
    <StageClient
      stage={stage}
      stageIdx={currentIdx}
      totalStages={stages.length}
      learningPath={profile.learning_path}
      essayCount={profile.total_essays_written}
      avgPct={avgPct}
      countByType={countByType}
    />
  )
}
