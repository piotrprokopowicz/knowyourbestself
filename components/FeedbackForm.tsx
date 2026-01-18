'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import LanguageToggle from './LanguageToggle'

interface FeedbackFormProps {
  requestId: string
  requestTitle: string
  requestContext?: string | null
}

export default function FeedbackForm({
  requestId,
  requestTitle,
  requestContext,
}: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    respondentName: '',
    relationship: '',
    strengths: '',
    positiveMoments: '',
    qualities: '',
    additionalComments: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { t } = useLanguage()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
        <div className="absolute top-4 right-4">
          <LanguageToggle variant="dark" />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{t('thankYou')}</h2>
          <p className="text-gray-600 mt-2">
            {t('feedbackSubmitted')} {requestTitle} {t('understandStrengths')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle variant="dark" />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-purple-600 font-bold text-xl mb-2">{t('appName')}</div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('shareFeedbackFor')}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('feedbackFor')} <span className="font-medium">{requestTitle}</span>
            </p>
            {requestContext && (
              <p className="text-gray-500 text-sm mt-2 bg-gray-50 p-3 rounded-lg">
                {requestContext}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="respondentName"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t('yourName')}
                </label>
                <input
                  id="respondentName"
                  name="respondentName"
                  type="text"
                  value={formData.respondentName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder={t('yourName')}
                />
              </div>
              <div>
                <label
                  htmlFor="relationship"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t('yourRelationship')}
                </label>
                <select
                  id="relationship"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="">{t('selectRelationship')}</option>
                  <option value="colleague">{t('colleague')}</option>
                  <option value="manager">{t('manager')}</option>
                  <option value="direct report">{t('directReport')}</option>
                  <option value="friend">{t('friend')}</option>
                  <option value="family">{t('family')}</option>
                  <option value="mentor">{t('mentor')}</option>
                  <option value="mentee">{t('mentee')}</option>
                  <option value="other">{t('other')}</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="strengths"
                className="block text-sm font-medium text-gray-700"
              >
                {t('keyStrengths')}
              </label>
              <p className="text-sm text-gray-500 mt-1">
                {t('keyStrengthsHint')}
              </p>
              <textarea
                id="strengths"
                name="strengths"
                required
                value={formData.strengths}
                onChange={handleChange}
                rows={4}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder={t('keyStrengthsPlaceholder')}
              />
            </div>

            <div>
              <label
                htmlFor="positiveMoments"
                className="block text-sm font-medium text-gray-700"
              >
                {t('memorableMoments')}
              </label>
              <p className="text-sm text-gray-500 mt-1">
                {t('memorableMomentsHint')}
              </p>
              <textarea
                id="positiveMoments"
                name="positiveMoments"
                value={formData.positiveMoments}
                onChange={handleChange}
                rows={4}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder={t('memorableMomentsPlaceholder')}
              />
            </div>

            <div>
              <label
                htmlFor="qualities"
                className="block text-sm font-medium text-gray-700"
              >
                {t('positiveQualities')}
              </label>
              <p className="text-sm text-gray-500 mt-1">
                {t('positiveQualitiesHint')}
              </p>
              <textarea
                id="qualities"
                name="qualities"
                value={formData.qualities}
                onChange={handleChange}
                rows={3}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder={t('positiveQualitiesPlaceholder')}
              />
            </div>

            <div>
              <label
                htmlFor="additionalComments"
                className="block text-sm font-medium text-gray-700"
              >
                {t('anythingElse')}
              </label>
              <p className="text-sm text-gray-500 mt-1">
                {t('anythingElseHint')}
              </p>
              <textarea
                id="additionalComments"
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleChange}
                rows={3}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder={t('anythingElsePlaceholder')}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? t('submitting') : t('submitFeedback')}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            {t('feedbackValueNote')}
          </p>
        </div>
      </div>
    </div>
  )
}
