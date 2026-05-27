"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getBestPct, loadBestScoresFromDB, mergeBestScoresToLocalStorage } from "@/lib/practice-score"
import { Q51_PROMPTS, Q52_PROMPTS, Q53_PROMPTS, Q54_PROMPTS } from "@/lib/data/prompts"
import { getStreak, getTotalEssays } from "@/lib/activity-tracker"

const RINGS = [
  { key: "q51", label: "Q51", color: "#22c55e", track: "#dcfce7", prompts: Q51_PROMPTS, href: "/practice/q51" },
  { key: "q52", label: "Q52", color: "#3b82f6", track: "#dbeafe", prompts: Q52_PROMPTS, href: "/practice/q52" },
  { key: "q53", label: "Q53", color: "#a855f7", track: "#f3e8ff", prompts: Q53_PROMPTS, href: "/practice/q53" },
  { key: "q54", label: "Q54", color: "#f97316", track: "#ffedd5", prompts: Q54_PROMPTS, href: "/practice/q54" },
]

function Ring({ color, track, pct, label, href }: {
  color: string; track: string; pct: number | null; label: string; href: string
}) {
  const filled = pct ?? 0
  const displayPct = pct === null ? null : pct

  return (
    <Link href={href} className="flex flex-col items-center gap-1.5 group">
      {/* Ring */}
      <div
        className="relative w-[62px] h-[62px] rounded-full transition-transform group-hover:scale-105"
        style={{
          background: `conic-gradient(${color} ${filled}%, ${track} 0%)`,
        }}
      >
        {/* Inner circle */}
        <div
          className="absolute inset-[7px] rounded-full flex flex-col items-center justify-center"
          style={{ background: "rgba(248,249,251,0.95)" }}
        >
          {displayPct !== null ? (
            <span className="text-[13px] font-extrabold leading-none" style={{ color }}>
              {displayPct}
            </span>
          ) : (
            <span className="text-[16px] leading-none text-slate-300">—</span>
          )}
          {displayPct !== null && (
            <span className="text-[8px] text-slate-400 leading-none">%</span>
          )}
        </div>
      </div>
      {/* Label */}
      <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </Link>
  )
}

export default function ScoreRings() {
  const [bests, setBests] = useState<Record<string, number | null>>({
    q51: null, q52: null, q53: null, q54: null,
  })
  const [streak, setStreak] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // Read localStorage instantly
    const init: Record<string, number | null> = {}
    for (const r of RINGS) {
      let best: number | null = null
      for (const p of r.prompts) {
        const pct = getBestPct(r.key, p.id)
        if (pct !== null && (best === null || pct > best)) best = pct
      }
      init[r.key] = best
    }
    setBests(init)
    setStreak(getStreak())
    setTotal(getTotalEssays())

    // Merge DB async
    for (const r of RINGS) {
      loadBestScoresFromDB(r.key as "q51"|"q52"|"q53"|"q54").then((dbScores) => {
        mergeBestScoresToLocalStorage(r.key, dbScores)
        let best: number | null = null
        for (const p of r.prompts) {
          const db = dbScores[p.id] ?? null
          const ls = getBestPct(r.key, p.id)
          const v = db !== null && ls !== null ? Math.max(db, ls) : db ?? ls
          if (v !== null && (best === null || v > best)) best = v
        }
        setBests((prev) => ({ ...prev, [r.key]: best }))
      })
    }
  }, [])

  const doneCount = Object.values(bests).filter(v => v !== null).length

  return (
    <div className="flex flex-col items-end gap-4">
      {/* 4 rings in 2×2 grid */}
      <div className="grid grid-cols-2 gap-4">
        {RINGS.map((r) => (
          <Ring
            key={r.key}
            color={r.color}
            track={r.track}
            pct={bests[r.key] ?? null}
            label={r.label}
            href={r.href}
          />
        ))}
      </div>

      {/* Mini stats row */}
      <div className="flex items-center gap-3 text-right">
        {total > 0 && (
          <span className="text-[11px] text-slate-400">
            <span className="font-bold text-slate-600">{total}</span> bài đã viết
          </span>
        )}
        {doneCount < 4 && (
          <span className="text-[11px] text-indigo-400 font-medium">
            {4 - doneCount} loại chưa thử
          </span>
        )}
        <div className="flex items-center gap-1">
          <span className="text-base">🔥</span>
          <span className="text-[15px] font-extrabold text-slate-700 leading-none">{streak}</span>
          <span className="text-[10px] text-slate-400">ngày</span>
        </div>
      </div>
    </div>
  )
}
