import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

// ── Plan definitions ───────────────────────────────────────────────────────
const PLANS = [
  {
    key: "pro1",
    name: "Pro 1 tháng",
    price: "149.000",
    unit: "₫ / tháng",
    perMonth: null,
    savingPct: null,
    desc: "Thử trước khi cam kết lâu dài",
    highlight: false,
    features: [
      "Chấm bài không giới hạn",
      "Luyện Q51 · Q52 · Q53 · Q54",
      "Thi thử full 50 phút · đề ngẫu nhiên",
      "Phân tích điểm yếu cá nhân",
      "Toàn bộ đề thi mới nhất (TOPIK 106)",
    ],
    bankAmount: 149000,
    bankNote: "HANVIET PRO1",
  },
  {
    key: "pro3",
    name: "Pro 3 tháng",
    price: "349.000",
    unit: "₫ / 3 tháng",
    perMonth: "~116k/tháng",
    savingPct: "Tiết kiệm 22%",
    desc: "Đủ 1 chu kỳ ôn luyện trước kỳ thi",
    highlight: false,
    features: [
      "Chấm bài không giới hạn",
      "Luyện Q51 · Q52 · Q53 · Q54",
      "Thi thử full 50 phút · đề ngẫu nhiên",
      "Phân tích điểm yếu cá nhân",
      "Toàn bộ đề thi mới nhất (TOPIK 106)",
    ],
    bankAmount: 349000,
    bankNote: "HANVIET PRO3",
  },
  {
    key: "pro6",
    name: "Pro 6 tháng",
    price: "599.000",
    unit: "₫ / 6 tháng",
    perMonth: "~100k/tháng",
    savingPct: "Tiết kiệm 33%",
    desc: "Phổ biến nhất — học từ căn bản đến thi thật",
    highlight: true,
    features: [
      "Chấm bài không giới hạn",
      "Luyện Q51 · Q52 · Q53 · Q54",
      "Thi thử full 50 phút · đề ngẫu nhiên",
      "Phân tích điểm yếu cá nhân",
      "Toàn bộ đề thi mới nhất (TOPIK 106)",
      "Ưu tiên cập nhật đề mới",
    ],
    bankAmount: 599000,
    bankNote: "HANVIET PRO6",
  },
  {
    key: "pro12",
    name: "Pro 12 tháng",
    price: "999.000",
    unit: "₫ / năm",
    perMonth: "~83k/tháng",
    savingPct: "Tiết kiệm 44%",
    desc: "Dành cho người học nghiêm túc dài hạn",
    highlight: false,
    features: [
      "Chấm bài không giới hạn",
      "Luyện Q51 · Q52 · Q53 · Q54",
      "Thi thử full 50 phút · đề ngẫu nhiên",
      "Phân tích điểm yếu cá nhân",
      "Toàn bộ đề thi mới nhất (TOPIK 106)",
      "Ưu tiên cập nhật đề mới",
      "Hỗ trợ qua Zalo ưu tiên",
    ],
    bankAmount: 999000,
    bankNote: "HANVIET PRO12",
  },
]

const FAQ = [
  {
    q: "Đăng ký Pro bằng cách nào?",
    a: "Nhắn tin qua Fanpage Facebook ToPeak, ghi rõ gói muốn đăng ký và email tài khoản. Admin sẽ liên hệ hướng dẫn thanh toán và kích hoạt trong 2–4 giờ.",
  },
  {
    q: "Có thể dùng thử trước khi mua không?",
    a: "Có — gói Free cho phép 5 lượt chấm AI mỗi tháng, đủ để trải nghiệm toàn bộ tính năng cơ bản trước khi quyết định.",
  },
  {
    q: "Sau khi liên hệ bao lâu thì được kích hoạt?",
    a: "Trong vòng 2–4 giờ trong giờ hành chính (8:00–18:00 các ngày trong tuần). Ngoài giờ hành chính sẽ được xử lý vào sáng hôm sau.",
  },
  {
    q: "Gói Pro hết hạn thì dữ liệu có mất không?",
    a: "Không — toàn bộ lịch sử bài làm và phân tích điểm yếu được giữ nguyên. Bạn chỉ mất quyền truy cập tính năng Pro.",
  },
  {
    q: "Có hoàn tiền không?",
    a: "Nếu chưa sử dụng lượt chấm nào sau khi kích hoạt, liên hệ qua Fanpage để được hỗ trợ hoàn tiền trong vòng 24 giờ.",
  },
]

