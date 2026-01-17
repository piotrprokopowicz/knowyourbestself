'use client'

import Link from 'next/link'
import { FeedbackRequest } from '@/lib/supabase'

interface RequestCardProps {
  request: FeedbackRequest & { response_count: number }
}

export default function RequestCard({ request }: RequestCardProps) {
  const statusColors = {
    open: 'bg-green-100 text-green-700',
    analyzing: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-purple-100 text-purple-700',
  }

  const statusLabels = {
    open: 'Collecting Feedback',
    analyzing: 'Analyzing...',
    completed: 'Report Ready',
  }

  return (
    <Link href={`/request/${request.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {request.title}
            </h3>
            {request.context && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {request.context}
              </p>
            )}
          </div>
          <span
            className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[request.status]
            }`}
          >
            {statusLabels[request.status]}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
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
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
            <span>{request.response_count} responses</span>
          </div>
          <div className="flex items-center gap-1">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {new Date(request.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
