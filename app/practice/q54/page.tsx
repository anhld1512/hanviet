"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
import WongojiEditor from "@/app/components/writing/WongojiEditor"
import GradingResult from "@/app/components/grading/GradingResult"
import GradingLoader from "@/app/components/grading/GradingLoader"
import UpgradeModal from "@/app/components/UpgradeModal"
import { Q54_PROMPTS, type WritingPrompt } from "@/lib/data/prompts"
import type { GradeResult } from "@/lib/grading-prompts"
import { saveSubmission } from "@/lib/save-submission"
import { trackActivity } from "@/lib/activity-tracker"
import { getBestPct, saveBestPct, scoreColor, scoreBadgeColor, difficultyLabel, difficultyColor, loadBestScoresFromDB, mergeBestScoresToLocalStorage } from "@/lib/practice-score"
import PracticeTips, { TIPS_Q54 } from "@/app/components/writing/PracticeTips"
import PromptGrid from "@/app/components/writing/PromptGrid"

export default function Q54Page() {
  const [selected, setSelected] = useState<WritingPrompt | null>(null)
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<number, number | null>>({})
  const [showUpgrade, setShowUpgrade] = useState(false)

  useEffect(() => {
    const s: Record<number, number | null> = {}
    Q54_PROMPTS.forEach((p) => { s[p.id] = getBestPct("q54", p.id) })
    setScores(s)
    loadBestScoresFromDB("q54").then((dbScores) => {
      mergeBestScoresToLocalStorage("q54", dbScores)
      setScores((prev) => {
        const merged = { ...prev }
        for (const [id, pct] of Object.entries(dbScores)) {
          const key = parseInt(id)
          if ((merged[key] ?? 0) < pct) merged[key] = pct
        }
        return merged
      })
    })
  }, [])

  function openPrompt(p: WritingPrompt) { setSelected(p); setAnswer(""); setGradeResult(null); setError(null) }
  function backToList() { setSelected(null); setGradeResult(null); setAnswer("") }

  async function handleSubmit() {
    if (!answer.trim() || !selected) return
    setLoading(true); setError(null)
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_type: "q54", topic: selected.topic ?? selected.text_kr, student_essay: answer }),
      })
      const text = await res.text()
      let data: Record<string, unknown>
      try { data = JSON.parse(text) } catch { throw new Error("Máy chủ gặp sự cố. Vui lòng thử lại.") }
      if (!res.ok) throw new Error((data.error as string) || "Lỗi máy chủ")
      const result = data as unknown as GradeResult
      setGradeResult(result)
      const pct = Math.round((result.scores.total / result.max_scores.total) * 100)
      saveBestPct("q54", selected.id, pct)
      setScores((prev) => ({ ...prev, [selected.id]: Math.max(prev[selected.id] ?? 0, pct) }))
      trackActivity(); saveSubmission({ questionType: "q54", promptId: selected.id, userAnswer: answer, gradeResult: result })
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Lỗi không xác định"
      if (msg === "free_limit_reached") { setShowUpgrade(true); return }
      setError(msg)
    } finally { setLoading(false) }
  }

  // Result view
  if (gradeResult && selected) {
    const pct = Math.round((gradeResult.scores.total / gradeResult.max_scores.total) * 100)
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="ml-56 flex-1 p-8">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={backToList} className="text-gray-400 hover:text-gray-600 text-sm">← Chọn đề khác</button>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-xs bg-gray-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">Q54</span>
            <span className="text-sm text-gray-500 truncate max-w-xs">{selected.context}</span>
            <div className="ml-auto flex items-center gap-2">
              <span className={`text-lg font-extrabold ${pct >= 80 ? "text-blue-600" : pct >= 60 ? "text-gray-600" : "text-blue-500"}`}>{gradeResult.scores.total}/{gradeResult.max_scores.total}</span>
              <span className="text-xs text-gray-400">điểm</span>
            </div>
          </div>
          <GradingResult result={gradeResult} onRetry={() => setGradeResult(null)} onNext={backToList} userAnswer={answer} />
        </div>
        </main>
      </div>
    )
  }

  // Editor view
  if (selected) {
    const charCount = answer.replace(/\n/g, "").length
    return (
      <div className="flex min-h-screen bg-background">
        {loading && <GradingLoader />}
        <Sidebar />
        <main className="ml-56 flex-1 p-8">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={backToList} className="text-gray-400 hover:text-gray-600 text-sm">← Danh sách đề</button>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-xs bg-gray-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">Q54</span>
            <span className="text-sm text-gray-500">{selected.context}</span>
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${difficultyColor(selected.difficulty)}`}>{difficultyLabel(selected.difficulty)}</span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {/* Đề bài (1/3) */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Đề bài</h2>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{selected.source}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selected.text_kr}</div>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2 text-xs">
                <div className="font-bold text-gray-700">📐 Cấu trúc gợi ý:</div>
                {["① Mở đề — nêu vấn đề (~100 chữ)", "② Luận điểm 1 + dẫn chứng (~150 chữ)", "③ Luận điểm 2 + dẫn chứng (~150 chữ)", "④ Kết luận — giải pháp/tổng kết (~100 chữ)"].map((s, i) => (
                  <div key={i} className="text-blue-700">{s}</div>
                ))}
              </div>
            </div>
            {/* Editor (2/3) */}
            <div className="col-span-2 flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">Bài viết của bạn</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[600, 650, 700].map((threshold) => (
                        <span key={threshold} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${charCount >= threshold ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"}`}>
                          {threshold}
                        </span>
                      ))}
                    </div>
                    <span className={`text-sm font-bold ${charCount < 600 ? "text-blue-500" : charCount > 700 ? "text-gray-600" : "text-blue-600"}`}>
                      {charCount} chữ {charCount < 600 ? `(còn ${600 - charCount})` : charCount > 700 ? "(hơi dài)" : "✓"}
                    </span>
                  </div>
                </div>
                <WongojiEditor value={answer} onChange={setAnswer} minChars={600} maxChars={720} questionType="q54" disabled={loading}
                  placeholder="Viết bài luận... (600–700 chữ, thể văn 다체)" />
              </div>
              {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}
              <div className="flex gap-3">
                <button onClick={() => setAnswer("")} className="px-5 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">Xóa</button>
                <button onClick={handleSubmit} disabled={charCount < 100 || loading}
                  className="flex-1 bg-gray-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                  {loading ? "AI đang chấm bài..." : "Nộp bài — AI chấm ngay"}
                </button>
              </div>
              <p className="text-center text-xs text-gray-400">Tối đa 50 điểm · AI chấm theo rubric của Viện Giáo dục Quốc tế Hàn Quốc (NIIED)</p>
            </div>
          </div>
        </div>
        </main>
      </div>
    )
  }

  // List view
  const attempted = Q54_PROMPTS.filter((p) => scores[p.id] !== null && scores[p.id] !== undefined).length
  const passed = Q54_PROMPTS.filter((p) => (scores[p.id] ?? 0) >= 80).length

  return (
    <div className="flex min-h-screen bg-background">
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      <Sidebar />
      <main className="ml-56 flex-1 p-8">
        <div className="w-full">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/practice" className="text-gray-400 hover:text-gray-600 text-sm">← Luyện viết</Link>
          <div className="w-px h-4 bg-gray-200" />
          <span className="text-xs bg-gray-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">Q54</span>
          <span className="font-bold text-gray-900">Bài luận</span>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="text-gray-400">{attempted}/{Q54_PROMPTS.length} đã thử</span>
            <span className="text-blue-600 font-semibold">{passed} đề ≥80%</span>
          </div>
        </div>
        <PracticeTips data={TIPS_Q54} />
        <h2 className="font-bold text-gray-900 mb-4">Chọn đề để luyện <span className="text-sm font-normal text-gray-400 ml-1">— xanh ≥80% · vàng 60–79% · cam &lt;60%</span></h2>
        <PromptGrid
          prompts={Q54_PROMPTS}
          scores={scores}
          onSelect={openPrompt}
          questionType="q54"
          renderExtra={(p) => p.topic
            ? <p className="text-xs text-gray-500 italic mt-1 line-clamp-2">{p.topic}</p>
            : null
          }
        />
        </div>
      </main>
    </div>
  )
}
