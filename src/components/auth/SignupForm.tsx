import { useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PasswordToggle from '@/components/ui/PasswordToggle'
import useAuth from '@/hooks/useAuth'

const SignupForm = () => {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await signUp(email, password, nickname)
      navigate('/')
    } catch {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const isValid = email && nickname && password && passwordConfirm

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="bg-form border border-border rounded-lg px-8 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <Input
            id="email"
            label="EMAIL"
            type="email"
            placeholder="이메일을 입력하세요"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            id="nickname"
            label="NICKNAME"
            type="text"
            placeholder="닉네임을 입력하세요"
            autoComplete="username"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-secondary tracking-widest uppercase"
            >
              PASSWORD
            </label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력하세요"
              autoComplete="new-password"
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

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password-confirm"
              className="text-xs font-medium text-secondary tracking-widest uppercase"
            >
              CONFIRM PASSWORD
            </label>
            <Input
              id="password-confirm"
              type={showPasswordConfirm ? 'text' : 'password'}
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              rightElement={
                <PasswordToggle
                  show={showPasswordConfirm}
                  onToggle={() => setShowPasswordConfirm((prev) => !prev)}
                />
              }
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        <Button type="submit" disabled={loading || !isValid}>
          {loading ? '가입 중...' : '회원가입'}
        </Button>
      </div>

      <p className="text-center text-md text-secondary mt-6">
        이미 계정이 있으신가요?{' '}
        <Link
          to="/login"
          className="text-accent hover:text-accent-hover font-medium underline transition-colors"
        >
          로그인
        </Link>
      </p>
    </form>
  )
}

export default SignupForm
