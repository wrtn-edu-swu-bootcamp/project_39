import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import LoginForm from '@/components/features/auth/LoginForm'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/groups')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">그룹 챌린지</h1>
          <p className="mt-2 text-text-secondary">함께하는 루틴 챌린지</p>
        </div>

        <div className="space-y-4">
          <LoginForm />
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-text-secondary">또는</span>
          </div>
        </div>

        <form action="/groups" method="get">
          <Button type="submit" variant="outline" className="w-full" size="lg">
            비회원으로 둘러보기
          </Button>
        </form>

        <p className="text-center text-sm text-text-tertiary">
          계정이 없으신가요?{' '}
          <a href="/signup" className="text-primary hover:underline">
            회원가입하기
          </a>
        </p>
      </div>
    </div>
  )
}
