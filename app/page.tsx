import type { Metadata } from "next"
import Link from "next/link"
import {
  Target, MessageCircle, Clock, CheckCircle,
  ArrowRight, Zap, PenLine, BarChart2,
  BookOpen, Check, X, ChevronRight, Flame, Star,
} from "lucide-react"

export const metadata: Metadata = {
  title: "ToPeak — TOPIK to Peak. Lên đỉnh TOPIK",
  description: "App luyện viết TOPIK II chuyên sâu cho người Việt. AI chấm điểm tức thì theo rubric NIIED, feedback 100% tiếng Việt. Miễn phí 5 lượt/tháng.",
  openGraph: {
    title: "ToPeak — TOPIK to Peak. Lên đỉnh TOPIK",
    description: "AI chấm bài viết TOPIK II tức thì, feedback tiếng Việt, rubric NIIED chính thức.",
    url: "https://hanviet-ten.vercel.app",
    siteName: "ToPeak",
    locale: "vi_VN",
    type: "website",
  },
}

// ── Mini grading result card ───────────────────────────────────────────────
function GradingMockup() {
  const criteria = [
    { label: "Nội dung",       score: 16, max: 20, pct: 80,  color: "#0066CC" },
    { label: "Tổ chức văn bản", score: 14, max: 20, pct: 70, color: "#0066CC" },
    { label: "Ngữ pháp",       score: 5,  max: 5,  pct: 100, color: "#34C759" },
    { label: "Phong cách",     score: 3,  max: 5,  pct: 60,  color: "#FF9500" },
  ]
  return (
    <div className="relative w-full max-w-[360px] ml-auto select-none">
      <div
        className="bg-white rounded-2xl border border-gray-100 p-6"
        style={{
          boxShadow: "0 32px 80px rgba(0,70,180,0.16), 0 4px 16px rgba(0,0,0,0.06)",
          animation: "floatUp 5s ease-in-out infinite",
        }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-[11px] font-semibold text-[#AEAEB2] uppercase tracking-widest mb-1.5">
              Kết quả chấm — Q54
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-extrabold text-[#1D1D1F] tracking-tight leading-none">38</span>
              <span className="text-xl font-normal text-[#AEAEB2] leading-none">/50</span>
            </div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
              style={{ background: "linear-gradient(135deg, #E8F0FE 0%, #C7DEFF 100%)" }}>
              <span className="text-lg font-black text-[#0066CC]">A</span>
            </div>
            <span className="text-[10px] font-bold text-[#0066CC]">Khá tốt</span>
          </div>
        </div>

        <div className="space-y-2.5 mb-4">
          {criteria.map((c) => (
            <div key={c.label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-[#6E6E73]">{c.label}</span>
                <span className="text-xs font-bold" style={{ color: c.color }}>{c.score}/{c.max}</span>
              </div>
              <div className="h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${c.pct}%`, background: c.color, opacity: 0.85 }} />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3.5 border-t border-[#F5F5F7]">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6E6E73] mb-1.5">
            <MessageCircle size={11} strokeWidth={2.5} className="text-[#0066CC]" />
            Nhận xét AI
          </div>
          <p className="text-xs text-[#6E6E73] leading-relaxed">
            Luận điểm rõ ràng, cấu trúc tốt. Cần bổ sung ví dụ cụ thể và đa dạng hóa cấu trúc câu để cải thiện điểm Phong cách.
          </p>
        </div>
      </div>

      {/* Pill badge */}
      <div
        className="absolute -bottom-4 -left-5 bg-white rounded-xl px-3 py-2 flex items-center gap-2"
        style={{
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          animation: "floatUp 5s ease-in-out infinite 1.8s",
        }}
      >
        <div className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "#E8F9EE" }}>
          <Clock size={11} className="text-[#34C759]" strokeWidth={2.5} />
        </div>
        <span className="text-xs font-bold text-[#1D1D1F]">Chấm trong 5 giây</span>
      </div>

      {/* Score badge top-right */}
      <div
        className="absolute -top-4 -right-3 bg-white rounded-xl px-3 py-2 flex items-center gap-1.5"
        style={{
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          animation: "floatUp 5s ease-in-out infinite 0.8s",
        }}
      >
        <Star size={12} className="text-[#FF9500]" fill="#FF9500" strokeWidth={0} />
        <span className="text-xs font-bold text-[#1D1D1F]">Tăng 8 điểm</span>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes bubblePulse {
          0%, 100% { box-shadow: 0 8px 32px rgba(0,102,204,0.45), 0 0 0 0 rgba(0,102,204,0.30); }
          50%       { box-shadow: 0 8px 32px rgba(0,102,204,0.45), 0 0 0 10px rgba(0,102,204,0); }
        }
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(24px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .sticky-bubble {
          animation: bubbleIn 0.5s cubic-bezier(0.16,1,0.3,1) 1.2s both,
                     bubblePulse 2.8s ease-in-out 2s infinite;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .sticky-bubble:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 16px 48px rgba(0,102,204,0.50) !important;
          animation-play-state: paused;
        }
        .sticky-bubble:active {
          transform: scale(0.97);
        }
        .anim-0 { animation: fadeInUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-1 { animation: fadeInUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.08s both; }
        .anim-2 { animation: fadeInUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.18s both; }
        .anim-3 { animation: fadeInUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.28s both; }
        .anim-4 { animation: fadeInUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.42s both; }

        .feat-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .feat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,70,180,0.12);
        }
        .price-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .price-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,70,180,0.10);
        }
        .num-gradient {
          background: linear-gradient(135deg, #004F99 0%, #0066CC 60%, #1A8BFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .dot-grid {
          background-image: radial-gradient(circle, #C7DEFF 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* ── Trust cards ── */
        .trust-card {
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease;
          cursor: default;
        }
        .trust-card:hover {
          background: linear-gradient(145deg, #002D6B 0%, #0055BB 55%, #1477E8 100%) !important;
          transform: translateY(-8px);
          box-shadow: 0 24px 64px rgba(0,70,180,0.28) !important;
          border-color: transparent !important;
        }
        .trust-card .tc-num        { transition: color 0.3s; }
        .trust-card:hover .tc-num  { color: rgba(147,197,253,0.70) !important; }
        .trust-card .tc-q          { transition: color 0.3s; }
        .trust-card:hover .tc-q    { color: rgba(186,220,255,0.80) !important; }
        .trust-card .tc-ans        { transition: color 0.3s; }
        .trust-card:hover .tc-ans  { color: #FFFFFF !important; }
        .trust-card .tc-detail     { transition: color 0.3s; }
        .trust-card:hover .tc-detail{ color: rgba(186,220,255,0.85) !important; }
        .trust-card .tc-icon       { transition: background 0.3s; }
        .trust-card:hover .tc-icon { background: rgba(255,255,255,0.15) !important; }
        .trust-card .tc-tag        { transition: background 0.3s, color 0.3s; }
        .trust-card:hover .tc-tag  { background: rgba(255,255,255,0.12) !important; color: #93C5FD !important; }

        @media (prefers-reduced-motion: reduce) {
          .anim-0,.anim-1,.anim-2,.anim-3,.anim-4 { animation: none; }
          [style*="floatUp"] { animation: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-white text-[#1D1D1F] overflow-x-hidden">

        {/* ── Nav ─────────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-100/80"
          style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)" }}>
          <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-black tracking-tight"
                style={{ background: "linear-gradient(135deg, #004F99 0%, #0066CC 100%)" }}>
                TP
              </div>
              <span className="font-extrabold text-[#1D1D1F] text-base tracking-tight">ToPeak</span>
              <span className="text-[#AEAEB2] text-xs hidden sm:inline">TOPIK to Peak</span>
            </Link>

            <div className="hidden md:flex items-center gap-7">
              <a href="#features" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors font-medium">Tính năng</a>
              <a href="#compare"  className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors font-medium">So sánh</a>
              <a href="#pricing"  className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] transition-colors font-medium">Bảng giá</a>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/login"
                className="hidden sm:block text-sm text-[#6E6E73] hover:text-[#1D1D1F] font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50">
                Đăng nhập
              </Link>
              <Link href="/login"
                className="text-sm font-bold text-white px-4 py-2 rounded-xl transition-all hover:opacity-90 active:scale-[0.97]"
                style={{ background: "linear-gradient(135deg, #004F99 0%, #0080FF 100%)", boxShadow: "0 2px 12px rgba(0,102,204,0.30)" }}>
                Viết thử miễn phí
              </Link>
            </div>
          </nav>
        </header>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Dot grid — left half */}
            <div className="dot-grid absolute inset-0 opacity-40" />
            {/* Blue glow blob — right, behind card */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.07]"
              style={{
                background: "radial-gradient(circle, #0066CC 0%, transparent 70%)",
                filter: "blur(60px)",
                transform: "translate(30%, -20%)",
              }} />
            {/* Secondary blob */}
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.05]"
              style={{
                background: "radial-gradient(circle, #0080FF 0%, transparent 70%)",
                filter: "blur(80px)",
                transform: "translate(-30%, 30%)",
              }} />
          </div>

          <div className="relative max-w-6xl mx-auto px-5 pt-16 pb-20 md:pt-24 md:pb-32">
            <div className="grid md:grid-cols-2 gap-14 items-center">
              {/* Left */}
              <div>
                <div className="anim-0 inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full mb-6 border"
                  style={{
                    background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
                    borderColor: "#BFDBFE",
                    color: "#0066CC",
                  }}>
                  <CheckCircle size={12} strokeWidth={2.5} />
                  AI chấm theo rubric NIIED chính thức
                </div>

                <h1 className="anim-1 font-extrabold tracking-tight leading-[1.06] text-[#1D1D1F] mb-5"
                  style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)" }}>
                  Tăng <span className="num-gradient">30+ điểm</span><br />
                  phần Viết TOPIK II
                </h1>

                <p className="anim-2 text-lg text-[#6E6E73] leading-relaxed mb-8 max-w-[440px]">
                  App luyện viết Q51-54 duy nhất cho người Việt. AI chấm tức thì, feedback 100% tiếng Việt, rubric NIIED chuẩn.
                </p>

                <div className="anim-3 flex flex-wrap items-center gap-3 mb-5">
                  <Link href="/login"
                    className="inline-flex items-center gap-2 text-sm font-bold text-white px-7 py-3.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.97]"
                    style={{
                      background: "linear-gradient(135deg, #004F99 0%, #0080FF 100%)",
                      boxShadow: "0 6px 24px rgba(0,102,204,0.35)",
                    }}>
                    Viết thử miễn phí
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </Link>
                  <a href="#pricing"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0066CC] px-5 py-3.5 rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors"
                    style={{ background: "rgba(239,246,255,0.7)" }}>
                    Xem bảng giá
                    <ChevronRight size={15} strokeWidth={2.5} />
                  </a>
                </div>

                <p className="anim-4 text-xs text-[#AEAEB2]">
                  Miễn phí 5 lượt/tháng — không cần thẻ tín dụng
                </p>
              </div>

              {/* Right — grading card */}
              <div className="flex justify-center md:justify-end pt-10 md:pt-0">
                <GradingMockup />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats bar ───────────────────────────────────────────────────── */}
        <section style={{ background: "linear-gradient(135deg, #001F4D 0%, #003380 50%, #004F99 100%)" }}>
          <div className="max-w-6xl mx-auto px-5 py-12 md:py-16">
            <div className="grid grid-cols-3 gap-6 md:gap-8">
              {[
                { num: "33",      unit: "/100",  label: "Điểm Writing trung bình",       sub: "Kéo điểm xuống nhiều nhất" },
                { num: "85.000",  unit: "",      label: "Lượt thi TOPIK/năm tại Việt Nam", sub: "Cao nhất thế giới" },
                { num: "33",      unit: "%",     label: "Tổng điểm đến từ Writing",       sub: "100/300 điểm là phần Viết" },
              ].map((s, i) => (
                <div key={i} className={`text-center ${i !== 2 ? "border-r border-white/10" : ""}`}>
                  <div className="flex items-baseline justify-center gap-1 mb-1.5">
                    <span className="font-extrabold text-white tracking-tight leading-none"
                      style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}>
                      {s.num}
                    </span>
                    {s.unit && (
                      <span className="text-blue-300 font-bold text-xl">{s.unit}</span>
                    )}
                  </div>
                  <div className="text-xs md:text-sm font-semibold text-blue-100 mb-0.5">{s.label}</div>
                  <div className="text-xs text-blue-300 hidden md:block">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        <section id="features" className="relative overflow-hidden">
          {/* Background subtle gradient */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(180deg, #ffffff 0%, #F0F6FF 100%)" }} />

          <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28">
            <div className="mb-14">
              <div className="inline-block text-xs font-bold text-[#0066CC] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-4">
                Tính năng
              </div>
              <h2 className="text-3xl md:text-[2.75rem] font-extrabold tracking-tight text-[#1D1D1F] leading-tight mb-3">
                Được xây cho TOPIK II.<br />
                <span className="text-[#6E6E73] font-normal">Không phải bản dịch từ app khác.</span>
              </h2>
              <p className="text-[#6E6E73] text-base max-w-[560px]" style={{ textWrap: "balance" } as React.CSSProperties}>
                Mỗi tính năng được thiết kế riêng cho người Việt luyện thi TOPIK.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1 — accent bg, large */}
              <div className="feat-card rounded-2xl p-8 flex flex-col justify-between min-h-[280px] cursor-default"
                style={{
                  background: "linear-gradient(145deg, #002D6B 0%, #0055BB 55%, #1477E8 100%)",
                  boxShadow: "0 8px 40px rgba(0,70,180,0.25)",
                }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(255,255,255,0.18)" }}>
                  <Target size={22} strokeWidth={1.8} style={{ color: "#FFFFFF" }} />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold mb-3 leading-snug tracking-tight"
                    style={{ color: "#FFFFFF" }}>
                    Chấm <span style={{ color: "#93C5FD" }}>4 tiêu chí NIIED</span> tách biệt — không gộp chung một điểm
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(186,220,255,0.90)" }}>
                    Biết chính xác bạn yếu <strong style={{ color: "#FFFFFF", fontWeight: 700 }}>Nội dung</strong>, <strong style={{ color: "#FFFFFF", fontWeight: 700 }}>Cấu trúc</strong>, <strong style={{ color: "#FFFFFF", fontWeight: 700 }}>Ngữ pháp</strong> hay <strong style={{ color: "#FFFFFF", fontWeight: 700 }}>Phong cách</strong> — và tập trung luyện đúng chỗ.
                  </p>
                  <a href="https://exam.topik.go.kr/nasdata/webnas/raonkeditordata/uploadId/2024/02/20240227_175504804_07236.pdf"
                    target="_blank" rel="noopener noreferrer"
                    className="self-start inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97]"
                    style={{
                      background: "#FFFFFF",
                      color: "#0055BB",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                    }}>
                    <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                      <path d="M2 2h8v8M10 2 4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Bảng điểm chính thức NIIED (PDF)
                  </a>
                </div>
              </div>

              {/* Card 2 — light with border */}
              <div className="feat-card rounded-2xl p-8 bg-white border border-gray-100 flex flex-col justify-between min-h-[280px] cursor-default"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                  <MessageCircle size={22} className="text-[#0066CC]" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1D1D1F] mb-3 leading-snug tracking-tight">
                    Feedback <span className="text-[#0066CC]">100% tiếng Việt</span> — không qua bản dịch
                  </h3>
                  <p className="text-[#6E6E73] text-sm leading-relaxed">
                    Giải thích từng lỗi bằng tiếng Việt,{" "}
                    <strong className="text-[#1D1D1F]">so sánh Hàn-Việt trực tiếp</strong>.
                    Không phải dịch máy từ tiếng Anh hay tiếng Hàn.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="feat-card rounded-2xl p-7 border border-gray-100 bg-white flex items-start gap-5 cursor-default"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
                <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen size={20} className="text-amber-500" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#1D1D1F] mb-2 leading-snug tracking-tight">
                    원고지 simulator{" "}
                    <span className="text-amber-500">chuẩn thi thật</span>
                  </h3>
                  <p className="text-[#6E6E73] text-sm leading-relaxed">
                    Luyện viết trên{" "}
                    <strong className="text-[#1D1D1F]">ô vuông 원고지 thật</strong>,
                    đếm chữ theo ô như trong phòng thi. Quen tay, không bỡ ngỡ.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="feat-card rounded-2xl p-7 border border-gray-100 bg-white flex items-start gap-5 cursor-default"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap size={20} className="text-[#34C759]" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#1D1D1F] mb-2 leading-snug tracking-tight">
                    Kết quả trong{" "}
                    <span className="text-[#34C759]">5 giây</span>{" "}—
                    không chờ ngày
                  </h3>
                  <p className="text-[#6E6E73] text-sm leading-relaxed">
                    Submit bài → nhận điểm ngay.{" "}
                    Không chờ <strong className="text-[#1D1D1F]">3-7 ngày</strong> như trung tâm offline.
                    Luyện thêm 10 bài mỗi ngày nếu muốn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── AI Trust / Objection Handling ──────────────────────────────── */}
        <section className="bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-20 md:py-28">

            {/* Header */}
            <div className="text-center mb-14">
              <div className="inline-block text-sm font-bold text-[#6E6E73] bg-gray-50 border border-gray-200 px-4 py-2 rounded-full mb-5">
                Câu hỏi thường gặp
              </div>
              <h2 className="font-extrabold tracking-tight text-[#1D1D1F] leading-tight mb-4"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}>
                AI chấm có{" "}
                <span style={{ color: "#0066CC" }}>đáng tin không?</span>
              </h2>
              <p className="text-[#6E6E73] text-lg mx-auto leading-relaxed max-w-3xl">
                Đây là những băn khoăn phổ biến nhất — và câu trả lời thẳng thắn.
              </p>
            </div>

            {/* 3 cards horizontal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {[
                {
                  num: "01",
                  concern: "AI có chấm đúng như giáo viên không? Tôi sợ học sai.",
                  answer: "AI dùng đúng rubric NIIED — không tự đoán",
                  detail: "4 tiêu chí Nội dung, Tổ chức, Ngữ pháp, Phong cách là cố định do NIIED ban hành. AI áp dụng đúng bảng này — cùng tiêu chuẩn hội đồng thi dùng.",
                  tag: "Xem bảng điểm chính thức NIIED (PDF)",
                  tagHref: "https://exam.topik.go.kr/nasdata/webnas/raonkeditordata/uploadId/2024/02/20240227_175504804_07236.pdf",
                },
                {
                  num: "02",
                  concern: "Thầy tôi chấm 34 điểm, AI chấm 38 điểm — cái nào đúng?",
                  answer: "AI nhất quán 100% — không có cảm tính",
                  detail: "Giáo viên cũng có cảm tính riêng. Điểm thi thật do hội đồng NIIED quyết định theo rubric cố định — AI dùng đúng rubric đó, mỗi bài đều như nhau.",
                  tag: "Consistent, không cảm tính",
                  tagHref: null,
                },
                {
                  num: "03",
                  concern: "Luyện với AI thì ích gì — thi thật vẫn do người chấm?",
                  answer: "Luyện nhiều hơn = tiến bộ nhanh hơn",
                  detail: "Giáo viên không thể chấm 10 bài/ngày cho bạn. AI thì được. Luyện nhiều với feedback cụ thể giúp tiến bộ nhanh hơn nhiều so với học thụ động.",
                  tag: "10 bài/ngày nếu muốn",
                  tagHref: null,
                },
              ].map((item) => (
                <div key={item.num}
                  className="trust-card rounded-2xl border border-gray-100 bg-white p-8 flex flex-col gap-6"
                  style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

                  {/* Number */}
                  <span className="tc-num text-5xl font-black leading-none tracking-tight"
                    style={{ color: "#D1E3FF" }}>
                    {item.num}
                  </span>

                  {/* Question */}
                  <p className="tc-q text-base text-[#6E6E73] italic leading-relaxed">
                    &ldquo;{item.concern}&rdquo;
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-gray-100" />

                  {/* Answer block */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="tc-icon w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "#EFF6FF" }}>
                        <Check size={13} className="text-[#0066CC]" strokeWidth={3} />
                      </div>
                      <p className="tc-ans text-lg font-extrabold text-[#1D1D1F] leading-snug tracking-tight">
                        {item.answer}
                      </p>
                    </div>
                    <p className="tc-detail text-sm text-[#6E6E73] leading-relaxed">
                      {item.detail}
                    </p>
                    {item.tagHref ? (
                      <a href={item.tagHref} target="_blank" rel="noopener noreferrer"
                        className="tc-tag self-start inline-flex items-center gap-2 text-sm font-extrabold px-4 py-2 rounded-xl mt-auto transition-all hover:scale-[1.03] active:scale-[0.97]"
                        style={{ background: "linear-gradient(135deg,#FFF7ED,#FFEDD5)", color: "#C2410C", border: "1.5px solid #FED7AA", boxShadow: "0 2px 8px rgba(194,65,12,0.10)" }}>
                        <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                          <path d="M2 2h8v8M10 2 4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {item.tag}
                      </a>
                    ) : (
                      <span className="tc-tag self-start inline-flex items-center gap-1.5 text-xs font-bold text-[#0066CC] bg-blue-50 px-3 py-1.5 rounded-full mt-auto">
                        <CheckCircle size={11} strokeWidth={2.5} />
                        {item.tag}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom note */}
            <div className="flex items-center gap-4 px-6 py-5 rounded-2xl border border-blue-100 max-w-2xl mx-auto"
              style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #E0EEFF 100%)" }}>
              <Star size={18} className="text-[#0066CC] shrink-0" fill="#0066CC" stroke="none" />
              <p className="text-sm text-[#1D1D1F] leading-relaxed">
                <strong>ToPeak không thay thế giáo viên</strong> — mà giúp bạn luyện nhiều hơn,
                đúng hướng hơn giữa các buổi học.
              </p>
            </div>

          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────────── */}
        <section style={{ background: "linear-gradient(180deg, #F5F7FF 0%, #EEF3FF 100%)" }}
          className="border-y border-blue-50">
          <div className="max-w-6xl mx-auto px-5 py-20 md:py-24">
            <div className="text-center mb-16">
              <div className="inline-block text-xs font-bold text-[#0066CC] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-4">
                Cách hoạt động
              </div>
              <h2 className="text-3xl md:text-[2.75rem] font-extrabold tracking-tight text-[#1D1D1F]">
                Bắt đầu chỉ trong 3 bước
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative">
              {/* Connector */}
              <div className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px"
                style={{ background: "linear-gradient(90deg, transparent, #C7DEFF, #C7DEFF, transparent)" }} />

              {[
                {
                  step: "01", Icon: PenLine, color: "#0066CC", bg: "#EFF6FF",
                  title: "Chọn câu và viết bài",
                  desc: "Chọn Q51, Q52, Q53 hoặc Q54. Đọc đề, viết trên 원고지 ảo chuẩn format thi thật.",
                },
                {
                  step: "02", Icon: Zap, color: "#FF6B00", bg: "#FFF4EA",
                  title: "AI chấm tức thì",
                  desc: "Nhận điểm 4 tiêu chí NIIED, gợi ý cải thiện cụ thể, so sánh bài mẫu ngay lập tức.",
                },
                {
                  step: "03", Icon: BarChart2, color: "#34C759", bg: "#E8F9EE",
                  title: "Theo dõi tiến độ",
                  desc: "Dashboard phân tích điểm yếu theo tuần. Biết chính xác cần ôn tiêu chí nào để tăng điểm.",
                },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center text-center bg-white rounded-2xl p-8 border border-white/80"
                  style={{ boxShadow: "0 4px 20px rgba(0,50,150,0.07)" }}>
                  <div className="relative mb-5">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: s.bg }}>
                      <s.Icon size={26} style={{ color: s.color }} strokeWidth={1.8} />
                    </div>
                    <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full text-white text-[10px] font-extrabold flex items-center justify-center"
                      style={{ background: s.color, boxShadow: `0 2px 8px ${s.color}55` }}>
                      {s.step}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-[#1D1D1F] mb-2 text-base">{s.title}</h3>
                  <p className="text-sm text-[#6E6E73] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Compare ──────────────────────────────────────────────────────── */}
        <section id="compare" className="max-w-6xl mx-auto px-5 py-20 md:py-28">
          <div className="mb-12">
            <div className="inline-block text-xs font-bold text-[#0066CC] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-4">
              So sánh
            </div>
            <h2 className="text-3xl md:text-[2.75rem] font-extrabold tracking-tight text-[#1D1D1F]">
              So sánh lựa chọn
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-100"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
            <table className="w-full text-sm min-w-[540px]">
              <thead>
                <tr style={{ background: "linear-gradient(135deg, #F0F6FF 0%, #E8EFFF 100%)" }}>
                  <th className="text-left px-6 py-4 text-[#6E6E73] font-semibold">Tiêu chí</th>
                  <th className="px-6 py-4 font-extrabold text-center"
                    style={{ background: "rgba(0,102,204,0.06)", color: "#0066CC" }}>
                    ToPeak ✦
                  </th>
                  <th className="px-6 py-4 text-[#6E6E73] font-semibold text-center">Trung tâm offline</th>
                  <th className="px-6 py-4 text-[#6E6E73] font-semibold text-center">Easy6</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  ["Giá / tháng",           "từ 149.000đ",       "250.000 - 700.000đ",  "Miễn phí (giới hạn)"],
                  ["Thời gian chờ kết quả", "5 giây",            "3 - 7 ngày",           "Tức thì"],
                  ["Ngôn ngữ feedback",     "Tiếng Việt 100%",   "Tiếng Việt",           "Tiếng Anh"],
                  ["4 tiêu chí NIIED",      "check",             "check",                "x"],
                  ["원고지 thật",            "check",             "x",                    "x"],
                  ["Lộ trình cá nhân",      "check",             "x",                    "x"],
                  ["Thi thử đầy đủ",        "check",             "check",                "x"],
                ].map(([label, hv, offline, easy]) => (
                  <tr key={label} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-3.5 text-[#1D1D1F] font-semibold">{label}</td>
                    {[hv, offline, easy].map((val, idx) => (
                      <td key={idx} className={`px-6 py-3.5 text-center ${idx === 0 ? "font-bold text-[#0066CC]" : "text-[#6E6E73]"}`}
                        style={idx === 0 ? { background: "rgba(0,102,204,0.04)" } : {}}>
                        {val === "check" ? (
                          <Check size={16} strokeWidth={2.5}
                            className={`mx-auto ${idx === 0 ? "text-[#0066CC]" : "text-[#34C759]"}`} />
                        ) : val === "x" ? (
                          <X size={16} strokeWidth={2} className="mx-auto text-[#C7C7CC]" />
                        ) : val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────────────────────── */}
        <section id="pricing" className="border-y border-blue-50"
          style={{ background: "linear-gradient(180deg, #F5F7FF 0%, #EEF3FF 100%)" }}>
          <div className="max-w-6xl mx-auto px-5 py-20 md:py-28">
            <div className="text-center mb-14">
              <div className="inline-block text-xs font-bold text-[#0066CC] bg-white border border-blue-100 px-3 py-1.5 rounded-full mb-4">
                Bảng giá
              </div>
              <h2 className="text-3xl md:text-[2.75rem] font-extrabold tracking-tight text-[#1D1D1F] mb-3">
                Giá rõ ràng, không ràng buộc
              </h2>
              <p className="text-[#6E6E73] text-base">Bắt đầu miễn phí. Nâng cấp khi sẵn sàng.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Free */}
              <div className="price-card bg-white rounded-2xl border border-gray-200 p-6 flex flex-col"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div className="text-sm font-bold text-[#6E6E73] mb-1">Free</div>
                <div className="text-4xl font-extrabold text-[#1D1D1F] tracking-tight mb-0.5">
                  0<span className="text-lg font-normal text-[#AEAEB2]">đ</span>
                </div>
                <div className="text-xs text-[#AEAEB2] mb-5">mãi mãi</div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {["5 lượt chấm AI/tháng","Luyện Q51 - Q54","Tips & cấu trúc"].map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-[#6E6E73]">
                      <Check size={13} className="text-[#34C759] shrink-0 mt-0.5" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login"
                  className="text-center text-sm font-bold py-2.5 rounded-xl border border-gray-200 text-[#6E6E73] hover:bg-gray-50 transition-colors">
                  Bắt đầu miễn phí
                </Link>
              </div>

              {/* Pro 1 tháng */}
              <div className="price-card bg-white rounded-2xl border border-gray-200 p-6 flex flex-col"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div className="text-sm font-bold text-[#6E6E73] mb-1">Pro 1 tháng</div>
                <div className="text-4xl font-extrabold text-[#1D1D1F] tracking-tight mb-0.5">
                  149k<span className="text-lg font-normal text-[#AEAEB2]">/tháng</span>
                </div>
                <div className="text-xs text-[#AEAEB2] mb-5">thử trước khi cam kết</div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {["Chấm bài không giới hạn","Thi thử full 50 phút","Phân tích điểm yếu"].map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-[#6E6E73]">
                      <Check size={13} className="text-[#0066CC] shrink-0 mt-0.5" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing"
                  className="text-center text-sm font-bold py-2.5 rounded-xl border border-blue-200 text-[#0066CC] hover:bg-blue-50 transition-colors">
                  Đăng ký
                </Link>
              </div>

              {/* Pro 6 tháng — HIGHLIGHT */}
              <div className="price-card rounded-2xl p-6 flex flex-col relative"
                style={{
                  background: "linear-gradient(155deg, #003F8A 0%, #0066CC 60%, #1A8BFF 100%)",
                  boxShadow: "0 12px 48px rgba(0,102,204,0.35)",
                }}>
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[11px] font-extrabold bg-white rounded-full px-3.5 py-1.5"
                    style={{ color: "#0066CC", boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
                    PHỔ BIẾN NHẤT
                  </span>
                </div>
                <div className="text-sm font-bold text-blue-200 mb-1 mt-1">Pro 6 tháng</div>
                <div className="text-4xl font-extrabold text-white tracking-tight mb-0.5">
                  599k<span className="text-lg font-normal text-blue-200">/6 tháng</span>
                </div>
                <div className="text-xs font-semibold text-blue-200 mb-5">~100k/tháng — tiết kiệm 33%</div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {[
                    "Chấm bài không giới hạn",
                    "Thi thử full 50 phút",
                    "Phân tích điểm yếu",
                    "Đề TOPIK 106 mới nhất",
                    "Ưu tiên cập nhật đề mới",
                  ].map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-white">
                      <Check size={13} className="shrink-0 mt-0.5" style={{ color: "#7DD3FC" }} strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing"
                  className="text-center text-sm font-extrabold py-3 rounded-xl bg-white hover:bg-blue-50 transition-colors"
                  style={{ color: "#0066CC" }}>
                  Đăng ký 6 tháng
                </Link>
              </div>

              {/* Pro 12 tháng */}
              <div className="price-card bg-white rounded-2xl border border-gray-200 p-6 flex flex-col"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div className="text-sm font-bold text-[#6E6E73] mb-1">Pro 12 tháng</div>
                <div className="text-4xl font-extrabold text-[#1D1D1F] tracking-tight mb-0.5">
                  999k<span className="text-lg font-normal text-[#AEAEB2]">/năm</span>
                </div>
                <div className="text-xs font-bold text-[#34C759] mb-5">~83k/tháng — tiết kiệm 44%</div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {["Tất cả tính năng Pro","Hỗ trợ qua Zalo ưu tiên","Giá tốt nhất cho học dài hạn"].map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-[#6E6E73]">
                      <Check size={13} className="text-[#0066CC] shrink-0 mt-0.5" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing"
                  className="text-center text-sm font-bold py-2.5 rounded-xl border border-blue-200 text-[#0066CC] hover:bg-blue-50 transition-colors">
                  Đăng ký năm
                </Link>
              </div>
            </div>

            <p className="text-center text-xs text-[#AEAEB2] mt-8">
              Thanh toán qua chuyển khoản ngân hàng. Kích hoạt trong 2-4 giờ.
            </p>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 py-20 md:py-28">
          <div className="rounded-3xl relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #001F4D 0%, #003380 40%, #0052CC 80%, #1A8BFF 100%)",
              boxShadow: "0 32px 80px rgba(0,50,150,0.30)",
            }}>
            {/* Decorative blobs inside CTA */}
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle, #60A5FA 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle, #93C5FD 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

            <div className="relative px-8 md:px-16 py-14 md:py-16 text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-3.5 py-1.5 rounded-full mb-6">
                <Flame size={12} strokeWidth={2.5} />
                Tham gia cùng học viên đang luyện thi
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight"
                style={{ color: "#FFFFFF" }}>
                Sẵn sàng tăng điểm Writing?
              </h2>
              <p className="text-blue-100 text-base md:text-lg mb-10 max-w-[440px] mx-auto">
                Viết bài đầu tiên ngay hôm nay. Nhận feedback chi tiết trong 5 giây.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/login"
                  className="inline-flex items-center gap-2 text-sm font-extrabold bg-white px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-all active:scale-[0.97]"
                  style={{ color: "#0066CC", boxShadow: "0 4px 20px rgba(255,255,255,0.20)" }}>
                  Viết thử miễn phí
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
                <Link href="/activate"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white px-4 py-3.5 rounded-xl border border-white/20 hover:bg-white/10 transition-all">
                  Nhập mã voucher
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="border-t border-gray-100"
          style={{ background: "linear-gradient(180deg, #F8FAFF 0%, #F0F4FF 100%)" }}>
          <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black tracking-tight"
                style={{ background: "linear-gradient(135deg, #004F99 0%, #0066CC 100%)" }}>
                TP
              </div>
              <span className="text-sm font-bold text-[#1D1D1F]">ToPeak</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-[#AEAEB2]">
              <Link href="/pricing"  className="hover:text-[#6E6E73] transition-colors">Bảng giá</Link>
              <Link href="/activate" className="hover:text-[#6E6E73] transition-colors">Nhập voucher</Link>
              <Link href="/login"    className="hover:text-[#6E6E73] transition-colors">Đăng nhập</Link>
            </div>
            <p className="text-xs text-[#AEAEB2]">
              TOPIK to Peak — Lên đỉnh TOPIK
            </p>
          </div>
        </footer>

        {/* ── Sticky CTA Bubble ────────────────────────────────────────────── */}
        <Link
          href="/login"
          className="sticky-bubble fixed bottom-6 right-6 z-50 inline-flex items-center gap-2.5 text-sm font-extrabold text-white pl-5 pr-4 py-3.5 rounded-full"
          style={{
            background: "linear-gradient(135deg, #004F99 0%, #0066CC 60%, #1A8BFF 100%)",
            boxShadow: "0 8px 32px rgba(0,102,204,0.45)",
          }}
        >
          Viết thử miễn phí
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
            <ArrowRight size={14} strokeWidth={2.5} />
          </span>
        </Link>

      </div>
    </>
  )
}
