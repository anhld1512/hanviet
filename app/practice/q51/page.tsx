"use client"

import { useState } from "react"
import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
import WongojiEditor from "@/app/components/writing/WongojiEditor"
import GradingResult from "@/app/components/grading/GradingResult"
import { Q51_PROMPTS } from "@/lib/data/prompts"
import type { GradeResult } from "@/lib/grading-prompts"

export default function Q51Page() {
  const [promptIndex, setPromptIndex] = useState(0)
  const [answerA, setAnswerA] = useState("")
  const [answerB, setAnswerB] = useState("")
  const [loading, setLoading] = useState(false)
  const [gradeA, setGradeA] = useState<GradeResult | null>(null)
  const [gradeB, setGradeB] = useState<GradeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showHint, setShowHint] = useState<string | null>(null)

  const prompt = Q51_PROMPTS[promptIndex]

  function handleNext() {
    const next = (promptIndex + 1) % Q51_PROMPTS.length
    setPromptIndex(next)
    setAnswerA("")
    setAnswerB("")
    setGradeA(null)
    setGradeB(null)
    setError(null)
    setShowHint(null)
  }

  function handleRetry() {
    setAnswerA("")
    setAnswerB("")
    setGradeA(null)
    setGradeB(null)
    setError(null)
  }

  async function gradeBlank(blankKey: string, answer: string, hint: string): Promise<GradeResult | null> {
    const res = await fetch("/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_type: "q51",
        prompt_text: prompt.text_kr,
        blank_key: blankKey,
        student_answer: answer,
        context_hint: hint,
      }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Loi may chu")
    }
    return res.json()
  }

  async function handleSubmit() {
    if (!answerA.trim() || !answerB.trim()) return
    setLoading(true)
    setError(null)
    try {
      const [rA, rB] = await Promise.all([
        gradeBlank("ㄱ", answerA, prompt.blanks?.[0]?.hint ?? ""),
        gradeBlank("ㄴ", answerB, prompt.blanks?.[1]?.hint ?? ""),
      ])
      setGradeA(rA)
      setGradeB(rB)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Loi khong xac dinh")
    } finally {
      setLoading(false)
    }
  }

  // Show results
  if (gradeA && gradeB) {
    const totalScore = gradeA.scores.total + gradeB.scores.total
    const maxScore = gradeA.max_scores.total + gradeB.max_scores.total
    const pct = Math.round((totalScore / maxScore) * 100)

    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="ml-56 flex-1 p-8">
          <div className="max-w-2xl">
            {/* Header ket qua */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full">Q51</span>
              <span className="text-sm text-gray-500">Ket qua cham bai</span>
              <div className="ml-auto">
                <span className={`text-lg font-extrabold ${pct >= 80 ? "text-green-600" : pct >= 60 ? "text-yellow-600" : "text-orange-500"}`}>
                  {totalScore}/{maxScore}
                </span>
                <span className="text-xs text-gray-400 ml-1">diem Q51</span>
              </div>
            </div>

            {/* Ket qua cho tu (ㄱ) */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">ㄱ</span>
                <span className="text-sm text-gray-700 font-medium">Bai viet: <span className="text-gray-500 font-normal">{answerA}</span></span>
              </div>
              <GradingResult result={gradeA} onRetry={handleRetry} onNext={handleNext} />
            </div>

            {/* Ket qua cho tu (ㄴ) */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">ㄴ</span>
                <span className="text-sm text-gray-700 font-medium">Bai viet: <span className="text-gray-500 font-normal">{answerB}</span></span>
              </div>
              <GradingResult result={gradeB} onRetry={handleRetry} onNext={handleNext} />
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-56 flex-1 p-8">
        <div className="max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/practice" className="text-gray-400 hover:text-gray-600 text-sm">
              Quay lai
            </Link>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full">Q51</span>
            <span className="text-sm text-gray-500">Thuc dung van</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-400">{prompt.source}</span>
              <span className="text-xs text-gray-300">|</span>
              <span className="text-xs text-gray-400">{promptIndex + 1}/{Q51_PROMPTS.length}</span>
              <button onClick={handleNext} className="text-xs text-blue-500 hover:text-blue-600 font-medium ml-1">
                Doi de
              </button>
            </div>
          </div>

          {/* De bai */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-bold text-gray-900">De bai</h2>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{prompt.context}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 font-mono text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {prompt.text_kr}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Viet 1 cau phu hop vao moi cho trong (ㄱ) va (ㄴ). The van: 습니다체.
            </p>
          </div>

          {/* Answer inputs */}
          <div className="space-y-4 mb-6">
            {prompt.blanks?.map((blank) => {
              const isA = blank.key === "ㄱ"
              const value = isA ? answerA : answerB
              const setValue = isA ? setAnswerA : setAnswerB

              return (
                <div key={blank.key} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {blank.key}
                      </span>
                      <span className="text-sm text-gray-500">{blank.hint}</span>
                    </div>
                    <button
                      onClick={() => setShowHint(showHint === blank.key ? null : blank.key)}
                      className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                    >
                      {showHint === blank.key ? "An goi y" : "Xem goi y"}
                    </button>
                  </div>

                  {showHint === blank.key && (
                    <div className="bg-blue-50 rounded-xl p-3 mb-3 text-xs">
                      <div className="text-blue-700 font-semibold mb-1">Pattern: {blank.pattern}</div>
                      <div className="text-blue-600">Vi du: {blank.example}</div>
                    </div>
                  )}

                  <WongojiEditor
                    value={value}
                    onChange={setValue}
                    placeholder={`Viet cau cho cho trong ${blank.key}...`}
                    questionType="q51"
                    disabled={loading}
                  />

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{value.length} ky tu</span>
                    {value.length > 0 && !value.trim().endsWith("다") && !value.trim().endsWith("요") && (
                      <span className="text-xs text-orange-500">Nho ket thuc cau bang 습니다 hoac ㅂ니다</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <button
              onClick={() => { setAnswerA(""); setAnswerB("") }}
              className="px-6 py-3.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              Xoa het
            </button>
            <button
              onClick={handleSubmit}
              disabled={!answerA.trim() || !answerB.trim() || loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
            >
              {loading ? "AI dang cham bai..." : "Nop bai - AI cham ngay"}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-3">
            AI cham theo rubric NIIED chinh thuc, feedback tieng Viet
          </p>
        </div>
      </main>
    </div>
  )
}
