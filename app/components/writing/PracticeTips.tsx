"use client"

import { useState } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────
export type ProcessStep = {
  label: string     // tên bước ngắn
  detail: string    // mô tả cụ thể
  time?: string     // gợi ý thời gian
}

export type PracticeTipsData = {
  steps: ProcessStep[]
  patterns: string[]    // pattern tiếng Hàn hay dùng
  avoid: string         // lỗi #1 cần tránh ngay
}

// ─── Tip data per Q-type ──────────────────────────────────────────────────────
export const TIPS_Q51: PracticeTipsData = {
  steps: [
    {
      label: "Đọc toàn bức thư",
      detail: "Xác định: ai viết, gửi ai, mục đích là gì? Đọc cả đoạn — đừng nhảy thẳng vào chỗ trống.",
      time: "30 giây",
    },
    {
      label: "Phân tích từng chỗ trống",
      detail: "Đọc câu ngay trước và ngay sau chỗ trống. ㄱ thường là nội dung chính. ㄴ thường là lời chúc hoặc đề nghị cuối.",
    },
    {
      label: "Xác định thể văn",
      detail: "Nhìn phần thư đã có — đang dùng 합쇼체 (-ㅂ니다/습니다) hay 해요체 (-아요)? Viết đúng thể văn đó.",
    },
    {
      label: "Viết câu",
      detail: "10–25 chữ là đủ. Đủ ý, tự nhiên, kết thúc đúng thể văn. Không cần câu hoa mỹ.",
    },
    {
      label: "Kiểm tra trước khi nộp",
      detail: "① Có dấu chấm cuối câu? ② Thể văn đúng chưa? ③ Câu có phù hợp ngữ cảnh không?",
    },
  ],
  patterns: [
    "~아/어 주셔서 감사합니다",
    "~기를 바랍니다",
    "~부탁드립니다",
    "~알려 드립니다",
    "~하게 되었습니다",
  ],
  avoid: "Dùng -아요/-어요 (해요체) thay vì -ㅂ니다/-습니다 → mất ngay 1 điểm thể văn, dù nội dung tốt.",
}

export const TIPS_Q52: PracticeTipsData = {
  steps: [
    {
      label: "Đọc cả đoạn văn",
      detail: "Hiểu luận điểm trung tâm. Bài đang lập luận theo hướng nào? Đừng chỉ đọc 1 câu xung quanh chỗ trống.",
      time: "45 giây",
    },
    {
      label: "Phân tích vị trí chỗ trống",
      detail: "ㄱ: câu này đối lập, bổ sung, hay nhượng bộ ý trước? ㄴ: đây là kết luận, hệ quả, hay ví dụ minh chứng?",
    },
    {
      label: "Chọn connector trước",
      detail: "Đặt từ nối phù hợp trước khi viết nội dung: 반면에 (đối lập) · 따라서 (kết luận) · 왜냐하면 (nguyên nhân).",
    },
    {
      label: "Viết câu học thuật",
      detail: "다체 bắt buộc (-다, -이다, -된다). Không dùng '나는'. Từ vựng học thuật: 주장하다, 강조하다, ~로 인해.",
    },
    {
      label: "Đọc lại cả đoạn",
      detail: "Đọc liền mạch từ đầu đến cuối — câu bạn viết có 'chảy' tự nhiên vào mạch văn gốc không?",
    },
  ],
  patterns: [
    "반면(에) — đối lập",
    "따라서 / 그러므로 — kết luận",
    "왜냐하면 ~기 때문이다",
    "이처럼 / 이와 같이 — tóm kết",
    "이와 달리 — tương phản",
  ],
  avoid: "Viết nội dung trước rồi mới thêm connector → câu thiếu liên kết logic. Hãy chọn connector TRƯỚC.",
}

export const TIPS_Q53: PracticeTipsData = {
  steps: [
    {
      label: "Đọc tiêu đề + đơn vị",
      detail: "Biểu đồ về chủ đề gì? Đơn vị là %, triệu người, hay năm? Ghi nhớ để dùng đúng trong bài.",
      time: "10 giây",
    },
    {
      label: "Xác định 3 điểm chính",
      detail: "Cao nhất là gì? Thấp nhất là gì? Xu hướng tổng thể là tăng, giảm, hay dao động? Ghi nháp 3 điểm này.",
      time: "1 phút",
    },
    {
      label: "Lập dàn ý 4 phần",
      detail: "① Giới thiệu biểu đồ → ② Số liệu nổi bật nhất → ③ So sánh / xu hướng → ④ Nguyên nhân ngắn (1-2 câu). Viết ra trước.",
      time: "2 phút",
    },
    {
      label: "Viết theo dàn ý",
      detail: "Mục tiêu 230–270 chữ. 다체 bắt buộc. Không thêm ý kiến cá nhân ('나는 ~라고 생각한다' là sai).",
    },
    {
      label: "Đếm chữ và cân đối",
      detail: "Dưới 200 chữ? → Thêm 1 câu so sánh hoặc câu nguyên nhân. Trên 300? → Cắt bớt phần nguyên nhân.",
    },
  ],
  patterns: [
    "~%로 가장 높게 나타났다",
    "다음으로 ~%를 차지했다",
    "~에 비해 ~배 높다/낮다",
    "~는 증가/감소하는 추세이다",
    "이를 통해 ~을 알 수 있다",
  ],
  avoid: "Thêm câu ý kiến cá nhân như '나는 이 결과가 당연하다고 생각한다' → vi phạm nguyên tắc khách quan, bị trừ điểm nặng.",
}

