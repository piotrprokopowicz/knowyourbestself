'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'
import ShareLink from './ShareLink'
import ResponseList from './ResponseList'
import InviteForm from './InviteForm'
import AnalyzeButton from './AnalyzeButton'
import AddResponseForm from './AddResponseForm'

interface RequestPageClientProps {
  request: {
    id: string
    title: string
    context: string | null
    status: string
    created_at: string
  }
  responses: Array<{
    id: string
    request_id: string
    respondent_name: string | null
    relationship: string | null
    strengths: string
    positive_moments: string | null
    qualities: string | null
    additional_comments: string | null
    created_at: string
  }> | null
  report: {
    id: string
    content: string
    created_at: string
  } | null
  invitations: Array<{
    id: string
    email: string
    responded: boolean
  }> | null
  feedbackUrl: string
}

export default function RequestPageClient({
  request,
  responses,
  report,
  invitations,
  feedbackUrl,
}: RequestPageClientProps) {
  const { t, language } = useLanguage()

  // Calculate new responses since last report
  const newResponsesSinceReport = report && responses
    ? responses.filter(r => new Date(r.created_at) > new Date(report.created_at)).length
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
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
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {request.title}
                  </h1>
                  <Link
                    href={`/request/${request.id}/edit`}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title={t('edit')}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </Link>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(request.created_at).toLocaleDateString(
                    language === 'pl' ? 'pl-PL' : 'en-US',
                    {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    }
                  )}
                </p>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {request.context && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {t('context')}
                </h2>
                <p className="mt-2 text-gray-700">{request.context}</p>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('responses')} ({responses?.length || 0})
                </h2>
                {request.status === 'completed' && report && (
                  <Link
                    href={`/request/${request.id}/report`}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    {t('viewReport')} →
                  </Link>
                )}
              </div>

              {responses && responses.length > 0 ? (
                <ResponseList responses={responses} />
              ) : (
                <p className="text-gray-500">
                  {t('noResponsesYet')}
                </p>
              )}

              <AddResponseForm requestId={request.id} />
            </div>

            {responses && responses.length >= 3 && request.status === 'open' && (
              <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
                <h2 className="text-lg font-semibold text-purple-900">
                  {t('readyToGenerate')}
                </h2>
                <p className="text-purple-700 mt-2">
                  {responses.length} {t('readyToGenerateDesc')}
                </p>
                <AnalyzeButton requestId={request.id} />
              </div>
            )}

            {request.status === 'analyzing' && (
              <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-yellow-600 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <div>
                    <h2 className="text-lg font-semibold text-yellow-900">
                      {t('analyzingFeedback')}
                    </h2>
                    <p className="text-yellow-700">
                      {t('pleaseWait')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {request.status === 'completed' && report && (
              <>
                <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-green-900">
                        {t('reportIsReady')}
                      </h2>
                      <p className="text-green-700 mt-1">
                        {t('reportReadyDesc')}
                      </p>
                    </div>
                    <Link
                      href={`/request/${request.id}/report`}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      {t('viewReport')}
                    </Link>
                  </div>
                </div>

                {/* Regenerate option - always show for completed requests */}
                <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-6">
                  <h2 className="text-lg font-semibold text-indigo-900">
                    {newResponsesSinceReport > 0 ? t('newFeedbackAvailable') : t('regenerateReport')}
                  </h2>
                  <p className="text-indigo-700 mt-2">
                    {newResponsesSinceReport > 0
                      ? `${newResponsesSinceReport} ${t('newFeedbackDesc')}`
                      : t('reportReadyDesc')
                    }
                  </p>
                  <AnalyzeButton requestId={request.id} isRegenerate />
                </div>
              </>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('shareYourLink')}
              </h2>
              <ShareLink url={feedbackUrl} />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('sendInvitations')}
              </h2>
              <InviteForm requestId={request.id} />
              {invitations && invitations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {t('sentInvitations')}
                  </h3>
                  <ul className="space-y-2">
                    {invitations.map((inv) => (
                      <li
                        key={inv.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-600 truncate">
                          {inv.email}
                        </span>
                        {inv.responded && (
                          <span className="text-green-600 text-xs">
                            {t('responded')}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
