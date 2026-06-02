// Claude AI grading prompts for TOPIK II Writing Q51-Q54
// AI Writing Coach approach — accurate rubric + deep error analysis + coaching

// ─── Types ────────────────────────────────────────────────────────────────────

export type ErrorCategory = "grammar" | "vocabulary" | "style" | "logic" | "content"

export type GradeResult = {
  question_type: "q51" | "q52" | "q53" | "q54" | "mock_exam"
  scores: {
    content: number
    organization: number
    language: number
    style: number
    total: number
  }
  max_scores: {
    content: number
    organization: number
    language: number
    style: number
    total: number
  }
  feedback: {
    overall: string
    content: string
    organization: string
    language: string
    style: string
  }
  corrections: Array<{
    original: string
    corrected: string
    explanation: string
    type?: ErrorCategory       // grammar | vocabulary | style | logic | content
    pattern?: string           // e.g. "V-았/었습니다", "N을/를 vs N이/가"
  }>
  coaching?: {
    strength: string           // điểm học sinh làm tốt
    weakness: string           // điểm yếu chính
    focus_pattern: string      // 1 pattern cụ thể cần ôn
    level_tip: string          // lời khuyên thực tế
  }
  better_example?: string
  char_count_feedback?: string
  thesis_feedback?: string
  better_opening?: string
  isError?: boolean             // true khi API fail — render error state thay vì score 0
}

// ─── Shared error classification guide ────────────────────────────────────────
const ERROR_GUIDE = `
=== PHÂN LOẠI LỖI (bắt buộc cho từng correction) ===
Mỗi lỗi PHẢI có "type":
• "grammar"    — sai cấu trúc ngữ pháp: trợ từ sai, chia động từ sai, biểu thức ngữ pháp sai
• "vocabulary" — sai từ, không phù hợp văn phong, thiếu từ học thuật, dùng từ thông thường thay trang trọng
• "style"      — sai thể văn: dùng 해요체 thay 합쇼체/다체, pha trộn thể văn
• "logic"      — không phù hợp ngữ cảnh, sai logic lập luận, thiếu liên kết ý
• "content"    — thiếu thông tin quan trọng, quá vắn tắt, không đáp ứng yêu cầu

Với lỗi grammar/vocabulary: ghi "pattern" = tên cấu trúc cụ thể.
Ví dụ: "V-았/었습니다 (quá khứ kính ngữ)", "N을/를 (trợ từ tân ngữ)", "V-아/어서 (nguyên nhân)"`

