import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import BottomNav from '@/components/layout/BottomNav'
import GuestBanner from '@/components/layout/GuestBanner'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  // 세션이 없어도 비회원 모드로 접근 가능
  return (
    <div className="flex min-h-screen flex-col">
      {!session && <GuestBanner />}
      <main className="flex-1 pb-16">{children}</main>
      <BottomNav />
    </div>
  )
}
