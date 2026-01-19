import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      requestId,
      respondentName,
      relationship,
      strengths,
      positiveMoments,
      qualities,
      additionalComments,
    } = body

    if (!requestId || !strengths) {
      return NextResponse.json(
        { error: 'Request ID and strengths are required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()
    const serviceSupabase = createServiceRoleClient()

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user owns the feedback request
    const { data: feedbackRequest, error: requestError } = await supabase
      .from('feedback_requests')
      .select('id')
      .eq('id', requestId)
      .eq('user_id', user.id)
      .single()

    if (requestError || !feedbackRequest) {
      return NextResponse.json(
        { error: 'Feedback request not found' },
        { status: 404 }
      )
    }

    // Insert the manual response using service role client (bypasses RLS)
    const { data, error: insertError } = await serviceSupabase
      .from('feedback_responses')
      .insert({
        request_id: requestId,
        respondent_name: respondentName || null,
        relationship: relationship || null,
        strengths,
        positive_moments: positiveMoments || null,
        qualities: qualities || null,
        additional_comments: additionalComments || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting response:', insertError)
      return NextResponse.json(
        { error: 'Failed to add response' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in add response route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
