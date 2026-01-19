'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'
import LanguageToggle from './LanguageToggle'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [showResetOption, setShowResetOption] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        })

        if (error) throw error

        // Check if user already exists (Supabase returns user with identities = [] for existing users)
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError(t('emailAlreadyExists'))
          setShowResetOption(true)
          return
        }

        setMessage(t('checkEmailConfirmation'))
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle variant="dark" />
      </div>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center gap-2">
              <Image
                src="/logo.png"
                alt="Know Your Best Self"
                width={64}
                height={64}
                className="rounded-full"
              />
              <span className="text-2xl font-bold text-purple-600">{t('appName')}</span>
            </Link>
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              {mode === 'login' ? t('welcomeBack') : t('createYourAccount')}
            </h1>
            <p className="mt-2 text-gray-600">
              {mode === 'login'
                ? t('signInToAccess')
                : t('startDiscovering')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t('emailAddress')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t('password')}
                </label>
                {mode === 'login' && (
                  <Link
                    href="/forgot-password"
                    className="text-sm text-purple-600 hover:text-purple-500"
                  >
                    {t('forgotPassword')}
                  </Link>
                )}
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                <p>{error}</p>
                {showResetOption && (
                  <Link
                    href="/forgot-password"
                    className="block mt-2 font-medium text-red-700 hover:text-red-600 underline"
                  >
                    {t('wantToResetPassword')}
                  </Link>
                )}
              </div>
            )}

            {message && (
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-purple-600 px-4 py-3 text-white font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading
                ? t('loading')
                : mode === 'login'
                ? t('signIn')
                : t('signUp')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {mode === 'login' ? (
              <>
                {t('dontHaveAccount')}{' '}
                <Link
                  href="/signup"
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  {t('signUp')}
                </Link>
              </>
            ) : (
              <>
                {t('alreadyHaveAccount')}{' '}
                <Link
                  href="/login"
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  {t('signIn')}
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
