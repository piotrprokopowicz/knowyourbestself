import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()
    const serviceSupabase = createServiceRoleClient()

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First, get the response to find which request it belongs to
    const { data: response, error: fetchError } = await serviceSupabase
      .from('feedback_responses')
      .select('request_id')
      .eq('id', id)
      .single()

    if (fetchError || !response) {
      return NextResponse.json(
        { error: 'Response not found' },
        { status: 404 }
      )
    }

    // Verify user owns the feedback request
    const { data: feedbackRequest, error: requestError } = await supabase
      .from('feedback_requests')
      .select('id')
      .eq('id', response.request_id)
      .eq('user_id', user.id)
      .single()

    if (requestError || !feedbackRequest) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete the response using service role client (bypasses RLS)
    const { error: deleteError } = await serviceSupabase
      .from('feedback_responses')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting response:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete response' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in delete response route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
