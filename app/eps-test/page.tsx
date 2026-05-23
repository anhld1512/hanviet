import { getReadingQuestions, getListeningQuestions } from "@/lib/eps-questions"
import EpsTestClient from "./EpsTestClient"

export default function EpsTestPage() {
  const reading = getReadingQuestions()
  const listening = getListeningQuestions()
  return <EpsTestClient readingPool={reading} listeningPool={listening} />
}
