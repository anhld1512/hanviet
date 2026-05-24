"use client"

import { useState } from "react"
import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
import WongojiEditor from "@/app/components/writing/WongojiEditor"
import { Q52_PROMPTS } from "@/lib/data/prompts"

export default function Q52Page() {
  const [promptIndex, setPromptIndex] = useState(0)
  const [answerA, setAnswerA] = useState("")
  const [answerB, setAnswerB] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showHint, setShowHint] = useState<string | null>(null)

  const prompt = Q52_PROMPTS[promptIndex]

  function handleNext() {
    const next = (promptIndex + 1) % Q52_PROMPTS.length
    setPromptIndex(next)
    setAnswerA("")
    setAnswerB("")
    setSubmitted(false)
    setShowHint(null)
  }

  async function handleSubmit() {
    if (!answerA.trim() || !answerB.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="ml-56 flex-1 p-8">
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Hoan thanh!</h2>
              <p className="text-gray-500 text-sm mb-6">
                AI cham diem chi tiet se ra o phien ban tiep theo.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
                <div className="text-sm font-semibold text-gray-700 mb-3">Bai viet cua ban:</div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium text-blue-600">ㄱ:</span> {answerA}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">ㄴ:</span> {answerB}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setSubmitted(false); setAnswerA(""); setAnswerB("") }}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Lam lai
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors text-sm"
                >
                  De tiep theo
                </button>
              </div>
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
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">Q52</span>
            <span className="text-sm text-gray-500">Nghi luan ngan</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-400">{prompt.source}</span>
              <span className="text-xs text-gray-300">|</span>
              <span className="text-xs text-gray-400">{promptIndex + 1}/{Q52_PROMPTS.length}</span>
              <button onClick={handleNext} className="text-xs text-blue-500 hover:text-blue-600 font-medium ml-1">
                Doi de
              </button>
            </div>
          </div>

          {/* Huong dan Q52 */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 text-xs text-blue-700">
            <span className="font-bold">Luu y Q52:</span> The van la 다/ㄴ다체 (van viet hoc thuat). KHONG dung 습니다 hay 해요. Cau dien vao phai logic, thuong doi lap voi y cau truoc.
          </div>

          {/* De bai */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-bold text-gray-900">De bai</h2>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{prompt.context}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {prompt.text_kr}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Viet 1 cau phu hop vao moi cho trong (ㄱ) va (ㄴ). The van: 다/ㄴ다체.
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
                    questionType="q52"
                    disabled={loading}
                  />

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{value.length} ky tu</span>
                    {value.length > 0 && (value.trim().endsWith("습니다") || value.trim().endsWith("해요")) && (
                      <span className="text-xs text-orange-500">
                        Q52 dung 다체, khong dung 습니다/해요
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

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
              {loading ? "Dang cham bai..." : "Nop bai - AI cham ngay"}
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
