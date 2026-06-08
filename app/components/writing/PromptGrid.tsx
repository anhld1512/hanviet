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
  const [showAll, setShowAll] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)

  const sorted = [...prompts].sort((a, b) => getTopikNum(b.source) - getTopikNum(a.source))
  const maxTopik = getTopikNum(sorted[0]?.source ?? "")

  const INITIAL_SHOW = 6
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

  return (
    <div className="space-y-3">

      {/* ── AI generate — breathing glow strip ── */}
      <style>{`
        @keyframes ai-breathe {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59,130,246,0), 0 1px 3px rgba(59,130,246,0.08);
            border-color: rgb(191,219,254);
            background-color: rgb(239,246,255);
          }
          50% {
            box-shadow: 0 0 18px 3px rgba(59,130,246,0.22), 0 1px 3px rgba(59,130,246,0.1);
            border-color: rgb(96,165,250);
            background-color: rgb(219,234,254);
          }
        }
        @keyframes ai-sparkle-spin {
          0%   { transform: rotate(0deg) scale(1);    opacity: 1; }
          25%  { transform: rotate(20deg) scale(1.2); opacity: 0.9; }
          50%  { transform: rotate(0deg) scale(1);    opacity: 1; }
          75%  { transform: rotate(-15deg) scale(1.1);opacity: 0.95; }
          100% { transform: rotate(0deg) scale(1);    opacity: 1; }
        }
        @keyframes generating-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>

      <button
        onClick={handleGenerate}
        disabled={generating}
        className="relative w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left disabled:opacity-60 group transition-colors"
        style={!generating ? {
          animation: "ai-breathe 3s ease-in-out infinite",
        } : {
          borderColor: "rgb(191,219,254)",
          backgroundColor: "rgb(239,246,255)",
        }}
      >
        {/* Sparkle icon — wiggles in sync with breathe */}
        <span
          className="text-base shrink-0 select-none text-blue-500"
          style={!generating ? {
            display: "inline-block",
            animation: "ai-sparkle-spin 3s ease-in-out infinite",
          } : {}}
        >
          {generating ? "⏳" : "✦"}
        </span>

        <div className="flex-1 min-w-0">
          <span
            className="text-sm font-semibold text-blue-800"
            style={generating ? { animation: "generating-pulse 1.2s ease-in-out infinite" } : {}}
          >
            {generating ? "Đang tạo đề..." : "Tạo đề AI ngẫu nhiên"}
          </span>
          {!generating && (
            <span className="block text-xs text-blue-400 mt-0.5 leading-tight">
              để rèn phản xạ với đề chưa gặp
            </span>
          )}
        </div>
        <span className="text-sm font-bold text-blue-600 shrink-0 group-hover:translate-x-0.5 transition-transform">
          Tạo →
        </span>
      </button>

      {genError && <p className="text-xs text-red-500 pl-1">{genError}</p>}

      {/* ── Prompt cards — 3 cols, compact ── */}
      <div className="grid grid-cols-3 gap-2.5">
        {visible.map((p) => {
          const pct = scores[p.id] ?? null
          const isNewest = getTopikNum(p.source) === maxTopik

          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="text-left rounded-xl border border-gray-200 bg-white px-3.5 py-3 hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              {/* Top row: difficulty + score */}
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

              {/* Title */}
              <p className="text-sm font-semibold text-gray-900 leading-snug mb-1.5 group-hover:text-blue-700 transition-colors line-clamp-2">
                {p.context}
              </p>

              {renderExtra?.(p)}

              {/* Source + CTA */}
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

      {/* ── Show more / less ── */}
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
