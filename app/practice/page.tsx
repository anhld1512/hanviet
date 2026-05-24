import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"

const QUESTION_TYPES = [
  {
    key: "q51",
    label: "Q51",
    title: "Thực dụng văn",
    desc: "Điền 2 câu vào thư mời, thông báo, lời cảm ơn...",
    points: "10 điểm",
    time: "3-5 phút",
    tip: "Đọc ngữ cảnh trước-sau chỗ trống, match verb ending",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
    href: "/practice/q51",
  },
  {
    key: "q52",
    label: "Q52",
    title: "Nghị luận ngắn",
    desc: "Điền 2 câu vào đoạn văn so sánh 2 quan điểm đối lập",
    points: "10 điểm",
    time: "5-7 phút",
    tip: "Thường là pattern đối lập: A nói thế này, chỗ trống cần viết ngược lại",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    href: "/practice/q52",
  },
  {
    key: "q53",
    label: "Q53",
    title: "Phân tích biểu đồ",
    desc: "Viết 200-300 chữ mô tả và phân tích dữ liệu khảo sát",
    points: "30 điểm",
    time: "10-12 phút",
    tip: "Mở bài → mô tả dữ liệu → phân tích nguyên nhân. Không cần kết luận.",
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    href: "/practice/q53",
  },
  {
    key: "q54",
    label: "Q54",
    title: "Luận nghị luận",
    desc: "Viết 600-700 chữ luận văn hoàn chỉnh mở-thân-kết",
    points: "50 điểm",
    time: "28-35 phút",
    tip: "BẮT BUỘC dùng 합쇼체 (-ㅂ니다/습니다). Dùng 해요체 bị trừ điểm phong cách.",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    href: "/practice/q54",
  },
]

export default function PracticePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-56 flex-1 p-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Luyện viết</h1>
            <p className="text-gray-500 mt-1">Chọn loại câu hỏi để bắt đầu</p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {QUESTION_TYPES.map((q) => (
              <Link
                key={q.key}
                href={q.href}
                className={`rounded-2xl border-2 ${q.color} p-6 hover:shadow-md transition-all group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${q.badge}`}>
                    {q.label}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-700">{q.points}</div>
                    <div className="text-xs text-gray-400">{q.time}</div>
                  </div>
                </div>

                <h2 className="text-xl font-extrabold text-gray-900 mb-2">{q.title}</h2>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{q.desc}</p>

                <div className="bg-white/70 rounded-xl px-3 py-2 mb-5">
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">Mẹo: </span>
                    {q.tip}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    Luyện ngay →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Writing tips */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Thể văn bắt buộc</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { q: "Q51", style: "습니다체", note: "Thể trang trọng - formal" },
                { q: "Q52", style: "다/ㄴ다체", note: "Thể văn viết học thuật" },
                { q: "Q53", style: "다/ㄴ다체", note: "Thể văn viết học thuật" },
                { q: "Q54", style: "합쇼체", note: "BẮT BUỘC - sai bị trừ điểm" },
              ].map((item) => (
                <div key={item.q} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{item.q}</span>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{item.style}</div>
                    <div className="text-xs text-gray-500">{item.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
