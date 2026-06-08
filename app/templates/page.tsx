"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Sidebar from "@/app/components/Sidebar"

type Template = {
  id: string
  qType: "q51" | "q52" | "q53" | "q54"
  subType: string
  title: string
  badge: string
  badgeColor: string
  headerColor: string
  template_kr: string
  template_vi: string
  note: string
  expressions: Array<{ kr: string; vi: string; usage: string }>
}

const TEMPLATES: Template[] = [
  // Q51
  {
    id: "q51-letter",
    qType: "q51",
    subType: "Thư / Email",
    title: "Thư cảm ơn / xin lỗi / đề nghị",
    badge: "Q51",
    badgeColor: "bg-blue-100 text-blue-700",
    headerColor: "border-blue-200 bg-blue-50",
    template_kr: `[수신인]께

안녕하세요. 저는 [자기 소개]입니다.
이번에 [목적/이유]로 편지를 드립니다.

[내용 1 — ㄱ 빈칸 영역]
(   ㄱ   ).

[내용 2 — ㄴ 빈칸 영역]
(   ㄴ   ).

감사합니다.
[발신인] 드림`,
    template_vi: `Gửi [người nhận],

Xin chào. Tôi là [giới thiệu bản thân].
Tôi viết thư này vì [mục đích/lý do].

[Nội dung 1 — vùng chỗ trống ㄱ]
(   ㄱ   ).

[Nội dung 2 — vùng chỗ trống ㄴ]
(   ㄴ   ).

Xin cảm ơn.
[Người gửi] kính gửi`,
    note: "Thể văn 습니다체. Câu điền phải logic với đoạn trước/sau. Kết thúc bằng 습니다/ㅂ니다.",
    expressions: [
      { kr: "~아/어 주셔서 감사합니다", vi: "Cảm ơn vì đã...", usage: "Câu cảm ơn" },
      { kr: "~기를 바랍니다", vi: "Mong rằng...", usage: "Lời chúc / mong muốn" },
      { kr: "~을/를 부탁드립니다", vi: "Kính nhờ... / Xin hãy...", usage: "Đề nghị lịch sự" },
      { kr: "~을/를 알려 드립니다", vi: "Xin thông báo về...", usage: "Thông báo" },
    ],
  },
  {
    id: "q51-notice",
    qType: "q51",
    subType: "Thông báo / Thư mời",
    title: "Thông báo sự kiện / Thư mời tham dự",
    badge: "Q51",
    badgeColor: "bg-blue-100 text-blue-700",
    headerColor: "border-blue-200 bg-blue-50",
    template_kr: `[공지 제목]

안녕하십니까.
[기관/단체]에서 [행사 소개]를 안내해 드립니다.

행사 일정: [날짜/시간]
장소: [장소]

(   ㄱ   ).

참가를 원하시는 분은 (   ㄴ   ).

감사합니다.`,
    template_vi: `[Tiêu đề thông báo]

Xin chào quý vị.
[Tổ chức] xin thông báo về [giới thiệu sự kiện].

Lịch sự kiện: [ngày/giờ]
Địa điểm: [địa điểm]

(   ㄱ   ).

Những ai muốn tham gia, (   ㄴ   ).

Xin cảm ơn.`,
    note: "Thể văn 습니다체. ㄱ thường là thông tin thêm về sự kiện. ㄴ thường là hướng dẫn đăng ký.",
    expressions: [
      { kr: "~을/를 안내해 드립니다", vi: "Xin thông báo/hướng dẫn về...", usage: "Mở đầu thông báo" },
      { kr: "참가 신청은 ~까지 해 주시기 바랍니다", vi: "Xin đăng ký tham gia trước...", usage: "Hạn đăng ký" },
      { kr: "문의 사항은 ~로 연락해 주십시오", vi: "Thắc mắc xin liên hệ...", usage: "Liên hệ" },
      { kr: "많은 참여 바랍니다", vi: "Mong đông đảo tham gia", usage: "Kết thúc thông báo" },
    ],
  },
  // Q52
  {
    id: "q52-contrast",
    qType: "q52",
    subType: "Tương phản / Bổ sung",
    title: "Câu tương phản (반면, 그러나)",
    badge: "Q52",
    badgeColor: "bg-blue-100 text-blue-700",
    headerColor: "border-blue-200 bg-blue-50",
    template_kr: `[주제문]. [배경/문제 제기].

[근거 A]. 반면 (   ㄱ   ).

[근거 B]. 이처럼 (   ㄴ   ).`,
    template_vi: `[Câu chủ đề]. [Bối cảnh/đặt vấn đề].

[Luận điểm A]. Ngược lại, (   ㄱ   ).

[Luận điểm B]. Như vậy, (   ㄴ   ).`,
    note: "Thể văn 다/ㄴ다체. ㄱ thường đối lập với câu trước (반면/그러나). ㄴ thường là kết luận/tổng kết.",
    expressions: [
      { kr: "반면(에)", vi: "Ngược lại / Trong khi đó", usage: "Tương phản" },
      { kr: "이와 달리", vi: "Khác với điều này", usage: "Đối lập" },
      { kr: "이처럼", vi: "Như vậy / Như thế này", usage: "Kết luận dẫn dắt" },
      { kr: "그러므로", vi: "Do đó / Vì vậy", usage: "Kết luận nhân quả" },
    ],
  },
  {
    id: "q52-reason",
    qType: "q52",
    subType: "Nguyên nhân / Kết quả",
    title: "Câu nguyên nhân – kết quả (왜냐하면, 따라서)",
    badge: "Q52",
    badgeColor: "bg-blue-100 text-blue-700",
    headerColor: "border-blue-200 bg-blue-50",
    template_kr: `[주제 제시]. 왜냐하면 (   ㄱ   ).

[결과/영향 설명]. 따라서 (   ㄴ   ).`,
    template_vi: `[Nêu chủ đề]. Bởi vì (   ㄱ   ).

[Giải thích kết quả/ảnh hưởng]. Do đó, (   ㄴ   ).`,
    note: "Thể văn 다/ㄴ다체. ㄱ thường là lý do/nguyên nhân. ㄴ thường là kết luận hoặc kêu gọi.",
    expressions: [
      { kr: "왜냐하면 ~기 때문이다", vi: "Bởi vì...", usage: "Nêu nguyên nhân" },
      { kr: "따라서", vi: "Do đó / Vì vậy", usage: "Kết luận logic" },
      { kr: "그 결과", vi: "Kết quả là", usage: "Nêu hệ quả" },
      { kr: "이로 인해", vi: "Do điều này / Vì điều này", usage: "Nguyên nhân dẫn đến" },
    ],
  },
  // Q53
  {
    id: "q53-bar",
    qType: "q53",
    subType: "Biểu đồ cột / Khảo sát",
    title: "Phân tích biểu đồ khảo sát",
    badge: "Q53",
    badgeColor: "bg-blue-100 text-blue-700",
    headerColor: "border-blue-200 bg-blue-50",
    template_kr: `위 그래프는 [조사 대상]을 대상으로 [조사 내용]을 조사한 결과이다.

[1위 항목]이 [수치]%로 가장 높게 나타났으며, 다음으로 [2위 항목]이 [수치]%, [3위 항목]이 [수치]%로 그 뒤를 이었다.

한편, [비교 대상 A]와 [비교 대상 B]를 비교해 보면 [비교 내용]이라는 차이가 있었다.

이를 통해 [결론/시사점]을 알 수 있다.`,
    template_vi: `Biểu đồ trên là kết quả khảo sát [đối tượng khảo sát] về [nội dung khảo sát].

[Hạng 1] chiếm [số liệu]%, cao nhất, tiếp theo là [Hạng 2] với [số liệu]%, và [Hạng 3] với [số liệu]%.

Khi so sánh [đối tượng A] và [đối tượng B], có sự khác biệt là [nội dung so sánh].

Qua đó, có thể thấy [kết luận/hàm ý].`,
    note: "200–300 chữ. Thể văn 다/ㄴ다체. Không thêm ý kiến cá nhân. Mô tả số liệu chính xác, tìm sự tương đồng/khác biệt nổi bật.",
    expressions: [
      { kr: "~이/가 ~%로 가장 높게 나타났다", vi: "... chiếm ...%, cao nhất", usage: "Nêu hạng 1" },
      { kr: "다음으로 ~이/가 ~%로 그 뒤를 이었다", vi: "Tiếp theo là... với ...%", usage: "Hạng 2 trở đi" },
      { kr: "~에 비해 ~배 높다/낮다", vi: "Cao/thấp hơn... lần so với...", usage: "So sánh tương đối" },
      { kr: "이를 통해 ~을/를 알 수 있다", vi: "Qua đó có thể thấy...", usage: "Kết luận" },
    ],
  },
  {
    id: "q53-change",
    qType: "q53",
    subType: "Thay đổi theo thời gian",
    title: "Biểu đồ xu hướng thay đổi",
    badge: "Q53",
    badgeColor: "bg-blue-100 text-blue-700",
    headerColor: "border-blue-200 bg-blue-50",
    template_kr: `위 그래프는 [기간] 동안의 [주제] 변화를 나타낸 것이다.

[시작 시점]에는 [수치]이었으나, [끝 시점]에는 [수치]로 [증가/감소]하였다. 특히 [중간 시점]에 [특징적인 변화]를 보였다.

이러한 변화의 원인으로는 [원인 1]과 [원인 2]을/를 들 수 있다.

이를 통해 [결론]을 알 수 있다.`,
    template_vi: `Biểu đồ trên thể hiện sự thay đổi của [chủ đề] trong giai đoạn [khoảng thời gian].

Vào [thời điểm đầu] là [số liệu], nhưng đến [thời điểm cuối] đã [tăng/giảm] xuống còn [số liệu]. Đặc biệt, vào [thời điểm giữa] có [đặc điểm thay đổi nổi bật].

Nguyên nhân của sự thay đổi này có thể kể đến [nguyên nhân 1] và [nguyên nhân 2].

Qua đó có thể thấy [kết luận].`,
    note: "200–300 chữ. Mô tả xu hướng (증가/감소/유지), nêu điểm đặc biệt, tìm nguyên nhân nếu đề cho.",
    expressions: [
      { kr: "~에서 ~(으)로 증가/감소하였다", vi: "Tăng/giảm từ... đến...", usage: "Thay đổi có số liệu" },
      { kr: "꾸준히 증가/감소하는 추세를 보였다", vi: "Cho thấy xu hướng tăng/giảm đều đặn", usage: "Xu hướng ổn định" },
      { kr: "급격히 증가/감소하였다", vi: "Tăng/giảm đột biến", usage: "Thay đổi mạnh" },
      { kr: "~의 원인으로는 ~을/를 들 수 있다", vi: "Nguyên nhân của... có thể kể đến...", usage: "Nêu nguyên nhân" },
    ],
  },
  // Q54
  {
    id: "q54-pros-cons",
    qType: "q54",
    subType: "Ưu & Nhược điểm",
    title: "Cấu trúc 2 mặt lợi/hại (찬반)",
    badge: "Q54",
    badgeColor: "bg-gray-100 text-blue-700",
    headerColor: "border-gray-200 bg-gray-50",
    template_kr: `[주제]에 대해 다양한 시각이 존재한다.

[주제]의 긍정적인 측면으로는 먼저 [장점 1]을/를 들 수 있다. [장점 1 설명 + 예시]. 또한 [장점 2]도 빼놓을 수 없다. [장점 2 설명].

반면, 부정적인 측면도 존재한다. [단점 1]이/가 대표적인 문제로 지적된다. [단점 1 설명]. 더불어 [단점 2]라는 우려도 있다. [단점 2 설명].

이러한 점들을 고려할 때, [균형 있는 결론 + 향후 방향].`,
    template_vi: `Có nhiều góc nhìn khác nhau về [chủ đề].

Về mặt tích cực của [chủ đề], trước tiên có thể kể đến [ưu điểm 1]. [Giải thích + ví dụ ưu điểm 1]. Ngoài ra, [ưu điểm 2] cũng không thể bỏ qua. [Giải thích ưu điểm 2].

Ngược lại, cũng tồn tại những mặt tiêu cực. [Nhược điểm 1] được chỉ ra là vấn đề tiêu biểu. [Giải thích nhược điểm 1]. Bên cạnh đó, cũng có lo ngại về [nhược điểm 2]. [Giải thích nhược điểm 2].

Xét đến những điểm này, [kết luận cân bằng + hướng tới].`,
    note: "600–700 chữ. Thể văn 합쇼체 (다/ㄴ다체 học thuật). Cấu trúc: Mở đề → 2 ưu điểm → 2 nhược điểm → Kết luận. KHÔNG dùng 해요/습니다.",
    expressions: [
      { kr: "~의 긍정적인 측면으로는", vi: "Về mặt tích cực của...", usage: "Mở phần ưu điểm" },
      { kr: "반면, 부정적인 측면도 존재한다", vi: "Ngược lại, cũng tồn tại mặt tiêu cực", usage: "Chuyển sang nhược điểm" },
      { kr: "~을/를 들 수 있다", vi: "Có thể kể đến...", usage: "Liệt kê dẫn chứng" },
      { kr: "이러한 점들을 고려할 때", vi: "Xét đến những điểm này", usage: "Mở kết luận" },
    ],
  },
  {
    id: "q54-problem-solution",
    qType: "q54",
    subType: "Vấn đề & Giải pháp",
    title: "Cấu trúc vấn đề – giải pháp (문제-해결)",
    badge: "Q54",
    badgeColor: "bg-gray-100 text-blue-700",
    headerColor: "border-gray-200 bg-gray-50",
    template_kr: `오늘날 [사회 문제]가 심각한 사회 문제로 대두되고 있다. [문제 배경/현황 설명].

이러한 문제가 발생하는 원인은 크게 두 가지로 볼 수 있다. 첫째, [원인 1]. [원인 1 설명]. 둘째, [원인 2]. [원인 2 설명].

이 문제를 해결하기 위한 방안으로는 다음과 같은 것들을 생각해 볼 수 있다. 먼저 [해결책 1]. [해결책 1 설명]. 또한 [해결책 2]도 필요하다. [해결책 2 설명].

결론적으로, [문제]은/는 [핵심 해결 방향]을 통해 극복할 수 있을 것이다.`,
    template_vi: `Ngày nay, [vấn đề xã hội] đang nổi lên như một vấn đề xã hội nghiêm trọng. [Giải thích bối cảnh/hiện trạng vấn đề].

Nguyên nhân dẫn đến vấn đề này có thể chia thành hai nhóm chính. Thứ nhất, [nguyên nhân 1]. [Giải thích nguyên nhân 1]. Thứ hai, [nguyên nhân 2]. [Giải thích nguyên nhân 2].

Để giải quyết vấn đề này, có thể xem xét những biện pháp sau. Trước tiên, [giải pháp 1]. [Giải thích giải pháp 1]. Ngoài ra, [giải pháp 2] cũng cần thiết. [Giải thích giải pháp 2].

Kết luận lại, [vấn đề] có thể được vượt qua thông qua [hướng giải quyết cốt lõi].`,
    note: "600–700 chữ. Cấu trúc 4 đoạn: Hiện trạng → Nguyên nhân (2) → Giải pháp (2) → Kết luận. Mỗi đoạn ~130-150 chữ.",
    expressions: [
      { kr: "심각한 사회 문제로 대두되고 있다", vi: "Đang nổi lên như vấn đề xã hội nghiêm trọng", usage: "Mở đề nêu vấn đề" },
      { kr: "이 문제의 원인으로는 ~을/를 들 수 있다", vi: "Nguyên nhân của vấn đề này có thể kể đến...", usage: "Nêu nguyên nhân" },
      { kr: "이를 해결하기 위해서는 ~이/가 필요하다", vi: "Để giải quyết điều này, cần...", usage: "Nêu giải pháp" },
      { kr: "결론적으로", vi: "Kết luận lại", usage: "Mở kết luận" },
    ],
  },
]

