"use client"

import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
import type { QtypeStat, ErrorStat } from "./page"

// ─── Constants ────────────────────────────────────────────────────────────────
const Q_COLOR: Record<string, { bg: string; text: string; bar: string; border: string; ring: string }> = {
  q51: { bg: "bg-blue-50",   text: "text-blue-700",   bar: "bg-blue-500",   border: "border-blue-200", ring: "ring-blue-200" },
  q52: { bg: "bg-purple-50", text: "text-purple-700", bar: "bg-purple-500", border: "border-purple-200", ring: "ring-purple-200" },
  q53: { bg: "bg-orange-50", text: "text-orange-700", bar: "bg-orange-500", border: "border-orange-200", ring: "ring-orange-200" },
  q54: { bg: "bg-green-50",  text: "text-green-700",  bar: "bg-green-500",  border: "border-green-200", ring: "ring-green-200" },
}

const Q_HREF: Record<string, string> = {
  q51: "/practice/q51", q52: "/practice/q52",
  q53: "/practice/q53", q54: "/practice/q54",
}

const Q_MAX_SCORE: Record<string, number> = { q51: 10, q52: 10, q53: 30, q54: 50 }

const ERROR_COLOR: Record<string, string> = {
  grammar: "bg-red-400", vocabulary: "bg-yellow-400",
  style: "bg-blue-400", logic: "bg-orange-400", content: "bg-purple-400",
}

// ─── Mastery levels ────────────────────────────────────────────────────────────
function getMastery(avgPct: number, count: number) {
  if (count === 0) return { label: "Chưa luyện", icon: "○", color: "text-gray-400 bg-gray-100", nextPct: 40, nextLabel: "Mới bắt đầu" }
  if (avgPct < 40)  return { label: "Mới bắt đầu", icon: "🌱", color: "text-gray-600 bg-gray-100", nextPct: 40, nextLabel: "Đang tiến bộ" }
  if (avgPct < 60)  return { label: "Đang tiến bộ", icon: "📈", color: "text-yellow-700 bg-yellow-100", nextPct: 60, nextLabel: "Thành thạo" }
  if (avgPct < 80)  return { label: "Thành thạo", icon: "💪", color: "text-blue-700 bg-blue-100", nextPct: 80, nextLabel: "Xuất sắc" }
  return              { label: "Xuất sắc", icon: "⭐", color: "text-green-700 bg-green-100", nextPct: null, nextLabel: null }
}

// ─── TOPIK score estimation ─────────────────────────────────────────────────
function estimateTopik(qtypeStats: QtypeStat[]) {
  const statMap = Object.fromEntries(qtypeStats.map(s => [s.type, s]))
  let estimated = 0
  let coveredMax = 0
  for (const [qt, max] of Object.entries(Q_MAX_SCORE)) {
    const s = statMap[qt]
    if (s && s.count > 0) {
      estimated += (s.avgPct / 100) * max
      coveredMax += max
    }
  }
  if (coveredMax === 0) return null
  // Scale lên 100 nếu chưa có đủ 4 loại
  const scaledScore = coveredMax < 100
    ? Math.round((estimated / coveredMax) * 100)
    : Math.round(estimated)

  let level = ""
  let levelColor = ""
  let gap = ""
  if (scaledScore < 50)       { level = "Chưa đạt Level 3"; levelColor = "text-red-600";    gap = `Cần thêm ~${50 - scaledScore} điểm để đạt Level 3` }
  else if (scaledScore < 60)  { level = "Level 3";           levelColor = "text-orange-600"; gap = `Cần thêm ~${60 - scaledScore} điểm để đạt Level 4` }
  else if (scaledScore < 70)  { level = "Level 4";           levelColor = "text-yellow-600"; gap = `Cần thêm ~${70 - scaledScore} điểm để đạt Level 5` }
  else if (scaledScore < 80)  { level = "Level 5";           levelColor = "text-blue-600";   gap = `Cần thêm ~${80 - scaledScore} điểm để đạt Level 6` }
  else                        { level = "Level 6 🏆";        levelColor = "text-green-600";  gap = "Đạt chuẩn xuất sắc nhất!" }

  return { score: scaledScore, level, levelColor, gap, isPartial: coveredMax < 100 }
}

