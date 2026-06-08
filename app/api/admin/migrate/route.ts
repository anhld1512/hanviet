// One-time migration endpoint — add subscription_plan column
// Only callable by admin. Delete this file after running.
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "anhld1512@gmail.com"

export async function POST() {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const admin = createAdminClient()

  // Step 1: Check if column already exists
  const { data: cols } = await admin
    .from("user_profiles")
    .select("subscription_plan")
    .limit(1)

  if (cols !== null) {
    // Column exists — just backfill pro users
    const { error: fillErr, count } = await admin
      .from("user_profiles")
      .update({ subscription_plan: "pro6" })
      .or("subscription_tier.eq.pro,is_pro.eq.true")
      .or("subscription_plan.is.null,subscription_plan.eq.free")

    return NextResponse.json({
      ok: true,
      message: "Column already exists. Backfilled pro6 for existing Pro users.",
      updated: count,
      fillErr: fillErr?.message ?? null,
    })
  }

  return NextResponse.json({
    ok: false,
    message: "Column does not exist yet. Please add it via Supabase dashboard SQL editor:\n\nALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';\n\nThen call this endpoint again to backfill.",
  })
}
