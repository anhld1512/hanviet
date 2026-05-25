import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "anhld1512@gmail.com"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only guard /admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next()

  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Not logged in → redirect to login
  if (!user) return NextResponse.redirect(new URL("/login", req.url))

  // Logged in but not admin → silent redirect to practice
  if (user.email !== ADMIN_EMAIL) return NextResponse.redirect(new URL("/practice", req.url))

  return res
}

export const config = {
  matcher: ["/admin/:path*"],
}