// ─── Q51 ─────────────────────────────────────────────────────────────────────
export function buildQ51Prompt(
  promptText: string,
  blankKey: string,
  studentAnswer: string,
  contextHint: string
): string {
  return `Bạn là giáo viên tiếng Hàn TOPIK II, vừa là giám khảo vừa là writing coach. Chấm điểm CHÍNH XÁC và phân tích lỗi SÂU.

ĐỀ BÀI:
${promptText}

CHỖ TRỐNG: (${blankKey}) | YÊU CẦU: ${contextHint}
BÀI VIẾT: "${studentAnswer}"

⚠️ KIỂM TRA SAO CHÉP TRƯỚC KHI CHẤM:
So sánh BÀI VIẾT với ĐỀ BÀI. Nếu bài viết là đoạn/câu SAO CHÉP NGUYÊN VĂN hoặc GẦN NGUYÊN VĂN từ đề bài (trùng >70% từ) → đây là gian lận, cho tất cả điểm = 0 và ghi rõ "Sao chép từ đề bài — không được tính điểm" trong overall feedback.

=== RUBRIC Q51 — 5 điểm ===

NỘI DUNG (2đ):
• 2đ: Câu HOÀN TOÀN phù hợp ngữ cảnh + đủ thông tin + tự nhiên
• 1đ: Đúng cơ bản NHƯNG thiếu chi tiết / hơi chung chung / dư thừa
• 0đ: Không liên quan ngữ cảnh, sai nghĩa, hoặc quá ngắn

NGỮ PHÁP & TỪ VỰNG (2đ):
• 2đ: Ngữ pháp CHÍNH XÁC + từ vựng phong phú phù hợp văn phong trang trọng
• 1đ: Đúng cơ bản NHƯNG có 1 lỗi nhỏ HOẶC từ vựng đơn giản/không phù hợp
• 0đ: Nhiều lỗi ngữ pháp nghiêm trọng hoặc từ vựng sai nghĩa

THỂ VĂN (1đ) — KHẮT KHE NHẤT:
• 1đ: ĐÚNG 합쇼체 — câu KẾT THÚC bằng -ㅂ니다 hoặc -습니다
• 0đ: BẤT KỲ kết thúc nào KHÁC đều là SAI:
  - 해요체: -아요, -어요, -해요, -이에요, -세요 → SAI
  - 반말: -다, -야, -어 → SAI
  - Quy tắc: KIỂM TRA chữ cuối cùng. Nếu không phải -ㅂ니다/-습니다/-입니다 → style = 0

CÁCH KIỂM TRA: Nhìn vào chữ CUỐI của bài viết "있어요" → kết thúc -요 → 해요체 → style=0
${ERROR_GUIDE}
YÊU CẦU CHẤT LƯỢNG PHẢN HỒI — BẮT BUỘC TUÂN THỦ:
• feedback.overall: 3-4 câu — tóm tắt toàn diện: câu trả lời có đúng ngữ cảnh không, điểm mạnh cụ thể là gì, điểm yếu chính là gì, đánh giá chung về chất lượng
• feedback.content: 3-4 câu — phân tích sâu: câu có phù hợp ngữ cảnh trước/sau chỗ trống không, thông tin có đủ và chính xác không, có tự nhiên không, thiếu/thừa gì cụ thể và tại sao ảnh hưởng đến điểm
• feedback.language: 3-4 câu — phân tích chi tiết: liệt kê lỗi ngữ pháp/từ vựng cụ thể (trích dẫn từ bài viết), giải thích tại sao sai, gợi ý từ/cấu trúc tốt hơn với ví dụ cụ thể
• feedback.style: 2-3 câu — giải thích rõ: bài dùng thể văn nào (trích dẫn đuôi câu), thể văn yêu cầu là gì và tại sao, cách sửa cụ thể
• corrections[].explanation: PHẢI CÓ 4-5 câu — (1) lỗi cụ thể là gì, (2) tại sao vi phạm quy tắc ngữ pháp, (3) quy tắc đúng là gì và cách hoạt động, (4) ví dụ thêm về cách dùng đúng, (5) mẹo để nhớ/tránh lỗi này
• coaching.strength: 2-3 câu — điểm làm tốt cụ thể với dẫn chứng từ bài viết
• coaching.weakness: 2-3 câu — điểm yếu chính với phân tích cụ thể và tác động đến điểm
• coaching.focus_pattern: 2-3 câu — pattern cần ôn, giải thích cách dùng đúng, ít nhất 2 ví dụ cụ thể. KHÔNG ĐỂ TRỐNG.
• coaching.level_tip: 3-4 câu — lời khuyên thực tế, actionable, có bước cụ thể để cải thiện. KHÔNG ĐỂ TRỐNG.

Trả về JSON:
{
  "scores": { "content": <0-2>, "language": <0-2>, "style": <0-1>, "total": <0-5> },
  "feedback": {
    "overall": "<3-4 câu tổng quan: ngữ cảnh + điểm mạnh + điểm yếu + đánh giá chung>",
    "content": "<3-4 câu phân tích nội dung: phù hợp ngữ cảnh? thông tin đủ? thiếu/thừa gì và tại sao?>",
    "organization": "",
    "language": "<3-4 câu phân tích ngữ pháp/từ vựng: lỗi cụ thể + trích dẫn + gợi ý cải thiện>",
    "style": "<2-3 câu: thể văn dùng là gì, yêu cầu là gì, cách sửa cụ thể>"
  },
  "corrections": [
    {
      "original": "<phần bị sai>",
      "corrected": "<sửa lại hoàn chỉnh>",
      "explanation": "<4-5 câu: lỗi gì → tại sao vi phạm → quy tắc đúng → ví dụ thêm → mẹo nhớ>",
      "type": "<grammar|vocabulary|style|logic|content>",
      "pattern": "<tên cấu trúc ngữ pháp nếu là grammar/vocab>"
    }
  ],
  "coaching": {
    "strength": "<2-3 câu điểm tốt cụ thể với dẫn chứng từ bài viết>",
    "weakness": "<2-3 câu điểm yếu chính với phân tích và tác động đến điểm>",
    "focus_pattern": "<2-3 câu: pattern cần ôn + cách dùng đúng + 2 ví dụ cụ thể. KHÔNG ĐỂ TRỐNG>",
    "level_tip": "<3-4 câu lời khuyên actionable với bước cụ thể để cải thiện. KHÔNG ĐỂ TRỐNG>"
  },
  "better_example": "<câu mẫu tốt hơn bằng tiếng Hàn>"
}

QUAN TRỌNG: Chỉ trả về raw JSON. TUYỆT ĐỐI không dùng markdown code block.`
}

