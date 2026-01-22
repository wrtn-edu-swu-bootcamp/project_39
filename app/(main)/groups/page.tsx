import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import GroupCard from '@/components/features/groups/GroupCard'
import { Card, CardContent } from '@/components/ui/card'
import { Prisma } from '@prisma/client'

type GroupWithRelations = Prisma.GroupGetPayload<{
  include: {
    creator: {
      select: {
        id: true
        nickname: true
        profileImageUrl: true
      }
    }
    members: {
      where: { status: 'ACTIVE' }
    }
  }
}>

export default async function GroupsPage() {
  const session = await getServerSession(authOptions)

  // 참여중인 그룹만 가져오기
  let myGroups: GroupWithRelations[] = []
  if (session) {
    const groupMemberships = await db.groupMember.findMany({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
      include: {
        group: {
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
        },
      },
      orderBy: { joinedAt: 'desc' },
    })

    myGroups = groupMemberships.map((membership) => membership.group)
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-text-primary">그룹</h1>
        {session && (
          <div className="flex gap-2">
            <Link href="/groups/explore">
              <Button variant="secondary" size="sm">
                <Search className="mr-2 h-4 w-4" />
                그룹 탐색
              </Button>
            </Link>
            <Link href="/groups/create">
              <Button variant="primary" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                그룹 만들기
              </Button>
            </Link>
          </div>
        )}
        {!session && (
          <Link href="/login">
            <Button variant="primary" size="sm">
              로그인하기
            </Button>
          </Link>
        )}
      </div>

      {session ? (
        <>
          {myGroups.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-text-secondary">아직 참여중인 그룹이 없습니다.</p>
                <div className="mt-4 flex justify-center gap-2">
                  <Link href="/groups/explore">
                    <Button variant="secondary" size="sm">
                      <Search className="mr-2 h-4 w-4" />
                      그룹 탐색
                    </Button>
                  </Link>
                  <Link href="/groups/create">
                    <Button variant="primary" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      그룹 만들기
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-text-secondary">로그인하여 그룹에 참여하세요.</p>
            <div className="mt-4">
              <Link href="/login">
                <Button variant="primary" size="sm">
                  로그인하기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
