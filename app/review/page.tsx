import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { getUser } from "@/lib/auth-cache"
import ReviewClient from "./ReviewClient"

export default async function ReviewPage() {
  const user = await getUser()
  if (!user) redirect("/login")
  const supabase = await createClient()

  // Lay 30 bai nop gan nhat
  const { data: submissions } = await supabase
    .from("submissions")
    .select("id, question_type, total_score, max_score, criteria_scores, errors, overall_feedback_vi, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30)

  return <ReviewClient submissions={submissions ?? []} />
}
