import { createServiceRoleClient } from '@/lib/supabase-server'
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

    const supabase = createServiceRoleClient()

    // Verify request exists and is open
    const { data: feedbackRequest, error: requestError } = await supabase
      .from('feedback_requests')
      .select('id, status')
      .eq('id', requestId)
      .single()

    if (requestError || !feedbackRequest) {
      return NextResponse.json(
        { error: 'Feedback request not found' },
        { status: 404 }
      )
    }

    // Allow feedback for 'open' and 'completed' status (so users can collect more feedback after report)
    // Only block during 'analyzing' status
    if (feedbackRequest.status === 'analyzing') {
      return NextResponse.json(
        { error: 'This feedback request is currently being analyzed. Please try again later.' },
        { status: 400 }
      )
    }

    // Insert feedback response
    const { error: insertError } = await supabase
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

    if (insertError) {
      console.error('Error inserting feedback:', insertError)
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
