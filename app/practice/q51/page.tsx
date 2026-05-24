"use client"

import { useState } from "react"
import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
import WongojiEditor from "@/app/components/writing/WongojiEditor"

// De bai mau Q51
const SAMPLE_PROMPT = {
  id: 1,
  source: "TOPIK 83",
  context: "Thư cảm ơn gửi đến giáo viên đã giúp đỡ trong năm học",
  text_kr: `선생님께

안녕하세요. 저는 선생님 수업을 들은 학생입니다. 이번에 졸업을 하게 되어 선생님께 감사의 편지를 씁니다.

지난 1년 동안 선생님께서 열심히 가르쳐 주신 덕분에 제 한국어 실력이 많이 늘었습니다. 특히 글쓰기 부분에서 (   ㄱ   ).

앞으로도 선생님의 가르침을 잊지 않고 열심히 공부하겠습니다. (   ㄴ   ).

감사합니다.
학생 드림`,
  blanks: [
    {
      key: "ㄱ",
      hint: "Viết về sự tiến bộ cụ thể nhờ thầy/cô",
      example: "많은 도움을 받았습니다",
      pattern: "[điều được giúp] + 아/어 주셔서 감사합니다 / 도움을 받았습니다",
    },
    {
      key: "ㄴ",
      hint: "Lời chúc cuối thư",
      example: "항상 건강하시기 바랍니다",
      pattern: "[lời chúc] + (으)시기 바랍니다",
    },
  ],
}

export default function Q51Page() {
  const [answerA, setAnswerA] = useState("")
  const [answerB, setAnswerB] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showHint, setShowHint] = useState<string | null>(null)

  async function handleSubmit() {
    if (!answerA.trim() || !answerB.trim()) return
    setLoading(true)
    // TODO: goi API /api/grade
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
              <div className="text-5xl mb-4">⏳</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">AI đang chấm bài...</h2>
              <p className="text-gray-500 text-sm mb-6">
                Tính năng AI chấm điểm sẽ hoàn thiện ở Task 4. Hiện tại bạn đã luyện viết thành công!
              </p>
              <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
                <div className="text-sm font-semibold text-gray-700 mb-2">Bài viết của bạn:</div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">ㄱ:</span> {answerA}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">ㄴ:</span> {answerB}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setSubmitted(false); setAnswerA(""); setAnswerB("") }}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Làm lại
                </button>
                <Link
                  href="/practice"
                  className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors text-sm text-center"
                >
                  Luyện câu khác →
                </Link>
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
            <Link href="/practice" className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1">
              ← Quay lại
            </Link>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full">Q51</span>
            <span className="text-sm text-gray-500">Thực dụng văn</span>
            <span className="ml-auto text-xs text-gray-400">{SAMPLE_PROMPT.source}</span>
          </div>

          {/* De bai */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-bold text-gray-900">Đề bài</h2>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{SAMPLE_PROMPT.context}</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 font-mono text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {SAMPLE_PROMPT.text_kr}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Viết 1 câu phù hợp vào mỗi chỗ trống (ㄱ) và (ㄴ). Thể văn: 습니다체.
            </p>
          </div>

          {/* Answer inputs */}
          <div className="space-y-4 mb-6">
            {SAMPLE_PROMPT.blanks.map((blank, idx) => {
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
                      {showHint === blank.key ? "Ẩn gợi ý" : "Xem gợi ý"}
                    </button>
                  </div>

                  {showHint === blank.key && (
                    <div className="bg-blue-50 rounded-xl p-3 mb-3 text-xs">
                      <div className="text-blue-700 font-semibold mb-1">Pattern: {blank.pattern}</div>
                      <div className="text-blue-600">Ví dụ: {blank.example}</div>
                    </div>
                  )}

                  <WongojiEditor
                    value={value}
                    onChange={setValue}
                    placeholder={`Viết câu cho chỗ trống ${blank.key}...`}
                    questionType="q51"
                    disabled={loading}
                  />

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {value.length} ký tự
                    </span>
                    {value.length > 0 && !value.trim().endsWith("다") && !value.trim().endsWith("요") && (
                      <span className="text-xs text-orange-500">
                        Nhớ kết thúc câu bằng 습니다 hoặc ㅂ니다
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
              Xóa hết
            </button>
            <button
              onClick={handleSubmit}
              disabled={!answerA.trim() || !answerB.trim() || loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
            >
              {loading ? "Đang chấm bài..." : "Nộp bài — AI chấm ngay ⚡"}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-3">
            AI chấm theo rubric NIIED chính thức, feedback tiếng Việt
          </p>
        </div>
      </main>
    </div>
  )
}
