import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "anhld1512@gmail.com"

export async function POST(req: NextRequest) {
  try {
    // 1. Verify requesting user is admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { targetEmail, action, months } = await req.json()
    // action: "grant" | "revoke"
    // months: 3 | 6 | 12 (only used for grant)

    if (!targetEmail || !action) {
      return NextResponse.json({ error: "Missing targetEmail or action" }, { status: 400 })
    }

    // 2. Find target user by email in user_profiles
    const admin = createAdminClient()
    const { data: target, error: findErr } = await admin
      .from("user_profiles")
      .select("id, email, display_name, subscription_tier")
      .eq("email", targetEmail)
      .single()

    if (findErr || !target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (action === "grant") {
      const m = months ?? 6
      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + m)

      // Map months → plan key
      const planKey = m === 1 ? "pro1" : m === 3 ? "pro3" : m === 12 ? "pro12" : "pro6"

      await admin
        .from("user_profiles")
        .update({
          subscription_tier: "pro",
          is_pro: true,
          pro_expires_at: expiresAt.toISOString(),
          subscription_plan: planKey,
        })
        .eq("id", target.id)

      return NextResponse.json({
        success: true,
        message: `Granted Pro (${planKey}) to ${targetEmail} until ${expiresAt.toLocaleDateString("vi-VN")}`,
        expires: expiresAt.toISOString(),
        plan: planKey,
      })
    }

    if (action === "revoke") {
      await admin
        .from("user_profiles")
        .update({
          subscription_tier: "free",
          is_pro: false,
          pro_expires_at: null,
          subscription_plan: "free",
        })
        .eq("id", target.id)

      return NextResponse.json({ success: true, message: `Revoked Pro from ${targetEmail}` })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (e) {
    console.error("[admin/grant-pro]", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// GET: search users by email prefix
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const q = req.nextUrl.searchParams.get("q") ?? ""
    if (q.length < 3) return NextResponse.json({ users: [] })

    const admin = createAdminClient()
    const { data: users } = await admin
      .from("user_profiles")
      .select("id, email, display_name, subscription_tier, is_pro, pro_expires_at, total_essays_written, study_streak, created_at")
      .ilike("email", `%${q}%`)
      .order("created_at", { ascending: false })
      .limit(20)

    return NextResponse.json({ users: users ?? [] })
  } catch (e) {
    console.error("[admin/grant-pro GET]", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
