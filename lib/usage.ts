// Usage tracking for free tier gate
// Free users: 5 grading sessions / month
// Pro users: unlimited

import { createClient } from "@/lib/supabase-server"

export const FREE_LIMIT = 5

export type UsageStatus = {
  allowed: boolean
  isPro: boolean
  used: number
  remaining: number
}

export async function checkUsage(): Promise<UsageStatus> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { allowed: false, isPro: false, used: FREE_LIMIT, remaining: 0 }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("subscription_tier, is_pro, monthly_gradings, grading_month, pro_expires_at")
      .eq("id", user.id)
      .single()

    if (!profile) return { allowed: true, isPro: false, used: 0, remaining: FREE_LIMIT }

    // Check pro status
    const isPro =
      profile.subscription_tier === "pro" ||
      profile.is_pro === true ||
      (profile.pro_expires_at && new Date(profile.pro_expires_at) > new Date())

    if (isPro) return { allowed: true, isPro: true, used: 0, remaining: 999 }

    // Check monthly usage — reset if new month
    const currentMonth = new Date().toISOString().slice(0, 7) // "2025-05"
    const used = profile.grading_month === currentMonth ? (profile.monthly_gradings ?? 0) : 0
    const remaining = Math.max(0, FREE_LIMIT - used)

    return { allowed: remaining > 0, isPro: false, used, remaining }
  } catch {
    // Fail open — don't block on DB error
    return { allowed: true, isPro: false, used: 0, remaining: FREE_LIMIT }
  }
}

export async function incrementUsage(): Promise<void> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const currentMonth = new Date().toISOString().slice(0, 7)

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("monthly_gradings, grading_month, subscription_tier, is_pro")
      .eq("id", user.id)
      .single()

    if (!profile) return

    const isPro =
      profile.subscription_tier === "pro" || profile.is_pro === true
    if (isPro) return // Don't track pro usage

    const currentCount =
      profile.grading_month === currentMonth ? (profile.monthly_gradings ?? 0) : 0

    await supabase
      .from("user_profiles")
      .update({
        monthly_gradings: currentCount + 1,
        grading_month: currentMonth,
      })
      .eq("id", user.id)
  } catch {
    // Silently fail — don't block grading
  }
}
