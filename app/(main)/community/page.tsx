import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/utils'
import Image from 'next/image'
import CommunityLikeButton from '@/components/features/community/CommunityLikeButton'

export default async function CommunityPage() {
  const session = await getServerSession(authOptions)

  // 오늘 이미 작성했는지 확인
  let hasPostedToday = false
  if (session) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayPost = await db.communityPost.findFirst({
      where: {
        authorId: session.user.id,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        isDeleted: false,
      },
    })

    hasPostedToday = !!todayPost
  }

  const posts = await db.communityPost.findMany({
    where: { isDeleted: false },
    include: {
      author: {
        select: {
          id: true,
          nickname: true,
          profileImageUrl: true,
        },
      },
      ...(session
        ? {
            likes: {
              where: {
                userId: session.user.id,
              },
            },
          }
        : {
            likes: {
              where: {
                id: 'never-match',
              },
            },
          }),
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-text-primary">취미공유방</h1>
        {session ? (
          hasPostedToday ? (
            <Button variant="secondary" size="sm" disabled className="opacity-60">
              <span className="mr-2">✓</span>
              작성완료
            </Button>
          ) : (
            <Link href="/community/create">
              <Button variant="primary" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                작성
              </Button>
            </Link>
          )
        ) : (
          <Link href="/login">
            <Button variant="primary" size="sm">
              로그인하기
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{post.author.nickname}</span>
                    <span className="text-sm text-text-tertiary">
                      {formatRelativeTime(post.createdAt)}
                    </span>
                  </div>
                  <Link href={`/community/${post.id}`}>
                    <p className="mt-2 whitespace-pre-wrap cursor-pointer hover:text-primary">
                      {post.content}
                    </p>
                  </Link>
                  {post.imageUrl && (
                    <Link href={`/community/${post.id}`}>
                      <div className="relative mt-4 h-64 md:h-80 w-full overflow-hidden rounded-xl">
                        <Image
                          src={post.imageUrl}
                          alt=""
                          fill
                          className="object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="mt-4 flex items-center gap-4">
                    {session ? (
                      <CommunityLikeButton
                        postId={post.id}
                        initialLiked={Array.isArray(post.likes) && post.likes.length > 0}
                        initialLikeCount={post.likeCount}
                      />
                    ) : (
                      <Link href={`/community/${post.id}`} className="text-sm text-text-tertiary hover:text-primary">
                        👍 {post.likeCount}
                      </Link>
                    )}
                    <Link href={`/community/${post.id}`} className="text-sm text-text-tertiary hover:text-primary">
                      💬 {post.commentCount}
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="py-12 text-center text-text-secondary">
          <p>아직 게시글이 없습니다.</p>
          <p className="mt-2">첫 번째 게시글을 작성해보세요!</p>
        </div>
      )}
    </div>
  )
}
