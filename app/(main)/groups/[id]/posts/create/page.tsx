import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import PostCreateForm from '@/components/features/posts/PostCreateForm'

export default async function CreatePostPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  const group = await db.group.findUnique({
    where: { id: params.id },
    include: {
      members: {
        where: {
          userId: session.user.id,
          status: 'ACTIVE',
        },
      },
    },
  })

  if (!group) {
    return <div className="container mx-auto p-4">그룹을 찾을 수 없습니다.</div>
  }

  const isMember = group.members.length > 0

  if (!isMember) {
    redirect(`/groups/${params.id}`)
  }

  // 오늘 이미 인증했는지 확인
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayPost = await db.post.findFirst({
    where: {
      groupId: params.id,
      authorId: session.user.id,
      postedAt: {
        gte: today,
        lt: tomorrow,
      },
      isDeleted: false,
    },
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">인증하기</h1>
      <PostCreateForm groupId={params.id} hasPostedToday={!!todayPost} />
    </div>
  )
}
