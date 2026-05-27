import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
import HeroHeatmap from "@/app/components/writing/HeroHeatmap"

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
    accent: "#22c55e",
    accentBg: "#f0fdf4",
    accentText: "#15803d",
    accentBorder: "#bbf7d0",
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


export default function PracticePage() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <Sidebar />
      <main className="ml-56 flex-1 p-8">

        {/* ── Hero Banner (2-col) ── */}
        <div
          className="rounded-2xl px-8 py-7 mb-8 relative overflow-hidden flex items-center gap-8"
          style={{ background: "linear-gradient(135deg, #312e81 0%, #4338ca 50%, #6d28d9 100%)" }}
        >
          {/* Left: headline + CTA */}
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold bg-white/15 text-white/90 px-2.5 py-1 rounded-full uppercase tracking-widest">
                TOPIK II Writing
              </span>
              <span className="text-[11px] text-indigo-300/80 font-medium">100 điểm · Q51–Q54</span>
            </div>
            <h1 className="text-[24px] font-extrabold text-white leading-snug mb-2 tracking-tight">
              Ôn thi TOPIK mà chưa biết<br />
              <span className="text-indigo-300">Writing đang ở mức nào?</span>
            </h1>
            <p className="text-[12px] text-indigo-200/80 mb-5 leading-relaxed max-w-sm">
              AI chấm điểm theo rubric NIIED tức thì · Feedback 100% tiếng Việt
            </p>
            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href="/mock-exam"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold text-indigo-900 bg-white hover:bg-indigo-50 transition-all active:scale-[0.98]"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
              >
                ⏱ Thi thử ngay
              </Link>
              {QUESTION_TYPES.map((q) => (
                <Link
                  key={q.key}
                  href={q.href}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all hover:bg-white/10"
                  style={{ borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.85)" }}
                >
                  {q.icon} {q.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Heatmap */}
          <div className="shrink-0 relative z-10">
            <HeroHeatmap />
          </div>

          {/* Decorative blob */}
          <div
            className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }}
          />
        </div>

        {/* ── Section title ── */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-bold text-slate-900">Chọn dạng bài để luyện</h2>
          <span className="text-[12px] text-slate-400">4 dạng · tổng 100 điểm</span>
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
                <h3 className="text-[15px] font-bold text-slate-900 leading-snug mb-1">
                  {q.title}
                </h3>
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


      </main>
    </div>
  )
}