export const TIPS_Q54: PracticeTipsData = {
  steps: [
    {
      label: "Đọc đề 2 lần, gạch từ khóa",
      detail: "Đề hỏi gì? Yêu cầu 1 chiều (ủng hộ/phản đối) hay 2 chiều (phân tích lợi/hại)? Gạch chân từ khóa.",
      time: "1 phút",
    },
    {
      label: "Brainstorm luận điểm",
      detail: "Nghĩ ra 2–3 luận điểm. Mỗi luận điểm phải có ít nhất 1 dẫn chứng cụ thể: số liệu, ví dụ thực tế, hoặc tình huống.",
      time: "3 phút",
    },
    {
      label: "Viết outline trước khi viết",
      detail: "① Mở đề: thesis rõ ràng 2–3 câu → ② Thân 1: luận điểm + dẫn chứng → ③ Thân 2: luận điểm + dẫn chứng → ④ Kết luận.",
      time: "2 phút",
    },
    {
      label: "Viết theo outline",
      detail: "Mục tiêu 640–670 chữ (vùng an toàn). 다체 học thuật xuyên suốt. Nếu bí, viết thân bài trước, mở đề sau.",
    },
    {
      label: "Review 2 điểm bắt buộc",
      detail: "① Đếm chữ — đủ 600 chưa? ② Kiểm tra thể văn — có từ nào kết thúc -습니다/-해요 sót lại không?",
    },
  ],
  patterns: [
    "~(이)라고 할 수 있다",
    "~는 반드시 필요하다",
    "~에 따르면 ~는 것으로 나타났다",
    "첫째 ~ 둘째 ~ 마지막으로 ~",
    "이러한 이유로 ~는 중요하다",
  ],
  avoid: "Không lập outline → viết đến đoạn 2 không biết kết luận gì, mạch lạc kém và dễ lạc đề. Bỏ 5 phút plan = tiết kiệm 20 phút viết.",
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PracticeTips({ data }: { data: PracticeTipsData }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-5 rounded-xl border border-slate-200 overflow-hidden bg-white" style={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.04)" }}>

      {/* ── Toggle bar — luôn hiển thị ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
      >
        <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full shrink-0">Mẹo</span>
        <span className="text-sm font-semibold text-slate-700">Quy trình trước khi viết</span>
        <span className="text-xs text-slate-400 ml-1">— {data.steps.length} bước · câu mẫu · lỗi cần tránh</span>
        <span className="ml-auto text-slate-400 text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {/* ── Nội dung — chỉ hiện khi open ── */}
      {open && (
        <>
          {/* Steps */}
          <div className="border-t border-slate-100 bg-white px-5 py-5">
            <div className="grid grid-cols-5 gap-3">
              {data.steps.map((step, i) => (
                <div key={i} className="relative flex gap-3">
                  {i < data.steps.length - 1 && (
                    <span className="absolute -right-2 top-3.5 text-slate-300 text-base select-none z-10">›</span>
                  )}
                  <div className="flex-1 rounded-xl border border-slate-100 p-3.5 flex flex-col gap-2" style={{ background: "#FAFAFA" }}>
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      {step.time && (
                        <span className="text-[9px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">{step.time}</span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-900 leading-snug">{step.label}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patterns + Avoid */}
          <div className="border-t border-slate-100 px-5 py-4 grid grid-cols-2 gap-4 bg-white">
            <div>
              <p className="text-xs font-bold text-slate-600 mb-2.5 uppercase tracking-wide">Câu mẫu hay dùng</p>
              <div className="flex flex-wrap gap-1.5">
                {data.patterns.map((p, i) => (
                  <span key={i} className="text-xs font-mono bg-slate-50 text-blue-700 border border-slate-200 px-2.5 py-1 rounded-lg">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl px-4 py-3" style={{ background: "#fff5f5", border: "1px solid #fecaca" }}>
              <p className="text-xs font-bold text-red-600 mb-1.5 uppercase tracking-wide">Lỗi hay gặp — tránh ngay</p>
              <p className="text-xs text-red-700 leading-relaxed">{data.avoid}</p>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
