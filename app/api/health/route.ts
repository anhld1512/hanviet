import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function GET() {
  try {
    const supabase = createAdminClient()
    // supabase-js không throw khi lỗi mạng/project paused — phải check error trả về
    const { error } = await supabase.from("user_profiles").select("id").limit(1)
    if (error) {
      return NextResponse.json({ status: "error", detail: error.message }, { status: 500 })
    }
    return NextResponse.json({ status: "ok", ts: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json({ status: "error", detail: String(e) }, { status: 500 })
  }
}
