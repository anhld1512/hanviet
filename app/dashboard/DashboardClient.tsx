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
    color: "bg-blue-50 border-blue-100",
    badge: "bg-blue-100 text-blue-700",
    route: "/practice",
  },
  {
    key: "Q52",
    label: "Q52 — Nghị luận ngắn",
    desc: "Điền câu vào đoạn văn",
    points: "10 điểm",
    time: "5-7 phút",
    color: "bg-blue-50 border-blue-100",
    badge: "bg-blue-100 text-blue-700",
    route: "/practice",
  },
  {
    key: "Q53",
    label: "Q53 — Phân tích biểu đồ",
    desc: "Viết 200-300 chữ",
    points: "30 điểm",
    time: "10-12 phút",
    color: "bg-blue-50 border-blue-100",
    badge: "bg-blue-100 text-blue-700",
    route: "/practice",
  },
  {
    key: "Q54",
    label: "Q54 — Luận nghị luận",
    desc: "Viết 600-700 chữ",
    points: "50 điểm",
    time: "28-35 phút",
    color: "bg-gray-50 border-gray-100",
    badge: "bg-gray-100 text-blue-700",
    route: "/practice",
  },
]

type BestScores = Record<string, { score: number; max: number }>

export default function DashboardClient({ profile, user, bestScores = {} }: { profile: Profile; user: User; bestScores?: BestScores }) {
  const firstName = profile.display_name?.split(" ").pop() || "bạn"

  // Tổng điểm writing ước tính: tổng best score / tổng max (100)
  const QTYPES = [
    { q: "q51", max: 10 }, { q: "q52", max: 10 }, { q: "q53", max: 30 }, { q: "q54", max: 50 },
  ]
  const coveredTypes = QTYPES.filter((qt) => bestScores[qt.q])
  const totalBest = coveredTypes.reduce((sum, qt) => sum + (bestScores[qt.q]?.score ?? 0), 0)
  const totalMax = coveredTypes.reduce((sum, qt) => sum + qt.max, 0)
  const estimatedScore = totalMax > 0 ? Math.round((totalBest / totalMax) * 100) : null

  // Tiến độ: dựa trên số bài đã viết (target 30 bài = "thành thạo")
  const PROGRESS_TARGET = 30
  const progressPercent = Math.min(Math.round((profile.total_essays_written / PROGRESS_TARGET) * 100), 100)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main content */}
      <main className="ml-56 flex-1 min-h-screen p-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Xin chào, {firstName} 👋
            </h1>
            <p className="text-gray-500 mt-1">Hôm nay luyện viết câu nào?</p>
          </div>
          <Link
            href="/practice"
            className="text-sm bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            Luyện viết ngay →
          </Link>
        </div>

        {/* Stats row — 4 cột đều nhau */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Ngày streak", value: profile.study_streak, icon: "🔥", color: "text-blue-500" },
            { label: "Bài đã viết", value: profile.total_essays_written, icon: "📝", color: "text-blue-500" },
            { label: "Cấp mục tiêu", value: profile.target_level, icon: "🎯", color: "text-blue-500" },
            { label: "Điểm Writing", value: estimatedScore !== null ? `${estimatedScore}%` : "0", icon: "📊", color: "text-blue-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
              <div className="text-3xl">{s.icon}</div>
              <div>
                <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Lộ trình (2/3) + Điểm ước tính (1/3) */}
        <div className="grid grid-cols-3 gap-4 mb-6">
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
              className="inline-flex items-center gap-1 text-sm text-blue-500 font-medium hover:text-blue-600 mt-4"
            >
              Xem lộ trình chi tiết →
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 text-base mb-4">Điểm Writing ước tính</h2>
            {coveredTypes.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-6xl font-extrabold text-gray-100 mb-2">?</div>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Viết bài đầu tiên để xem điểm ước tính
                </p>
                <Link
                  href="/practice/q51"
                  className="inline-block text-xs bg-blue-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Viết thử ngay →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {QTYPES.map(({ q, max }) => {
                  const best = bestScores[q]
                  const pct = best ? Math.round((best.score / best.max) * 100) : null
                  return (
                    <div key={q} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-500 w-8">{q.toUpperCase()}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        {pct !== null && (
                          <div
                            className={`h-full rounded-full ${pct >= 80 ? "bg-blue-400" : pct >= 60 ? "bg-gray-400" : "bg-blue-400"}`}
                            style={{ width: `${pct}%` }}
                          />
                        )}
                      </div>
                      <span className={`text-xs font-semibold w-12 text-right ${pct === null ? "text-gray-300" : pct >= 80 ? "text-blue-600" : pct >= 60 ? "text-gray-600" : "text-blue-500"}`}>
                        {best ? `${best.score}/${best.max}` : `—/${max}`}
                      </span>
                    </div>
                  )
                })}
                {estimatedScore !== null && (
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Trung bình tổng</span>
                    <span className={`text-sm font-extrabold ${estimatedScore >= 80 ? "text-blue-600" : estimatedScore >= 60 ? "text-gray-600" : "text-blue-500"}`}>
                      {estimatedScore}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Row 3: 4 thẻ luyện viết + 3 shortcuts — cùng 1 row */}
        <div className="grid grid-cols-7 gap-4 mb-6">
          {/* 4 thẻ Q51–Q54 chiếm 4/7 */}
          <div className="col-span-4">
            <h2 className="font-bold text-gray-900 text-lg mb-3">Luyện viết ngay</h2>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_PRACTICE.map((p) => (
                <Link
                  key={p.key}
                  href={p.route}
                  className={`bg-white rounded-2xl border ${p.color} p-4 hover:shadow-md transition-all group`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.badge}`}>
                      {p.key}
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">{p.points}</div>
                      <div className="text-xs text-gray-400">{p.time}</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-0.5">{p.label}</h3>
                  <p className="text-xs text-gray-500">{p.desc}</p>
                  <div className="mt-3 text-xs text-blue-500 font-medium group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Bắt đầu →
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 3 shortcuts chiếm 3/7 */}
          <div className="col-span-3">
            <h2 className="font-bold text-gray-900 text-lg mb-3">Truy cập nhanh</h2>
            <div className="flex flex-col gap-3">
              <Link href="/templates" className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-all flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl shrink-0">📋</div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Templates</div>
                  <div className="text-xs text-gray-400">Mẫu câu Q51–Q54 đầy đủ</div>
                </div>
              </Link>
              <Link href="/review" className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-all flex items-center gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-xl shrink-0">🔍</div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Ôn lỗi</div>
                  <div className="text-xs text-gray-400">Những lỗi hay mắc phải</div>
                </div>
              </Link>
              <Link href="/learning-path" className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-all flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl shrink-0">🗺️</div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Lộ trình</div>
                  <div className="text-xs text-gray-400">4 giai đoạn luyện tập</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
