import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
import TopikCountdown from "@/app/components/writing/TopikCountdown"
import { Mail, Scale, BarChart2, BookOpen } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const QUESTION_TYPES: {
  key: string; label: string; title: string; desc: string
  points: number; time: string; Icon: LucideIcon; tip: string
  accent: string; accentBg: string; accentText: string; href: string; num: string
}[] = [
  {
    key: "q51", label: "Q51", title: "Thực dụng văn", num: "51",
    desc: "Điền 2 câu vào thư mời, thông báo, lời cảm ơn...",
    points: 10, time: "3–5 phút", Icon: Mail,
    tip: "Đọc ngữ cảnh trước-sau chỗ trống, match verb ending",
    accent: "#007AFF", accentBg: "#E8F0FE", accentText: "#004F99",
    href: "/practice/q51",
  },
  {
    key: "q52", label: "Q52", title: "Nghị luận ngắn", num: "52",
    desc: "Điền 2 câu vào đoạn văn so sánh 2 quan điểm đối lập",
    points: 10, time: "5–7 phút", Icon: Scale,
    tip: "Pattern đối lập: A nói thế này → chỗ trống viết ngược lại",
    accent: "#34C759", accentBg: "#E8F8ED", accentText: "#1A7A38",
    href: "/practice/q52",
  },
  {
    key: "q53", label: "Q53", title: "Phân tích biểu đồ", num: "53",
    desc: "Viết 200–300 chữ mô tả và phân tích dữ liệu khảo sát",
    points: 30, time: "10–12 phút", Icon: BarChart2,
    tip: "Mở bài → mô tả dữ liệu → phân tích nguyên nhân",
    accent: "#FF9500", accentBg: "#FFF3E0", accentText: "#A05C00",
    href: "/practice/q53",
  },
  {
    key: "q54", label: "Q54", title: "Luận văn dài", num: "54",
    desc: "Viết 600–700 chữ luận văn hoàn chỉnh mở-thân-kết",
    points: 50, time: "28–35 phút", Icon: BookOpen,
    tip: "BẮT BUỘC dùng 합쇼체 (–ㅂ니다/습니다). Dùng 해요체 bị trừ điểm",
    accent: "#FF2D55", accentBg: "#FFE8EE", accentText: "#A3001E",
    href: "/practice/q54",
  },
]

export default function PracticePage() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <Sidebar />
      <main className="ml-56 flex-1 p-8">

        {/* ── Hero Banner ── */}
        <div
          className="rounded-2xl px-8 py-7 mb-8 relative overflow-hidden flex items-center gap-12"
          style={{
            background: "linear-gradient(135deg, #F5F9FF 0%, #EBF3FF 60%, #DDEEFF 100%)",
            border: "1px solid #C5DCEF",
          }}
        >
          {/* Blobs */}
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-15 pointer-events-none"
            style={{ background: "radial-gradient(circle, #4D9ED6, transparent)" }} />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #0066CC, transparent)" }} />

          {/* Left */}
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-extrabold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 uppercase tracking-widest">
                TOPIK II Writing
              </span>
              <span className="text-xs text-[#AEAEB2] font-medium">100 điểm · Q51–Q54</span>
            </div>

            <h1 className="text-[26px] font-extrabold text-[#1D1D1F] leading-snug mb-2" style={{ letterSpacing: "-0.02em" }}>
              Ôn thi TOPIK mà chưa biết<br />
              <span className="text-blue-600">Writing đang ở mức nào?</span>
            </h1>
            <p className="text-sm text-[#6E6E73] mb-5 leading-relaxed max-w-sm">
              AI chấm điểm theo rubric Viện Giáo dục Quốc tế Hàn Quốc (NIIED) tức thì · Feedback 100% tiếng Việt · Biết điểm yếu để tập trung đúng chỗ
            </p>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href="/mock-exam"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #0066CC, #004F99)", boxShadow: "0 4px 14px rgba(0,102,204,0.3)" }}
              >
                Thi thử ngay
              </Link>
              {QUESTION_TYPES.map((q) => (
                <Link
                  key={q.key}
                  href={q.href}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border bg-white/60 hover:bg-white/90 transition-all"
                  style={{ borderColor: "#C5DCEF", color: "#004F99" }}
                >
                  <q.Icon size={12} />
                  {q.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="self-stretch w-px bg-blue-200/60 relative z-10 shrink-0 mx-2" />

          {/* Right: TOPIK countdown */}
          <div className="shrink-0 relative z-10 pl-2">
            <TopikCountdown />
          </div>
        </div>

        {/* ── Section title ── */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#1D1D1F]" style={{ letterSpacing: "-0.01em" }}>Chọn dạng bài để luyện</h2>
          <span className="text-xs text-[#AEAEB2]">4 dạng · tổng 100 điểm</span>
        </div>

        {/* ── 4 Question Cards ── */}
        <div className="grid grid-cols-4 gap-4">
          {QUESTION_TYPES.map((q) => (
            <Link
              key={q.key}
              href={q.href}
              className="group relative flex flex-col rounded-2xl bg-white overflow-hidden
                         hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              style={{ border: "1px solid #E5E5EA" }}
            >
              {/* Accent top bar */}
              <div className="h-1 shrink-0" style={{ background: q.accent }} />

              {/* Background number — gradient watermark top-right */}
              <div
                className="absolute -top-5 -right-3 font-black leading-none select-none pointer-events-none"
                style={{
                  fontSize: "clamp(140px, 14vw, 200px)",
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  background: `linear-gradient(225deg, ${q.accent}18 0%, ${q.accent}08 50%, transparent 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {q.num}
              </div>

              <div className="p-5 flex flex-col flex-1 relative z-10">
                {/* Icon + time row */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: q.accentBg }}
                  >
                    <q.Icon size={18} color={q.accentText} strokeWidth={2} />
                  </div>
                  <span className="text-xs text-[#AEAEB2]">{q.time}</span>
                </div>

                {/* Title + desc */}
                <h3 className="text-base font-bold text-[#1D1D1F] leading-snug mb-1" style={{ letterSpacing: "-0.01em" }}>
                  {q.title}
                </h3>
                <p className="text-xs text-[#6E6E73] leading-relaxed flex-1 mb-4">
                  {q.desc}
                </p>

                {/* Tip box */}
                <div className="rounded-xl px-3 py-2.5 mb-4" style={{ background: q.accentBg }}>
                  <p className="text-xs leading-relaxed" style={{ color: q.accentText }}>
                    {q.tip}
                  </p>
                </div>

                {/* CTA + score */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1"
                    style={{ color: q.accent }}
                  >
                    Luyện ngay →
                  </span>
                  <span className="text-xs font-semibold text-[#AEAEB2]">
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
