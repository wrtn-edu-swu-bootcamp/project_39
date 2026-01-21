'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useState } from 'react'

export default function GuestBanner() {
  const { data: session } = useSession()
  const [isVisible, setIsVisible] = useState(true)

  // 로그인한 사용자에게는 표시하지 않음
  if (session || !isVisible) {
    return null
  }

  return (
    <div className="bg-primary/10 border-b border-border px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-primary">
            비회원 모드로 이용 중입니다.{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              로그인
            </Link>
            {' 하면 더 많은 기능을 이용할 수 있습니다.'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="ml-4 h-auto p-1"
          onClick={() => setIsVisible(false)}
          aria-label="배너 닫기"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