// ── Page ──────────────────────────────────────────────────────────────────
export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // select("*") so the page doesn't break if subscription_plan column hasn't been migrated yet
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const isPro =
    profile?.subscription_tier === "pro" ||
    profile?.is_pro === true ||
    (profile?.pro_expires_at && new Date(profile.pro_expires_at) > new Date())

  // Which plan is the user currently on? Falls back to 'pro6' for legacy users
  const activePlan: string = isPro ? (profile?.subscription_plan ?? "pro6") : "free"

  // Expiry label
  const expiresLabel = profile?.pro_expires_at
    ? `Hết hạn ${new Date(profile.pro_expires_at).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}`
    : null

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <Link href="/practice" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
          ← Luyện viết
        </Link>
        <div className="w-px h-4 bg-gray-200" />
        <span className="font-bold text-[#1D1D1F]">Nâng cấp Pro</span>
        {isPro && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full border border-blue-100">
              ⚡ Pro đang kích hoạt
            </span>
            {expiresLabel && (
              <span className="text-xs text-gray-400">{expiresLabel}</span>
            )}
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-[#1D1D1F] mb-3 tracking-tight">
            Luyện viết TOPIK không giới hạn
          </h1>
          <p className="text-[#6E6E73] text-lg max-w-xl mx-auto">
            Công cụ luyện viết TOPIK II duy nhất cho người Việt — AI chấm điểm theo rubric của Viện Giáo dục Quốc tế Hàn Quốc (NIIED),
            giải thích bằng tiếng Việt.
          </p>
          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-[#6E6E73]">
            <span>✓ AI chấm theo rubric chính thức của Viện Giáo dục Quốc tế Hàn Quốc (NIIED)</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>✓ Phản hồi bằng tiếng Việt</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>✓ Cập nhật TOPIK 106</span>
          </div>
        </div>

        {/* Pricing cards — 4 col */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {PLANS.map((plan) => {
            const isActive = activePlan === plan.key
            const isHighlight = plan.highlight

            return (
              <div
                key={plan.key}
                className={`rounded-2xl border p-5 flex flex-col relative transition-all ${
                  isHighlight
                    ? "border-[#0066CC] bg-[#0066CC] text-white shadow-xl"
                    : isActive
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] font-bold bg-white text-[#0066CC] rounded-full px-3 py-1 shadow-sm whitespace-nowrap">
                      PHỔ BIẾN NHẤT
                    </span>
                  </div>
                )}
                {isActive && !isHighlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] font-bold bg-[#0066CC] text-white rounded-full px-3 py-1 shadow-sm whitespace-nowrap">
                      GÓI CỦA BẠN
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <div className={`text-xs font-semibold mb-1 ${isHighlight ? "text-blue-200" : "text-[#6E6E73]"}`}>
                  {plan.name}
                </div>

                {/* Price */}
                <div className={`text-2xl font-extrabold leading-tight ${isHighlight ? "text-white" : "text-[#1D1D1F]"}`}>
                  {plan.price}
                  <span className={`text-xs font-normal ml-1 ${isHighlight ? "text-blue-200" : "text-[#AEAEB2]"}`}>
                    {plan.unit}
                  </span>
                </div>

                {plan.perMonth && (
                  <div className={`text-xs mt-1 font-medium ${isHighlight ? "text-blue-200" : "text-[#6E6E73]"}`}>
                    {plan.perMonth}
                  </div>
                )}
                {plan.savingPct && (
                  <div className={`text-[10px] mt-0.5 font-semibold ${isHighlight ? "text-blue-100" : "text-green-600"}`}>
                    {plan.savingPct}
                  </div>
                )}

                <div className={`text-[11px] mt-2 mb-4 ${isHighlight ? "text-blue-100" : "text-[#6E6E73]"}`}>
                  {plan.desc}
                </div>

                {/* Features */}
                <ul className="space-y-1.5 flex-1 mb-5">
                  {plan.features.map((f, i) => (
                    <li key={i} className={`flex items-start gap-1.5 text-xs ${isHighlight ? "text-blue-50" : "text-[#1D1D1F]"}`}>
                      <span className={`shrink-0 ${isHighlight ? "text-blue-200" : "text-[#0066CC]"}`}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isActive ? (
                  <div className={`text-center text-xs py-2.5 rounded-xl font-bold ${
                    isHighlight ? "bg-white/20 text-white" : "bg-[#0066CC] text-white"
                  }`}>
                    ✓ Đang dùng
                  </div>
                ) : isPro ? (
                  <a
                    href="#contact"
                    className={`text-center text-xs py-2.5 rounded-xl font-bold transition-colors ${
                      isHighlight
                        ? "bg-white text-[#0066CC] hover:bg-blue-50"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Gia hạn / Nâng gói
                  </a>
                ) : (
                  <a
                    href="#contact"
                    className={`text-center text-xs py-2.5 rounded-xl font-bold transition-colors ${
                      isHighlight
                        ? "bg-white text-[#0066CC] hover:bg-blue-50"
                        : "bg-[#0066CC] text-white hover:bg-[#004F99]"
                    }`}
                  >
                    Đăng ký →
                  </a>
                )}
              </div>
            )
          })}
        </div>

        {/* Free tier note */}
        <div className="text-center mb-14">
          <p className="text-sm text-[#6E6E73]">
            Chưa muốn nâng cấp?{" "}
            <Link href="/practice" className="text-[#0066CC] font-semibold hover:underline">
              Dùng thử Free — 5 lượt chấm/tháng miễn phí →
            </Link>
          </p>
        </div>

        {/* Contact CTA section */}
        <div id="contact" className="bg-gradient-to-br from-[#0066CC] to-[#004F99] rounded-2xl p-8 mb-10 text-white text-center">
          <div className="text-3xl mb-3">💬</div>
          <h2 className="text-xl font-extrabold mb-2">Đăng ký qua Fanpage ToPeak</h2>
          <p className="text-blue-100 text-sm mb-6 max-w-md mx-auto leading-relaxed">
            Nhắn tin cho chúng tôi qua Fanpage Facebook — ghi rõ gói muốn đăng ký và email tài khoản.
            Admin kích hoạt Pro trong <strong className="text-white">2–4 giờ</strong> (giờ hành chính).
          </p>
          <a
            href="https://www.facebook.com/topeak.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#0066CC] font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Nhắn tin qua Fanpage →
          </a>
          <p className="text-blue-200 text-xs mt-4">
            Hoặc inbox trực tiếp: <strong className="text-white">facebook.com/topeak.app</strong>
          </p>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-[#1D1D1F] mb-4">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="font-semibold text-[#1D1D1F] text-sm mb-1">{item.q}</div>
                <div className="text-sm text-[#6E6E73]">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Compare table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-[#1D1D1F]">So sánh chi tiết</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F5F7]">
                  <th className="text-left px-5 py-3 text-[#6E6E73] font-medium">Tính năng</th>
                  <th className="text-center px-4 py-3 text-[#6E6E73] font-medium">Free</th>
                  <th className="text-center px-4 py-3 text-[#0066CC] font-bold">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  ["Luyện Q51 · Q52 · Q53 · Q54", "✓", "✓"],
                  ["AI chấm điểm theo rubric Viện Giáo dục Quốc tế Hàn Quốc (NIIED)", "✓", "✓"],
                  ["Tips & cấu trúc từng câu", "✓", "✓"],
                  ["Số lượt chấm", "5 lần/tháng", "Không giới hạn"],
                  ["Thi thử full 50 phút (4 câu)", "✗", "✓"],
                  ["Phân tích điểm yếu cá nhân", "✗", "✓"],
                  ["Toàn bộ đề mới nhất (TOPIK 106)", "✗", "✓"],
                  ["Lộ trình học cá nhân hóa", "Cơ bản", "Đầy đủ"],
                  ["Hỗ trợ", "—", "Email + Zalo"],
                ].map(([feature, free, pro], i) => (
                  <tr key={i} className="hover:bg-[#F5F5F7] transition-colors">
                    <td className="px-5 py-3 text-[#1D1D1F]">{feature}</td>
                    <td className="px-4 py-3 text-center text-[#AEAEB2]">{free}</td>
                    <td className="px-4 py-3 text-center text-[#0066CC] font-medium">{pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
