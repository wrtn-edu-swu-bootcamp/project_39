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
    const { content, imageUrl } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: '내용을 입력해주세요' }, { status: 400 })
    }

    // 오늘 이미 작성했는지 확인
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayPost = await db.communityPost.findFirst({
      where: {
        authorId: session.user.id,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        isDeleted: false,
      },
    })

    if (todayPost) {
      return NextResponse.json({ error: '하루에 1개의 게시글만 작성할 수 있습니다' }, { status: 400 })
    }

    const post = await db.communityPost.create({
      data: {
        authorId: session.user.id,
        content: content.trim(),
        imageUrl: imageUrl || null,
      },
    })

    return NextResponse.json({ success: true, id: post.id })
  } catch (error) {
    console.error('Community post creation error:', error)
    return NextResponse.json({ error: '게시글 작성 중 오류가 발생했습니다' }, { status: 500 })
  }
}
