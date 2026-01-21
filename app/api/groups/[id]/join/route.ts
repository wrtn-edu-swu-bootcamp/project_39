import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const groupId = params.id
    const userId = session.user.id

    // 사용자가 이미 참여 중인 활성 그룹 수 확인 (최대 3개 제한)
    const activeGroupCount = await db.groupMember.count({
      where: {
        userId,
        status: 'ACTIVE',
        group: {
          isActive: true,
          endDate: {
            gte: new Date(), // 아직 종료되지 않은 그룹
          },
        },
      },
    })

    if (activeGroupCount >= 3) {
      return NextResponse.json({ error: '최대 3개의 그룹에만 참여할 수 있습니다' }, { status: 400 })
    }

    const group = await db.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          where: { status: 'ACTIVE' },
        },
      },
    })

    if (!group) {
      return NextResponse.json({ error: '그룹을 찾을 수 없습니다' }, { status: 404 })
    }

    if (group.members.length >= group.maxMembers) {
      return NextResponse.json({ error: '그룹이 가득 찼습니다' }, { status: 400 })
    }

    const existingMember = await db.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json({ error: '이미 참여 중인 그룹입니다' }, { status: 400 })
    }

    const status = group.approvalMode === 'AUTO' ? 'ACTIVE' : 'PENDING'

    await db.groupMember.create({
      data: {
        groupId,
        userId,
        status,
      },
    })

    return NextResponse.json({ success: true, status })
  } catch (error) {
    console.error('Group join error:', error)
    return NextResponse.json({ error: '그룹 참여 중 오류가 발생했습니다' }, { status: 500 })
  }
}
