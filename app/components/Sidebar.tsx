"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"

const NAV_ITEMS = [
  { href: "/practice",      icon: "✍️", label: "Luyện viết" },
  { href: "/mock-exam",     icon: "⏱️", label: "Thi thử",   badge: "NEW" },
  { href: "/learning-path", icon: "📊", label: "Phân tích" },
  { href: "/review",        icon: "🃏", label: "Ôn lỗi" },
]

export default function Sidebar({ tier = "free" }: { tier?: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-white border-r border-gray-100 flex flex-col z-20">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">✍️</span>
          <div>
            <div className="font-extrabold text-gray-900 text-base leading-tight">HanViet</div>
            <div className="text-xs text-gray-400 leading-tight">Writing Coach</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {"badge" in item && item.badge && (
                <span className="text-[9px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-2">
        {tier === "free" && (
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2 w-full border-2 border-blue-500 text-blue-600 font-bold text-sm py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <span>⚡</span>
            <span>Nâng cấp Pro</span>
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span>🚪</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
