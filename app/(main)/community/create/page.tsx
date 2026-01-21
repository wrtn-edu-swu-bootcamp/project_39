import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import CommunityPostForm from '@/components/features/community/CommunityPostForm'

export default async function CreateCommunityPostPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">게시글 작성</h1>
      <CommunityPostForm />
    </div>
  )
}
