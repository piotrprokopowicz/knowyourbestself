import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import RequestPageClient from './RequestPageClient'

// Disable caching to always fetch fresh data
export const dynamic = 'force-dynamic'

export default async function RequestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: request, error } = await supabase
    .from('feedback_requests')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !request) {
    notFound()
  }

  const { data: responses } = await supabase
    .from('feedback_responses')
    .select('*')
    .eq('request_id', id)
    .order('created_at', { ascending: false })

  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .eq('request_id', id)
    .order('created_at', { ascending: false })

  const { data: invitations } = await supabase
    .from('invitations')
    .select('*')
    .eq('request_id', id)
    .order('sent_at', { ascending: false })

  const feedbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/feedback/${request.share_token}`

  return (
    <RequestPageClient
      request={request}
      responses={responses}
      reports={reports}
      invitations={invitations}
      feedbackUrl={feedbackUrl}
    />
  )
}
