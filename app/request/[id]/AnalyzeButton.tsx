'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'

interface AnalyzeButtonProps {
  requestId: string
  isRegenerate?: boolean
}

export default function AnalyzeButton({ requestId, isRegenerate = false }: AnalyzeButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { t, language } = useLanguage()

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, language }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report')
      }

      router.push(`/request/${requestId}/report`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze')
      setLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className={`w-full text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isRegenerate
            ? 'bg-indigo-600 hover:bg-indigo-700'
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {loading
          ? (isRegenerate ? t('regeneratingReport') : t('generatingReport'))
          : (isRegenerate ? t('regenerateReport') : t('generateMyReport'))
        }
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
