import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const groups = await db.group.findMany({
      where: { isActive: true },
      include: {
        creator: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
          },
        },
        members: {
          where: { status: 'ACTIVE' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: groups })
  } catch (error) {
    console.error('Groups fetch error:', error)
    return NextResponse.json({ success: false, error: '그룹 목록을 불러오는데 실패했습니다' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, topic, durationWeeks, maxMembers, approvalMode } = body

    if (!name || !description || !topic) {
      return NextResponse.json({ error: '필수 필드를 입력해주세요' }, { status: 400 })
    }

    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + durationWeeks * 7)

    const group = await db.group.create({
      data: {
        name,
        description,
        topic,
        durationWeeks,
        maxMembers,
        approvalMode,
        creatorId: session.user.id,
        startDate,
        endDate,
      },
    })

    // 그룹 생성자를 자동으로 멤버로 추가
    await db.groupMember.create({
      data: {
        groupId: group.id,
        userId: session.user.id,
        status: 'ACTIVE',
      },
    })

    return NextResponse.json({ success: true, id: group.id })
  } catch (error) {
    console.error('Group creation error:', error)
    return NextResponse.json({ error: '그룹 생성 중 오류가 발생했습니다' }, { status: 500 })
  }
}
