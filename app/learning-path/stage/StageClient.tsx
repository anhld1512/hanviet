"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"
import BottomNav from "@/app/components/BottomNav"
import type { Stage, StageTask } from "@/lib/learning-path-data"
import { calcAvgPct } from "@/lib/learning-path-data"
import { tplCheckpointKey } from "@/app/templates/page"

// Templates mini data
const MINI_TEMPLATES: Record<string, Array<{ title: string; pattern: string; example: string }>> = {
  q51: [
    { title: "Thư cảm ơn / xin lỗi", pattern: "[lý do] + 아/어 주셔서 감사합니다 / 죄송합니다", example: "바쁘신 중에도 도움을 주셔서 감사합니다." },
    { title: "Lời chúc / đề nghị cuối thư", pattern: "[điều mong muốn] + (으)시기 바랍니다", example: "항상 건강하시기 바랍니다." },
  ],
  q52: [
    { title: "Câu tương phản", pattern: "반면(에) / 이와 달리 + [ý đối lập]", example: "반면 현대인들은 개인 생활을 더 중시한다." },
    { title: "Câu kết luận", pattern: "이처럼 / 따라서 / 그러므로 + [kết luận]", example: "따라서 사회적 유대감이 점점 약해지고 있다." },
  ],
  q53: [
    { title: "Mô tả số liệu cao nhất", pattern: "[항목]이/가 [수치]%로 가장 높게 나타났다", example: "스트레스가 45%로 가장 높게 나타났다." },
    { title: "Kết luận biểu đồ", pattern: "이를 통해 [결론]을/를 알 수 있다", example: "이를 통해 현대인의 건강 문제가 심각함을 알 수 있다." },
  ],
  q54: [
    { title: "Mở đề nêu vấn đề", pattern: "오늘날 [주제]은/는 [상황]이다. [배경 설명].", example: "오늘날 환경 오염은 심각한 사회 문제로 대두되고 있다." },
    { title: "Câu kết luận", pattern: "이러한 점들을 고려할 때, [결론 + 방향].", example: "이러한 점들을 고려할 때, 개인과 사회 모두의 노력이 필요하다." },
  ],
}

