import { createClient } from '@supabase/supabase-js'

// 게스트 계정 비밀번호는 서버에서만 다루고 브라우저에는 세션 토큰만 내려준다.
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
  const guestEmail = process.env.GUEST_EMAIL
  const guestPassword = process.env.GUEST_PASSWORD

  if (!supabaseUrl || !supabaseAnonKey || !guestEmail || !guestPassword) {
    return new Response('Server misconfigured', { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase.auth.signInWithPassword({
    email: guestEmail,
    password: guestPassword,
  })

  if (error || !data.session) {
    return new Response('Guest login failed', { status: 500 })
  }

  return new Response(
    JSON.stringify({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}
