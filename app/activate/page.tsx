"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Gift, CheckCircle, AlertCircle, Loader } from "lucide-react"

export default function ActivatePage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [bonus, setBonus] = useState(0)

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return

    setStatus("loading")
    setMessage("")

    try {
      const res = await fetch("/api/activate-voucher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setBonus(data.bonus)
        setMessage(data.message)
      } else {
        setStatus("error")
        setMessage(data.error ?? "Có lỗi xảy ra, thử lại sau")
      }
    } catch {
      setStatus("error")
      setMessage("Không thể kết nối, thử lại sau")
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {status === "success" ? (
            // ── Success state ──────────────────────────────────────
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h1 className="text-xl font-extrabold text-[#1D1D1F] mb-2">
                Kích hoạt thành công!
              </h1>
              <p className="text-[#6E6E73] text-sm mb-4">{message}</p>
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-6 py-4 mb-6 inline-block">
                <div className="text-3xl font-extrabold text-[#0066CC]">+{bonus}</div>
                <div className="text-xs text-blue-600 font-semibold mt-0.5">lượt chấm AI</div>
              </div>
              <p className="text-xs text-[#6E6E73] mb-6">
                Lượt chấm đã được cộng vào tài khoản. Bonus dùng trước, tháng sau free 5 lượt vẫn reset bình thường.
              </p>
              <button
                onClick={() => router.push("/practice")}
                className="w-full bg-[#0066CC] hover:bg-[#004F99] text-white font-bold py-3 rounded-xl transition-colors text-sm"
              >
                Bắt đầu luyện viết →
              </button>
            </div>
          ) : (
            // ── Input state ────────────────────────────────────────
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Gift size={20} className="text-[#0066CC]" />
                </div>
                <div>
                  <h1 className="text-lg font-extrabold text-[#1D1D1F] leading-tight">
                    Nhập mã voucher
                  </h1>
                  <p className="text-xs text-[#6E6E73] mt-0.5">
                    Kích hoạt lượt chấm AI miễn phí
                  </p>
                </div>
              </div>

              <form onSubmit={handleActivate} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase())
                      if (status === "error") setStatus("idle")
                    }}
                    placeholder="VD: HANVIET-BETA"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F5F5F7] font-mono text-sm text-[#1D1D1F] placeholder-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:border-[#0066CC] transition-all uppercase tracking-widest"
                    autoFocus
                    disabled={status === "loading"}
                  />

                  {/* Error message */}
                  {status === "error" && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-xs">
                      <AlertCircle size={13} />
                      <span>{message}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!code.trim() || status === "loading"}
                  className="w-full flex items-center justify-center gap-2 bg-[#0066CC] hover:bg-[#004F99] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                >
                  {status === "loading" ? (
                    <>
                      <Loader size={15} className="animate-spin" />
                      <span>Đang kích hoạt...</span>
                    </>
                  ) : (
                    "Kích hoạt →"
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                <button
                  onClick={() => router.push("/practice")}
                  className="text-xs text-[#AEAEB2] hover:text-[#6E6E73] transition-colors"
                >
                  ← Quay lại luyện viết
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-[#AEAEB2] mt-4">
          Mỗi mã voucher chỉ dùng được 1 lần / tài khoản
        </p>
      </div>
    </div>
  )
}
