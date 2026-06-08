# HanViet — Session Memory (cập nhật 08/06/2026 — session 4)

## Trạng thái project

App luyện viết TOPIK II. Session 4 tập trung toàn bộ vào **UI redesign** — bỏ emoji, Lucide icons, Duolingo-style dashboard, flip countdown. **Đã commit + push lên GitHub** (`2355d45`). Chưa deploy Vercel.

## Stack
- Next.js 16.2.6 + React 19 + Tailwind 4
- Supabase (auth + DB)
- DeepSeek V4 Flash (grading Q51-54 + generate prompt)
- **lucide-react** (mới install session 4)

## File quan trọng
- `app/api/grade/route.ts` — API chấm điểm (gọi `lib/ai-grading.ts`)
- `app/api/generate-prompt/route.ts` — API tạo đề AI
- `lib/ai-grading.ts` — Logic gọi DeepSeek, parse JSON, fallback
- `lib/grading-prompts.ts` — Prompt chấm điểm
- `lib/usage.ts` — Giới hạn free tier (5 lần/tháng)
- `app/components/grading/GradingResult.tsx` — Kết quả chấm (2-col layout)
- `app/components/writing/TopikCountdown.tsx` — Flip card countdown (mới, session 4)
- `app/practice/q53/page.tsx`, `app/practice/q54/page.tsx` — truyền `userAnswer`
- `supabase/schema.sql` — Schema DB

## Cấu trúc routes
- `/practice/q51` → `/q52` → `/q53` → `/q54`
- `/learning-path` — Dashboard chính (Duolingo-style)
- `/mock-exam` — Thi thử 4 câu 50 phút
- `/review` — Ôn lỗi flashcard
- `/pricing` — Gói Free / Pro

## Tình trạng account test
- Email: anhld1512@gmail.com
- `is_pro = true`

---

## ✅ Session 3 — Apple-inspired Color System

### Color System:
```
Background:     #F5F5F7
Sidebar bg:     #FFFFFF
Text chính:     #1D1D1F
Text phụ:       #6E6E73
Text mờ:        #AEAEB2
Border:         #D2D2D7
Primary:        #0066CC / #004F99
Letter-spacing: -0.02em headings
```

### Q Colors:
```
Q51: #007AFF  bg: #E8F0FE
Q52: #34C759  bg: #E8F8ED
Q53: #FF9500  bg: #FFF3E0
Q54: #FF2D55  bg: #FFE8EE
```

---

## ✅ Session 4 — UI Redesign (commit `2355d45`)

### Dashboard `/learning-path` — Duolingo-style:
- **Streak hero**: Lucide `Flame` + số ngày to + câu khích lệ + stats chips
- **Q Progress 2-col**: 4 card (Lucide icon + bar + %) | CTA luyện hôm nay xanh
- **Mẫu câu hôm nay**: 12 mẫu TOPIK II xoay ngày — pattern + ví dụ Korean + dịch + cách áp dụng
- Quick links row pill, không emoji

### Practice page `/practice`:
- **TopikCountdown** thay ScoreRings: flip card xanh (#0071E3 top / #004F99 bottom), đếm ngược đến 12/7/2026
- Message theo khoảng cách kỳ thi, rõ ràng không slang
- **Gradient watermark**: số 51/52/53/54 ở top-right mỗi card
  - `linear-gradient(225deg, accent18 → accent08 → transparent)`, font 200px, bleed off edge
- Badge text Q51–Q54 bỏ, thay bằng watermark + time nhỏ
- Lucide icons: Mail, Scale, BarChart2, BookOpen

### Emoji cleanup toàn bộ:
| File | Thay thế |
|---|---|
| `Sidebar.tsx` | PenLine, Timer, BarChart2, RotateCcw, Zap, LogOut |
| `SkillDashboardClient.tsx` | Lucide Flame + text |
| `practice/page.tsx` | Mail, Scale, BarChart2, BookOpen |
| `ReviewClient.tsx` | Text thuần |
| `ExamClient.tsx` | Timer, Zap + text |
| `GradingResult.tsx` | ✓/✗/· + text |

---

## 🐛 Bugs còn lại (chưa fix)
| # | Mức | Nơi | Mô tả |
|---|---|---|---|
| 2 | 🟡 | `/pricing` | Cả 2 gói Pro đều hiện "Đang dùng" |
| 3 | 🟡 | `/pricing` | QR Code chưa có ảnh thật |
| 4 | ⚪ | `/dashboard` | Redirect → `/learning-path`, URL không nhất quán |
| 5 | ⚪ | `/mock-exam` | Nút "← Quay lại" quá nhỏ |

## Việc cần làm tiếp (ưu tiên)
- [ ] **Deploy Vercel** — code đã push `2355d45` nhưng chưa trigger deploy
- [ ] Verify GradingResult, mock-exam, review trên browser
- [ ] Fix bug #2 pricing "Đang dùng" sai
- [ ] Fix bug #3 QR Code
- [ ] Test edge cases: bài rỗng, bài >720 chữ
- [ ] Cập nhật lịch TOPIK trong `TopikCountdown.tsx` hàng năm

## .claude/launch.json
```json
{
  "name": "hanviet",
  "runtimeExecutable": "/Users/anhld1512/Documents/Work/hanviet/node_modules/.bin/next",
  "runtimeArgs": ["dev", "/Users/anhld1512/Documents/Work/hanviet"],
  "port": 3000,
  "autoPort": true
}
```
*Server chạy port 3000. Chrome extension dùng để verify UI.*
