import { cache } from "react"
import { createClient } from "./supabase-server"

// cache() deduplicates within a single render tree — getUser() only hits network once
// even if multiple Server Components in the same request call this
export const getUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})

export const getSupabaseClient = cache(async () => {
  return createClient()
})
