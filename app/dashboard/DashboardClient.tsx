"use client"

import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

type Profile = {
  display_name: string
  avatar_url: string | null
  target_level: number
  learning_path: string
  study_streak: number
  total_essays_written: number
  subscription_tier: string
  writing_experience: string
}

const PATH_LABEL: Record<string, string> = {
  A: "Nền tảng từ đầu",
  B: "Tăng tốc Q53-Q54",
  C: "Sửa lỗi có hệ thống",
  D: "Nâng cao",
  E: "Chau chuốt Q54",
}

const STAGE_MAP = [
  { key: "Q51", label: "Q51 Master", desc: "Điền câu vào thực dụng văn", color: "bg-green-100 text-green-700", route: "/practice/q51" },
  { key: "Q52", label: "Q52 Master", desc: "Điền câu vào đoạn văn nghị luận", color: "bg-blue-100 text-blue-700", route: "/practice/q52" },
  { key: "Q53", label: "Q53 Deep Dive", desc: "Phân tích biểu đồ 200-300 chữ", color: "bg-purple-100 text-purple-700", route: "/practice/q53" },
  { key: "Q54", label: "Q54 Intensive", desc: "Viết luận nghị luận 600-700 chữ", color: "bg-orange-100 text-orange-700", route: "/practice/q54" },
]

export default function DashboardClient({ profile, user }: { profile: Profile; user: User }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const firstName = profile.display_name?.split(" ").pop() || "bạn"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">✍️</span>
            <span className="font-extrabold text-gray-900 text-sm">HanViet</span>
            <span className="text-xs text-gray-400 hidden sm:block">Writing Coach</span>
          </div>
          <div className="flex items-center gap-3">
            {profile.subscription_tier === "free" && (
              <Link
                href="/pricing"
                className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold px-3 py-1.5 rounded-full"
              >
                Nâng Pro
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Greeting */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
          <p className="text-blue-100 text-sm mb-1">Xin chào,</p>
          <h1 className="text-xl font-extrabold mb-3">{firstName} 👋</h1>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold">{profile.study_streak}</div>
              <div className="text-blue-200 text-xs">ngày streak</div>
            </div>
            <div className="w-px h-8 bg-blue-400" />
            <div className="text-center">
              <div className="text-2xl font-extrabold">{profile.total_essays_written}</div>
              <div className="text-blue-200 text-xs">bài đã viết</div>
            </div>
            <div className="w-px h-8 bg-blue-400" />
            <div className="text-center">
              <div className="text-2xl font-extrabold">{profile.target_level}</div>
              <div className="text-blue-200 text-xs">cấp mục tiêu</div>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-gray-900">Lộ trình của bạn</h2>
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">
              Path {profile.learning_path}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-4">{PATH_LABEL[profile.learning_path] || "Cá nhân hóa"}</p>
          <Link
            href="/learning-path"
            className="text-sm text-blue-500 font-medium hover:text-blue-600"
          >
            Xem lộ trình chi tiết →
          </Link>
        </div>

        {/* Quick Practice */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">Luyện viết ngay</h2>
          <div className="grid grid-cols-2 gap-3">
            {STAGE_MAP.map((s) => (
              <Link
                key={s.key}
                href={s.route}
                className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.color}`}>
                  {s.key}
                </span>
                <p className="font-bold text-gray-900 mt-2 text-sm">{s.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Score Estimate Placeholder */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-3">Điểm Writing ước tính</h2>
          {profile.total_essays_written === 0 ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-gray-500 text-sm">Chưa có dữ liệu</p>
              <p className="text-gray-400 text-xs mt-1">Viết bài đầu tiên để xem điểm ước tính</p>
              <Link
                href="/practice/q51"
                className="inline-block mt-3 text-sm bg-blue-500 text-white font-bold px-4 py-2 rounded-xl"
              >
                Viết thử Q51 →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {["Q51", "Q52", "Q53", "Q54"].map((q) => (
                <div key={q} className="text-center bg-gray-50 rounded-xl py-3">
                  <div className="text-lg font-extrabold text-gray-300">?</div>
                  <div className="text-xs text-gray-400">{q}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-3">
          <Link href="/templates" className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:border-blue-200 transition-all">
            <div className="text-2xl mb-1">📋</div>
            <div className="text-xs font-semibold text-gray-700">Templates</div>
          </Link>
          <Link href="/review" className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:border-blue-200 transition-all">
            <div className="text-2xl mb-1">🔍</div>
            <div className="text-xs font-semibold text-gray-700">Ôn lỗi</div>
          </Link>
          <Link href="/learning-path" className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:border-blue-200 transition-all">
            <div className="text-2xl mb-1">🗺️</div>
            <div className="text-xs font-semibold text-gray-700">Lộ trình</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
