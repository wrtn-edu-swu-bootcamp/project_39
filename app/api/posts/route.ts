import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const body = await request.json()
    const { groupId, content, imageUrl } = body

    if (!groupId || !imageUrl) {
      return NextResponse.json({ error: '필수 필드를 입력해주세요' }, { status: 400 })
    }

    // 그룹 멤버 확인
    const groupMember = await db.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: session.user.id,
        },
      },
    })

    if (!groupMember || groupMember.status !== 'ACTIVE') {
      return NextResponse.json({ error: '그룹 멤버가 아닙니다' }, { status: 403 })
    }

    // 오늘 이미 인증했는지 확인
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayPost = await db.post.findFirst({
      where: {
        groupId,
        authorId: session.user.id,
        postedAt: {
          gte: today,
          lt: tomorrow,
        },
        isDeleted: false,
      },
    })

    if (todayPost) {
      return NextResponse.json({ error: '오늘은 이미 인증을 완료했습니다' }, { status: 400 })
    }

    // 게시물 생성
    const post = await db.post.create({
      data: {
        groupId,
        authorId: session.user.id,
        content: content || null,
        images: {
          create: {
            imageUrl,
            order: 0,
          },
        },
      },
    })

    // 출석 기록
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)

    await db.attendance.upsert({
      where: {
        groupMemberId_date: {
          groupMemberId: groupMember.id,
          date: todayDate,
        },
      },
      create: {
        groupMemberId: groupMember.id,
        date: todayDate,
        isPresent: true,
      },
      update: {
        isPresent: true,
      },
    })

    // 출석 횟수 업데이트
    await db.groupMember.update({
      where: { id: groupMember.id },
      data: {
        attendanceCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true, id: post.id })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json({ error: '게시물 작성 중 오류가 발생했습니다' }, { status: 500 })
  }
}
