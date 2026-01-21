// 데이터베이스 스키마 수정 스크립트
// Node.js로 직접 실행하여 데이터베이스 컬럼 제거

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixDatabase() {
  try {
    console.log('데이터베이스 스키마 수정 시작...')

    // total_points 컬럼 제거
    await prisma.$executeRawUnsafe(`
      ALTER TABLE users DROP COLUMN IF EXISTS total_points;
    `)
    console.log('✓ total_points 컬럼 제거 완료')

    // exp 컬럼 제거
    await prisma.$executeRawUnsafe(`
      ALTER TABLE users DROP COLUMN IF EXISTS exp;
    `)
    console.log('✓ exp 컬럼 제거 완료')

    // user_points 테이블 제거
    await prisma.$executeRawUnsafe(`
      DROP TABLE IF EXISTS user_points;
    `)
    console.log('✓ user_points 테이블 제거 완료')

    console.log('데이터베이스 스키마 수정 완료!')
  } catch (error) {
    console.error('오류 발생:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

fixDatabase()
  .then(() => {
    console.log('성공적으로 완료되었습니다.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('실행 중 오류:', error)
    process.exit(1)
  })
