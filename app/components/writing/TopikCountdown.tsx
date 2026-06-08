"use client"

import { useEffect, useState } from "react"

const TOPIK_DATES = [
  new Date("2025-07-13"),
  new Date("2025-10-12"),
  new Date("2025-11-16"),
  new Date("2026-04-12"),
  new Date("2026-07-12"),
  new Date("2026-10-11"),
  new Date("2027-04-11"),
  new Date("2027-07-11"),
]

function getNextTopik() {
  const now = new Date()
  return TOPIK_DATES.find(d => d > now) ?? TOPIK_DATES[TOPIK_DATES.length - 1]
}

function getDaysLeft(target: Date) {
  const now = new Date()
  // So sánh ngày calendar (bỏ qua giờ/phút/giây/múi giờ)
  // tránh lệch ±1 ngày do UTC vs local timezone
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const diff = targetMidnight.getTime() - todayMidnight.getTime()
  return Math.max(0, Math.round(diff / 86400000))
}

function formatDate(d: Date) {
  return d.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" })
}

function getMessage(days: number): { line1: string; line2: string } {
  if (days === 0)  return { line1: "Hôm nay thi rồi!", line2: "Bình tĩnh — bạn đã chuẩn bị đủ rồi. Cứ vào làm thôi." }
  if (days <= 3)   return { line1: "Vài ngày cuối rồi.", line2: "Đừng học thêm cái mới — ôn lại những gì đã biết và ngủ đủ giấc." }
  if (days <= 7)   return { line1: "Tuần cuối trước thi.", line2: "Làm thử 1 đề thi toàn phần để quen với áp lực thời gian." }
  if (days <= 14)  return { line1: "2 tuần nữa thôi.", line2: "Tập trung vào mẫu câu Q54 và cấu trúc Q53 — đây là 80 điểm." }
  if (days <= 30)  return { line1: "Đang vào giai đoạn nước rút.", line2: "Luyện đều mỗi ngày, tập trung điểm yếu — đây là lúc tiến nhanh nhất." }
  if (days <= 60)  return { line1: "Còn đủ thời gian nếu bắt đầu ngay.", line2: "Học 30 phút mỗi ngày từ hôm nay sẽ khác hoàn toàn so với dồn vào cuối." }
  if (days <= 90)  return { line1: "Thời gian đang chạy.", line2: "Xây nền vững từ bây giờ — đừng để đến gần thi mới cuống." }
  return             { line1: "Còn nhiều thời gian.", line2: "Nhưng người pass TOPIK không phải người học nhiều — là người học đều." }
}

// ── Flip Card ────────────────────────────────────────────────────────────────

function FlipCard({ digit }: { digit: string }) {
  return (
    <div className="relative w-14 h-[72px] rounded-xl overflow-hidden select-none"
      style={{ boxShadow: "0 4px 14px rgba(0,102,204,0.25)" }}>
      {/* Top half */}
      <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden flex items-end justify-center"
        style={{ background: "#0071E3", borderRadius: "12px 12px 0 0" }}>
        <span className="text-[52px] font-black text-white leading-none"
          style={{ letterSpacing: "-0.05em", transform: "translateY(50%)" }}>
          {digit}
        </span>
      </div>

      {/* Divider */}
      <div className="absolute top-1/2 inset-x-0 z-10">
        <div className="w-full h-px bg-white/20" />
      </div>
      <div className="absolute top-1/2 inset-x-0 z-10 mt-px">
        <div className="w-full h-px bg-[#003D99]/40" />
      </div>

      {/* Bottom half */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden flex items-start justify-center"
        style={{ background: "#004F99", borderRadius: "0 0 12px 12px" }}>
        <span className="text-[52px] font-black text-white leading-none"
          style={{ letterSpacing: "-0.05em", transform: "translateY(-50%)" }}>
          {digit}
        </span>
      </div>

      {/* Left screw */}
      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/20 z-20" />
      {/* Right screw */}
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/20 z-20" />
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function TopikCountdown() {
  const [days, setDays] = useState<number | null>(null)
  const [examDate, setExamDate] = useState<Date | null>(null)

  useEffect(() => {
    const next = getNextTopik()
    setExamDate(next)
    setDays(getDaysLeft(next))
    const t = setInterval(() => setDays(getDaysLeft(next)), 60_000)
    return () => clearInterval(t)
  }, [])

  if (days === null || !examDate) {
    return <div className="w-56 h-20 rounded-2xl bg-white/30 animate-pulse" />
  }

  const digits = String(days).padStart(2, "0").split("")
  const msg = getMessage(days)

  return (
    <div className="flex flex-col gap-3 min-w-[240px]">
      {/* Label */}
      <p className="text-[10px] font-bold text-[#AEAEB2] uppercase tracking-widest">
        TOPIK II kỳ tiếp theo
      </p>

      {/* Flip cards + label */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          {digits.map((d, i) => <FlipCard key={i} digit={d} />)}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-[#1D1D1F]">ngày</span>
          <span className="text-sm font-bold text-[#1D1D1F]">nữa</span>
        </div>
      </div>

      {/* Exam date */}
      <span className="text-xs font-semibold text-[#6E6E73] bg-white/60 border border-gray-200 px-2.5 py-1 rounded-full self-start">
        {formatDate(examDate)}
      </span>

      {/* Message */}
      <div>
        <p className="text-xs font-bold text-[#1D1D1F] mb-0.5">{msg.line1}</p>
        <p className="text-xs text-[#6E6E73] leading-relaxed max-w-[230px]">{msg.line2}</p>
      </div>
    </div>
  )
}
