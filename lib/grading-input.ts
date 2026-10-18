// Builds the full task text the grader needs from a prompt object.
// The grader must see the chart numbers (Q53) and the full question with ①②③ (Q54).

import type { WritingPrompt } from "@/lib/data/prompts"

const SERIES_LABEL: Record<string, string> = {
  items: "",
  male: "남성",
  female: "여성",
  before: "이전",
  after: "이후",
}

const UNIT: Record<string, string> = { percent: "%", hours: "시간", count: "명", value: "" }

type Row = Record<string, unknown>

function formatRow(row: Row): string {
  const label = String(row.label ?? row.name ?? "")
  const values = Object.entries(row)
    .filter(([k]) => k !== "label" && k !== "name")
    .map(([k, v]) => `${v}${UNIT[k] ?? ` (${k})`}`)
  return `- ${label}: ${values.join(", ")}`
}

export function formatChartData(chart: unknown): string {
  if (!chart || typeof chart !== "object") return ""
  const c = chart as Record<string, unknown>
  const lines: string[] = []
  if (c.title) lines.push(`[${c.title}]`)
  const meta = [c.year && `조사 연도: ${c.year}`, c.respondents && `응답자: ${c.respondents}명`].filter(Boolean)
  if (meta.length) lines.push(meta.join(" · "))
  for (const [key, value] of Object.entries(c)) {
    if (!Array.isArray(value)) continue
    const header = SERIES_LABEL[key] ?? key
    if (header) lines.push(`${header}:`)
    for (const row of value) if (row && typeof row === "object") lines.push(formatRow(row as Row))
  }
  return lines.join("\n")
}

export function q53TaskText(p: Pick<WritingPrompt, "text_kr" | "chart_data">): string {
  const data = formatChartData(p.chart_data)
  return data ? `${p.text_kr}\n\nSố liệu biểu đồ:\n${data}` : p.text_kr
}

export function q54TaskText(p: Pick<WritingPrompt, "text_kr" | "topic">): string {
  const parts = [p.topic, p.text_kr].map((s) => s?.trim()).filter(Boolean) as string[]
  return [...new Set(parts)].join("\n\n")
}
