'use client'

import React, { useState } from 'react'

interface ReportViewProps {
  content: string
  title: string
  createdAt: string
}

export default function ReportView({
  content,
  title,
  createdAt,
}: ReportViewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple markdown rendering
  const renderMarkdown = (text: string) => {
    // Split by double newlines for paragraphs
    const lines = text.split('\n')
    const elements: React.ReactElement[] = []
    let currentList: string[] = []
    let listType: 'ul' | 'ol' | null = null
    let listCount = 0

    const flushList = () => {
      if (currentList.length > 0 && listType) {
        const ListTag = listType
        const currentListCount = listCount++
        elements.push(
          <ListTag
            key={`list-${currentListCount}`}
            className={`${
              listType === 'ul' ? 'list-disc' : 'list-decimal'
            } pl-6 space-y-2 my-4`}
          >
            {currentList.map((item, i) => (
              <li key={i} className="text-gray-700">
                {item}
              </li>
            ))}
          </ListTag>
        )
        currentList = []
        listType = null
      }
    }

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('## ')) {
        flushList()
        elements.push(
          <h2
            key={`h2-${index}`}
            className="text-2xl font-bold text-gray-900 mt-8 mb-4 first:mt-0"
          >
            {line.slice(3)}
          </h2>
        )
      } else if (line.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={`h3-${index}`} className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            {line.slice(4)}
          </h3>
        )
      } else if (line.startsWith('#### ')) {
        flushList()
        elements.push(
          <h4 key={`h4-${index}`} className="text-lg font-medium text-gray-800 mt-4 mb-2">
            {line.slice(5)}
          </h4>
        )
      }
      // Bullet points
      else if (line.match(/^[-*]\s/)) {
        if (listType !== 'ul') {
          flushList()
          listType = 'ul'
        }
        currentList.push(line.slice(2))
      }
      // Numbered lists
      else if (line.match(/^\d+\.\s/)) {
        if (listType !== 'ol') {
          flushList()
          listType = 'ol'
        }
        currentList.push(line.replace(/^\d+\.\s/, ''))
      }
      // Bold text and regular paragraphs
      else if (line.trim()) {
        flushList()
        const formattedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/"(.*?)"/g, '<q class="italic">$1</q>')

        elements.push(
          <p
            key={`p-${index}`}
            className="text-gray-700 leading-relaxed my-3"
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        )
      }
    })

    flushList()
    return elements
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">
            Generated on{' '}
            {new Date(createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          {copied ? 'Copied!' : 'Copy Report'}
        </button>
      </div>

      <div className="prose prose-purple max-w-none">{renderMarkdown(content)}</div>
    </div>
  )
}
