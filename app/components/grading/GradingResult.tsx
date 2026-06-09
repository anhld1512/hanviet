"use client"

import { useState } from "react"
import type { GradeResult, ErrorCategory } from "@/lib/grading-prompts"

interface GradingResultProps {
  result: GradeResult
  onRetry: () => void
  onNext: () => void
  hideActions?: boolean
  userAnswer?: string
}

const CRITERION_LABELS: Record<string, string> = {
  content:      "Nội dung",
  organization: "Cấu trúc",
  language:     "Ngữ pháp & Từ vựng",
  style:        "Thể văn",
}

const ERROR_TYPE_CONFIG: Record<ErrorCategory, { label: string; color: string; dot: string }> = {
  grammar:    { label: "Ngữ pháp",  color: "bg-red-100 text-red-700 border-red-200",         dot: "bg-red-400" },
  vocabulary: { label: "Từ vựng",   color: "bg-gray-100 text-gray-700 border-gray-200", dot: "bg-gray-400" },
  style:      { label: "Thể văn",   color: "bg-blue-100 text-blue-700 border-blue-200",       dot: "bg-blue-400" },
  logic:      { label: "Logic",     color: "bg-gray-100 text-blue-700 border-gray-200", dot: "bg-blue-400" },
  content:    { label: "Nội dung",  color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-400" },
}

// ─── EssayWithHighlights ──────────────────────────────────────────────────────
function EssayWithHighlights({ essay, corrections }: { essay: string; corrections: GradeResult["corrections"] }) {
  type Span = { start: number; end: number; index: number; type: ErrorCategory | undefined }

  const spans: Span[] = []
  const usedRanges: Array<[number, number]> = []

  for (let i = 0; i < corrections.length; i++) {
    const { original, type } = corrections[i]
    if (!original || original.length < 2) continue
    const pos = essay.indexOf(original)
    if (pos === -1) continue
    const overlaps = usedRanges.some(([s, e]) => pos < e && pos + original.length > s)
    if (overlaps) continue
    usedRanges.push([pos, pos + original.length])
    spans.push({ start: pos, end: pos + original.length, index: i, type })
  }

  spans.sort((a, b) => a.start - b.start)

  type Segment = { text: string; correction?: Span }
  const segments: Segment[] = []
  let cursor = 0
  for (const span of spans) {
    if (span.start > cursor) segments.push({ text: essay.slice(cursor, span.start) })
    segments.push({ text: essay.slice(span.start, span.end), correction: span })
    cursor = span.end
  }
  if (cursor < essay.length) segments.push({ text: essay.slice(cursor) })

  const missedCount = corrections.length - spans.length

  function scrollToError(index: number) {
    document.getElementById(`err-card-${index}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <div>
      <div className="bg-gray-50 rounded-xl p-4 text-sm font-mono leading-[2.4] whitespace-pre-wrap text-gray-800">
        {segments.map((seg, i) => {
          if (!seg.correction) return <span key={i}>{seg.text}</span>
          return (
            <span
              key={i}
              onClick={() => scrollToError(seg.correction!.index)}
              className="rounded-sm px-0.5 bg-gray-100 border-b-2 border-blue-400 cursor-pointer hover:bg-blue-100 transition-colors"
            >
              {seg.text}
              <sup className="ml-0.5 text-[9px] font-extrabold text-blue-600">{seg.correction.index + 1}</sup>
            </span>
          )
        })}
      </div>
      {missedCount > 0 && (
        <p className="mt-2 text-[10px] text-gray-400">
          * {missedCount} lỗi không thể highlight — xem danh sách bên dưới
        </p>
      )}
    </div>
  )
}

// ─── ErrorCard ────────────────────────────────────────────────────────────────
function ErrorCard({ correction, index }: { correction: GradeResult["corrections"][number]; index: number }) {
  const typeConfig = correction.type ? ERROR_TYPE_CONFIG[correction.type] : null
  return (
    <div id={`err-card-${index}`} className="rounded-xl overflow-hidden border border-gray-100 scroll-mt-4">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
        <span className="text-xs font-bold text-gray-400 w-4">#{index + 1}</span>
        {typeConfig && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeConfig.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${typeConfig.dot}`} />
            {typeConfig.label}
          </span>
        )}
        {correction.pattern && (
          <span className="text-[10px] font-mono bg-white text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
            {correction.pattern}
          </span>
        )}
      </div>
      <div className="p-3 bg-white space-y-2">
        <div className="flex items-start gap-2">
          <span className="shrink-0 text-[10px] font-extrabold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md mt-0.5">SAI</span>
          <span className="text-sm text-red-700 line-through font-mono leading-relaxed">{correction.original}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="shrink-0 text-[10px] font-extrabold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-md mt-0.5">ĐÚNG</span>
          <span className="text-sm text-blue-800 font-semibold font-mono leading-relaxed">{correction.corrected}</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed pt-1 border-t border-gray-50">{correction.explanation}</p>
      </div>
    </div>
  )
}

