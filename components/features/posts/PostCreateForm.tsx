'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface PostCreateFormProps {
  groupId: string
  hasPostedToday: boolean
}

export default function PostCreateForm({ groupId, hasPostedToday }: PostCreateFormProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('이미지 크기는 10MB 이하여야 합니다.')
        return
      }
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (hasPostedToday) {
      setError('오늘은 이미 인증을 완료했습니다.')
      return
    }

    if (!image) {
      setError('사진을 업로드해주세요.')
      return
    }

    setLoading(true)

    try {
      // 이미지 업로드
      const formData = new FormData()
      formData.append('file', image)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadResponse.json()

      if (!uploadResponse.ok) {
        setError(uploadData.error || '이미지 업로드에 실패했습니다.')
        return
      }

      // 게시물 생성
      const postResponse = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId,
          content: content || null,
          imageUrl: uploadData.url,
        }),
      })

      const postData = await postResponse.json()

      if (!postResponse.ok) {
        setError(postData.error || '게시물 작성에 실패했습니다.')
        return
      }

      router.push(`/groups/${groupId}/posts`)
      router.refresh()
    } catch (err) {
      setError('게시물 작성 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (hasPostedToday) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-text-secondary">
            오늘은 이미 인증을 완료했습니다. 내일 다시 시도해주세요.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">사진 추가 *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
                required
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    className="h-48 w-full rounded-lg object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">인증 내용 (선택)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="오늘의 루틴 인증 내용을 작성해주세요"
                className="flex min-h-[100px] w-full rounded-md border border-border bg-background px-4 py-2 text-base"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-error">{error}</p>}

      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? '업로드 중...' : '인증 올리기'}
      </Button>
    </form>
  )
}
