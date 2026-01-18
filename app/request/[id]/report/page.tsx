import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import ReportPageClient from './ReportPageClient'

export default async function ReportPage({
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

  const { data: request, error: requestError } = await supabase
    .from('feedback_requests')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (requestError || !request) {
    notFound()
  }

  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('*')
    .eq('request_id', id)
    .single()

  if (reportError || !report) {
    redirect(`/request/${id}`)
  }

  return (
    <ReportPageClient
      requestId={id}
      requestTitle={request.title}
      report={report}
    />
  )
}
