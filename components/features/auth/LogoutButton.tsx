'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ 
      redirect: false,
      callbackUrl: '/groups'
    })
    router.push('/groups')
    router.refresh()
  }

  return (
    <Button 
      type="button" 
      variant="text" 
      className="w-full"
      onClick={handleLogout}
    >
      로그아웃
    </Button>
  )
}
