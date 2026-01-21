import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/groups')
  } else {
    // 비회원 모드로도 시작할 수 있도록 groups로 리다이렉트
    redirect('/groups')
  }
}
