"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"

export default function NavAuth() {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session)
    })
  }, [])

  if (loggedIn) {
    return (
      <Link
        href="/dashboard"
        className="text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Vào Dashboard →
      </Link>
    )
  }

  return (
    <>
      <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
        Đăng nhập
      </Link>
      <a
        href="#lessons"
        className="text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Học thử miễn phí
      </a>
    </>
  )
}
