"use client"

import { useState } from "react"
import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
import WongojiEditor from "@/app/components/writing/WongojiEditor"
import { Q54_PROMPTS } from "@/lib/data/prompts"

export default function Q54Page() {
  const [promptIndex, setPromptIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const prompt = Q54_PROMPTS[promptIndex]

  function handleNext() {
    const next = (promptIndex + 1) % Q54_PROMPTS.length
    setPromptIndex(next)
    setAnswer("")
    setSubmitted(false)
  }

  async function handleSubmit() {
    if (!answer.trim()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 2000))
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    const charCount = answer.replace(/\n/g, "").length
    const inRange = charCount >= 600 && charCount <= 700
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="ml-56 flex-1 p-8">
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{inRange ? "🎉" : "⚠️"}</div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {inRange ? "Hoan thanh! Dung do dai." : "Kiem tra lai do dai"}
                </h2>
                <p className="text-gray-500 text-sm">
                  Bai viet cua ban: <span className={`font-bold ${inRange ? "text-green-600" : "text-orange-500"}`}>{charCount}</span> chu
                  {!inRange && charCount < 600 && ` (can them ${600 - charCount} chu)`}
                  {!inRange && charCount > 700 && ` (bot ${charCount - 700} chu)`}
                </p>
              </div>

              {/* Score breakdown placeholder */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="text-sm font-bold text-gray-700 mb-3">Rubric NIIED (AI cham o Task 4):</div>
                <div className="space-y-2">
                  {[
                    { label: "Noi dung (Content)", max: 12 },
                    { label: "Cu truc (Organization)", max: 12 },
                    { label: "Ngu phap (Language use)", max: 14 },
                    { label: "The van (Style/Register)", max: 12 },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-40 shrink-0">{r.label}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full" />
                      <span className="text-xs text-gray-300 shrink-0">?/{r.max}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200 flex justify-between">
                    <span className="text-sm font-bold text-gray-700">Tong diem</span>
                    <span className="text-sm font-bold text-gray-300">?/50</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setSubmitted(false); setAnswer("") }}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Viet lai
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors text-sm"
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
            <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2.5 py-1 rounded-full">Q54</span>
            <span className="text-sm text-gray-500">Luan nghi luan</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-400">{prompt.source}</span>
              <span className="text-xs text-gray-300">|</span>
              <span className="text-xs text-gray-400">{promptIndex + 1}/{Q54_PROMPTS.length}</span>
              <button onClick={handleNext} className="text-xs text-blue-500 hover:text-blue-600 font-medium ml-1">
                Doi de
              </button>
            </div>
          </div>

          {/* Canh bao quan trong */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
            <div className="text-xs text-orange-800 space-y-1">
              <div><span className="font-bold">BAT BUOC:</span> Dung 합쇼체 (-ㅂ니다/습니다). Dung 해요체 bi tru diem phong cach.</div>
              <div><span className="font-bold">Do dai:</span> 600-700 chu. Thieu hoac vuot qua 50 chu se bi tru diem.</div>
              <div><span className="font-bold">Cu truc:</span> Mo bai (80-100 chu) + Than bai 2-3 doan (400-500 chu) + Ket luan (80-100 chu).</div>
            </div>
          </div>

          {/* De bai */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-bold text-gray-900">De bai</h2>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{prompt.context}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-600 mb-3 leading-relaxed">
              {prompt.text_kr}
            </div>
            <div className="bg-white border border-orange-200 rounded-xl p-4">
              <p className="text-sm font-bold text-gray-900 leading-relaxed">{prompt.topic}</p>
            </div>
          </div>

          {/* Editor */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Bai luan cua ban</h3>
              <span className="text-xs text-gray-400 bg-orange-50 px-2 py-1 rounded-lg">Thoi gian de nghi: 28-35 phut</span>
            </div>
            <WongojiEditor
              value={answer}
              onChange={setAnswer}
              questionType="q54"
              timeLimit={35 * 60}
              placeholder="Viet bai luan 600-700 chu o day... (BAT BUOC dung -ㅂ니다/습니다)"
              disabled={loading}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              onClick={() => setAnswer("")}
              className="px-6 py-3.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              Xoa het
            </button>
            <button
              onClick={handleSubmit}
              disabled={!answer.trim() || loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
            >
              {loading ? "Dang cham bai..." : "Nop bai - AI cham ngay"}
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            AI cham theo 4 tieu chi NIIED chinh thuc, feedback chi tiet tieng Viet
          </p>
        </div>
      </main>
    </div>
  )
}
