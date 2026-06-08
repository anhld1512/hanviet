"use client"

import { useState } from "react"
import { difficultyLabel, difficultyColor } from "@/lib/practice-score"
import type { WritingPrompt } from "@/lib/data/prompts"

function getTopikNum(source: string) {
  const m = source.match(/(\d+)/)
  return m ? parseInt(m[1]) : 0
}

function ScoreDot({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="text-xs text-gray-300">—</span>
  const color = pct >= 80 ? "#22C55E" : pct >= 60 ? "#F59E0B" : "#F97316"
  return (
    <span className="text-xs font-bold tabular-nums" style={{ color }}>
      {pct}%
    </span>
  )
}

type Props = {
  prompts: WritingPrompt[]
  scores: Record<number, number | null>
  onSelect: (p: WritingPrompt) => void
  questionType: string
  renderExtra?: (p: WritingPrompt) => React.ReactNode
}

export default function PromptGrid({ prompts, scores, onSelect, questionType, renderExtra }: Props) {
  const [showAll, setShowAll]     = useState(false)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError]   = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [sweepKey, setSweepKey]   = useState(0)   // tăng mỗi lần hover để restart sweep

  const sorted = [...prompts].sort((a, b) => getTopikNum(b.source) - getTopikNum(a.source))
  const maxTopik = getTopikNum(sorted[0]?.source ?? "")

  const INITIAL_SHOW = 5
  const visible = showAll ? sorted : sorted.slice(0, INITIAL_SHOW)
  const hiddenCount = sorted.length - INITIAL_SHOW

  async function handleGenerate() {
    setGenerating(true)
    setGenError(null)
    try {
      const res = await fetch(`/api/generate-prompt?type=${questionType}`)
      if (!res.ok) {
        const e = await res.json()
        throw new Error(e.error ?? "Lỗi")
      }
      const prompt: WritingPrompt = await res.json()
      onSelect(prompt)
    } catch (e) {
      setGenError(e instanceof Error ? e.message : "Không thể tạo đề, thử lại")
    } finally {
      setGenerating(false)
    }
  }

  // ── Derived hover / loading styles ──────────────────────────────────────────
  const cardStyle: React.CSSProperties = generating
    ? {
        background: "linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 100%)",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 2px 8px rgba(30,64,175,0.2)",
        transform: "scale(1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }
    : isHovered
    ? {
        background: "linear-gradient(145deg, #2563eb 0%, #3b82f6 100%)",
        border: "1px solid rgba(255,255,255,0.25)",
        boxShadow: "0 10px 36px rgba(30,64,175,0.55), 0 0 0 1px rgba(255,255,255,0.12)",
        transform: "scale(1.025) translateY(-2px)",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
      }
    : {
        background: "linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 100%)",
        border: "1px solid rgba(255,255,255,0.12)",
        animation: "ai-breathe 3s ease-in-out infinite",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
      }

  return (
    <div className="space-y-3">
      <style>{`
        /* ── Idle breathe ── */
        @keyframes ai-breathe {
          0%, 100% { box-shadow: 0 2px 8px rgba(30,64,175,0.2), 0 0 0 0 rgba(30,64,175,0); }
          50%       { box-shadow: 0 4px 20px rgba(30,64,175,0.45), 0 0 0 3px rgba(30,64,175,0.15); }
        }
        /* ── Hover light sweep (once) ── */
        @keyframes ai-sweep {
          0%   { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
          15%  { opacity: 0.9; }
          85%  { opacity: 0.7; }
          100% { transform: translateX(280%) skewX(-18deg); opacity: 0; }
        }
        /* ── ✦ idle wiggle ── */
        @keyframes ai-sparkle-idle {
          0%,100% { transform: rotate(0deg) scale(1); }
          25%     { transform: rotate(18deg) scale(1.2); }
          75%     { transform: rotate(-12deg) scale(1.05); }
        }
        /* ── ✦ hover fast spin ── */
        @keyframes ai-sparkle-hover {
          from { transform: rotate(0deg) scale(1.15); }
          to   { transform: rotate(360deg) scale(1.15); }
        }
        /* ── Loading spinner ── */
        @keyframes ai-ring {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        /* ── Loading dots ── */
        @keyframes ai-dot {
          0%,80%,100% { transform: scale(0.6); opacity: 0.3; }
          40%         { transform: scale(1);   opacity: 1; }
        }
      `}</style>

      {/* ── Grid: AI card đầu tiên + prompt cards ── */}
      <div className="grid grid-cols-3 gap-2.5">

        {/* ── AI generate card ── */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          onMouseEnter={() => { if (!generating) { setIsHovered(true); setSweepKey(k => k + 1) } }}
          onMouseLeave={() => setIsHovered(false)}
          className="relative overflow-hidden text-left rounded-xl px-3.5 py-3 flex flex-col"
          style={cardStyle}
        >
          {/* ── Light sweep overlay (triggered on each hover) ── */}
          {isHovered && !generating && (
            <span
              key={sweepKey}
              className="absolute inset-y-0 w-1/3 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
                animation: "ai-sweep 0.65s ease-out forwards",
              }}
            />
          )}

          {/* ── Loading state ── */}
          {generating ? (
            <div className="flex flex-col items-center justify-center gap-2.5 flex-1 py-1">
              {/* Spinner ring */}
              <div className="relative w-9 h-9">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "2.5px solid rgba(255,255,255,0.15)",
                    borderTopColor: "rgba(255,255,255,0.9)",
                    animation: "ai-ring 0.75s linear infinite",
                  }}
                />
                <div
                  className="absolute inset-1.5 rounded-full"
                  style={{
                    border: "1.5px solid rgba(251,191,36,0.2)",
                    borderTopColor: "rgba(251,191,36,0.7)",
                    animation: "ai-ring 1.2s linear infinite reverse",
                  }}
                />
              </div>
              {/* Text */}
              <span className="text-xs font-semibold text-white/90">AI đang tạo đề</span>
              {/* Dots */}
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-blue-200"
                    style={{ animation: `ai-dot 1.3s ease-in-out ${i * 0.18}s infinite` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Top row — badge + sparkle */}
              <div className="flex items-center justify-between mb-2 relative z-10">
                <span className="text-[11px] font-bold text-blue-200 bg-white/10 border border-white/20 px-2 py-0.5 rounded-full">
                  AI tạo
                </span>
                <span
                  className="text-base select-none"
                  style={{
                    color: "#fbbf24",
                    display: "inline-block",
                    animation: isHovered
                      ? "ai-sparkle-hover 0.5s linear infinite"
                      : "ai-sparkle-idle 3s ease-in-out infinite",
                  }}
                >
                  ✦
                </span>
              </div>

              {/* Title */}
              <p
                className="text-sm font-bold leading-snug mb-1.5 relative z-10 transition-colors duration-150"
                style={{ color: isHovered ? "#ffffff" : "rgba(255,255,255,0.95)" }}
              >
                Tạo đề ngẫu nhiên
              </p>

              {/* Tagline */}
              <p
                className="text-xs leading-snug mb-auto relative z-10 transition-opacity duration-150"
                style={{ color: "rgba(191,219,254,0.85)" }}
              >
                để rèn phản xạ với đề chưa gặp
              </p>

              {/* Bottom row */}
              <div className="flex items-center justify-between mt-2.5 relative z-10">
                <span className="text-xs text-blue-300/70">AI · Mỗi lần khác nhau</span>
                <span
                  className="text-xs font-bold text-white transition-transform duration-150"
                  style={{ transform: isHovered ? "translateX(3px)" : "translateX(0)" }}
                >
                  Tạo →
                </span>
              </div>
            </>
          )}
        </button>

        {/* ── Prompt cards ── */}
        {visible.map((p) => {
          const pct = scores[p.id] ?? null
          const isNewest = getTopikNum(p.source) === maxTopik

          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="text-left rounded-xl border border-gray-200 bg-white px-3.5 py-3 hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${difficultyColor(p.difficulty)}`}>
                    {difficultyLabel(p.difficulty)}
                  </span>
                  {isNewest && (
                    <span className="text-[11px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">Mới</span>
                  )}
                </div>
                <ScoreDot pct={pct} />
              </div>

              <p className="text-sm font-semibold text-gray-900 leading-snug mb-1.5 group-hover:text-blue-700 transition-colors line-clamp-2">
                {p.context}
              </p>

              {renderExtra?.(p)}

              <div className="flex items-center justify-between mt-2.5">
                <span className="text-xs text-gray-400">{p.source}</span>
                <span className="text-xs font-medium text-gray-400 group-hover:text-blue-500 transition-colors">
                  {pct !== null ? "Luyện lại →" : "Bắt đầu →"}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {genError && <p className="text-xs text-red-500 pl-1">{genError}</p>}

      {!showAll && hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2.5 rounded-xl border border-dashed border-gray-200 text-sm text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all"
        >
          Xem thêm {hiddenCount} đề ↓
        </button>
      )}
      {showAll && sorted.length > INITIAL_SHOW && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full py-2 rounded-xl border border-gray-200 text-sm text-gray-400 hover:text-gray-500 transition-colors"
        >
          Thu gọn ↑
        </button>
      )}
    </div>
  )
}
