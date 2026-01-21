import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import GroupCreateForm from '@/components/features/groups/GroupCreateForm'

export default async function CreateGroupPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">그룹 만들기</h1>
      <GroupCreateForm />
    </div>
  )
}
