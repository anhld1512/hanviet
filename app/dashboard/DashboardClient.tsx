"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import type { EpsLesson } from "@/lib/eps-lesson"
import type { User } from "@supabase/supabase-js"

const INDUSTRIES = ["Sản xuất chế tạo", "Xây dựng", "Nông nghiệp", "Ngư nghiệp"] as const
const PASSING: Record<string, number> = {
  "Sản xuất chế tạo": 110,
  "Xây dựng": 80,
  "Nông nghiệp": 80,
  "Ngư nghiệp": 60,
}

const CATEGORY_LABELS: Record<string, string> = {
  daily_life: "Sinh hoạt hàng ngày",
  workplace: "Tại nơi làm việc",
  safety: "An toàn lao động",
  health: "Sức khỏe",
  rights: "Quyền lợi",
}

const CATEGORY_EMOJI: Record<string, string> = {
  daily_life: "🏠",
  workplace: "🏭",
  safety: "⛑️",
  health: "🏥",
  rights: "📋",
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export default function DashboardClient({ lessons }: { lessons: EpsLesson[] }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [industry, setIndustry] = useState("Sản xuất chế tạo")
  const [examDate, setExamDate] = useState("")
  const [editingDate, setEditingDate] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("eps_industry")
    if (saved) setIndustry(saved)
    const savedDate = localStorage.getItem("eps_exam_date")
    if (savedDate) setExamDate(savedDate)
  }, [])

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

  function saveIndustry(val: string) {
    setIndustry(val)
    localStorage.setItem("eps_industry", val)
  }

  function saveExamDate(val: string) {
    setExamDate(val)
    localStorage.setItem("eps_exam_date", val)
    setEditingDate(false)
  }

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
  const estimatedScore = Math.round((completedCount / totalLessons) * 160) + 20
  const passingScore = PASSING[industry]
  const onTrack = estimatedScore >= passingScore

  const nextLesson = lessons.find((l) => !completedLessons.includes(l.lesson_number))
  const daysLeft = examDate ? daysUntil(examDate) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇰🇷</span>
            <span className="font-bold text-gray-900">HanViet</span>
            <span className="text-xs text-blue-500 font-semibold ml-0.5">EPS</span>
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

        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Chào {firstName}! 👋</h1>
          <p className="text-gray-500 text-sm">
            {completedCount === 0
              ? "Hãy bắt đầu ôn thi EPS-TOPIK từ bài học đầu tiên."
              : `Đã hoàn thành ${completedCount}/${totalLessons} bài. Tiếp tục thôi!`}
          </p>
        </div>

        {/* Industry + Exam date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="text-xs font-semibold text-gray-400 mb-2">NGÀNH ĐỀ XUẤT SANG HÀN</div>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => saveIndustry(ind)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    industry === ind ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {ind} ({PASSING[ind]}+)
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="text-xs font-semibold text-gray-400 mb-2">NGÀY THI DỰ KIẾN</div>
            {examDate && !editingDate ? (
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-2xl font-extrabold ${daysLeft !== null && daysLeft > 0 ? "text-blue-500" : "text-red-500"}`}>
                    {daysLeft !== null && daysLeft > 0 ? `${daysLeft} ngày` : daysLeft === 0 ? "Hôm nay!" : "Đã qua"}
                  </span>
                  <div className="text-xs text-gray-400 mt-0.5">còn lại ({examDate})</div>
                </div>
                <button onClick={() => setEditingDate(true)} className="text-xs text-blue-500 hover:underline">Sửa</button>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  defaultValue={examDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => e.target.value && saveExamDate(e.target.value)}
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400"
                />
                {editingDate && (
                  <button onClick={() => setEditingDate(false)} className="text-xs text-gray-400 shrink-0">Hủy</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Readiness bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold text-gray-900">Độ sẵn sàng thi</div>
              <div className="text-xs text-gray-400 mt-0.5">
                Ước tính cho ngành <span className="font-medium text-gray-600">{industry}</span> (điểm đậu {passingScore}/200)
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-extrabold ${onTrack ? "text-green-500" : "text-orange-500"}`}>
                {estimatedScore}<span className="text-sm text-gray-300">/200</span>
              </div>
              <div className={`text-xs font-medium ${onTrack ? "text-green-500" : "text-orange-500"}`}>
                {onTrack ? "Ước tính đủ điểm" : `Cần thêm ${passingScore - estimatedScore} điểm`}
              </div>
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${onTrack ? "bg-green-500" : "bg-orange-400"}`}
              style={{ width: `${Math.min((estimatedScore / 200) * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-gray-400">{progressPercent}% lộ trình hoàn thành</div>
            <div className="text-xs text-gray-400">Điểm chuẩn: {passingScore}/200</div>
          </div>
        </div>

        {/* Next lesson */}
        {nextLesson && (
          <Link
            href={`/lessons/${nextLesson.lesson_number}`}
            className="flex items-center gap-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl p-5 mb-6 transition-colors group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl shrink-0">
              {CATEGORY_EMOJI[nextLesson.category] ?? "📖"}
            </div>
            <div className="flex-1">
              <div className="text-xs text-blue-100 mb-0.5">
                {completedCount === 0 ? "Bài học đầu tiên" : "Tiếp tục học"}
              </div>
              <div className="font-bold text-base">{nextLesson.title_vi}</div>
              <div className="text-blue-100 text-sm">{nextLesson.title_kr} · Bài {nextLesson.lesson_number}</div>
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
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-xl font-extrabold text-gray-900">{progressPercent}%</div>
            <div className="text-xs text-gray-500 mt-0.5">Tiến độ</div>
          </div>
        </div>

        {/* Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/eps-test"
            className="bg-red-500 hover:bg-red-600 text-white rounded-2xl p-5 flex items-center gap-4 transition-colors group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl shrink-0">🎯</div>
            <div>
              <div className="font-bold text-base">Thi thử EPS</div>
              <div className="text-red-100 text-sm mt-0.5">50 câu · 70 phút</div>
            </div>
            <span className="ml-auto text-white/60 group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
          <Link
            href="/flashcards"
            className="bg-green-500 hover:bg-green-600 text-white rounded-2xl p-5 flex items-center gap-4 transition-colors group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl shrink-0">🃏</div>
            <div>
              <div className="font-bold text-base">Flashcard</div>
              <div className="text-green-100 text-sm mt-0.5">Ôn từ vựng hay thi</div>
            </div>
            <span className="ml-auto text-white/60 group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
          <Link
            href="/topik"
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-2xl p-5 flex items-center gap-4 transition-colors group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl shrink-0">📝</div>
            <div>
              <div className="font-bold text-base">Luyện đề</div>
              <div className="text-purple-100 text-sm mt-0.5">Theo dạng câu</div>
            </div>
            <span className="ml-auto text-white/60 group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* Lesson roadmap */}
        <div>
          <h2 className="font-bold text-gray-900 text-lg mb-4">Lộ trình 60 bài học EPS</h2>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-5 text-xs text-amber-700">
            Hiện có 10 bài Quyển 1. Các quyển tiếp theo sẽ cập nhật liên tục.
          </div>

          <div className="space-y-3">
            {lessons.map((lesson) => {
              const done = completedLessons.includes(lesson.lesson_number)
              const isNext = nextLesson?.lesson_number === lesson.lesson_number
              const locked = !lesson.is_free

              return (
                <Link
                  key={lesson.lesson_number}
                  href={`/lessons/${lesson.lesson_number}`}
                  className={`flex items-center gap-4 bg-white rounded-xl border p-4 hover:shadow-sm transition-all group ${
                    isNext ? "border-blue-300 ring-1 ring-blue-200"
                    : done ? "border-green-200"
                    : "border-gray-100"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                    done ? "bg-green-100"
                    : isNext ? "bg-blue-100"
                    : locked ? "bg-gray-100"
                    : "bg-blue-50"
                  }`}>
                    {locked && !done ? "🔒" : (CATEGORY_EMOJI[lesson.category] ?? "📖")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-gray-400 shrink-0">Bài {lesson.lesson_number}</span>
                      {lesson.is_free && (
                        <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-medium">Miễn phí</span>
                      )}
                      {isNext && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">Tiếp theo</span>
                      )}
                    </div>
                    <div className="font-medium text-gray-900 text-sm">{lesson.title_vi}</div>
                    <div className="text-xs text-gray-400">{lesson.title_kr} · {CATEGORY_LABELS[lesson.category] ?? lesson.category}</div>
                  </div>
                  <div className="shrink-0">
                    {done ? (
                      <span className="text-green-500 text-sm font-bold">✓</span>
                    ) : isNext ? (
                      <span className="text-blue-500 text-sm group-hover:translate-x-0.5 transition-transform block">→</span>
                    ) : (
                      <span className="text-gray-200 text-sm">○</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
