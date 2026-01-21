import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import Image from 'next/image'

interface PostGridProps {
  posts: {
    id: string
    content: string | null
    postedAt: Date
    commentCount: number
    author: {
      nickname: string
      profileImageUrl: string | null
    }
    images: {
      imageUrl: string
    }[]
  }[]
}

export default function PostGrid({ posts }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center text-text-secondary">
        <p>아직 인증 게시물이 없습니다.</p>
        <p className="mt-2">첫 번째 인증을 올려보세요!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`} className="block">
          <div className="group overflow-hidden rounded-lg bg-gray-100">
            {post.images[0] ? (
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={post.images[0].imageUrl}
                  alt={post.content || '인증 사진'}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center text-text-tertiary">
                사진 없음
              </div>
            )}
            {post.content && (
              <div className="p-2">
                <p className="line-clamp-2 text-xs text-text-secondary">{post.content}</p>
              </div>
            )}
            <div className="flex items-center gap-2 px-2 pb-2">
              <p className="text-xs text-text-tertiary">{post.author.nickname}</p>
              {post.commentCount > 0 && (
                <p className="text-xs text-text-tertiary">💬 {post.commentCount}</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
