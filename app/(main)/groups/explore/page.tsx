import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'
import GroupCard from '@/components/features/groups/GroupCard'

export default async function GroupsExplorePage() {
  const session = await getServerSession(authOptions)

  // 참여중인 그룹 ID 목록 가져오기
  let joinedGroupIds: string[] = []
  if (session) {
    const groupMemberships = await db.groupMember.findMany({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
      select: {
        groupId: true,
      },
    })
    joinedGroupIds = groupMemberships.map((m) => m.groupId)
  }

  // 참여하지 않은 그룹만 가져오기
  const groups = await db.group.findMany({
    where: {
      isActive: true,
      ...(session && joinedGroupIds.length > 0
        ? {
            id: {
              notIn: joinedGroupIds,
            },
          }
        : {}),
    },
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
    take: 50,
  })

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/groups">
            <Button variant="text" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              뒤로
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">그룹 탐색</h1>
        </div>
        {session && (
          <Link href="/groups/create">
            <Button variant="primary" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              그룹 만들기
            </Button>
          </Link>
        )}
        {!session && (
          <Link href="/login">
            <Button variant="primary" size="sm">
              로그인하기
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>

      {groups.length === 0 && (
        <div className="py-12 text-center text-text-secondary">
          <p>참여 가능한 그룹이 없습니다.</p>
          <p className="mt-2">새로운 그룹을 만들어보세요!</p>
          {session && (
            <div className="mt-4">
              <Link href="/groups/create">
                <Button variant="primary" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  그룹 만들기
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
