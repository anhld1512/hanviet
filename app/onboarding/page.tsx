"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"

type LearningPath = "A" | "B" | "C" | "D" | "E"

interface Answers {
  user_type: string
  current_topik_level: string
  target_level: number
  target_exam_date: string
  writing_experience: string
}

function determineLearningPath(answers: Answers): LearningPath {
  const { writing_experience, target_level } = answers
  if (writing_experience === "never" && target_level <= 4) return "A"
  if ((writing_experience === "never" || writing_experience === "no_score") && target_level >= 5) return "B"
  if (writing_experience === "below_40") return "C"
  if (writing_experience === "40_60") return "D"
  if (writing_experience === "above_60") return "E"
  return "A"
}

// --- Step Components ---

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current ? "bg-blue-500" : i === current ? "bg-blue-400 w-8" : "bg-gray-200"
          } ${i === current ? "w-8" : "w-5"}`}
        />
      ))}
    </div>
  )
}

function OptionButton({
  emoji,
  label,
  sublabel,
  selected,
  onClick,
}: {
  emoji: string
  label: string
  sublabel?: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200 ${
        selected
          ? "border-blue-500 bg-blue-50 shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <span className="text-2xl shrink-0">{emoji}</span>
      <div>
        <div className={`font-semibold text-sm ${selected ? "text-blue-700" : "text-gray-900"}`}>
          {label}
        </div>
        {sublabel && (
          <div className="text-xs text-gray-500 mt-0.5">{sublabel}</div>
        )}
      </div>
      {selected && (
        <div className="ml-auto w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  )
}

// Step 1
function Step1({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { val: "university", emoji: "🎓", label: "Sinh viên đại học", sublabel: "Cần TOPIK 4+ để du học hoặc xin học bổng" },
    { val: "working", emoji: "💼", label: "Đang đi làm", sublabel: "Cần nâng cấp TOPIK để thăng tiến tại doanh nghiệp Hàn" },
    { val: "abroad", emoji: "✈️", label: "Du học sinh tại Hàn Quốc", sublabel: "Nghe/Đọc ổn, muốn cải thiện Writing" },
    { val: "self_study", emoji: "📚", label: "Tự học", sublabel: "Học theo lộ trình cá nhân" },
  ]
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Bạn là ai?</h2>
      <p className="text-gray-500 text-sm mb-6">Giúp chúng tôi cá nhân hóa lộ trình cho bạn</p>
      <div className="flex flex-col gap-3">
        {options.map((o) => (
          <OptionButton
            key={o.val}
            emoji={o.emoji}
            label={o.label}
            sublabel={o.sublabel}
            selected={value === o.val}
            onClick={() => onChange(o.val)}
          />
        ))}
      </div>
    </div>
  )
}

// Step 2
function Step2({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { val: "none", emoji: "0️⃣", label: "Chưa có TOPIK", sublabel: "Mới bắt đầu học tiếng Hàn" },
    { val: "1-2", emoji: "🌱", label: "TOPIK cấp 1-2", sublabel: "Trình độ cơ bản" },
    { val: "3", emoji: "📗", label: "TOPIK cấp 3", sublabel: "Trình độ trung cấp" },
    { val: "4", emoji: "📘", label: "TOPIK cấp 4", sublabel: "Trình độ trung cao cấp" },
    { val: "5+", emoji: "🏆", label: "TOPIK cấp 5 trở lên", sublabel: "Trình độ cao cấp" },
  ]
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Trình độ TOPIK hiện tại?</h2>
      <p className="text-gray-500 text-sm mb-6">Chúng tôi sẽ điều chỉnh nội dung phù hợp</p>
      <div className="flex flex-col gap-3">
        {options.map((o) => (
          <OptionButton
            key={o.val}
            emoji={o.emoji}
            label={o.label}
            sublabel={o.sublabel}
            selected={value === o.val}
            onClick={() => onChange(o.val)}
          />
        ))}
      </div>
    </div>
  )
}

// Step 3
function Step3({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const options = [
    { val: 3, emoji: "🎯", label: "Đạt cấp 3", sublabel: "120+ tổng / Writing 30+" },
    { val: 4, emoji: "🎯", label: "Đạt cấp 4", sublabel: "150+ tổng / Writing 50+" },
    { val: 5, emoji: "⭐", label: "Đạt cấp 5", sublabel: "190+ tổng / Writing 70+" },
    { val: 6, emoji: "🌟", label: "Đạt cấp 6", sublabel: "230+ tổng / Writing 80+" },
  ]
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Mục tiêu cấp mấy?</h2>
      <p className="text-gray-500 text-sm mb-6">Lộ trình sẽ tập trung vào ngưỡng điểm này</p>
      <div className="flex flex-col gap-3">
        {options.map((o) => (
          <OptionButton
            key={o.val}
            emoji={o.emoji}
            label={o.label}
            sublabel={o.sublabel}
            selected={value === o.val}
            onClick={() => onChange(o.val)}
          />
        ))}
      </div>
    </div>
  )
}

// Step 4
function Step4({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { val: "3months", emoji: "📅", label: "Kỳ thi trong 3 tháng tới", sublabel: "Cần học gấp, tập trung cao độ" },
    { val: "6months", emoji: "🗓️", label: "3-6 tháng nữa", sublabel: "Có thời gian xây nền tảng vững" },
    { val: "no_plan", emoji: "🕐", label: "Chưa có kế hoạch cụ thể", sublabel: "Học theo nhịp độ thoải mái" },
  ]
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Kỳ thi gần nhất?</h2>
      <p className="text-gray-500 text-sm mb-6">Để ưu tiên nội dung quan trọng nhất</p>
      <div className="flex flex-col gap-3">
        {options.map((o) => (
          <OptionButton
            key={o.val}
            emoji={o.emoji}
            label={o.label}
            sublabel={o.sublabel}
            selected={value === o.val}
            onClick={() => onChange(o.val)}
          />
        ))}
      </div>
    </div>
  )
}

// Step 5
function Step5({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { val: "never", emoji: "🆕", label: "Chưa bao giờ viết Q53/Q54", sublabel: "Bắt đầu từ template cơ bản" },
    { val: "no_score", emoji: "📝", label: "Đã viết nhưng không biết điểm", sublabel: "Luyện tập nhưng chưa có feedback" },
    { val: "below_40", emoji: "📉", label: "Đã thi thật, Writing dưới 40 điểm", sublabel: "Cần cải thiện căn bản" },
    { val: "40_60", emoji: "📊", label: "Đã thi thật, Writing 40-60 điểm", sublabel: "Đã có nền tảng, cần nâng cao" },
    { val: "above_60", emoji: "📈", label: "Đã thi thật, Writing trên 60 điểm", sublabel: "Nhắm điểm tối đa" },
  ]
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Kinh nghiệm viết TOPIK?</h2>
      <p className="text-gray-500 text-sm mb-6">Để xác định điểm xuất phát phù hợp</p>
      <div className="flex flex-col gap-3">
        {options.map((o) => (
          <OptionButton
            key={o.val}
            emoji={o.emoji}
            label={o.label}
            sublabel={o.sublabel}
            selected={value === o.val}
            onClick={() => onChange(o.val)}
          />
        ))}
      </div>
    </div>
  )
}

// Path description
const PATH_INFO: Record<LearningPath, { label: string; desc: string; emoji: string }> = {
  A: { emoji: "🌱", label: "Path A: Nền tảng từ đầu", desc: "Template Q51 → Q52 → Q53 → Q54 cơ bản" },
  B: { emoji: "⚡", label: "Path B: Tăng tốc", desc: "Template nhanh Q51-52, tập trung Q53+Q54 chuyên sâu" },
  C: { emoji: "🔧", label: "Path C: Sửa lỗi có hệ thống", desc: "Phân tích lỗi → luyện từng tiêu chí yếu nhất" },
  D: { emoji: "🚀", label: "Path D: Nâng cao", desc: "Q54 nâng cao, template nâng cao, từ vựng học thuật" },
  E: { emoji: "💎", label: "Path E: Chau chuốt", desc: "Chỉ luyện Q54, nhắm 45-50/50" },
}

// --- Main ---

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [answers, setAnswers] = useState<Answers>({
    user_type: "",
    current_topik_level: "",
    target_level: 0,
    target_exam_date: "",
    writing_experience: "",
  })

  const TOTAL_STEPS = 5

  function canProceed(): boolean {
    if (step === 0) return !!answers.user_type
    if (step === 1) return !!answers.current_topik_level
    if (step === 2) return answers.target_level > 0
    if (step === 3) return !!answers.target_exam_date
    if (step === 4) return !!answers.writing_experience
    return false
  }

  async function handleNext() {
    if (!canProceed()) return
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1)
      return
    }
    // Last step: save to Supabase
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }

      const learning_path = determineLearningPath(answers)

      await supabase.from("user_profiles").upsert({
        id: user.id,
        ...answers,
        learning_path,
        onboarding_completed: true,
        subscription_tier: "free",
        study_streak: 0,
        total_essays_written: 0,
      })

      router.push("/dashboard")
    } catch {
      setSaving(false)
    }
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1)
  }

  const path = determineLearningPath(answers)
  const pathInfo = PATH_INFO[path]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-5 pt-8 pb-0 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-400">
            {step + 1} / {TOTAL_STEPS}
          </span>
          {step > 0 && (
            <button
              onClick={handleBack}
              className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </button>
          )}
        </div>
        <StepIndicator current={step} total={TOTAL_STEPS} />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-6 max-w-md mx-auto w-full overflow-y-auto">
        {step === 0 && (
          <Step1
            value={answers.user_type}
            onChange={(v) => setAnswers((a) => ({ ...a, user_type: v }))}
          />
        )}
        {step === 1 && (
          <Step2
            value={answers.current_topik_level}
            onChange={(v) => setAnswers((a) => ({ ...a, current_topik_level: v }))}
          />
        )}
        {step === 2 && (
          <Step3
            value={answers.target_level}
            onChange={(v) => setAnswers((a) => ({ ...a, target_level: v }))}
          />
        )}
        {step === 3 && (
          <Step4
            value={answers.target_exam_date}
            onChange={(v) => setAnswers((a) => ({ ...a, target_exam_date: v }))}
          />
        )}
        {step === 4 && (
          <Step5
            value={answers.writing_experience}
            onChange={(v) => setAnswers((a) => ({ ...a, writing_experience: v }))}
          />
        )}

        {/* Path preview on last step (after selection) */}
        {step === 4 && answers.writing_experience && (
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{pathInfo.emoji}</span>
              <span className="font-bold text-blue-800 text-sm">{pathInfo.label}</span>
            </div>
            <p className="text-xs text-blue-600">{pathInfo.desc}</p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pb-8 pt-3 max-w-md mx-auto w-full">
        <button
          onClick={handleNext}
          disabled={!canProceed() || saving}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-2xl text-base transition-all duration-200 disabled:cursor-not-allowed"
        >
          {saving
            ? "Đang lưu..."
            : step === TOTAL_STEPS - 1
            ? "Bắt đầu luyện viết →"
            : "Tiếp theo →"}
        </button>
      </div>
    </div>
  )
}
