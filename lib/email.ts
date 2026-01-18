import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendFeedbackInvitation(
  toEmail: string,
  feedbackLink: string,
  requesterName: string,
  customTemplate?: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    // Use custom template if provided, otherwise use default
    const bodyContent = customTemplate
      ? `<p>${customTemplate.replace(/\n/g, '</p><p>')}</p>`
      : `
    <p><strong>${requesterName}</strong> is working on understanding their strengths and positive impact on others through the "Best Reflected Self" exercise.</p>

    <p>They've asked you to share your perspective because you know them well and can provide valuable insight.</p>

    <p>Your feedback is anonymous and will help them understand:</p>
    <ul style="color: #4b5563;">
      <li>Their key strengths and positive qualities</li>
      <li>Memorable moments when they were at their best</li>
      <li>The unique value they bring to relationships</li>
    </ul>
    `

    const { error } = await resend.emails.send({
      from: 'Know Your Best Self <hello@knowyourbestself.org>',
      to: toEmail,
      subject: `${requesterName} is asking for your feedback`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feedback Request</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Know Your Best Self</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="font-size: 18px; margin-top: 0;">Hi there!</p>

    ${bodyContent}

    <div style="text-align: center; margin: 30px 0;">
      <a href="${feedbackLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Share Your Feedback</a>
    </div>

    <p style="color: #6b7280; font-size: 14px;">This should only take 5-10 minutes. Your thoughtful responses will make a real difference!</p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

    <p style="color: #9ca3af; font-size: 12px; margin-bottom: 0;">
      If you weren't expecting this email, you can safely ignore it.
    </p>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}
