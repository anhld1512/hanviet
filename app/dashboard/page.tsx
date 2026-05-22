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
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/login"); return }
      setUser(data.user)
      const { data: ul } = await supabase
        .from("user_lessons").select("lesson_id").eq("user_id", data.user.id)
      setCompletedLessons((ul || []).map((r: { lesson_id: number }) => r.lesson_id))
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
  const completedCount = completedLessons.length
  const totalLessons = lessons.length
  const xp = completedCount * 15
  const progressPercent = Math.round((completedCount / totalLessons) * 100)

  // Find next lesson to do
  const nextLesson = lessons.find((l) => !completedLessons.includes(l.id))

  // Group lessons into stages
  const stages = [
    { label: "Giai đoạn 1", sublabel: "Nền tảng giao tiếp", ids: [1, 2, 3, 4, 5] },
    { label: "Giai đoạn 2", sublabel: "Tình huống hàng ngày", ids: [6, 7, 8, 9, 10] },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
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
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
              Trang chủ
            </Link>
            <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Welcome + next action */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Chào {firstName}! 👋</h1>
          {completedCount === 0 ? (
            <p className="text-gray-500">Bắt đầu hành trình tiếng Hàn của bạn từ bài học đầu tiên.</p>
          ) : (
            <p className="text-gray-500">Bạn đã hoàn thành {completedCount}/{totalLessons} bài. Tiếp tục thôi!</p>
          )}
        </div>

        {/* CTA tiếp tục học */}
        {nextLesson && (
          <Link
            href={`/lessons/${nextLesson.id}`}
            className="flex items-center gap-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl p-5 mb-6 transition-colors group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl shrink-0">
              {nextLesson.emoji}
            </div>
            <div className="flex-1">
              <div className="text-xs text-blue-100 mb-0.5">
                {completedCount === 0 ? "Bài học đầu tiên" : "Tiếp tục học"}
              </div>
              <div className="font-bold text-base">{nextLesson.title}</div>
              <div className="text-blue-100 text-sm">{nextLesson.titleKr} · {nextLesson.duration}</div>
            </div>
            <span className="text-white/60 text-xl group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="text-2xl mb-1">📚</div>
            <div className="text-xl font-extrabold text-gray-900">{completedCount}/{totalLessons}</div>
            <div className="text-xs text-gray-500 mt-0.5">Bài hoàn thành</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-xl font-extrabold text-gray-900">{xp}</div>
            <div className="text-xs text-gray-500 mt-0.5">XP tích lũy</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xl font-extrabold text-gray-900">{progressPercent}%</div>
            <div className="text-xs text-gray-500 mt-0.5">Tiến độ</div>
          </div>
        </div>

        {/* Progress bar */}
        {completedCount > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Lộ trình TOPIK 1</span>
              <span className="text-blue-500 font-semibold">{progressPercent}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {completedCount < totalLessons
                ? `Hoàn thành ${totalLessons - completedCount} bài nữa để đạt nền tảng TOPIK 1`
                : "Xuất sắc! Bạn đã hoàn thành lộ trình TOPIK 1 cơ bản!"}
            </div>
          </div>
        )}

        {/* Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/flashcards"
            className="bg-green-500 hover:bg-green-600 text-white rounded-2xl p-5 flex items-center gap-4 transition-colors group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl shrink-0">🃏</div>
            <div>
              <div className="font-bold text-base">Flashcard</div>
              <div className="text-green-100 text-sm mt-0.5">Ôn từ vựng, nhắc đúng lúc sắp quên</div>
            </div>
            <span className="ml-auto text-white/60 group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
          <Link
            href="/topik"
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-2xl p-5 flex items-center gap-4 transition-colors group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl shrink-0">📝</div>
            <div>
              <div className="font-bold text-base">Luyện thi TOPIK</div>
              <div className="text-purple-100 text-sm mt-0.5">20 câu hỏi format thi thật</div>
            </div>
            <span className="ml-auto text-white/60 group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* Lộ trình bài học */}
        <div>
          <h2 className="font-bold text-gray-900 text-lg mb-4">Lộ trình học</h2>
          {stages.map((stage) => {
            const stageLessons = lessons.filter((l) => stage.ids.includes(l.id))
            const stageDone = stageLessons.filter((l) => completedLessons.includes(l.id)).length
            const stageComplete = stageDone === stageLessons.length
            return (
              <div key={stage.label} className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${stageComplete ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                    {stageComplete ? "✓" : stageDone}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 text-sm">{stage.label}</span>
                    <span className="text-gray-400 text-xs ml-2">{stage.sublabel}</span>
                  </div>
                  <span className="ml-auto text-xs text-gray-400">{stageDone}/{stageLessons.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-10">
                  {stageLessons.map((lesson) => {
                    const done = completedLessons.includes(lesson.id)
                    const isNext = nextLesson?.id === lesson.id
                    return (
                      <Link
                        key={lesson.id}
                        href={`/lessons/${lesson.id}`}
                        className={`bg-white rounded-xl border p-4 hover:shadow-sm transition-all group ${
                          isNext ? "border-blue-300 ring-1 ring-blue-200" :
                          done ? "border-green-200" : "border-gray-100"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 ${done ? "bg-green-100" : isNext ? "bg-blue-100" : "bg-gray-100"}`}>
                            {lesson.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm leading-tight">{lesson.title}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{lesson.duration}</div>
                          </div>
                          <div className="shrink-0">
                            {done ? (
                              <span className="text-green-500 text-sm">✓</span>
                            ) : isNext ? (
                              <span className="text-blue-500 text-xs font-semibold group-hover:translate-x-0.5 transition-transform block">→</span>
                            ) : (
                              <span className="text-gray-300 text-xs">○</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
