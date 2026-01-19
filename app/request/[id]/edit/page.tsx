import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import EditRequestForm from './EditRequestForm'

export const dynamic = 'force-dynamic'

export default async function EditRequestPage({
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

  return (
    <EditRequestForm
      requestId={id}
      initialData={{
        title: request.title,
        context: request.context || '',
        emailTemplate: request.email_template || '',
        challenges: request.challenges || '',
      }}
    />
  )
}