// ─── Q52 ─────────────────────────────────────────────────────────────────────
export function buildQ52Prompt(
  promptText: string,
  blankKey: string,
  studentAnswer: string,
  contextHint: string
): string {
  return `Bạn là giáo viên TOPIK II chuyên văn nghị luận, vừa chấm điểm vừa coaching viết học thuật.

VĂN BẢN GỐC:
${promptText}

CHỖ TRỐNG: (${blankKey}) | YÊU CẦU: ${contextHint}
BÀI VIẾT: "${studentAnswer}"

⚠️ KIỂM TRA SAO CHÉP TRƯỚC KHI CHẤM:
So sánh BÀI VIẾT với VĂN BẢN GỐC. Nếu bài viết là đoạn/câu SAO CHÉP NGUYÊN VĂN hoặc GẦN NGUYÊN VĂN từ văn bản gốc (trùng >70% từ) → đây là gian lận, cho tất cả điểm = 0 và ghi rõ "Sao chép từ đề bài — không được tính điểm" trong overall feedback.

=== RUBRIC Q52 — 5 điểm ===

NỘI DUNG & LOGIC (2đ):
• 2đ: Câu phù hợp hoàn toàn ý trước + sau + thể hiện đúng quan điểm đối lập/bổ sung
• 1đ: Đúng cơ bản NHƯNG liên kết với ý xung quanh chưa mượt mà, lập luận chưa rõ
• 0đ: Không liên quan ngữ cảnh, sai logic, phá vỡ mạch văn

NGỮ PHÁP & TỪ VỰNG HỌC THUẬT (2đ):
• 2đ: Dùng ngữ pháp văn viết học thuật đúng + từ vựng phong phú (주장하다, 강조하다, ~로 인해, 반면에...)
• 1đ: Đúng cơ bản NHƯNG từ thông thường thay vì học thuật, hoặc 1 lỗi nhỏ
• 0đ: Nhiều lỗi ngữ pháp, từ vựng không phù hợp văn phong nghị luận

THỂ VĂN 다체 (1đ) — KHẮT KHE NHẤT:
• 1đ: ĐÚNG 다/ㄴ다체 — câu kết thúc bằng -다, -ㄴ다, -이다, -된다, -있다, -없다
• 0đ: BẤT KỲ kết thúc khác đều là SAI:
  - 합쇼체: -ㅂ니다, -습니다 → SAI (đây là văn nói trang trọng, không phải văn viết học thuật)
  - 해요체: -아요, -어요, -해요, -이에요 → SAI
  - KIỂM TRA chữ cuối: nếu không phải đuôi -다 → style=0
${ERROR_GUIDE}
Trả về JSON:
{
  "scores": { "content": <0-2>, "language": <0-2>, "style": <0-1>, "total": <0-5> },
  "feedback": {
    "overall": "<tóm tắt điểm mạnh + yếu, tiếng Việt>",
    "content": "<câu có logic phù hợp với lập luận trước/sau không?>",
    "organization": "",
    "language": "<ngữ pháp văn học thuật + từ vựng: gợi ý cải thiện cụ thể>",
    "style": "<다체 đúng không? nếu sai thì sai ở đâu>"
  },
  "corrections": [
    {
      "original": "<phần sai>",
      "corrected": "<sửa lại>",
      "explanation": "<tại sao sai, tiếng Việt>",
      "type": "<grammar|vocabulary|style|logic|content>",
      "pattern": "<tên cấu trúc nếu là grammar/vocab>"
    }
  ],
  "coaching": {
    "strength": "<2-3 câu: điểm tốt cụ thể với dẫn chứng từ bài viết>",
    "weakness": "<2-3 câu: điểm yếu chính với phân tích sâu và tác động>",
    "focus_pattern": "<2-3 câu: pattern/từ vựng học thuật cần ôn + giải thích cách dùng + 2 ví dụ. KHÔNG ĐỂ TRỐNG>",
    "level_tip": "<3-4 câu lời khuyên actionable để viết văn nghị luận tốt hơn. KHÔNG ĐỂ TRỐNG>"
  },
  "better_example": "<câu mẫu tốt hơn bằng tiếng Hàn>"
}

YÊU CẦU CHẤT LƯỢNG PHẢN HỒI — BẮT BUỘC:
• feedback.overall: 3-4 câu toàn diện — câu có phù hợp lập luận xung quanh không, điểm mạnh, điểm yếu, đánh giá tổng thể
• feedback.content: 3-4 câu — câu có kết nối logic với ý trước/sau không, có thể hiện quan điểm đúng không, thiếu/thừa gì
• feedback.language: 3-4 câu — phân tích từ vựng học thuật: thiếu những từ nào, nên dùng gì thay thế, lỗi cụ thể + trích dẫn
• feedback.style: 2-3 câu — 다체 đúng/sai, trích dẫn đuôi câu cụ thể, cách sửa
• corrections[].explanation: 4-5 câu — lỗi gì → tại sao vi phạm → quy tắc đúng → ví dụ thêm → mẹo nhớ

QUAN TRỌNG: Chỉ trả về raw JSON. TUYỆT ĐỐI không dùng markdown code block.`
}

