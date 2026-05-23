"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

export default function FloatingCTA() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const target = document.getElementById("register")
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`fixed right-6 bottom-6 z-50 transition-all duration-300 ${
        hidden ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
      }`}
    >
      <Link
        href="/register"
        className="flex flex-col items-center bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-0.5 px-5 py-4 min-w-44"
      >
        <span className="text-xs font-medium text-blue-100 mb-1">Mục tiêu đỗ EPS-TOPIK?</span>
        <span className="font-bold text-base leading-tight text-center">Bắt đầu ôn thi ngay</span>
        <div className="mt-2 flex items-center gap-1 bg-white/20 rounded-lg px-3 py-1">
          <span className="text-xs font-semibold">Đăng ký miễn phí</span>
          <span className="text-xs">→</span>
        </div>
      </Link>
    </div>
  )
}
