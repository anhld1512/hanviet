import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import AdminClient from "./AdminClient"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "anhld1512@gmail.com"

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) redirect("/practice")

  // Stats tổng quan
  const admin = (await import("@/lib/supabase-admin")).createAdminClient()
  const [{ count: totalUsers }, { count: proUsers }, { count: totalSubs }] = await Promise.all([
    admin.from("user_profiles").select("*", { count: "exact", head: true }),
    admin.from("user_profiles").select("*", { count: "exact", head: true }).eq("subscription_tier", "pro"),
    admin.from("submissions").select("*", { count: "exact", head: true }),
  ])

  // 10 users mới nhất
  const { data: recentUsers } = await admin
    .from("user_profiles")
    .select("id, email, display_name, subscription_tier, is_pro, pro_expires_at, total_essays_written, study_streak, created_at")
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <AdminClient
      stats={{ totalUsers: totalUsers ?? 0, proUsers: proUsers ?? 0, totalSubs: totalSubs ?? 0 }}
      recentUsers={recentUsers ?? []}
    />
  )
}
