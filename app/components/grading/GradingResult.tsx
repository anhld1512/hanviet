"use client"

import type { GradeResult, ErrorCategory } from "@/lib/grading-prompts"

interface GradingResultProps {
  result: GradeResult
  onRetry: () => void
  onNext: () => void
  hideActions?: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CRITERION_LABELS: Record<string, string> = {
  content:      "Nội dung",
  organization: "Cấu trúc",
  language:     "Ngữ pháp & Từ vựng",
  style:        "Thể văn",
}

const ERROR_TYPE_CONFIG: Record<ErrorCategory, { label: string; color: string; dot: string }> = {
  grammar:    { label: "Ngữ pháp",  color: "bg-red-100 text-red-700 border-red-200",         dot: "bg-red-400" },
  vocabulary: { label: "Từ vựng",   color: "bg-yellow-100 text-yellow-700 border-yellow-200", dot: "bg-yellow-400" },
  style:      { label: "Thể văn",   color: "bg-blue-100 text-blue-700 border-blue-200",       dot: "bg-blue-400" },
  logic:      { label: "Logic",     color: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-400" },
  content:    { label: "Nội dung",  color: "bg-purple-100 text-purple-700 border-purple-200", dot: "bg-purple-400" },
}

// ─── Type scale ───────────────────────────────────────────────────────────────
// section-header : text-xs  font-bold uppercase tracking-wider  (12px)
// body           : text-sm  leading-relaxed                     (14px)
// secondary      : text-xs  leading-relaxed                     (12px)
// micro-label    : text-[10px] font-extrabold                   (10px)
// badge          : text-[10px]                                  (10px)
// korean-display : text-sm  font-mono                           (14px)

// ─── ErrorCard ────────────────────────────────────────────────────────────────
function ErrorCard({ correction, index }: { correction: GradeResult["corrections"][number]; index: number }) {
  const typeConfig = correction.type ? ERROR_TYPE_CONFIG[correction.type] : null

  return (
    <div className="rounded-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
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

      {/* SAI → ĐÚNG */}
      <div className="p-4 bg-white space-y-2.5">
        <div className="flex items-start gap-3">
          <span className="shrink-0 mt-0.5 text-[10px] font-extrabold bg-red-100 text-red-600 px-2 py-0.5 rounded-md">SAI</span>
          <span className="text-sm text-red-700 line-through font-mono leading-relaxed">{correction.original}</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="shrink-0 mt-0.5 text-[10px] font-extrabold bg-green-100 text-green-600 px-2 py-0.5 rounded-md">ĐÚNG</span>
          <span className="text-sm text-green-800 font-semibold font-mono leading-relaxed">{correction.corrected}</span>
        </div>

        {/* Explanation */}
        <div className="mt-1 pt-3 border-t border-gray-50">
          <p className="text-xs text-gray-600 leading-relaxed">{correction.explanation}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Error state ──────────────────────────────────────────────────────────────
function GradingError({ onRetry, hideActions }: { onRetry: () => void; hideActions?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-red-100 p-6 flex flex-col items-center gap-4 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-2xl">⚠️</div>
      <div>
        <p className="text-sm font-semibold text-gray-800">Có lỗi kỹ thuật khi chấm bài</p>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Máy chủ AI gặp sự cố tạm thời. Bài viết của bạn vẫn được lưu — hãy thử lại.
        </p>
      </div>
      {!hideActions && (
        <button
          onClick={onRetry}
          className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
        >
          Thử lại ngay
        </button>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function GradingResult({ result, onRetry, onNext, hideActions }: GradingResultProps) {
  // API error — hiển thị lỗi rõ ràng, không render score 0 như kết quả thật
  if (result.isError) {
    return <GradingError onRetry={onRetry} hideActions={hideActions} />
  }

  const {
    scores, max_scores, feedback, corrections,
    better_example, coaching, char_count_feedback,
    thesis_feedback, better_opening,
  } = result

  const pct = max_scores.total > 0 ? Math.round((scores.total / max_scores.total) * 100) : 0
  const scoreColor = pct >= 80 ? "#16a34a" : pct >= 60 ? "#d97706" : pct >= 40 ? "#ea580c" : "#dc2626"
  const scoreEmoji = pct >= 80 ? "🎉" : pct >= 60 ? "😊" : pct >= 40 ? "😐" : "😓"
  const scoreVerdict =
    pct >= 80 ? "Xuất sắc — đạt tiêu chuẩn cao!" :
    pct >= 60 ? "Khá tốt — còn vài chỗ cần chỉnh." :
    pct >= 40 ? "Cần luyện thêm — đọc kỹ từng lỗi bên dưới." :
    "Cần cải thiện nhiều — đừng nản, phân tích chi tiết bên dưới."

  // Criteria to show (skip if max=0)
  const criteria = [
    { key: "content",      label: CRITERION_LABELS.content,      score: scores.content,      max: max_scores.content,      fb: feedback.content },
    { key: "organization", label: CRITERION_LABELS.organization,  score: scores.organization, max: max_scores.organization, fb: feedback.organization },
    { key: "language",     label: CRITERION_LABELS.language,      score: scores.language,     max: max_scores.language,     fb: feedback.language },
    { key: "style",        label: CRITERION_LABELS.style,         score: scores.style,        max: max_scores.style,        fb: feedback.style },
  ].filter(c => c.max > 0)

  return (
    <div className="space-y-4">

      {/* ── Row 1: Score + Overall feedback ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-6">
        {/* Score */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-4xl leading-none">{scoreEmoji}</span>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-[40px] font-extrabold leading-none" style={{ color: scoreColor }}>{scores.total}</span>
              <span className="text-lg text-gray-300">/{max_scores.total}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{scoreVerdict}</p>
          </div>
        </div>
        <div className="w-px self-stretch bg-gray-100 shrink-0" />
        {/* Overall feedback */}
        <div className="flex-1 min-w-0">
          {feedback.overall && (
            <p className="text-sm text-gray-600 leading-relaxed">{feedback.overall}</p>
          )}
          {char_count_feedback && (
            <div className="mt-2 text-xs text-gray-500 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
              📏 {char_count_feedback}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 2: Criteria ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <span>🔍</span> Vì sao bạn được {scores.total}/{max_scores.total} điểm?
        </h3>

        {/* Criteria cards — items-start so each card only as tall as its content */}
        <div className="flex gap-3 items-start">
          {criteria.map(c => {
            const lost = c.max - c.score
            const isFull = c.score === c.max
            const isZero = c.score === 0 && c.max > 0
            const bgBorder = isFull ? "bg-green-50 border-green-100" : isZero ? "bg-red-50 border-red-100" : "bg-orange-50 border-orange-100"
            const icon = isFull ? "✅" : isZero ? "❌" : "⚡"
            const scoreTextColor = isFull ? "text-green-600" : isZero ? "text-red-600" : "text-orange-500"
            return (
              <div key={c.key} className={`flex-1 rounded-xl border p-3 ${bgBorder}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <span className="text-sm">{icon}</span>{c.label}
                  </span>
                  <span className={`text-sm font-bold tabular-nums ${scoreTextColor}`}>
                    {c.score}<span className="text-[10px] font-normal text-gray-400">/{c.max}</span>
                  </span>
                </div>
                {c.fb && (
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {lost > 0 && !isFull
                      ? <><span className="font-semibold text-gray-700">Mất {lost}đ — </span>{c.fb}</>
                      : c.fb}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Row 3: Errors + Coaching side by side ────────────────────────────── */}
      {(corrections.length > 0 || coaching) && (
        <div className="grid grid-cols-2 gap-4">
          {/* Errors */}
          {corrections.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span>✏️</span> Sai ở vị trí nào?
                <span className="ml-auto text-[10px] font-normal bg-gray-100 px-2 py-0.5 rounded-full">{corrections.length} lỗi</span>
              </h3>
              <div className="space-y-3">
                {corrections.map((c, i) => <ErrorCard key={i} correction={c} index={i} />)}
              </div>
            </div>
          )}

          {/* Coaching */}
          {coaching && (
            <div className="rounded-2xl border border-indigo-100 overflow-hidden flex flex-col">
              <div className="bg-indigo-50 px-5 py-3 border-b border-indigo-100">
                <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🎯</span> Làm gì để điểm cao hơn?
                </h3>
              </div>
              <div className="bg-white p-5 space-y-4 flex-1">
                {coaching.focus_pattern && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">📚</span>
                    <div>
                      <p className="text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wide">Cần ôn lại</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{coaching.focus_pattern}</p>
                    </div>
                  </div>
                )}
                {coaching.level_tip && (
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">🚀</span>
                    <div>
                      <p className="text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wide">Bước tiếp theo</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{coaching.level_tip}</p>
                    </div>
                  </div>
                )}
                {(better_example || better_opening) && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wide">✨ Câu mẫu tham khảo</p>
                    {better_example && (
                      <div className="bg-indigo-50 rounded-xl px-4 py-3 font-mono text-sm text-indigo-900 leading-relaxed">
                        {better_example}
                      </div>
                    )}
                    {better_opening && (
                      <div className="bg-indigo-50 rounded-xl px-4 py-3 font-mono text-sm text-indigo-900 leading-relaxed mt-2">
                        {better_opening}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Q54 thesis feedback ──────────────────────────────────────────────── */}
      {thesis_feedback && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <span>🧠</span> Phân tích luận điểm (Thesis)
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">{thesis_feedback}</p>
        </div>
      )}

      {/* ── Actions ──────────────────────────────────────────────────────────── */}
      {!hideActions && (
        <div className="flex gap-3 pt-1">
          <button
            onClick={onRetry}
            className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            Làm lại đề này
          </button>
          <button
            onClick={onNext}
            className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors text-sm"
          >
            Đề tiếp theo →
          </button>
        </div>
      )}
    </div>
  )
}
