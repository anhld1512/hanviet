"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { lessons } from "@/lib/lessons-data"
import type { User } from "@supabase/supabase-js"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login")
        return
      }
      setUser(data.user)
      setLoading(false)
    })
  }, [router])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Đang tải...</div>
      </div>
    )
  }

  const firstName = user?.user_metadata?.full_name?.split(" ").pop() || "bạn"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇰🇷</span>
            <span className="font-bold text-gray-900">HanViet</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
              {user?.user_metadata?.full_name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Chào {firstName}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Tiếp tục hành trình tiếng Hàn của bạn.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: "🔥", value: "1", label: "Ngày streak" },
            { icon: "⭐", value: "0", label: "XP tích lũy" },
            { icon: "📚", value: "0/20", label: "Bài hoàn thành" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-extrabold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Continue learning */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-lg">Bài học</h2>
            <span className="text-xs text-gray-400">{lessons.length} bài có sẵn</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-xl">
                    {lesson.emoji}
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                    {lesson.level}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{lesson.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{lesson.titleKr}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">⏱ {lesson.duration}</span>
                  <span className="text-xs font-semibold text-blue-500 group-hover:translate-x-0.5 transition-transform">
                    {index === 0 ? "Bắt đầu →" : "Học ngay →"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Coming soon */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Sắp ra mắt</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: "🃏", title: "Flashcard", desc: "Ôn từ vựng với spaced repetition" },
              { icon: "📝", title: "Luyện thi TOPIK", desc: "Đề thi thử với đáp án giải thích" },
              { icon: "🎯", title: "Lộ trình cá nhân", desc: "Kế hoạch học theo mục tiêu của bạn" },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-4 opacity-60">
                <div className="text-xl mb-2">{item.icon}</div>
                <div className="font-semibold text-gray-700 text-sm">{item.title}</div>
                <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