const Q_FILTER = ["all", "q51", "q52", "q53", "q54"] as const
type QFilter = typeof Q_FILTER[number]

const Q_LABELS: Record<QFilter, string> = {
  all: "Tất cả",
  q51: "Q51 — Thực dụng văn",
  q52: "Q52 — Nghị luận ngắn",
  q53: "Q53 — Phân tích biểu đồ",
  q54: "Q54 — Bài luận",
}

// localStorage key cho template checkpoint
export function tplCheckpointKey(qTypes: string[]) {
  return `hanviet_tpl_done_${[...qTypes].sort().join(",")}`
}

function TemplatesInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // ?q=q51,q52 — filter param tu stage page
  const qParam = searchParams.get("q") // "q51,q52" hoac null
  // ?from=stage — biet user den tu stage page de hien nut checkpoint
  const fromStage = searchParams.get("from") === "stage"

  const initialFilter: QFilter = (() => {
    if (!qParam) return "all"
    const first = qParam.split(",")[0]
    if (["q51", "q52", "q53", "q54"].includes(first)) return first as QFilter
    return "all"
  })()

  const [filter, setFilter] = useState<QFilter>(initialFilter)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [scrolledToBottom, setScrolledToBottom] = useState(false)
  const [alreadyDone, setAlreadyDone] = useState(false)

  // Neu co qParam, loc theo tat ca cac Q types trong param
  const allowedQTypes = qParam ? qParam.split(",") : null

  useEffect(() => {
    if (allowedQTypes) {
      const key = tplCheckpointKey(allowedQTypes)
      setAlreadyDone(localStorage.getItem(key) === "1")
    }
  }, [qParam])

  // Track scroll de enable nut checkpoint
  useEffect(() => {
    if (!fromStage) return
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 200
      if (nearBottom) setScrolledToBottom(true)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [fromStage])

  function handleMarkDone() {
    if (!allowedQTypes) return
    const key = tplCheckpointKey(allowedQTypes)
    localStorage.setItem(key, "1")
    router.push("/learning-path/stage")
  }

  // Templates hien thi — neu co qParam thi chi hien nhung Q type trong param
  const filtered = (() => {
    if (allowedQTypes) {
      const filtered = TEMPLATES.filter((t) => allowedQTypes.includes(t.qType))
      return filter === "all" ? filtered : filtered.filter((t) => t.qType === filter)
    }
    return filter === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.qType === filter)
  })()

  const active = TEMPLATES.find((t) => t.id === activeId)

  // Tabs to hien — neu co qParam thi chi hien cac Q types lien quan + "all"
  const visibleFilters: QFilter[] = allowedQTypes
    ? (["all", ...allowedQTypes] as QFilter[])
    : (Q_FILTER as unknown as QFilter[])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-56 flex-1 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          {fromStage ? (
            <>
              <Link href="/learning-path/stage" className="text-gray-400 hover:text-gray-600 text-sm">
                ← Giai đoạn
              </Link>
              <div className="w-px h-4 bg-gray-200" />
            </>
          ) : (
            <>
              <Link href="/practice" className="text-gray-400 hover:text-gray-600 text-sm">← Luyện viết</Link>
              <div className="w-px h-4 bg-gray-200" />
            </>
          )}
          <span className="font-bold text-gray-900">📋 Templates</span>
          {allowedQTypes && (
            <span className="text-xs text-blue-600 bg-blue-50 font-bold px-2.5 py-1 rounded-full">
              Lọc: {allowedQTypes.map(q => q.toUpperCase()).join(" + ")}
            </span>
          )}
          {!allowedQTypes && <p className="text-sm text-gray-500 ml-1">Mẫu câu & cấu trúc cho Q51–Q54</p>}
          {fromStage && alreadyDone && (
            <span className="ml-auto text-xs text-blue-600 bg-blue-50 font-bold px-3 py-1 rounded-full">✓ Đã học xong</span>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {visibleFilters.map((q) => (
            <button
              key={q}
              onClick={() => setFilter(q)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filter === q
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {Q_LABELS[q as QFilter] ?? q.toUpperCase()}
            </button>
          ))}
          {allowedQTypes && (
            <Link
              href="/templates"
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-dashed border-gray-300 text-gray-400 hover:text-gray-600 transition-colors"
            >
              Xem tất cả Q51–Q54
            </Link>
          )}
        </div>

        {activeId ? (
          /* Detail view */
          <div>
            <button
              onClick={() => setActiveId(null)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
              ← Quay lại danh sách
            </button>
            {active && (
              <div className="grid grid-cols-2 gap-6">
                {/* Left: Template tiếng Hàn */}
                <div className="space-y-4">
                  <div className={`bg-white rounded-2xl border p-6 ${active.headerColor}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${active.badgeColor}`}>{active.badge}</span>
                      <span className="text-xs text-gray-500">{active.subType}</span>
                    </div>
                    <h2 className="font-bold text-gray-900 text-lg mb-4">{active.title}</h2>
                    <div className="bg-white rounded-xl p-4 font-mono text-sm text-gray-700 leading-relaxed whitespace-pre-line border border-gray-100">
                      {active.template_kr}
                    </div>
                    <div className="mt-3 bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs text-gray-700">
                      <span className="font-bold">Lưu ý:</span> {active.note}
                    </div>
                  </div>
                </div>

                {/* Right: Dịch + biểu đạt */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-3">Template (tiếng Việt)</h3>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                      {active.template_vi}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Biểu đạt quan trọng</h3>
                    <div className="space-y-3">
                      {active.expressions.map((e, i) => (
                        <div key={i} className="bg-blue-50 rounded-xl p-3">
                          <div className="font-mono text-sm text-blue-900 font-semibold mb-1">{e.kr}</div>
                          <div className="text-xs text-blue-700 mb-1">→ {e.vi}</div>
                          <div className="text-xs text-gray-500 bg-white rounded-lg px-2 py-1 inline-block">{e.usage}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={`/practice/${active.qType}`}
                    className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                  >
                    Luyện {active.badge} ngay →
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* List view */
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className="bg-white rounded-2xl border border-gray-100 p-5 text-left hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.badgeColor}`}>{t.badge}</span>
                  <span className="text-xs text-gray-400">{t.subType}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-blue-600 transition-colors">{t.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{t.note}</p>
                <div className="mt-3 text-xs text-blue-500 font-medium">Xem template →</div>
              </button>
            ))}
          </div>
        )}

        {/* Checkpoint banner — chi hien khi den tu stage page */}
        {fromStage && !alreadyDone && !activeId && (
          <div className="mt-8 bg-white rounded-2xl border border-blue-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-900 mb-1">
                  {scrolledToBottom ? "✓ Đã xem hết templates?" : "📖 Hãy xem hết các templates ở trên"}
                </div>
                <p className="text-sm text-gray-500">
                  {scrolledToBottom
                    ? "Bấm nút bên phải để đánh dấu hoàn thành bước này và quay lại lộ trình."
                    : "Cuộn xuống để đọc hết, sau đó đánh dấu hoàn thành."}
                </p>
              </div>
              <button
                onClick={handleMarkDone}
                disabled={!scrolledToBottom}
                className={`shrink-0 ml-6 font-bold text-sm px-6 py-3 rounded-xl transition-all ${
                  scrolledToBottom
                    ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {scrolledToBottom ? "Đánh dấu đã học xong ✓" : "Đọc hết rồi đánh dấu"}
              </button>
            </div>
            {scrolledToBottom && (
              <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full w-full transition-all" />
              </div>
            )}
          </div>
        )}

        {/* Da hoan thanh banner */}
        {fromStage && alreadyDone && !activeId && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">✓</div>
              <div>
                <div className="font-bold text-blue-800">Bước này đã hoàn thành!</div>
                <p className="text-xs text-blue-600">Tiếp tục thực hành để vượt qua giai đoạn.</p>
              </div>
            </div>
            <Link
              href="/learning-path/stage"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Quay lại giai đoạn →
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="ml-56 flex-1 p-8 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Đang tải...</div>
        </main>
      </div>
    }>
      <TemplatesInner />
    </Suspense>
  )
}
