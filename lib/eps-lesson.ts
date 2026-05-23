import fs from "fs"
import path from "path"

export interface EpsDialogueLine {
  speaker: string
  speaker_role: string
  text_kr: string
  text_vi: string
  grammar_note: string
}

export interface EpsVocabWord {
  word_kr: string
  word_vi: string
  pronunciation: string
  example_kr: string
  example_vi: string
  is_key_word: boolean
}

export interface EpsGrammarPoint {
  pattern: string
  meaning: string
  explanation_vi: string
  examples: { kr: string; vi: string }[]
}

export interface EpsExercise {
  id: number
  type: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

export interface EpsLesson {
  lesson_number: number
  title_kr: string
  title_vi: string
  book: number
  category: string
  is_free: boolean
  dialogue: EpsDialogueLine[]
  vocabulary: EpsVocabWord[]
  grammar: EpsGrammarPoint[]
  exercises: EpsExercise[]
}

export function getEpsLesson(id: number): EpsLesson | null {
  const filename = `lesson-${String(id).padStart(2, "0")}.json`
  const filePath = path.join(process.cwd(), "data", "eps-lessons", filename)
  if (!fs.existsSync(filePath)) return null
  const content = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(content) as EpsLesson
}
