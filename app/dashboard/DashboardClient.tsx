"use client"

import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
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
  A: "Nền tảng từ đầu — Template Q51 đến Q54",
  B: "Tăng tốc — Focus Q53 và Q54 chuyên sâu",
  C: "Sửa lỗi có hệ thống — Luyện từng tiêu chí yếu",
  D: "Nâng cao — Template nâng cao, từ vựng học thuật",
  E: "Chau chuốt — Chỉ luyện Q54, nhắm 45-50/50",
}

const QUICK_PRACTICE = [
  {
    key: "Q51",
    label: "Q51 — Thực dụng văn",
    desc: "Điền câu vào thư/thông báo",
    points: "10 điểm",
    time: "3-5 phút",
    color: "bg-green-50 border-green-100",
    badge: "bg-green-100 text-green-700",
    route: "/practice/q51",
  },
  {
    key: "Q52",
    label: "Q52 — Nghị luận ngắn",
    desc: "Điền câu vào đoạn văn",
    points: "10 điểm",
    time: "5-7 phút",
    color: "bg-blue-50 border-blue-100",
    badge: "bg-blue-100 text-blue-700",
    route: "/practice/q52",
  },
  {
    key: "Q53",
    label: "Q53 — Phân tích biểu đồ",
    desc: "Viết 200-300 chữ",
    points: "30 điểm",
    time: "10-12 phút",
    color: "bg-purple-50 border-purple-100",
    badge: "bg-purple-100 text-purple-700",
    route: "/practice/q53",
  },
  {
    key: "Q54",
    label: "Q54 — Luận nghị luận",
    desc: "Viết 600-700 chữ",
    points: "50 điểm",
    time: "28-35 phút",
    color: "bg-orange-50 border-orange-100",
    badge: "bg-orange-100 text-orange-700",
    route: "/practice/q54",
  },
]

export default function DashboardClient({ profile, user }: { profile: Profile; user: User }) {
  const firstName = profile.display_name?.split(" ").pop() || "bạn"
  const totalWritingScore = 100
  const progressPercent = profile.total_essays_written > 0 ? 15 : 0

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar tier={profile.subscription_tier} />

      {/* Main content — offset by sidebar width */}
      <main className="ml-56 flex-1 min-h-screen">
        <div className="p-8 max-w-5xl">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Xin chào, {firstName} 👋
            </h1>
            <p className="text-gray-500 mt-1">
              Hôm nay luyện viết câu nào?
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Ngày streak", value: profile.study_streak, icon: "🔥", color: "text-orange-500" },
              { label: "Bài đã viết", value: profile.total_essays_written, icon: "📝", color: "text-blue-500" },
              { label: "Cấp mục tiêu", value: profile.target_level, icon: "🎯", color: "text-purple-500" },
              { label: "Điểm Writing", value: profile.total_essays_written > 0 ? "?" : "0", icon: "📊", color: "text-green-500" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className={`text-2xl mb-1`}>{s.icon}</div>
                <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Lộ trình + Writing score */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* Learning path */}
            <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-900 text-lg">Lộ trình của bạn</h2>
                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full">
                  Path {profile.learning_path}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                {PATH_LABEL[profile.learning_path]}
              </p>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Tiến độ tổng thể</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <Link
                href="/learning-path"
                className="inline-flex items-center gap-1 text-sm text-blue-500 font-medium hover:text-blue-600 mt-3"
              >
                Xem lộ trình chi tiết →
              </Link>
            </div>

            {/* Writing score estimate */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 text-base mb-4">Điểm Writing ước tính</h2>
              {profile.total_essays_written === 0 ? (
                <div className="text-center py-4">
                  <div className="text-5xl font-extrabold text-gray-100 mb-1">?</div>
                  <div className="text-xs text-gray-400 leading-relaxed">
                    Viết bài đầu tiên để xem điểm ước tính
                  </div>
                  <Link
                    href="/practice/q51"
                    className="inline-block mt-4 text-xs bg-blue-500 text-white font-bold px-4 py-2 rounded-xl"
                  >
                    Viết thử ngay →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    { q: "Q51", max: 10 },
                    { q: "Q52", max: 10 },
                    { q: "Q53", max: 30 },
                    { q: "Q54", max: 50 },
                  ].map((q) => (
                    <div key={q.q} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-6">{q.q}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full" />
                      <span className="text-xs text-gray-300">?/{q.max}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick practice */}
          <div className="mb-8">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Luyện viết ngay</h2>
            <div className="grid grid-cols-2 gap-4">
              {QUICK_PRACTICE.map((p) => (
                <Link
                  key={p.key}
                  href={p.route}
                  className={`bg-white rounded-2xl border ${p.color} p-5 hover:shadow-md transition-all group`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.badge}`}>
                      {p.key}
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">{p.points}</div>
                      <div className="text-xs text-gray-400">{p.time}</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">{p.label}</h3>
                  <p className="text-sm text-gray-500">{p.desc}</p>
                  <div className="mt-4 text-sm text-blue-500 font-medium group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Bắt đầu →
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Shortcuts */}
          <div className="grid grid-cols-3 gap-4">
            <Link href="/templates" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-all flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">📋</div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">Templates</div>
                <div className="text-xs text-gray-400">Q51-54 đầy đủ</div>
              </div>
            </Link>
            <Link href="/review" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-all flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-xl">🔍</div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">Ôn lỗi</div>
                <div className="text-xs text-gray-400">Top lỗi hay mắc</div>
              </div>
            </Link>
            <Link href="/learning-path" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-all flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-xl">🗺️</div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">Lộ trình</div>
                <div className="text-xs text-gray-400">4 giai đoạn</div>
              </div>
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}
