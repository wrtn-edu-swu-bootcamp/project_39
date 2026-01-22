import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import CommunityCommentForm from '@/components/features/community/CommunityCommentForm'
import CommunityComments from '@/components/features/community/CommunityComments'
import CommunityLikeButton from '@/components/features/community/CommunityLikeButton'

export default async function CommunityPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  const post = await db.communityPost.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          nickname: true,
          profileImageUrl: true,
        },
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
      likes: session
        ? {
            where: {
              userId: session.user.id,
            },
          }
        : false,
    },
  })

  if (!post || post.isDeleted) {
    return <div className="container mx-auto p-4">게시물을 찾을 수 없습니다.</div>
  }

  const isLiked = session && post.likes && post.likes.length > 0

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/community" className="text-primary hover:underline">
          ← 취미공유방
        </Link>
      </div>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div>
              <p className="font-medium">{post.author.nickname}</p>
              <p className="text-sm text-text-tertiary">{formatRelativeTime(post.createdAt)}</p>
            </div>
          </div>

          <p className="mb-4 whitespace-pre-wrap text-text-secondary">{post.content}</p>

          {post.imageUrl && (
            <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg">
              <Image src={post.imageUrl} alt={post.content} fill className="object-cover" />
            </div>
          )}

          <div className="flex items-center gap-4">
            <CommunityLikeButton postId={post.id} initialLiked={!!isLiked} initialLikeCount={post.likeCount} />
            <span className="text-sm text-text-tertiary">💬 {post.commentCount}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 font-semibold">댓글 ({post.comments.length})</h3>
          {session ? (
            <>
              <CommunityCommentForm postId={post.id} />
              <CommunityComments comments={post.comments} />
            </>
          ) : (
            <div className="py-4 text-center">
              <Link href="/login" className="text-primary hover:underline">
                로그인하여 댓글을 작성하세요
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
