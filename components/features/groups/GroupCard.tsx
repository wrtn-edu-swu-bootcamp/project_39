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
    <Link href={`/groups/${group.id}/posts`} className="block h-full">
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        {group.imageUrl && (
          <div className="relative h-56 w-full overflow-hidden rounded-t-xl">
            <Image
              src={group.imageUrl}
              alt={group.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader>
          <h3 className="text-xl font-semibold text-text-primary group-hover:text-primary transition-colors">
            {group.name}
          </h3>
          <p className="text-sm text-text-secondary mt-1">{group.topic}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
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
