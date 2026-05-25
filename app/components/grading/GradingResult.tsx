"use client"

import type { GradeResult, ErrorCategory } from "@/lib/grading-prompts"

interface GradingResultProps {
  result: GradeResult
  onRetry: () => void
  onNext: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CRITERION_LABELS: Record<string, string> = {
  content: "Nội dung",
  organization: "Cấu trúc",
  language: "Ngữ pháp & Từ vựng",
  style: "Thể văn",
}

const ERROR_TYPE_CONFIG: Record<ErrorCategory, { label: string; color: string; dot: string }> = {
  grammar:    { label: "Ngữ pháp",  color: "bg-red-100 text-red-700 border-red-200",     dot: "bg-red-400" },
  vocabulary: { label: "Từ vựng",   color: "bg-yellow-100 text-yellow-700 border-yellow-200", dot: "bg-yellow-400" },
  style:      { label: "Thể văn",   color: "bg-blue-100 text-blue-700 border-blue-200",   dot: "bg-blue-400" },
  logic:      { label: "Logic",     color: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-400" },
  content:    { label: "Nội dung",  color: "bg-purple-100 text-purple-700 border-purple-200", dot: "bg-purple-400" },
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ScoreBar({ score, max, label, feedback }: { score: number; max: number; label: string; feedback?: string }) {
  if (max === 0) return null
  const pct = (score / max) * 100
  const color = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-400" : pct >= 40 ? "bg-orange-400" : "bg-red-400"
  const textColor = pct >= 80 ? "text-green-600" : pct >= 60 ? "text-yellow-600" : pct >= 40 ? "text-orange-500" : "text-red-500"

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3">
        <span className="w-36 text-xs font-medium text-gray-600 shrink-0">{label}</span>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
        </div>
        <span className={`text-sm font-bold w-12 text-right shrink-0 ${textColor}`}>
          {score}<span className="text-xs font-normal text-gray-400">/{max}</span>
        </span>
      </div>
      {feedback && (
        <p className="text-xs text-gray-500 leading-relaxed pl-[156px]">{feedback}</p>
      )}
    </div>
  )
}

function ErrorCard({ correction }: { correction: GradeResult["corrections"][number] }) {
  const typeConfig = correction.type ? ERROR_TYPE_CONFIG[correction.type] : null

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white hover:border-gray-200 transition-colors">
      {/* Header: type badge + pattern */}
      <div className="flex items-center gap-2 mb-3">
        {typeConfig && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeConfig.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${typeConfig.dot}`} />
            {typeConfig.label}
          </span>
        )}
        {correction.pattern && (
          <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
            {correction.pattern}
          </span>
        )}
      </div>

      {/* Sai → Đúng */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-start gap-2">
          <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded shrink-0 mt-0.5">SAI</span>
          <span className="text-sm text-red-700 line-through leading-relaxed font-mono">{correction.original}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-[10px] font-bold bg-green-100 text-green-600 px-1.5 py-0.5 rounded shrink-0 mt-0.5">ĐÚNG</span>
          <span className="text-sm text-green-700 font-semibold leading-relaxed font-mono">{correction.corrected}</span>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-xs text-gray-600 leading-relaxed border-t border-gray-50 pt-2">{correction.explanation}</p>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function GradingResult({ result, onRetry, onNext }: GradingResultProps) {
  const { scores, max_scores, feedback, corrections, better_example, coaching, char_count_feedback, thesis_feedback, better_opening } = result
  const pct = max_scores.total > 0 ? Math.round((scores.total / max_scores.total) * 100) : 0

  const scoreColor = pct >= 80 ? "text-green-600" : pct >= 60 ? "text-yellow-600" : pct >= 40 ? "text-orange-500" : "text-red-500"
  const scoreEmoji = pct >= 80 ? "🎉" : pct >= 60 ? "😊" : pct >= 40 ? "😐" : "😓"
  const scoreVerdict = pct >= 80 ? "Rất tốt! Đúng tiêu chuẩn chất lượng cao." : pct >= 60 ? "Khá tốt. Còn một số điểm cần cải thiện." : "Cần luyện thêm. Đọc kỹ phân tích bên dưới."

  return (
    <div className="space-y-4 max-w-2xl mx-auto">

      {/* ── 1. Score header ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
        <div className="text-3xl mb-2">{scoreEmoji}</div>
        <div className={`text-5xl font-extrabold mb-1 ${scoreColor}`}>
          {scores.total}
          <span className="text-2xl text-gray-300 font-normal">/{max_scores.total}</span>
        </div>
        <p className="text-sm text-gray-500 mb-4">{scoreVerdict}</p>
        {feedback.overall && (
          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 text-left">
            {feedback.overall}
          </p>
        )}
        {char_count_feedback && (
          <div className="mt-3 text-xs text-gray-500 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2 text-left">
            📏 {char_count_feedback}
          </div>
        )}
      </div>

      {/* ── 2. Coach: strength + weakness ── */}
      {coaching && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">💪</span>
              <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Điểm mạnh</span>
            </div>
            <p className="text-sm text-green-800 leading-relaxed">{coaching.strength}</p>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">⚠️</span>
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">Cần cải thiện</span>
            </div>
            <p className="text-sm text-orange-800 leading-relaxed">{coaching.weakness}</p>
          </div>
        </div>
      )}

      {/* ── 3. Criteria breakdown ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-5">Chi tiết từng tiêu chí</h3>
        <div className="space-y-5">
          <ScoreBar score={scores.content} max={max_scores.content} label={CRITERION_LABELS.content} feedback={feedback.content} />
          {max_scores.organization > 0 && (
            <ScoreBar score={scores.organization} max={max_scores.organization} label={CRITERION_LABELS.organization} feedback={feedback.organization} />
          )}
          <ScoreBar score={scores.language} max={max_scores.language} label={CRITERION_LABELS.language} feedback={feedback.language} />
          {max_scores.style > 0 && (
            <ScoreBar score={scores.style} max={max_scores.style} label={CRITERION_LABELS.style} feedback={feedback.style} />
          )}
        </div>
      </div>

      {/* ── 4. Errors ── */}
      {corrections.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Lỗi cần sửa <span className="text-sm font-normal text-gray-400 ml-1">({corrections.length})</span></h3>
            {/* Legend */}
            <div className="flex gap-2">
              {(["grammar", "vocabulary", "style", "logic"] as ErrorCategory[]).map(type => {
                const hasType = corrections.some(c => c.type === type)
                if (!hasType) return null
                const cfg = ERROR_TYPE_CONFIG[type]
                return (
                  <span key={type} className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                )
              })}
            </div>
          </div>
          <div className="space-y-3">
            {corrections.map((c, i) => <ErrorCard key={i} correction={c} />)}
          </div>
        </div>
      )}

      {/* ── 5. AI Coach tip ── */}
      {coaching && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">💬</span>
            <h3 className="font-bold text-indigo-900">Lời khuyên từ AI Coach</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white rounded-xl p-3 border border-indigo-100">
              <span className="text-base shrink-0">📚</span>
              <div>
                <p className="text-xs font-bold text-indigo-600 mb-0.5">Cần ôn lại</p>
                <p className="text-sm text-indigo-900 leading-relaxed">{coaching.focus_pattern}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl p-3 border border-indigo-100">
              <span className="text-base shrink-0">🎯</span>
              <div>
                <p className="text-xs font-bold text-indigo-600 mb-0.5">Bước tiếp theo</p>
                <p className="text-sm text-indigo-900 leading-relaxed">{coaching.level_tip}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Q54 extras ── */}
      {thesis_feedback && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-2">🧠 Phân tích luận điểm (Thesis)</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{thesis_feedback}</p>
        </div>
      )}

      {/* ── 7. Better example / opening ── */}
      {(better_example || better_opening) && (
        <div className="bg-white rounded-2xl border border-blue-100 p-5">
          <h3 className="font-bold text-gray-900 mb-3">✨ Câu mẫu gợi ý</h3>
          {better_example && (
            <div className="bg-blue-50 rounded-xl p-3 mb-2">
              <p className="text-sm text-blue-800 font-medium leading-relaxed">{better_example}</p>
            </div>
          )}
          {better_opening && (
            <>
              <p className="text-xs text-gray-500 mb-1">Gợi ý mở bài:</p>
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-sm text-blue-800 font-medium leading-relaxed">{better_opening}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── 8. Actions ── */}
      <div className="flex gap-3">
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
    </div>
  )
}
