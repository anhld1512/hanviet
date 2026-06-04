"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
import WongojiEditor from "@/app/components/writing/WongojiEditor"
import GradingResult from "@/app/components/grading/GradingResult"
import GradingLoader from "@/app/components/grading/GradingLoader"
import UpgradeModal from "@/app/components/UpgradeModal"
import { Q53_PROMPTS, type WritingPrompt } from "@/lib/data/prompts"
import type { GradeResult } from "@/lib/grading-prompts"
import { saveSubmission } from "@/lib/save-submission"
import { trackActivity } from "@/lib/activity-tracker"
import { getBestPct, saveBestPct, scoreColor, scoreBadgeColor, difficultyLabel, difficultyColor, loadBestScoresFromDB, mergeBestScoresToLocalStorage } from "@/lib/practice-score"
import PracticeTips, { TIPS_Q53 } from "@/app/components/writing/PracticeTips"
import PromptGrid from "@/app/components/writing/PromptGrid"

type ChartData = {
  title?: string
  items?: Array<{ label: string; percent?: number; hours?: number }>
  male?: Array<{ label: string; percent: number }>
  female?: Array<{ label: string; percent: number }>
}

function ChartPreview({ chartData }: { chartData: ChartData }) {
  if (chartData.male && chartData.female) {
    return (
      <div className="space-y-3">
        {["male", "female"].map((gender) => {
          const items = gender === "male" ? chartData.male! : chartData.female!
          const label = gender === "male" ? "Nam" : "Nữ"
          const color = gender === "male" ? "bg-blue-400" : "bg-pink-400"
          return (
            <div key={gender}>
              <div className="text-xs font-bold text-gray-500 mb-1.5">{label}</div>
              <div className="space-y-1.5">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-20 text-xs text-gray-500 shrink-0 truncate">{item.label}</div>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${item.percent}%` }} />
                    </div>
                    <div className="text-xs font-bold text-gray-600 w-8 text-right">{item.percent}%</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  if (chartData.items) {
    const maxVal = Math.max(...chartData.items.map((i) => i.percent ?? i.hours ?? 0))
    return (
      <div className="space-y-2">
        {chartData.items.map((item, i) => {
          const val = item.percent ?? item.hours ?? 0
          const unit = item.percent !== undefined ? "%" : "시간"
          return (
            <div key={i} className="flex items-center gap-2">
              <div className="w-24 text-xs text-gray-500 shrink-0 truncate">{item.label}</div>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(val / maxVal) * 100}%` }} />
              </div>
              <div className="text-xs font-bold text-gray-600 w-12 text-right">{val}{unit}</div>
            </div>
          )
        })}
      </div>
    )
  }
  return null
}

export default function Q53Page() {
  const [selected, setSelected] = useState<WritingPrompt | null>(null)
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<number, number | null>>({})
  const [showUpgrade, setShowUpgrade] = useState(false)

  useEffect(() => {
    const s: Record<number, number | null> = {}
    Q53_PROMPTS.forEach((p) => { s[p.id] = getBestPct("q53", p.id) })
    setScores(s)
    loadBestScoresFromDB("q53").then((dbScores) => {
      mergeBestScoresToLocalStorage("q53", dbScores)
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
        body: JSON.stringify({ question_type: "q53", chart_description: selected.text_kr, student_essay: answer }),
      })
      const text = await res.text()
      let data: Record<string, unknown>
      try { data = JSON.parse(text) } catch { throw new Error("Máy chủ gặp sự cố. Vui lòng thử lại.") }
      if (!res.ok) throw new Error((data.error as string) || "Lỗi máy chủ")
      const result = data as unknown as GradeResult
      setGradeResult(result)
      const pct = Math.round((result.scores.total / result.max_scores.total) * 100)
      saveBestPct("q53", selected.id, pct)
      setScores((prev) => ({ ...prev, [selected.id]: Math.max(prev[selected.id] ?? 0, pct) }))
      trackActivity(); saveSubmission({ questionType: "q53", promptId: selected.id, userAnswer: answer, gradeResult: result })
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
      <div className="flex min-h-screen bg-[#f8f9fb]">
        <Sidebar />
        <main className="ml-56 flex-1 p-8">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={backToList} className="text-gray-400 hover:text-gray-600 text-sm">← Chọn đề khác</button>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2.5 py-1 rounded-full">Q53</span>
            <span className="text-sm text-gray-500 truncate max-w-xs">{selected.context}</span>
            <div className="ml-auto flex items-center gap-2">
              <span className={`text-lg font-extrabold ${pct >= 80 ? "text-green-600" : pct >= 60 ? "text-yellow-600" : "text-orange-500"}`}>{gradeResult.scores.total}/{gradeResult.max_scores.total}</span>
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
    const chart = (selected.chart_data ?? {}) as ChartData
    const charCount = answer.replace(/\n/g, "").length
    return (
      <div className="flex min-h-screen bg-[#f8f9fb]">
        {loading && <GradingLoader />}
        <Sidebar />
        <main className="ml-56 flex-1 p-8">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={backToList} className="text-gray-400 hover:text-gray-600 text-sm">← Danh sách đề</button>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2.5 py-1 rounded-full">Q53</span>
            <span className="text-sm text-gray-500">{selected.context}</span>
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${difficultyColor(selected.difficulty)}`}>{difficultyLabel(selected.difficulty)}</span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {/* Biểu đồ */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="font-bold text-gray-900">{chart.title ?? "Biểu đồ"}</h2>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{selected.source}</span>
                </div>
                <ChartPreview chartData={chart} />
                <div className="mt-4 bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selected.text_kr}</div>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-xs text-purple-800">
                <span className="font-bold">Lưu ý Q53:</span> Mục tiêu 200–300 chữ. Thể văn 다체. Không thêm ý kiến cá nhân.
              </div>
            </div>
            {/* Editor */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">Bài viết của bạn</h3>
                  <span className={`text-sm font-bold ${charCount < 200 ? "text-orange-500" : charCount > 300 ? "text-yellow-600" : "text-green-600"}`}>
                    {charCount} chữ {charCount < 200 ? "(cần ≥200)" : charCount > 300 ? "(hơi dài)" : "✓"}
                  </span>
                </div>
                <WongojiEditor value={answer} onChange={setAnswer} minChars={200} maxChars={320} questionType="q53" disabled={loading}
                  placeholder="Viết bài phân tích biểu đồ... (200–300 chữ)" />
              </div>
              {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}
              <button onClick={handleSubmit} disabled={!answer.trim() || loading}
                className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                {loading ? "AI đang chấm bài..." : "Nộp bài — AI chấm ngay"}
              </button>
              <p className="text-center text-xs text-gray-400">Tối đa 30 điểm · AI chấm theo rubric NIIED</p>
            </div>
          </div>
        </div>
        </main>
      </div>
    )
  }

  // List view
  const attempted = Q53_PROMPTS.filter((p) => scores[p.id] !== null && scores[p.id] !== undefined).length
  const passed = Q53_PROMPTS.filter((p) => (scores[p.id] ?? 0) >= 80).length

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      <Sidebar />
      <main className="ml-56 flex-1 p-8">
        <div className="w-full">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/practice" className="text-gray-400 hover:text-gray-600 text-sm">← Luyện viết</Link>
          <div className="w-px h-4 bg-gray-200" />
          <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2.5 py-1 rounded-full">Q53</span>
          <span className="font-bold text-gray-900">Phân tích biểu đồ</span>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="text-gray-400">{attempted}/{Q53_PROMPTS.length} đã thử</span>
            <span className="text-green-600 font-semibold">{passed} đề ≥80%</span>
          </div>
        </div>
        <PracticeTips data={TIPS_Q53} />
        <h2 className="font-bold text-gray-900 mb-4">Chọn đề để luyện <span className="text-sm font-normal text-gray-400 ml-1">— xanh ≥80% · vàng 60–79% · cam &lt;60%</span></h2>
        <PromptGrid
          prompts={Q53_PROMPTS}
          scores={scores}
          onSelect={openPrompt}
          questionType="q53"
          renderExtra={(p) => {
            const chart = (p.chart_data ?? {}) as ChartData
            if (!chart.items) return null
            const maxVal = Math.max(...chart.items.map((x) => x.percent ?? x.hours ?? 0))
            return (
              <div className="space-y-1 mt-2">
                {chart.items.slice(0, 3).map((item, i) => {
                  const val = item.percent ?? item.hours ?? 0
                  return (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-14 text-[10px] text-gray-400 truncate shrink-0">{item.label}</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-300 rounded-full" style={{ width: `${(val / maxVal) * 100}%` }} />
                      </div>
                      <div className="text-[10px] text-gray-400 w-6 text-right shrink-0">{val}{item.percent !== undefined ? "%" : "h"}</div>
                    </div>
                  )
                })}
              </div>
            )
          }}
        />
        </div>
      </main>
    </div>
  )
}