// ─── CoachingTip — collapsed by default, Q51/Q52 ─────────────────────────────
function CoachingTip({ coaching }: { coaching: NonNullable<GradeResult["coaching"]> }) {
  const [open, setOpen] = useState(false)
  const tip = coaching.focus_pattern || coaching.level_tip || ""
  const preview = tip.length > 80 ? tip.slice(0, 80) + "…" : tip

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
      >
        <span className="text-xs font-bold text-blue-600 shrink-0">Làm gì để điểm cao hơn?</span>
        <span className="text-xs text-gray-400 flex-1 truncate">{!open ? preview : ""}</span>
        <span className="text-gray-300 text-xs shrink-0">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-5 pb-4 space-y-3 border-t border-gray-50">
          {coaching.focus_pattern && (
            <div className="flex items-start gap-2.5 pt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
              <p className="text-sm text-gray-700 leading-relaxed">{coaching.focus_pattern}</p>
            </div>
          )}
          {coaching.level_tip && (
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
              <p className="text-sm text-gray-700 leading-relaxed">{coaching.level_tip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Error state ──────────────────────────────────────────────────────────────
function GradingError({ onRetry, hideActions }: { onRetry: () => void; hideActions?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-red-100 p-6 flex flex-col items-center gap-4 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-sm font-bold text-red-400">!</div>
      <div>
        <p className="text-sm font-semibold text-gray-800">Có lỗi kỹ thuật khi chấm bài</p>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">Máy chủ AI gặp sự cố tạm thời. Bài viết vẫn được lưu — hãy thử lại.</p>
      </div>
      {!hideActions && (
        <button onClick={onRetry} className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
          Thử lại ngay
        </button>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function GradingResult({ result, onRetry, onNext, hideActions, userAnswer }: GradingResultProps) {
  const [expandOverall, setExpandOverall] = useState(false)

  if (result.isError) return <GradingError onRetry={onRetry} hideActions={hideActions} />

  const {
    scores, max_scores, feedback, corrections,
    better_example, coaching, char_count_feedback,
    thesis_feedback, better_opening,
  } = result

  const pct = max_scores.total > 0 ? Math.round((scores.total / max_scores.total) * 100) : 0
  const scoreColor = pct >= 80 ? "#0066CC" : pct >= 60 ? "#6B7280" : pct >= 40 ? "#6B7280" : "#dc2626"
  const scoreVerdict = pct >= 80 ? "Xuất sắc!" : pct >= 60 ? "Khá tốt" : pct >= 40 ? "Cần luyện thêm" : "Cần cải thiện"

  const criteria = [
    { key: "content",      label: CRITERION_LABELS.content,      score: scores.content,      max: max_scores.content,      fb: feedback.content },
    { key: "organization", label: CRITERION_LABELS.organization,  score: scores.organization, max: max_scores.organization, fb: feedback.organization },
    { key: "language",     label: CRITERION_LABELS.language,      score: scores.language,     max: max_scores.language,     fb: feedback.language },
    { key: "style",        label: CRITERION_LABELS.style,         score: scores.style,        max: max_scores.style,        fb: feedback.style },
  ].filter(c => c.max > 0)

  const actions = !hideActions && (
    <div className="flex gap-3">
      <button onClick={onRetry} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
        Làm lại đề này
      </button>
      <button onClick={onNext} className="flex-1 bg-blue-500 text-white font-bold py-2.5 rounded-xl hover:bg-blue-600 transition-colors text-sm">
        Đề tiếp theo →
      </button>
    </div>
  )

  // ── 2-column layout khi có bài viết (Q53/Q54) ─────────────────────────────
  if (userAnswer) {
    return (
      <div className="grid gap-5 items-start" style={{ gridTemplateColumns: "42% 1fr" }}>

        {/* ── LEFT: Bài viết — sticky, scrollable nếu dài ─────────────────── */}
        <div className="sticky top-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5" style={{ maxHeight: "calc(100vh - 7rem)", overflowY: "auto" }}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              Bài viết của bạn
            </h3>
            <EssayWithHighlights essay={userAnswer} corrections={corrections} />
          </div>
        </div>

        {/* ── RIGHT: Kết quả ──────────────────────────────────────────────── */}
        <div className="space-y-3">

          {/* Score + criteria */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            {/* Score row */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-[46px] font-extrabold leading-none" style={{ color: scoreColor }}>{scores.total}</span>
                <span className="text-xl text-gray-300">/{max_scores.total}</span>
                <span className="text-base font-semibold text-gray-500">{scoreVerdict}</span>
              </div>
              {char_count_feedback && (
                <span className="ml-auto text-xs bg-gray-50 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-lg shrink-0">
                  {char_count_feedback.split('，')[0].split(',')[0].split('.')[0]}
                </span>
              )}
            </div>

            {/* Overall feedback — 2 lines, expandable */}
            {feedback.overall && (
              <div className="mb-4">
                <p className={`text-sm text-gray-500 leading-relaxed ${expandOverall ? "" : "line-clamp-2"}`}>
                  {feedback.overall}
                </p>
                <button
                  onClick={() => setExpandOverall(v => !v)}
                  className="text-xs text-blue-400 hover:text-blue-600 mt-0.5"
                >
                  {expandOverall ? "Thu gọn ↑" : "Xem đầy đủ ↓"}
                </button>
              </div>
            )}

            {/* Criteria */}
            <div className="grid grid-cols-2 gap-2.5">
              {criteria.map(c => {
                const cpct = c.max > 0 ? c.score / c.max : 0
                const isFull = c.score === c.max
                const isLow = cpct < 0.6
                const scoreTextColor = isFull ? "text-blue-600" : isLow ? "text-red-500" : "text-gray-600"
                const icon = isFull ? "✓" : isLow ? "✗" : "·"
                const lost = c.max - c.score
                return (
                  <div key={c.key} className="bg-gray-50 rounded-xl px-3.5 py-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-500 flex items-center gap-1.5">{icon} {c.label}</span>
                      <span className={`text-xl font-extrabold tabular-nums leading-none ${scoreTextColor}`}>
                        {c.score}<span className="text-sm font-normal text-gray-400">/{c.max}</span>
                      </span>
                    </div>
                    {c.fb && (
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {lost > 0 && !isFull && <span className="font-bold text-gray-600">−{lost}đ </span>}
                        {c.fb}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Errors — main focus */}
          {corrections.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-1.5">
                Sai ở đâu?
                <span className="ml-auto text-xs font-normal bg-gray-100 px-2 py-0.5 rounded-full">{corrections.length} lỗi</span>
              </h3>
              <div className="space-y-2.5">
                {corrections.map((c, i) => <ErrorCard key={i} correction={c} index={i} />)}
              </div>
            </div>
          )}

          {/* Coaching condensed */}
          {coaching && (
            <div className="bg-white rounded-2xl border border-blue-100 p-5 space-y-3.5">
              <h3 className="text-sm font-bold text-blue-600 flex items-center gap-1.5">
                Làm gì để cải thiện?
              </h3>
              {coaching.focus_pattern && (
                <div className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                  <p className="text-sm text-gray-700 leading-relaxed">{coaching.focus_pattern}</p>
                </div>
              )}
              {coaching.level_tip && (
                <div className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                  <p className="text-sm text-gray-700 leading-relaxed">{coaching.level_tip}</p>
                </div>
              )}
              {(better_example || better_opening) && (
                <div className="pt-3 border-t border-blue-50">
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-2">Câu mẫu</p>
                  {better_example && (
                    <div className="bg-blue-50 rounded-xl px-4 py-3 font-mono text-sm text-blue-900 leading-relaxed">{better_example}</div>
                  )}
                  {better_opening && (
                    <div className="bg-blue-50 rounded-xl px-4 py-3 font-mono text-sm text-blue-900 leading-relaxed mt-2">{better_opening}</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Q54 thesis */}
          {thesis_feedback && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-1.5">
                Luận điểm (Thesis)
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">{thesis_feedback}</p>
            </div>
          )}

          {actions}
        </div>
      </div>
    )
  }

  // ── Single-column compact layout (Q51/Q52) ────────────────────────────────
  return (
    <div className="space-y-3">

      {/* ── Row 1: Score + criteria chips in one line ── */}
      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Score */}
          <div className="flex items-baseline gap-1 shrink-0">
            <span className="text-[38px] font-extrabold leading-none" style={{ color: scoreColor }}>{scores.total}</span>
            <span className="text-base text-gray-300 leading-none">/{max_scores.total}</span>
          </div>
          <span className="text-sm font-bold shrink-0" style={{ color: scoreColor }}>{scoreVerdict}</span>

          <div className="w-px h-7 bg-gray-200 shrink-0 mx-0.5" />

          {/* Criteria chips — score only, no text */}
          {criteria.map(c => {
            const isFull = c.score === c.max
            const isZero = c.score === 0 && c.max > 0
            const chipCls = isFull
              ? "bg-blue-50 text-blue-600 border-blue-100"
              : isZero
              ? "bg-red-50 text-red-500 border-red-200"
              : "bg-gray-50 text-gray-600 border-gray-200"
            const icon = isFull ? "✓" : isZero ? "✗" : "·"
            return (
              <span key={c.key} className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border ${chipCls} shrink-0`}>
                <span>{icon}</span>
                <span>{c.label}</span>
                <span className="opacity-60 font-normal">{c.score}/{c.max}</span>
              </span>
            )
          })}
        </div>
      </div>

      {/* ── Row 2: Errors — compact inline ── */}
      {corrections.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-gray-700">Lỗi cần sửa</span>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{corrections.length} lỗi</span>
          </div>
          <div className="space-y-2.5">
            {corrections.map((c, i) => {
              const typeConfig = c.type ? ERROR_TYPE_CONFIG[c.type] : null
              return (
                <div key={i} className="flex items-start gap-2.5">
                  {/* Type badge */}
                  {typeConfig && (
                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md border mt-0.5 ${typeConfig.color}`}>
                      {typeConfig.label}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    {/* SAI → ĐÚNG inline */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm text-red-600 line-through">{c.original}</span>
                      <span className="text-gray-300 text-xs">→</span>
                      <span className="font-mono text-sm text-blue-700 font-semibold">{c.corrected}</span>
                      {c.pattern && (
                        <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">{c.pattern}</span>
                      )}
                    </div>
                    {/* Explanation — short, 1 line */}
                    {c.explanation && (
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{c.explanation}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Row 3: Câu mẫu — most important for learning ── */}
      {better_example && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-3.5">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">Câu mẫu tham khảo</p>
          <p className="font-mono text-sm text-blue-900 leading-relaxed">{better_example}</p>
          {better_opening && (
            <p className="font-mono text-sm text-blue-900 leading-relaxed mt-1.5 pt-1.5 border-t border-blue-200">{better_opening}</p>
          )}
        </div>
      )}

      {/* ── Row 4: Coaching — 1 key tip, collapsed by default ── */}
      {coaching && (coaching.focus_pattern || coaching.level_tip) && (
        <CoachingTip coaching={coaching} />
      )}

      {actions}
    </div>
  )
}
