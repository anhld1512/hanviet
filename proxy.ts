import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Admin routes: must be logged in AND be admin email
  if (pathname.startsWith("/admin")) {
    const adminEmail = process.env.ADMIN_EMAIL ?? "anhld1512@gmail.com"
    if (!user) return NextResponse.redirect(new URL("/login", request.url))
    if (user.email !== adminEmail) return NextResponse.redirect(new URL("/practice", request.url))
    return supabaseResponse
  }

  // Protected routes: redirect to /login if not authenticated
  const protectedRoutes = ["/dashboard", "/onboarding", "/practice", "/learning-path", "/templates", "/review", "/mock-exam"]
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/grade).*)",
  ],
}
