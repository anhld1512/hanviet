"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"

const NAV_ITEMS = [
  { href: "/practice",      icon: "✍️",  label: "Luyện viết" },
  { href: "/mock-exam",     icon: "⏱️",  label: "Thi thử",   badge: "NEW" },
  { href: "/learning-path", icon: "📊",  label: "Phân tích" },
  { href: "/review",        icon: "🃏",  label: "Ôn lỗi" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isPro, setIsPro] = useState(true) // default true to avoid flash of upgrade button

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from("user_profiles")
        .select("subscription_tier, is_pro")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          const pro = data?.subscription_tier === "pro" || data?.is_pro === true
          setIsPro(pro)
        })
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 flex flex-col z-20"
      style={{ background: "#fff", borderRight: "1px solid #e8ecf0" }}
    >
      {/* ── Logo ── */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid #e8ecf0" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            한
          </div>
          <div>
            <div className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">
              HanViet
            </div>
            <div className="text-xs text-slate-400 leading-tight font-medium">
              Writing Coach
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span className="flex-1 leading-none">{item.label}</span>
              {"badge" in item && item.badge && (
                <span className="text-[9px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full tracking-wide">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="px-2.5 pb-4 space-y-1.5">
        {!isPro && (
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)" }}
          >
            <span>⚡</span>
            <span>Nâng cấp Pro</span>
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <span>🚪</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
