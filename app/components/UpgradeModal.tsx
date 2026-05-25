"use client"

import { useRouter } from "next/navigation"

export default function UpgradeModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-xl">✕</button>

        <div className="text-center mb-6">
          <div className="text-4xl mb-3">⚡</div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-1">Hết lượt miễn phí tháng này</h2>
          <p className="text-sm text-gray-500">
            Bạn đã dùng hết <strong>5 lượt chấm</strong> miễn phí. Nâng cấp Pro để luyện không giới hạn.
          </p>
        </div>

        {/* Value props */}
        <div className="space-y-2 mb-6">
          {[
            "✅ Chấm bài không giới hạn — luyện thoải mái",
            "✅ Thi thử full 4 câu với đồng hồ đếm ngược",
            "✅ Phân tích điểm yếu cá nhân theo tuần",
            "✅ Truy cập toàn bộ đề thi mới nhất",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="shrink-0">{item.split(" ")[0]}</span>
              <span>{item.split(" ").slice(1).join(" ")}</span>
            </div>
          ))}
        </div>

        {/* Pricing highlight */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5 text-center">
          <div className="text-xs text-blue-600 font-semibold mb-1">GÓI PHỔ BIẾN NHẤT</div>
          <div className="text-2xl font-extrabold text-gray-900">699.000 ₫</div>
          <div className="text-sm text-gray-500">6 tháng · ~117k/tháng · tiết kiệm 195k</div>
        </div>

        <button
          onClick={() => { onClose(); router.push("/pricing") }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors text-sm"
        >
          Xem tất cả gói →
        </button>
        <button onClick={onClose} className="w-full text-center text-xs text-gray-400 mt-3 hover:text-gray-600 transition-colors">
          Không, cảm ơn — tháng sau dùng tiếp
        </button>
      </div>
    </div>
  )
}
