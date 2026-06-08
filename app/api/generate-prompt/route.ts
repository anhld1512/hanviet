import { NextRequest, NextResponse } from "next/server"

const OPENROUTER_API_KEY = process.env.DEEPSEEK_API_KEY!

export const maxDuration = 30

const PROMPTS: Record<string, string> = {
  q51: `Bạn là người tạo đề thi TOPIK II. Tạo 1 đề Q51 실용문 điền vào chỗ trống.

Yêu cầu kỹ thuật:
- Thư/thông báo tiếng Hàn thể 합쇼체 (-습니다/-ㅂ니다)
- Đúng 2 chỗ trống: (   ㄱ   ) và (   ㄴ   ) nhúng trong đoạn văn
- Chủ đề thực tế: thư mời, xin lỗi, cảm ơn, yêu cầu, thông báo
- Khoảng 150-180 chữ Hàn

QUY TẮC NGÔN NGỮ BẮT BUỘC:
- "context": PHẢI VIẾT BẰNG TIẾNG VIỆT
- "hint": PHẢI VIẾT BẰNG TIẾNG VIỆT
- "pattern": PHẢI VIẾT BẰNG TIẾNG VIỆT
- "text_kr" và "example": viết bằng tiếng Hàn

Trả về JSON hợp lệ (không có markdown):
{
  "context": "Mô tả ngắn tình huống bằng TIẾNG VIỆT",
  "text_kr": "Toàn bộ đoạn thư tiếng Hàn có (   ㄱ   ) và (   ㄴ   )",
  "difficulty": "easy",
  "blanks": [
    { "key": "ㄱ", "hint": "Gợi ý TIẾNG VIỆT — viết gì vào đây", "example": "Câu ví dụ tiếng Hàn ~15 chữ", "pattern": "Mẫu ngữ pháp TIẾNG VIỆT" },
    { "key": "ㄴ", "hint": "Gợi ý TIẾNG VIỆT", "example": "Câu ví dụ tiếng Hàn ~15 chữ", "pattern": "Mẫu ngữ pháp TIẾNG VIỆT" }
  ]
}`,

  q52: `Bạn là người tạo đề thi TOPIK II. Tạo 1 đề Q52 단문 쓰기 điền vào chỗ trống.

Yêu cầu kỹ thuật:
- Đoạn văn học thuật tiếng Hàn thể 다체 (-다, -이다, -된다)
- Đúng 2 chỗ trống: (   ㄱ   ) và (   ㄴ   )
- Chủ đề: vấn đề xã hội, công nghệ, môi trường, văn hóa, giáo dục
- Chỗ trống cần từ nối logic (반면에, 따라서, 왜냐하면, 이처럼...)
- Khoảng 180-220 chữ Hàn

QUY TẮC NGÔN NGỮ BẮT BUỘC:
- "context": PHẢI VIẾT BẰNG TIẾNG VIỆT
- "hint": PHẢI VIẾT BẰNG TIẾNG VIỆT
- "pattern": PHẢI VIẾT BẰNG TIẾNG VIỆT
- "text_kr" và "example": viết bằng tiếng Hàn

Trả về JSON hợp lệ (không có markdown):
{
  "context": "Mô tả chủ đề bằng TIẾNG VIỆT",
  "text_kr": "Đoạn văn học thuật tiếng Hàn có chỗ trống",
  "difficulty": "medium",
  "blanks": [
    { "key": "ㄱ", "hint": "Gợi ý TIẾNG VIỆT", "example": "Câu ví dụ tiếng Hàn ~20 chữ", "pattern": "Từ nối + nội dung — mô tả TIẾNG VIỆT" },
    { "key": "ㄴ", "hint": "Gợi ý TIẾNG VIỆT", "example": "Câu ví dụ tiếng Hàn ~20 chữ", "pattern": "Mẫu ngữ pháp TIẾNG VIỆT" }
  ]
}`,

  q53: `Bạn là người tạo đề thi TOPIK II. Tạo 1 đề Q53 도표 설명.

Yêu cầu kỹ thuật:
- Kết quả khảo sát hoặc thống kê thực tế
- 4-6 hạng mục với phần trăm (tổng ~100%)
- Tiêu đề biểu đồ và hướng dẫn bằng tiếng Hàn

QUY TẮC NGÔN NGỮ BẮT BUỘC:
- "context": PHẢI VIẾT BẰNG TIẾNG VIỆT
- "chart_data.title": tiếng Hàn
- "chart_data.items[].label": tiếng Hàn
- "text_kr": tiếng Hàn

Trả về JSON hợp lệ (không có markdown):
{
  "context": "Mô tả chủ đề biểu đồ bằng TIẾNG VIỆT",
  "text_kr": "Tiêu đề + bối cảnh ngắn + hướng dẫn viết phân tích 200-300 chữ thể 다체",
  "difficulty": "medium",
  "chart_data": {
    "title": "Tiêu đề biểu đồ tiếng Hàn (vd: 여가 시간 활용 방법 조사 결과)",
    "items": [
      { "label": "Nhãn tiếng Hàn", "percent": 35 },
      { "label": "Nhãn tiếng Hàn", "percent": 28 },
      { "label": "Nhãn tiếng Hàn", "percent": 20 },
      { "label": "Nhãn tiếng Hàn", "percent": 17 }
    ]
  }
}`,

  q54: `Bạn là người tạo đề thi TOPIK II. Tạo 1 đề Q54 주제 글쓰기.

Yêu cầu kỹ thuật:
- Chủ đề xã hội/văn hóa/kinh tế Hàn Quốc đương đại
- 3 câu hỏi phụ ①②③
- Format chuẩn TOPIK: 아래의 내용을 중심으로 글을 쓰시오
- Bài viết 600-700 chữ thể 다체

QUY TẮC NGÔN NGỮ BẮT BUỘC:
- "context": PHẢI VIẾT BẰNG TIẾNG VIỆT
- "topic": PHẢI VIẾT BẰNG TIẾNG VIỆT (ngắn gọn)
- "text_kr": tiếng Hàn

Trả về JSON hợp lệ (không có markdown):
{
  "context": "Mô tả chủ đề bằng TIẾNG VIỆT",
  "topic": "Tên chủ đề ngắn TIẾNG VIỆT (dưới 10 từ)",
  "text_kr": "Toàn bộ đề thi tiếng Hàn: câu chủ đề + ①②③ + 600~700자로 쓰십시오",
  "difficulty": "hard"
}`,
}

// Goi DeepSeek voi retry tu dong (toi da MAX_RETRIES lan)
// Xu ly ca: HTTP 5xx, content rong, JSON parse loi
const MAX_RETRIES = 2
const RETRY_DELAY_MS = 600

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
          model: "deepseek-v4-flash",
          max_tokens: 4000,
          temperature: 1.1,
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

  try {
    const parsed = await callDeepSeekWithRetry(userPrompt)

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
