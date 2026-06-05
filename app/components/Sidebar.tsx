"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { PenLine, Timer, BarChart2, RotateCcw, Zap, LogOut } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const NAV_ITEMS: { href: string; Icon: LucideIcon; label: string; badge?: string }[] = [
  { href: "/practice",      Icon: PenLine,   label: "Luyện viết" },
  { href: "/mock-exam",     Icon: Timer,     label: "Thi thử",   badge: "NEW" },
  { href: "/learning-path", Icon: BarChart2, label: "Phân tích" },
  { href: "/review",        Icon: RotateCcw, label: "Ôn lỗi" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isPro, setIsPro] = useState(true)

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
          setIsPro(data?.subscription_tier === "pro" || data?.is_pro === true)
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
      style={{ background: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)" }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ background: "#004F99" }}>
            한
          </div>
          <div>
            <div className="font-extrabold text-base leading-tight" style={{ color: "#1D1D1F", letterSpacing: "-0.02em" }}>
              HanViet
            </div>
            <div className="text-xs leading-tight font-medium" style={{ color: "#AEAEB2" }}>
              Writing Coach
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive ? "bg-blue-50 text-blue-700" : "hover:bg-[#F5F5F7]"
              }`}
              style={!isActive ? { color: "#6E6E73" } : {}}
            >
              <item.Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              <span className="flex-1 leading-none">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full tracking-wide">
                  {item.badge}
                </span>
              )}
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2.5 pb-4 space-y-1.5">
        {!isPro && (
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "#0066CC" }}
          >
            <Zap size={14} />
            <span>Nâng cấp Pro</span>
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:bg-[#F5F5F7]"
          style={{ color: "#AEAEB2" }}
        >
          <LogOut size={14} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
