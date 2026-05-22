import Link from "next/link"
import FloatingCTA from "./components/FloatingCTA"

const sampleLessons = [
  {
    id: 1,
    emoji: "👋",
    title: "Chào hỏi cơ bản",
    titleKr: "기본 인사",
    description: "Gặp đồng nghiệp người Hàn lần đầu? Học đúng 5 câu là qua.",
    duration: "8 phút",
    level: "TOPIK 1",
    color: "bg-blue-50",
    tag: "Phổ biến nhất",
  },
  {
    id: 2,
    emoji: "🍜",
    title: "Gọi đồ ăn tại nhà hàng",
    titleKr: "식당에서 주문하기",
    description: "Không cần chỉ tay vào menu nữa. Gọi món đúng như người bản địa.",
    duration: "10 phút",
    level: "TOPIK 1",
    color: "bg-orange-50",
    tag: "Thực tế cao",
  },
  {
    id: 3,
    emoji: "🚕",
    title: "Đi taxi và hỏi đường",
    titleKr: "택시 타기",
    description: "Đến Seoul mà không biết hỏi đường thì khổ lắm. Học ngay bài này.",
    duration: "9 phút",
    level: "TOPIK 1",
    color: "bg-green-50",
    tag: "Du học sinh cần",
  },
]

const comparisons = [
  {
    pain: "App tiếng Anh giải thích ngữ pháp bằng tiếng Anh",
    gain: "HanViet giải thích bằng tiếng Việt, so sánh với cấu trúc câu quen thuộc",
  },
  {
    pain: "Học từ vựng rồi quên sau 2 ngày",
    gain: "Flashcard nhắc đúng lúc bạn sắp quên theo thuật toán khoa học",
  },
  {
    pain: "Trung tâm tiếng Hàn 8-12 triệu/khóa, lịch cố định",
    gain: "Học bất cứ lúc nào, 99K/tháng, nội dung do chuyên gia ngôn ngữ Hàn biên soạn",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇰🇷</span>
            <span className="font-bold text-xl text-gray-900">HanViet</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Đăng nhập
            </Link>
            <a
              href="#lessons"
              className="text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Học thử miễn phí
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
              <span>🇻🇳</span>
              <span>App tiếng Hàn đầu tiên giải thích 100% bằng tiếng Việt</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Học tiếng Hàn theo{" "}
              <span className="text-blue-500">tình huống thực tế</span>
              {", "}không phải{" "}
              <span className="whitespace-nowrap">học thuộc lòng</span>
            </h1>
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 mt-0.5 shrink-0">✓</span>
                <p className="text-gray-600 text-base">
                  Nội dung bám sát đề thi TOPIK 1-4, giải thích hoàn toàn bằng tiếng Việt — không phải dịch từ tiếng Anh
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 mt-0.5 shrink-0">✓</span>
                <p className="text-gray-600 text-base">
                  Flashcard nhắc đúng lúc sắp quên, luyện đề thi thử có giải thích đáp án chi tiết từng câu
                </p>
              </div>
            </div>
            <a
              href="#lessons"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base px-8 py-4 rounded-xl transition-colors"
            >
              Thử 3 bài học miễn phí ngay
              <span>↓</span>
            </a>
            <p className="text-gray-400 text-xs mt-3">
              Không cần đăng ký · Không cần thẻ tín dụng
            </p>

            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-gray-100">
              <div>
                <div className="text-2xl font-extrabold text-gray-900">1.000+</div>
                <div className="text-sm text-gray-500">Từ vựng TOPIK</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900">50+</div>
                <div className="text-sm text-gray-500">Bài học thực tế</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-blue-500">99K</div>
                <div className="text-sm text-gray-500">= 2 ly trà sữa/tháng</div>
              </div>
            </div>
          </div>

          {/* Right — preview */}
          <div className="hidden lg:block">
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-bold text-gray-900 text-sm">Bài 2 · Gọi đồ ăn</span>
                  <span className="text-xs text-gray-400 ml-2">식당에서 주문하기</span>
                </div>
                <span className="text-xs bg-orange-100 text-orange-600 font-medium px-2 py-1 rounded-full">🔥 7 ngày streak</span>
              </div>

              {/* Chat bubble style */}
              <div className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 space-y-3">
                <div className="text-xs text-gray-400 font-medium mb-1">💬 Tình huống thực tế tại Seoul</div>
                <div className="flex gap-2 items-end">
                  <span className="text-lg">🧑‍💼</span>
                  <div>
                    <div className="bg-gray-100 rounded-2xl rounded-bl-none px-3 py-2 inline-block">
                      <div className="text-sm font-semibold text-gray-900">뭐 드실래요? 😊</div>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 ml-1">Bạn muốn ăn gì?</div>
                  </div>
                </div>
                <div className="flex gap-2 items-end flex-row-reverse">
                  <span className="text-lg">🙋</span>
                  <div className="text-right">
                    <div className="bg-blue-500 rounded-2xl rounded-br-none px-3 py-2 inline-block">
                      <div className="text-sm font-semibold text-white">비빔밥 주세요 🍜</div>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 mr-1">Cho tôi cơm trộn</div>
                  </div>
                </div>
              </div>

              {/* Vocab chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {["뭐 = gì", "주세요 = cho tôi", "비빔밥 = cơm trộn"].map((w) => (
                  <span key={w} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-lg font-medium">{w}</span>
                ))}
              </div>

              {/* Quiz mini */}
              <div className="bg-white rounded-xl p-3 border border-gray-100">
                <div className="text-xs text-gray-400 mb-2 font-medium">THỬ NHANH</div>
                <div className="text-sm font-semibold text-gray-900 mb-2.5">Dịch sang tiếng Hàn: "Cho tôi nước"</div>
                <div className="flex flex-col gap-1.5">
                  <div className="text-xs bg-gray-50 text-gray-500 px-3 py-2 rounded-lg">비빔밥 주세요</div>
                  <div className="text-xs bg-green-50 text-green-700 px-3 py-2 rounded-lg font-semibold flex items-center justify-between">
                    <span>물 주세요 ✓</span>
                    <span className="text-green-500 font-normal">물 = nước</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Lessons — ANCHOR */}
      <section id="lessons" className="bg-blue-500 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-full mb-4">
              <span>🎁</span>
              <span>Miễn phí, không cần đăng ký</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Thử ngay 3 bài học đầu tiên</h2>
            <p className="text-blue-100 text-sm">Click vào bài học bất kỳ để bắt đầu học ngay</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleLessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="bg-white rounded-2xl p-5 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 ${lesson.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {lesson.emoji}
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                    {lesson.tag}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{lesson.title}</h3>
                <div className="text-xs text-gray-400 mb-2">{lesson.titleKr}</div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{lesson.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">⏱ {lesson.duration}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{lesson.level}</span>
                  </div>
                  <span className="text-blue-500 font-semibold text-sm group-hover:translate-x-0.5 transition-transform">
                    Học ngay →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why HanViet */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tại sao người Việt chọn HanViet?</h2>
          <p className="text-gray-500">So sánh thực tế với các lựa chọn khác</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comparisons.map((c, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="bg-red-50 p-4 border-b border-gray-100">
                <div className="text-xs font-semibold text-red-400 mb-2">VẤN ĐỀ HIỆN TẠI</div>
                <p className="text-sm text-gray-600">{c.pain}</p>
              </div>
              <div className="bg-green-50 p-4">
                <div className="text-xs font-semibold text-green-600 mb-2">VỚI HANVIET</div>
                <p className="text-sm text-gray-700 font-medium">{c.gain}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section id="register" className="bg-gray-50 border-t border-gray-100 py-20">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="text-4xl mb-5">🎯</div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            Sẵn sàng học nghiêm túc?
          </h2>
          <p className="text-gray-500 text-base mb-8 leading-relaxed">
            Đăng ký để lưu tiến độ, nhận nhắc nhở ôn tập<br />
            và mở khóa toàn bộ nội dung.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-base px-10 py-4 rounded-xl transition-colors"
          >
            Đăng ký miễn phí →
          </Link>
          <p className="text-gray-400 text-xs mt-4">3 bài miễn phí mỗi ngày · Premium chỉ 99K/tháng</p>
        </div>
      </section>

      <FloatingCTA />

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🇰🇷</span>
            <span className="font-semibold text-gray-700">HanViet</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 HanViet · Học tiếng Hàn cho người Việt</p>
        </div>
      </footer>
    </div>
  )
}