// ─── Streak message ─────────────────────────────────────────────────────────
function getStreakMessage(streak: number): { text: string; color: string } {
  if (streak === 0)  return { text: "Hôm nay chưa luyện — bắt đầu ngay để khởi động chuỗi! 🔥", color: "text-gray-500" }
  if (streak === 1)  return { text: "Ngày đầu tiên! Quay lại ngày mai để bắt đầu chuỗi 🌱", color: "text-blue-600" }
  if (streak < 4)    return { text: `🔥 ${streak} ngày liên tiếp — đà đang tốt, đừng để đứt!`, color: "text-orange-600" }
  if (streak < 8)    return { text: `🔥 ${streak} ngày! Bạn đang hình thành thói quen học tốt.`, color: "text-orange-600" }
  if (streak < 15)   return { text: `🏆 ${streak} ngày liên tiếp! Bạn đang trong top học viên chăm chỉ.`, color: "text-purple-600" }
  return               { text: `🌟 ${streak} ngày — xuất sắc! Kiên trì như này sẽ pass TOPIK thôi.`, color: "text-green-600" }
}

// ─── Mini sparkline ──────────────────────────────────────────────────────────
function MiniSparkline({ pcts, color }: { pcts: number[]; color: string }) {
  if (pcts.length < 2) return null
  const reversed = [...pcts].reverse()
  const max = Math.max(...reversed, 1)
  const w = 52, h = 22
  const pts = reversed.map((v, i) => {
    const x = (i / (reversed.length - 1)) * w
    const y = h - (v / max) * (h - 2) - 1
    return `${x},${y}`
  }).join(" ")
  return (
    <svg width={w} height={h} className="opacity-50">
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" className={color} />
    </svg>
  )
}

