import Link from "next/link"
import FloatingCTA from "./components/FloatingCTA"
import NavAuth from "./components/NavAuth"

const freeLessons = [
  {
    id: 1,
    emoji: "👋",
    title: "Tự giới thiệu bản thân",
    titleKr: "자기소개",
    description: "Ngày đầu vào công ty, biết cách chào hỏi và giới thiệu đúng cách với đồng nghiệp Hàn Quốc.",
    duration: "8 phút",
    tag: "Bài 1 miễn phí",
    color: "bg-blue-50",
  },
  {
    id: 2,
    emoji: "🏠",
    title: "Đồ dùng sinh hoạt",
    titleKr: "생활용품",
    description: "Tên các đồ dùng trong ký túc xá, cách hỏi mua đồ và hiểu thông báo nội quy.",
    duration: "9 phút",
    tag: "Bài 2 miễn phí",
    color: "bg-green-50",
  },
  {
    id: 3,
    emoji: "📍",
    title: "Vị trí và địa điểm",
    titleKr: "위치와 장소",
    description: "Hỏi đường trong khu công nghiệp, tìm nhà ăn, phòng y tế, cổng bảo vệ.",
    duration: "8 phút",
    tag: "Bài 3 miễn phí",
    color: "bg-orange-50",
  },
]

const reasons = [
  {
    pain: "Tài liệu luyện thi EPS-TOPIK toàn tiếng Anh hoặc tiếng Hàn",
    gain: "Toàn bộ giải thích bằng tiếng Việt, so sánh với cấu trúc câu người Việt đã quen",
  },
  {
    pain: "Trung tâm luyện thi 8-15 triệu/khóa, phải đến lớp đúng giờ",
    gain: "Học mọi lúc, mọi nơi. 99K/tháng, tiết kiệm hơn 100 lần, đỗ được mới quan trọng",
  },
  {
    pain: "Học từ vựng rồi quên sau 2 ngày, không biết câu nào hay ra thi",
    gain: "Flashcard nhắc đúng lúc sắp quên, đánh dấu từ hay thi để ôn đúng trọng tâm",
  },
]

