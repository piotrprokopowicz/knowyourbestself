'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="text-xl font-bold text-white">{t('appName')}</div>
        <div className="flex items-center gap-4">
          <LanguageToggle variant="dark" className="mr-2" />
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-white hover:bg-white/10 transition-colors"
          >
            {t('logIn')}
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-white px-4 py-2 text-purple-600 font-medium hover:bg-gray-100 transition-colors"
          >
            {t('signUp')}
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white max-w-4xl leading-tight">
          {t('heroTitle')}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl">
          {t('heroSubtitle')}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-purple-600 hover:bg-gray-100 transition-colors"
          >
            {t('getStartedFree')}
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-colors"
          >
            {t('learnMore')}
          </Link>
        </div>

        <section id="how-it-works" className="mt-32 w-full max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            {t('howItWorks')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-left">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {t('step1Title')}
              </h3>
              <p className="text-white/70">
                {t('step1Desc')}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-left">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {t('step2Title')}
              </h3>
              <p className="text-white/70">
                {t('step2Desc')}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-left">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {t('step3Title')}
              </h3>
              <p className="text-white/70">
                {t('step3Desc')}
              </p>
            </div>
          </div>
        </section>

        {/* Sample Report Preview */}
        <section className="mt-32 w-full max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('sampleReportTitle')}
          </h2>
          <p className="text-white/70 mb-8">{t('sampleReportSubtitle')}</p>

          <div className="bg-white rounded-2xl p-6 md:p-8 text-left shadow-2xl">
            {/* Report Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{t('sampleReportHeader')}</h3>
                <p className="text-gray-500 text-sm">{t('sampleReportBased')}</p>
              </div>
            </div>

            {/* Archetype */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🌟</span>
                <span className="text-sm font-medium text-purple-600 uppercase tracking-wide">{t('sampleArchetypeLabel')}</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{t('sampleArchetype')}</h4>
              <p className="text-gray-600">{t('sampleArchetypeDesc')}</p>
            </div>

            {/* Key Strengths */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('sampleStrengthsTitle')}</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <div>
                    <span className="font-medium text-gray-900">{t('sampleStrength1')}</span>
                    <p className="text-sm text-gray-500">{t('sampleStrength1Desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <div>
                    <span className="font-medium text-gray-900">{t('sampleStrength2')}</span>
                    <p className="text-sm text-gray-500">{t('sampleStrength2Desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <div>
                    <span className="font-medium text-gray-900">{t('sampleStrength3')}</span>
                    <p className="text-sm text-gray-500">{t('sampleStrength3Desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <div>
                    <span className="font-medium text-gray-900">{t('sampleStrength4')}</span>
                    <p className="text-sm text-gray-500">{t('sampleStrength4Desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mb-6">
              <p className="text-gray-700 italic">"{t('sampleQuote')}"</p>
              <p className="text-sm text-gray-500 mt-2">— {t('sampleQuoteAuthor')}</p>
            </div>

            {/* Blur overlay for "see more" effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white flex items-end justify-center pb-4">
                <Link
                  href="/signup"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-lg"
                >
                  {t('getYourOwnReport')}
                </Link>
              </div>
              <div className="opacity-50 pointer-events-none">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('sampleInsightsTitle')}</h4>
                <p className="text-gray-600">{t('sampleInsightsPreview')}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-32 w-full max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            {t('whatYoullDiscover')}
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-left space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/90">{t('discoverItem1')}</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/90">{t('discoverItem2')}</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/90">{t('discoverItem3')}</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/90">{t('discoverItem4')}</p>
            </div>
          </div>
        </section>

        <div className="mt-20">
          <Link
            href="/signup"
            className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-purple-600 hover:bg-gray-100 transition-colors"
          >
            {t('startYourJourney')}
          </Link>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-white/60">
        <p>{t('footerRights')}</p>
        <Link href="/feedback-app" className="text-white/60 hover:text-white text-sm mt-2 inline-block">
          {t('shareFeedback')}
        </Link>
      </footer>
    </div>
  )
}
