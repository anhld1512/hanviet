// ============================================================
// Shared learning path stage data
// ============================================================

export type StageTask = {
  type: "template" | "practice" | "review"
  label: string
  route: string
  qTypes?: string[]   // loai cau lien quan (de hien template inline)
  targetCount?: number  // so bai can luyen
}

export type Stage = {
  id: number
  title: string
  subtitle: string
  goal: string
  desc: string  // mo ta chi tiet hon cho stage page
  tasks: StageTask[]
  unlockAt: number
  minAvgPct: number
  scoreTypes: string[]
}

export const PATH_STAGES: Record<string, Stage[]> = {
  A: [
    {
      id: 1, title: "Giai đoạn 1 — Làm quen", subtitle: "Q51 & Q52",
      goal: "Viết đúng thể văn, điền câu logic vào chỗ trống",
      desc: "Làm quen với Q51 (thư/thông báo) và Q52 (nghị luận ngắn). Cả hai dạng đều yêu cầu điền 2 câu vào chỗ trống.",
      tasks: [
        { type: "template", label: "Học templates Q51 & Q52", route: "/templates", qTypes: ["q51", "q52"] },
        { type: "practice", label: "Luyện 5 đề Q51", route: "/practice/q51", qTypes: ["q51"], targetCount: 5 },
        { type: "practice", label: "Luyện 5 đề Q52", route: "/practice/q52", qTypes: ["q52"], targetCount: 5 },
      ],
      unlockAt: 0, minAvgPct: 0, scoreTypes: [],
    },
    {
      id: 2, title: "Giai đoạn 2 — Phân tích biểu đồ", subtitle: "Q53",
      goal: "Viết đủ 200–300 chữ, mô tả số liệu chính xác",
      desc: "Q53 yêu cầu phân tích biểu đồ/bảng số liệu. Cần mô tả xu hướng, so sánh và rút ra kết luận.",
      tasks: [
        { type: "template", label: "Học template Q53", route: "/templates", qTypes: ["q53"] },
        { type: "practice", label: "Luyện 5 đề Q53", route: "/practice/q53", qTypes: ["q53"], targetCount: 5 },
        { type: "review", label: "Ôn lỗi Q53 trong Ôn lỗi", route: "/review" },
      ],
      unlockAt: 5, minAvgPct: 60, scoreTypes: ["q51", "q52"],
    },
    {
      id: 3, title: "Giai đoạn 3 — Bài luận cơ bản", subtitle: "Q54",
      goal: "Viết đủ 600–700 chữ, cấu trúc rõ ràng 4 đoạn",
      desc: "Q54 là bài luận dài nhất — 600–700 chữ, 4 đoạn: Mở đề → Luận điểm 1 → Luận điểm 2 → Kết luận.",
      tasks: [
        { type: "template", label: "Học template Q54", route: "/templates", qTypes: ["q54"] },
        { type: "practice", label: "Luyện 5 đề Q54", route: "/practice/q54", qTypes: ["q54"], targetCount: 5 },
        { type: "review", label: "Ôn lỗi Q54 trong Ôn lỗi", route: "/review" },
      ],
      unlockAt: 10, minAvgPct: 60, scoreTypes: ["q53"],
    },
    {
      id: 4, title: "Giai đoạn 4 — Tổng ôn", subtitle: "Q51–Q54 toàn bộ",
      goal: "Đạt 70%+ tất cả câu, luyện trong điều kiện thời gian thực tế",
      desc: "Giai đoạn cuối — luyện đủ 4 loại câu như trong thi thật. Tổng thời gian: ~50 phút.",
      tasks: [
        { type: "practice", label: "Luyện Q51 – tổng ôn", route: "/practice/q51", qTypes: ["q51"], targetCount: 3 },
        { type: "practice", label: "Luyện Q52 – tổng ôn", route: "/practice/q52", qTypes: ["q52"], targetCount: 3 },
        { type: "practice", label: "Luyện Q53 – tổng ôn", route: "/practice/q53", qTypes: ["q53"], targetCount: 3 },
        { type: "practice", label: "Luyện Q54 – tổng ôn", route: "/practice/q54", qTypes: ["q54"], targetCount: 3 },
        { type: "review", label: "Xem lại lỗi thường gặp", route: "/review" },
      ],
      unlockAt: 20, minAvgPct: 60, scoreTypes: ["q51", "q52", "q53", "q54"],
    },
  ],
  B: [
    {
      id: 1, title: "Giai đoạn 1 — Nền tảng nhanh", subtitle: "Q51 & Q52 cơ bản",
      goal: "Nắm template Q51/Q52, đảm bảo 8+/10",
      desc: "Q51/Q52 chiếm 10+10 = 20 điểm — cần gom điểm nhanh trước khi đầu tư vào Q53/Q54.",
      tasks: [
        { type: "template", label: "Học templates Q51 & Q52", route: "/templates", qTypes: ["q51", "q52"] },
        { type: "practice", label: "Luyện 3 đề Q51", route: "/practice/q51", qTypes: ["q51"], targetCount: 3 },
        { type: "practice", label: "Luyện 3 đề Q52", route: "/practice/q52", qTypes: ["q52"], targetCount: 3 },
      ],
      unlockAt: 0, minAvgPct: 0, scoreTypes: [],
    },
    {
      id: 2, title: "Giai đoạn 2 — Tập trung Q53", subtitle: "Q53 chuyên sâu",
      goal: "Đạt 24+/30 điểm Q53, thuần thục biểu đồ cột & xu hướng",
      desc: "Q53 chiếm 30 điểm. Cần thuần thục mô tả số liệu, so sánh, kết luận — không thêm ý kiến cá nhân.",
      tasks: [
        { type: "template", label: "Học templates Q53", route: "/templates", qTypes: ["q53"] },
        { type: "practice", label: "Luyện 10 đề Q53", route: "/practice/q53", qTypes: ["q53"], targetCount: 10 },
        { type: "review", label: "Ôn lỗi Q53", route: "/review" },
      ],
      unlockAt: 3, minAvgPct: 60, scoreTypes: ["q51", "q52"],
    },
    {
      id: 3, title: "Giai đoạn 3 — Tập trung Q54", subtitle: "Q54 chuyên sâu",
      goal: "Đạt 40+/50 điểm Q54, viết đủ 650 chữ trong 30 phút",
      desc: "Q54 chiếm 50 điểm — phần quan trọng nhất. Cần cấu trúc chặt chẽ, lập luận logic và đủ độ dài.",
      tasks: [
        { type: "template", label: "Học templates Q54", route: "/templates", qTypes: ["q54"] },
        { type: "practice", label: "Luyện 10 đề Q54", route: "/practice/q54", qTypes: ["q54"], targetCount: 10 },
        { type: "review", label: "Ôn lỗi Q54", route: "/review" },
      ],
      unlockAt: 10, minAvgPct: 60, scoreTypes: ["q53"],
    },
    {
      id: 4, title: "Giai đoạn 4 — Cân bằng & Tổng ôn", subtitle: "Tổng hợp",
      goal: "Đạt tổng điểm writing 75+/100",
      desc: "Giai đoạn cuối — cân bằng tất cả 4 loại câu, đảm bảo không bị mất điểm ở Q51/Q52.",
      tasks: [
        { type: "practice", label: "Luyện toàn bộ Q51–Q54", route: "/practice", qTypes: ["q51", "q52", "q53", "q54"] },
        { type: "review", label: "Xem lịch sử lỗi", route: "/review" },
      ],
      unlockAt: 20, minAvgPct: 60, scoreTypes: ["q51", "q52", "q53", "q54"],
    },
  ],
  C: [
    {
      id: 1, title: "Giai đoạn 1 — Chẩn đoán", subtitle: "Xác định điểm yếu",
      goal: "Nộp ít nhất 2 bài mỗi loại để xem kết quả AI",
      desc: "Cần nộp bài để AI phát hiện điểm yếu. Chưa cần đạt điểm cao — chỉ cần có data để phân tích.",
      tasks: [
        { type: "practice", label: "Nộp 2 bài Q51", route: "/practice/q51", qTypes: ["q51"], targetCount: 2 },
        { type: "practice", label: "Nộp 2 bài Q52", route: "/practice/q52", qTypes: ["q52"], targetCount: 2 },
        { type: "practice", label: "Nộp 1 bài Q53", route: "/practice/q53", qTypes: ["q53"], targetCount: 1 },
        { type: "practice", label: "Nộp 1 bài Q54", route: "/practice/q54", qTypes: ["q54"], targetCount: 1 },
      ],
      unlockAt: 0, minAvgPct: 0, scoreTypes: [],
    },
    {
      id: 2, title: "Giai đoạn 2 — Sửa lỗi ngữ pháp", subtitle: "Tiêu chí Ngữ pháp & Từ vựng",
      goal: "Giảm 50% lỗi ngữ pháp so với giai đoạn 1",
      desc: "Tập trung vào lỗi ngữ pháp AI đã chỉ ra. Xem Ôn lỗi → luyện lại các dạng câu hay sai.",
      tasks: [
        { type: "review", label: "Xem Ôn lỗi — lỗi thường gặp", route: "/review" },
        { type: "practice", label: "Luyện lại 5 bài có lỗi nhiều nhất", route: "/practice", targetCount: 5 },
      ],
      unlockAt: 6, minAvgPct: 50, scoreTypes: ["q51", "q52", "q53", "q54"],
    },
    {
      id: 3, title: "Giai đoạn 3 — Cải thiện Nội dung", subtitle: "Tiêu chí Nội dung & Cấu trúc",
      goal: "Tất cả bài đạt 60%+ điểm nội dung",
      desc: "Sau khi giảm lỗi ngữ pháp, tập trung nâng chất lượng nội dung và cấu trúc bài viết.",
      tasks: [
        { type: "template", label: "Học templates nâng cao", route: "/templates", qTypes: ["q53", "q54"] },
        { type: "practice", label: "Luyện 5 bài Q54 chú ý cấu trúc", route: "/practice/q54", qTypes: ["q54"], targetCount: 5 },
      ],
      unlockAt: 12, minAvgPct: 60, scoreTypes: ["q51", "q52", "q53", "q54"],
    },
    {
      id: 4, title: "Giai đoạn 4 — Tổng ôn", subtitle: "Kiểm tra toàn diện",
      goal: "Đạt 70%+ tất cả tiêu chí",
      desc: "Giai đoạn cuối — kiểm tra toàn diện, so sánh tiến bộ từ giai đoạn 1.",
      tasks: [
        { type: "practice", label: "Luyện toàn bộ, theo dõi tiến bộ", route: "/practice" },
        { type: "review", label: "So sánh điểm giai đoạn 1 vs hiện tại", route: "/review" },
      ],
      unlockAt: 20, minAvgPct: 70, scoreTypes: ["q51", "q52", "q53", "q54"],
    },
  ],
  D: [
    {
      id: 1, title: "Giai đoạn 1 — Ôn lại nền tảng", subtitle: "Đảm bảo không bị lỗi cơ bản",
      goal: "Đạt 80%+ Q51/Q52, không lỗi ngữ pháp cơ bản",
      desc: "Trước khi đi vào nâng cao, cần đảm bảo không còn lỗi cơ bản ở Q51/Q52.",
      tasks: [
        { type: "practice", label: "Luyện 5 đề Q51/Q52", route: "/practice/q51", qTypes: ["q51", "q52"], targetCount: 5 },
        { type: "template", label: "Học biểu đạt nâng cao", route: "/templates", qTypes: ["q51", "q52"] },
      ],
      unlockAt: 0, minAvgPct: 0, scoreTypes: [],
    },
    {
      id: 2, title: "Giai đoạn 2 — Q53 nâng cao", subtitle: "Biểu đồ phức tạp, từ vựng học thuật",
      goal: "Đạt 27+/30, dùng từ vựng học thuật đa dạng",
      desc: "Luyện Q53 với tất cả dạng biểu đồ: cột, đường, so sánh giới tính, thay đổi theo thời gian.",
      tasks: [
        { type: "practice", label: "Luyện 10 đề Q53 tất cả loại biểu đồ", route: "/practice/q53", qTypes: ["q53"], targetCount: 10 },
      ],
      unlockAt: 5, minAvgPct: 70, scoreTypes: ["q51", "q52"],
    },
    {
      id: 3, title: "Giai đoạn 3 — Q54 nâng cao", subtitle: "Lập luận logic, lý lẽ sắc bén",
      goal: "Đạt 45+/50, lập luận thuyết phục với ví dụ cụ thể",
      desc: "Nâng cấp Q54 lên tầm học thuật: lập luận chặt chẽ, ví dụ thực tế, từ vựng phong phú.",
      tasks: [
        { type: "practice", label: "Luyện 10 đề Q54 đa dạng chủ đề", route: "/practice/q54", qTypes: ["q54"], targetCount: 10 },
        { type: "review", label: "Ôn lỗi và điều chỉnh", route: "/review" },
      ],
      unlockAt: 12, minAvgPct: 70, scoreTypes: ["q53"],
    },
    {
      id: 4, title: "Giai đoạn 4 — Mô phỏng thi thật", subtitle: "Thi thử trong thời gian thực tế",
      goal: "Hoàn thành Q51-Q54 trong 50 phút, đạt 80+/100",
      desc: "Mô phỏng điều kiện thi: làm Q51→Q52→Q53→Q54 liên tục trong 50 phút không nghỉ.",
      tasks: [
        { type: "practice", label: "Mock test tổng hợp", route: "/practice" },
      ],
      unlockAt: 22, minAvgPct: 75, scoreTypes: ["q51", "q52", "q53", "q54"],
    },
  ],
  E: [
    {
      id: 1, title: "Giai đoạn 1 — Q54 cơ bản", subtitle: "Nắm vững cấu trúc 4 đoạn",
      goal: "Viết đủ 600+ chữ, cấu trúc đúng, không lỗi ngữ pháp nghiêm trọng",
      desc: "Mục tiêu duy nhất: Q54 đạt 45-50/50. Bắt đầu từ cấu trúc 4 đoạn chuẩn.",
      tasks: [
        { type: "template", label: "Học template Q54 cơ bản", route: "/templates", qTypes: ["q54"] },
        { type: "practice", label: "Luyện 5 đề Q54", route: "/practice/q54", qTypes: ["q54"], targetCount: 5 },
        { type: "review", label: "Xem lỗi và điều chỉnh", route: "/review" },
      ],
      unlockAt: 0, minAvgPct: 0, scoreTypes: [],
    },
    {
      id: 2, title: "Giai đoạn 2 — Q54 nội dung", subtitle: "Nâng chất lượng lập luận",
      goal: "Đạt 40+/50, lập luận rõ ràng, ví dụ cụ thể",
      desc: "Tập trung vào chất lượng lập luận: ý kiến rõ ràng, dẫn chứng thực tế, kết luận thuyết phục.",
      tasks: [
        { type: "practice", label: "Luyện 10 đề Q54 chủ đề đa dạng", route: "/practice/q54", qTypes: ["q54"], targetCount: 10 },
        { type: "template", label: "Học template Q54 nâng cao", route: "/templates", qTypes: ["q54"] },
      ],
      unlockAt: 5, minAvgPct: 60, scoreTypes: ["q54"],
    },
    {
      id: 3, title: "Giai đoạn 3 — Q54 ngôn ngữ học thuật", subtitle: "Từ vựng & biểu đạt nâng cao",
      goal: "Đạt 45+/50, sử dụng từ vựng học thuật phong phú",
      desc: "Nâng cấp ngôn ngữ: thay thế từ thông thường bằng từ học thuật, câu phức tạp hơn.",
      tasks: [
        { type: "practice", label: "Luyện 10 đề Q54 chú ý ngôn ngữ", route: "/practice/q54", qTypes: ["q54"], targetCount: 10 },
        { type: "review", label: "Ôn lỗi ngôn ngữ", route: "/review" },
      ],
      unlockAt: 15, minAvgPct: 70, scoreTypes: ["q54"],
    },
    {
      id: 4, title: "Giai đoạn 4 — Hoàn thiện", subtitle: "Nhắm 47-50/50",
      goal: "Viết bài hoàn hảo trong 30 phút",
      desc: "Giai đoạn cuối: tốc độ + chất lượng. Viết Q54 hoàn chỉnh trong 30 phút.",
      tasks: [
        { type: "practice", label: "Luyện Q54 thi tốc độ", route: "/practice/q54", qTypes: ["q54"], targetCount: 10 },
      ],
      unlockAt: 25, minAvgPct: 80, scoreTypes: ["q54"],
    },
  ],
}

export function getStages(path: string): Stage[] {
  return PATH_STAGES[path] ?? PATH_STAGES["A"]
}

export function calcAvgPct(avgPct: Record<string, number>, types: string[]): number {
  if (types.length === 0) return 100
  const valid = types.filter((t) => t in avgPct)
  if (valid.length === 0) return 0
  return Math.round(valid.reduce((sum, t) => sum + avgPct[t], 0) / valid.length)
}

export function isStageUnlocked(stage: Stage, essayCount: number, avgPct: Record<string, number>): boolean {
  if (essayCount < stage.unlockAt) return false
  if (stage.minAvgPct === 0) return true
  return calcAvgPct(avgPct, stage.scoreTypes) >= stage.minAvgPct
}

export function getCurrentStageIdx(stages: Stage[], essayCount: number, avgPct: Record<string, number>): number {
  let current = 0
  for (let i = 0; i < stages.length; i++) {
    if (isStageUnlocked(stages[i], essayCount, avgPct)) current = i
  }
  return current
}