const examInfo = [
  { label: "Sản xuất chế tạo", score: "110+", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Xây dựng", score: "80+", color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Nông nghiệp", score: "80+", color: "text-green-600", bg: "bg-green-50" },
  { label: "Ngư nghiệp", score: "60+", color: "text-cyan-600", bg: "bg-cyan-50" },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇰🇷</span>
            <div>
              <span className="font-bold text-xl text-gray-900">HanViet</span>
              <span className="text-xs text-blue-500 font-semibold ml-1.5">EPS</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NavAuth />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-full mb-5">
              <span>🇻🇳</span>
              <span>Ôn thi EPS-TOPIK bằng tiếng Việt</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              Đỗ EPS-TOPIK{", "}
              <span className="text-blue-500">đi Hàn làm việc</span>
              <br />
              lương 40-70 triệu/tháng
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-7">
              Ứng dụng luyện thi EPS-TOPIK đầu tiên giải thích hoàn toàn bằng tiếng Việt. 60 bài học theo đúng chương trình SGK, đề thi thử sát với kỳ thi thực tế.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 mt-0.5 shrink-0 font-bold">✓</span>
                <p className="text-gray-600 text-sm">
                  60 bài học theo sách giáo khoa EPS chính thức, hội thoại tình huống thực tế tại công xưởng, ký túc xá
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 mt-0.5 shrink-0 font-bold">✓</span>
                <p className="text-gray-600 text-sm">
                  Thi thử 50 câu (nghe + đọc), có giải thích đáp án từng câu bằng tiếng Việt
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 mt-0.5 shrink-0 font-bold">✓</span>
                <p className="text-gray-600 text-sm">
                  Flashcard ôn từ vựng thông minh, đánh dấu từ hay ra thi để ôn đúng trọng tâm
                </p>
              </div>
            </div>
            <a
              href="#lessons"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-base px-8 py-4 rounded-xl transition-colors"
            >
              Học thử 3 bài miễn phí ngay
              <span>↓</span>
            </a>
            <p className="text-gray-400 text-xs mt-3">Không cần đăng ký, không cần thẻ tín dụng</p>

            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-gray-100">
              <div>
                <div className="text-2xl font-extrabold text-gray-900">60</div>
                <div className="text-sm text-gray-500">Bài học EPS</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900">500+</div>
                <div className="text-sm text-gray-500">Câu thi thử</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-blue-500">99K</div>
                <div className="text-sm text-gray-500">/tháng</div>
              </div>
            </div>
          </div>

          {/* Right — app preview */}
          <div className="hidden lg:block">
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-bold text-gray-900 text-sm">Bài 3 · Vị trí địa điểm</span>
                  <span className="text-xs text-gray-400 ml-2">위치와 장소</span>
                </div>
                <span className="text-xs bg-orange-100 text-orange-600 font-medium px-2 py-1 rounded-full">🔥 5 ngày liên tiếp</span>
              </div>

              {/* Dialogue */}
              <div className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 space-y-3">
                <div className="text-xs text-gray-400 font-medium mb-1">💬 Tình huống tại khu công nghiệp</div>
                <div className="flex gap-2 items-end">
                  <span className="text-lg">👷</span>
                  <div>
                    <div className="bg-gray-100 rounded-2xl rounded-bl-none px-3 py-2 inline-block">
                      <div className="text-sm font-semibold text-gray-900">식당이 어디예요?</div>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 ml-1">Nhà ăn ở đâu vậy?</div>
                  </div>
                </div>
                <div className="flex gap-2 items-end flex-row-reverse">
                  <span className="text-lg">🧑‍🏭</span>
                  <div className="text-right">
                    <div className="bg-blue-500 rounded-2xl rounded-br-none px-3 py-2 inline-block">
                      <div className="text-sm font-semibold text-white">공장 뒤에 있어요.</div>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 mr-1">Ở phía sau xưởng.</div>
                  </div>
                </div>
              </div>

              {/* Vocab chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {["어디 = ở đâu", "뒤 = phía sau", "있어요 = có/ở"].map((w) => (
                  <span key={w} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-lg font-medium">{w}</span>
                ))}
              </div>

              {/* Mini quiz */}
              <div className="bg-white rounded-xl p-3 border border-gray-100">
                <div className="text-xs text-gray-400 mb-2 font-medium">CÂU HỎI NHANH</div>
                <div className="text-sm font-semibold text-gray-900 mb-2.5">"Nhà vệ sinh ở đâu?" tiếng Hàn là?</div>
                <div className="flex flex-col gap-1.5">
                  <div className="text-xs bg-gray-50 text-gray-500 px-3 py-2 rounded-lg">식당이 어디예요?</div>
                  <div className="text-xs bg-green-50 text-green-700 px-3 py-2 rounded-lg font-semibold flex items-center justify-between">
                    <span>화장실이 어디예요? ✓</span>
                    <span className="text-green-500 font-normal">화장실 = nhà vệ sinh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam structure */}
      <section className="bg-gray-50 border-y border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Cấu trúc kỳ thi EPS-TOPIK</h2>
            <p className="text-gray-500 text-sm">50 câu, 70 phút, thang điểm 200. Điểm đậu theo ngành nghề:</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {examInfo.map((e) => (
              <div key={e.label} className={`${e.bg} rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-extrabold ${e.color} mb-1`}>{e.score}</div>
                <div className="text-xs text-gray-600 font-medium">{e.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-blue-400 rounded-full inline-block"></span>25 câu Nghe hiểu</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>25 câu Đọc hiểu</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-orange-400 rounded-full inline-block"></span>Tổng 70 phút</span>
          </div>
        </div>
      </section>

      {/* Free Lessons */}
      <section id="lessons" className="bg-blue-500 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-full mb-4">
              <span>🎁</span>
              <span>Miễn phí, không cần đăng ký</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Thử ngay 3 bài học đầu tiên</h2>
            <p className="text-blue-100 text-sm">Click vào bài để bắt đầu học ngay</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {freeLessons.map((lesson) => (
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
                  <span className="text-xs text-gray-400">⏱ {lesson.duration}</span>
                  <span className="text-blue-500 font-semibold text-sm group-hover:translate-x-0.5 transition-transform">
                    Học ngay →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why HanViet EPS */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tại sao chọn HanViet EPS?</h2>
          <p className="text-gray-500">So sánh thực tế với cách học truyền thống</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reasons.map((c, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="bg-red-50 p-4 border-b border-gray-100">
                <div className="text-xs font-semibold text-red-400 mb-2">VẤN ĐỀ HIỆN TẠI</div>
                <p className="text-sm text-gray-600">{c.pain}</p>
              </div>
              <div className="bg-green-50 p-4">
                <div className="text-xs font-semibold text-green-600 mb-2">VỚI HANVIET EPS</div>
                <p className="text-sm text-gray-700 font-medium">{c.gain}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section id="register" className="bg-blue-500 py-20">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="text-4xl mb-5">🎯</div>
          <h2 className="text-3xl font-extrabold text-white mb-3">
            Sẵn sàng đỗ EPS-TOPIK?
          </h2>
          <p className="text-blue-100 text-base mb-8 leading-relaxed">
            Đăng ký để lưu tiến độ học, nhận nhắc ôn tập hàng ngày<br />
            và luyện đề thi thử không giới hạn.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-600 font-bold text-base px-10 py-4 rounded-xl transition-colors"
          >
            Đăng ký miễn phí →
          </Link>
          <p className="text-blue-200 text-xs mt-4">3 bài miễn phí mỗi ngày · Premium chỉ 99K/tháng</p>
        </div>
      </section>

      <FloatingCTA />

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🇰🇷</span>
            <span className="font-semibold text-gray-700">HanViet EPS</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 HanViet · Luyện thi EPS-TOPIK cho người Việt</p>
        </div>
      </footer>
    </div>
  )
}
