"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { WritingPrompt } from "@/lib/data/prompts"
import type { GradeResult } from "@/lib/grading-prompts"
import WongojiEditor from "@/app/components/writing/WongojiEditor"
import UpgradeModal from "@/app/components/UpgradeModal"
import { saveSubmission } from "@/lib/save-submission"
import { Timer, Zap } from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────────────────
type Prompts = { q51: WritingPrompt; q52: WritingPrompt; q53: WritingPrompt; q54: WritingPrompt }
type Phase = "setup" | "exam" | "grading" | "results"
type QKey = "q51" | "q52" | "q53" | "q54"

type ExamResults = {
  q51: { a: GradeResult; b: GradeResult } | null
  q52: { a: GradeResult; b: GradeResult } | null
  q53: GradeResult | null
  q54: GradeResult | null
}

// ─── Constants ───────────────────────────────────────────────────────────────
const EXAM_SECONDS = 50 * 60 // 50 minutes
const Q_TABS: { key: QKey; label: string; points: number; color: string; accent: string }[] = [
  { key: "q51", label: "Q51", points: 10,  color: "green",  accent: "bg-blue-100 text-blue-700" },
  { key: "q52", label: "Q52", points: 10,  color: "blue",   accent: "bg-blue-100 text-blue-700" },
  { key: "q53", label: "Q53", points: 30,  color: "purple", accent: "bg-blue-100 text-blue-700" },
  { key: "q54", label: "Q54", points: 50,  color: "orange", accent: "bg-gray-100 text-blue-700" },
]

function fmtTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

