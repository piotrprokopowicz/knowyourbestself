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
