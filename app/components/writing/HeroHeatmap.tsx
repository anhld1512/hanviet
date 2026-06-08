"use client"

import { useEffect, useState } from "react"
import { getActivity, getStreak, getTotalEssays } from "@/lib/activity-tracker"

// Hiển thị 15 tuần gần nhất (hàng = Mon→Sun, cột = tuần)
const WEEKS = 15
const DAYS_LABELS = ["T2", "", "T4", "", "T6", "", "CN"]

function getColor(count: number) {
  if (count === 0) return "#e2e8f0"   // gray — no activity
  if (count === 1) return "#CCE0F5"   // blue-200
  if (count === 2) return "#4D9ED6"   // blue-400
  return "#0066CC"                     // blue-600
}

function buildGrid(activity: Record<string, number>) {
  // Build array of { date, count } for last WEEKS*7 days, aligned to week start (Mon)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Find last Monday
  const dayOfWeek = today.getDay() // 0=Sun, 1=Mon ... 6=Sat
  const daysFromMon = (dayOfWeek + 6) % 7 // days since last Monday
  const lastMon = new Date(today)
  lastMon.setDate(today.getDate() - daysFromMon)

  // Build weeks array: each week = 7 days starting from Monday
  const weeks: { date: string; count: number }[][] = []
  for (let w = WEEKS - 1; w >= 0; w--) {
    const week: { date: string; count: number }[] = []
    for (let d = 0; d < 7; d++) {
      const dt = new Date(lastMon)
      dt.setDate(lastMon.getDate() - w * 7 + d)
      const key = dt.toISOString().slice(0, 10)
      const isFuture = dt > today
      week.push({ date: key, count: isFuture ? -1 : (activity[key] ?? 0) })
    }
    weeks.push(week)
  }
  return weeks
}

export default function HeroHeatmap() {
  const [activity, setActivity] = useState<Record<string, number>>({})
  const [streak, setStreak] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setActivity(getActivity())
    setStreak(getStreak())
    setTotal(getTotalEssays())
  }, [])

  const weeks = buildGrid(activity)

  // Month labels
  const monthLabels: { label: string; col: number }[] = []
  weeks.forEach((week, i) => {
    const firstDay = new Date(week[0].date)
    if (i === 0 || firstDay.getDate() <= 7) {
      const mo = firstDay.toLocaleString("vi-VN", { month: "short" })
      if (!monthLabels.find(m => m.label === mo)) {
        monthLabels.push({ label: mo, col: i })
      }
    }
  })

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* Month labels */}
      <div className="flex gap-1 pl-6">
        {weeks.map((_, i) => {
          const ml = monthLabels.find(m => m.col === i)
          return (
            <div key={i} className="w-[14px] text-[9px] text-blue-300/80 font-medium leading-none text-center">
              {ml ? ml.label : ""}
            </div>
          )
        })}
      </div>

      {/* Grid rows */}
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 pr-1">
          {DAYS_LABELS.map((d, i) => (
            <div key={i} className="h-[14px] text-[9px] text-blue-300/70 font-medium leading-none flex items-center">
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                title={day.count > 0 ? `${day.date}: ${day.count} bài` : day.date}
                className="w-[14px] h-[14px] rounded-[3px]"
                style={{
                  background: day.count === -1 ? "transparent" : getColor(day.count),
                  opacity: day.count === -1 ? 0 : 1,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend + stats */}
      <div className="flex items-center justify-between pl-6">
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-blue-300/70">Ít</span>
          {[0, 1, 2, 3].map(v => (
            <div key={v} className="w-[10px] h-[10px] rounded-[2px]" style={{ background: getColor(v) }} />
          ))}
          <span className="text-[9px] text-blue-300/70">Nhiều</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-blue-200/70">{total} bài</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-base">🔥</span>
            <span className="text-[18px] font-extrabold text-white leading-none">{streak}</span>
            <span className="text-[10px] text-blue-200/80 font-medium leading-tight">ngày<br/>streak</span>
          </div>
        </div>
      </div>
    </div>
  )
}
