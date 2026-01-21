'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function CommunityPostForm() {
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

    if (!content.trim()) {
      setError('내용을 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      let imageUrl: string | null = null

      if (image) {
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

        imageUrl = uploadData.url
      }

      // 게시글 생성
      const postResponse = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          imageUrl,
        }),
      })

      const postData = await postResponse.json()

      if (!postResponse.ok) {
        setError(postData.error || '게시글 작성에 실패했습니다.')
        return
      }

      router.push('/community')
      router.refresh()
    } catch (err) {
      setError('게시글 작성 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">내용 *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="취미나 함께할 사람을 공유해주세요"
                className="flex min-h-[150px] w-full rounded-md border border-border bg-background px-4 py-2 text-base"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">이미지 추가 (선택)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
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
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-error">{error}</p>}

      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? '작성 중...' : '게시글 올리기'}
      </Button>
    </form>
  )
}
