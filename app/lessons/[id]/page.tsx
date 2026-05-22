import { getLessonById } from "@/lib/lessons-data"
import LessonViewer from "./LessonViewer"
import { notFound } from "next/navigation"

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lesson = getLessonById(Number(id))

  if (!lesson) return notFound()

  return <LessonViewer lesson={lesson} />
}
