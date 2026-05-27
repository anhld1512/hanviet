import Link from "next/link"
import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

const PLANS = [
  {
    name: "Free",
    price: "0",
    unit: "",
    desc: "Dùng thử, không cần thẻ",
    highlight: false,
    features: [
      "5 lượt chấm AI mỗi tháng",
      "Luyện Q51 · Q52 · Q53 · Q54",
      "Xem tips & cấu trúc",
      "Lưu lịch sử 5 bài gần nhất",
    ],
    disabled: ["Thi thử full 50 phút", "Phân tích điểm yếu cá nhân", "Unlimited grading"],
    cta: "Đang dùng",
    ctaDisabled: true,
  },
  {
    name: "Pro 3 tháng",
    price: "399.000",
    unit: "₫ / 3 tháng",
    perMonth: "~133k/tháng",
    desc: "Đủ thời gian ôn luyện trước kỳ thi",
    highlight: false,
    features: [
      "Tất cả tính năng Free",
      "Chấm bài không giới hạn",
      "Thi thử full 50 phút · đề ngẫu nhiên",
      "Phân tích điểm yếu theo tuần",
      "Toàn bộ đề thi mới nhất (TOPIK 106)",
    ],
    disabled: [],
    cta: "Đăng ký 3 tháng",
    ctaDisabled: false,
    bankAmount: 399000,
    bankNote: "HANVIET PRO3",
  },
  {
    name: "Pro 6 tháng",
    price: "699.000",
    unit: "₫ / 6 tháng",
    perMonth: "~117k/tháng · tiết kiệm 99k",
    desc: "Phổ biến nhất — học từ căn bản đến thi thật",
    highlight: true,
    features: [
      "Tất cả tính năng Free",
      "Chấm bài không giới hạn",
      "Thi thử full 50 phút · đề ngẫu nhiên",
      "Phân tích điểm yếu theo tuần",
      "Toàn bộ đề thi mới nhất (TOPIK 106)",
      "Ưu tiên cập nhật đề mới nhất",
    ],
    disabled: [],
    cta: "Đăng ký 6 tháng",
    ctaDisabled: false,
    bankAmount: 699000,
    bankNote: "HANVIET PRO6",
  },
]

const FAQ = [
  {
    q: "Sau khi thanh toán bao lâu thì tài khoản được nâng cấp?",
    a: "Trong vòng 2–4 giờ (trong giờ hành chính). Bạn sẽ nhận email xác nhận khi tài khoản được kích hoạt.",
  },
  {
    q: "Có thể dùng thử trước khi mua không?",
    a: "Có — gói Free cho phép 5 lượt chấm AI mỗi tháng, đủ để trải nghiệm toàn bộ tính năng cơ bản.",
  },
  {
    q: "Thanh toán bằng cách nào?",
    a: "Chuyển khoản ngân hàng theo thông tin bên dưới, ghi đúng nội dung chuyển khoản. Admin sẽ kích hoạt Pro trong vòng 2–4 giờ.",
  },
  {
    q: "Có hoàn tiền không?",
    a: "Nếu tài khoản chưa được kích hoạt sau 24 giờ, liên hệ admin để được hoàn tiền hoặc hỗ trợ.",
  },
]

