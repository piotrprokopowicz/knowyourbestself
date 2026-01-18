'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'
import ReportView from '@/components/ReportView'

interface ReportPageClientProps {
  requestId: string
  requestTitle: string
  report: {
    content: string
    created_at: string
  }
}

export default function ReportPageClient({
  requestId,
  requestTitle,
  report,
}: ReportPageClientProps) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {t('bestReflectedSelfReport')}
                </h1>
                <p className="text-sm text-gray-500">{requestTitle}</p>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('bestReflectedSelfPortrait')}
                </h2>
                <p className="text-gray-500">
                  {t('comprehensiveAnalysis')}
                </p>
              </div>
            </div>
          </div>

          <ReportView
            content={report.content}
            title={requestTitle}
            createdAt={report.created_at}
          />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            {t('backToDashboard')}
          </Link>
        </div>
      </main>
    </div>
  )
}
