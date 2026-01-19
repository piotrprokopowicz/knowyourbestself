import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import ReportPageClient from '../ReportPageClient'

// Disable caching to always fetch fresh report data
export const dynamic = 'force-dynamic'

export default async function PastReportPage({
  params,
}: {
  params: Promise<{ id: string; reportId: string }>
}) {
  const { id, reportId } = await params
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

  // Get the specific report by ID
  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('*')
    .eq('id', reportId)
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
      isPastReport
    />
  )
}
