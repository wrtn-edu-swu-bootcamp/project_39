import { formatRelativeTime } from '@/lib/utils'

interface PostCommentsProps {
  comments: {
    id: string
    content: string
    createdAt: Date
    author: {
      id: string
      nickname: string
      profileImageUrl: string | null
    }
  }[]
}

export default function PostComments({ comments }: PostCommentsProps) {
  if (comments.length === 0) {
    return <p className="py-4 text-center text-sm text-text-tertiary">댓글이 없습니다.</p>
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{comment.author.nickname}</span>
              <span className="text-xs text-text-tertiary">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
            <p className="mt-1 text-sm text-text-secondary">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
