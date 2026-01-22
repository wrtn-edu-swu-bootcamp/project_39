'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, Map, User } from 'lucide-react'
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
    <>
      {/* PC 상단 네비게이션 */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/groups" className="text-xl font-bold text-primary">
              그룹 챌린지
            </Link>
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname?.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'text-primary bg-primary/10 font-medium'
                        : 'text-text-secondary hover:text-primary hover:bg-primary/5'
                    )}
                  >
                    <Icon size={20} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* 모바일 하단 네비게이션 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname?.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors',
                  isActive ? 'text-primary' : 'text-text-tertiary'
                )}
              >
                <Icon size={22} />
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
