import { cookies } from "next/headers"
import { getServerSupabase } from "@/utils/supabase/server"

export default async function DebugAuthPage() {
  let serverUser: { id: string; email: string | null } | null = null
  let serverError: string | null = null
  try {
    const supabase = await getServerSupabase()
    const { data, error } = await supabase.auth.getUser()
    if (error) serverError = error.message
    if (data?.user) serverUser = { id: data.user.id, email: data.user.email ?? null }
  } catch (e: any) {
    serverError = e.message
  }

  const cookieStore = await cookies()
  const sbCookies = cookieStore.getAll().filter((c) => c.name.startsWith("sb-"))

  return (
    <main className="max-w-2xl p-6 space-y-4">
      <h1 className="text-xl font-semibold">Auth Debug</h1>

      <section className="space-y-2">
        <h2 className="font-medium">Server auth.getUser()</h2>
        {serverUser ? (
          <pre className="rounded border bg-muted p-3 text-sm">{JSON.stringify(serverUser, null, 2)}</pre>
        ) : (
          <p className="text-sm text-red-600">No server user{serverError ? `: ${serverError}` : ""}</p>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Supabase cookies (names only)</h2>
        {sbCookies.length ? (
          <ul className="list-disc pl-5 text-sm">
            {sbCookies.map((c) => (
              <li key={c.name}>{c.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No sb-* cookies found</p>
        )}
      </section>

      <p className="text-sm text-muted-foreground">
        If there is no server user and no sb-* cookies, your environment variables may not be loaded or cookies are not being set.
      </p>
    </main>
  )
}