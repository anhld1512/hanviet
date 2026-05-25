import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import SkillDashboardClient from "./SkillDashboardClient"

export type QtypeStat = {
  type: "q51" | "q52" | "q53" | "q54"
  label: string
  count: number
  avgPct: number
  recentPcts: number[]
  trend: "up" | "down" | "flat" | "new"
}

export type ErrorStat = {
  type: string
  label: string
  count: number
  qtypes: string[]
}

const QTYPE_LABELS: Record<string, string> = {
  q51: "Viết thư",
  q52: "Đoạn văn",
  q53: "Phân tích biểu đồ",
  q54: "Bài luận",
}

const ERROR_LABELS: Record<string, string> = {
  grammar: "Ngữ pháp",
  vocabulary: "Từ vựng",
  style: "Thể văn",
  logic: "Logic / Nội dung",
  content: "Nội dung",
}

export default async function LearningPathPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name, study_streak, target_level, total_essays_written")
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/onboarding")

  // Fetch tất cả submissions (trừ mock_exam)
  const { data: rawSubs } = await supabase
    .from("submissions")
    .select("question_type, total_score, max_score, errors, created_at")
    .eq("user_id", user.id)
    .neq("question_type", "mock_exam")
    .order("created_at", { ascending: false })

  const subs = rawSubs ?? []

  // ── Per-qtype stats ────────────────────────────────────────────
  const qtypeStats: QtypeStat[] = (["q51", "q52", "q53", "q54"] as const).map((qt) => {
    const typeSubs = subs.filter(s => s.question_type === qt)
    const pcts = typeSubs.map(s =>
      s.max_score > 0 ? Math.min(100, Math.round((s.total_score / s.max_score) * 100)) : 0
    )
    const count = pcts.length
    const avgPct = count > 0 ? Math.round(pcts.reduce((a, b) => a + b, 0) / count) : 0
    const recentPcts = pcts.slice(0, 5)

    let trend: QtypeStat["trend"] = "new"
    if (pcts.length >= 2) {
      const last3 = pcts.slice(0, 3)
      const prev3 = pcts.slice(3, 6)
      const lastAvg = last3.reduce((a, b) => a + b, 0) / last3.length
      if (prev3.length > 0) {
        const prevAvg = prev3.reduce((a, b) => a + b, 0) / prev3.length
        trend = lastAvg >= prevAvg + 4 ? "up" : lastAvg <= prevAvg - 4 ? "down" : "flat"
      } else {
        trend = "flat"
      }
    }

    return { type: qt, label: QTYPE_LABELS[qt], count, avgPct, recentPcts, trend }
  })

  // ── Error frequency ────────────────────────────────────────────
  const errorMap: Record<string, { count: number; qtypes: Set<string> }> = {}
  for (const sub of subs) {
    const errors = (sub.errors as Array<{ type?: string }>) ?? []
    for (const err of errors) {
      if (!err.type) continue
      if (!errorMap[err.type]) errorMap[err.type] = { count: 0, qtypes: new Set() }
      errorMap[err.type].count++
      errorMap[err.type].qtypes.add(sub.question_type)
    }
  }
  const topErrors: ErrorStat[] = Object.entries(errorMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([type, val]) => ({
      type,
      label: ERROR_LABELS[type] ?? type,
      count: val.count,
      qtypes: Array.from(val.qtypes),
    }))

  // ── Recommendation: weakest qtype with ≥2 submissions ─────────
  const withData = qtypeStats.filter(q => q.count >= 2)
  const weakest = withData.length > 0
    ? withData.reduce((a, b) => a.avgPct <= b.avgPct ? a : b)
    : null

  return (
    <SkillDashboardClient
      profile={profile}
      qtypeStats={qtypeStats}
      topErrors={topErrors}
      weakest={weakest}
      totalSubmissions={subs.length}
    />
  )
}
