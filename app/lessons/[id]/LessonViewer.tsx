"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import type { Lesson } from "@/lib/lessons-data"

type Section = "dialogue" | "vocabulary" | "grammar" | "quiz" | "complete"

function getBestKoreanVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  const priority = [
    (v: SpeechSynthesisVoice) => v.lang === "ko-KR" && v.name.toLowerCase().includes("google"),
    (v: SpeechSynthesisVoice) => v.lang === "ko-KR" && !v.localService,
    (v: SpeechSynthesisVoice) => v.lang === "ko-KR",
    (v: SpeechSynthesisVoice) => v.lang.startsWith("ko"),
  ]
  for (const fn of priority) {
    const match = voices.find(fn)
    if (match) return match
  }
  return null
}

function SpeakButton({ text, size = "md" }: { text: string; size?: "sm" | "md" }) {
  const [playing, setPlaying] = useState(false)

  function handleClick() {
    setPlaying(true)
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = "ko-KR"
    utter.rate = 0.82
    const voice = getBestKoreanVoice()
    if (voice) utter.voice = voice
    utter.onend = () => setPlaying(false)
    utter.onerror = () => setPlaying(false)
    window.speechSynthesis.speak(utter)
  }

  const base = size === "sm"
    ? "w-7 h-7 text-xs"
    : "w-8 h-8 text-sm"

  return (
    <button
      onClick={handleClick}
      className={`${base} rounded-full flex items-center justify-center transition-colors shrink-0 ${
        playing
          ? "bg-blue-500 text-white"
          : "bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600"
      }`}
      title="Nghe phát âm"
    >
      {playing ? "⏸" : "▶"}
    </button>
  )
}

