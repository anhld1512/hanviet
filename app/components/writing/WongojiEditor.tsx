"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { countWongojiChars } from "@/lib/wongoji"

interface WongojiEditorProps {
  value: string
  onChange: (val: string) => void
  minChars?: number
  maxChars?: number
  placeholder?: string
  timeLimit?: number
  onTimeUp?: () => void
  disabled?: boolean
  questionType?: "q51" | "q52" | "q53" | "q54"
}

const COLS = 20
const CELL_H = 38

const LIMITS: Record<string, { min: number; max: number; minRows: number }> = {
  q51: { min: 0,   max: 50,  minRows: 3  },
  q52: { min: 0,   max: 50,  minRows: 3  },
  q53: { min: 200, max: 300, minRows: 16 },
  q54: { min: 600, max: 700, minRows: 36 },
}

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

export default function WongojiEditor({
  value,
  onChange,
  minChars,
  maxChars,
  placeholder: _placeholder,
  timeLimit,
  onTimeUp,
  disabled = false,
  questionType = "q54",
}: WongojiEditorProps) {
  const cfg = LIMITS[questionType] ?? { min: 0, max: 700, minRows: 36 }
  const min = minChars ?? cfg.min
  const max = maxChars ?? cfg.max

  const taRef = useRef<HTMLTextAreaElement>(null)
  const isComposingRef = useRef(false)
  const [focused, setFocused] = useState(false)
  const [composing, setComposing] = useState("")

  // Sync gia tri tu ben ngoai vao DOM (vi textarea la uncontrolled)
  // Vi du: khi user bam "Xoa het" → value="" → can ghi vao DOM
  useEffect(() => {
    const ta = taRef.current
    if (ta && ta.value !== value) {
      ta.value = value
    }
  }, [value])
  const [timeLeft, setTimeLeft] = useState(timeLimit ?? 0)
  const [timerActive, setTimerActive] = useState(false)
  const [timerStarted, setTimerStarted] = useState(false)

  // Tach ky tu thanh mang (xu ly Unicode dung)
  const clean = value.replace(/\n/g, "")
  const allChars = [...clean]

  // Sau fix IME: onChange bi block trong luc compose
  // → composing char KHONG co trong value/allChars
  // → cursorIdx = allChars.length, hien composing char rieng tai o cursor
  const cursorIdx = allChars.length
  const charCount = countWongojiChars(value)

  const totalRows = Math.max(Math.ceil((allChars.length + 1) / COLS), cfg.minRows)
  const totalCells = totalRows * COLS

  // Mau indicator
  let barColor = "bg-gray-300", textColor = "text-gray-400", label = "Chưa đủ"
  if (min > 0 && charCount >= min * 0.5 && charCount < min) {
    barColor = "bg-yellow-400"; textColor = "text-yellow-600"; label = `Còn ${min - charCount} chữ`
  } else if (charCount >= (min || 0) && charCount <= max) {
    barColor = "bg-green-500"; textColor = "text-green-600"; label = "Đúng độ dài"
  } else if (charCount > max) {
    barColor = "bg-red-500"; textColor = "text-red-600"; label = `Vượt ${charCount - max} chữ`
  }

  const pct = max > 0 ? Math.min((charCount / max) * 100, 110) : 0

  // Timer
  useEffect(() => { if (timeLimit) setTimeLeft(timeLimit) }, [timeLimit])
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return
    const id = setInterval(() => setTimeLeft(t => {
      if (t <= 1) { clearInterval(id); setTimerActive(false); onTimeUp?.(); return 0 }
      return t - 1
    }), 1000)
    return () => clearInterval(id)
  }, [timerActive, onTimeUp])

  const handleFocus = useCallback(() => {
    setFocused(true)
    if (timeLimit && !timerStarted) { setTimerActive(true); setTimerStarted(true) }
  }, [timeLimit, timerStarted])

  const timerColor = timeLeft < 120 ? "text-red-500" : timeLeft < 300 ? "text-yellow-500" : "text-gray-700"

  return (
    <div className="flex flex-col gap-3">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-sm font-bold ${textColor}`}>
            {charCount}
            {max > 0 && <span className="text-gray-400 font-normal">/{max}자</span>}
          </span>
          {min > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              charCount >= min && charCount <= max
                ? "bg-green-100 text-green-700"
                : charCount > max
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-500"
            }`}>
              {label}
            </span>
          )}
        </div>

        {timeLimit && (
          !timerStarted
            ? <span className="text-xs text-gray-400">⏱ Bắt đầu gõ để chạy timer</span>
            : <div className={`flex items-center gap-1.5 text-sm font-bold ${timerColor}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  <path strokeLinecap="round" strokeWidth={2} d="M12 6v6l4 2" />
                </svg>
                {formatTime(timeLeft)}
              </div>
        )}
      </div>

      {/* Progress bar */}
      {max > 0 && (
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      )}

      {/* 원고지 grid */}
      <div
        className={`relative rounded-2xl overflow-hidden cursor-text transition-colors select-none border-2 ${
          disabled
            ? "border-gray-100 bg-gray-50 cursor-not-allowed"
            : focused
            ? "border-blue-300"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => !disabled && taRef.current?.focus()}
      >
        {/* Textarea UNCONTROLLED – React khong bao gio ghi de DOM value
            → IME composition buffer khong bi pha → tieng Han gop am tiet dung */}
        <textarea
          ref={taRef}
          defaultValue=""
          onInput={() => {
            // Dung onInput thay onChange – fires sau moi keystroke ke ca IME
            if (!isComposingRef.current && taRef.current) {
              onChange(taRef.current.value)
            }
          }}
          onKeyDown={(e) => {
            // Backspace/Delete: luon force-sync du dang compose hay không
            // Fix: IME stuck → isComposing=true → onInput bi block → xoa khong duoc
            if ((e.key === "Backspace" || e.key === "Delete") && taRef.current) {
              isComposingRef.current = false
              setComposing("")
              setTimeout(() => {
                if (taRef.current) onChange(taRef.current.value)
              }, 0)
            }
          }}
          onFocus={handleFocus}
          onBlur={() => {
            setFocused(false)
            setComposing("")
            isComposingRef.current = false
            // Sync on blur to catch any stuck composition
            if (taRef.current) onChange(taRef.current.value)
          }}
          onCompositionStart={() => { isComposingRef.current = true }}
          onCompositionUpdate={e => setComposing(e.data ?? "")}
          onCompositionEnd={() => {
            isComposingRef.current = false
            setComposing("")
            // Sau khi am tiet hoan chinh, dong bo vao React state
            if (taRef.current) onChange(taRef.current.value)
          }}
          disabled={disabled}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          style={{
            position: "absolute",
            opacity: 0,
            width: 1,
            height: 1,
            top: 0,
            left: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        />

        {/* Cac o wongoji */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          }}
        >
          {Array.from({ length: totalCells }, (_, i) => {
            const isCursorCell = i === cursorIdx
            const isComposingCell = isCursorCell && !!composing && focused
            const displayChar = isComposingCell
              ? composing
              : (allChars[i] ?? "")
            const showCursor = isCursorCell && focused && !composing
            const isOverMax = max > 0 && i >= max

            return (
              <div
                key={i}
                style={{
                  height: CELL_H,
                  borderRight: "1px solid #e2e8f0",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  backgroundColor: isOverMax
                    ? "#fef2f2"
                    : isComposingCell
                    ? "#eff6ff"
                    : "transparent",
                  fontFamily: "'Malgun Gothic', 'Apple SD Gothic Neo', 'NanumGothic', sans-serif",
                  fontSize: 19,
                  lineHeight: 1,
                  color: isComposingCell ? "#2563eb" : "#111827",
                }}
              >
                {displayChar || null}

                {showCursor && (
                  <span
                    style={{
                      position: "absolute",
                      width: 2,
                      height: 20,
                      background: "#3b82f6",
                      borderRadius: 1,
                      animation: "wg-blink 1s step-end infinite",
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes wg-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>

      {min > 0 && max > 0 && (
        <p className="text-xs text-gray-400 text-right">
          Yêu cầu: {min}–{max} chữ · {questionType?.toUpperCase()}
        </p>
      )}
    </div>
  )
}