const BANK_INFO = {
  bank: "MB Bank",
  account: "0123456789",
  name: "LE DUC ANH",
}

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("subscription_tier, is_pro, display_name")
    .eq("id", user.id)
    .single()

  const isPro = profile?.subscription_tier === "pro" || profile?.is_pro === true

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <Link href="/practice" className="text-gray-400 hover:text-gray-600 text-sm">← Luyện viết</Link>
        <div className="w-px h-4 bg-gray-200" />
        <span className="font-bold text-gray-900">Nâng cấp Pro</span>
        {isPro && (
          <span className="ml-auto text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">
            ✓ Bạn đang dùng Pro
          </span>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            Luyện viết TOPIK không giới hạn
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Công cụ luyện viết TOPIK II duy nhất cho người Việt — AI chấm điểm theo rubric NIIED,
            giải thích bằng tiếng Việt.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-3 gap-6 mb-14">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 flex flex-col ${
                plan.highlight
                  ? "border-blue-500 bg-blue-600 text-white shadow-xl scale-[1.02]"
                  : "border-gray-200 bg-white"
              }`}
            >
              {plan.highlight && (
                <div className="text-xs font-bold bg-white text-blue-600 rounded-full px-3 py-0.5 self-start mb-3">
                  PHỔ BIẾN NHẤT
                </div>
              )}
              <div className="mb-4">
                <div className={`text-sm font-semibold mb-1 ${plan.highlight ? "text-blue-100" : "text-gray-500"}`}>
                  {plan.name}
                </div>
                <div className={`text-3xl font-extrabold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                  {plan.price}
                  <span className={`text-sm font-normal ml-1 ${plan.highlight ? "text-blue-200" : "text-gray-400"}`}>
                    {plan.unit}
                  </span>
                </div>
                {plan.perMonth && (
                  <div className={`text-xs mt-1 ${plan.highlight ? "text-blue-200" : "text-gray-400"}`}>
                    {plan.perMonth}
                  </div>
                )}
                <div className={`text-xs mt-2 ${plan.highlight ? "text-blue-100" : "text-gray-500"}`}>
                  {plan.desc}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className={`flex items-start gap-2 text-sm ${plan.highlight ? "text-blue-50" : "text-gray-700"}`}>
                    <span className="text-green-400 shrink-0">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
                {plan.disabled.map((f, i) => (
                  <li key={i} className={`flex items-start gap-2 text-sm ${plan.highlight ? "text-blue-300 line-through" : "text-gray-300 line-through"}`}>
                    <span className="shrink-0">✗</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isPro ? (
                // User is Pro: show "Đang dùng" on Pro plans, muted on Free
                plan.name === "Free" ? (
                  <div className="text-center text-sm py-3 rounded-xl font-semibold bg-gray-100 text-gray-300">
                    Gói cơ bản
                  </div>
                ) : (
                  <div className={`text-center text-sm py-3 rounded-xl font-semibold ${plan.highlight ? "bg-blue-500 text-blue-100" : "bg-green-50 text-green-600 border border-green-200"}`}>
                    ✓ Đang dùng
                  </div>
                )
              ) : plan.ctaDisabled ? (
                <div className={`text-center text-sm py-3 rounded-xl font-semibold ${plan.highlight ? "bg-blue-500 text-blue-100" : "bg-gray-100 text-gray-400"}`}>
                  {plan.cta}
                </div>
              ) : (
                <a
                  href={`#payment-${plan.bankNote}`}
                  className={`text-center text-sm py-3 rounded-xl font-bold transition-colors ${
                    plan.highlight
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.cta}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Payment instructions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Hướng dẫn thanh toán</h2>
          <p className="text-sm text-gray-500 mb-6">Chuyển khoản đúng nội dung — tài khoản kích hoạt trong 2–4 giờ</p>

          <div className="grid grid-cols-2 gap-8">
            {/* Bank info */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-5 font-mono text-sm space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngân hàng</span>
                  <span className="font-bold text-gray-900">{BANK_INFO.bank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Số tài khoản</span>
                  <span className="font-bold text-gray-900">{BANK_INFO.account}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tên TK</span>
                  <span className="font-bold text-gray-900">{BANK_INFO.name}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="text-gray-500 text-xs mb-2">Nội dung chuyển khoản:</div>
                  {PLANS.filter(p => p.bankNote).map((plan) => (
                    <div key={plan.bankNote} id={`payment-${plan.bankNote}`} className="flex items-center justify-between mb-1">
                      <span className="text-gray-600">{plan.name}:</span>
                      <span className="bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded text-xs">
                        {plan.bankNote} {user.email?.split("@")[0].toUpperCase()}
                      </span>
                    </div>
                  ))}
                  <div className="text-[10px] text-gray-400 mt-1">Ghi đúng nội dung gồm mã gói + tên tài khoản email</div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 text-xs text-blue-700">
                <strong>Sau khi chuyển khoản:</strong> Hệ thống tự xác nhận và kích hoạt trong vòng 2–4 giờ.
                Nếu quá 24 giờ chưa kích hoạt, liên hệ qua email hoặc Zalo để được hỗ trợ.
              </div>
            </div>

            {/* QR placeholder */}
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6">
              <div className="w-40 h-40 bg-white border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center mb-3">
                <div className="text-center">
                  <div className="text-3xl mb-2">📱</div>
                  <div className="text-xs text-gray-400">QR Code</div>
                  <div className="text-[10px] text-gray-300">(sẽ cập nhật)</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Quét QR bằng app ngân hàng<br />để chuyển khoản nhanh hơn
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="font-semibold text-gray-900 text-sm mb-1">{item.q}</div>
                <div className="text-sm text-gray-500">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Compare table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">So sánh chi tiết</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-5 py-3 text-gray-500 font-medium">Tính năng</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-medium">Free</th>
                  <th className="text-center px-4 py-3 text-blue-600 font-bold">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  ["Luyện Q51 · Q52 · Q53 · Q54", "✓", "✓"],
                  ["AI chấm điểm theo rubric NIIED", "✓", "✓"],
                  ["Tips & cấu trúc từng câu", "✓", "✓"],
                  ["Số lượt chấm", "5 lần/tháng", "Không giới hạn"],
                  ["Thi thử full 50 phút (4 câu)", "✗", "✓"],
                  ["Phân tích điểm yếu cá nhân", "✗", "✓"],
                  ["Toàn bộ đề mới nhất (TOPIK 106)", "✗", "✓"],
                  ["Lộ trình học cá nhân hóa", "Cơ bản", "Đầy đủ"],
                  ["Hỗ trợ", "—", "Email + Zalo"],
                ].map(([feature, free, pro], i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-700">{feature}</td>
                    <td className="px-4 py-3 text-center text-gray-400">{free}</td>
                    <td className="px-4 py-3 text-center text-blue-600 font-medium">{pro}</td>
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
