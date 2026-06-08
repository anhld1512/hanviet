"use client"

import { useEffect, useState } from "react"

const MESSAGES = [
  "Đang đọc bài viết của bạn...",
  "Đang phân tích ngữ pháp...",
  "Đang kiểm tra từ vựng & cấu trúc...",
  "Đang đánh giá nội dung...",
  "Đang tổng hợp nhận xét chi tiết...",
  "Sắp có kết quả rồi...",
]

export default function GradingLoader() {
  const [msgIndex, setMsgIndex] = useState(0)
  const [dots, setDots] = useState(1)

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length)
    }, 3000)
    const dotTimer = setInterval(() => {
      setDots(d => (d % 3) + 1)
    }, 500)
    return () => { clearInterval(msgTimer); clearInterval(dotTimer) }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-8 flex flex-col items-center gap-5 w-80 text-center">

        {/* Spinner ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🤖</div>
        </div>

        {/* Title */}
        <div>
          <p className="text-base font-bold text-gray-800">AI đang chấm bài</p>
          <p className="text-xs text-gray-400 mt-1">
            Thường mất 30–60 giây, vui lòng không tắt trang
          </p>
        </div>

        {/* Cycling message */}
        <div className="min-h-[36px] flex items-center justify-center px-4 py-2 bg-blue-50 rounded-xl w-full">
          <p className="text-xs text-blue-700 font-medium leading-relaxed">
            {MESSAGES[msgIndex]}{".".repeat(dots)}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {MESSAGES.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                i === msgIndex ? "bg-blue-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
