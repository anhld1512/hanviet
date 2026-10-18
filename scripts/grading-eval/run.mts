// Runs the calibration set against the live grading engine.
//   npm run eval:grading            (2 runs per case)
//   npm run eval:grading -- 3 Q54   (3 runs, only cases whose id contains "Q54")
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"

for (const line of readFileSync(join(process.cwd(), ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}

const { gradeBlanks, gradeEssay } = await import("../../lib/ai-grading")
const { CASES } = await import("./cases")

const runs = Number(process.argv[2] ?? 2)
const filter = process.argv[3] ?? ""
const cases = CASES.filter((c) => c.id.includes(filter))

type Run = { total: number; content?: number; ms: number; error?: string; feedback?: string }
const results = new Map<string, Run[]>()
const jobs = cases.flatMap((c) => Array.from({ length: runs }, () => c))
let next = 0

async function worker() {
  while (next < jobs.length) {
    const c = jobs[next++]
    const t0 = Date.now()
    let run: Run
    try {
      if (c.kind === "blank") {
        const [r] = await gradeBlanks({
          questionType: c.questionType,
          passage: c.passage,
          blanks: [{ key: c.key, answer: c.answer, hint: c.hint, reference: c.reference }],
        })
        run = { total: r.scores.total, ms: Date.now() - t0, feedback: r.feedback.overall }
      } else {
        const r = await gradeEssay({ questionType: c.questionType, task: c.task, essay: c.essay })
        run = { total: r.scores.total, content: r.scores.content, ms: Date.now() - t0, feedback: r.feedback.overall }
      }
    } catch (e) {
      run = { total: -1, ms: Date.now() - t0, error: String(e) }
    }
    const list = results.get(c.id) ?? []
    list.push(run)
    results.set(c.id, list)
    process.stderr.write(".")
  }
}

await Promise.all(Array.from({ length: 5 }, worker))
process.stderr.write("\n")

let pass = 0
let maxSpread = 0
let errors = 0
const latencies: number[] = []
const report = cases.map((c) => {
  const rs = results.get(c.id) ?? []
  const totals = rs.map((r) => r.total)
  rs.forEach((r) => latencies.push(r.ms))
  const inRange = rs.every((r) => !r.error && r.total >= c.expect[0] && r.total <= c.expect[1])
  const contentOk = c.kind !== "essay" || c.expectContentMax === undefined || rs.every((r) => (r.content ?? 99) <= c.expectContentMax!)
  const ok = inRange && contentOk
  if (ok) pass++
  const graded = rs.filter((r) => !r.error).map((r) => r.total)
  errors += rs.length - graded.length
  if (graded.length) maxSpread = Math.max(maxSpread, Math.max(...graded) - Math.min(...graded))
  const contents = c.kind === "essay" ? ` content=${rs.map((r) => r.content).join("/")}` : ""
  console.log(`${ok ? "PASS" : "FAIL"}  ${c.id.padEnd(42)} kỳ vọng ${c.expect.join("–").padEnd(6)} → ${totals.join(", ")}${contents}`)
  if (!ok) for (const r of rs) console.log(`        ${r.error ?? r.feedback?.slice(0, 160)}`)
  return { id: c.id, expect: c.expect, runs: rs, ok }
})

latencies.sort((a, b) => a - b)
const p50 = latencies[Math.floor(latencies.length / 2)] / 1000
const p90 = latencies[Math.floor(latencies.length * 0.9)] / 1000
console.log(`\n${pass}/${cases.length} case đạt · độ lệch lớn nhất giữa các lần chấm: ${maxSpread} điểm · lượt chấm lỗi: ${errors}/${latencies.length} · thời gian p50 ${p50.toFixed(1)}s, p90 ${p90.toFixed(1)}s`)

const outDir = join(process.cwd(), "scripts/grading-eval/results")
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, "latest.json"), JSON.stringify(report, null, 1))
