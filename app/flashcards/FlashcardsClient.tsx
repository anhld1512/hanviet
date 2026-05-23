"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { sm2, type CardState } from "@/lib/sm2"
import type { EpsFlashCard } from "./page"

type TestQuestion = {
  card: EpsFlashCard
  options: string[]
  correctIdx: number
}

type ReviewMap = Record<string, CardState & { next_review: string }>
type Phase = "intro" | "study" | "test" | "result"
type FilterMode = "all" | "key_words" | `lesson_${number}`

function speakKorean(text: string) {
  window.speechSynthesis.cancel()
  const voices = window.speechSynthesis.getVoices()
  const voice =
    voices.find((v) => v.lang === "ko-KR" && v.name.toLowerCase().includes("google")) ||
    voices.find((v) => v.lang === "ko-KR")
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = "ko-KR"
  utter.rate = 0.85
  if (voice) utter.voice = voice
  window.speechSynthesis.speak(utter)
}

function generateTestQuestions(cards: EpsFlashCard[], allCards: EpsFlashCard[]): TestQuestion[] {
  const allMeanings = [...new Set(allCards.map((c) => c.word_vi))]
  return cards.map((card) => {
    const wrong = allMeanings
      .filter((m) => m !== card.word_vi)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    const options = [...wrong, card.word_vi].sort(() => Math.random() - 0.5)
    const correctIdx = options.indexOf(card.word_vi)
    return { card, options, correctIdx }
  })
}

