import { useState } from 'react'
import { Link } from 'react-router'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PasswordToggle from '@/components/ui/PasswordToggle'

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)

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

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-medium text-secondary tracking-widest uppercase"
              >
                PASSWORD
              </label>
              <span className="text-xs font-medium text-muted tracking-widest uppercase cursor-pointer hover:text-secondary transition-colors">
                FORGOT?
              </span>
            </div>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              rightElement={
                <PasswordToggle
                  show={showPassword}
                  onToggle={() => setShowPassword((prev) => !prev)}
                />
              }
            />
          </div>
        </div>

        <Button type="submit">로그인</Button>

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
