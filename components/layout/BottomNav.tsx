'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, MessageSquare, Map, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/groups', label: '그룹', icon: Home },
  { href: '/community', label: '취미공유방', icon: MessageSquare },
  { href: '/journey', label: '지나온 길', icon: Map },
  { href: '/profile', label: '프로필', icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2',
                isActive ? 'text-primary' : 'text-text-tertiary'
              )}
            >
              <Icon size={24} />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
