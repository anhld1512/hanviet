"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Zap } from "lucide-react"

type UsageStatus = {
  allowed: boolean
  isPro: boolean
  used: number
  remaining: number
  bonus: number
}

export default function FreeUsageStrip() {
  const [status, setStatus] = useState<UsageStatus | null>(null)

  useEffect(() => {
    fetch("/api/usage-status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {})
  }, [])

  // Đang load hoặc Pro → không hiển thị gì
  if (!status || status.isPro) return null

  const total = 5
  const used = status.bonus > 0 ? 0 : status.used
  const remaining = status.bonus > 0 ? status.bonus : status.remaining
  const pct = Math.round(((total - remaining) / total) * 100)
  const isEmpty = remaining <= 0 && status.bonus <= 0

  if (isEmpty) {
    return (
      <div className="mb-6 rounded-2xl overflow-hidden border border-red-200 bg-red-50">
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <span className="text-xl">🚫</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-red-700 leading-snug">Bạn đã dùng hết 5 lượt chấm miễn phí tháng này</p>
            <p className="text-xs text-red-500 mt-0.5">Nâng cấp Pro để luyện không giới hạn, chấm không giới hạn</p>
          </div>
          <Link
            href="/pricing"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #0066CC, #004F99)", boxShadow: "0 4px 12px rgba(0,102,204,0.25)" }}
          >
            <Zap size={13} />
            Nâng cấp Pro
          </Link>
        </div>
        {/* Progress bar — full red */}
        <div className="h-1 bg-red-200">
          <div className="h-full bg-red-500 w-full" />
        </div>
      </div>
    )
  }

  // Cảnh báo khi còn ≤ 2 lượt
  const isLow = remaining <= 2

  return (
    <div
      className="mb-6 rounded-2xl overflow-hidden"
      style={{
        border: isLow ? "1px solid #FED7AA" : "1px solid #E5E5EA",
        background: isLow ? "#FFF7ED" : "#FFFFFF",
      }}
    >
      <div className="px-5 py-3.5 flex items-center gap-4">
        {/* Left: counter */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {status.bonus > 0 ? (
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                🎁 Bonus
              </span>
            ) : (
              <span className="text-xs font-semibold" style={{ color: isLow ? "#C2410C" : "#6E6E73" }}>
                Lượt chấm miễn phí
              </span>
            )}
            <span
              className="text-xs font-bold ml-auto"
              style={{ color: isLow ? "#C2410C" : "#1D1D1F" }}
            >
              {remaining}/{status.bonus > 0 ? remaining + used : total} còn lại
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: isLow ? "#FED7AA" : "#F0F0F5" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(4, 100 - pct)}%`,
                background: isLow
                  ? "linear-gradient(90deg, #F97316, #EA580C)"
                  : "linear-gradient(90deg, #60A5FA, #2563EB)",
              }}
            />
          </div>
          {isLow && (
            <p className="text-[11px] text-orange-600 mt-1">
              Sắp hết — nâng cấp Pro để luyện không giới hạn
            </p>
          )}
        </div>

        {/* Right: CTA khi còn ≤ 2 lượt */}
        {isLow && (
          <Link
            href="/pricing"
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
            style={{ background: "#0066CC" }}
          >
            <Zap size={12} />
            Nâng cấp
          </Link>
        )}
      </div>
    </div>
  )
}
