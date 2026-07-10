import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/Button'
import AuthInput from '@/components/auth/AuthInput'
import PasswordToggle from '@/components/auth/PasswordToggle'
import useAuth from '@/hooks/useAuth'
import { loginSchema, type LoginFormValues } from '@/schemas/auth'

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')

  const { signIn } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  })

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setAuthError('')
    try {
      await signIn(email, password)
      navigate('/')
    } catch {
      setAuthError('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
      <div className="bg-form border border-border rounded-lg px-8 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <AuthInput
            id="email"
            label="EMAIL"
            type="email"
            placeholder="이메일을 입력하세요"
            autoComplete="email"
            errorMessage={errors.email?.message}
            {...register('email')}
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
              errorMessage={errors.password?.message}
              rightElement={
                <PasswordToggle
                  show={showPassword}
                  onToggle={() => setShowPassword((prev) => !prev)}
                />
              }
              {...register('password')}
            />
          </div>

          {authError && <p className="text-xs text-red-400">{authError}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting || !isValid}>
          {isSubmitting ? '로그인 중...' : '로그인'}
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
