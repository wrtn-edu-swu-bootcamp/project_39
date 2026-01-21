import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import LogoutButton from '@/components/features/auth/LogoutButton'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      groupMemberships: {
        where: { status: 'ACTIVE' },
        include: {
          group: true,
        },
      },
      badges: {
        include: {
          badge: true,
        },
      },
    },
  })

  if (!user) {
    return <div>사용자를 찾을 수 없습니다.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">프로필</h1>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gray-200" />
            <div>
              <h2 className="text-xl font-bold">{user.nickname}</h2>
              <p className="text-text-secondary">Lv. {user.level}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {user.bio && <p className="text-text-secondary">{user.bio}</p>}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Link href="/profile/settings">
          <Button variant="secondary" className="w-full">
            프로필 수정
          </Button>
        </Link>
        <LogoutButton />
      </div>
    </div>
  )
}
