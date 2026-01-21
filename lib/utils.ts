import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return '방금 전'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`

  return formatDate(d)
}

export function calculateParticipationRate(
  attendanceCount: number,
  totalDays: number
): number {
  if (totalDays === 0) return 0
  return Math.round((attendanceCount / totalDays) * 100)
}

export function getParticipationStatus(rate: number): {
  status: 'allClear' | 'normal' | 'low'
  label: string
} {
  if (rate === 100) {
    return { status: 'allClear', label: 'All Clear' }
  }
  if (rate >= 20) {
    return { status: 'normal', label: '일반 참여' }
  }
  return { status: 'low', label: '낮은 참여' }
}