function levelEstimate(total: number): { label: string; color: string; desc: string } {
  if (total >= 85) return { label: "Level 6", color: "text-blue-600", desc: "Xuất sắc — có thể đạt Level 6" }
  if (total >= 70) return { label: "Level 5-6", color: "text-blue-600", desc: "Tốt — vùng Level 5, có thể lên 6" }
  if (total >= 55) return { label: "Level 4-5", color: "text-blue-600", desc: "Khá — vùng Level 4, hướng tới 5" }
  if (total >= 40) return { label: "Level 3-4", color: "text-gray-600", desc: "Trung bình — pass được Level 3" }
  return { label: "Cần cố gắng", color: "text-blue-500", desc: "Chưa đủ điểm pass — cần luyện thêm" }
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ExamClient({
  prompts, isPro, usedThisMonth, displayName,
}: {
  prompts: Prompts
  isPro: boolean
  usedThisMonth: number
  displayName: string
}) {
  const router = useRouter()

  // Phase
  const [phase, setPhase] = useState<Phase>("setup")
  const [activeQ, setActiveQ] = useState<QKey>("q51")

  // Prompts — can be replaced by AI-generated set
  const [activePrompts, setActivePrompts] = useState<Prompts>(prompts)
  const [promptMode, setPromptMode] = useState<"bank" | "ai">("bank")
  const [generatingAI, setGeneratingAI] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  // Answers
  const [ans51A, setAns51A] = useState("")
  const [ans51B, setAns51B] = useState("")
  const [ans52A, setAns52A] = useState("")
  const [ans52B, setAns52B] = useState("")
  const [ans53, setAns53] = useState("")
  const [ans54, setAns54] = useState("")

  // Timer
  const [timeLeft, setTimeLeft] = useState(EXAM_SECONDS)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Results
  const [results, setResults] = useState<ExamResults>({ q51: null, q52: null, q53: null, q54: null })
  const [expandedQ, setExpandedQ] = useState<QKey | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [gradingStep, setGradingStep] = useState(0) // 0-4 progress
  const [submitError, setSubmitError] = useState<string | null>(null)

  // ── Completion checks ──────────────────────────────────────────────────────
  const done51 = ans51A.trim().length > 0 && ans51B.trim().length > 0
  const done52 = ans52A.trim().length > 0 && ans52B.trim().length > 0
  const done53 = ans53.replace(/\n/g, "").length >= 50
  const done54 = ans54.replace(/\n/g, "").length >= 200
  const allDone = done51 && done52 && done53 && done54

  const doneMap: Record<QKey, boolean> = { q51: done51, q52: done52, q53: done53, q54: done54 }

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "exam") return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); handleAutoSubmit(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  function stopTimer() { if (timerRef.current) clearInterval(timerRef.current) }

  // ── Generate AI exam set ───────────────────────────────────────────────────
  async function handleGenerateAI() {
    setGeneratingAI(true)
    setAiError(null)
    try {
      const [r51, r52, r53, r54] = await Promise.all([
        fetch("/api/generate-prompt?type=q51").then(r => r.json()),
        fetch("/api/generate-prompt?type=q52").then(r => r.json()),
        fetch("/api/generate-prompt?type=q53").then(r => r.json()),
        fetch("/api/generate-prompt?type=q54").then(r => r.json()),
      ])
      if (r51.error || r52.error || r53.error || r54.error) throw new Error("Tạo đề thất bại")
      setActivePrompts({ q51: r51, q52: r52, q53: r53, q54: r54 })
      setPromptMode("ai")
    } catch {
      setAiError("Không thể tạo đề AI, thử lại")
    } finally {
      setGeneratingAI(false)
    }
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    stopTimer()
    setPhase("grading")
    setGradingStep(0)
    setSubmitError(null)

    try {
      // ── Single batch call — counts as 1 grading use ──────────
      const res = await fetch("/api/grade-exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q51: {
            prompt_text: activePrompts.q51.text_kr,
            answer_a: ans51A,
            answer_b: ans51B,
            hint_a: activePrompts.q51.blanks?.[0]?.hint ?? "",
            hint_b: activePrompts.q51.blanks?.[1]?.hint ?? "",
          },
          q52: {
            prompt_text: activePrompts.q52.text_kr,
            answer_a: ans52A,
            answer_b: ans52B,
            hint_a: activePrompts.q52.blanks?.[0]?.hint ?? "",
            hint_b: activePrompts.q52.blanks?.[1]?.hint ?? "",
          },
          q53: {
            chart_description: activePrompts.q53.text_kr,
            essay: ans53,
          },
          q54: {
            topic: activePrompts.q54.topic ?? activePrompts.q54.text_kr,
            essay: ans54,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.error === "free_limit_reached") throw new Error("free_limit_reached")
        throw new Error(data.error || "Lỗi máy chủ")
      }
      const { r51A, r51B, r52A, r52B, r53: r53Res, r54: r54Res } = data

      setGradingStep(4)
      setResults({ q51: { a: r51A, b: r51B }, q52: { a: r52A, b: r52B }, q53: r53Res, q54: r54Res })

      // Save combined submission
      const total51 = r51A.scores.total + r51B.scores.total
      const total52 = r52A.scores.total + r52B.scores.total
      const combined: GradeResult = {
        question_type: "mock_exam",
        scores: { content: 0, organization: 0, language: 0, style: 0, total: total51 + total52 + r53Res.scores.total + r54Res.scores.total },
        max_scores: { content: 0, organization: 0, language: 0, style: 0, total: 100 },
        feedback: { overall: "Thi thử full 4 câu", content: "", organization: "", language: "", style: "" },
        corrections: [],
      }
      saveSubmission({ questionType: "mock_exam", userAnswer: ans54, gradeResult: combined })

      setPhase("results")
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Lỗi không xác định"
      if (msg === "free_limit_reached") {
        setPhase("setup")
        setShowUpgrade(true)
        return
      }
      setSubmitError(msg)
      setPhase("exam")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ans51A, ans51B, ans52A, ans52B, ans53, ans54, prompts])

  function handleAutoSubmit() { handleSubmit() }

  // ── Computed scores ────────────────────────────────────────────────────────
  const totalScore = results.q51 && results.q52 && results.q53 && results.q54
    ? results.q51.a.scores.total + results.q51.b.scores.total
      + results.q52.a.scores.total + results.q52.b.scores.total
      + results.q53.scores.total
      + results.q54.scores.total
    : 0

  const scoreBreakdown = results.q51 && results.q52 && results.q53 && results.q54
    ? [
        { key: "Q51", earned: results.q51.a.scores.total + results.q51.b.scores.total, max: 10, color: "bg-blue-500" },
        { key: "Q52", earned: results.q52.a.scores.total + results.q52.b.scores.total, max: 10, color: "bg-blue-500" },
        { key: "Q53", earned: results.q53.scores.total, max: 30, color: "bg-blue-500" },
        { key: "Q54", earned: results.q54.scores.total, max: 50, color: "bg-gray-500" },
      ]
    : []

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  // ── SETUP ─────────────────────────────────────────────────────────────────
  if (phase === "setup") {
    const FREE_LIMIT = 5
    const remaining = isPro ? 999 : Math.max(0, FREE_LIMIT - usedThisMonth)

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm max-w-lg w-full p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 mx-auto">
              <Timer size={28} className="text-gray-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Thi thử TOPIK II Viết</h1>
            <p className="text-gray-500">Mô phỏng đúng cấu trúc đề thi thật — 4 câu · 50 phút · 100 điểm</p>
          </div>

          {/* Exam overview */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Q_TABS.map((q) => (
              <div key={q.key} className={`rounded-xl border p-3 ${q.key === "q51" ? "border-blue-100 bg-blue-50" : q.key === "q52" ? "border-blue-100 bg-blue-50" : q.key === "q53" ? "border-blue-100 bg-blue-50" : "border-gray-100 bg-gray-50"}`}>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${q.accent}`}>{q.label}</span>
                <div className="mt-1.5 text-xs text-gray-600 font-semibold">{q.points} điểm</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {q.key === "q51" ? "Điền câu (thực dụng)" : q.key === "q52" ? "Điền câu (nghị luận)" : q.key === "q53" ? "Phân tích biểu đồ" : "Bài luận 600-700 chữ"}
                </div>
              </div>
            ))}
          </div>

          {/* Rules */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 text-xs text-gray-700 space-y-1">
            <div className="font-bold mb-2">Quy tắc thi thử:</div>
            <div>• Không có gợi ý — như thi thật</div>
            <div>• Đồng hồ đếm ngược 50 phút, tự nộp khi hết giờ</div>
            <div>• Có thể chuyển qua lại giữa các câu</div>
            <div>• Cần viết đủ mới nộp được (Q54 ≥ 200 chữ)</div>
          </div>

          {/* Usage info */}
          {!isPro && (
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 mb-5 text-xs">
              <span className="text-gray-500">Lượt chấm còn lại tháng này:</span>
              <span className={`font-bold ${remaining <= 1 ? "text-red-500" : remaining <= 2 ? "text-blue-500" : "text-gray-900"}`}>
                {remaining}/{FREE_LIMIT}
              </span>
            </div>
          )}
          {isPro && (
            <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-3 mb-5 text-xs text-blue-700">
              <Zap size={13} /><span className="font-semibold">Pro — không giới hạn lượt chấm</span>
            </div>
          )}

          {/* Prompt mode selector */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => { setActivePrompts(prompts); setPromptMode("bank") }}
              className={`rounded-xl border-2 p-3 text-left transition-all ${promptMode === "bank" ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <div className="text-sm font-bold text-gray-900 mb-0.5">Đề ngẫu nhiên</div>
              <div className="text-xs text-gray-500">Chọn từ bank đề TOPIK có sẵn</div>
            </button>
            <button
              onClick={handleGenerateAI}
              disabled={generatingAI}
              className={`rounded-xl border-2 p-3 text-left transition-all disabled:opacity-60 ${promptMode === "ai" ? "border-blue-500 bg-blue-50" : "border-dashed border-blue-200 hover:border-blue-400"}`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-sm font-bold text-gray-900">
                  {generatingAI ? "Đang tạo..." : "Đề AI mới"}
                </span>
                {promptMode === "ai" && <span className="text-[10px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-full">Đang dùng</span>}
              </div>
              <div className="text-xs text-gray-500">AI tạo 4 đề mới chuẩn format TOPIK</div>
            </button>
          </div>

          {aiError && <p className="text-xs text-red-500 mb-3">{aiError}</p>}

          {/* Topic preview */}
          {promptMode === "ai" && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 space-y-1.5">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide mb-2">Đề AI vừa tạo</p>
              {(["q51","q52","q53","q54"] as QKey[]).map(q => (
                <div key={q} className="flex items-start gap-2 text-xs text-gray-700">
                  <span className={`shrink-0 font-bold px-1.5 py-0.5 rounded text-[10px] ${q === "q51" ? "bg-blue-100 text-blue-700" : q === "q52" ? "bg-blue-100 text-blue-700" : q === "q53" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-blue-700"}`}>{q.toUpperCase()}</span>
                  <span className="text-gray-600 leading-relaxed">{activePrompts[q].context}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {remaining > 0 || isPro ? (
              <button
                onClick={() => { setPhase("exam"); setTimeLeft(EXAM_SECONDS) }}
                disabled={generatingAI}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl transition-colors"
              >
                {generatingAI ? "Đang tạo đề AI..." : "Bắt đầu thi thử →"}
              </button>
            ) : (
              <button
                onClick={() => setShowUpgrade(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors"
              >
                Nâng cấp Pro để thi thử
              </button>
            )}
            <button onClick={() => router.push("/practice")} className="text-center text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Quay lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── GRADING ───────────────────────────────────────────────────────────────
  if (phase === "grading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-6 mx-auto animate-pulse">
            <span className="text-xl font-black text-gray-400">AI</span>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">AI đang chấm bài...</h2>
          <p className="text-sm text-gray-500 mb-8">Đang phân tích cả 4 câu cùng lúc · vài giây nữa thôi</p>
          <div className="flex justify-center gap-2">
            {Q_TABS.map((q, i) => (
              <div key={q.key} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-500 ${i <= gradingStep ? q.accent : "bg-gray-100 text-gray-400"}`}>
                {i < gradingStep ? "✓" : i === gradingStep ? "···" : "○"} {q.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (phase === "results" && results.q51 && results.q52 && results.q53 && results.q54) {
    const est = levelEstimate(totalScore)
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => router.push("/practice")} className="text-gray-400 hover:text-gray-600 text-sm">← Trang chủ</button>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-sm font-semibold text-gray-700">Kết quả thi thử</span>
          </div>

          {/* Score hero */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 text-center">
            <div className="text-6xl font-extrabold text-gray-900 mb-1">{totalScore}<span className="text-2xl text-gray-400 font-normal">/100</span></div>
            <div className={`text-lg font-bold mb-1 ${est.color}`}>{est.label}</div>
            <div className="text-sm text-gray-500 mb-6">{est.desc}</div>

            {/* Score bar breakdown */}
            <div className="space-y-3">
              {scoreBreakdown.map((s) => (
                <div key={s.key} className="flex items-center gap-3">
                  <div className="w-8 text-xs font-bold text-gray-500 text-right">{s.key}</div>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${s.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${(s.earned / s.max) * 100}%` }}
                    />
                  </div>
                  <div className="w-14 text-xs font-bold text-gray-700 text-right">{s.earned}/{s.max}</div>
                  <div className="w-10 text-xs text-gray-400">{Math.round((s.earned / s.max) * 100)}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Per-question detail cards */}
          <div className="space-y-3 mb-6">
            {Q_TABS.map((qt) => {
              const qRes = results[qt.key as QKey]
              if (!qRes) return null
              const earned = qt.key === "q51"
                ? results.q51!.a.scores.total + results.q51!.b.scores.total
                : qt.key === "q52"
                ? results.q52!.a.scores.total + results.q52!.b.scores.total
                : qt.key === "q53"
                ? results.q53!.scores.total
                : results.q54!.scores.total
              const pct = Math.round((earned / qt.points) * 100)
              const isExpanded = expandedQ === qt.key

              return (
                <div key={qt.key} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedQ(isExpanded ? null : qt.key as QKey)}
                    className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors"
                  >
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${qt.accent}`}>{qt.label}</span>
                    <span className="text-sm text-gray-600 flex-1 text-left">{prompts[qt.key as QKey].context}</span>
                    <span className={`text-base font-extrabold ${pct >= 80 ? "text-blue-600" : pct >= 60 ? "text-gray-600" : "text-blue-500"}`}>
                      {earned}/{qt.points}
                    </span>
                    <span className="text-gray-300 text-sm">{isExpanded ? "▲" : "▼"}</span>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-4">
                      {(qt.key === "q51" || qt.key === "q52") && (
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: "ㄱ", res: qt.key === "q51" ? results.q51!.a : results.q52!.a, ans: qt.key === "q51" ? ans51A : ans52A },
                            { label: "ㄴ", res: qt.key === "q51" ? results.q51!.b : results.q52!.b, ans: qt.key === "q51" ? ans51B : ans52B },
                          ].map(({ label, res, ans }) => (
                            <div key={label} className="bg-gray-50 rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center font-bold">{label}</span>
                                <span className="text-xs text-gray-500 italic">"{ans}"</span>
                              </div>
                              <div className="text-sm text-gray-700">{res.feedback.overall}</div>
                              {res.corrections?.slice(0, 1).map((c, i) => (
                                <div key={i} className="mt-2 text-xs bg-red-50 text-red-700 rounded-lg p-2">
                                  <span className="line-through">{c.original}</span> → <span className="font-semibold">{c.corrected}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                      {(qt.key === "q53" || qt.key === "q54") && (
                        <div className="space-y-2">
                          <div className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4">
                            {(qt.key === "q53" ? results.q53 : results.q54)?.feedback.overall}
                          </div>
                          {(qt.key === "q53" ? results.q53 : results.q54)?.corrections?.slice(0, 2).map((c, i) => (
                            <div key={i} className="text-xs bg-red-50 text-red-700 rounded-lg p-2">
                              <span className="line-through">{c.original}</span> → <span className="font-semibold">{c.corrected}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setPhase("setup")
                setAns51A(""); setAns51B(""); setAns52A(""); setAns52B("")
                setAns53(""); setAns54("")
                setResults({ q51: null, q52: null, q53: null, q54: null })
                setExpandedQ(null)
              }}
              className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              Thi lại
            </button>
            <button
              onClick={() => router.push("/review")}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-colors text-sm"
            >
              Xem phân tích lỗi →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── EXAM ──────────────────────────────────────────────────────────────────
  const isLowTime = timeLeft < 5 * 60
  const activeTab = Q_TABS.find((q) => q.key === activeQ)!

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
        <span className="text-sm font-bold text-gray-700">Thi thử TOPIK II</span>

        {/* Tab nav */}
        <div className="flex gap-1 ml-4">
          {Q_TABS.map((q) => (
            <button
              key={q.key}
              onClick={() => setActiveQ(q.key)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                activeQ === q.key
                  ? `${q.accent}`
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              {doneMap[q.key] && <span className="text-blue-500">✓</span>}
              {q.label}
              <span className="opacity-60">{q.points}đ</span>
            </button>
          ))}
        </div>

        {/* Progress pips */}
        <div className="flex gap-1 ml-2">
          {Q_TABS.map((q) => (
            <div key={q.key} className={`w-2 h-2 rounded-full transition-colors ${doneMap[q.key] ? "bg-blue-400" : "bg-gray-200"}`} />
          ))}
        </div>

        {/* Timer */}
        <div className="ml-auto flex items-center gap-2">
          {submitError && (
            <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-lg">{submitError}</span>
          )}
          <div className={`font-mono text-lg font-extrabold px-4 py-1.5 rounded-xl ${isLowTime ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 text-gray-700"}`}>
            {fmtTime(timeLeft)}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!allDone}
            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            Nộp bài
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">

        {/* Q51 */}
        {activeQ === "q51" && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">Q51</span>
                <span className="text-sm text-gray-500">{activePrompts.q51.context}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm text-gray-700 leading-relaxed whitespace-pre-line">{activePrompts.q51.text_kr}</div>
              <p className="text-xs text-gray-400 mt-3">Viết 1 câu phù hợp vào mỗi chỗ trống · thể văn 습니다체</p>
            </div>
            <div className="flex flex-col gap-4">
              {[{ key: "ㄱ", val: ans51A, set: setAns51A }, { key: "ㄴ", val: ans51B, set: setAns51B }].map(({ key, val, set }) => (
                <div key={key} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{key}</span>
                    <span className="text-xs text-gray-400">{val.length} ký tự</span>
                  </div>
                  <WongojiEditor value={val} onChange={set} placeholder={`Viết câu cho chỗ trống ${key}...`} questionType="q51" />
                </div>
              ))}
              <button onClick={() => setActiveQ("q52")} className="w-full text-center text-sm text-blue-600 font-semibold py-2 hover:bg-blue-50 rounded-xl transition-colors">
                Câu tiếp theo: Q52 →
              </button>
            </div>
          </div>
        )}

        {/* Q52 */}
        {activeQ === "q52" && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">Q52</span>
                <span className="text-sm text-gray-500">{activePrompts.q52.context}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm text-gray-700 leading-relaxed whitespace-pre-line">{activePrompts.q52.text_kr}</div>
              <p className="text-xs text-gray-400 mt-3">Viết 1 câu phù hợp · thể văn 다/ㄴ다체 học thuật</p>
            </div>
            <div className="flex flex-col gap-4">
              {[{ key: "ㄱ", val: ans52A, set: setAns52A }, { key: "ㄴ", val: ans52B, set: setAns52B }].map(({ key, val, set }) => (
                <div key={key} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{key}</span>
                    <span className="text-xs text-gray-400">{val.length} ký tự</span>
                  </div>
                  <WongojiEditor value={val} onChange={set} placeholder={`Viết câu cho chỗ trống ${key}...`} questionType="q52" />
                </div>
              ))}
              <button onClick={() => setActiveQ("q53")} className="w-full text-center text-sm text-blue-600 font-semibold py-2 hover:bg-blue-50 rounded-xl transition-colors">
                Câu tiếp theo: Q53 →
              </button>
            </div>
          </div>
        )}

        {/* Q53 */}
        {activeQ === "q53" && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">Q53</span>
                <span className="text-sm text-gray-500">{activePrompts.q53.context}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">{activePrompts.q53.text_kr}</div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">Bài viết của bạn</h3>
                  <span className={`text-sm font-bold ${ans53.replace(/\n/g,"").length < 200 ? "text-blue-500" : ans53.replace(/\n/g,"").length > 300 ? "text-gray-600" : "text-blue-600"}`}>
                    {ans53.replace(/\n/g,"").length} chữ
                  </span>
                </div>
                <WongojiEditor value={ans53} onChange={setAns53} minChars={200} maxChars={320} questionType="q53" placeholder="Phân tích biểu đồ... (200–300 chữ)" />
              </div>
              <button onClick={() => setActiveQ("q54")} className="w-full text-center text-sm text-blue-600 font-semibold py-2 hover:bg-blue-50 rounded-xl transition-colors">
                Câu tiếp theo: Q54 →
              </button>
            </div>
          </div>
        )}

        {/* Q54 */}
        {activeQ === "q54" && (
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-blue-700">Q54</span>
                  <span className="text-sm text-gray-500">{activePrompts.q54.context}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">{activePrompts.q54.text_kr}</div>
                {activePrompts.q54.topic && (
                  <div className="mt-3 bg-gray-50 rounded-xl p-3 text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-line">{activePrompts.q54.topic}</div>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">Bài viết của bạn</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[600, 650, 700].map((t) => (
                        <span key={t} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${ans54.replace(/\n/g,"").length >= t ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"}`}>{t}</span>
                      ))}
                    </div>
                    <span className={`text-sm font-bold ${ans54.replace(/\n/g,"").length < 600 ? "text-blue-500" : ans54.replace(/\n/g,"").length > 700 ? "text-gray-600" : "text-blue-600"}`}>
                      {ans54.replace(/\n/g,"").length} chữ
                    </span>
                  </div>
                </div>
                <WongojiEditor value={ans54} onChange={setAns54} minChars={600} maxChars={720} questionType="q54" placeholder="Viết bài luận... (600–700 chữ, thể văn 다체)" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
