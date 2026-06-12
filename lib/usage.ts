// Usage tracking for free tier gate
// Priority: Pro (unlimited) > Bonus gradings > Free 5/month
// Separate counters: monthly_gradings (chấm bài) | monthly_prompts (tạo đề AI)

import { createClient } from "@/lib/supabase-server"

export const FREE_LIMIT = 5
export const FREE_PROMPT_LIMIT = 5

export type UsageStatus = {
  allowed: boolean
  isPro: boolean
  used: number        // monthly used (non-pro)
  remaining: number   // monthly remaining
  bonus: number       // bonus gradings from vouchers
}

export type PromptUsageStatus = {
  allowed: boolean
  isPro: boolean
  used: number
  remaining: number
}

export async function checkUsage(): Promise<UsageStatus> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { allowed: false, isPro: false, used: FREE_LIMIT, remaining: 0, bonus: 0 }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("subscription_tier, is_pro, monthly_gradings, grading_month, pro_expires_at, bonus_gradings")
      .eq("id", user.id)
      .single()

    // Không có profile → user mới, coi như chưa dùng lần nào (FREE_LIMIT lượt)
    // incrementUsage sẽ upsert row khi chấm lần đầu
    if (!profile) return { allowed: true, isPro: false, used: 0, remaining: FREE_LIMIT, bonus: 0 }

    // Pro: unlimited
    const isPro =
      profile.subscription_tier === "pro" ||
      profile.is_pro === true ||
      (profile.pro_expires_at && new Date(profile.pro_expires_at) > new Date())

    if (isPro) return { allowed: true, isPro: true, used: 0, remaining: 999, bonus: 0 }

    const bonus = profile.bonus_gradings ?? 0

    // Bonus gradings: use first before monthly free
    if (bonus > 0) {
      return { allowed: true, isPro: false, used: 0, remaining: 0, bonus }
    }

    // Monthly free limit
    const currentMonth = new Date().toISOString().slice(0, 7)
    const used = profile.grading_month === currentMonth ? (profile.monthly_gradings ?? 0) : 0
    const remaining = Math.max(0, FREE_LIMIT - used)

    return { allowed: remaining > 0, isPro: false, used, remaining, bonus: 0 }
  } catch {
    return { allowed: true, isPro: false, used: 0, remaining: FREE_LIMIT, bonus: 0 }
  }
}

export async function incrementUsage(): Promise<void> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("monthly_gradings, grading_month, subscription_tier, is_pro, pro_expires_at, bonus_gradings")
      .eq("id", user.id)
      .single()

    const currentMonth = new Date().toISOString().slice(0, 7)

    // Không có profile → upsert row mới (user mới chưa có profile)
    if (!profile) {
      await supabase
        .from("user_profiles")
        .upsert({ id: user.id, monthly_gradings: 1, grading_month: currentMonth })
      return
    }

    const isPro =
      profile.subscription_tier === "pro" ||
      profile.is_pro === true ||
      (profile.pro_expires_at && new Date(profile.pro_expires_at) > new Date())
    if (isPro) return

    // Deduct bonus first
    const bonus = profile.bonus_gradings ?? 0
    if (bonus > 0) {
      await supabase
        .from("user_profiles")
        .update({ bonus_gradings: bonus - 1 })
        .eq("id", user.id)
      return
    }

    // Deduct from monthly
    const currentCount =
      profile.grading_month === currentMonth ? (profile.monthly_gradings ?? 0) : 0

    await supabase
      .from("user_profiles")
      .update({ monthly_gradings: currentCount + 1, grading_month: currentMonth })
      .eq("id", user.id)
  } catch {
    // Silently fail
  }
}

// ── Prompt usage (tạo đề AI) ─────────────────────────────────────────────────

export async function checkPromptUsage(): Promise<PromptUsageStatus> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { allowed: false, isPro: false, used: FREE_PROMPT_LIMIT, remaining: 0 }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("subscription_tier, is_pro, pro_expires_at, monthly_prompts, prompt_month")
      .eq("id", user.id)
      .single()

    if (!profile) return { allowed: true, isPro: false, used: 0, remaining: FREE_PROMPT_LIMIT }

    const isPro =
      profile.subscription_tier === "pro" ||
      profile.is_pro === true ||
      (profile.pro_expires_at && new Date(profile.pro_expires_at) > new Date())

    if (isPro) return { allowed: true, isPro: true, used: 0, remaining: 999 }

    const currentMonth = new Date().toISOString().slice(0, 7)
    const used = profile.prompt_month === currentMonth ? (profile.monthly_prompts ?? 0) : 0
    const remaining = Math.max(0, FREE_PROMPT_LIMIT - used)

    return { allowed: remaining > 0, isPro: false, used, remaining }
  } catch {
    return { allowed: true, isPro: false, used: 0, remaining: FREE_PROMPT_LIMIT }
  }
}

export async function incrementPromptUsage(): Promise<void> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("monthly_prompts, prompt_month, subscription_tier, is_pro, pro_expires_at")
      .eq("id", user.id)
      .single()

    const currentMonth = new Date().toISOString().slice(0, 7)

    if (!profile) {
      await supabase
        .from("user_profiles")
        .upsert({ id: user.id, monthly_prompts: 1, prompt_month: currentMonth })
      return
    }

    const isPro =
      profile.subscription_tier === "pro" ||
      profile.is_pro === true ||
      (profile.pro_expires_at && new Date(profile.pro_expires_at) > new Date())
    if (isPro) return

    const currentCount =
      profile.prompt_month === currentMonth ? (profile.monthly_prompts ?? 0) : 0

    await supabase
      .from("user_profiles")
      .update({ monthly_prompts: currentCount + 1, prompt_month: currentMonth })
      .eq("id", user.id)
  } catch {
    // Silently fail
  }
}
