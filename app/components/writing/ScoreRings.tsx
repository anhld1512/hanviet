"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getBestPct, loadBestScoresFromDB, mergeBestScoresToLocalStorage } from "@/lib/practice-score"
import { Q51_PROMPTS, Q52_PROMPTS, Q53_PROMPTS, Q54_PROMPTS } from "@/lib/data/prompts"
import { getStreak, getTotalEssays } from "@/lib/activity-tracker"

// Apple iOS system colors
const RINGS = [
  { key: "q51", label: "Q51", color: "#007AFF", track: "#E8F0FE", prompts: Q51_PROMPTS, href: "/practice/q51" },
  { key: "q52", label: "Q52", color: "#34C759", track: "#E8F8ED", prompts: Q52_PROMPTS, href: "/practice/q52" },
  { key: "q53", label: "Q53", color: "#FF9500", track: "#FFF3E0", prompts: Q53_PROMPTS, href: "/practice/q53" },
  { key: "q54", label: "Q54", color: "#FF2D55", track: "#FFE8EE", prompts: Q54_PROMPTS, href: "/practice/q54" },
]

function Ring({ color, track, pct, label, href }: {
  color: string; track: string; pct: number | null; label: string; href: string
}) {
  const filled = pct ?? 0

  return (
    <Link href={href} className="flex flex-col items-center gap-2 group">
      {/* Ring */}
      <div
        className="relative w-[80px] h-[80px] rounded-full transition-transform duration-200 group-hover:scale-105"
        style={{ background: `conic-gradient(${color} ${filled}%, ${track} 0%)` }}
      >
        {/* Inner circle */}
        <div
          className="absolute inset-[9px] rounded-full flex flex-col items-center justify-center gap-0.5"
          style={{ background: "rgba(255,255,255,0.97)" }}
        >
          {pct !== null ? (
            <>
              <span className="text-[17px] font-extrabold leading-none" style={{ color }}>{pct}</span>
              <span className="text-[9px] text-[#AEAEB2] leading-none font-medium">%</span>
            </>
          ) : (
            <span className="text-[20px] leading-none text-[#D2D2D7]">—</span>
          )}
        </div>
      </div>
      {/* Label */}
      <span className="text-xs font-bold text-[#6E6E73] group-hover:text-[#1D1D1F] transition-colors">{label}</span>
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
    <div className="flex flex-col gap-4">
      {/* 4 rings — horizontal row */}
      <div className="flex items-end gap-5">
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {doneCount < 4 && (
            <span className="text-xs text-blue-500 font-semibold">
              {4 - doneCount} loại chưa thử →
            </span>
          )}
          {total > 0 && (
            <span className="text-xs text-[#AEAEB2]">
              <span className="font-bold text-slate-600">{total}</span> bài viết
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm">🔥</span>
          <span className="text-sm font-extrabold text-slate-700 leading-none">{streak}</span>
          <span className="text-[10px] text-[#AEAEB2] ml-0.5">ngày streak</span>
        </div>
      </div>
    </div>
  )
}
