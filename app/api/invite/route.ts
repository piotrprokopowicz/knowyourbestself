import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'
import { sendFeedbackInvitation } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { requestId, email } = body

    if (!requestId || !email) {
      return NextResponse.json(
        { error: 'Request ID and email are required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()
    const serviceSupabase = createServiceRoleClient()

    // Verify user owns this request
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: feedbackRequest, error: requestError } = await supabase
      .from('feedback_requests')
      .select('*')
      .eq('id', requestId)
      .eq('user_id', user.id)
      .single()

    if (requestError || !feedbackRequest) {
      return NextResponse.json(
        { error: 'Feedback request not found' },
        { status: 404 }
      )
    }

    // Generate feedback URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const feedbackUrl = `${baseUrl}/feedback/${feedbackRequest.share_token}`

    // Send email
    const result = await sendFeedbackInvitation(
      email,
      feedbackUrl,
      feedbackRequest.title,
      feedbackRequest.title
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      )
    }

    // Record invitation
    await serviceSupabase.from('invitations').insert({
      request_id: requestId,
      email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending invitation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
