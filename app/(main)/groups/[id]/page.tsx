import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import GroupJoinButton from '@/components/features/groups/GroupJoinButton'

export default async function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  const group = await db.group.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          nickname: true,
          profileImageUrl: true,
        },
      },
      members: {
        where: { status: 'ACTIVE' },
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              profileImageUrl: true,
            },
          },
        },
      },
    },
  })

  if (!group) {
    return <div className="container mx-auto p-4">그룹을 찾을 수 없습니다.</div>
  }

  const isMember = session ? group.members.some((m) => m.userId === session.user.id) : false
  const isCreator = session ? group.creatorId === session.user.id : false
  const memberCount = group.members.length
  const isFull = memberCount >= group.maxMembers

  // 오늘의 인증률 계산 (그룹원만 볼 수 있음)
  let todayAttendanceRate = null
  if (isMember) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayPosts = await db.post.findMany({
      where: {
        groupId: id,
        postedAt: {
          gte: today,
          lt: tomorrow,
        },
        isDeleted: false,
      },
      select: {
        authorId: true,
      },
    })

    const todayPostUserIds = new Set(todayPosts.map((p) => p.authorId))
    const todayAttendanceCount = todayPostUserIds.size
    todayAttendanceRate = memberCount > 0 ? Math.round((todayAttendanceCount / memberCount) * 100) : 0
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/groups" className="text-primary hover:underline">
          ← 그룹 목록으로
        </Link>
      </div>

      <Card className="mb-6">
        {group.imageUrl && (
          <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
            <Image src={group.imageUrl} alt={group.name} fill className="object-cover" />
          </div>
        )}
        <CardHeader>
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <p className="text-text-secondary">{group.topic}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-text-tertiary">
                기간: {formatDate(group.startDate)} ~ {formatDate(group.endDate)}
              </p>
              <p className="text-sm text-text-tertiary">
                인원: {memberCount}/{group.maxMembers}명
              </p>
              <p className="text-sm text-text-tertiary">
                승인: {group.approvalMode === 'AUTO' ? '자동 승인' : '수동 승인'}
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">그룹 설명</h3>
              <p className="text-text-secondary">{group.description}</p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">그룹장</h3>
              <p className="text-text-secondary">{group.creator.nickname}</p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">멤버 ({memberCount}명)</h3>
              <div className="flex flex-wrap gap-2">
                {group.members.map((member) => (
                  <span key={member.id} className="text-sm text-text-secondary">
                    {member.user.nickname}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isMember && todayAttendanceRate !== null && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-tertiary">오늘의 인증률</p>
                <p className="text-2xl font-bold">{todayAttendanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {session && !isCreator && (
        <div className="mb-6">
          {isMember ? (
            <Link href={`/groups/${group.id}/posts`}>
              <Button variant="primary" className="w-full">
                그룹 보기
              </Button>
            </Link>
          ) : (
            <GroupJoinButton groupId={group.id} isFull={isFull} approvalMode={group.approvalMode} isMember={isMember} />
          )}
        </div>
      )}

      {session && isCreator && (
        <Link href={`/groups/${group.id}/posts`}>
          <Button variant="primary" className="w-full">
            그룹 관리
          </Button>
        </Link>
      )}

      {!session && (
        <div className="mb-6 space-y-2">
          <Link href="/login">
            <Button variant="primary" className="w-full">
              로그인하고 참여하기
            </Button>
          </Link>
          <p className="text-center text-sm text-text-tertiary">
            그룹에 참여하려면 로그인이 필요합니다
          </p>
        </div>
      )}
    </div>
  )
}
