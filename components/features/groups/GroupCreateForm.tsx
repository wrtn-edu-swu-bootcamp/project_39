'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { DURATION_OPTIONS, MAX_MEMBERS_OPTIONS } from '@/lib/constants'

export default function GroupCreateForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    topic: '',
    durationWeeks: 3,
    maxMembers: 10,
    approvalMode: 'AUTO' as 'AUTO' | 'MANUAL',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '그룹 생성 중 오류가 발생했습니다.')
        return
      }

      router.push(`/groups/${data.id}`)
      router.refresh()
    } catch (err) {
      setError('그룹 생성 중 오류가 발생했습니다.')
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
              <label className="mb-2 block text-sm font-medium">그룹명 *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="그룹명을 입력하세요"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">주제/설명 *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="그룹 주제와 설명을 입력하세요"
                className="flex min-h-[100px] w-full rounded-md border border-border bg-background px-4 py-2 text-base"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">주제 태그</label>
              <Input
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="예: 운동, 독서, 공부"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">그룹 기간 *</label>
              <select
                value={formData.durationWeeks}
                onChange={(e) =>
                  setFormData({ ...formData, durationWeeks: parseInt(e.target.value) })
                }
                className="flex h-12 w-full rounded-md border border-border bg-background px-4 py-2"
              >
                {DURATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">최대 인원수 *</label>
              <select
                value={formData.maxMembers}
                onChange={(e) =>
                  setFormData({ ...formData, maxMembers: parseInt(e.target.value) })
                }
                className="flex h-12 w-full rounded-md border border-border bg-background px-4 py-2"
              >
                {MAX_MEMBERS_OPTIONS.map((num) => (
                  <option key={num} value={num}>
                    {num}명
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">참여 승인 방식 *</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="AUTO"
                    checked={formData.approvalMode === 'AUTO'}
                    onChange={(e) =>
                      setFormData({ ...formData, approvalMode: e.target.value as 'AUTO' })
                    }
                    className="mr-2"
                  />
                  자동 승인
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="MANUAL"
                    checked={formData.approvalMode === 'MANUAL'}
                    onChange={(e) =>
                      setFormData({ ...formData, approvalMode: e.target.value as 'MANUAL' })
                    }
                    className="mr-2"
                  />
                  수동 승인
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-error">{error}</p>}

      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? '생성 중...' : '그룹 만들기'}
      </Button>
    </form>
  )
}
