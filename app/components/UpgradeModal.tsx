"use client"

import { useRouter } from "next/navigation"

export default function UpgradeModal({ onClose, reason = "grading" }: { onClose: () => void; reason?: "grading" | "prompt" }) {
  const router = useRouter()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-xl leading-none">✕</button>

        <div className="text-center mb-5">
          <div className="text-4xl mb-3">⚡</div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-1">Hết lượt miễn phí tháng này</h2>
          <p className="text-sm text-gray-500">
            {reason === "prompt"
              ? <>Bạn đã dùng hết <strong>5 lượt tạo đề AI</strong> miễn phí. Nâng cấp Pro để tạo đề không giới hạn.</>
              : <>Bạn đã dùng hết <strong>5 lượt chấm</strong> miễn phí. Nâng cấp Pro để luyện không giới hạn.</>
            }
          </p>
        </div>

        {/* Value props */}
        <div className="space-y-1.5 mb-5">
          {[
            "Chấm bài không giới hạn — luyện thoải mái",
            "Thi thử full 4 câu với đồng hồ đếm ngược",
            "Phân tích điểm yếu cá nhân theo tuần",
            "Truy cập toàn bộ đề thi mới nhất (TOPIK 106)",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-500 shrink-0 font-bold">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Pricing highlight */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 text-center">
          <div className="text-xs text-blue-600 font-bold mb-1 uppercase tracking-wide">Gói phổ biến nhất</div>
          <div className="text-2xl font-extrabold text-gray-900">599.000 ₫</div>
          <div className="text-xs text-gray-500 mt-0.5">6 tháng · ~100k/tháng · tiết kiệm 33%</div>
        </div>

        {/* CTAs */}
        <button
          onClick={() => { onClose(); router.push("/pricing") }}
          className="w-full bg-[#0066CC] hover:bg-[#004F99] text-white font-bold py-3 rounded-xl transition-colors text-sm mb-2"
        >
          Xem tất cả gói →
        </button>

        {/* Fanpage contact */}
        <a
          href="https://www.facebook.com/profile.php?id=61590641043505"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Liên hệ đăng ký qua Fanpage
        </a>

        <button onClick={onClose} className="w-full text-center text-xs text-gray-400 mt-3 hover:text-gray-600 transition-colors">
          Không, cảm ơn — tháng sau dùng tiếp
        </button>
      </div>
    </div>
  )
}
