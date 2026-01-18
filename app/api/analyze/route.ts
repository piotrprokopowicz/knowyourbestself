import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'
import { generateBestReflectedSelfReport } from '@/lib/claude'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { requestId } = body

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
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

    // Allow regeneration if status is 'open' or 'completed'
    // Only block if currently 'analyzing'
    if (feedbackRequest.status === 'analyzing') {
      return NextResponse.json(
        { error: 'Analysis is already in progress' },
        { status: 400 }
      )
    }

    const isRegeneration = feedbackRequest.status === 'completed'

    // Get all feedback responses
    const { data: responses, error: responsesError } = await supabase
      .from('feedback_responses')
      .select('*')
      .eq('request_id', requestId)

    if (responsesError) {
      return NextResponse.json(
        { error: 'Failed to fetch responses' },
        { status: 500 }
      )
    }

    if (!responses || responses.length < 3) {
      return NextResponse.json(
        { error: 'At least 3 responses are required for analysis' },
        { status: 400 }
      )
    }

    // Update status to analyzing
    await serviceSupabase
      .from('feedback_requests')
      .update({ status: 'analyzing' })
      .eq('id', requestId)

    try {
      // If regenerating, delete the old report first
      if (isRegeneration) {
        await serviceSupabase
          .from('reports')
          .delete()
          .eq('request_id', requestId)
      }

      // Generate report using Claude with challenges
      const reportContent = await generateBestReflectedSelfReport(
        responses,
        feedbackRequest.title,
        feedbackRequest.context,
        feedbackRequest.challenges
      )

      // Save report
      const { error: reportError } = await serviceSupabase
        .from('reports')
        .insert({
          request_id: requestId,
          content: reportContent,
        })

      if (reportError) {
        console.error('Error saving report:', reportError)
        // Revert status
        await serviceSupabase
          .from('feedback_requests')
          .update({ status: 'open' })
          .eq('id', requestId)
        return NextResponse.json(
          { error: 'Failed to save report' },
          { status: 500 }
        )
      }

      // Update status to completed
      await serviceSupabase
        .from('feedback_requests')
        .update({ status: 'completed' })
        .eq('id', requestId)

      return NextResponse.json({ success: true })
    } catch (analysisError) {
      console.error('Error generating report:', analysisError)
      // Revert status
      await serviceSupabase
        .from('feedback_requests')
        .update({ status: 'open' })
        .eq('id', requestId)
      return NextResponse.json(
        { error: 'Failed to generate report' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in analyze route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
