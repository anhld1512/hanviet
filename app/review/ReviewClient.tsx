"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
import BottomNav from "@/app/components/BottomNav"

// ─── Types ────────────────────────────────────────────────────────────────────
type Correction = { original: string; corrected: string; explanation: string }
type Submission = {
  id: string
  question_type: string
  total_score: number
  max_score: number
  criteria_scores: Record<string, number> | null
  errors: Correction[] | null
  overall_feedback_vi: string | null
  created_at: string
}
type Card = Correction & { qType: string; date: string; id: string }

// ─── Constants ────────────────────────────────────────────────────────────────
const Q_BADGE: Record<string, string> = {
  q51: "bg-blue-100 text-blue-700",
  q52: "bg-blue-100 text-blue-700",
  q53: "bg-blue-100 text-blue-700",
  q54: "bg-gray-100 text-blue-700",
  mock_exam: "bg-gray-800 text-white",
}
const Q_LABEL: Record<string, string> = {
  q51: "Q51", q52: "Q52", q53: "Q53", q54: "Q54", mock_exam: "Thi thử",
}
const Q_FULL: Record<string, string> = {
  q51: "Q51 — Điền câu thực dụng",
  q52: "Q52 — Điền câu nghị luận",
  q53: "Q53 — Phân tích biểu đồ",
  q54: "Q54 — Bài luận",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Flashcard component ──────────────────────────────────────────────────────
function Flashcard({ card, isFlipped, onFlip }: { card: Card; isFlipped: boolean; onFlip: () => void }) {
  return (
    <div
      className="relative w-full cursor-pointer select-none"
      style={{ perspective: "1200px", minHeight: "260px" }}
      onClick={onFlip}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          minHeight: "260px",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-white rounded-2xl border-2 border-gray-100 p-7 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full mb-5 ${Q_BADGE[card.qType] ?? "bg-gray-100 text-gray-600"}`}>
            {Q_FULL[card.qType] ?? card.qType.toUpperCase()}
          </span>
          <p className="text-lg font-semibold text-red-600 text-center leading-relaxed mb-2 font-mono">
            {card.original}
          </p>
          <p className="text-xs text-gray-400 italic mt-1">Câu này sai ở đâu?</p>
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-300">
            <span className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center">↻</span>
            Nhấn để lật xem đáp án
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-white rounded-2xl border-2 border-blue-100 p-7 flex flex-col justify-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${Q_BADGE[card.qType] ?? "bg-gray-100 text-gray-600"}`}>
              {Q_LABEL[card.qType] ?? card.qType.toUpperCase()}
            </span>
            <span className="text-xs text-gray-400">{formatDate(card.date)}</span>
          </div>

          {/* Sai → Đúng */}
          <div className="flex items-start gap-3 mb-4 p-3 bg-red-50 rounded-xl">
            <span className="text-xs font-bold text-red-400 mt-0.5 shrink-0">SAI</span>
            <span className="text-sm text-red-600 font-mono line-through leading-relaxed">{card.original}</span>
          </div>
          <div className="flex items-start gap-3 mb-4 p-3 bg-blue-50 rounded-xl">
            <span className="text-xs font-bold text-blue-500 mt-0.5 shrink-0">ĐÚNG</span>
            <span className="text-sm text-blue-700 font-mono font-semibold leading-relaxed">{card.corrected}</span>
          </div>

          {/* Giải thích */}
          <div className="p-3 bg-blue-50 rounded-xl">
            <p className="text-xs font-semibold text-blue-600 mb-1">Giải thích</p>
            <p className="text-sm text-blue-800 leading-relaxed">{card.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ReviewClient({ submissions }: { submissions: Submission[] }) {
  const [tab, setTab] = useState<"all" | "q51" | "q52" | "q53" | "q54">("all")
  const [isFlipped, setIsFlipped] = useState(false)
  const [idx, setIdx] = useState(0)
  const [known, setKnown] = useState<Set<string>>(new Set())
  const [isShuffled, setIsShuffled] = useState(false)
  const [baseCards, setBaseCards] = useState<Card[]>([])

  // Build base cards from all submissions
  useEffect(() => {
    const cards: Card[] = submissions.flatMap((s, si) =>
      (s.errors ?? []).map((e, ei) => ({
        ...e,
        qType: s.question_type,
        date: s.created_at,
        id: `${si}-${ei}`,
      }))
    )
    setBaseCards(cards)
    setIdx(0)
    setIsFlipped(false)
  }, [submissions])

  // Restore known from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("hanviet_known_cards")
      if (raw) setKnown(new Set(JSON.parse(raw)))
    } catch {}
  }, [])

  const saveKnown = (next: Set<string>) => {
    setKnown(next)
    try { localStorage.setItem("hanviet_known_cards", JSON.stringify([...next])) } catch {}
  }

  // Filter by tab
  const filteredAll = tab === "all" ? baseCards : baseCards.filter(c => c.qType === tab)
  // Exclude known if showing only remaining (but keep all visible in history)
  const activeCards = isShuffled ? filteredAll : filteredAll

  const card = activeCards[idx] ?? null
  const total = activeCards.length
  const knownCount = activeCards.filter(c => known.has(c.id)).length
  const remaining = total - knownCount

  const goNext = useCallback(() => {
    setIsFlipped(false)
    setTimeout(() => setIdx(i => (i + 1) % Math.max(total, 1)), 150)
  }, [total])

  const goPrev = useCallback(() => {
    setIsFlipped(false)
    setTimeout(() => setIdx(i => (i - 1 + Math.max(total, 1)) % Math.max(total, 1)), 150)
  }, [total])

  const handleKnown = () => {
    if (!card) return
    const next = new Set(known)
    next.add(card.id)
    saveKnown(next)
    goNext()
  }

  const handleUnknown = () => {
    if (!card) return
    const next = new Set(known)
    next.delete(card.id)
    saveKnown(next)
    goNext()
  }

  const handleShuffle = () => {
    setIsShuffled(!isShuffled)
    setIdx(0)
    setIsFlipped(false)
  }

  const resetKnown = () => {
    saveKnown(new Set())
    setIdx(0)
    setIsFlipped(false)
  }

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      else if (e.key === "ArrowLeft") goPrev()
      else if (e.key === " ") { e.preventDefault(); setIsFlipped(f => !f) }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [goNext, goPrev])

  // ── Stats ──────────────────────────────────────────────────────────────────
  const practiceOnly = submissions.filter(s => s.question_type !== "mock_exam" && s.max_score > 0)
  const avgPct = practiceOnly.length > 0
    ? Math.min(100, Math.round(practiceOnly.reduce((a, s) => a + Math.min(1, s.total_score / s.max_score) * 100, 0) / practiceOnly.length))
    : 0

  // ── Empty state ────────────────────────────────────────────────────────────
  if (submissions.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
      <BottomNav />
        <main className="ml-0 md:ml-56 flex-1 p-4 md:p-8 pb-20 md:pb-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <span className="text-2xl font-black text-gray-300">?</span>
              </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Chưa có lỗi nào để ôn</h2>
            <p className="text-gray-500 text-sm mb-6">Luyện viết và nộp bài — AI sẽ ghi lại các lỗi để bạn ôn tập</p>
            <Link href="/practice" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl">
              Luyện viết ngay →
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <BottomNav />
      <main className="ml-0 md:ml-56 flex-1 p-4 md:p-8 pb-20 md:pb-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/practice" className="text-gray-400 hover:text-gray-600 text-sm">← Luyện viết</Link>
          <div className="w-px h-4 bg-gray-200" />
          <span className="font-bold text-gray-900">Ôn lỗi</span>
          <span className="text-sm text-gray-400">— Flashcard từ các bài AI đã chấm</span>
          <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
            <span>← → Space để điều hướng</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <div className="text-2xl font-extrabold text-blue-500">{practiceOnly.length}</div>
              <div className="text-xs text-gray-500 mt-1">Bài đã luyện</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <div className={`text-2xl font-extrabold ${avgPct >= 80 ? "text-blue-500" : avgPct >= 60 ? "text-gray-500" : "text-blue-500"}`}>
                {avgPct}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Điểm trung bình</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <div className="text-2xl font-extrabold text-blue-500">{knownCount}</div>
              <div className="text-xs text-gray-500 mt-1">Đã thuộc</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <div className="text-2xl font-extrabold text-blue-400">{remaining}</div>
              <div className="text-xs text-gray-500 mt-1">Còn cần ôn</div>
            </div>
          </div>

          {/* Filter tabs + controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1">
              {(["all", "q51", "q52", "q53", "q54"] as const).map(t => {
                const count = t === "all" ? baseCards.length : baseCards.filter(c => c.qType === t).length
                return (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setIdx(0); setIsFlipped(false) }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      tab === t
                        ? t === "all" ? "bg-gray-900 text-white" : Q_BADGE[t]
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {t === "all" ? "Tất cả" : t.toUpperCase()} {count > 0 && <span className="opacity-60 font-normal ml-0.5">({count})</span>}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all ${isShuffled ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}
              >
                Trộn bài
              </button>
              {knownCount > 0 && (
                <button onClick={resetKnown} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Reset tiến độ
                </button>
              )}
            </div>
          </div>

          {/* Main flashcard area */}
          {total === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                  <span className="text-blue-400 font-bold text-lg">✓</span>
                </div>
              <p className="text-gray-500 text-sm">
                {tab === "all" ? "Chưa có lỗi nào được ghi nhận" : `Không có lỗi nào cho ${tab.toUpperCase()}`}
              </p>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full transition-all duration-300"
                    style={{ width: `${total > 0 ? (knownCount / total) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 shrink-0">{knownCount}/{total} thuộc</span>
              </div>

              {/* Card */}
              {card && (
                <Flashcard card={card} isFlipped={isFlipped} onFlip={() => setIsFlipped(f => !f)} />
              )}

              {/* Navigation + action buttons */}
              <div className="flex items-center justify-between mt-4">
                <button onClick={goPrev} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all">
                  ←
                </button>

                {/* Counter + action */}
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm text-gray-400">{idx + 1} / {total}</span>
                  {isFlipped && (
                    <div className="flex gap-3">
                      <button
                        onClick={handleUnknown}
                        className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm rounded-xl border border-red-100 transition-all"
                      >
                        Chưa nhớ
                      </button>
                      <button
                        onClick={handleKnown}
                        className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-all"
                      >
                        ✓ Đã thuộc!
                      </button>
                    </div>
                  )}
                  {!isFlipped && (
                    <button
                      onClick={() => setIsFlipped(true)}
                      className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm rounded-xl transition-all"
                    >
                      Lật xem đáp án →
                    </button>
                  )}
                </div>

                <button onClick={goNext} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all">
                  →
                </button>
              </div>

              {/* Dot indicators (up to 20 dots) */}
              {total <= 20 && (
                <div className="flex justify-center gap-1.5 mt-5">
                  {activeCards.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => { setIsFlipped(false); setIdx(i) }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === idx ? "bg-gray-800 w-4" : known.has(c.id) ? "bg-blue-300" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Compact history */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-3 text-sm">Lịch sử bài viết</h2>
            <div className="space-y-2">
              {submissions.slice(0, 10).map(s => {
                const pct = s.max_score > 0 ? Math.round((s.total_score / s.max_score) * 100) : 0
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${Q_BADGE[s.question_type] ?? "bg-gray-100 text-gray-600"}`}>
                      {Q_LABEL[s.question_type] ?? s.question_type.toUpperCase()}
                    </span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct >= 80 ? "bg-blue-400" : pct >= 60 ? "bg-gray-400" : "bg-blue-400"}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold shrink-0 w-12 text-right ${pct >= 80 ? "text-blue-600" : pct >= 60 ? "text-gray-600" : "text-blue-500"}`}>
                      {s.total_score}/{s.max_score}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">{formatDate(s.created_at)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
