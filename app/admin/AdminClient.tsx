"use client"

import { useState, useCallback } from "react"
import Link from "next/link"

type UserRow = {
  id: string
  email: string
  display_name: string | null
  subscription_tier: string
  is_pro: boolean | null
  pro_expires_at: string | null
  total_essays_written: number
  study_streak: number
  created_at: string
}

type Stats = { totalUsers: number; proUsers: number; totalSubs: number }

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function ProBadge({ user }: { user: UserRow }) {
  const isPro = user.subscription_tier === "pro" || user.is_pro
  const expired = user.pro_expires_at ? new Date(user.pro_expires_at) < new Date() : false
  if (!isPro) return <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">Free</span>
  if (expired) return <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">Pro (hết hạn)</span>
  return <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">⚡ Pro</span>
}

function UserCard({ user, onRefresh }: { user: UserRow; onRefresh: () => void }) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [months, setMonths] = useState(6)
  const isPro = user.subscription_tier === "pro" || user.is_pro

  async function grantPro() {
    setLoading(true); setMsg(null)
    try {
      const r = await fetch("/api/admin/grant-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail: user.email, action: "grant", months }),
      })
      const d = await r.json()
      setMsg(d.message ?? d.error)
      if (r.ok) onRefresh()
    } finally { setLoading(false) }
  }

  async function revokePro() {
    if (!confirm(`Revoke Pro của ${user.email}?`)) return
    setLoading(true); setMsg(null)
    try {
      const r = await fetch("/api/admin/grant-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail: user.email, action: "revoke" }),
      })
      const d = await r.json()
      setMsg(d.message ?? d.error)
      if (r.ok) onRefresh()
    } finally { setLoading(false) }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-bold text-gray-900 text-sm">{user.display_name ?? "—"}</div>
          <div className="text-xs text-gray-500 mt-0.5">{user.email}</div>
        </div>
        <ProBadge user={user} />
      </div>

      <div className="flex gap-4 text-xs text-gray-500 mb-3">
        <span>📝 {user.total_essays_written} bài</span>
        <span>🔥 {user.study_streak} ngày</span>
        <span>📅 Đăng ký {formatDate(user.created_at)}</span>
        {user.pro_expires_at && <span>⏰ HH {formatDate(user.pro_expires_at)}</span>}
      </div>

      {msg && (
        <div className={`text-xs rounded-lg px-3 py-2 mb-3 ${msg.includes("error") || msg.includes("not found") ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-700"}`}>
          {msg}
        </div>
      )}

      <div className="flex items-center gap-2">
        {!isPro ? (
          <>
            <select
              value={months}
              onChange={e => setMonths(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
            >
              <option value={1}>1 tháng</option>
              <option value={3}>3 tháng</option>
              <option value={6}>6 tháng</option>
              <option value={12}>12 tháng</option>
            </select>
            <button
              onClick={grantPro}
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 text-white font-bold text-xs py-1.5 px-3 rounded-lg transition-colors"
            >
              {loading ? "..." : "⚡ Cấp Pro"}
            </button>
          </>
        ) : (
          <button
            onClick={revokePro}
            disabled={loading}
            className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
          >
            {loading ? "..." : "Revoke Pro"}
          </button>
        )}
      </div>
    </div>
  )
}

export default function AdminClient({ stats, recentUsers }: { stats: Stats; recentUsers: UserRow[] }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<UserRow[]>([])
  const [searching, setSearching] = useState(false)
  const [list, setList] = useState<UserRow[]>(recentUsers)
  const [mode, setMode] = useState<"recent" | "search">("recent")

  const search = useCallback(async (q: string) => {
    if (q.length < 3) { setResults([]); setMode("recent"); return }
    setSearching(true)
    try {
      const r = await fetch(`/api/admin/grant-pro?q=${encodeURIComponent(q)}`)
      const d = await r.json()
      setResults(d.users ?? [])
      setMode("search")
    } finally { setSearching(false) }
  }, [])

  function handleRefresh() {
    // Re-fetch recent list after a grant/revoke
    fetch("/api/admin/grant-pro?q=@").then(r => r.json()).then(d => {
      if (d.users) setList(d.users)
    })
    if (query.length >= 3) search(query)
  }

  const displayed = mode === "search" ? results : list

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <Link href="/practice" className="text-gray-400 hover:text-gray-600 text-sm">← Luyện viết</Link>
        <div className="w-px h-4 bg-gray-200" />
        <span className="font-bold text-gray-900">🛠️ Admin Panel</span>
        <span className="ml-auto text-xs text-gray-400">HanViet Writing Coach</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Tổng users", value: stats.totalUsers, icon: "👥", color: "text-blue-600" },
            { label: "Pro users", value: stats.proUsers, icon: "⚡", color: "text-gray-600" },
            { label: "Tổng submissions", value: stats.totalSubs, icon: "📝", color: "text-blue-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
              <div className="text-3xl">{s.icon}</div>
              <div>
                <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-3">Tìm user</h2>
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); search(e.target.value) }}
            placeholder="Tìm theo email (≥3 ký tự)..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {searching && <p className="text-xs text-gray-400 mt-2">Đang tìm...</p>}
          {mode === "search" && !searching && (
            <p className="text-xs text-gray-400 mt-2">{results.length} kết quả</p>
          )}
        </div>

        {/* User list */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">
            {mode === "search" ? `Kết quả tìm kiếm "${query}"` : "Users mới nhất"}
          </h2>
          {mode === "search" && (
            <button onClick={() => { setQuery(""); setMode("recent") }} className="text-xs text-gray-400 hover:text-gray-600">
              ← Xem tất cả
            </button>
          )}
        </div>

        {displayed.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {mode === "search" ? "Không tìm thấy user" : "Chưa có user nào"}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {displayed.map(u => (
              <UserCard key={u.id} user={u} onRefresh={handleRefresh} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
