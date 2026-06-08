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
      <style>{`
        @keyframes ai-breathe {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59,130,246,0), 0 2px 6px rgba(59,130,246,0.08);
            border-color: rgb(147,197,253);
          }
          50% {
            box-shadow: 0 0 22px 4px rgba(59,130,246,0.2), 0 2px 6px rgba(59,130,246,0.12);
            border-color: rgb(59,130,246);
          }
        }
        @keyframes ai-sparkle-spin {
          0%   { transform: rotate(0deg) scale(1);    opacity: 1; }
          25%  { transform: rotate(20deg) scale(1.25); opacity: 0.9; }
          50%  { transform: rotate(0deg) scale(1);    opacity: 1; }
          75%  { transform: rotate(-15deg) scale(1.1); opacity: 0.95; }
          100% { transform: rotate(0deg) scale(1);    opacity: 1; }
        }
        @keyframes generating-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* ── Grid: AI card đầu tiên + prompt cards ── */}
      <div className="grid grid-cols-3 gap-2.5">

        {/* ── AI generate card ── */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="text-left rounded-xl border px-3.5 py-3 disabled:opacity-60 group flex flex-col transition-colors"
          style={{
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            animation: !generating ? "ai-breathe 3s ease-in-out infinite" : "none",
            borderColor: "rgb(147,197,253)",
          }}
        >
          {/* Top row — badge + sparkle */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-blue-600 bg-white/70 border border-blue-200 px-2 py-0.5 rounded-full">
              AI tạo
            </span>
            <span
              className="text-base text-blue-500 select-none"
              style={!generating ? {
                display: "inline-block",
                animation: "ai-sparkle-spin 3s ease-in-out infinite",
              } : {}}
            >
              {generating ? "⏳" : "✦"}
            </span>
          </div>

          {/* Title */}
          <p
            className="text-sm font-bold text-blue-900 leading-snug mb-1.5"
            style={generating ? { animation: "generating-pulse 1.2s ease-in-out infinite" } : {}}
          >
            {generating ? "Đang tạo đề..." : "Tạo đề ngẫu nhiên"}
          </p>

          {/* Tagline */}
          {!generating && (
            <p className="text-xs text-blue-500 leading-snug mb-auto">
              để rèn phản xạ với đề chưa gặp
            </p>
          )}

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-xs text-blue-400">AI · Mỗi lần khác nhau</span>
            <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
              Tạo →
            </span>
          </div>
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

      {genError && <p className="text-xs text-red-500 pl-1">{genError}</p>}

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