// ─── Q53 ─────────────────────────────────────────────────────────────────────
export function buildQ53Prompt(
  chartDescription: string,
  studentEssay: string,
  charCount: number
): string {
  return `Bạn là giáo viên TOPIK II chuyên về văn phân tích biểu đồ, vừa chấm điểm vừa coaching.

DỮ LIỆU BIỂU ĐỒ:
${chartDescription}

BÀI VIẾT (${charCount} chữ):
${studentEssay}

=== RUBRIC Q53 — 30 điểm ===

NỘI DUNG (12đ):
① Mô tả số liệu (4đ): Có trích dẫn đủ số liệu chính? Có sai số liệu không? (mỗi số liệu sai -1đ)
② Phân tích xu hướng (4đ): Có so sánh, đối chiếu, nhận xét xu hướng? (thiếu -3đ)
③ Nguyên nhân/Ý nghĩa (4đ): Có giải thích nguyên nhân hoặc ý nghĩa? (thiếu -2đ)

CẤU TRÚC (9đ):
• 9-8đ: Rõ ràng mở đề → phân tích → kết luận, từ nối tốt (반면에, 또한, 이와 같이...)
• 7-5đ: Có cấu trúc nhưng chưa rõ phần, từ nối đôi chỗ thiếu
• 4-0đ: Viết liệt kê rời rạc, không có cấu trúc, thiếu từ nối

NGỮ PHÁP & TỪ VỰNG (9đ):
• 9-8đ: Ngữ pháp chính xác + từ vựng học thuật phong phú (증가하다, 차지하다, 나타나다, ~배 증가...)
• 7-5đ: Đúng cơ bản nhưng từ vựng đơn giản, có 1-2 lỗi nhỏ
• 4-0đ: Nhiều lỗi ngữ pháp, dùng từ thông thường, dùng 습니다체

ĐỘ DÀI: 200-300 chữ. Sai >10% trừ 2-3đ. THỂ VĂN: 다체 bắt buộc. Không chép đề.
${ERROR_GUIDE}
Trả về JSON:
{
  "scores": { "content": <0-12>, "organization": <0-9>, "language": <0-9>, "style": 0, "total": <0-30> },
  "char_count_feedback": "<nhận xét độ dài + số chữ cụ thể>",
  "feedback": {
    "overall": "<2-3 câu: điểm mạnh + yếu chính, tiếng Việt>",
    "content": "<có đủ số liệu/xu hướng/nguyên nhân không? thiếu gì?>",
    "organization": "<cấu trúc + từ nối: tốt/thiếu ở đâu?>",
    "language": "<ngữ pháp + từ vựng học thuật: gợi ý cải thiện cụ thể>",
    "style": ""
  },
  "corrections": [
    {
      "original": "<đoạn/câu sai>",
      "corrected": "<sửa lại>",
      "explanation": "<tại sao sai, tiếng Việt>",
      "type": "<grammar|vocabulary|style|logic|content>",
      "pattern": "<tên cấu trúc nếu là grammar/vocab>"
    }
  ],
  "coaching": {
    "strength": "<điểm tốt nhất của bài>",
    "weakness": "<điểm yếu chính>",
    "focus_pattern": "<1 cấu trúc phân tích biểu đồ cần ôn: 'Ôn lại: N이/가 X%를 차지하다 — ví dụ...'. KHÔNG ĐỂ TRỐNG>",
    "level_tip": "<lời khuyên cụ thể để cải thiện. KHÔNG ĐỂ TRỐNG>"
  },
  "better_example": "<1-2 câu mẫu cho phần yếu nhất, tiếng Hàn>"
}

QUAN TRỌNG: Chỉ trả về raw JSON. TUYỆT ĐỐI không dùng markdown code block.`
}

