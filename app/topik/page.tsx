"use client"

import { useState } from "react"
import Link from "next/link"
import { topikQuestions, type TopikQuestion } from "@/lib/topik-data"

type Mode = "select" | "test" | "result"
type Filter = "all" | "TOPIK 1" | "TOPIK 2"

export default function TopikPage() {
  const [mode, setMode] = useState<Mode>("select")
  const [filter, setFilter] = useState<Filter>("TOPIK 1")
  const [questions, setQuestions] = useState<TopikQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [answers, setAnswers] = useState<{ correct: boolean; selected: number }[]>([])

  function startTest() {
    const filtered = filter === "all"
      ? topikQuestions
      : topikQuestions.filter((q) => q.level === filter)
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, Math.min(10, filtered.length))
    setQuestions(shuffled)
    setCurrentIndex(0)
    setSelected(null)
    setShowAnswer(false)
    setAnswers([])
    setMode("test")
  }

  function handleSelect(i: number) {
    if (showAnswer) return
    setSelected(i)
    setShowAnswer(true)
  }

  function handleNext() {
    if (selected === null) return
    const q = questions[currentIndex]
    setAnswers((a) => [...a, { correct: selected === q.correct, selected }])
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setSelected(null)
      setShowAnswer(false)
    } else {
      setMode("result")
    }
  }

  const correctCount = answers.filter((a) => a.correct).length
  const score = Math.round((correctCount / questions.length) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors text-lg">←</Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <span className="font-bold text-gray-900">Luyện thi TOPIK</span>
          </div>
          {mode === "test" && (
            <span className="text-sm text-gray-400">{currentIndex + 1}/{questions.length}</span>
          )}
          {mode !== "test" && <div className="w-12" />}
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* SELECT MODE */}
        {mode === "select" && (
          <div>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">📝</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Luyện đề thi TOPIK</h1>
              <p className="text-gray-500 text-sm">Từ vựng, ngữ pháp, đọc hiểu - đúng format thi thật</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">Chọn cấp độ</h2>
              <div className="grid grid-cols-3 gap-3">
                {(["TOPIK 1", "TOPIK 2", "all"] as Filter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`py-3 rounded-xl font-medium text-sm transition-colors ${
                      filter === f
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {f === "all" ? "Tất cả" : f}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">Cấu trúc đề thi</h2>
              <div className="space-y-3">
                {[
                  { icon: "📖", title: "Từ vựng", count: topikQuestions.filter(q => q.section === "vocabulary" && (filter === "all" || q.level === filter)).length, desc: "Chọn từ đúng nghĩa, tìm từ trái nghĩa" },
                  { icon: "✏️", title: "Ngữ pháp", count: topikQuestions.filter(q => q.section === "grammar" && (filter === "all" || q.level === filter)).length, desc: "Điền vào chỗ trống, chọn câu đúng" },
                  { icon: "📄", title: "Đọc hiểu", count: topikQuestions.filter(q => q.section === "reading" && (filter === "all" || q.level === filter)).length, desc: "Đọc đoạn văn ngắn, trả lời câu hỏi" },
                ].map((s) => (
                  <div key={s.title} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-xl">{s.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{s.title}</div>
                      <div className="text-xs text-gray-500">{s.desc}</div>
                    </div>
                    <span className="text-sm font-bold text-purple-600">{s.count} câu</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={startTest}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-xl transition-colors text-base"
            >
              Bắt đầu luyện thi →
            </button>
          </div>
        )}

        {/* TEST MODE */}
        {mode === "test" && questions[currentIndex] && (
          <div>
            <div className="mb-6">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {(() => {
              const q = questions[currentIndex]
              return (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      q.section === "vocabulary" ? "bg-blue-100 text-blue-700" :
                      q.section === "grammar" ? "bg-orange-100 text-orange-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {q.section === "vocabulary" ? "Từ vựng" : q.section === "grammar" ? "Ngữ pháp" : "Đọc hiểu"}
                    </span>
                    <span className="text-xs text-gray-400">{q.level}</span>
                  </div>

                  {q.context && (
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-4">
                      <div className="text-xs font-semibold text-purple-600 mb-2">ĐOẠN VĂN</div>
                      <p className="text-sm text-gray-800 leading-relaxed">{q.context}</p>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
                    <p className="text-base font-semibold text-gray-900 whitespace-pre-line">{q.question}</p>
                  </div>

                  <div className="space-y-3 mb-5">
                    {q.options.map((opt, i) => {
                      let style = "border border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                      if (showAnswer) {
                        if (i === q.correct) style = "border-2 border-green-400 bg-green-50 text-green-800"
                        else if (i === selected) style = "border-2 border-red-300 bg-red-50 text-red-700"
                        else style = "border border-gray-100 text-gray-400"
                      } else if (selected === i) {
                        style = "border-2 border-purple-400 bg-purple-50 text-purple-800"
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => handleSelect(i)}
                          className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${style}`}
                        >
                          <span>
                            <span className="mr-2 font-bold text-xs">{["A", "B", "C", "D"][i]}.</span>
                            {opt}
                          </span>
                          {showAnswer && i === q.correct && <span className="text-green-600 ml-2">✓</span>}
                          {showAnswer && i === selected && i !== q.correct && <span className="text-red-500 ml-2">✗</span>}
                        </button>
                      )
                    })}
                  </div>

                  {showAnswer && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                      <div className="text-xs font-semibold text-amber-600 mb-1">GIẢI THÍCH</div>
                      <p className="text-sm text-amber-800">{q.explanation}</p>
                    </div>
                  )}

                  {showAnswer && (
                    <button
                      onClick={handleNext}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3.5 rounded-xl transition-colors"
                    >
                      {currentIndex < questions.length - 1 ? "Câu tiếp →" : "Xem kết quả →"}
                    </button>
                  )}
                </div>
              )
            })()}
          </div>
        )}

        {/* RESULT MODE */}
        {mode === "result" && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">
              {score >= 80 ? "🏆" : score >= 60 ? "👏" : "📚"}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Kết quả</h2>
            <p className="text-gray-500 mb-6">{questions.length} câu hỏi TOPIK</p>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 inline-block min-w-72">
              <div className="text-5xl font-extrabold mb-1" style={{
                color: score >= 80 ? "#22c55e" : score >= 60 ? "#3b82f6" : "#f97316"
              }}>
                {score}%
              </div>
              <div className="text-gray-500 text-sm mb-6">{correctCount}/{questions.length} câu đúng</div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-green-500">{correctCount}</div>
                  <div className="text-xs text-gray-400">Đúng</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-red-400">{questions.length - correctCount}</div>
                  <div className="text-xs text-gray-400">Sai</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-500">{filter === "all" ? "Mix" : filter}</div>
                  <div className="text-xs text-gray-400">Cấp độ</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 text-left">
              <div className="text-sm font-semibold text-gray-700 mb-3">Đánh giá:</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {score >= 80
                  ? "Xuất sắc! Bạn đang ở cấp độ tốt. Tiếp tục luyện tập TOPIK 2 để nâng cấp."
                  : score >= 60
                  ? "Khá tốt! Hãy ôn lại những câu sai và luyện thêm flashcard."
                  : "Còn nhiều chỗ cần cố gắng. Hãy học lại các bài học và luyện flashcard trước."}
              </p>
            </div>

            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button
                onClick={startTest}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3.5 rounded-xl transition-colors"
              >
                Làm lại →
              </button>
              <Link
                href="/flashcards"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-colors text-center"
              >
                Ôn từ vựng →
              </Link>
              <Link
                href="/dashboard"
                className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-center"
              >
                Về Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
