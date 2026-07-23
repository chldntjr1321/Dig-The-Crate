import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import supabase from '@/lib/supabase'
import { resetGuestCollection } from '@/services/collections'

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, nickname: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } },
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (user && Boolean(user.user_metadata.is_guest)) {
      await resetGuestCollection(user.id)
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) throw error
  }

  const signInWithKakao = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'kakao' })
    if (error) throw error
  }

  const signInAsGuest = async () => {
    const response = await fetch('/api/guest-login', { method: 'POST' })
    if (!response.ok) throw new Error('게스트 로그인에 실패했습니다.')

    const { access_token, refresh_token } = await response.json()
    const { error } = await supabase.auth.setSession({ access_token, refresh_token })
    if (error) throw error
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithKakao,
    signInAsGuest,
  }
}

export default useAuth
