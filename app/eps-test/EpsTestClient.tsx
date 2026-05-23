"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import type { EpsQuestion } from "@/lib/eps-questions"

type Mode = "select" | "exam" | "practice" | "result"
type PracticeCount = 10 | 25 | 50

interface TestState {
  questions: EpsQuestion[]
  answers: (number | null)[]
  currentIndex: number
  showExplanation: boolean
  startTime: number
  endTime?: number
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

const PASSING_SCORES: Record<string, number> = {
  "Sản xuất chế tạo": 110,
  "Xây dựng": 80,
  "Nông nghiệp": 80,
  "Ngư nghiệp": 60,
}

export default function EpsTestClient({
  readingPool,
  listeningPool,
}: {
  readingPool: EpsQuestion[]
  listeningPool: EpsQuestion[]
}) {
  const [mode, setMode] = useState<Mode>("select")
  const [practiceCount, setPracticeCount] = useState<PracticeCount>(25)
  const [practiceType, setPracticeType] = useState<"all" | "listening" | "reading">("all")
  const [testState, setTestState] = useState<TestState | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [selectedIndustry, setSelectedIndustry] = useState("Sản xuất chế tạo")

  const startExam = useCallback(() => {
    const questions = [
      ...sample(listeningPool, 25),
      ...sample(readingPool, 25),
    ]
    setTestState({
      questions,
      answers: new Array(50).fill(null),
      currentIndex: 0,
      showExplanation: false,
      startTime: Date.now(),
    })
    setTimeLeft(70 * 60)
    setMode("exam")
  }, [listeningPool, readingPool])

  const startPractice = useCallback(() => {
    let pool: EpsQuestion[]
    if (practiceType === "listening") pool = listeningPool
    else if (practiceType === "reading") pool = readingPool
    else pool = [...listeningPool, ...readingPool]
    const questions = sample(pool, practiceCount)
    setTestState({
      questions,
      answers: new Array(practiceCount).fill(null),
      currentIndex: 0,
      showExplanation: false,
      startTime: Date.now(),
    })
    setMode("practice")
  }, [listeningPool, readingPool, practiceCount, practiceType])

  useEffect(() => {
    if (mode !== "exam" || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer)
          setMode("result")
          setTestState((prev) => prev ? { ...prev, endTime: Date.now() } : prev)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [mode, timeLeft])

  function handleAnswer(questionIndex: number, optionIndex: number) {
    if (!testState) return
    setTestState((prev) => {
      if (!prev) return prev
      const newAnswers = [...prev.answers]
      newAnswers[questionIndex] = optionIndex
      return { ...prev, answers: newAnswers }
    })
  }

  function handlePracticeAnswer(optionIndex: number) {
    if (!testState) return
    const { currentIndex, answers } = testState
    if (answers[currentIndex] !== null) return
    const newAnswers = [...answers]
    newAnswers[currentIndex] = optionIndex
    setTestState({ ...testState, answers: newAnswers, showExplanation: true })
  }

  function handleNextPractice() {
    if (!testState) return
    const { currentIndex, questions } = testState
    if (currentIndex >= questions.length - 1) {
      setTestState({ ...testState, endTime: Date.now() })
      setMode("result")
    } else {
      setTestState({ ...testState, currentIndex: currentIndex + 1, showExplanation: false })
    }
  }

  function finishExam() {
    setTestState((prev) => prev ? { ...prev, endTime: Date.now() } : prev)
    setMode("result")
  }

  function getScore(): { correct: number; total: number; scaled: number } {
    if (!testState) return { correct: 0, total: 0, scaled: 0 }
    const correct = testState.answers.filter((a, i) => a === testState.questions[i].correct).length
    const total = testState.questions.length
    const scaled = Math.round((correct / total) * 200)
    return { correct, total, scaled }
  }

  const unansweredCount = testState?.answers.filter((a) => a === null).length ?? 0

  /* SELECT SCREEN */
  if (mode === "select") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-6 h-14 flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
            <h1 className="font-bold text-gray-900">Luyện thi EPS-TOPIK</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">
          {/* Exam mode */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl">🎯</div>
              <div>
                <h2 className="font-bold text-gray-900">Thi thử chính thức</h2>
                <p className="text-xs text-gray-400">50 câu · 70 phút · Không xem đáp án trong khi thi</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Mô phỏng đúng cấu trúc kỳ thi EPS-TOPIK: 25 câu nghe hiểu + 25 câu đọc hiểu. Kết quả tính theo thang điểm 200.
            </p>
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-400 mb-2">Chọn ngành để xem điểm đậu:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PASSING_SCORES).map(([industry, score]) => (
                  <button
                    key={industry}
                    onClick={() => setSelectedIndustry(industry)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      selectedIndustry === industry
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {industry} ({score}+)
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={startExam}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Bắt đầu thi thử →
            </button>
          </div>

          {/* Practice mode */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">📚</div>
              <div>
                <h2 className="font-bold text-gray-900">Luyện tập từng phần</h2>
                <p className="text-xs text-gray-400">Có giải thích đáp án sau mỗi câu</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-400 mb-2">Loại câu hỏi:</div>
              <div className="flex gap-2">
                {(["all", "listening", "reading"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPracticeType(t)}
                    className={`flex-1 text-sm py-2 rounded-lg font-medium transition-colors ${
                      practiceType === t ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t === "all" ? "Tất cả" : t === "listening" ? "Nghe hiểu" : "Đọc hiểu"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <div className="text-xs font-semibold text-gray-400 mb-2">Số câu:</div>
              <div className="flex gap-2">
                {([10, 25, 50] as PracticeCount[]).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPracticeCount(n)}
                    className={`flex-1 text-sm py-2 rounded-lg font-medium transition-colors ${
                      practiceCount === n ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {n} câu
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startPractice}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Bắt đầu luyện tập →
            </button>
          </div>

          {/* Info */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <div className="text-xs font-semibold text-amber-600 mb-2">Lưu ý về phần Nghe hiểu</div>
            <p className="text-xs text-amber-700 leading-relaxed">
              Hiện tại phần nghe sẽ hiển thị script bài nghe bằng tiếng Hàn. File audio thực tế sẽ được cập nhật sau.
            </p>
          </div>
        </div>
      </div>
    )
  }

  /* EXAM MODE */
  if (mode === "exam" && testState) {
    const q = testState.questions[testState.currentIndex]
    const isAnswered = testState.answers[testState.currentIndex] !== null
    const answeredCount = testState.answers.filter((a) => a !== null).length

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-6 py-3 flex items-center gap-4">
            <button
              onClick={finishExam}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Nộp bài
            </button>
            <div className="flex-1">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(answeredCount / testState.questions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className={`text-sm font-bold tabular-nums ${timeLeft < 600 ? "text-red-500" : "text-gray-700"}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm text-gray-400">
              Câu {testState.currentIndex + 1} / {testState.questions.length}
            </span>
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
              {q.id.startsWith("L") ? "Nghe hiểu" : "Đọc hiểu"}
            </span>
          </div>

          {q.script_kr && (
            <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
              <div className="text-xs font-semibold text-blue-500 mb-2">SCRIPT BÀI NGHE</div>
              <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{q.script_kr}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
            <p className="text-base font-semibold text-gray-900">{q.question_text}</p>
          </div>

          <div className="space-y-3 mb-6">
            {q.options.map((opt, i) => {
              const chosen = testState.answers[testState.currentIndex] === i
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(testState.currentIndex, i)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all border ${
                    chosen
                      ? "border-2 border-blue-400 bg-blue-50 text-blue-800"
                      : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <span className="mr-2 font-bold text-xs">{["A", "B", "C", "D"][i]}.</span>
                  {opt}
                </button>
              )
            })}
          </div>

          <div className="flex gap-3">
            {testState.currentIndex > 0 && (
              <button
                onClick={() => setTestState({ ...testState, currentIndex: testState.currentIndex - 1, showExplanation: false })}
                className="flex-none border border-gray-200 text-gray-600 font-medium px-5 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Câu trước
              </button>
            )}
            {testState.currentIndex < testState.questions.length - 1 ? (
              <button
                onClick={() => setTestState({ ...testState, currentIndex: testState.currentIndex + 1, showExplanation: false })}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {isAnswered ? "Câu tiếp →" : "Bỏ qua →"}
              </button>
            ) : (
              <button
                onClick={finishExam}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Nộp bài ({unansweredCount > 0 ? `còn ${unansweredCount} câu chưa trả lời` : "đã trả lời hết"})
              </button>
            )}
          </div>

          {/* Question dots */}
          <div className="flex flex-wrap gap-1.5 mt-6 pt-5 border-t border-gray-100">
            {testState.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestState({ ...testState, currentIndex: i, showExplanation: false })}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                  i === testState.currentIndex
                    ? "bg-blue-500 text-white"
                    : testState.answers[i] !== null
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* PRACTICE MODE */
  if (mode === "practice" && testState) {
    const q = testState.questions[testState.currentIndex]
    const answered = testState.answers[testState.currentIndex]
    const isCorrect = answered === q.correct

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-6 py-3 flex items-center gap-4">
            <button onClick={() => setMode("select")} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
            <div className="flex-1">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${((testState.currentIndex) / testState.questions.length) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-sm text-gray-400 shrink-0">
              {testState.currentIndex + 1}/{testState.questions.length}
            </span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
              {q.id.startsWith("L") ? "Nghe hiểu" : "Đọc hiểu"} · Cấp {q.difficulty}
            </span>
          </div>

          {q.script_kr && (
            <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
              <div className="text-xs font-semibold text-blue-500 mb-2">SCRIPT BÀI NGHE</div>
              <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{q.script_kr}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
            <p className="text-base font-semibold text-gray-900">{q.question_text}</p>
          </div>

          <div className="space-y-3 mb-5">
            {q.options.map((opt, i) => {
              let style = "border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
              if (testState.showExplanation) {
                if (i === q.correct) style = "border-2 border-green-400 bg-green-50 text-green-800"
                else if (i === answered) style = "border-2 border-red-300 bg-red-50 text-red-700"
                else style = "border border-gray-100 text-gray-400"
              } else if (answered === i) {
                style = "border-2 border-blue-400 bg-blue-50 text-blue-800"
              }
              return (
                <button
                  key={i}
                  onClick={() => handlePracticeAnswer(i)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all border ${style}`}
                >
                  <span className="mr-2 font-bold text-xs">{["A", "B", "C", "D"][i]}.</span>
                  {opt}
                  {testState.showExplanation && i === q.correct && <span className="ml-2 text-green-600">✓</span>}
                  {testState.showExplanation && i === answered && i !== q.correct && <span className="ml-2 text-red-500">✗</span>}
                </button>
              )
            })}
          </div>

          {testState.showExplanation && (
            <>
              <div className={`rounded-xl p-4 mb-4 border ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className={`text-xs font-semibold mb-1 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {isCorrect ? "CHÍNH XÁC!" : "CHƯA ĐÚNG"}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                <div className="text-xs font-semibold text-amber-600 mb-1">GIẢI THÍCH</div>
                <p className="text-sm text-amber-800 leading-relaxed">{q.explanation}</p>
              </div>
              <button
                onClick={handleNextPractice}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-colors"
              >
                {testState.currentIndex < testState.questions.length - 1 ? "Câu tiếp →" : "Xem kết quả →"}
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  /* RESULT SCREEN */
  if (mode === "result" && testState) {
    const { correct, total, scaled } = getScore()
    const passingScore = PASSING_SCORES[selectedIndustry]
    const passed = scaled >= passingScore
    const pct = Math.round((correct / total) * 100)

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-6 h-14 flex items-center gap-4">
            <button onClick={() => setMode("select")} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
            <h1 className="font-bold text-gray-900">Kết quả</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center mb-6">
            <div className="text-5xl mb-4">
              {pct >= 70 ? "🎉" : pct >= 50 ? "💪" : "📖"}
            </div>
            <div className={`text-5xl font-extrabold mb-2 ${pct >= 70 ? "text-green-500" : pct >= 50 ? "text-blue-500" : "text-orange-500"}`}>
              {scaled}
              <span className="text-2xl text-gray-300">/200</span>
            </div>
            <div className="text-gray-500 text-sm mb-5">
              Đúng {correct}/{total} câu ({pct}%)
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
              passed ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
            }`}>
              {passed ? "✓ Đạt điểm chuẩn" : "✗ Chưa đạt"} {selectedIndustry} ({passingScore}+)
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-xl font-bold text-gray-900">{correct}</div>
              <div className="text-xs text-gray-400 mt-0.5">Câu đúng</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-xl font-bold text-gray-900">{total - correct}</div>
              <div className="text-xs text-gray-400 mt-0.5">Câu sai</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-xl font-bold text-gray-900">{pct}%</div>
              <div className="text-xs text-gray-400 mt-0.5">Tỷ lệ đúng</div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setMode("select"); setTestState(null) }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Thi lại →
            </button>
            <Link
              href="/lessons/1"
              className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-center"
            >
              Ôn lại bài học
            </Link>
            <Link
              href="/dashboard"
              className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-center"
            >
              Về Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return null
}
