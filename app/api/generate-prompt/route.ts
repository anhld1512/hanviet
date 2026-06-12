import { NextRequest, NextResponse } from "next/server"
import { checkPromptUsage, incrementPromptUsage } from "@/lib/usage"

const OPENROUTER_API_KEY = process.env.DEEPSEEK_API_KEY!

export const maxDuration = 60

const PROMPTS: Record<string, string> = {
  q51: `Bạn là chuyên gia ra đề thi TOPIK II chính thức. Tạo 1 đề Q51 실용문 (văn thực dụng) điền câu vào chỗ trống.

CẤU TRÚC ĐỀ THẬT TOPIK Q51:
- Thể loại: thư/thông báo/email thực tế, thể 합쇼체 (-습니다/-ㅂ니다)
- Đúng 2 chỗ trống (   ㄱ   ) và (   ㄴ   ) nằm ở CUỐI câu trong đoạn văn
- Mỗi chỗ trống cần 1 câu hoàn chỉnh ~15-25자, test 1 grammar pattern cụ thể
- Blank ㄱ thường test: lý do/nguyên nhân (-아/어서, -(으)ㄴ/는 바람에, -기 때문에)
- Blank ㄴ thường test: yêu cầu/đề nghị/thông báo kết quả (-(으)시기 바랍니다, -(으)면 좋겠습니다, -도록 하겠습니다)
- Độ dài đoạn văn: 150-180자

CHỦ ĐỀ THỜI SỰ (chọn ngẫu nhiên 1 trong các hướng sau, KHÔNG lặp chủ đề nhàm chán):
- Thông báo sử dụng AI/ChatGPT trong dịch vụ công ty
- Email về chính sách làm việc hybrid/remote mới
- Thư mời tham gia chương trình tái chế/bảo vệ môi trường
- Thông báo về hệ thống giao hàng robot tự động
- Email hỗ trợ sức khỏe tâm thần cho nhân viên
- Thông báo chương trình giảm giờ làm (주 4일제 thí điểm)
- Thư về chính sách không dùng đồ nhựa một lần
- Thông báo ứng dụng thanh toán/đặt lịch mới của cơ sở

QUY TẮC NGÔN NGỮ BẮT BUỘC:
- "context": PHẢI VIẾT BẰNG TIẾNG VIỆT
- "hint": PHẢI VIẾT BẰNG TIẾNG VIỆT (mô tả nội dung cần điền)
- "pattern": PHẢI VIẾT BẰNG TIẾNG VIỆT (tên grammar pattern)
- "text_kr" và "example": viết bằng tiếng Hàn

Trả về JSON hợp lệ (không có markdown):
{
  "context": "Mô tả ngắn tình huống bằng TIẾNG VIỆT",
  "text_kr": "Toàn bộ đoạn thư tiếng Hàn có (   ㄱ   ) và (   ㄴ   ), mỗi chỗ trống nằm cuối câu",
  "difficulty": "easy",
  "blanks": [
    { "key": "ㄱ", "hint": "Nội dung cần điền — TIẾNG VIỆT (15-25자)", "example": "Câu hoàn chỉnh tiếng Hàn ~20자", "pattern": "Tên pattern ngữ pháp — TIẾNG VIỆT" },
    { "key": "ㄴ", "hint": "Nội dung cần điền — TIẾNG VIỆT (15-25자)", "example": "Câu hoàn chỉnh tiếng Hàn ~20자", "pattern": "Tên pattern ngữ pháp — TIẾNG VIỆT" }
  ]
}`,

  q52: `Bạn là chuyên gia ra đề thi TOPIK II chính thức. Tạo 1 đề Q52 단문 쓰기 (văn luận ngắn) điền câu vào chỗ trống.

CẤU TRÚC ĐỀ THẬT TOPIK Q52:
- Đoạn văn học thuật/phân tích, thể 다체 (-다, -이다, -(으)ㄹ 수 있다)
- Đúng 2 chỗ trống (   ㄱ   ) và (   ㄴ   )
- QUAN TRỌNG: mỗi chỗ trống cần 1 MỆNH ĐỀ HOÀN CHỈNH ~25-45자, KHÔNG phải chỉ 1 từ nối
- Blank ㄱ thường là: mệnh đề nguyên nhân/tương phản dẫn vào luận điểm chính
- Blank ㄴ thường là: kết luận/hệ quả logic từ toàn đoạn
- Cấu trúc đoạn: [câu chủ đề] → [luận cứ 1] → (   ㄱ   ) → [luận cứ 2] → (   ㄴ   )
- Độ dài: 200-230자

CHỦ ĐỀ THỜI SỰ (chọn ngẫu nhiên 1, TRÁNH: 환경오염, 인터넷 중독 vì quá cũ):
- Tác động của AI tạo sinh đến thị trường lao động
- Văn hóa "조용한 사직" (quiet quitting) và gắn kết nhân viên
- Kinh tế gig / lao động tự do tăng mạnh
- Khủng hoảng nhà ở và thế hệ trẻ Hàn Quốc
- Tác động của nội dung short-form đến khả năng tập trung
- Xu hướng tiêu dùng có ý thức / mua đồ secondhand
- Dân số già hóa và gánh nặng phúc lợi xã hội
- Sức khỏe tâm thần và áp lực thành tích ở Hàn Quốc

QUY TẮC NGÔN NGỮ BẮT BUỘC:
- "context": PHẢI VIẾT BẰNG TIẾNG VIỆT
- "hint": PHẢI VIẾT BẰNG TIẾNG VIỆT (mô tả đầy đủ nội dung mệnh đề cần điền)
- "pattern": PHẢI VIẾT BẰNG TIẾNG VIỆT
- "text_kr" và "example": viết bằng tiếng Hàn

Trả về JSON hợp lệ (không có markdown):
{
  "context": "Mô tả chủ đề bằng TIẾNG VIỆT",
  "text_kr": "Đoạn văn học thuật tiếng Hàn, 2 chỗ trống là mệnh đề hoàn chỉnh",
  "difficulty": "medium",
  "blanks": [
    { "key": "ㄱ", "hint": "Mô tả mệnh đề cần viết — TIẾNG VIỆT (25-45자)", "example": "Mệnh đề hoàn chỉnh tiếng Hàn ~35자", "pattern": "Cấu trúc ngữ pháp — TIẾNG VIỆT" },
    { "key": "ㄴ", "hint": "Mô tả mệnh đề kết luận cần viết — TIẾNG VIỆT (25-45자)", "example": "Mệnh đề hoàn chỉnh tiếng Hàn ~35자", "pattern": "Cấu trúc ngữ pháp — TIẾNG VIỆT" }
  ]
}`,

  q53: `Bạn là chuyên gia ra đề thi TOPIK II chính thức. Tạo 1 đề Q53 도표 설명 (phân tích biểu đồ).

CẤU TRÚC ĐỀ THẬT TOPIK Q53:
- Biểu đồ kết quả khảo sát thực tế của Hàn Quốc (통계청, 여성가족부, 교육부...)
- 4-6 hạng mục, phần trăm hợp lý (tổng = 100% hoặc câu hỏi nhiều lựa chọn)
- text_kr PHẢI có đúng format chuẩn TOPIK:
  "[제목]. 다음은 [조사기관]에서 [조사대상]을 대상으로 실시한 '[설문 주제]'에 대한 조사 결과이다. 이를 참고하여 200~300자로 쓰십시오. (단, 글의 제목을 쓰지 마십시오.)"

CHỦ ĐỀ THỜI SỰ (chọn ngẫu nhiên 1, số liệu phải hợp lý với thực tế Hàn Quốc):
- Mục đích sử dụng AI trong cuộc sống hàng ngày
- Lý do giới trẻ không kết hôn hoặc không sinh con
- Phương thức học tập ưa thích sau đại dịch
- Nguồn thông tin tin tức người Hàn tin dùng
- Lý do chọn mua đồ cũ / secondhand
- Hoạt động giải trí trong giờ nghỉ trưa của nhân viên văn phòng
- Mức độ lo ngại về thay thế việc làm bởi AI
- Yếu tố quyết định khi chọn nơi ở của thế hệ MZ

QUY TẮC NGÔN NGỮ BẮT BUỘC:
- "context": PHẢI VIẾT BẰNG TIẾNG VIỆT
- "chart_data.title": tiếng Hàn
- "chart_data.items[].label": tiếng Hàn
- "text_kr": tiếng Hàn (đúng format chuẩn TOPIK như trên)

Trả về JSON hợp lệ (không có markdown):
{
  "context": "Mô tả chủ đề biểu đồ bằng TIẾNG VIỆT",
  "text_kr": "Format chuẩn TOPIK: [제목]. 다음은 [기관]에서 [대상]을 대상으로 실시한 '[주제]'에 대한 조사 결과이다. 이를 참고하여 200~300자로 쓰십시오. (단, 글의 제목을 쓰지 마십시오.)",
  "difficulty": "medium",
  "chart_data": {
    "title": "Tiêu đề biểu đồ tiếng Hàn",
    "items": [
      { "label": "Nhãn tiếng Hàn", "percent": 35 },
      { "label": "Nhãn tiếng Hàn", "percent": 28 },
      { "label": "Nhãn tiếng Hàn", "percent": 22 },
      { "label": "Nhãn tiếng Hàn", "percent": 15 }
    ]
  }
}`,

  q54: `Bạn là chuyên gia ra đề thi TOPIK II chính thức. Tạo 1 đề Q54 주제 글쓰기 (bài luận chủ đề).

CẤU TRÚC ĐỀ THẬT TOPIK Q54:
- Câu dẫn nhập nêu vấn đề xã hội (1-2 câu tiếng Hàn)
- Đúng 3 câu hỏi phụ ①②③ để định hướng bài viết:
  ① thường hỏi: hiện trạng / nguyên nhân / định nghĩa
  ② thường hỏi: tác động tích cực/tiêu cực / các quan điểm
  ③ thường hỏi: giải pháp / hướng phát triển / quan điểm cá nhân
- Kết thúc bằng: "위의 내용을 중심으로 하여 자신의 생각을 600~700자로 쓰십시오. (단, 문제를 그대로 옮겨 쓰지 마십시오.)"
- Thể văn: 다체

CHỦ ĐỀ THỜI SỰ HÀN QUỐC (chọn ngẫu nhiên 1, TRÁNH: 인터넷 중독, 환경오염 vì quá cũ):
- Trí tuệ nhân tạo và tương lai việc làm (인공지능과 일자리)
- Văn hóa làm việc 4 ngày/tuần (주 4일제 근무)
- Khủng hoảng nhà ở và thế hệ trẻ (청년 주거 문제)
- Mạng xã hội và sức khỏe tâm thần giới trẻ (SNS와 정신 건강)
- Nội dung short-form và sự tập trung (숏폼 콘텐츠와 집중력)
- Giao hàng nhanh và văn hóa tiêu dùng tức thì (퀵커머스 문화)
- Già hóa dân số và hệ thống phúc lợi (고령화와 복지 시스템)
- Lao động nền tảng / gig economy (플랫폼 노동)
- Du lịch trải nghiệm địa phương thay vì đại đô thị (로컬 여행 트렌드)
- Văn hóa "조용한 사직" và động lực làm việc

QUY TẮC NGÔN NGỮ BẮT BUỘC:
- "context": PHẢI VIẾT BẰNG TIẾNG VIỆT
- "topic": PHẢI VIẾT BẰNG TIẾNG VIỆT (ngắn gọn, dưới 8 từ)
- "text_kr": tiếng Hàn (đúng format chuẩn với ①②③ và câu lệnh cuối)

Trả về JSON hợp lệ (không có markdown):
{
  "context": "Mô tả chủ đề bằng TIẾNG VIỆT",
  "topic": "Tên chủ đề ngắn TIẾNG VIỆT",
  "text_kr": "[Câu dẫn nhập vấn đề]\\n\\n① [câu hỏi 1]\\n② [câu hỏi 2]\\n③ [câu hỏi 3]\\n\\n위의 내용을 중심으로 하여 자신의 생각을 600~700자로 쓰십시오. (단, 문제를 그대로 옮겨 쓰지 마십시오.)",
  "difficulty": "hard"
}`,
}

