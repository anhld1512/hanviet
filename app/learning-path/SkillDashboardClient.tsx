"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
import BottomNav from "@/app/components/BottomNav"
import { Flame } from "lucide-react"
import type { QtypeStat } from "./page"

const Q_META: Record<string, { icon: string; href: string; accent: string; bg: string; bar: string }> = {
  q51: { icon: "✉", href: "/practice/q51", accent: "text-blue-600",    bg: "bg-blue-50 border-blue-100",      bar: "bg-blue-400" },
  q52: { icon: "✏", href: "/practice/q52", accent: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", bar: "bg-emerald-400" },
  q53: { icon: "↗", href: "/practice/q53", accent: "text-orange-500",  bg: "bg-orange-50 border-orange-100",   bar: "bg-orange-400" },
  q54: { icon: "§", href: "/practice/q54", accent: "text-pink-600",    bg: "bg-pink-50 border-pink-100",       bar: "bg-pink-400" },
}

// Import Lucide icons for Q cards
import { Mail, Scale, BarChart2, BookOpen } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const Q_ICON: Record<string, LucideIcon> = {
  q51: Mail, q52: Scale, q53: BarChart2, q54: BookOpen,
}

const Q_LABEL: Record<string, string> = {
  q51: "Viết thư", q52: "Đoạn văn", q53: "Phân tích biểu đồ", q54: "Bài luận",
}

function getMastery(avgPct: number, count: number) {
  if (count === 0) return { label: "Chưa luyện", color: "text-[#AEAEB2]" }
  if (avgPct < 40)  return { label: "Mới bắt đầu", color: "text-[#6E6E73]" }
  if (avgPct < 60)  return { label: "Tiến bộ",    color: "text-[#6E6E73]" }
  if (avgPct < 80)  return { label: "Thành thạo", color: "text-[#1D1D1F]" }
  return              { label: "Xuất sắc",   color: "text-[#0066CC]" }
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Buổi sáng"
  if (h < 18) return "Buổi chiều"
  return "Buổi tối"
}

function getMotivation(streak: number, total: number): string {
  if (total === 0)  return "Làm bài đầu tiên để bắt đầu hành trình TOPIK của bạn."
  if (streak === 0) return "Hôm nay chưa luyện — một bài nhỏ thôi cũng tạo ra sự khác biệt."
  if (streak === 1) return "Ngày đầu của chuỗi. Quay lại ngày mai để giữ đà nhé!"
  if (streak < 5)   return `${streak} ngày liên tiếp — đà đang tốt, đừng để đứt!`
  if (streak < 14)  return `${streak} ngày! Bạn đang hình thành thói quen học tốt.`
  return              `${streak} ngày liên tiếp — kiên trì như này sẽ pass TOPIK thôi.`
}

const TIPS = [
  { tag: "Ngữ pháp", pattern: "-(으)ㄹ 뿐만 아니라", meaning: "Không chỉ... mà còn...", example: "환경 문제는 개인의 문제일 뿐만 아니라 사회 전체의 문제이다.", vi: "Vấn đề môi trường không chỉ là vấn đề cá nhân mà còn là vấn đề của toàn xã hội.", apply: "Dùng trong Q54 khi mở rộng luận điểm — nêu 2 chiều tác động cùng lúc." },
  { tag: "Từ vựng", pattern: "에 따르면 / 에 의하면", meaning: "Theo (nguồn trích dẫn)", example: "연구 결과에 따르면 독서량이 많을수록 어휘력이 향상된다.", vi: "Theo kết quả nghiên cứu, càng đọc nhiều thì vốn từ vựng càng được nâng cao.", apply: "Dùng trong Q53–54 để trích dẫn dữ liệu, số liệu thống kê — tạo độ tin cậy cho bài." },
  { tag: "Cấu trúc", pattern: "-(으)ㄹ수록", meaning: "Càng... càng...", example: "노력할수록 실력이 늘어난다.", vi: "Càng cố gắng thì năng lực càng tăng lên.", apply: "Dùng trong Q54 để diễn đạt mối quan hệ nhân quả tăng dần — rất phổ biến trong bài luận TOPIK." },
  { tag: "Ngữ pháp", pattern: "-(으)므로", meaning: "Vì vậy / Do đó (văn viết trang trọng)", example: "시간이 부족하므로 효율적인 계획이 필요하다.", vi: "Vì thiếu thời gian nên cần có kế hoạch hiệu quả.", apply: "Dùng thay cho -기 때문에 trong Q53–54 để nâng văn phong lên mức trang trọng hơn." },
  { tag: "Từ vựng", pattern: "-을/를 통해(서)", meaning: "Thông qua / Bằng cách", example: "다양한 경험을 통해 인간은 성장한다.", vi: "Con người trưởng thành thông qua những trải nghiệm đa dạng.", apply: "Dùng để kết nối phương tiện và kết quả trong Q54 — câu kết đoạn rất mạnh." },
  { tag: "Cấu trúc", pattern: "-는 반면(에)", meaning: "Trong khi đó / Ngược lại", example: "도시는 발전하는 반면에 농촌은 인구가 줄고 있다.", vi: "Trong khi thành thị phát triển, nông thôn lại đang giảm dân số.", apply: "Dùng trong Q54 để so sánh hai mặt đối lập — tạo cấu trúc cân đối cho đoạn phân tích." },
  { tag: "Ngữ pháp", pattern: "-아/어야 하다", meaning: "Phải / Cần phải (nghĩa vụ)", example: "환경을 보호하려면 개인도 노력해야 한다.", vi: "Để bảo vệ môi trường, cá nhân cũng phải nỗ lực.", apply: "Dùng trong phần đề xuất giải pháp của Q54 — thể hiện tính cần thiết và trách nhiệm." },
  { tag: "Từ vựng", pattern: "이에 대해 / 이와 관련하여", meaning: "Về vấn đề này / Liên quan đến điều này", example: "이에 대해 전문가들은 다양한 의견을 제시하고 있다.", vi: "Liên quan đến vấn đề này, các chuyên gia đang đề xuất nhiều ý kiến khác nhau.", apply: "Dùng để chuyển ý sang phần phân tích hoặc dẫn ý kiến trong Q54 — tạo mạch văn tự nhiên." },
  { tag: "Cấu trúc", pattern: "-에 불과하다", meaning: "Chỉ là / Không gì hơn", example: "이것은 시작에 불과하다.", vi: "Đây chỉ là sự khởi đầu.", apply: "Dùng trong Q54 khi muốn nhấn mạnh một con số hoặc thực tế còn nhỏ bé — tăng sức thuyết phục." },
  { tag: "Ngữ pháp", pattern: "-(으)ㄹ 것으로 보인다", meaning: "Có vẻ sẽ / Dự đoán rằng (trang trọng)", example: "이 추세는 앞으로도 계속될 것으로 보인다.", vi: "Xu hướng này có vẻ sẽ tiếp tục trong thời gian tới.", apply: "Dùng trong Q53 khi diễn giải xu hướng biểu đồ — văn phong học thuật hơn -겠다 hay -ㄹ 것이다." },
  { tag: "Từ vựng", pattern: "특히 / 특히나", meaning: "Đặc biệt / Nhất là", example: "특히 젊은 세대에서 이 현상이 두드러지게 나타난다.", vi: "Đặc biệt, hiện tượng này xuất hiện nổi bật ở thế hệ trẻ.", apply: "Dùng khi muốn làm nổi bật một nhóm/điểm cụ thể trong Q53–54 — tạo trọng tâm cho đoạn văn." },
  { tag: "Cấu trúc", pattern: "첫째 / 둘째 / 마지막으로", meaning: "Thứ nhất / Thứ hai / Cuối cùng", example: "해결 방법으로는 첫째, 교육 강화가 필요하다. 둘째, 제도적 지원이 있어야 한다.", vi: "Thứ nhất, cần tăng cường giáo dục. Thứ hai, cần có hỗ trợ về mặt thể chế.", apply: "Dùng trong Q54 để liệt kê luận điểm có thứ tự — giám khảo dễ theo dõi cấu trúc bài hơn." },
]

function getDailyTip() {
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return TIPS[day % TIPS.length]
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-[#AEAEB2] uppercase tracking-[0.12em] mb-2 px-0.5">{children}</p>
}

const QTYPE_LABELS: Record<string, string> = {
  q51: "Viết thư", q52: "Đoạn văn", q53: "Phân tích biểu đồ", q54: "Bài luận",
}

export default function SkillDashboardClient() {
  const router = useRouter()
  const tip = getDailyTip()
  const greeting = getGreeting()

  type Profile = { display_name: string; study_streak: number; target_level: number; total_essays_written: number }
  const [profile, setProfile] = useState<Profile | null>(null)
  const [qtypeStats, setQtypeStats] = useState<QtypeStat[]>([])
  const [weakest, setWeakest] = useState<QtypeStat | null>(null)
  const [totalSubmissions, setTotalSubmissions] = useState(0)

  useEffect(() => {
    import("@/lib/supabase-client").then(({ createClient }) => {
      const supabase = createClient()
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) { router.push("/login"); return }
        const uid = session.user.id
        Promise.all([
          supabase.from("user_profiles").select("display_name, study_streak, target_level, total_essays_written").eq("id", uid).single(),
          supabase.from("submissions").select("question_type, total_score, max_score, errors, created_at").eq("user_id", uid).neq("question_type", "mock_exam").order("created_at", { ascending: false }),
        ]).then(([{ data: prof }, { data: rawSubs }]) => {
          if (!prof) { router.push("/onboarding"); return }
          setProfile(prof)
          const subs = rawSubs ?? []
          setTotalSubmissions(subs.length)
          const stats: QtypeStat[] = (["q51", "q52", "q53", "q54"] as const).map((qt) => {
            const typeSubs = subs.filter(s => s.question_type === qt)
            const pcts = typeSubs.map(s => s.max_score > 0 ? Math.min(100, Math.round((s.total_score / s.max_score) * 100)) : 0)
            const count = pcts.length
            const avgPct = count > 0 ? Math.round(pcts.reduce((a, b) => a + b, 0) / count) : 0
            const recentPcts = pcts.slice(0, 5)
            let trend: QtypeStat["trend"] = "new"
            if (pcts.length >= 2) {
              const last3 = pcts.slice(0, 3), prev3 = pcts.slice(3, 6)
              const lastAvg = last3.reduce((a, b) => a + b, 0) / last3.length
              if (prev3.length > 0) {
                const prevAvg = prev3.reduce((a, b) => a + b, 0) / prev3.length
                trend = lastAvg >= prevAvg + 4 ? "up" : lastAvg <= prevAvg - 4 ? "down" : "flat"
              } else trend = "flat"
            }
            return { type: qt, label: QTYPE_LABELS[qt], count, avgPct, recentPcts, trend }
          })
          setQtypeStats(stats)
          const withData = stats.filter(q => q.count >= 2)
          setWeakest(withData.length > 0 ? withData.reduce((a, b) => a.avgPct <= b.avgPct ? a : b) : null)
        })
      })
    })
  }, [router])

  const motivation = getMotivation(profile?.study_streak ?? 0, totalSubmissions)

  const ctaHref  = weakest ? Q_META[weakest.type].href : "/practice/q51"
  const ctaTitle = weakest ? `${weakest.type.toUpperCase()} — ${Q_LABEL[weakest.type]}` : "Q51 — Viết thư"
  const ctaSub   = weakest && weakest.count > 0
    ? `Điểm trung bình của bạn: ${weakest.avgPct}% — luyện thêm để cải thiện`
    : "Câu ngắn nhất, luyện nhanh nhất — bắt đầu từ đây"

  if (!profile) return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <Sidebar />
      <BottomNav />
      <main className="ml-0 md:ml-56 flex-1 px-4 md:px-8 py-5 md:py-7 pb-20 md:pb-7 animate-pulse">
        <div className="space-y-5">
          <div className="h-24 bg-white rounded-2xl border border-gray-100" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100" />)}
          </div>
          <div className="h-36 bg-blue-50 rounded-2xl" />
          <div className="h-40 bg-white rounded-2xl border border-gray-100" />
        </div>
      </main>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <Sidebar />
      <BottomNav />
      <main className="ml-0 md:ml-56 flex-1 px-4 md:px-8 py-5 md:py-7 pb-20 md:pb-7">
        <div className="space-y-5">

          {/* 1. Streak hero */}
          <div className="bg-white rounded-2xl border border-gray-100 px-4 md:px-6 py-4 md:py-5 flex items-center gap-3 md:gap-5">
            <div className="shrink-0 flex flex-col items-center bg-orange-50 border border-orange-100 rounded-2xl w-16 md:w-24 py-2 md:py-3">
              <Flame size={18} className="text-orange-400 mb-1" />
              <span className="text-2xl md:text-4xl font-black text-orange-500 leading-tight" style={{ letterSpacing: "-0.03em" }}>
                {profile.study_streak}
              </span>
              <span className="text-[8px] md:text-[9px] font-bold text-orange-400 uppercase tracking-widest mt-0.5">streak</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#AEAEB2] mb-1">{greeting}, {profile.display_name}!</p>
              <p className="text-base md:text-xl font-bold text-[#1D1D1F] leading-snug" style={{ letterSpacing: "-0.02em" }}>
                {motivation}
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1.5 md:gap-2">
              <div className="text-right">
                <p className="text-xl md:text-2xl font-black text-[#1D1D1F]" style={{ letterSpacing: "-0.03em" }}>{totalSubmissions}</p>
                <p className="text-[10px] text-[#AEAEB2]">bài đã nộp</p>
              </div>
              <span className="text-[10px] md:text-xs font-semibold text-[#0066CC] bg-blue-50 border border-blue-100 px-2 md:px-3 py-1 rounded-full whitespace-nowrap">
                Level {profile.target_level}
              </span>
            </div>
          </div>

          {/* 2. Progress + CTA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <SectionLabel>Tiến trình của bạn</SectionLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {qtypeStats.map(stat => {
                  const m = getMastery(stat.avgPct, stat.count)
                  const meta = Q_META[stat.type]
                  const Icon = Q_ICON[stat.type]
                  return (
                    <Link key={stat.type} href={meta.href}
                      className={`flex flex-col rounded-2xl border px-4 py-4 hover:shadow-md transition-all group ${meta.bg}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-black uppercase tracking-wider ${meta.accent}`}>{stat.type.toUpperCase()}</span>
                        <Icon size={16} className={`${meta.accent} opacity-60`} strokeWidth={2} />
                      </div>
                      <p className="text-sm font-semibold text-[#1D1D1F] leading-tight mb-4">{Q_LABEL[stat.type]}</p>
                      <div className="mt-auto space-y-1.5">
                        {stat.count > 0 ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-semibold ${m.color}`}>{m.label}</span>
                              <span className="text-sm font-black text-[#1D1D1F]">{stat.avgPct}%</span>
                            </div>
                            <div className="h-1.5 bg-white/70 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${meta.bar}`} style={{ width: `${stat.avgPct}%` }} />
                            </div>
                            <p className="text-[10px] text-[#AEAEB2]">{stat.count} bài đã làm</p>
                          </>
                        ) : (
                          <>
                            <span className="text-xs text-[#AEAEB2]">Chưa luyện</span>
                            <div className="h-1.5 bg-white/40 rounded-full" />
                            <p className="text-[10px] invisible">—</p>
                          </>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="md:col-span-1 flex flex-col">
              <SectionLabel>Luyện hôm nay</SectionLabel>
              <Link href={ctaHref}
                className="flex-1 flex flex-col justify-between bg-[#0066CC] hover:bg-[#004F99] rounded-2xl px-5 py-5 transition-colors group">
                <div>
                  <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">Được đề xuất</p>
                  <p className="text-2xl font-black text-white leading-tight mb-2" style={{ letterSpacing: "-0.02em" }}>{ctaTitle}</p>
                  <p className="text-sm text-blue-200 leading-relaxed">{ctaSub}</p>
                </div>
                <span className="mt-5 inline-flex items-center justify-center bg-white text-[#0066CC] font-bold text-sm px-5 py-2.5 rounded-xl group-hover:bg-blue-50 transition-colors">
                  Bắt đầu ngay →
                </span>
              </Link>
            </div>
          </div>

          {/* 3. Daily tip */}
          <div>
            <SectionLabel>Mẫu câu hôm nay</SectionLabel>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-gray-100">
                <div className="px-6 py-5">
                  <span className="text-xs font-bold text-[#0066CC] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                    {tip.tag}
                  </span>
                  <p className="text-2xl font-black text-[#1D1D1F] mt-3 mb-1" style={{ letterSpacing: "-0.01em" }}>{tip.pattern}</p>
                  <p className="text-sm font-medium text-[#6E6E73] mb-4">{tip.meaning}</p>
                  <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    <p className="text-sm font-semibold text-[#1D1D1F] leading-relaxed mb-1">{tip.example}</p>
                    <p className="text-xs text-[#6E6E73] leading-relaxed">{tip.vi}</p>
                  </div>
                </div>
                <div className="px-6 py-5 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-[#AEAEB2] uppercase tracking-widest mb-3">Cách áp dụng</p>
                    <p className="text-base font-semibold text-[#1D1D1F] leading-relaxed">{tip.apply}</p>
                  </div>
                  <Link href="/practice/q54" className="mt-4 self-start text-xs font-bold text-[#0066CC] hover:underline">
                    Thử viết ngay với mẫu này →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Quick links */}
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/mock-exam",    label: "Thi thử" },
              { href: "/review",       label: "Ôn lỗi" },
              { href: "/practice/q51", label: "Q51 — Viết thư" },
              { href: "/practice/q52", label: "Q52 — Đoạn văn" },
              { href: "/practice/q53", label: "Q53 — Phân tích" },
              { href: "/practice/q54", label: "Q54 — Bài luận" },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] hover:border-gray-300 hover:shadow-sm transition-all whitespace-nowrap">
                {item.label}
              </Link>
            ))}
          </div>

        </div>
      </main>
    </div>
  )
}
