'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
          <h2 className="text-2xl font-bold text-gray-900">Thank You!</h2>
          <p className="text-gray-600 mt-2">
            Your feedback has been submitted successfully. It will help{' '}
            {requestTitle} understand their strengths and positive impact.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-purple-600 font-bold text-xl mb-2">BRF</div>
            <h1 className="text-2xl font-bold text-gray-900">
              Share Your Feedback
            </h1>
            <p className="text-gray-600 mt-2">
              for <span className="font-medium">{requestTitle}</span>
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
                  Your Name (optional)
                </label>
                <input
                  id="respondentName"
                  name="respondentName"
                  type="text"
                  value={formData.respondentName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="relationship"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Relationship
                </label>
                <select
                  id="relationship"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="">Select...</option>
                  <option value="colleague">Colleague</option>
                  <option value="manager">Manager</option>
                  <option value="direct report">Direct Report</option>
                  <option value="friend">Friend</option>
                  <option value="family">Family</option>
                  <option value="mentor">Mentor</option>
                  <option value="mentee">Mentee</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="strengths"
                className="block text-sm font-medium text-gray-700"
              >
                Key Strengths *
              </label>
              <p className="text-sm text-gray-500 mt-1">
                What are this person&apos;s greatest strengths? What do they do
                exceptionally well?
              </p>
              <textarea
                id="strengths"
                name="strengths"
                required
                value={formData.strengths}
                onChange={handleChange}
                rows={4}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="Describe their key strengths..."
              />
            </div>

            <div>
              <label
                htmlFor="positiveMoments"
                className="block text-sm font-medium text-gray-700"
              >
                Memorable Positive Moments
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Describe a specific time when you saw this person at their best.
                What happened? What made it memorable?
              </p>
              <textarea
                id="positiveMoments"
                name="positiveMoments"
                value={formData.positiveMoments}
                onChange={handleChange}
                rows={4}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="Share a specific story or moment..."
              />
            </div>

            <div>
              <label
                htmlFor="qualities"
                className="block text-sm font-medium text-gray-700"
              >
                Positive Qualities
              </label>
              <p className="text-sm text-gray-500 mt-1">
                What qualities or characteristics make this person special? How
                do they make others feel?
              </p>
              <textarea
                id="qualities"
                name="qualities"
                value={formData.qualities}
                onChange={handleChange}
                rows={3}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="Describe their positive qualities..."
              />
            </div>

            <div>
              <label
                htmlFor="additionalComments"
                className="block text-sm font-medium text-gray-700"
              >
                Anything Else?
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Any other thoughts you&apos;d like to share about this
                person&apos;s positive impact?
              </p>
              <textarea
                id="additionalComments"
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleChange}
                rows={3}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="Any additional comments..."
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
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            Your feedback is valuable and will be used to help this person
            understand their strengths. Thank you for taking the time.
          </p>
        </div>
      </div>
    </div>
  )
}
