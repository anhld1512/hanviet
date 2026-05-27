import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"

const QUESTION_TYPES = [
  {
    key: "q51",
    label: "Q51",
    title: "Thực dụng văn",
    desc: "Điền 2 câu vào thư mời, thông báo, lời cảm ơn...",
    points: 10,
    time: "3–5 phút",
    tip: "Đọc ngữ cảnh trước-sau chỗ trống, match verb ending",
    icon: "✉️",
    accent: "#22c55e",       // green-500
    accentBg: "#f0fdf4",     // green-50
    accentText: "#15803d",   // green-700
    accentBorder: "#bbf7d0", // green-200
    href: "/practice/q51",
  },
  {
    key: "q52",
    label: "Q52",
    title: "Nghị luận ngắn",
    desc: "Điền 2 câu vào đoạn văn so sánh 2 quan điểm đối lập",
    points: 10,
    time: "5–7 phút",
    tip: "Pattern đối lập: A nói thế này → chỗ trống viết ngược lại",
    icon: "⚖️",
    accent: "#3b82f6",
    accentBg: "#eff6ff",
    accentText: "#1d4ed8",
    accentBorder: "#bfdbfe",
    href: "/practice/q52",
  },
  {
    key: "q53",
    label: "Q53",
    title: "Phân tích biểu đồ",
    desc: "Viết 200–300 chữ mô tả và phân tích dữ liệu khảo sát",
    points: 30,
    time: "10–12 phút",
    tip: "Mở bài → mô tả dữ liệu → phân tích nguyên nhân",
    icon: "📊",
    accent: "#a855f7",
    accentBg: "#faf5ff",
    accentText: "#7e22ce",
    accentBorder: "#e9d5ff",
    href: "/practice/q53",
  },
  {
    key: "q54",
    label: "Q54",
    title: "Luận văn dài",
    desc: "Viết 600–700 chữ luận văn hoàn chỉnh mở-thân-kết",
    points: 50,
    time: "28–35 phút",
    tip: "BẮT BUỘC dùng 합쇼체 (–ㅂ니다/습니다). Dùng 해요체 bị trừ điểm",
    icon: "📝",
    accent: "#f97316",
    accentBg: "#fff7ed",
    accentText: "#c2410c",
    accentBorder: "#fed7aa",
    href: "/practice/q54",
  },
]

const STYLE_INFO = [
  { q: "Q51", style: "습니다체", note: "Thể trang trọng", accent: "#22c55e", bg: "#f0fdf4" },
  { q: "Q52", style: "다/ㄴ다체", note: "Văn viết học thuật", accent: "#3b82f6", bg: "#eff6ff" },
  { q: "Q53", style: "다/ㄴ다체", note: "Văn viết học thuật", accent: "#a855f7", bg: "#faf5ff" },
  { q: "Q54", style: "합쇼체", note: "Bắt buộc — sai bị trừ điểm", accent: "#f97316", bg: "#fff7ed" },
]

const SCORE_DIST = [
  { q: "Q51", pts: 10, color: "#22c55e" },
  { q: "Q52", pts: 10, color: "#3b82f6" },
  { q: "Q53", pts: 30, color: "#a855f7" },
  { q: "Q54", pts: 50, color: "#f97316" },
]

export default function PracticePage() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <Sidebar />
      <main className="ml-56 flex-1 p-8">

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tight leading-snug">
            Luyện viết
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Chọn câu hỏi để bắt đầu luyện · AI chấm điểm tức thì theo chuẩn TOPIK II
          </p>
        </div>

        {/* ── 4 Question Cards ── */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {QUESTION_TYPES.map((q) => (
            <Link
              key={q.key}
              href={q.href}
              className="group relative flex flex-col rounded-2xl bg-white border border-slate-200/80 overflow-hidden
                         hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Accent top bar */}
              <div className="h-1" style={{ background: q.accent }} />

              <div className="p-5 flex flex-col flex-1">
                {/* Icon + badges row */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: q.accentBg }}
                  >
                    {q.icon}
                  </div>
                  <div className="text-right">
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: q.accentBg, color: q.accentText }}
                    >
                      {q.label}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-0.5">{q.time}</div>
                  </div>
                </div>

                {/* Title + desc */}
                <h2 className="text-[15px] font-bold text-slate-900 leading-snug mb-1">
                  {q.title}
                </h2>
                <p className="text-[12px] text-slate-500 leading-relaxed flex-1 mb-4">
                  {q.desc}
                </p>

                {/* Tip box */}
                <div
                  className="rounded-xl px-3 py-2.5 mb-4"
                  style={{ background: q.accentBg }}
                >
                  <p className="text-[11px] leading-relaxed" style={{ color: q.accentText }}>
                    <span className="font-semibold">💡 </span>
                    {q.tip}
                  </p>
                </div>

                {/* CTA + score */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-[12px] font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1"
                    style={{ color: q.accent }}
                  >
                    Luyện ngay →
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {q.points} điểm
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Bottom 2-col info ── */}
        <div className="grid grid-cols-2 gap-5">

          {/* Thể văn */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-4">
              Thể văn bắt buộc
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {STYLE_INFO.map((item) => (
                <div
                  key={item.q}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: item.bg }}
                >
                  <span
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/80"
                    style={{ color: item.accent }}
                  >
                    {item.q}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-slate-900 truncate">{item.style}</div>
                    <div className="text-[11px] text-slate-500 truncate">{item.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phân bố điểm */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider mb-4">
              Phân bố điểm Writing
            </h2>
            <div className="space-y-3.5">
              {SCORE_DIST.map((item) => (
                <div key={item.q} className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-500 w-8">{item.q}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.pts}%`, background: item.color }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 w-14 text-right">
                    {item.pts} điểm
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[11px] text-slate-400">Tổng điểm Writing</span>
                <span className="text-sm font-extrabold text-slate-900">100 điểm</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
