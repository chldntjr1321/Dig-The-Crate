import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/Button'
import AuthInput from '@/components/auth/AuthInput'
import PasswordToggle from '@/components/auth/PasswordToggle'
import useAuth from '@/hooks/useAuth'
import { signupSchema, type SignupFormValues } from '@/schemas/auth'

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [authError, setAuthError] = useState('')

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  })

  const onSubmit = async ({ email, password, nickname }: SignupFormValues) => {
    setAuthError('')
    try {
      await signUp(email, password, nickname)
      navigate('/')
    } catch {
      setAuthError('회원가입에 실패했습니다. 다시 시도해주세요.')
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

          <AuthInput
            id="nickname"
            label="NICKNAME"
            type="text"
            placeholder="닉네임을 입력하세요"
            autoComplete="username"
            errorMessage={errors.nickname?.message}
            {...register('nickname')}
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-secondary tracking-widest uppercase"
            >
              PASSWORD
            </label>
            <AuthInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력하세요"
              autoComplete="new-password"
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

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password-confirm"
              className="text-xs font-medium text-secondary tracking-widest uppercase"
            >
              CONFIRM PASSWORD
            </label>
            <AuthInput
              id="password-confirm"
              type={showPasswordConfirm ? 'text' : 'password'}
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
              errorMessage={errors.passwordConfirm?.message}
              rightElement={
                <PasswordToggle
                  show={showPasswordConfirm}
                  onToggle={() => setShowPasswordConfirm((prev) => !prev)}
                />
              }
              {...register('passwordConfirm')}
            />
          </div>

          {authError && <p className="text-xs text-red-400">{authError}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting || !isValid}>
          {isSubmitting ? '가입 중...' : '회원가입'}
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
