'use client'

import { useLanguage } from '@/lib/LanguageContext'

interface LanguageToggleProps {
  className?: string
  variant?: 'light' | 'dark'
}

export default function LanguageToggle({ className = '', variant = 'light' }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage()

  // 'light' = on light background (white/gray pages) - use dark text
  // 'dark' = on dark background (gradient pages) - use light text
  const onLightBg = variant === 'light'

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
          language === 'en'
            ? 'bg-purple-600 text-white'
            : onLightBg
            ? 'text-gray-600 hover:bg-gray-100'
            : 'text-white/70 hover:text-white hover:bg-white/20'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('pl')}
        className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
          language === 'pl'
            ? 'bg-purple-600 text-white'
            : onLightBg
            ? 'text-gray-600 hover:bg-gray-100'
            : 'text-white/70 hover:text-white hover:bg-white/20'
        }`}
      >
        PL
      </button>
    </div>
  )
}
