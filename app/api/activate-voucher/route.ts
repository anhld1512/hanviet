import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 })

    const { code } = await req.json()
    if (!code?.trim()) return NextResponse.json({ error: "Vui lòng nhập mã voucher" }, { status: 400 })

    const normalizedCode = String(code).trim().toUpperCase()
    const admin = createAdminClient()

    // 1. Lấy thông tin voucher
    const { data: voucher, error: vErr } = await admin
      .from("vouchers")
      .select("code, bonus_gradings, max_uses, used_count, expires_at")
      .eq("code", normalizedCode)
      .single()

    if (vErr || !voucher) {
      return NextResponse.json({ error: "Mã voucher không hợp lệ" }, { status: 404 })
    }

    // 2. Kiểm tra hết hạn
    if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
      return NextResponse.json({ error: "Mã voucher đã hết hạn" }, { status: 400 })
    }

    // 3. Kiểm tra còn slot
    if (voucher.used_count >= voucher.max_uses) {
      return NextResponse.json({ error: "Mã voucher đã hết slot (${voucher.max_uses}/${voucher.max_uses})" }, { status: 400 })
    }

    // 4. Kiểm tra user đã dùng code này chưa
    const { data: existing } = await admin
      .from("voucher_redemptions")
      .select("id")
      .eq("voucher_code", normalizedCode)
      .eq("user_id", user.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: "Bạn đã dùng mã voucher này rồi" }, { status: 409 })
    }

    // 5. Cộng bonus vào user_profiles
    const { data: profile } = await admin
      .from("user_profiles")
      .select("bonus_gradings")
      .eq("id", user.id)
      .single()

    const currentBonus = profile?.bonus_gradings ?? 0

    await admin
      .from("user_profiles")
      .update({ bonus_gradings: currentBonus + voucher.bonus_gradings })
      .eq("id", user.id)

    // 6. Tăng used_count + ghi redemption
    await admin
      .from("vouchers")
      .update({ used_count: voucher.used_count + 1 })
      .eq("code", normalizedCode)

    await admin
      .from("voucher_redemptions")
      .insert({ voucher_code: normalizedCode, user_id: user.id })

    const slotsLeft = voucher.max_uses - voucher.used_count - 1

    return NextResponse.json({
      success: true,
      bonus: voucher.bonus_gradings,
      totalBonus: currentBonus + voucher.bonus_gradings,
      slotsLeft,
      message: `Kích hoạt thành công! +${voucher.bonus_gradings} lượt chấm đã được cộng vào tài khoản.`,
    })
  } catch (e) {
    console.error("[activate-voucher]", e)
    return NextResponse.json({ error: "Lỗi server, thử lại sau" }, { status: 500 })
  }
}
