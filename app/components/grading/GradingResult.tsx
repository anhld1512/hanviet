"use client"

import type { GradeResult } from "@/lib/grading-prompts"

interface GradingResultProps {
  result: GradeResult
  onRetry: () => void
  onNext: () => void
}

const CRITERION_LABELS: Record<string, string> = {
  content: "Noi dung",
  organization: "Cu truc",
  language: "Ngu phap & Tu vung",
  style: "The van",
}

function ScoreBar({ score, max, label }: { score: number; max: number; label: string }) {
  if (max === 0) return null
  const pct = max > 0 ? (score / max) * 100 : 0
  const color =
    pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-400" : pct >= 40 ? "bg-orange-400" : "bg-red-400"

  return (
    <div className="flex items-center gap-3">
      <div className="w-32 text-xs text-gray-600 shrink-0">{label}</div>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-sm font-bold text-gray-700 w-12 text-right">
        {score}<span className="text-xs font-normal text-gray-400">/{max}</span>
      </div>
    </div>
  )
}

export default function GradingResult({ result, onRetry, onNext }: GradingResultProps) {
  const { scores, max_scores, feedback, corrections, better_example } = result
  const pct = max_scores.total > 0 ? Math.round((scores.total / max_scores.total) * 100) : 0

  const scoreColor =
    pct >= 80 ? "text-green-600" : pct >= 60 ? "text-yellow-600" : pct >= 40 ? "text-orange-500" : "text-red-500"

  const scoreEmoji = pct >= 80 ? "🎉" : pct >= 60 ? "😊" : pct >= 40 ? "😐" : "😓"

  return (
    <div className="space-y-5">
      {/* Tong diem */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
        <div className="text-4xl mb-2">{scoreEmoji}</div>
        <div className={`text-5xl font-extrabold mb-1 ${scoreColor}`}>
          {scores.total}
          <span className="text-2xl text-gray-300">/{max_scores.total}</span>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          {pct >= 80 ? "Rat tot! Dung ten chat luong cao." : pct >= 60 ? "Kha tot. Con mot so diem can cai thien." : "Can luyen tap them. Xem feedback ben duoi."}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 text-left">
          {feedback.overall}
        </p>
      </div>

      {/* Chi tiet tung tieu chi */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Chi tiet tung tieu chi</h3>
        <div className="space-y-3 mb-5">
          <ScoreBar score={scores.content} max={max_scores.content} label={CRITERION_LABELS.content} />
          {max_scores.organization > 0 && (
            <ScoreBar score={scores.organization} max={max_scores.organization} label={CRITERION_LABELS.organization} />
          )}
          <ScoreBar score={scores.language} max={max_scores.language} label={CRITERION_LABELS.language} />
          {max_scores.style > 0 && (
            <ScoreBar score={scores.style} max={max_scores.style} label={CRITERION_LABELS.style} />
          )}
        </div>

        {/* Feedback tung phan */}
        <div className="space-y-3">
          {[
            { key: "content", label: CRITERION_LABELS.content, text: feedback.content },
            { key: "organization", label: CRITERION_LABELS.organization, text: feedback.organization },
            { key: "language", label: CRITERION_LABELS.language, text: feedback.language },
            { key: "style", label: CRITERION_LABELS.style, text: feedback.style },
          ]
            .filter((f) => f.text)
            .map((f) => (
              <div key={f.key} className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs font-bold text-gray-600 mb-1">{f.label}</div>
                <p className="text-xs text-gray-700 leading-relaxed">{f.text}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Loi sai va sua */}
      {corrections.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Loi can sua ({corrections.length})</h3>
          <div className="space-y-3">
            {corrections.map((c, i) => (
              <div key={i} className="border border-red-100 rounded-xl p-3 bg-red-50">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xs bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded shrink-0">Sai</span>
                  <span className="text-xs text-red-700 line-through">{c.original}</span>
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xs bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded shrink-0">Dung</span>
                  <span className="text-xs text-green-700 font-medium">{c.corrected}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{c.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cau mau tot hon */}
      {better_example && (
        <div className="bg-white rounded-2xl border border-blue-100 p-6">
          <h3 className="font-bold text-gray-900 mb-2">Cau mau goi y</h3>
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-sm text-blue-800 font-medium leading-relaxed">{better_example}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          Lam lai de nay
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors text-sm"
        >
          De tiep theo
        </button>
      </div>
    </div>
  )
}
