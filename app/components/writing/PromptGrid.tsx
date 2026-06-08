"use client"

import { useState } from "react"
import { scoreColor, scoreBadgeColor, difficultyLabel, difficultyColor } from "@/lib/practice-score"
import type { WritingPrompt } from "@/lib/data/prompts"

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTopikNum(source: string) {
  const m = source.match(/(\d+)/)
  return m ? parseInt(m[1]) : 0
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Accent = {
  gradient: string
  border: string
  hoverBorder: string
  badge: string
  arrow: string
  hoverText: string
}

const ACCENTS: Record<string, Accent> = {
  q51: {
    gradient: "from-blue-50 to-blue-50",
    border: "border-blue-200",
    hoverBorder: "hover:border-blue-400",
    badge: "bg-blue-500",
    arrow: "text-blue-500",
    hoverText: "group-hover:text-blue-600",
  },
  q52: {
    gradient: "from-blue-50 to-blue-50",
    border: "border-blue-200",
    hoverBorder: "hover:border-blue-400",
    badge: "bg-blue-500",
    arrow: "text-blue-500",
    hoverText: "group-hover:text-blue-600",
  },
  q53: {
    gradient: "from-blue-50 to-blue-50",
    border: "border-blue-200",
    hoverBorder: "hover:border-blue-400",
    badge: "bg-blue-500",
    arrow: "text-blue-500",
    hoverText: "group-hover:text-blue-600",
  },
  q54: {
    gradient: "from-amber-50 to-amber-50",
    border: "border-gray-200",
    hoverBorder: "hover:border-blue-400",
    badge: "bg-gray-500",
    arrow: "text-blue-500",
    hoverText: "group-hover:text-blue-600",
  },
}

type Props = {
  prompts: WritingPrompt[]
  scores: Record<number, number | null>
  onSelect: (p: WritingPrompt) => void
  questionType: string
  /** Optional extra content below context (e.g. mini chart for Q53) */
  renderExtra?: (p: WritingPrompt) => React.ReactNode
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PromptGrid({ prompts, scores, onSelect, questionType, renderExtra }: Props) {
  const [showAll, setShowAll] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)

  const accent = ACCENTS[questionType] ?? ACCENTS.q54

  // Sort newest first (highest TOPIK number)
  const sorted = [...prompts].sort((a, b) => getTopikNum(b.source) - getTopikNum(a.source))
  const maxTopik = getTopikNum(sorted[0]?.source ?? "")
  const secondTopik = getTopikNum(sorted[1]?.source ?? "")

  const INITIAL_SHOW = 3
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
    <div>
      {/* ── AI Generate banner ── */}
      <button
        onClick={handleGenerate}
        disabled={generating}
        className={`w-full mb-5 rounded-2xl border-2 border-dashed bg-gradient-to-r ${accent.gradient} ${accent.border} ${accent.hoverBorder} p-4 hover:shadow-md transition-all text-left group flex items-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        <div className="text-3xl select-none">{generating ? "⏳" : "✨"}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-bold text-gray-900">
              {generating ? "Đang tạo đề..." : "Đề AI ngẫu nhiên"}
            </span>
            <span className={`text-[10px] font-extrabold ${accent.badge} text-white px-2 py-0.5 rounded-full`}>
              AI
            </span>
            <span className="text-[10px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded-full">
              TOPIK Format
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Tạo đề chuẩn format TOPIK II hoàn toàn mới — cấu trúc y đề thi thật, nội dung khác mỗi lần. Tốt để luyện phản xạ với đề chưa gặp.
          </p>
        </div>
        <div className={`shrink-0 flex items-center gap-1 text-sm font-bold ${accent.arrow} group-hover:translate-x-1 transition-transform`}>
          {generating ? "Đang tạo..." : "Tạo đề →"}
        </div>
      </button>
      {genError && (
        <p className="text-xs text-red-500 -mt-3 mb-3 pl-1">{genError}</p>
      )}

      {/* ── Prompt cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {visible.map((p) => {
          const pct = scores[p.id] ?? null
          const topikNum = getTopikNum(p.source)
          const isNewest = topikNum === maxTopik
          const isRecent = topikNum === secondTopik && !isNewest

          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className={`text-left rounded-2xl border p-5 hover:shadow-md transition-all group relative ${scoreColor(pct)}`}
            >
              {/* Tag */}
              {isNewest && (
                <span className="absolute -top-2.5 left-4 text-[10px] font-bold bg-blue-500 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                  🆕 Mới nhất
                </span>
              )}
              {isRecent && (
                <span className="absolute -top-2.5 left-4 text-[10px] font-bold bg-blue-400 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                  Gần đây
                </span>
              )}

              <div className="flex items-start justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${difficultyColor(p.difficulty)}`}>
                  {difficultyLabel(p.difficulty)}
                </span>
                <span className={`text-sm ${scoreBadgeColor(pct)}`}>
                  {pct !== null ? `${pct}%` : "—"}
                </span>
              </div>

              <h3 className={`font-semibold text-gray-900 text-sm mb-1 ${accent.hoverText} transition-colors leading-snug`}>
                {p.context}
              </h3>

              {renderExtra?.(p)}

              <p className="text-xs text-gray-400 mt-1">{p.source}</p>

              <div className="mt-3">
                <span className={`text-xs font-medium ${accent.arrow}`}>
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
          className="mt-4 w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 text-sm text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all font-medium"
        >
          Xem thêm {hiddenCount} đề ↓
        </button>
      )}
      {showAll && sorted.length > INITIAL_SHOW && (
        <button
          onClick={() => setShowAll(false)}
          className="mt-4 w-full py-2.5 rounded-2xl border border-gray-200 text-sm text-gray-400 hover:text-gray-500 transition-colors"
        >
          Thu gọn ↑
        </button>
      )}
    </div>
  )
}
