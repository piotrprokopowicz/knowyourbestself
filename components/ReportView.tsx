'use client'

import React, { useState, useMemo } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

interface ReportViewProps {
  content: string
  title: string
  createdAt: string
}

interface StrengthData {
  name: string
  value: number
}

export default function ReportView({
  content,
  title,
  createdAt,
}: ReportViewProps) {
  const [copied, setCopied] = useState(false)
  const { t, language } = useLanguage()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Parse strengths data from the report
  const strengthsData = useMemo((): StrengthData[] => {
    const match = content.match(/<!-- STRENGTHS_DATA_START -->([\s\S]*?)<!-- STRENGTHS_DATA_END -->/)
    if (!match) return []

    const dataSection = match[1]
    const lines = dataSection.split('\n').filter(line => line.includes(':'))

    return lines.map(line => {
      const [name, valueStr] = line.split(':').map(s => s.trim())
      const value = parseInt(valueStr, 10)
      return { name, value: isNaN(value) ? 5 : value }
    }).filter(item => item.name && item.name.length > 0)
  }, [content])

  // Remove the strengths data section from displayed content
  const displayContent = useMemo(() => {
    return content.replace(/<!-- STRENGTHS_DATA_START -->[\s\S]*?<!-- STRENGTHS_DATA_END -->/, '')
  }, [content])

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

  // Color palette for strength bars
  const colors = [
    'bg-purple-500',
    'bg-indigo-500',
    'bg-blue-500',
    'bg-teal-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-orange-500',
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">
            {t('generatedOn')}{' '}
            {new Date(createdAt).toLocaleDateString(
              language === 'pl' ? 'pl-PL' : 'en-US',
              {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }
            )}
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
          {copied ? t('copied') : t('copyReport')}
        </button>
      </div>

      {/* Strengths Visualization */}
      {strengthsData.length > 0 && (
        <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {t('strengthsVisualization')}
          </h3>
          <div className="space-y-3">
            {strengthsData.map((strength, index) => (
              <div key={strength.name} className="flex items-center gap-3">
                <div className="w-32 text-sm font-medium text-gray-700 truncate">
                  {strength.name}
                </div>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                    style={{ width: `${strength.value * 10}%` }}
                  />
                </div>
                <div className="w-8 text-sm text-gray-500 text-right">
                  {strength.value}/10
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="prose prose-purple max-w-none">{renderMarkdown(displayContent)}</div>
    </div>
  )
}
