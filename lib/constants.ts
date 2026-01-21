export const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const DURATION_OPTIONS = [
  { value: 3, label: '3주' },
  { value: 4, label: '1개월' },
  { value: 8, label: '2개월' },
  { value: 12, label: '3개월' },
] as const

export const MAX_MEMBERS_OPTIONS = [5, 10, 15, 20, 30, 50] as const
