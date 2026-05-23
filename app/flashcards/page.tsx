import { getEpsLesson } from "@/lib/eps-lesson"
import FlashcardsClient from "./FlashcardsClient"

export type EpsFlashCard = {
  id: string
  word_kr: string
  pronunciation: string
  word_vi: string
  example_kr: string
  example_vi: string
  is_key_word: boolean
  lesson_number: number
  lesson_title: string
}

export default function FlashcardsPage() {
  const cards: EpsFlashCard[] = []
  for (let i = 1; i <= 10; i++) {
    const lesson = getEpsLesson(i)
    if (!lesson) continue
    for (const v of lesson.vocabulary) {
      cards.push({
        id: `${i}-${v.word_kr}`,
        word_kr: v.word_kr,
        pronunciation: v.pronunciation,
        word_vi: v.word_vi,
        example_kr: v.example_kr,
        example_vi: v.example_vi,
        is_key_word: v.is_key_word,
        lesson_number: i,
        lesson_title: lesson.title_vi,
      })
    }
  }
  return <FlashcardsClient allCards={cards} />
}
