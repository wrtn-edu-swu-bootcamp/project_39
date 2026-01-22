import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  try {
    const session = await getServerSession(authOptions)
    // 세션 여부와 관계없이 groups로 리다이렉트
    redirect('/groups')
  } catch (error) {
    // 세션 가져오기 실패 시에도 groups로 리다이렉트
    console.error('세션 가져오기 오류:', error)
    redirect('/groups')
  }
}
