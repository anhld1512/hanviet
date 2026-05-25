import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "HanViet Writing Coach — Luyện viết TOPIK II Q51-54",
  description: "App luyện viết TOPIK II chuyên sâu cho người Việt. AI chấm điểm tức thì theo rubric NIIED, feedback 100% tiếng Việt. Tập trung Q51-54. Miễn phí 5 lượt/tháng.",
  openGraph: {
    title: "HanViet Writing Coach — Luyện viết TOPIK II Q51-54",
    description: "AI chấm bài viết tiếng Hàn tức thì, feedback tiếng Việt, rubric NIIED chính thức. Luyện Q51–Q54 hiệu quả nhất.",
    url: "https://hanviet.app",
    siteName: "HanViet Writing Coach",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HanViet Writing Coach — Luyện viết TOPIK II",
    description: "AI chấm bài viết tiếng Hàn tức thì. Feedback tiếng Việt, rubric NIIED chính thức.",
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-5 h-14 flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl">✍️</span>
          <span className="font-extrabold text-gray-900">HanViet</span>
          <span className="text-xs text-gray-400 hidden sm:block">Writing Coach</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block">
            Bảng giá
          </Link>
          <Link
            href="/login"
            className="text-sm bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl transition-colors"
          >
            Viết thử miễn phí
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-5">
        {/* Hero */}
        <section className="py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            <span>🤖</span>
            <span>AI chấm điểm theo rubric NIIED chính thức</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            Tăng <span className="text-blue-500">30+ điểm</span>
            <br />
            phần Viết TOPIK II
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
            App luyện viết Q51-54 chuyên sâu. AI chấm tức thì, feedback 100% tiếng Việt,
            phân tích 4 tiêu chí NIIED. Lộ trình cá nhân từ chưa biết viết đến tự tin trong 30 phút.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Viết thử miễn phí
            <span>→</span>
          </Link>
          <p className="text-xs text-gray-400 mt-3">Đăng nhập bằng Google, không cần thẻ tín dụng</p>
        </section>

        {/* Pain point stats */}
        <section className="grid grid-cols-3 gap-4 pb-16">
          {[
            { num: "33/100", label: "Điểm Writing TB thí sinh", sub: "Thấp hơn Nghe và Đọc 20 điểm", color: "text-red-500" },
            { num: "85.000", label: "Lượt thi TOPIK/năm tại VN", sub: "Cao nhất thế giới", color: "text-blue-500" },
            { num: "33%", label: "Tổng điểm là Writing", sub: "100/300 điểm", color: "text-purple-500" },
          ].map((s) => (
            <div key={s.num} className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className={`text-2xl sm:text-3xl font-extrabold ${s.color}`}>{s.num}</div>
              <div className="font-semibold text-gray-900 text-xs sm:text-sm mt-1">{s.label}</div>
              <div className="text-gray-500 text-xs mt-0.5 hidden sm:block">{s.sub}</div>
            </div>
          ))}
        </section>

        {/* Feature highlights */}
        <section className="pb-16">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">
            Tại sao chọn HanViet?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: "🎯",
                title: "Chấm 4 tiêu chí NIIED tách biệt",
                desc: "Không chỉ 1 điểm tổng. Biết chính xác bạn yếu Nội dung, Cấu trúc, Ngữ pháp hay Phong cách.",
              },
              {
                icon: "🇻🇳",
                title: "Feedback 100% tiếng Việt",
                desc: "Giải thích lỗi bằng so sánh Hàn-Việt. Không phải bản dịch máy từ tiếng Anh.",
              },
              {
                icon: "📄",
                title: "원고지 simulator thật",
                desc: "Luyện trên ô vuông 원고지 chuẩn thi, đếm chữ theo ô. Quen tay trước khi vào phòng thi.",
              },
              {
                icon: "⚡",
                title: "AI chấm trong 5 giây",
                desc: "Submit bài, nhận kết quả ngay. Không chờ 3-7 ngày như trung tâm offline.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="pb-16">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">
            So sánh lựa chọn
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 text-gray-500 font-normal pl-2"></th>
                  <th className="py-3 font-extrabold text-blue-600 text-center">HanViet</th>
                  <th className="py-3 font-semibold text-gray-500 text-center">Trung tâm offline</th>
                  <th className="py-3 font-semibold text-gray-500 text-center">Easy6</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Giá", "Từ 199K/tháng", "3-8 triệu/khóa", "Miễn phí (giới hạn)"],
                  ["Chờ kết quả", "5 giây", "3-7 ngày", "Tức thì"],
                  ["Ngôn ngữ feedback", "Tiếng Việt 100%", "Tiếng Việt", "Tiếng Anh"],
                  ["4 tiêu chí NIIED", "✅", "✅", "❌"],
                  ["원고지 thật", "✅", "❌", "❌"],
                  ["Lộ trình cá nhân", "✅", "❌", "❌"],
                ].map(([label, hanviet, offline, easy6]) => (
                  <tr key={label} className="border-b border-gray-50">
                    <td className="py-3 text-gray-600 pl-2">{label}</td>
                    <td className="py-3 text-center font-semibold text-blue-700 bg-blue-50/50">{hanviet}</td>
                    <td className="py-3 text-center text-gray-500">{offline}</td>
                    <td className="py-3 text-center text-gray-500">{easy6}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing */}
        <section className="pb-16" id="pricing">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Bảng giá</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                name: "Free",
                price: "0đ",
                desc: "Dùng thử",
                features: ["3 lần chấm bài/tuần", "Xem template Q51-52", "Lộ trình demo"],
                cta: "Bắt đầu miễn phí",
                highlight: false,
              },
              {
                name: "Pro",
                price: "199K",
                desc: "/tháng",
                features: ["Chấm không giới hạn Q51-52-53", "Template đầy đủ", "Lộ trình cá nhân", "Lịch sử + phân tích lỗi"],
                cta: "Dùng Pro",
                highlight: true,
              },
              {
                name: "Premium",
                price: "399K",
                desc: "/tháng",
                features: ["Tất cả Pro", "Chấm Q54 không giới hạn", "Bài mẫu cấp 5-6", "Phân tích xu hướng điểm"],
                cta: "Dùng Premium",
                highlight: false,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl p-6 ${p.highlight ? "bg-blue-500 text-white shadow-xl shadow-blue-100" : "bg-gray-50 border border-gray-100"}`}
              >
                <div className={`text-sm font-bold mb-1 ${p.highlight ? "text-blue-100" : "text-gray-500"}`}>{p.name}</div>
                <div className={`text-3xl font-extrabold ${p.highlight ? "text-white" : "text-gray-900"}`}>
                  {p.price}
                  <span className={`text-sm font-normal ml-1 ${p.highlight ? "text-blue-100" : "text-gray-400"}`}>{p.desc}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className={`text-sm flex items-start gap-2 ${p.highlight ? "text-blue-50" : "text-gray-600"}`}>
                      <span className="shrink-0 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`mt-5 block text-center text-sm font-bold py-3 rounded-xl transition-colors ${
                    p.highlight
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA bottom */}
        <section className="pb-20 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
            Sẵn sàng tăng điểm Writing?
          </h2>
          <p className="text-gray-500 text-sm mb-6">Viết bài đầu tiên, nhận feedback trong 5 giây</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-base px-7 py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all"
          >
            Viết thử miễn phí →
          </Link>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <p>HanViet Writing Coach - Luyện viết TOPIK II Q51-54</p>
      </footer>
    </div>
  )
}