export default function LessonViewer({ lesson }: { lesson: Lesson }) {
  const [section, setSection] = useState<Section>("dialogue")
  const [vocabIndex, setVocabIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [showRomanization, setShowRomanization] = useState(true)

  const sections: Section[] = ["dialogue", "vocabulary", "grammar", "quiz", "complete"]
  const sectionIndex = sections.indexOf(section)
  const progress = (sectionIndex / (sections.length - 1)) * 100

  const sectionLabels: Record<Section, string> = {
    dialogue: "Hội thoại",
    vocabulary: "Từ vựng",
    grammar: "Ngữ pháp",
    quiz: "Bài tập",
    complete: "Hoàn thành",
  }

  function handleQuizSelect(index: number) {
    if (showAnswer) return
    setSelected(index)
    setShowAnswer(true)
    const q = lesson.quiz[quizIndex]
    if (q.type === "multiple_choice" && index === q.correct) {
      setCorrectCount((c) => c + 1)
    }
  }

  function handleNextQuiz() {
    if (quizIndex < lesson.quiz.length - 1) {
      setQuizIndex((i) => i + 1)
      setSelected(null)
      setShowAnswer(false)
    } else {
      setSection("complete")
    }
  }

  function playAll() {
    window.speechSynthesis.cancel()
    const lines = lesson.dialogue.lines
    const voice = getBestKoreanVoice()
    let i = 0
    function next() {
      if (i >= lines.length) return
      const utter = new SpeechSynthesisUtterance(lines[i].kr)
      utter.lang = "ko-KR"
      utter.rate = 0.82
      if (voice) utter.voice = voice
      utter.onend = () => { i++; setTimeout(next, 500) }
      window.speechSynthesis.speak(utter)
    }
    next()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors text-lg">
            ←
          </Link>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              {sections.slice(0, -1).map((s, i) => (
                <span
                  key={s}
                  className={`text-xs font-medium ${i <= sectionIndex ? "text-blue-500" : "text-gray-300"}`}
                >
                  {sectionLabels[s]}
                </span>
              ))}
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-400 shrink-0">{lesson.level}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* DIALOGUE */}
        {section === "dialogue" && (
          <div>
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{lesson.emoji}</span>
                <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
              </div>
              <p className="text-sm text-gray-500">{lesson.dialogue.situation}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={playAll}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>▶</span> Nghe toàn bộ hội thoại
              </button>
              <button
                onClick={() => setShowRomanization((v) => !v)}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showRomanization ? "Ẩn phiên âm" : "Hiện phiên âm"}
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 space-y-5">
              {lesson.dialogue.lines.map((line, i) => (
                <div key={i} className={`flex gap-3 ${line.speaker === "B" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1 ${
                      line.speaker === "A" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {line.speaker}
                  </div>
                  <div className={`max-w-sm ${line.speaker === "B" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div className="flex items-center gap-2">
                      {line.speaker === "B" && <SpeakButton text={line.kr} size="sm" />}
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm font-medium ${
                          line.speaker === "A"
                            ? "bg-gray-100 text-gray-900 rounded-tl-none"
                            : "bg-blue-500 text-white rounded-tr-none"
                        }`}
                      >
                        {line.kr}
                      </div>
                      {line.speaker === "A" && <SpeakButton text={line.kr} size="sm" />}
                    </div>
                    {showRomanization && (
                      <div className={`text-xs text-gray-400 italic px-1 ${line.speaker === "B" ? "text-right" : ""}`}>
                        {line.romanization}
                      </div>
                    )}
                    <div className={`text-xs text-gray-500 px-1 ${line.speaker === "B" ? "text-right" : ""}`}>
                      {line.vi}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSection("vocabulary")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              Tiếp theo: Từ vựng →
            </button>
          </div>
        )}

        {/* VOCABULARY */}
        {section === "vocabulary" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Từ vựng trong bài</h2>
            <p className="text-sm text-gray-500 mb-6">
              {vocabIndex + 1} / {lesson.vocabulary.length} từ
            </p>

            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center mb-4 min-h-52 flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl font-bold text-gray-900">
                  {lesson.vocabulary[vocabIndex].hangul}
                </div>
                <SpeakButton text={lesson.vocabulary[vocabIndex].hangul} />
              </div>
              <div className="text-sm text-gray-400 italic mb-4">
                [{lesson.vocabulary[vocabIndex].romanization}]
              </div>
              <div className="text-lg font-semibold text-blue-600">
                {lesson.vocabulary[vocabIndex].meaning}
              </div>
            </div>

            <div className="flex justify-center gap-1.5 mb-6">
              {lesson.vocabulary.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === vocabIndex ? "bg-blue-500" : i < vocabIndex ? "bg-blue-200" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              {vocabIndex > 0 && (
                <button
                  onClick={() => setVocabIndex((i) => i - 1)}
                  className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  ← Trước
                </button>
              )}
              {vocabIndex < lesson.vocabulary.length - 1 ? (
                <button
                  onClick={() => setVocabIndex((i) => i + 1)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Từ tiếp →
                </button>
              ) : (
                <button
                  onClick={() => setSection("grammar")}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Sang ngữ pháp →
                </button>
              )}
            </div>
          </div>
        )}

        {/* GRAMMAR */}
        {section === "grammar" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Ngữ pháp</h2>
            <p className="text-sm text-gray-500 mb-6">Giải thích bằng tiếng Việt</p>

            {lesson.grammar.map((g, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                <div className="bg-blue-50 rounded-xl px-4 py-3 mb-4 text-center">
                  <div className="text-lg font-bold text-blue-700">{g.pattern}</div>
                  <div className="text-sm text-blue-500 mt-0.5">{g.meaning}</div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{g.explanation}</p>
                <div className="border-t border-gray-100 pt-4">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Ví dụ</div>
                  <div className="space-y-3">
                    {g.examples.map((ex, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className="text-blue-400 shrink-0 mt-0.5">•</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{ex.kr}</span>
                            <SpeakButton text={ex.kr} size="sm" />
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{ex.vi}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setSection("quiz")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              Vào bài tập →
            </button>
          </div>
        )}

        {/* QUIZ */}
        {section === "quiz" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Bài tập</h2>
              <span className="text-sm text-gray-400">
                {quizIndex + 1} / {lesson.quiz.length}
              </span>
            </div>

            {(() => {
              const q = lesson.quiz[quizIndex]
              if (q.type !== "multiple_choice") return null
              return (
                <div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
                    <p className="text-base font-semibold text-gray-900">{q.question}</p>
                  </div>

                  <div className="space-y-3 mb-5">
                    {q.options.map((opt, i) => {
                      let style = "border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                      if (showAnswer) {
                        if (i === q.correct) style = "border-2 border-green-400 bg-green-50 text-green-800"
                        else if (i === selected) style = "border-2 border-red-300 bg-red-50 text-red-700"
                        else style = "border border-gray-100 text-gray-400"
                      } else if (selected === i) {
                        style = "border-2 border-blue-400 bg-blue-50 text-blue-800"
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => handleQuizSelect(i)}
                          className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${style}`}
                        >
                          <span>
                            <span className="mr-2 font-bold text-xs">{["A", "B", "C", "D"][i]}.</span>
                            {opt}
                          </span>
                          <span className="flex items-center gap-1">
                            {showAnswer && i === q.correct && <span className="text-green-600">✓</span>}
                            {showAnswer && i === selected && i !== q.correct && <span className="text-red-500">✗</span>}
                            <SpeakButton text={opt} size="sm" />
                          </span>
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
                      onClick={handleNextQuiz}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl transition-colors"
                    >
                      {quizIndex < lesson.quiz.length - 1 ? "Câu tiếp →" : "Xem kết quả →"}
                    </button>
                  )}
                </div>
              )
            })()}
          </div>
        )}

        {/* COMPLETE */}
        {section === "complete" && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hoàn thành bài học!</h2>
            <p className="text-gray-500 mb-6">{lesson.title}</p>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 inline-block min-w-64">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-blue-500">
                    {correctCount}/{lesson.quiz.length}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Câu đúng</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-orange-500">
                    +{10 + correctCount * 5}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">XP nhận được</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              {lesson.id < 3 && (
                <Link
                  href={`/lessons/${lesson.id + 1}`}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl transition-colors text-center"
                >
                  Bài tiếp theo →
                </Link>
              )}
              <Link
                href="/"
                className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-center"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