// ─── Q54 ─────────────────────────────────────────────────────────────────────
export function buildQ54Prompt(
  topic: string,
  studentEssay: string,
  charCount: number
): string {
  return `Bạn là giáo viên TOPIK II chuyên về bài luận học thuật, vừa chấm theo rubric NIIED vừa coaching sâu.

CHỦ ĐỀ:
${topic}

BÀI VIẾT (${charCount} chữ):
${studentEssay}

=== RUBRIC Q54 — 50 điểm (NIIED chính thức) ===

NỘI DUNG (12đ):
• 12-10đ: Luận điểm RÕ RÀNG + dẫn chứng CỤ THỂ + phát triển ý đầy đủ, thuyết phục
• 9-7đ: Luận điểm có nhưng chưa rõ, thiếu dẫn chứng cụ thể, phát triển chưa đầy đủ
• 6-4đ: Luận điểm mơ hồ, chủ yếu liệt kê, thiếu phân tích và dẫn chứng
• 3-0đ: Không có luận điểm, lạc đề, nội dung quá nghèo nàn

CẤU TRÚC (12đ):
• 12-10đ: Đủ 3 phần mở-thân-kết RÕ RÀNG + mỗi đoạn có chủ đề + liên kết đoạn tốt
• 9-7đ: Có 3 phần nhưng chưa rõ, liên kết đoạn chưa mượt mà
• 6-4đ: Cấu trúc lộn xộn, thiếu 1 phần, kết bài giống mở bài
• 3-0đ: Không có cấu trúc

NGỮ PHÁP & TỪ VỰNG (14đ):
• 14-12đ: Ngữ pháp đa dạng phức tạp + không lỗi + từ vựng học thuật phong phú
• 11-8đ: Ngữ pháp đúng nhưng đơn điệu + từ vựng bình thường, 1-2 lỗi nhỏ
• 7-4đ: Ngữ pháp đơn giản, nhiều lỗi, từ vựng nghèo nàn
• 3-0đ: Rất nhiều lỗi, từ vựng không phù hợp

THỂ VĂN (12đ) — KHẮT KHE:
• 12-10đ: NHẤT QUÁN 합쇼체/다체 học thuật xuyên suốt, không pha trộn
• 9-7đ: Chủ yếu đúng nhưng 1-2 lần pha trộn
• 6-4đ: Pha trộn nhiều, dùng 해요체 lặp lại
• 3-0đ: Dùng 해요체 hoàn toàn hoặc hầu hết

ĐỘ DÀI: CHÍNH XÁC 600-700 chữ. Mỗi thiếu/thừa 50 chữ trừ 2-3đ. Không chép đề.
${ERROR_GUIDE}
Trả về JSON:
{
  "scores": { "content": <0-12>, "organization": <0-12>, "language": <0-14>, "style": <0-12>, "total": <0-50> },
  "char_count_feedback": "<nhận xét độ dài + số chữ cụ thể>",
  "feedback": {
    "overall": "<3-4 câu: điểm mạnh + 2 điểm yếu chính, tiếng Việt>",
    "content": "<luận điểm có rõ không? dẫn chứng có cụ thể không?>",
    "organization": "<cấu trúc 3 phần thế nào? liên kết đoạn tốt không?>",
    "language": "<ngữ pháp có đa dạng không? từ vựng học thuật đủ không? lỗi cụ thể?>",
    "style": "<thể văn nhất quán không? có pha 해요체 không? ở đâu?>"
  },
  "corrections": [
    {
      "original": "<câu/đoạn sai quan trọng nhất>",
      "corrected": "<sửa lại>",
      "explanation": "<tại sao sai + hướng cải thiện, tiếng Việt>",
      "type": "<grammar|vocabulary|style|logic|content>",
      "pattern": "<tên cấu trúc nếu là grammar/vocab>"
    }
  ],
  "coaching": {
    "strength": "<điểm mạnh nhất của bài luận>",
    "weakness": "<điểm yếu chính ảnh hưởng điểm nhất>",
    "focus_pattern": "<1 kỹ năng/cấu trúc cần ôn: 'Ôn lại: [pattern] — [ví dụ cụ thể]'. KHÔNG ĐỂ TRỐNG>",
    "level_tip": "<lời khuyên cụ thể để nâng điểm lên 1 bậc. KHÔNG ĐỂ TRỐNG>"
  },
  "thesis_feedback": "<phân tích câu thesis: có rõ ràng và đặc sắc không? gợi ý cải thiện>",
  "better_opening": "<gợi ý mở bài tốt hơn nếu cần, tiếng Hàn>"
}

QUAN TRỌNG: Chỉ trả về raw JSON. TUYỆT ĐỐI không dùng markdown code block.`
}
