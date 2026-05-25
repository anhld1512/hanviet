import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { getRandomPrompt } from "@/lib/data/prompts"
import ExamClient from "./ExamClient"

export default async function MockExamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("subscription_tier, is_pro, display_name, monthly_gradings, grading_month")
    .eq("id", user.id)
    .single()

  const isPro = profile?.subscription_tier === "pro" || profile?.is_pro === true
  const currentMonth = new Date().toISOString().slice(0, 7)
  const usedThisMonth =
    profile?.grading_month === currentMonth ? (profile?.monthly_gradings ?? 0) : 0

  // Pre-select one random prompt per question type
  const prompts = {
    q51: getRandomPrompt("q51"),
    q52: getRandomPrompt("q52"),
    q53: getRandomPrompt("q53"),
    q54: getRandomPrompt("q54"),
  }

  return (
    <ExamClient
      prompts={prompts}
      isPro={isPro}
      usedThisMonth={usedThisMonth}
      displayName={profile?.display_name ?? "bạn"}
    />
  )
}
