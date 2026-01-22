import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import PostCommentForm from '@/components/features/posts/PostCommentForm'
import PostComments from '@/components/features/posts/PostComments'

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }
  const { id } = await params

  const post = await db.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          nickname: true,
          profileImageUrl: true,
        },
      },
      group: {
        select: {
          id: true,
          name: true,
        },
      },
      images: {
        orderBy: { order: 'asc' },
      },
      comments: {
        where: { isDeleted: false },
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
              profileImageUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!post || post.isDeleted) {
    return <div className="container mx-auto p-4">게시물을 찾을 수 없습니다.</div>
  }

  // 그룹 멤버인지 확인
  const groupMember = await db.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId: post.groupId,
        userId: session.user.id,
      },
    },
  })

  if (!groupMember || groupMember.status !== 'ACTIVE') {
    redirect(`/groups/${post.groupId}`)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href={`/groups/${post.groupId}/posts`} className="text-primary hover:underline">
          ← {post.group.name} 인증 목록
        </Link>
      </div>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div>
              <p className="font-medium">{post.author.nickname}</p>
              <p className="text-sm text-text-tertiary">{formatRelativeTime(post.postedAt)}</p>
            </div>
          </div>

          {post.content && (
            <p className="mb-4 whitespace-pre-wrap text-text-secondary">{post.content}</p>
          )}

          {post.images.length > 0 && (
            <div className="mb-4 space-y-2">
              {post.images.map((image) => (
                <div key={image.id} className="relative aspect-square w-full overflow-hidden rounded-lg">
                  <Image
                    src={image.imageUrl}
                    alt={post.content || '인증 사진'}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 font-semibold">댓글 ({post.comments.length})</h3>
          <PostCommentForm postId={post.id} />
          <PostComments comments={post.comments} />
        </CardContent>
      </Card>
    </div>
  )
}
