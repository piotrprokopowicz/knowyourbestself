import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <nav className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="text-xl font-bold text-white">Know Your Best Self</div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-white hover:bg-white/10 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-white px-4 py-2 text-purple-600 font-medium hover:bg-gray-100 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white max-w-4xl leading-tight">
          Discover Your Strengths Through the Eyes of Others
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl">
          The Best Reflected Self exercise helps you understand your unique strengths
          by collecting feedback from people who know you best.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-purple-600 hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Learn More
          </Link>
        </div>

        <section id="how-it-works" className="mt-32 w-full max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-left">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Create a Request
              </h3>
              <p className="text-white/70">
                Set up a feedback request and share a unique link with colleagues,
                friends, and family who know you well.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-left">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Collect Feedback
              </h3>
              <p className="text-white/70">
                Recipients answer guided questions about your strengths, positive
                qualities, and memorable moments they've witnessed.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-left">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Get Your Report
              </h3>
              <p className="text-white/70">
                Our AI analyzes all responses to create a comprehensive portrait of
                you at your best, with actionable insights.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-32 w-full max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            What You'll Discover
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-left space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/90">Your core strengths and recurring themes</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/90">How you positively impact others around you</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/90">Specific examples and stories from your feedback</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white/90">Actionable insights for personal growth</p>
            </div>
          </div>
        </section>

        <div className="mt-20">
          <Link
            href="/signup"
            className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-purple-600 hover:bg-gray-100 transition-colors"
          >
            Start Your Journey
          </Link>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-white/60">
        <p>&copy; 2026 Know Your Best Self. All rights reserved.</p>
        <Link href="/feedback-app" className="text-white/60 hover:text-white text-sm mt-2 inline-block">
          Share Feedback
        </Link>
      </footer>
    </div>
  )
}
