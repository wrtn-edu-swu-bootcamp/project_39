'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CommunityLikeButtonProps {
  postId: string
  initialLiked: boolean
  initialLikeCount: number
}

export default function CommunityLikeButton({
  postId,
  initialLiked,
  initialLikeCount,
}: CommunityLikeButtonProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (loading) return

    setLoading(true)
    try {
      const response = await fetch('/api/community/likes', {
        method: liked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })

      if (!response.ok) {
        throw new Error('좋아요 처리 실패')
      }

      setLiked(!liked)
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
      router.refresh()
    } catch (error) {
      console.error('좋아요 오류:', error)
      alert('좋아요 처리 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="text"
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
      <span>{likeCount}</span>
    </Button>
  )
}
