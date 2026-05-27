"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
import WongojiEditor from "@/app/components/writing/WongojiEditor"
import GradingResult from "@/app/components/grading/GradingResult"
import UpgradeModal from "@/app/components/UpgradeModal"
import { Q52_PROMPTS, type WritingPrompt } from "@/lib/data/prompts"
import type { GradeResult } from "@/lib/grading-prompts"
import { saveSubmission } from "@/lib/save-submission"
import { getBestPct, saveBestPct, scoreColor, scoreBadgeColor, difficultyLabel, difficultyColor, loadBestScoresFromDB, mergeBestScoresToLocalStorage } from "@/lib/practice-score"
import PracticeTips, { TIPS_Q52 } from "@/app/components/writing/PracticeTips"
import PromptGrid from "@/app/components/writing/PromptGrid"

export default function Q52Page() {
  const [selected, setSelected] = useState<WritingPrompt | null>(null)
  const [answerA, setAnswerA] = useState("")
  const [answerB, setAnswerB] = useState("")
  const [loading, setLoading] = useState(false)
  const [gradeA, setGradeA] = useState<GradeResult | null>(null)
  const [gradeB, setGradeB] = useState<GradeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showHint, setShowHint] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<number, number | null>>({})
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [activeTab, setActiveTab] = useState<"A" | "B">("A")

  useEffect(() => {
    const s: Record<number, number | null> = {}
    Q52_PROMPTS.forEach((p) => { s[p.id] = getBestPct("q52", p.id) })
    setScores(s)
    loadBestScoresFromDB("q52").then((dbScores) => {
      mergeBestScoresToLocalStorage("q52", dbScores)
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

  function openPrompt(p: WritingPrompt) {
    setSelected(p); setAnswerA(""); setAnswerB("")
    setGradeA(null); setGradeB(null); setError(null); setShowHint(null)
  }

  function handleAnswerAChange(v: string) { setAnswerA(v); if (error) setError(null) }
  function handleAnswerBChange(v: string) { setAnswerB(v); if (error) setError(null) }

  function backToList() {
    setSelected(null); setGradeA(null); setGradeB(null); setAnswerA(""); setAnswerB("")
  }

  async function gradeBlank(blankKey: string, answer: string, hint: string): Promise<GradeResult | null> {
    const res = await fetch("/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_type: "q52", prompt_text: selected!.text_kr, blank_key: blankKey, student_answer: answer, context_hint: hint }),
    })
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Lỗi máy chủ") }
    return res.json()
  }

  async function handleSubmit() {
    if (!answerA.trim() || !answerB.trim() || !selected) return

    // Client-side copy detection — reject before calling API
    const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase()
    const promptNorm = norm(selected.text_kr)
    if (answerA.trim().length > 5 && promptNorm.includes(norm(answerA.trim()))) {
      setError("(ㄱ) Câu này sao chép từ đề bài. Hãy tự viết câu của bạn.")
      return
    }
    if (answerB.trim().length > 5 && promptNorm.includes(norm(answerB.trim()))) {
      setError("(ㄴ) Câu này sao chép từ đề bài. Hãy tự viết câu của bạn.")
      return
    }

    setLoading(true); setError(null)
    try {
      const [rA, rB] = await Promise.all([
        gradeBlank("ㄱ", answerA, selected.blanks?.[0]?.hint ?? ""),
        gradeBlank("ㄴ", answerB, selected.blanks?.[1]?.hint ?? ""),
      ])
      setGradeA(rA); setGradeB(rB)
      if (rA && rB) {
        const total = rA.scores.total + rB.scores.total
        const max = rA.max_scores.total + rB.max_scores.total
        const pct = Math.round((total / max) * 100)
        saveBestPct("q52", selected.id, pct)
        setScores((prev) => ({ ...prev, [selected.id]: Math.max(prev[selected.id] ?? 0, pct) }))
        const combined: GradeResult = {
          question_type: "q52",
          scores: { content: rA.scores.content + rB.scores.content, organization: 0, language: rA.scores.language + rB.scores.language, style: rA.scores.style + rB.scores.style, total },
          max_scores: { content: 4, organization: 0, language: 4, style: 2, total: 10 },
          feedback: { overall: rA.feedback.overall + " | " + rB.feedback.overall, content: "", organization: "", language: "", style: "" },
          corrections: [...rA.corrections, ...rB.corrections],
        }
        saveSubmission({ questionType: "q52", promptId: selected.id, userAnswer: `(ㄱ) ${answerA}\n(ㄴ) ${answerB}`, gradeResult: combined })
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Lỗi không xác định"
      if (msg === "free_limit_reached") { setShowUpgrade(true); return }
      setError(msg)
    } finally { setLoading(false) }
  }

  // Result view
  if (gradeA && gradeB && selected) {
    const total = gradeA.scores.total + gradeB.scores.total
    const max = gradeA.max_scores.total + gradeB.max_scores.total
    const pct = Math.round((total / max) * 100)
    const activeGrade = activeTab === "A" ? gradeA : gradeB
    const activeAnswer = activeTab === "A" ? answerA : answerB
    const activeScore = activeTab === "A" ? gradeA.scores.total : gradeB.scores.total
    const activeMax = activeTab === "A" ? gradeA.max_scores.total : gradeB.max_scores.total
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="ml-56 flex-1 p-8">
          <div className="max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={backToList} className="text-gray-400 hover:text-gray-600 text-sm">← Chọn đề khác</button>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">Q52</span>
            <span className="text-sm text-gray-500 truncate max-w-xs">{selected.context}</span>
            <div className="ml-auto flex items-center gap-2">
              <span className={`text-lg font-extrabold ${pct >= 80 ? "text-green-600" : pct >= 60 ? "text-yellow-600" : "text-orange-500"}`}>{total}/{max}</span>
              <span className="text-xs text-gray-400">điểm tổng</span>
            </div>
          </div>

          {/* Score summary bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 flex gap-4">
            {[
              { key: "A", label: "ㄱ", answer: answerA, score: gradeA.scores.total, max: gradeA.max_scores.total },
              { key: "B", label: "ㄴ", answer: answerB, score: gradeB.scores.total, max: gradeB.max_scores.total },
            ].map((item) => {
              const p = Math.round((item.score / item.max) * 100)
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key as "A" | "B")}
                  className={`flex-1 text-left rounded-xl p-3 border-2 transition-all ${activeTab === item.key ? "border-blue-400 bg-blue-50" : "border-transparent bg-gray-50 hover:bg-gray-100"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{item.label}</span>
                    <span className={`text-sm font-bold ${p >= 80 ? "text-green-600" : p >= 60 ? "text-yellow-600" : "text-orange-500"}`}>{item.score}/{item.max} điểm</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{item.answer}</p>
                </button>
              )
            })}
          </div>

          {/* Active tab result */}
          <div className="mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{activeTab === "A" ? "ㄱ" : "ㄴ"}</span>
            <span className="text-sm font-semibold text-gray-700">{activeAnswer}</span>
            <span className={`ml-auto text-sm font-bold ${Math.round((activeScore/activeMax)*100) >= 80 ? "text-green-600" : "text-orange-500"}`}>{activeScore}/{activeMax}</span>
          </div>
          <GradingResult result={activeGrade} onRetry={() => { setGradeA(null); setGradeB(null) }} onNext={backToList} />
          </div>
        </main>
      </div>
    )
  }

  // Editor view
  if (selected) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="ml-56 flex-1 p-8">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={backToList} className="text-gray-400 hover:text-gray-600 text-sm">← Danh sách đề</button>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">Q52</span>
            <span className="text-sm text-gray-500">{selected.context}</span>
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${difficultyColor(selected.difficulty)}`}>{difficultyLabel(selected.difficulty)}</span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-bold text-gray-900">Đề bài</h2>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{selected.source}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 font-mono text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selected.text_kr}</div>
              <p className="text-xs text-gray-400 mt-3">Viết 1 câu phù hợp vào mỗi chỗ trống. Thể văn: 다/ㄴ다체.</p>
              <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                <span className="font-bold">Lưu ý Q52:</span> Dùng 다체 học thuật. KHÔNG dùng 습니다 hay 해요.
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {selected.blanks?.map((blank) => {
                const isA = blank.key === "ㄱ"
                const value = isA ? answerA : answerB
                const setValue = isA ? setAnswerA : setAnswerB
                return (
                  <div key={blank.key} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{blank.key}</span>
                        <span className="text-sm text-gray-500">{blank.hint}</span>
                      </div>
                      <button onClick={() => setShowHint(showHint === blank.key ? null : blank.key)} className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                        {showHint === blank.key ? "Ẩn gợi ý" : "Xem gợi ý"}
                      </button>
                    </div>
                    {showHint === blank.key && (
                      <div className="bg-blue-50 rounded-xl p-3 mb-3 text-xs">
                        <div className="text-blue-700 font-semibold mb-1">Pattern: {blank.pattern}</div>
                        <div className="text-blue-600">VD: {blank.example}</div>
                      </div>
                    )}
                    <WongojiEditor value={value} onChange={isA ? handleAnswerAChange : handleAnswerBChange} placeholder={`Viết câu cho chỗ trống ${blank.key}...`} questionType="q52" disabled={loading} />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{value.length} ký tự</span>
                      {value.length > 0 && (value.trim().endsWith("습니다") || value.trim().endsWith("해요")) && (
                        <span className="text-xs text-orange-500">Q52 dùng 다체, không dùng 습니다/해요</span>
                      )}
                    </div>
                  </div>
                )
              })}
              {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}
              <button onClick={handleSubmit} disabled={!answerA.trim() || !answerB.trim() || loading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                {loading ? "AI đang chấm bài..." : "Nộp bài — AI chấm ngay"}
              </button>
            </div>
          </div>
        </div>
        </main>
      </div>
    )
  }

  // List view
  const attempted = Q52_PROMPTS.filter((p) => scores[p.id] !== null && scores[p.id] !== undefined).length
  const passed = Q52_PROMPTS.filter((p) => (scores[p.id] ?? 0) >= 80).length

  return (
    <div className="flex min-h-screen bg-gray-50">
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      <Sidebar />
      <main className="ml-56 flex-1 p-8">
        <div className="w-full">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/practice" className="text-gray-400 hover:text-gray-600 text-sm">← Luyện viết</Link>
          <div className="w-px h-4 bg-gray-200" />
          <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">Q52</span>
          <span className="font-bold text-gray-900">Nghị luận ngắn</span>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="text-gray-400">{attempted}/{Q52_PROMPTS.length} đã thử</span>
            <span className="text-green-600 font-semibold">{passed} đề ≥80%</span>
          </div>
        </div>
        <PracticeTips data={TIPS_Q52} />
        <h2 className="font-bold text-gray-900 mb-4">Chọn đề để luyện <span className="text-sm font-normal text-gray-400 ml-1">— xanh ≥80% · vàng 60–79% · cam &lt;60%</span></h2>
        <PromptGrid
          prompts={Q52_PROMPTS}
          scores={scores}
          onSelect={openPrompt}
          questionType="q52"
        />
        </div>
      </main>
    </div>
  )
}
