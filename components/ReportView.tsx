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

interface ArchetypeData {
  name: string
  icon: string
  description: string
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

  // Parse archetype data from the report
  const archetypeData = useMemo((): ArchetypeData | null => {
    const match = content.match(/<!-- ARCHETYPE_DATA_START -->([\s\S]*?)<!-- ARCHETYPE_DATA_END -->/)
    if (!match) return null

    const dataSection = match[1]
    const nameMatch = dataSection.match(/name:\s*(.+)/)
    const iconMatch = dataSection.match(/icon:\s*(.+)/)
    const descMatch = dataSection.match(/description:\s*(.+)/)

    if (!nameMatch) return null

    return {
      name: nameMatch[1].trim(),
      icon: iconMatch ? iconMatch[1].trim() : '🌟',
      description: descMatch ? descMatch[1].trim() : '',
    }
  }, [content])

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

  // Remove the data sections from displayed content
  const displayContent = useMemo(() => {
    return content
      .replace(/<!-- ARCHETYPE_DATA_START -->[\s\S]*?<!-- ARCHETYPE_DATA_END -->/, '')
      .replace(/<!-- STRENGTHS_DATA_START -->[\s\S]*?<!-- STRENGTHS_DATA_END -->/, '')
  }, [content])

  // Helper function to process inline markdown formatting
  const formatInlineMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/"(.*?)"/g, '<q class="italic">"$1"</q>')
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
              <li
                key={i}
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }}
              />
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
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.slice(3)) }}
          />
        )
      } else if (line.startsWith('### ')) {
        flushList()
        elements.push(
          <h3
            key={`h3-${index}`}
            className="text-xl font-semibold text-gray-800 mt-6 mb-3"
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.slice(4)) }}
          />
        )
      } else if (line.startsWith('#### ')) {
        flushList()
        elements.push(
          <h4
            key={`h4-${index}`}
            className="text-lg font-medium text-gray-800 mt-4 mb-2"
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.slice(5)) }}
          />
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
        elements.push(
          <p
            key={`p-${index}`}
            className="text-gray-700 leading-relaxed my-3"
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }}
          />
        )
      }
    })

    flushList()
    return elements
  }

  // Color palette for word cloud
  const wordCloudColors = [
    'text-purple-600',
    'text-indigo-600',
    'text-blue-600',
    'text-teal-600',
    'text-violet-600',
    'text-fuchsia-600',
    'text-pink-600',
  ]

  // Calculate font size based on value (1-10 scale)
  const getFontSize = (value: number): string => {
    // Map 1-10 to font sizes from 0.875rem to 2.5rem
    const minSize = 0.875
    const maxSize = 2.5
    const size = minSize + ((value - 1) / 9) * (maxSize - minSize)
    return `${size}rem`
  }

  // Shuffle array for more natural word cloud appearance
  const shuffledStrengths = useMemo(() => {
    const sorted = [...strengthsData].sort((a, b) => b.value - a.value)
    // Interleave high and low values for visual balance
    const result: StrengthData[] = []
    let left = 0
    let right = sorted.length - 1
    while (left <= right) {
      if (left === right) {
        result.push(sorted[left])
      } else {
        result.push(sorted[left])
        result.push(sorted[right])
      }
      left++
      right--
    }
    return result
  }, [strengthsData])

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

      {/* Archetype Display */}
      {archetypeData && (
        <div className="mb-8 p-8 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 rounded-2xl shadow-lg text-center">
          <div className="text-7xl mb-4 animate-pulse">
            {archetypeData.icon}
          </div>
          <p className="text-purple-200 text-sm uppercase tracking-wider mb-2">
            {language === 'pl' ? 'Twój Archetyp' : 'Your Archetype'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {archetypeData.name}
          </h2>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            {archetypeData.description}
          </p>
        </div>
      )}

      {/* Word Cloud Visualization */}
      {strengthsData.length > 0 && (
        <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {t('strengthsVisualization')}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-4">
            {shuffledStrengths.map((strength, index) => (
              <span
                key={strength.name}
                className={`${wordCloudColors[index % wordCloudColors.length]} font-semibold hover:scale-110 transition-transform cursor-default`}
                style={{
                  fontSize: getFontSize(strength.value),
                  opacity: 0.7 + (strength.value / 10) * 0.3,
                }}
                title={`${strength.name}: ${strength.value}/10`}
              >
                {strength.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="prose prose-purple max-w-none">{renderMarkdown(displayContent)}</div>
    </div>
  )
}
