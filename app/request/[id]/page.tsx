import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ShareLink from './ShareLink'
import ResponseList from './ResponseList'
import InviteForm from './InviteForm'
import AnalyzeButton from './AnalyzeButton'

export default async function RequestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: request, error } = await supabase
    .from('feedback_requests')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !request) {
    notFound()
  }

  const { data: responses } = await supabase
    .from('feedback_responses')
    .select('*')
    .eq('request_id', id)
    .order('created_at', { ascending: false })

  const { data: report } = await supabase
    .from('reports')
    .select('*')
    .eq('request_id', id)
    .single()

  const { data: invitations } = await supabase
    .from('invitations')
    .select('*')
    .eq('request_id', id)
    .order('sent_at', { ascending: false })

  const feedbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/feedback/${request.share_token}`

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
              <h1 className="text-xl font-semibold text-gray-900">
                {request.title}
              </h1>
              <p className="text-sm text-gray-500">
                Created{' '}
                {new Date(request.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {request.context && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Context
                </h2>
                <p className="mt-2 text-gray-700">{request.context}</p>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Responses ({responses?.length || 0})
                </h2>
                {request.status === 'completed' && report && (
                  <Link
                    href={`/request/${id}/report`}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    View Report →
                  </Link>
                )}
              </div>

              {responses && responses.length > 0 ? (
                <ResponseList responses={responses} />
              ) : (
                <p className="text-gray-500">
                  No responses yet. Share your link to start collecting
                  feedback.
                </p>
              )}
            </div>

            {responses && responses.length >= 3 && request.status === 'open' && (
              <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
                <h2 className="text-lg font-semibold text-purple-900">
                  Ready to Generate Your Report?
                </h2>
                <p className="text-purple-700 mt-2">
                  You have {responses.length} responses. Generate your Best
                  Reflected Self report to discover patterns and insights.
                </p>
                <AnalyzeButton requestId={id} />
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
                      Analyzing Your Feedback
                    </h2>
                    <p className="text-yellow-700">
                      Please wait while we generate your report...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {request.status === 'completed' && report && (
              <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-green-900">
                      Your Report is Ready!
                    </h2>
                    <p className="text-green-700 mt-1">
                      View your comprehensive Best Reflected Self analysis.
                    </p>
                  </div>
                  <Link
                    href={`/request/${id}/report`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    View Report
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Share Your Link
              </h2>
              <ShareLink url={feedbackUrl} />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Send Invitations
              </h2>
              <InviteForm requestId={id} />
              {invitations && invitations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Sent Invitations
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
                            Responded
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
