'use client'

import { useState } from 'react'

export default function ShareLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={url}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 bg-gray-50"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Share this link with people you want feedback from. They don&apos;t need
        an account to respond.
      </p>
    </div>
  )
}
