import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import { calculateParticipationRate, getParticipationStatus } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

export default async function JourneyPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
    return null // redirect는 throw하지만 타입 안전성을 위해
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    return <div>사용자를 찾을 수 없습니다.</div>
  }

  const groupMemberships = await db.groupMember.findMany({
    where: {
      userId: user.id,
    },
    include: {
      group: true,
    },
  })

  // 그룹 시작일 기준으로 최신순 정렬 (최신이 위에)
  const sortedGroupMemberships = groupMemberships.sort((a, b) => {
    return b.group.startDate.getTime() - a.group.startDate.getTime()
  })

  const allClearCount = await db.groupMember.count({
    where: {
      userId: user.id,
      allClear: true,
    },
  })

  const totalPosts = await db.post.count({
    where: {
      authorId: user.id,
      isDeleted: false,
    },
  })

  const activeGroups = sortedGroupMemberships.filter((gm) => gm.status === 'ACTIVE').length

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">지나온 길</h1>

      <Card className="mb-6">
        <CardHeader>
          <div className="text-center">
            <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-200" />
            <h2 className="text-xl font-bold">{user.nickname}님의 여정</h2>
            <p className="mt-2 text-text-secondary">함께 걸어온 길을 되돌아보세요</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-text-tertiary">참여 그룹</p>
              <p className="text-2xl font-bold">{groupMemberships.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-text-tertiary">All Clear</p>
              <p className="text-2xl font-bold">{allClearCount}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-text-tertiary">총 인증</p>
              <p className="text-2xl font-bold">{totalPosts}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-text-tertiary">현재 참여</p>
              <p className="text-2xl font-bold">{activeGroups}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">그룹 참여 여정</h2>
        {sortedGroupMemberships.map((membership) => {
          const totalDays = Math.ceil(
            (membership.group.endDate.getTime() - membership.group.startDate.getTime()) /
              (1000 * 60 * 60 * 24)
          )
          const participationRate = calculateParticipationRate(
            membership.attendanceCount,
            totalDays
          )
          const status = getParticipationStatus(participationRate)

          return (
            <Link key={membership.id} href={`/groups/${membership.group.id}`}>
              <Card
                className={
                  status.status === 'allClear'
                    ? 'border-2 border-allClear bg-allClear-light all-clear-shimmer'
                    : status.status === 'low'
                      ? 'opacity-60'
                      : ''
                }
              >
                <CardHeader>
                  <h3 className="font-semibold">{membership.group.name}</h3>
                  <p className="text-sm text-text-tertiary">
                    {formatDate(membership.group.startDate)} ~{' '}
                    {formatDate(membership.group.endDate)}
                  </p>
                </CardHeader>
                <CardContent>
                  {status.status === 'allClear' ? (
                    <p className="font-medium text-allClear-dark">✅ All Clear (100%)</p>
                  ) : (
                    <p className="text-text-secondary">참여도: {participationRate}%</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {sortedGroupMemberships.length === 0 && (
        <div className="py-12 text-center text-text-secondary">
          <p>아직 참여한 그룹이 없습니다.</p>
          <p className="mt-2">첫 번째 그룹에 참여해보세요!</p>
        </div>
      )}
    </div>
  )
}
