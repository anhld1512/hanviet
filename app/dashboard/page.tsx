import { getEpsLesson, type EpsLesson } from "@/lib/eps-lesson"
import DashboardClient from "./DashboardClient"

export default function DashboardPage() {
  const lessons: EpsLesson[] = []
  for (let i = 1; i <= 10; i++) {
    const l = getEpsLesson(i)
    if (l) lessons.push(l)
  }
  return <DashboardClient lessons={lessons} />
}
