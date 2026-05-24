"use client"

import { useState } from "react"
import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
import WongojiEditor from "@/app/components/writing/WongojiEditor"
import { Q53_PROMPTS } from "@/lib/data/prompts"

export default function Q53Page() {
  const [promptIndex, setPromptIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const prompt = Q53_PROMPTS[promptIndex]
  const chart = (prompt.chart_data ?? {}) as {
    title?: string
    items?: Array<{label: string; percent?: number; hours?: number}>
    male?: Array<{label: string; percent: number}>
    female?: Array<{label: string; percent: number}>
  }

  function handleNext() {
    const next = (promptIndex + 1) % Q53_PROMPTS.length
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
    const inRange = charCount >= 200 && charCount <= 300
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="ml-56 flex-1 p-8">
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{inRange ? "✅" : "⚠️"}</div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {inRange ? "Du do dai (200-300 chu)!" : "Luu y do dai bai viet"}
                </h2>
                <p className="text-gray-500 text-sm">
                  Bai viet cua ban: {charCount} chu
                  {!inRange && charCount < 200 && ` (thieu ${200 - charCount} chu)`}
                  {!inRange && charCount > 300 && ` (vuot ${charCount - 300} chu)`}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
                <div className="text-sm font-semibold text-gray-700 mb-2">Bai viet cua ban:</div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{answer}</p>
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
                  className="flex-1 bg-purple-500 text-white font-bold py-3 rounded-xl hover:bg-purple-600 transition-colors text-sm"
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
            <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2.5 py-1 rounded-full">Q53</span>
            <span className="text-sm text-gray-500">Phan tich bieu do</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-400">{prompt.source}</span>
              <span className="text-xs text-gray-300">|</span>
              <span className="text-xs text-gray-400">{promptIndex + 1}/{Q53_PROMPTS.length}</span>
              <button onClick={handleNext} className="text-xs text-blue-500 hover:text-blue-600 font-medium ml-1">
                Doi de
              </button>
            </div>
          </div>

          {/* Huong dan */}
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-6 text-xs text-purple-700">
            <span className="font-bold">Luu y Q53:</span> Viet 200-300 chu. The van: 다/ㄴ다체. Cau truc: Mo dau mo ta bieu do -&gt; Phan tich so lieu cu the -&gt; Giai thich nguyen nhan (1-2 cau). Khong can ket luan.
          </div>

          {/* Bieu do */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-bold text-gray-900">Bieu do / Du lieu</h2>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{prompt.context}</span>
            </div>

            {/* Chart title */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="text-sm font-bold text-gray-800 mb-3 text-center">
                {chart.title as string}
              </div>

              {/* Render items */}
              {Array.isArray(chart.items) && (
                <div className="space-y-2">
                  {(chart.items as Array<{label: string; percent?: number; hours?: number}>).map((item, i) => {
                    const value = item.percent ?? item.hours ?? 0
                    const maxVal = item.percent !== undefined ? 100 : 8
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-32 text-xs text-gray-600 text-right shrink-0">{item.label}</div>
                        <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-purple-400 rounded-lg flex items-center justify-end pr-2"
                            style={{ width: `${Math.min((value / maxVal) * 100, 100)}%` }}
                          >
                            <span className="text-white text-xs font-bold">
                              {item.percent !== undefined ? `${value}%` : `${value}h`}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Gender comparison */}
              {chart.male && chart.female && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <div className="text-xs font-bold text-blue-600 mb-2 text-center">Nam (남성)</div>
                    {(chart.male as Array<{label: string; percent: number}>).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 mb-1">
                        <div className="w-16 text-xs text-gray-600 text-right shrink-0">{item.label}</div>
                        <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                          <div
                            className="h-full bg-blue-400 rounded flex items-center justify-end pr-1"
                            style={{ width: `${item.percent}%` }}
                          >
                            <span className="text-white text-xs">{item.percent}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-pink-600 mb-2 text-center">Nu (여성)</div>
                    {(chart.female as Array<{label: string; percent: number}>).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 mb-1">
                        <div className="w-16 text-xs text-gray-600 text-right shrink-0">{item.label}</div>
                        <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                          <div
                            className="h-full bg-pink-400 rounded flex items-center justify-end pr-1"
                            style={{ width: `${item.percent}%` }}
                          >
                            <span className="text-white text-xs">{item.percent}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-3 text-center">{prompt.text_kr}</p>
            </div>
          </div>

          {/* Editor */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Bai viet cua ban</h3>
            <WongojiEditor
              value={answer}
              onChange={setAnswer}
              questionType="q53"
              placeholder="Viet bai phan tich bieu do o day... (200-300 chu)"
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
              className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
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
