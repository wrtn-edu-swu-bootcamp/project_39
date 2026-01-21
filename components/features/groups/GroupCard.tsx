import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

interface GroupCardProps {
  group: {
    id: string
    name: string
    description: string
    topic: string
    imageUrl: string | null
    startDate: Date
    endDate: Date
    maxMembers: number
    members: { id: string }[]
    creator: {
      nickname: string
      profileImageUrl: string | null
    }
  }
}

export default function GroupCard({ group }: GroupCardProps) {
  const memberCount = group.members.length
  const isFull = memberCount >= group.maxMembers

  return (
    <Link href={`/groups/${group.id}/posts`}>
      <Card className="transition-shadow hover:shadow-md">
        {group.imageUrl && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={group.imageUrl}
              alt={group.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader>
          <h3 className="text-lg font-semibold">{group.name}</h3>
          <p className="text-sm text-text-secondary">{group.topic}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="text-text-tertiary">
              기간: {formatDate(group.startDate)} ~ {formatDate(group.endDate)}
            </p>
            <p className="text-text-tertiary">
              인원: {memberCount}/{group.maxMembers}명
            </p>
            {isFull && (
              <p className="text-warning font-medium">모집 완료</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
