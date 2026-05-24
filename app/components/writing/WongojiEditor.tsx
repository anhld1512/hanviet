"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { countWongojiChars } from "@/lib/wongoji"

interface WongojiEditorProps {
  value: string
  onChange: (val: string) => void
  minChars?: number
  maxChars?: number
  placeholder?: string
  timeLimit?: number // giay
  onTimeUp?: () => void
  disabled?: boolean
  questionType?: "q51" | "q52" | "q53" | "q54"
}

// Gioi han theo loai cau hoi
const LIMITS: Record<string, { min: number; max: number }> = {
  q51: { min: 0, max: 50 },
  q52: { min: 0, max: 50 },
  q53: { min: 200, max: 300 },
  q54: { min: 600, max: 700 },
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export default function WongojiEditor({
  value,
  onChange,
  minChars,
  maxChars,
  placeholder = "Viết bài của bạn ở đây...",
  timeLimit,
  onTimeUp,
  disabled = false,
  questionType = "q54",
}: WongojiEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [timeLeft, setTimeLeft] = useState(timeLimit || 0)
  const [timerActive, setTimerActive] = useState(false)
  const [timerStarted, setTimerStarted] = useState(false)

  const limits = LIMITS[questionType] || { min: minChars || 0, max: maxChars || 700 }
  const min = minChars ?? limits.min
  const max = maxChars ?? limits.max

  const charCount = countWongojiChars(value)

  // Mau indicator
  const getIndicatorColor = () => {
    if (min > 0 && charCount < min * 0.5) return { bar: "bg-gray-300", text: "text-gray-400", label: "Chua du" }
    if (min > 0 && charCount < min) return { bar: "bg-yellow-400", text: "text-yellow-600", label: `Con ${min - charCount} chu` }
    if (charCount <= max) return { bar: "bg-green-500", text: "text-green-600", label: "Dung do dai" }
    return { bar: "bg-red-500", text: "text-red-600", label: `Vuot ${charCount - max} chu` }
  }

  const indicator = getIndicatorColor()
  const progressPercent = max > 0 ? Math.min((charCount / max) * 100, 110) : 0

  // Timer
  useEffect(() => {
    if (!timeLimit) return
    setTimeLeft(timeLimit)
  }, [timeLimit])

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval)
          setTimerActive(false)
          onTimeUp?.()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timerActive, onTimeUp])

  const handleFocus = useCallback(() => {
    if (timeLimit && !timerStarted) {
      setTimerActive(true)
      setTimerStarted(true)
    }
  }, [timeLimit, timerStarted])

  // Auto resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = `${Math.max(ta.scrollHeight, 320)}px`
  }, [value])

  const timerColor = timeLeft < 120 ? "text-red-500" : timeLeft < 300 ? "text-yellow-500" : "text-gray-700"

  return (
    <div className="flex flex-col gap-3">
      {/* Top bar: char count + timer */}
      <div className="flex items-center justify-between">
        {/* Char counter */}
        <div className="flex items-center gap-3">
          <div className={`text-sm font-bold ${indicator.text}`}>
            {charCount}
            {max > 0 && <span className="text-gray-400 font-normal">/{max}자</span>}
          </div>
          {min > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              charCount >= min && charCount <= max
                ? "bg-green-100 text-green-700"
                : charCount > max
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-500"
            }`}>
              {indicator.label}
            </span>
          )}
        </div>

        {/* Timer */}
        {timeLimit && (
          <div className="flex items-center gap-2">
            {!timerStarted ? (
              <span className="text-xs text-gray-400">⏱ Bắt đầu gõ để chạy timer</span>
            ) : (
              <div className={`flex items-center gap-1.5 text-sm font-bold ${timerColor}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  <path strokeLinecap="round" strokeWidth={2} d="M12 6v6l4 2" />
                </svg>
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {max > 0 && (
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${indicator.bar}`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      )}

      {/* 원고지 paper texture editor */}
      <div className={`relative rounded-2xl border-2 transition-colors ${
        disabled ? "border-gray-100 bg-gray-50" : "border-gray-200 bg-white focus-within:border-blue-300"
      }`}>
        {/* 원고지 grid background */}
        <div
          className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: "32px 40px",
            backgroundPosition: "16px 20px",
          }}
        />

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          disabled={disabled}
          placeholder={placeholder}
          className={`relative w-full min-h-80 p-6 bg-transparent rounded-2xl resize-none outline-none text-gray-900 text-base leading-[2.5rem] z-10 ${
            disabled ? "cursor-not-allowed text-gray-400" : ""
          }`}
          style={{
            fontFamily: "'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif",
            lineHeight: "2.5rem",
            letterSpacing: "0.05em",
          }}
          spellCheck={false}
        />
      </div>

      {/* Helper text */}
      {min > 0 && max > 0 && (
        <p className="text-xs text-gray-400 text-right">
          Yêu cầu: {min}-{max} chữ ({questionType?.toUpperCase()})
        </p>
      )}
    </div>
  )
}
