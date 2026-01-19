'use client'

import { FeedbackResponse } from '@/lib/supabase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'

export default function ResponseList({
  responses,
}: {
  responses: FeedbackResponse[]
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()
  const { t, language } = useLanguage()

  const handleDelete = async (responseId: string) => {
    if (!confirm(t('confirmDeleteResponse'))) {
      return
    }

    setDeletingId(responseId)
    try {
      const response = await fetch(`/api/response/${responseId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting response:', error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {responses.map((response) => (
        <div
          key={response.id}
          className="border border-gray-200 rounded-lg p-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-gray-900">
                {response.respondent_name || 'Anonymous'}
              </p>
              {response.relationship && (
                <p className="text-sm text-gray-500">{response.relationship}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setExpandedId(expandedId === response.id ? null : response.id)
                }
                className="text-purple-600 text-sm hover:text-purple-700"
              >
                {expandedId === response.id ? (language === 'pl' ? 'Zwiń' : 'Collapse') : (language === 'pl' ? 'Rozwiń' : 'Expand')}
              </button>
              <button
                onClick={() => handleDelete(response.id)}
                disabled={deletingId === response.id}
                className="text-red-500 text-sm hover:text-red-700 disabled:opacity-50"
              >
                {deletingId === response.id ? '...' : t('deleteResponse')}
              </button>
            </div>
          </div>

          {expandedId === response.id && (
            <div className="mt-4 space-y-4 pt-4 border-t border-gray-100">
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  {t('keyStrengths')}
                </h4>
                <p className="text-gray-600 mt-1">{response.strengths}</p>
              </div>

              {response.positive_moments && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {t('memorableMoments')}
                  </h4>
                  <p className="text-gray-600 mt-1">
                    {response.positive_moments}
                  </p>
                </div>
              )}

              {response.qualities && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {t('positiveQualities')}
                  </h4>
                  <p className="text-gray-600 mt-1">{response.qualities}</p>
                </div>
              )}

              {response.additional_comments && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    {t('anythingElse')}
                  </h4>
                  <p className="text-gray-600 mt-1">
                    {response.additional_comments}
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-400">
                {language === 'pl' ? 'Przesłano' : 'Submitted'}{' '}
                {new Date(response.created_at).toLocaleDateString(
                  language === 'pl' ? 'pl-PL' : 'en-US',
                  {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }
                )}
              </p>
            </div>
          )}

          {expandedId !== response.id && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {response.strengths}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
