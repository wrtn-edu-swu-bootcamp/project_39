import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password, nickname } = await request.json()

    if (!email || !password || !nickname) {
      return NextResponse.json({ error: '모든 필드를 입력해주세요' }, { status: 400 })
    }

    // 아이디 형식 검증 (영어, 숫자만 허용)
    const usernameRegex = /^[a-zA-Z0-9]+$/
    if (!usernameRegex.test(email)) {
      return NextResponse.json({ error: '아이디는 영어와 숫자만 사용할 수 있습니다' }, { status: 400 })
    }

    if (email.length < 3 || email.length > 20) {
      return NextResponse.json({ error: '아이디는 3자 이상 20자 이하여야 합니다' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: '비밀번호는 최소 6자 이상이어야 합니다' }, { status: 400 })
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: '이미 존재하는 아이디입니다' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // 트림 처리 (공백 제거)
    const trimmedEmail = email.trim()
    const trimmedNickname = nickname.trim()

    if (!trimmedEmail || !trimmedNickname) {
      return NextResponse.json({ error: '아이디와 닉네임은 공백만으로 구성될 수 없습니다' }, { status: 400 })
    }

    const user = await db.user.create({
      data: {
        email: trimmedEmail,
        password: hashedPassword,
        nickname: trimmedNickname,
      },
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error('Signup error:', error)
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
    const errorCode = (error as { code?: string })?.code
    const errorMeta = (error as { meta?: unknown })?.meta
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('Error details:', {
      message: errorMessage,
      code: errorCode,
      meta: errorMeta,
      stack: errorStack,
    })
    
    // Prisma 에러 처리
    if (errorCode === 'P2002') {
      return NextResponse.json({ error: '이미 존재하는 아이디입니다' }, { status: 400 })
    }
    
    if (errorCode === 'P2003') {
      return NextResponse.json({ error: '데이터베이스 제약 조건 오류가 발생했습니다' }, { status: 400 })
    }
    
    // 데이터베이스 연결 오류 처리
    if (errorMessage.includes('Can\'t reach database server') || 
        errorMessage.includes('Connection') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorCode === 'P1001') {
      console.error('Database connection failed:', errorMessage)
      return NextResponse.json({ 
        error: '데이터베이스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }, { status: 503 })
    }
    
    if (errorMessage.includes('permission denied') || errorCode === 'P2003') {
      return NextResponse.json({ 
        error: '데이터베이스 권한 오류가 발생했습니다. 관리자에게 문의하세요.' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      error: errorMessage || '회원가입 중 오류가 발생했습니다',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}
