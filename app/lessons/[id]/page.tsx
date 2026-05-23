import { getEpsLesson } from "@/lib/eps-lesson"
import LessonViewer from "./LessonViewer"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lessonId = Number(id)
  const lesson = getEpsLesson(lessonId)

  if (!lesson) return notFound()

  if (!lesson.is_free) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 p-10 text-center">
          <div className="text-5xl mb-5">🔒</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Bài {lesson.lesson_number}: {lesson.title_vi}
          </h1>
          <p className="text-sm text-gray-400 mb-6">{lesson.title_kr}</p>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Bài học này thuộc gói Premium. Đăng ký để mở khóa toàn bộ 60 bài học EPS và luyện đề thi thử không giới hạn.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/register"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Đăng ký Premium 99K/tháng →
            </Link>
            <Link
              href="/"
              className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-5">3 bài học đầu luôn miễn phí</p>
        </div>
      </div>
    )
  }

  return <LessonViewer lesson={lesson} />
}
