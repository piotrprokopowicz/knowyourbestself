'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

export default function InviteForm({ requestId }: { requestId: string }) {
  const [emails, setEmails] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const { t, language } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Parse emails (split by comma, semicolon, or newline)
    const emailList = emails
      .split(/[,;\n]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0)

    if (emailList.length === 0) {
      setMessage({ type: 'error', text: 'Please enter at least one email' })
      setLoading(false)
      return
    }

    let successCount = 0
    let failCount = 0

    for (const email of emailList) {
      try {
        const response = await fetch('/api/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId, email, language }),
        })

        if (response.ok) {
          successCount++
        } else {
          failCount++
        }
      } catch {
        failCount++
      }
    }

    if (failCount === 0) {
      setMessage({
        type: 'success',
        text: `${successCount} ${t('invitationsSent')}`,
      })
      setEmails('')
    } else if (successCount === 0) {
      setMessage({ type: 'error', text: 'Failed to send invitations' })
    } else {
      setMessage({
        type: 'success',
        text: `${successCount} sent, ${failCount} failed`,
      })
      setEmails('')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        required
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        placeholder={t('enterEmails')}
        rows={3}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {loading ? t('sending') : t('sendInvitationsBtn')}
      </button>
      {message && (
        <p
          className={`mt-2 text-xs ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </p>
      )}
      <p className="mt-2 text-xs text-gray-500">
        {t('multipleEmailsHint')}
      </p>
    </form>
  )
}
