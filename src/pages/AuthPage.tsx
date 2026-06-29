import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'

interface AuthPageProps {
  page: 'login' | 'signup'
}

const AuthPage = ({ page }: AuthPageProps) => {
  return (
    <main className="min-h-screen bg-page flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-2 mb-8 select-none cursor-default">
        <h1 className="text-4xl font-bold text-primary">Dig The Crate</h1>
        <p className="text-md text-secondary">당신의 레코드 컬렉션</p>
      </div>
      {page === 'login' ? <LoginForm /> : <SignupForm />}
    </main>
  )
}

export default AuthPage
