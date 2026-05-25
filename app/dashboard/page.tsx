import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import DashboardClient from "./DashboardClient"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const [{ data: profile }, { data: recentScores }] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("id", user.id).single(),
    // Best score per question type from last 20 submissions
    supabase
      .from("submissions")
      .select("question_type, total_score, max_score")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ])

  if (!profile?.onboarding_completed) redirect("/onboarding")

  // Aggregate: best score percentage per q-type from recent submissions
  const bestScores: Record<string, { score: number; max: number }> = {}
  for (const s of recentScores ?? []) {
    const qt = s.question_type as string
    if (!bestScores[qt] || s.total_score > bestScores[qt].score) {
      bestScores[qt] = { score: s.total_score, max: s.max_score }
    }
  }

  return <DashboardClient profile={profile} user={user} bestScores={bestScores} />
}
