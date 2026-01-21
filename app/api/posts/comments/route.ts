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
    const { postId, content } = body

    if (!postId || !content?.trim()) {
      return NextResponse.json({ error: '필수 필드를 입력해주세요' }, { status: 400 })
    }

    // 포스트 존재 및 그룹 멤버 확인
    const post = await db.post.findUnique({
      where: { id: postId },
      include: {
        group: {
          include: {
            members: {
              where: {
                userId: session.user.id,
                status: 'ACTIVE',
              },
            },
          },
        },
      },
    })

    if (!post || post.isDeleted) {
      return NextResponse.json({ error: '게시물을 찾을 수 없습니다' }, { status: 404 })
    }

    if (post.group.members.length === 0) {
      return NextResponse.json({ error: '그룹 멤버가 아닙니다' }, { status: 403 })
    }

    // 댓글 생성
    const comment = await db.comment.create({
      data: {
        postId,
        authorId: session.user.id,
        content: content.trim(),
      },
    })

    // 댓글 수 업데이트
    await db.post.update({
      where: { id: postId },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true, id: comment.id })
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json({ error: '댓글 작성 중 오류가 발생했습니다' }, { status: 500 })
  }
}
