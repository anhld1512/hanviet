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

export default function LearningPathPage() {
  return <SkillDashboardClient />
}
