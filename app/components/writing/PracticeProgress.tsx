"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getBestPct, loadBestScoresFromDB, mergeBestScoresToLocalStorage } from "@/lib/practice-score"
import { Q51_PROMPTS, Q52_PROMPTS, Q53_PROMPTS, Q54_PROMPTS } from "@/lib/data/prompts"

const Q_TYPES = [
  {
    key: "q51", label: "Q51", title: "Thực dụng văn",
    total: Q51_PROMPTS.length, prompts: Q51_PROMPTS,
    icon: "✉️", accent: "#22c55e", accentBg: "#f0fdf4", accentText: "#15803d",
    time: "3–5 phút", href: "/practice/q51",
  },
  {
    key: "q52", label: "Q52", title: "Nghị luận ngắn",
    total: Q52_PROMPTS.length, prompts: Q52_PROMPTS,
    icon: "⚖️", accent: "#3b82f6", accentBg: "#eff6ff", accentText: "#1d4ed8",
    time: "5–7 phút", href: "/practice/q52",
  },
  {
    key: "q53", label: "Q53", title: "Phân tích biểu đồ",
    total: Q53_PROMPTS.length, prompts: Q53_PROMPTS,
    icon: "📊", accent: "#a855f7", accentBg: "#faf5ff", accentText: "#7e22ce",
    time: "10–12 phút", href: "/practice/q53",
  },
  {
    key: "q54", label: "Q54", title: "Luận văn dài",
    total: Q54_PROMPTS.length, prompts: Q54_PROMPTS,
    icon: "📝", accent: "#f97316", accentBg: "#fff7ed", accentText: "#c2410c",
    time: "28–35 phút", href: "/practice/q54",
  },
]

type QStats = {
  attempted: number
  passed: number   // ≥80%
  best: number | null
}

export default function PracticeProgress() {
  const [stats, setStats] = useState<Record<string, QStats>>({})
  const [totalEssays, setTotalEssays] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // Read from localStorage first (instant)
    const initial: Record<string, QStats> = {}
    let total = 0

    for (const q of Q_TYPES) {
      let attempted = 0, passed = 0, best: number | null = null
      for (const p of q.prompts) {
        const pct = getBestPct(q.key, p.id)
        if (pct !== null) {
          attempted++
          total++
          if (pct >= 80) passed++
          if (best === null || pct > best) best = pct
        }
      }
      initial[q.key] = { attempted, passed, best }
    }
    setStats(initial)
    setTotalEssays(total)

    // Read streak from localStorage
    const s = parseInt(localStorage.getItem("hv_streak") ?? "0")
    setStreak(s)

    // Merge DB scores async
    for (const q of Q_TYPES) {
      loadBestScoresFromDB(q.key as "q51"|"q52"|"q53"|"q54").then((dbScores) => {
        mergeBestScoresToLocalStorage(q.key, dbScores)
        setStats((prev) => {
          let attempted = 0, passed = 0, best: number | null = null
          let total2 = 0
          for (const p of q.prompts) {
            const dbPct = dbScores[p.id] ?? null
            const lsPct = getBestPct(q.key, p.id)
            const pct = dbPct !== null && lsPct !== null
              ? Math.max(dbPct, lsPct)
              : dbPct ?? lsPct
            if (pct !== null) {
              attempted++
              total2++
              if (pct >= 80) passed++
              if (best === null || pct > best) best = pct
            }
          }
          setTotalEssays((t) => t - (prev[q.key]?.attempted ?? 0) + total2)
          return { ...prev, [q.key]: { attempted, passed, best } }
        })
      })
    }
  }, [])

  const totalAttempted = Q_TYPES.reduce((s, q) => s + (stats[q.key]?.attempted ?? 0), 0)
  const totalPassed   = Q_TYPES.reduce((s, q) => s + (stats[q.key]?.passed ?? 0), 0)

  return (
    <div className="space-y-4">
      {/* ── Quick stats row ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl">🔥</div>
          <div>
            <div className="text-[22px] font-extrabold text-slate-900 leading-none">{streak}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Ngày streak</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">✍️</div>
          <div>
            <div className="text-[22px] font-extrabold text-slate-900 leading-none">{totalAttempted}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Đề đã luyện</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">🎯</div>
          <div>
            <div className="text-[22px] font-extrabold text-slate-900 leading-none">{totalPassed}</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">Đề đạt ≥80%</div>
          </div>
        </div>
      </div>

      {/* ── Per Q-type progress ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Tiến độ luyện tập</h2>
          {totalAttempted === 0 && (
            <span className="text-xs text-slate-400">Chưa có dữ liệu — bắt đầu luyện để xem tiến độ</span>
          )}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Q_TYPES.map((q) => {
            const s = stats[q.key] ?? { attempted: 0, passed: 0, best: null }
            const pct = Math.round((s.attempted / q.total) * 100)
            const bestColor = s.best === null ? "#94a3b8"
              : s.best >= 80 ? "#22c55e"
              : s.best >= 60 ? "#f59e0b"
              : "#f97316"

            return (
              <Link key={q.key} href={q.href} className="group flex flex-col gap-3 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all" style={{ background: "#fafbfc" }}>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{q.icon}</span>
                    <span className="text-xs font-extrabold" style={{ color: q.accentText }}>{q.label}</span>
                  </div>
                  {s.best !== null && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: s.best >= 80 ? "#dcfce7" : s.best >= 60 ? "#fef3c7" : "#ffedd5", color: bestColor }}>
                      Best {s.best}%
                    </span>
                  )}
                </div>

                {/* Title */}
                <div>
                  <div className="text-xs font-bold text-slate-800 leading-tight">{q.title}</div>
                  <div className="text-xs text-slate-400">{q.time}</div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-slate-500">
                      <span className="font-bold text-slate-700">{s.attempted}</span>/{q.total} đề
                    </span>
                    <span className="text-[10px] text-slate-400">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: s.attempted === 0 ? "#e2e8f0" : q.accent }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <span className="text-xs font-bold group-hover:translate-x-0.5 transition-transform" style={{ color: q.accent }}>
                  {s.attempted === 0 ? "Bắt đầu →" : s.attempted === q.total ? "Ôn lại →" : "Tiếp tục →"}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
