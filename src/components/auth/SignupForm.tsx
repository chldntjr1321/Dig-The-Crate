import { useState } from 'react'
import { Link } from 'react-router'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PasswordToggle from '@/components/ui/PasswordToggle'

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md">
      <div className="bg-form border border-border rounded-lg px-8 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <Input
            id="email"
            label="EMAIL"
            type="email"
            placeholder="이메일을 입력하세요"
            autoComplete="email"
          />

          <Input
            id="nickname"
            label="NICKNAME"
            type="text"
            placeholder="닉네임을 입력하세요"
            autoComplete="username"
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
              rightElement={
                <PasswordToggle
                  show={showPasswordConfirm}
                  onToggle={() => setShowPasswordConfirm((prev) => !prev)}
                />
              }
            />
          </div>
        </div>

        <Button type="submit">회원가입</Button>
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
