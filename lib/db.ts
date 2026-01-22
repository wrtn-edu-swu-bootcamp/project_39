import { PrismaClient } from '@prisma/client'

// 환경 변수 확인 (Next.js는 자동으로 .env.local을 로드함)
if (!process.env.DATABASE_URL) {
  const errorMessage = `
❌ DATABASE_URL 환경 변수가 설정되지 않았습니다.

다음 중 하나를 확인해주세요:
1. .env.local 파일에 DATABASE_URL이 있는지 확인
2. .env 파일에 DATABASE_URL이 있는지 확인
3. 개발 서버를 재시작했는지 확인

현재 환경 변수:
- NODE_ENV: ${process.env.NODE_ENV}
- DATABASE_URL: ${process.env.DATABASE_URL || '없음'}
`
  console.error(errorMessage)
  throw new Error('DATABASE_URL 환경 변수가 설정되지 않았습니다.')
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