const Q_COLORS: Record<string, { bg: string; badge: string; text: string; border: string }> = {
  q51: { bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700", text: "text-blue-700", border: "border-blue-200" },
  q52: { bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700", text: "text-blue-700", border: "border-blue-200" },
  q53: { bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700", text: "text-blue-700", border: "border-blue-200" },
  q54: { bg: "bg-gray-50", badge: "bg-gray-100 text-blue-700", text: "text-blue-700", border: "border-gray-200" },
}

function ProgressBar({ value, max, color = "bg-blue-500" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

// Lay URL cho template task co filter + from param
function templateUrl(task: StageTask): string {
  const q = (task.qTypes ?? []).join(",")
  return `/templates${q ? `?q=${q}&from=stage` : ""}`
}

// Tao key cho practice/review task (dung cho manual checkpoint)
function practiceCheckpointKey(route: string, targetCount: number) {
  return `hanviet_practice_done_${route.replace(/\//g, "_")}_${targetCount}`
}

export default function StageClient({
  stage, stageIdx, totalStages, learningPath, essayCount, avgPct, countByType,
}: {
  stage: Stage
  stageIdx: number
  totalStages: number
  learningPath: string
  essayCount: number
  avgPct: Record<string, number>
  countByType: Record<string, number>
}) {
  const isLastStage = stageIdx === totalStages - 1
  const relevantQTypes = Array.from(new Set(stage.tasks.flatMap((t) => t.qTypes ?? []))).filter((q) => q.startsWith("q5"))

  const countOk = essayCount >= stage.unlockAt || stage.unlockAt === 0
  const avgForStage = calcAvgPct(avgPct, stage.scoreTypes)
  const scoreOk = stage.minAvgPct === 0 || avgForStage >= stage.minAvgPct

  // Checkpoint state tu localStorage
  const [taskDone, setTaskDone] = useState<Record<number, boolean>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const done: Record<number, boolean> = {}
    stage.tasks.forEach((task, i) => {
      if (task.type === "template") {
        const key = tplCheckpointKey(task.qTypes ?? [])
        done[i] = localStorage.getItem(key) === "1"
      } else if (task.type === "practice" && task.targetCount && (task.qTypes?.length ?? 0) === 1) {
        // Practice: tu dong check tu countByType
        const qt = task.qTypes![0]
        done[i] = (countByType[qt] ?? 0) >= task.targetCount
      } else if (task.type === "review") {
        // Review: check thu cong
        const key = `hanviet_review_done_s${stageIdx}_t${i}`
        done[i] = localStorage.getItem(key) === "1"
      }
    })
    setTaskDone(done)
  }, [stageIdx])

  function markReviewDone(taskIdx: number) {
    const key = `hanviet_review_done_s${stageIdx}_t${taskIdx}`
    localStorage.setItem(key, "1")
    setTaskDone((prev) => ({ ...prev, [taskIdx]: true }))
  }

  const completedCount = Object.values(taskDone).filter(Boolean).length
  const totalTasks = stage.tasks.length

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <BottomNav />
      <main className="ml-0 md:ml-56 flex-1 p-4 md:p-8 pb-20 md:pb-8 max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/practice" className="text-gray-400 hover:text-gray-600">← Luyện viết</Link>
          <span className="text-gray-300">/</span>
          <Link href="/learning-path" className="text-gray-400 hover:text-gray-600">Lộ trình</Link>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-gray-700">Giai đoạn {stageIdx + 1}</span>
        </div>

        {/* Stage header */}
        <div className="bg-white rounded-2xl border border-blue-100 p-6 mb-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center font-extrabold text-base">{stageIdx + 1}</div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{stage.title}</div>
                  <div className="text-sm text-gray-500">{stage.subtitle}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">{stage.desc}</p>
            </div>
            <div className="text-right ml-4 shrink-0">
              <div className="text-xs text-gray-400 mb-1">Giai đoạn {stageIdx + 1}/{totalStages}</div>
              {/* Tien do tasks */}
              {mounted && (
                <div className={`text-2xl font-extrabold ${completedCount === totalTasks ? "text-blue-500" : "text-blue-500"}`}>
                  {completedCount}<span className="text-lg text-gray-300">/{totalTasks}</span>
                </div>
              )}
              <div className="text-xs text-gray-400 mt-0.5">bước hoàn thành</div>
            </div>
          </div>

          {/* Progress bar theo tasks */}
          {mounted && (
            <div className="mt-3 mb-4">
              <div className="flex gap-1.5">
                {stage.tasks.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${taskDone[i] ? "bg-blue-400" : "bg-gray-200"}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Muc tieu */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
            <span className="text-xs font-bold text-blue-700">🎯 Mục tiêu: </span>
            <span className="text-xs text-gray-700">{stage.goal}</span>
          </div>

          {/* Dieu kien pass */}
          {stage.unlockAt > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className={`rounded-xl p-3 ${countOk ? "bg-blue-50 border border-blue-100" : "bg-gray-50 border border-gray-100"}`}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className={countOk ? "text-blue-700 font-semibold" : "text-gray-600"}>
                    {countOk ? "✓" : "○"} Nộp đủ {stage.unlockAt} bài
                  </span>
                  <span className={`font-bold ${countOk ? "text-blue-600" : "text-gray-500"}`}>
                    {Math.min(essayCount, stage.unlockAt)}/{stage.unlockAt}
                  </span>
                </div>
                <ProgressBar value={essayCount} max={stage.unlockAt} color={countOk ? "bg-blue-400" : "bg-blue-400"} />
              </div>
              {stage.minAvgPct > 0 && (
                <div className={`rounded-xl p-3 ${scoreOk ? "bg-blue-50 border border-blue-100" : "bg-gray-50 border border-gray-100"}`}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={scoreOk ? "text-blue-700 font-semibold" : "text-gray-600"}>
                      {scoreOk ? "✓" : "○"} Điểm TB {stage.scoreTypes.map(t => t.toUpperCase()).join("+")} ≥ {stage.minAvgPct}%
                    </span>
                    <span className={`font-bold ${scoreOk ? "text-blue-600" : avgForStage > 0 ? "text-gray-600" : "text-gray-400"}`}>
                      {Object.keys(avgPct).length > 0 ? `${avgForStage}%` : "—"}
                    </span>
                  </div>
                  <ProgressBar value={avgForStage} max={100} color={scoreOk ? "bg-blue-400" : avgForStage >= stage.minAvgPct * 0.8 ? "bg-gray-400" : "bg-blue-400"} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="mb-6">
          <h2 className="font-bold text-gray-900 text-lg mb-3">Các bước thực hiện</h2>
          <div className="space-y-3">
            {stage.tasks.map((task, i) => {
              const qTypes = task.qTypes ?? []
              const mainColor = qTypes.length > 0 ? (Q_COLORS[qTypes[0]] ?? Q_COLORS.q51) : null
              const isDone = mounted ? (taskDone[i] ?? false) : false

              const taskProgress = task.type === "practice" && task.targetCount && qTypes.length === 1
                ? { current: countByType[qTypes[0]] ?? 0, target: task.targetCount }
                : null

              const taskUrl = task.type === "template" ? templateUrl(task) : task.route

              return (
                <div
                  key={i}
                  className={`bg-white rounded-2xl border p-5 transition-all ${
                    isDone
                      ? "border-blue-200 bg-blue-50/30"
                      : mainColor ? mainColor.border : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkpoint indicator */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 transition-all ${
                      isDone ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      {isDone ? "✓" : i + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{task.type === "template" ? "📋" : task.type === "practice" ? "✏️" : "🔍"}</span>
                        <span className={`font-semibold text-sm ${isDone ? "text-blue-800" : "text-gray-900"}`}>{task.label}</span>
                        {qTypes.map((q) => (
                          <span key={q} className={`text-xs font-bold px-2 py-0.5 rounded-full ${Q_COLORS[q]?.badge ?? ""}`}>
                            {q.toUpperCase()}
                          </span>
                        ))}
                        {isDone && <span className="text-xs text-blue-600 font-semibold ml-1">Đã hoàn thành</span>}
                      </div>

                      {/* Inline templates preview */}
                      {task.type === "template" && qTypes.length > 0 && !isDone && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {qTypes.flatMap((q) =>
                            (MINI_TEMPLATES[q] ?? []).map((tpl, ti) => (
                              <div key={`${q}-${ti}`} className={`rounded-xl p-3 ${Q_COLORS[q]?.bg ?? "bg-gray-50"}`}>
                                <div className={`text-xs font-bold mb-1 ${Q_COLORS[q]?.text ?? "text-gray-700"}`}>{q.toUpperCase()} — {tpl.title}</div>
                                <div className="text-xs text-gray-500 mb-1 font-mono">{tpl.pattern}</div>
                                <div className="text-xs text-gray-700 italic">{tpl.example}</div>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {/* Practice progress bar */}
                      {taskProgress && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Bài đã nộp</span>
                            <span className={taskProgress.current >= taskProgress.target ? "text-blue-600 font-bold" : "text-gray-500"}>
                              {Math.min(taskProgress.current, taskProgress.target)}/{taskProgress.target}
                            </span>
                          </div>
                          <ProgressBar value={taskProgress.current} max={taskProgress.target} color={isDone ? "bg-blue-400" : "bg-blue-400"} />
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      {!isDone && (
                        <Link
                          href={taskUrl}
                          className={`text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors ${
                            task.type === "template" ? "bg-blue-500 hover:bg-blue-600" :
                            task.type === "practice" ? "bg-blue-500 hover:bg-blue-600" :
                            "bg-gray-500 hover:bg-blue-600"
                          }`}
                        >
                          {task.type === "template" ? "Học ngay →" : task.type === "practice" ? "Bắt đầu →" : "Xem ngay →"}
                        </Link>
                      )}
                      {/* Review task: manual mark done */}
                      {task.type === "review" && !isDone && (
                        <button
                          onClick={() => markReviewDone(i)}
                          className="text-xs text-gray-400 hover:text-blue-600 border border-dashed border-gray-200 hover:border-blue-300 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Đánh dấu xong ✓
                        </button>
                      )}
                      {isDone && (
                        <Link
                          href={taskUrl}
                          className="text-xs text-gray-400 hover:text-gray-600 font-medium"
                        >
                          Xem lại
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tham khao: cong thuc viet cau */}
        {relevantQTypes.length > 0 && (
          <div>
            <h2 className="font-bold text-gray-900 text-lg mb-3">Công thức viết câu cần nhớ</h2>
            <div className="grid grid-cols-2 gap-4">
              {relevantQTypes.map((q) => {
                const color = Q_COLORS[q] ?? Q_COLORS.q51
                const templates = MINI_TEMPLATES[q] ?? []
                return (
                  <div key={q} className={`bg-white rounded-2xl border ${color.border} p-5`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${color.badge}`}>{q.toUpperCase()}</span>
                      <Link href={`/practice/${q}`} className={`text-xs font-medium ${color.text} hover:underline`}>Luyện ngay →</Link>
                    </div>
                    <div className="space-y-3">
                      {templates.map((tpl, i) => (
                        <div key={i} className={`rounded-xl p-3 ${color.bg}`}>
                          <div className={`text-xs font-bold mb-1 ${color.text}`}>{tpl.title}</div>
                          <div className="font-mono text-xs text-gray-600 mb-1">{tpl.pattern}</div>
                          <div className="text-xs text-gray-500 italic bg-white rounded-lg px-2 py-1">{tpl.example}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between mt-8">
          <Link href="/learning-path" className="text-sm text-gray-500 hover:text-gray-700 font-medium">← Xem lộ trình đầy đủ</Link>
          {!isLastStage && (
            <div className="text-xs text-gray-400">Hoàn thành đủ điều kiện → giai đoạn tiếp theo tự mở</div>
          )}
        </div>
      </main>
    </div>
  )
}
