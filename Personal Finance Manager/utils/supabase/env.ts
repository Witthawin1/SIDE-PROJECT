export function getSupabaseEnv() {
  // Prefer real environment variables (Vercel/v0 Environment Variables panel)
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    // Optionally allow injecting via window if ever needed
    (typeof window !== "undefined" ? (window as any).__SUPABASE_URL : undefined) ||
    // Fallback to your provided value so preview works without env panel
    "https://jgvmhpsxxxwhqlezhijt.supabase.co"

  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    (typeof window !== "undefined" ? (window as any).__SUPABASE_ANON_KEY : undefined) ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impndm1ocHN4eHh3aHFsZXpoaWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2Njk3NjAsImV4cCI6MjA3MDI0NTc2MH0.SnlMd5Xt_jx39fWwuV4W6teYskkKlNrTTvuuLeEOJ8o"

  if (!url || !anon) {
    throw new Error(
      "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    )
  }
  return { url, anon }
}
