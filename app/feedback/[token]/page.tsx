import { createServiceRoleClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import FeedbackForm from '@/components/FeedbackForm'

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = createServiceRoleClient()

  const { data: request, error } = await supabase
    .from('feedback_requests')
    .select('*')
    .eq('share_token', token)
    .single()

  if (error || !request) {
    notFound()
  }

  if (request.status !== 'open') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Feedback Collection Closed
          </h2>
          <p className="text-gray-600 mt-2">
            This feedback request is no longer accepting responses.
          </p>
        </div>
      </div>
    )
  }

  return (
    <FeedbackForm
      requestId={request.id}
      requestTitle={request.title}
      requestContext={request.context}
    />
  )
}
