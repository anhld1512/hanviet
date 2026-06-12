"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { PenLine, Timer, BarChart2, RotateCcw, Zap, LogOut, Gift, MessageCircle } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const NAV_ITEMS: { href: string; Icon: LucideIcon; label: string; badge?: string }[] = [
  { href: "/practice",      Icon: PenLine,   label: "Luyện viết" },
  { href: "/mock-exam",     Icon: Timer,     label: "Thi thử",   badge: "NEW" },
  { href: "/learning-path", Icon: BarChart2, label: "Phân tích" },
  { href: "/review",        Icon: RotateCcw, label: "Ôn lỗi" },
]

const SIDEBAR_CACHE_KEY = "topeak_sidebar_state"
type SidebarCache = { isPro: boolean; bonus: number; remaining: number; ts: number }

function readCache(): SidebarCache | null {
  try {
    const raw = localStorage.getItem(SIDEBAR_CACHE_KEY)
    if (!raw) return null
    const c: SidebarCache = JSON.parse(raw)
    // Cache hết hạn sau 5 phút
    if (Date.now() - c.ts > 5 * 60 * 1000) return null
    return c
  } catch { return null }
}

function writeCache(c: Omit<SidebarCache, "ts">) {
  try { localStorage.setItem(SIDEBAR_CACHE_KEY, JSON.stringify({ ...c, ts: Date.now() })) } catch {}
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isPro, setIsPro] = useState<boolean | null>(null) // null = đang load
  const [bonus, setBonus] = useState(0)
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    // Hiện ngay từ cache (tránh delay nhìn thấy)
    const cached = readCache()
    if (cached) {
      setIsPro(cached.isPro)
      setBonus(cached.bonus)
      setRemaining(cached.isPro ? null : cached.remaining)
    }

    // Fetch mới từ DB (cập nhật cache sau)
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from("user_profiles")
        .select("subscription_tier, is_pro, bonus_gradings, monthly_gradings, grading_month, pro_expires_at")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          const pro =
            data?.subscription_tier === "pro" ||
            data?.is_pro === true ||
            (data?.pro_expires_at && new Date(data.pro_expires_at) > new Date())
          const rem = pro ? 0 : (() => {
            const currentMonth = new Date().toISOString().slice(0, 7)
            const used = data?.grading_month === currentMonth ? (data?.monthly_gradings ?? 0) : 0
            return Math.max(0, 5 - used)
          })()
          const bon = data?.bonus_gradings ?? 0
          setIsPro(!!pro)
          setBonus(bon)
          if (!pro) setRemaining(rem)
          writeCache({ isPro: !!pro, bonus: bon, remaining: rem })
        })
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 flex flex-col z-20"
      style={{ background: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)" }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black"
            style={{ background: "linear-gradient(145deg, #001A44 0%, #0055CC 100%)", fontSize: "18px", fontFamily: "'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif" }}>
            산
          </div>
          <div>
            <div className="font-extrabold text-base leading-tight" style={{ color: "#1D1D1F", letterSpacing: "-0.02em" }}>
              ToPeak
            </div>
            <div className="text-xs leading-tight font-medium" style={{ color: "#AEAEB2" }}>
              TOPIK to Peak
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
        {/* Bonus gradings indicator */}
        {isPro === false && bonus > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100">
            <Gift size={13} className="text-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-amber-700">
              {bonus} lượt bonus còn lại
            </span>
          </div>
        )}
        {/* Remaining count + Nâng cấp Pro — chỉ hiện khi biết chắc KHÔNG phải Pro */}
        {isPro === false && remaining !== null && (
          <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-gray-400 font-medium">Lượt chấm tháng này</span>
              <span className={`text-[11px] font-bold ${remaining === 0 ? "text-red-500" : remaining <= 2 ? "text-orange-500" : "text-gray-600"}`}>
                {remaining}/5
              </span>
            </div>
            <div className="h-1 rounded-full overflow-hidden bg-gray-200">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(4, (remaining / 5) * 100)}%`,
                  background: remaining === 0 ? "#EF4444" : remaining <= 2 ? "#F97316" : "#2563EB",
                }}
              />
            </div>
          </div>
        )}
        {isPro === false && (
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "#0066CC" }}
          >
            <Zap size={14} />
            <span>Nâng cấp Pro</span>
          </Link>
        )}
        <a
          href="https://www.facebook.com/profile.php?id=61590641043505"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold transition-colors hover:bg-blue-50"
          style={{ color: "#1877F2" }}
        >
          <MessageCircle size={14} />
          <span>Hỗ trợ qua Fanpage</span>
        </a>
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
