'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface GroupJoinButtonProps {
  groupId: string
  isFull: boolean
  approvalMode: 'AUTO' | 'MANUAL'
  isMember?: boolean
}

export default function GroupJoinButton({ groupId, isFull, approvalMode, isMember = false }: GroupJoinButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleJoin = async () => {
    if (isFull || isMember) return

    setLoading(true)
    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || '그룹 참여 중 오류가 발생했습니다.')
        return
      }

      router.push(`/groups/${groupId}/posts`)
      router.refresh()
    } catch (err) {
      alert('그룹 참여 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (isFull) {
    return (
      <Button variant="secondary" className="w-full opacity-60" disabled>
        모집 완료
      </Button>
    )
  }

  if (isMember) {
    return (
      <Button variant="secondary" className="w-full opacity-60" disabled>
        <Check className="mr-2 h-4 w-4" />
        참여완료
      </Button>
    )
  }

  return (
    <Button
      variant="primary"
      className="w-full"
      onClick={handleJoin}
      disabled={loading}
    >
      {loading ? '참여 중...' : approvalMode === 'AUTO' ? '그룹 참여하기' : '참여 신청하기'}
    </Button>
  )
}
