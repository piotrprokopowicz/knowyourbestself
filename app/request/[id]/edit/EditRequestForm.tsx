'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'

interface EditRequestFormProps {
  requestId: string
  initialData: {
    title: string
    context: string
    emailTemplate: string
    challenges: string
  }
}

export default function EditRequestForm({ requestId, initialData }: EditRequestFormProps) {
  const [name, setName] = useState(initialData.title)
  const [context, setContext] = useState(initialData.context)
  const [emailTemplate, setEmailTemplate] = useState(initialData.emailTemplate)
  const [challenges, setChallenges] = useState(initialData.challenges)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/request/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: name,
          context: context || null,
          email_template: emailTemplate || null,
          challenges: challenges || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update request')
      }

      router.push(`/request/${requestId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/request/${requestId}`}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                {t('editFeedbackRequest')}
              </h1>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('editFeedbackRequest')}
            </h2>
            <p className="text-gray-600 mt-1">
              {t('editRequestDesc')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                {t('yourNameLabel')}
              </label>
              <p className="text-sm text-gray-500 mt-1">
                {t('yourNameHint')}
              </p>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder={t('yourNamePlaceholder')}
              />
            </div>

            <div>
              <label
                htmlFor="context"
                className="block text-sm font-medium text-gray-700"
              >
                {t('context')}
              </label>
              <p className="text-sm text-gray-500 mt-1">
                {t('contextHint')}
              </p>
              <textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder={t('contextPlaceholder')}
              />
            </div>

            <div>
              <label
                htmlFor="emailTemplate"
                className="block text-sm font-medium text-gray-700"
              >
                {t('emailTemplate')}
              </label>
              <p className="text-sm text-gray-500 mt-1">
                {t('emailTemplateHint')}
              </p>
              <textarea
                id="emailTemplate"
                value={emailTemplate}
                onChange={(e) => setEmailTemplate(e.target.value)}
                rows={8}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="challenges"
                className="block text-sm font-medium text-gray-700"
              >
                {t('challenges')}
              </label>
              <p className="text-sm text-gray-500 mt-1">
                {t('challengesHint')}
              </p>
              <textarea
                id="challenges"
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                rows={3}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder={t('challengesPlaceholder')}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Link
                href={`/request/${requestId}`}
                className="flex-1 text-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                {t('cancel')}
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? t('saving') : t('saveChanges')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
