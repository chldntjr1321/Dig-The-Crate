import { useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import AuthInput from '@/components/auth/AuthInput'
import PasswordToggle from '@/components/auth/PasswordToggle'
import useAuth from '@/hooks/useAuth'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/')
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="bg-form border border-border rounded-lg px-8 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <AuthInput
            id="email"
            label="EMAIL"
            type="email"
            placeholder="이메일을 입력하세요"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-medium text-secondary tracking-widest uppercase"
              >
                PASSWORD
              </label>
              <button
                type="button"
                className="text-xs font-medium text-muted tracking-widest uppercase cursor-pointer hover:text-secondary transition-colors"
              >
                FORGOT?
              </button>
            </div>
            <AuthInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightElement={
                <PasswordToggle
                  show={showPassword}
                  onToggle={() => setShowPassword((prev) => !prev)}
                />
              }
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        <Button type="submit" disabled={loading || !email || !password}>
          {loading ? '로그인 중...' : '로그인'}
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted tracking-widest uppercase">
            OR CONTINUE WITH
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-center gap-2 text-xs tracking-widest uppercase"
          >
            <span>🔊</span>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-center gap-2 text-xs tracking-widest uppercase"
          >
            <span>◎</span>
            Discogs
          </Button>
        </div>
      </div>

      <p className="text-center text-md text-secondary mt-6">
        아직 계정이 없으신가요?{' '}
        <Link
          to="/signup"
          className="text-accent hover:text-accent-hover font-medium underline transition-colors"
        >
          회원가입
        </Link>
      </p>
    </form>
  )
}

export default LoginForm
