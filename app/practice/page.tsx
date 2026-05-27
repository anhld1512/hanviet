import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"

const QUESTION_TYPES = [
  {
    key: "q51", label: "Q51", title: "Thực dụng văn",
    desc: "Điền 2 câu vào thư mời, thông báo, lời cảm ơn...",
    points: "10 điểm", time: "3-5 phút",
    tip: "Đọc ngữ cảnh trước-sau chỗ trống, match verb ending",
    color: "bg-green-50 border-green-200", badge: "bg-green-100 text-green-700",
    href: "/practice/q51",
  },
  {
    key: "q52", label: "Q52", title: "Nghị luận ngắn",
    desc: "Điền 2 câu vào đoạn văn so sánh 2 quan điểm đối lập",
    points: "10 điểm", time: "5-7 phút",
    tip: "Pattern đối lập: A nói thế này, chỗ trống cần viết ngược lại",
    color: "bg-blue-50 border-blue-200", badge: "bg-blue-100 text-blue-700",
    href: "/practice/q52",
  },
  {
    key: "q53", label: "Q53", title: "Phân tích biểu đồ",
    desc: "Viết 200-300 chữ mô tả và phân tích dữ liệu khảo sát",
    points: "30 điểm", time: "10-12 phút",
    tip: "Mở bài → mô tả dữ liệu → phân tích nguyên nhân. Không cần kết luận.",
    color: "bg-purple-50 border-purple-200", badge: "bg-purple-100 text-purple-700",
    href: "/practice/q53",
  },
  {
    key: "q54", label: "Q54", title: "Luận nghị luận",
    desc: "Viết 600-700 chữ luận văn hoàn chỉnh mở-thân-kết",
    points: "50 điểm", time: "28-35 phút",
    tip: "BẮT BUỘC dùng 합쇼체 (-ㅂ니다/습니다). Dùng 해요체 bị trừ điểm.",
    color: "bg-orange-50 border-orange-200", badge: "bg-orange-100 text-orange-700",
    href: "/practice/q54",
  },
]

const STYLE_INFO = [
  { q: "Q51", style: "습니다체", note: "Thể trang trọng - formal", color: "bg-green-50 text-green-700" },
  { q: "Q52", style: "다/ㄴ다체", note: "Thể văn viết học thuật", color: "bg-blue-50 text-blue-700" },
  { q: "Q53", style: "다/ㄴ다체", note: "Thể văn viết học thuật", color: "bg-purple-50 text-purple-700" },
  { q: "Q54", style: "합쇼체", note: "BẮT BUỘC — sai bị trừ điểm", color: "bg-orange-50 text-orange-700" },
]

export default function PracticePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-56 flex-1 p-8">
        <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Luyện viết</h1>
          <p className="text-gray-500 mt-1">Chọn loại câu hỏi để bắt đầu</p>
        </div>

        {/* 4 thẻ dàn ngang 1 hàng */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {QUESTION_TYPES.map((q) => (
            <Link
              key={q.key}
              href={q.href}
              className={`rounded-2xl border-2 ${q.color} p-5 hover:shadow-md transition-all group flex flex-col`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${q.badge}`}>{q.label}</span>
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-700">{q.points}</div>
                  <div className="text-xs text-gray-400">{q.time}</div>
                </div>
              </div>
              <h2 className="text-lg font-extrabold text-gray-900 mb-1">{q.title}</h2>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed flex-1">{q.desc}</p>
              <div className="bg-white/70 rounded-xl px-3 py-2 mb-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-semibold text-gray-700">Mẹo: </span>{q.tip}
                </p>
              </div>
              <span className="text-sm font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                Luyện ngay →
              </span>
            </Link>
          ))}
        </div>

        {/* Thể văn + Điểm số side by side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Thể văn bắt buộc */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Thể văn bắt buộc</h2>
            <div className="grid grid-cols-2 gap-3">
              {STYLE_INFO.map((item) => (
                <div key={item.q} className={`flex items-center gap-3 p-3 rounded-xl ${item.color} bg-opacity-40`}>
                  <span className="text-xs font-bold bg-white/60 px-2 py-0.5 rounded-full text-gray-700">{item.q}</span>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{item.style}</div>
                    <div className="text-xs text-gray-600">{item.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phân bố điểm */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Phân bố điểm Writing</h2>
            <div className="space-y-3">
              {[
                { q: "Q51", pts: 10, max: 100, color: "bg-green-400" },
                { q: "Q52", pts: 10, max: 100, color: "bg-blue-400" },
                { q: "Q53", pts: 30, max: 100, color: "bg-purple-400" },
                { q: "Q54", pts: 50, max: 100, color: "bg-orange-400" },
              ].map((item) => (
                <div key={item.q} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-600 w-8">{item.q}</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pts}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-12 text-right">{item.pts} điểm</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                <span>Tổng điểm Writing</span>
                <span className="font-bold text-gray-900">100 điểm</span>
              </div>
            </div>
          </div>
        </div>

        </div>
      </main>
    </div>
  )
}
