import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: requests } = await supabase
    .from('feedback_requests')
    .select(
      `
      *,
      feedback_responses(count)
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const requestsWithCount =
    requests?.map((r) => ({
      ...r,
      response_count:
        (r.feedback_responses as unknown as { count: number }[])?.[0]?.count ??
        0,
    })) ?? []

  return (
    <DashboardClient
      userEmail={user.email || ''}
      requests={requestsWithCount}
    />
  )
}
