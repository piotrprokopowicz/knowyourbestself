import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { feedback, email } = body

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      )
    }

    const { error } = await resend.emails.send({
      from: 'Know Your Best Self <hello@knowyourbestself.org>',
      to: 'piotrprokopowicz@gmail.com',
      subject: 'New App Feedback - Know Your Best Self',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
  <h2>New Feedback Received</h2>

  ${email ? `<p><strong>From:</strong> ${email}</p>` : '<p><em>Anonymous feedback</em></p>'}

  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 20px;">
    <p style="white-space: pre-wrap;">${feedback}</p>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to send feedback' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending feedback:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
