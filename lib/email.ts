import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type Language = 'en' | 'pl'

const emailTranslations = {
  en: {
    appName: 'Know Your Best Self',
    greeting: 'Hi there!',
    shareYourFeedback: 'Share Your Feedback',
    timeEstimate: 'This should only take 5-10 minutes. Your thoughtful responses will make a real difference!',
    ignoreNotice: "If you weren't expecting this email, you can safely ignore it.",
    subjectSuffix: 'would like your feedback',
  },
  pl: {
    appName: 'Poznaj Swoje Najlepsze Ja',
    greeting: 'Cześć!',
    shareYourFeedback: 'Podziel się opinią',
    timeEstimate: 'To zajmie tylko 5-10 minut. Twoje przemyślane odpowiedzi naprawdę pomogą!',
    ignoreNotice: 'Jeśli nie spodziewałeś/aś się tego emaila, możesz go zignorować.',
    subjectSuffix: 'prosi o Twoją opinię',
  },
}

export async function sendFeedbackInvitation(
  toEmail: string,
  feedbackLink: string,
  requesterName: string,
  customTemplate?: string | null,
  language: Language = 'en'
): Promise<{ success: boolean; error?: string }> {
  try {
    const t = emailTranslations[language]

    // Use custom template if provided, otherwise use default
    const bodyContent = customTemplate
      ? `<p>${customTemplate.replace(/\n/g, '</p><p>')}</p>`
      : language === 'pl'
      ? `
    <p><strong>${requesterName}</strong> bierze udział w ćwiczeniu rozwojowym "Best Reflected Self" (Najlepsze Odbicie Siebie).</p>

    <p>Polega ono na zebraniu historii i obserwacji od osób z otoczenia, aby lepiej zrozumieć, kiedy wnosi największą wartość i jak może skuteczniej wykorzystywać swoje mocne strony.</p>

    <p>Zwraca się do Ciebie, bo Twoja perspektywa jest cenna — znasz tę osobę i możesz podzielić się autentycznymi przykładami.</p>

    <p style="color: #4b5563;"><strong>Co chcielibyśmy od Ciebie usłyszeć:</strong></p>
    <ul style="color: #4b5563;">
      <li>Konkretne sytuacje, gdy ta osoba była w najlepszej formie</li>
      <li>Mocne strony, które zauważasz na co dzień</li>
      <li>Pozytywny wpływ, jaki ma na innych</li>
    </ul>

    <p style="color: #6b7280;">Twoja opinia pozostanie anonimowa i będzie częścią raportu rozwojowego.</p>
    `
      : `
    <p><strong>${requesterName}</strong> is participating in a self-development exercise called "Best Reflected Self".</p>

    <p>The goal is to gather stories and observations from people who know them well, to better understand when they bring the most value and how they can leverage their strengths more effectively.</p>

    <p>They're reaching out to you because your perspective matters — you've seen them in action and can share genuine examples.</p>

    <p style="color: #4b5563;"><strong>What we'd love to hear from you:</strong></p>
    <ul style="color: #4b5563;">
      <li>Specific moments when you saw them at their best</li>
      <li>Strengths you notice in your interactions</li>
      <li>The positive impact they have on others</li>
    </ul>

    <p style="color: #6b7280;">Your feedback will remain anonymous and become part of their development report.</p>
    `

    const { error } = await resend.emails.send({
      from: `${t.appName} <hello@knowyourbestself.org>`,
      to: toEmail,
      subject: `${requesterName} ${t.subjectSuffix}`,
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
    <h1 style="color: white; margin: 0; font-size: 24px;">${t.appName}</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="font-size: 18px; margin-top: 0;">${t.greeting}</p>

    ${bodyContent}

    <div style="text-align: center; margin: 30px 0;">
      <a href="${feedbackLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">${t.shareYourFeedback}</a>
    </div>

    <p style="color: #6b7280; font-size: 14px;">${t.timeEstimate}</p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

    <p style="color: #9ca3af; font-size: 12px; margin-bottom: 0;">
      ${t.ignoreNotice}
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
