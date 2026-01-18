import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import RequestCard from '@/components/RequestCard'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: requests } = await supabase
    .from('feedback_requests')
    .select(
      `
      *,
      feedback_responses(count)
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const requestsWithCount =
    requests?.map((r) => ({
      ...r,
      response_count:
        (r.feedback_responses as unknown as { count: number }[])?.[0]?.count ??
        0,
    })) ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-xl font-bold text-purple-600">
              Know Your Best Self
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{user.email}</span>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Your Feedback Requests
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your feedback requests and view responses
            </p>
          </div>
          <Link
            href="/dashboard/new"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            New Request
          </Link>
        </div>

        {requestsWithCount.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No feedback requests yet
            </h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              Create your first feedback request to start collecting insights
              from people who know you best.
            </p>
            <Link
              href="/dashboard/new"
              className="inline-block mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Create Your First Request
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {requestsWithCount.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 py-6 text-center">
        <Link href="/feedback-app" className="text-gray-500 hover:text-purple-600 text-sm">
          Share Feedback About This App
        </Link>
      </footer>
    </div>
  )
}