export default function FlashcardsClient({ allCards }: { allCards: EpsFlashCard[] }) {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [reviews, setReviews] = useState<ReviewMap>({})
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState<Phase>("intro")
  const [filter, setFilter] = useState<FilterMode>("all")

  const [sessionCards, setSessionCards] = useState<EpsFlashCard[]>([])
  const [studyIndex, setStudyIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [seenSet, setSeenSet] = useState<Set<number>>(new Set())

  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([])
  const [testIndex, setTestIndex] = useState(0)
  const [testSelected, setTestSelected] = useState<number | null>(null)
  const [testShowAnswer, setTestShowAnswer] = useState(false)
  const [testResults, setTestResults] = useState<{ correct: boolean; card: EpsFlashCard; timeUsed: number }[]>([])
  const [timeLeft, setTimeLeft] = useState(20)
  const [startTime, setStartTime] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [dueCount, setDueCount] = useState(0)
  const [newCount, setNewCount] = useState(0)

  const getFilteredCards = useCallback((f: FilterMode): EpsFlashCard[] => {
    if (f === "key_words") return allCards.filter((c) => c.is_key_word)
    if (f.startsWith("lesson_")) {
      const num = parseInt(f.split("_")[1])
      return allCards.filter((c) => c.lesson_number === num)
    }
    return allCards
  }, [allCards])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login"); return }
      setUserId(data.user.id)
      const { data: rows } = await supabase
        .from("flashcard_reviews").select("*").eq("user_id", data.user.id)

      const map: ReviewMap = {}
      for (const row of rows || []) {
        map[row.word_id] = {
          ease_factor: row.ease_factor,
          interval_days: row.interval_days,
          repetitions: row.repetitions,
          next_review: row.next_review,
        }
      }
      setReviews(map)

      const now = new Date()
      const due = allCards.filter((c) => map[c.id] && new Date(map[c.id].next_review) <= now)
      const newCards = allCards.filter((c) => !map[c.id])
      setDueCount(due.length)
      setNewCount(newCards.length)

      const session = [
        ...due.slice(0, 10),
        ...newCards.slice(0, Math.max(0, 10 - due.length)),
      ].slice(0, 20)
      setSessionCards(session.length > 0 ? session : allCards.slice(0, 10))
      setLoading(false)
    })
  }, [router, allCards])

  function applyFilter(f: FilterMode) {
    setFilter(f)
    const filtered = getFilteredCards(f)
    const now = new Date()
    const due = filtered.filter((c) => reviews[c.id] && new Date(reviews[c.id].next_review) <= now)
    const newCards = filtered.filter((c) => !reviews[c.id])
    const session = [
      ...due.slice(0, 10),
      ...newCards.slice(0, Math.max(0, 10 - due.length)),
    ].slice(0, 20)
    setSessionCards(session.length > 0 ? session : filtered.slice(0, 10))
    setStudyIndex(0)
    setFlipped(false)
    setSeenSet(new Set())
  }

  useEffect(() => {
    if (phase !== "test" || testShowAnswer) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    setTimeLeft(20)
    setStartTime(Date.now())
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          handleTimeout()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, testIndex])

  const handleTimeout = useCallback(() => {
    setTestSelected(-1)
    setTestShowAnswer(true)
  }, [])

  const handleTestSelect = useCallback((i: number) => {
    if (testShowAnswer) return
    if (timerRef.current) clearInterval(timerRef.current)
    setTestSelected(i)
    setTestShowAnswer(true)
  }, [testShowAnswer])

  const handleTestNext = useCallback(async () => {
    if (!userId) return
    const q = testQuestions[testIndex]
    const correct = testSelected === q.correctIdx
    const timeUsed = Math.round((Date.now() - startTime) / 1000)
    const quality: 0 | 1 | 3 | 5 = testSelected === -1 ? 0 : correct ? (timeUsed < 8 ? 5 : 3) : 1

    const existing = reviews[q.card.id] || { ease_factor: 2.5, interval_days: 1, repetitions: 0 }
    const updated = sm2(existing, quality)

    setReviews((r) => ({ ...r, [q.card.id]: { ...updated, next_review: updated.next_review.toISOString() } }))
    setTestResults((prev) => [...prev, { correct, card: q.card, timeUsed }])

    const supabase = createClient()
    await supabase.from("flashcard_reviews").upsert({
      user_id: userId,
      word_id: q.card.id,
      ease_factor: updated.ease_factor,
      interval_days: updated.interval_days,
      repetitions: updated.repetitions,
      next_review: updated.next_review.toISOString(),
      last_review: new Date().toISOString(),
    }, { onConflict: "user_id,word_id" })

    if (testIndex < testQuestions.length - 1) {
      setTestIndex((i) => i + 1)
      setTestSelected(null)
      setTestShowAnswer(false)
    } else {
      setPhase("result")
    }
  }, [userId, testQuestions, testIndex, testSelected, startTime, reviews])

  function startTest() {
    const questions = generateTestQuestions(sessionCards, allCards)
    setTestQuestions(questions)
    setTestIndex(0)
    setTestSelected(null)
    setTestShowAnswer(false)
    setTestResults([])
    setPhase("test")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Đang tải flashcard...</div>
      </div>
    )
  }

  const card = sessionCards[studyIndex]
  const studyProgress = (studyIndex / sessionCards.length) * 100
  const allSeen = seenSet.size >= sessionCards.length
  const correctCount = testResults.filter((r) => r.correct).length
  const keyWordCount = allCards.filter((c) => c.is_key_word).length
  const lessonNumbers = [...new Set(allCards.map((c) => c.lesson_number))].sort((a, b) => a - b)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">🃏</span>
            <span className="font-bold text-gray-900">Flashcard EPS</span>
          </div>
          {phase === "study" && (
            <span className="text-sm text-gray-400">{studyIndex + 1}/{sessionCards.length}</span>
          )}
          {phase === "test" && (
            <span className="text-sm text-gray-400">{testIndex + 1}/{testQuestions.length}</span>
          )}
          {(phase === "intro" || phase === "result") && <div className="w-16" />}
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* INTRO */}
        {phase === "intro" && (
          <div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🃏</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Ôn từ vựng EPS-TOPIK</h1>
              <p className="text-gray-500 text-sm">Nhắc đúng lúc trước khi quên, tập trung từ hay thi</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{dueCount}</div>
                <div className="text-xs text-orange-500 mt-0.5">Cần ôn lại hôm nay</div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{newCount}</div>
                <div className="text-xs text-blue-500 mt-0.5">Từ mới chưa học</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
              <div className="text-xs font-semibold text-gray-400 mb-3">LỌC TỪ VỰNG</div>
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => applyFilter("all")}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    filter === "all" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Tất cả ({allCards.length} từ)
                </button>
                <button
                  onClick={() => applyFilter("key_words")}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    filter === "key_words" ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                  }`}
                >
                  Từ hay thi ({keyWordCount})
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {lessonNumbers.map((n) => (
                  <button
                    key={n}
                    onClick={() => applyFilter(`lesson_${n}` as FilterMode)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      filter === `lesson_${n}` ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    Bài {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
              <span className="text-xl">🎯</span>
              <div>
                <div className="text-sm font-semibold text-green-800">Mục tiêu hôm nay</div>
                <div className="text-xs text-green-600">Học và nhớ {sessionCards.length} từ EPS-TOPIK</div>
              </div>
            </div>

            <button
              onClick={() => setPhase("study")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-colors text-base"
            >
              Bắt đầu học {sessionCards.length} từ →
            </button>
          </div>
        )}

        {/* STUDY */}
        {phase === "study" && card && (
          <div>
            <div className="mb-5">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Đã xem {seenSet.size}/{sessionCards.length} từ</span>
                <span>{allSeen ? "Đã xem hết!" : `Còn ${sessionCards.length - seenSet.size} từ`}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full transition-all duration-300"
                  style={{ width: `${studyProgress}%` }} />
              </div>
            </div>

            <div
              className="bg-white rounded-3xl border border-gray-100 shadow-sm cursor-pointer select-none mb-5 min-h-72"
              onClick={() => {
                setFlipped((f) => !f)
                if (!flipped) setSeenSet((s) => new Set([...s, studyIndex]))
              }}
            >
              <div className="p-8 flex flex-col items-center justify-center min-h-72 text-center">
                {!flipped ? (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-xs text-gray-400">Bài {card.lesson_number}</div>
                      {card.is_key_word && (
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">Hay thi</span>
                      )}
                    </div>
                    <div className="text-5xl font-bold text-gray-900 mb-3">{card.word_kr}</div>
                    <div className="text-base text-gray-400 italic mb-4">[{card.pronunciation}]</div>
                    <button
                      onClick={(e) => { e.stopPropagation(); speakKorean(card.word_kr) }}
                      className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors mb-4"
                    >
                      🔊 Nghe phát âm
                    </button>
                    <div className="text-xs text-gray-300">Nhấn vào để xem nghĩa</div>
                  </>
                ) : (
                  <>
                    <div className="text-xs text-gray-400 mb-2 font-medium">{card.word_kr} [{card.pronunciation}]</div>
                    <button
                      onClick={(e) => { e.stopPropagation(); speakKorean(card.word_kr) }}
                      className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors mb-4"
                    >
                      🔊 Nghe
                    </button>
                    <div className="text-3xl font-bold text-blue-600 mb-4">{card.word_vi}</div>
                    <div className="bg-gray-50 rounded-xl p-3 text-left w-full max-w-sm">
                      <div className="text-xs text-gray-400 font-medium mb-1.5">Ví dụ:</div>
                      <div className="text-sm font-medium text-gray-900 mb-0.5">{card.example_kr}</div>
                      <div className="text-xs text-gray-500 italic">{card.example_vi}</div>
                    </div>
                    <div className="text-xs text-gray-300 mt-3">Nhấn lại để xem từ</div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => { setStudyIndex((i) => Math.max(0, i - 1)); setFlipped(false) }}
                disabled={studyIndex === 0}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Trước
              </button>
              {studyIndex < sessionCards.length - 1 ? (
                <button
                  onClick={() => {
                    setSeenSet((s) => new Set([...s, studyIndex]))
                    setStudyIndex((i) => i + 1)
                    setFlipped(false)
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Tiếp →
                </button>
              ) : (
                <button disabled className="flex-1 bg-gray-100 text-gray-500 font-medium py-3 rounded-xl">
                  Từ cuối
                </button>
              )}
            </div>

            {allSeen ? (
              <button
                onClick={startTest}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors"
              >
                Vào bài kiểm tra ({sessionCards.length} câu) →
              </button>
            ) : (
              <button
                onClick={startTest}
                className="w-full border border-gray-200 text-gray-500 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Bỏ qua, kiểm tra luôn
              </button>
            )}
          </div>
        )}

        {/* TEST */}
        {phase === "test" && testQuestions[testIndex] && (() => {
          const q = testQuestions[testIndex]
          return (
            <div>
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Câu {testIndex + 1}/{testQuestions.length}</span>
                  <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                    timeLeft > 10 ? "bg-green-100 text-green-700"
                    : timeLeft > 5 ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                  }`}>
                    {timeLeft}s
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${(testIndex / testQuestions.length) * 100}%` }} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5 text-center">
                {q.card.is_key_word && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold mb-2 inline-block">Từ hay thi</span>
                )}
                <div className="text-4xl font-bold text-gray-900 mb-2">{q.card.word_kr}</div>
                <div className="text-sm text-gray-400 italic mb-3">[{q.card.pronunciation}]</div>
                <button
                  onClick={() => speakKorean(q.card.word_kr)}
                  className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  🔊 Nghe phát âm
                </button>
              </div>

              <p className="text-center text-sm font-medium text-gray-600 mb-4">Nghĩa của từ này là gì?</p>

              <div className="space-y-3 mb-5">
                {q.options.map((opt, i) => {
                  let style = "border border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                  if (testShowAnswer) {
                    if (i === q.correctIdx) style = "border-2 border-green-400 bg-green-50 text-green-800"
                    else if (i === testSelected) style = "border-2 border-red-300 bg-red-50 text-red-700"
                    else style = "border border-gray-100 text-gray-400"
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleTestSelect(i)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${style}`}
                    >
                      <span>{["A", "B", "C", "D"][i]}. {opt}</span>
                      {testShowAnswer && i === q.correctIdx && <span className="text-green-600">✓</span>}
                      {testShowAnswer && i === testSelected && i !== q.correctIdx && <span className="text-red-500">✗</span>}
                    </button>
                  )
                })}
              </div>

              {testShowAnswer && (
                <button
                  onClick={handleTestNext}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3.5 rounded-xl transition-colors"
                >
                  {testIndex < testQuestions.length - 1 ? "Câu tiếp →" : "Xem kết quả →"}
                </button>
              )}
            </div>
          )
        })()}

        {/* RESULT */}
        {phase === "result" && (
          <div className="text-center py-4">
            <div className="text-6xl mb-4">
              {correctCount >= sessionCards.length * 0.8 ? "🏆" : correctCount >= sessionCards.length * 0.5 ? "👏" : "📚"}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Kết quả</h2>
            <p className="text-gray-500 text-sm mb-6">{sessionCards.length} từ EPS-TOPIK</p>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 inline-block min-w-64">
              <div className="text-5xl font-extrabold mb-1" style={{
                color: correctCount / sessionCards.length >= 0.8 ? "#22c55e"
                     : correctCount / sessionCards.length >= 0.5 ? "#3b82f6" : "#f97316"
              }}>
                {correctCount}/{sessionCards.length}
              </div>
              <div className="text-gray-400 text-sm mb-4">câu đúng</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-500">{correctCount}</div>
                  <div className="text-xs text-gray-400">Đúng</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-400">{sessionCards.length - correctCount}</div>
                  <div className="text-xs text-gray-400">Sai</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 text-left">
              <div className="text-sm font-semibold text-blue-800 mb-1">Lịch ôn tập đã được cập nhật</div>
              <p className="text-xs text-blue-600">
                {correctCount >= sessionCards.length * 0.8
                  ? "Xuất sắc! Từ nhớ tốt sẽ được nhắc sau vài ngày. Từ sai hiện lại sớm hơn."
                  : "Từ bạn sai sẽ xuất hiện lại trong buổi ôn tới. Lặp lại là chìa khóa!"}
              </p>
            </div>

            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button
                onClick={() => {
                  setPhase("intro")
                  setStudyIndex(0)
                  setFlipped(false)
                  setSeenSet(new Set())
                  setTestResults([])
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl transition-colors"
              >
                Ôn thêm →
              </button>
              <Link href="/eps-test" className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-colors text-center">
                Thi thử EPS-TOPIK →
              </Link>
              <Link href="/dashboard" className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-center">
                Về Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
