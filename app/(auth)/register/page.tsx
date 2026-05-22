"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (error) {
      setError(
        error.message === "User already registered"
          ? "Email này đã được đăng ký. Thử đăng nhập?"
          : error.message
      )
      setLoading(false)
      return
    }

    // Nếu có session ngay = email confirmation đã tắt
    if (data.session) {
      router.push("/dashboard")
      return
    }

    // Nếu chưa có session = cần xác nhận email
    setError("")
    router.push("/login?registered=1")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🇰🇷</span>
          <span className="font-bold text-gray-900">HanViet</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-3xl mb-3">👋</div>
            <h1 className="text-2xl font-extrabold text-gray-900">Tạo tài khoản</h1>
            <p className="text-gray-500 text-sm mt-1">Miễn phí, không cần thẻ tín dụng</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Họ và tên
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                required
                minLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error === "User already registered"
                  ? "Email này đã được đăng ký. Thử đăng nhập?"
                  : error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-3.5 rounded-xl transition-colors mt-1"
            >
              {loading ? "Đang tạo tài khoản..." : "Đăng ký miễn phí →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
              Đăng nhập
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
            Bằng cách đăng ký, bạn đồng ý với điều khoản sử dụng của HanViet.
          </p>
        </div>
      </div>
    </div>
  )
}
