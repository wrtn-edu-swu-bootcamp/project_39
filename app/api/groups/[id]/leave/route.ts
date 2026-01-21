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

    const group = await db.group.findUnique({
      where: { id: groupId },
    })

    if (!group) {
      return NextResponse.json({ error: '그룹을 찾을 수 없습니다' }, { status: 404 })
    }

    // 그룹장은 탈퇴할 수 없음
    if (group.creatorId === userId) {
      return NextResponse.json({ error: '그룹장은 그룹을 탈퇴할 수 없습니다' }, { status: 400 })
    }

    const groupMember = await db.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    })

    if (!groupMember || groupMember.status !== 'ACTIVE') {
      return NextResponse.json({ error: '참여 중인 그룹이 아닙니다' }, { status: 400 })
    }

    // 그룹이 아직 진행 중이면 탈퇴 불가 (활동기간 채워야 함)
    const now = new Date()
    if (group.startDate <= now && group.endDate >= now) {
      return NextResponse.json({ 
        error: '그룹 활동 기간 중에는 탈퇴할 수 없습니다. 활동 기간이 끝난 후 탈퇴할 수 있습니다.' 
      }, { status: 400 })
    }

    // 그룹 탈퇴 처리
    await db.groupMember.update({
      where: { id: groupMember.id },
      data: {
        status: 'LEFT',
        leftAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Group leave error:', error)
    return NextResponse.json({ error: '그룹 탈퇴 중 오류가 발생했습니다' }, { status: 500 })
  }
}
