"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PenLine, Timer, BarChart2, RotateCcw } from "lucide-react"

const NAV_ITEMS = [
  { href: "/practice",      Icon: PenLine,   label: "Luyện viết" },
  { href: "/mock-exam",     Icon: Timer,     label: "Thi thử"   },
  { href: "/learning-path", Icon: BarChart2, label: "Phân tích" },
  { href: "/review",        Icon: RotateCcw, label: "Ôn lỗi"    },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 md:hidden border-t border-gray-100"
      style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)" }}>
      <div className="flex items-stretch h-16">
        {NAV_ITEMS.map(({ href, Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
              style={{ color: isActive ? "#0066CC" : "#AEAEB2" }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-semibold leading-none">{label}</span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-[#0066CC]"
                  style={{ marginTop: "-1px" }} />
              )}
            </Link>
          )
        })}
      </div>
      {/* safe area for iPhone home bar */}
      <div className="h-safe-bottom" style={{ height: "env(safe-area-inset-bottom)" }} />
    </nav>
  )
}