// ─── Skill card ──────────────────────────────────────────────────────────────
function SkillCard({ stat }: { stat: QtypeStat }) {
  const c = Q_COLOR[stat.type]
  const mastery = getMastery(stat.avgPct, stat.count)
  const isWeak = stat.count >= 2 && stat.avgPct < 60
  const pctColor = stat.avgPct >= 80 ? "text-green-600" : stat.avgPct >= 60 ? "text-yellow-600" : stat.avgPct > 0 ? "text-red-500" : "text-gray-300"
  const gapPct = mastery.nextPct ? mastery.nextPct - stat.avgPct : 0

  return (
    <Link href={Q_HREF[stat.type]}
      className={`block bg-white rounded-2xl border p-5 hover:shadow-md transition-all group ${isWeak ? "border-red-200 ring-1 ring-red-100" : "border-gray-100 hover:border-gray-200"}`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${c.bg} ${c.text}`}>
          {stat.type.toUpperCase()}
        </span>
        <div className="flex items-center gap-2">
          {stat.count >= 2 && <MiniSparkline pcts={stat.recentPcts} color={c.text} />}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${mastery.color}`}>
            {mastery.icon} {mastery.label}
          </span>
        </div>
      </div>

      {/* Label */}
      <p className="text-sm font-semibold text-gray-700 mb-3">{stat.label}</p>

      {stat.count > 0 ? (
        <>
          {/* Score + count */}
          <div className="flex items-end justify-between mb-2">
            <span className={`text-3xl font-extrabold leading-none ${pctColor}`}>{stat.avgPct}%</span>
            <span className="text-xs text-gray-400">{stat.count} bài đã làm</span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full transition-all ${c.bar}`} style={{ width: `${stat.avgPct}%` }} />
          </div>

          {/* Gap to next level */}
          {mastery.nextPct && gapPct > 0 && (
            <p className="text-[11px] text-gray-400 mt-1">
              Còn <span className="font-bold text-gray-600">{gapPct}%</span> nữa đạt{" "}
              <span className="font-semibold">{mastery.nextLabel}</span>
            </p>
          )}
          {!mastery.nextPct && (
            <p className="text-[11px] text-green-600 font-semibold mt-1">Đã đạt mức xuất sắc! ✓</p>
          )}
          {isWeak && (
            <p className="text-[11px] text-red-500 font-semibold mt-1">⚠️ Cần cải thiện (dưới 60%)</p>
          )}
        </>
      ) : (
        <div className="text-center py-3">
          <p className="text-xs text-gray-400 mb-2">Chưa có bài nào</p>
          <span className="text-xs font-bold text-blue-600 group-hover:underline">Bắt đầu ngay →</span>
        </div>
      )}
    </Link>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function SkillDashboardClient({
  profile,
  qtypeStats,
  topErrors,
  weakest,
  totalSubmissions,
}: {
  profile: { display_name: string; study_streak: number; target_level: number; total_essays_written: number }
  qtypeStats: QtypeStat[]
  topErrors: ErrorStat[]
  weakest: QtypeStat | null
  totalSubmissions: number
}) {
  const topik = estimateTopik(qtypeStats)
  const streakMsg = getStreakMessage(profile.study_streak)
  const maxErrorCount = topErrors[0]?.count ?? 1

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-56 flex-1 p-8">

        {/* ── 1. Header ── */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
            Xin chào, {profile.display_name}! 👋
          </h1>
          <p className={`text-sm font-medium ${streakMsg.color}`}>{streakMsg.text}</p>
        </div>

        {/* ── 2. Top stats row ── */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="text-xl mb-0.5">🔥</div>
            <div className="text-2xl font-extrabold text-orange-500">{profile.study_streak}</div>
            <div className="text-xs text-gray-400">Ngày streak</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="text-xl mb-0.5">✍️</div>
            <div className="text-2xl font-extrabold text-blue-600">{totalSubmissions}</div>
            <div className="text-xs text-gray-400">Bài đã nộp</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <div className="text-xl mb-0.5">🎯</div>
            <div className="text-2xl font-extrabold text-purple-600">Level {profile.target_level}</div>
            <div className="text-xs text-gray-400">Mục tiêu TOPIK</div>
          </div>
          {/* TOPIK estimated score */}
          {topik ? (
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-center text-white">
              <div className="text-xs font-semibold text-blue-200 mb-0.5">Điểm TOPIK ước tính</div>
              <div className="text-2xl font-extrabold">{topik.score}<span className="text-sm font-normal text-blue-200">/100</span></div>
              <div className={`text-xs font-bold mt-0.5 ${topik.score >= 70 ? "text-green-300" : topik.score >= 60 ? "text-yellow-300" : "text-red-300"}`}>
                {topik.level}
              </div>
              {topik.isPartial && <div className="text-[9px] text-blue-300 mt-0.5">*ước tính từ {qtypeStats.filter(s => s.count > 0).length} loại câu</div>}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-4 text-center">
              <div className="text-xl mb-0.5">📊</div>
              <div className="text-sm font-bold text-gray-500">Điểm TOPIK</div>
              <div className="text-xs text-gray-400">Luyện thêm để xem</div>
            </div>
          )}
        </div>

        {/* ── 3. TOPIK gap banner (if relevant) ── */}
        {topik && topik.score < 80 && (
          <div className={`rounded-2xl px-5 py-3 mb-6 flex items-center gap-3 border ${
            topik.score < 60 ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"
          }`}>
            <span className="text-lg">📌</span>
            <p className={`text-sm font-medium ${topik.score < 60 ? "text-red-700" : "text-blue-700"}`}>
              {topik.gap}
              {topik.isPartial && <span className="text-xs font-normal ml-1">(hãy luyện đủ 4 loại để xem ước tính chính xác hơn)</span>}
            </p>
          </div>
        )}

        {/* ── 4. 2-column layout: skill grid + sidebar ── */}
        <div className="grid grid-cols-3 gap-6">

          {/* Left: skill cards + errors */}
          <div className="col-span-2 space-y-6">

            {/* Skill grid */}
            <div>
              <h2 className="font-bold text-gray-900 mb-3">📊 Kỹ năng của bạn</h2>
              <div className="grid grid-cols-2 gap-3">
                {qtypeStats.map(stat => <SkillCard key={stat.type} stat={stat} />)}
              </div>
            </div>

            {/* Top errors */}
            {topErrors.length > 0 && (
              <div>
                <h2 className="font-bold text-gray-900 mb-3">🔍 Lỗi hay gặp nhất</h2>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                  {topErrors.map((err, i) => (
                    <div key={err.type}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${ERROR_COLOR[err.type] ?? "bg-gray-400"}`} />
                          <span className="text-sm font-semibold text-gray-700">{err.label}</span>
                          <span className="text-xs text-gray-400">
                            ({err.qtypes.map(q => q.toUpperCase()).join(", ")})
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-600">{err.count} lần</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden ml-6">
                        <div
                          className={`h-full rounded-full ${ERROR_COLOR[err.type] ?? "bg-gray-400"}`}
                          style={{ width: `${Math.round((err.count / maxErrorCount) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: học hôm nay + quick actions */}
          <div className="space-y-4">

            {/* Học hôm nay */}
            <div>
              <h2 className="font-bold text-gray-900 mb-3">🎯 Học hôm nay</h2>
              {weakest ? (
                <div className={`rounded-2xl p-5 border ${weakest.avgPct < 60 ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"}`}>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Ưu tiên luyện</p>
                  <p className={`font-bold text-base mb-1 ${weakest.avgPct < 60 ? "text-red-800" : "text-orange-800"}`}>
                    {weakest.type.toUpperCase()} — {weakest.label}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-2xl font-extrabold ${weakest.avgPct < 60 ? "text-red-600" : "text-orange-600"}`}>
                      {weakest.avgPct}%
                    </span>
                    <span className="text-xs text-gray-500">avg hiện tại</span>
                  </div>
                  <p className={`text-xs leading-relaxed mb-4 ${weakest.avgPct < 60 ? "text-red-700" : "text-orange-700"}`}>
                    {weakest.avgPct < 60
                      ? `Dưới mức đạt. Cần luyện thêm để tránh mất điểm ở đây trong bài thi thật.`
                      : `Còn ${80 - weakest.avgPct}% nữa là xuất sắc. Luyện thêm vài bài để ổn định.`
                    }
                  </p>
                  <Link
                    href={Q_HREF[weakest.type]}
                    className={`block text-center text-white font-bold text-sm px-4 py-3 rounded-xl transition-colors ${
                      weakest.avgPct < 60
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    Luyện {weakest.type.toUpperCase()} ngay →
                  </Link>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-2">Bắt đầu nào</p>
                  <p className="font-bold text-blue-900 mb-2">Chưa có đủ data</p>
                  <p className="text-xs text-blue-700 leading-relaxed mb-4">
                    {totalSubmissions === 0
                      ? "Bắt đầu với Q51 — câu ngắn nhất, luyện nhanh nhất."
                      : "Luyện ít nhất 2 bài mỗi loại để thấy phân tích."}
                  </p>
                  <Link href="/practice/q51"
                    className="block text-center bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm px-4 py-3 rounded-xl transition-colors">
                    Bắt đầu Q51 →
                  </Link>
                </div>
              )}
            </div>

            {/* Quick links */}
            <div>
              <h2 className="font-bold text-gray-900 mb-3">⚡ Truy cập nhanh</h2>
              <div className="space-y-2">
                {([
                  { href: "/practice/q51", icon: "✉️", label: "Luyện Q51 — Viết thư", sub: "10 điểm · ~10 phút" },
                  { href: "/practice/q53", icon: "📊", label: "Luyện Q53 — Phân tích", sub: "30 điểm · ~20 phút" },
                  { href: "/practice/q54", icon: "📝", label: "Luyện Q54 — Bài luận", sub: "50 điểm · ~45 phút" },
                  { href: "/mock-exam",    icon: "⏱️", label: "Thi thử toàn phần", sub: "100 điểm · 50 phút" },
                  { href: "/review",       icon: "🃏", label: "Ôn lỗi flashcard", sub: "Ôn lại lỗi đã mắc" },
                ] as const).map(item => (
                  <Link key={item.href} href={item.href}
                    className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 py-2.5 hover:border-blue-200 hover:shadow-sm transition-all group">
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 group-hover:text-blue-700">{item.label}</p>
                      <p className="text-[10px] text-gray-400">{item.sub}</p>
                    </div>
                    <span className="text-gray-300 group-hover:text-blue-400 text-xs">→</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
