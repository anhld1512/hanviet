import fs from "fs"
import path from "path"

export interface EpsQuestion {
  id: string
  type: string
  difficulty: number
  related_lesson: number
  question_text: string
  options: string[]
  correct: number
  explanation: string
  script_kr?: string
}

function loadQuestions(filename: string): EpsQuestion[] {
  const filePath = path.join(process.cwd(), "data", "eps-questions", filename)
  if (!fs.existsSync(filePath)) return []
  const content = fs.readFileSync(filePath, "utf-8")
  const parsed = JSON.parse(content)
  if (Array.isArray(parsed)) return parsed as EpsQuestion[]
  if (parsed.questions && Array.isArray(parsed.questions)) return parsed.questions as EpsQuestion[]
  return []
}

export function getReadingQuestions(): EpsQuestion[] {
  return loadQuestions("reading.json")
}

export function getListeningQuestions(): EpsQuestion[] {
  return loadQuestions("listening.json")
}

export function getMockExam(count: 25 | 50 = 50): { listening: EpsQuestion[]; reading: EpsQuestion[] } {
  const listeningAll = getListeningQuestions()
  const readingAll = getReadingQuestions()

  const half = count / 2

  function sample<T>(arr: T[], n: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, n)
  }

  return {
    listening: sample(listeningAll, half),
    reading: sample(readingAll, half),
  }
}
