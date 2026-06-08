"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-client"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleGoogleLogin() {
    setError("")
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError("Có lỗi xảy ra. Thử lại nhé!")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black mx-auto mb-3"
          style={{ background: "linear-gradient(145deg, #001A44 0%, #0055CC 100%)", fontSize: "30px", fontFamily: "'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif", boxShadow: "0 8px 24px rgba(0,60,200,0.35)" }}>
          산
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">ToPeak</h1>
        <p className="text-gray-500 text-sm mt-1">TOPIK to Peak — Lên đỉnh TOPIK</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Bắt đầu luyện viết</h2>
          <p className="text-gray-500 text-sm mt-2">
            AI chấm điểm Q51-54 theo rubric của Viện Giáo dục Quốc tế Hàn Quốc (NIIED)
            <br />
            Feedback 100% tiếng Việt
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 font-semibold py-3.5 rounded-xl transition-all duration-200"
        >
          {loading ? (
            <span className="text-sm">Đang chuyển hướng...</span>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Đăng nhập bằng Google</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
          Bằng cách đăng nhập, bạn đồng ý với{" "}
          <span className="text-blue-500 cursor-pointer">Điều khoản sử dụng</span>
          {" "}và{" "}
          <span className="text-blue-500 cursor-pointer">Chính sách bảo mật</span>
        </p>
      </div>

      {/* Social proof */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          Điểm Writing TB thí sinh: <strong className="text-gray-600">33/100</strong>
          {" "}— Tăng lên{" "}
          <strong className="text-blue-600">70+ điểm</strong> với ToPeak
        </p>
      </div>
    </div>
  )
}
