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
    const { postId } = body

    if (!postId) {
      return NextResponse.json({ error: '필수 필드를 입력해주세요' }, { status: 400 })
    }

    // 포스트 존재 확인
    const post = await db.communityPost.findUnique({
      where: { id: postId },
    })

    if (!post || post.isDeleted) {
      return NextResponse.json({ error: '게시물을 찾을 수 없습니다' }, { status: 404 })
    }

    // 이미 좋아요 했는지 확인
    const existingLike = await db.communityPostLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json({ error: '이미 좋아요를 눌렀습니다' }, { status: 400 })
    }

    // 좋아요 생성
    await db.communityPostLike.create({
      data: {
        postId,
        userId: session.user.id,
      },
    })

    // 좋아요 수 업데이트
    await db.communityPost.update({
      where: { id: postId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Like creation error:', error)
    return NextResponse.json({ error: '좋아요 처리 중 오류가 발생했습니다' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const body = await request.json()
    const { postId } = body

    if (!postId) {
      return NextResponse.json({ error: '필수 필드를 입력해주세요' }, { status: 400 })
    }

    // 좋아요 삭제
    await db.communityPostLike.deleteMany({
      where: {
        postId,
        userId: session.user.id,
      },
    })

    // 좋아요 수 업데이트
    await db.communityPost.update({
      where: { id: postId },
      data: {
        likeCount: {
          decrement: 1,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Like deletion error:', error)
    return NextResponse.json({ error: '좋아요 취소 중 오류가 발생했습니다' }, { status: 500 })
  }
}
