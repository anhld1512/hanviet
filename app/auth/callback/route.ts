import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  // Build redirect response first — cookies will be written onto this response
  // so the browser receives session cookies in the same round-trip as the redirect.
  const redirectOnboarding = NextResponse.redirect(`${origin}/onboarding`)
  const redirectPractice   = NextResponse.redirect(`${origin}/practice`)
  const redirectError      = NextResponse.redirect(`${origin}/login?error=auth_failed`)

  // Helper: write cookies onto a response
  function makeSupabase(res: NextResponse) {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            )
          },
        },
      }
    )
  }

  // Exchange code using the practice-redirect response as cookie target
  const supabase = makeSupabase(redirectPractice)
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) return redirectError

  // Check onboarding
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("onboarding_completed")
    .eq("id", data.user.id)
    .single()

  if (!profile || !profile.onboarding_completed) {
    // Copy cookies to onboarding redirect too
    const supabase2 = makeSupabase(redirectOnboarding)
    await supabase2.auth.exchangeCodeForSession(code).catch(() => null)

    await supabase.from("user_profiles").upsert({
      id: data.user.id,
      display_name: data.user.user_metadata?.full_name || data.user.email,
      avatar_url: data.user.user_metadata?.avatar_url || null,
      email: data.user.email,
      onboarding_completed: false,
    })
    // Copy session cookies from practice response to onboarding response
    redirectPractice.cookies.getAll().forEach(({ name, value, ...options }) =>
      redirectOnboarding.cookies.set(name, value, options)
    )
    return redirectOnboarding
  }

  return redirectPractice
}
