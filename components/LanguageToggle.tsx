'use client'

import { useLanguage } from '@/lib/LanguageContext'

interface LanguageToggleProps {
  className?: string
  variant?: 'light' | 'dark'
}

export default function LanguageToggle({ className = '', variant }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage()

  // Auto-detect based on className if variant not specified
  const isDarkBg = variant === 'dark' || className.includes('bg-white')

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-sm rounded transition-colors ${
          language === 'en'
            ? 'bg-purple-600 text-white'
            : isDarkBg
            ? 'text-gray-600 hover:bg-gray-100'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('pl')}
        className={`px-2 py-1 text-sm rounded transition-colors ${
          language === 'pl'
            ? 'bg-purple-600 text-white'
            : isDarkBg
            ? 'text-gray-600 hover:bg-gray-100'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        PL
      </button>
    </div>
  )
}
