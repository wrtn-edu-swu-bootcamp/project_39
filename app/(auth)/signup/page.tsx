import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SignupForm from '@/components/features/auth/SignupForm'

export default async function SignupPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/groups')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">회원가입</h1>
          <p className="mt-2 text-text-secondary">새로운 계정을 만들어주세요</p>
        </div>

        <SignupForm />
      </div>
    </div>
  )
}
