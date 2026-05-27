import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
import ScoreRings from "@/app/components/writing/ScoreRings"

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

        {/* ── Hero Banner ── */}
        <div
          className="rounded-2xl px-8 py-7 mb-8 relative overflow-hidden flex items-center gap-12"
          style={{
            background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 55%, #ede9fe 100%)",
            border: "1px solid #c7d2fe",
          }}
        >
          {/* Blobs */}
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />

          {/* Left */}
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200 uppercase tracking-widest">
                TOPIK II Writing
              </span>
              <span className="text-[11px] text-slate-400 font-medium">100 điểm · Q51–Q54</span>
            </div>

            <h1 className="text-[26px] font-extrabold text-slate-900 leading-snug mb-2 tracking-tight">
              Ôn thi TOPIK mà chưa biết<br />
              <span className="text-indigo-600">Writing đang ở mức nào?</span>
            </h1>
            <p className="text-[13px] text-slate-500 mb-5 leading-relaxed max-w-sm">
              AI chấm điểm theo rubric NIIED tức thì &middot; Feedback 100% tiếng Việt &middot; Biết điểm yếu để tập trung đúng chỗ
            </p>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href="/mock-exam"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", boxShadow: "0 4px 14px rgba(79,70,229,0.3)" }}
              >
                ⏱ Thi thử ngay
              </Link>
              {QUESTION_TYPES.map((q) => (
                <Link
                  key={q.key}
                  href={q.href}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold border-2 bg-white/60 hover:bg-white/90 transition-all"
                  style={{ borderColor: "#c7d2fe", color: "#4338ca" }}
                >
                  {q.icon} {q.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Score rings */}
          <div className="shrink-0 relative z-10 pr-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Best score của bạn
            </p>
            <ScoreRings />
          </div>
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