// Goi DeepSeek voi retry tu dong (toi da MAX_RETRIES lan)
// Xu ly ca: HTTP 5xx, content rong, JSON parse loi
const MAX_RETRIES = 1
const RETRY_DELAY_MS = 300

async function callDeepSeekWithRetry(userPrompt: string): Promise<Record<string, unknown>> {
  let lastError: unknown

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      // Doi truoc khi retry, tranh hammer API
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt))
      console.warn(`[generate-prompt] Retry attempt ${attempt}/${MAX_RETRIES}`)
    }

    try {
      const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          max_tokens: 1200,
          temperature: 1.0,
          messages: [
            {
              role: "system",
              content:
                "You are a TOPIK II exam question creator. Output ONLY valid JSON. No markdown fences, no explanation, no extra text.",
            },
            { role: "user", content: userPrompt },
          ],
        }),
      })

      // HTTP-level error (5xx, 429, etc.)
      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText)
        lastError = new Error(`DeepSeek HTTP ${res.status}: ${errText.slice(0, 200)}`)
        console.error(`[generate-prompt] attempt ${attempt} HTTP error:`, lastError)
        continue // retry
      }

      const data = await res.json()
      const raw: string = data.choices?.[0]?.message?.content ?? ""

      // Content rong -> retry
      if (!raw.trim()) {
        lastError = new Error("DeepSeek returned empty content")
        console.error(`[generate-prompt] attempt ${attempt} empty content`)
        continue
      }

      // Strip markdown fences neu co
      const clean = raw.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim()

      // JSON parse loi -> retry (output bi truncate hoac format sai)
      let parsed: Record<string, unknown>
      try {
        parsed = JSON.parse(clean)
      } catch (parseErr) {
        lastError = parseErr
        console.error(`[generate-prompt] attempt ${attempt} JSON parse error:`, parseErr, "raw:", clean.slice(0, 200))
        continue
      }

      // Thanh cong
      return parsed
    } catch (fetchErr) {
      lastError = fetchErr
      console.error(`[generate-prompt] attempt ${attempt} fetch error:`, fetchErr)
      // continue -> retry
    }
  }

  throw lastError
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") ?? "q54"
  const userPrompt = PROMPTS[type]
  if (!userPrompt) return NextResponse.json({ error: "Invalid type" }, { status: 400 })

  // ── Kiểm tra giới hạn lượt tạo đề ──────────────────────────────────────────
  const usage = await checkPromptUsage()
  if (!usage.allowed) {
    return NextResponse.json(
      { error: "prompt_limit_reached", used: usage.used, remaining: 0 },
      { status: 403 }
    )
  }

  try {
    const parsed = await callDeepSeekWithRetry(userPrompt)

    // ── Tăng counter sau khi tạo thành công ──────────────────────────────────
    await incrementPromptUsage()

    return NextResponse.json({
      id: -1,
      question_type: type,
      source: "AI · TOPIK Format",
      difficulty: parsed.difficulty ?? "medium",
      context: parsed.context ?? "Đề AI tạo",
      text_kr: parsed.text_kr ?? "",
      topic: parsed.topic ?? undefined,
      blanks: parsed.blanks ?? undefined,
      chart_data: parsed.chart_data ?? undefined,
      ai_generated: true,
    })
  } catch (e) {
    console.error("[generate-prompt] All retries failed:", e)
    return NextResponse.json({ error: "Không thể tạo đề, thử lại sau" }, { status: 500 })
  }
}
