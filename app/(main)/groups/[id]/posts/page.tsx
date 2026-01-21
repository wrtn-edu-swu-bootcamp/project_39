import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import PostGrid from '@/components/features/posts/PostGrid'

export default async function GroupPostsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  const group = await db.group.findUnique({
    where: { id: params.id },
    include: {
      members: {
        where: {
          status: 'ACTIVE',
        },
      },
    },
  })

  if (!group) {
    return <div className="container mx-auto p-4">그룹을 찾을 수 없습니다.</div>
  }

  const isMember = group.members.some((m) => m.userId === session.user.id)

  if (!isMember) {
    redirect(`/groups/${params.id}`)
  }

  const posts = await db.post.findMany({
    where: {
      groupId: params.id,
      isDeleted: false,
    },
    include: {
      author: {
        select: {
          id: true,
          nickname: true,
          profileImageUrl: true,
        },
      },
      images: {
        orderBy: { order: 'asc' },
      },
      comments: {
        where: { isDeleted: false },
      },
    },
    orderBy: { postedAt: 'desc' },
  })

  // 오늘의 인증률 계산
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayPosts = await db.post.findMany({
    where: {
      groupId: params.id,
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
  const totalMembers = group.members.length
  const todayAttendanceCount = todayPostUserIds.size
  const todayAttendanceRate = totalMembers > 0 ? Math.round((todayAttendanceCount / totalMembers) * 100) : 0

  // 오늘 이미 인증했는지 확인
  const hasPostedToday = todayPostUserIds.has(session.user.id)

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href={`/groups/${params.id}`} className="text-primary hover:underline">
            ← 그룹 정보
          </Link>
          <h1 className="mt-2 text-2xl font-bold">{group.name}</h1>
        </div>
        {hasPostedToday ? (
          <Button variant="secondary" size="sm" disabled className="opacity-60">
            <span className="mr-2">✓</span>
            인증완료
          </Button>
        ) : (
          <Link href={`/groups/${params.id}/posts/create`}>
            <Button variant="primary" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              인증하기
            </Button>
          </Link>
        )}
      </div>

      <div className="mb-6 rounded-lg bg-primary/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-tertiary">오늘의 인증률</p>
            <p className="text-2xl font-bold">{todayAttendanceRate}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-tertiary">
              {todayAttendanceCount}명 / {totalMembers}명
            </p>
          </div>
        </div>
      </div>

      <PostGrid posts={posts} />
    </div>
  )
}
