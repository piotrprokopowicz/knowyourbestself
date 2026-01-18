import Anthropic from '@anthropic-ai/sdk'
import { FeedbackResponse } from './supabase'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function generateBestReflectedSelfReport(
  feedbackResponses: FeedbackResponse[],
  requestTitle: string,
  requestContext?: string | null,
  challenges?: string | null
): Promise<string> {
  const feedbackSummary = feedbackResponses
    .map((response, index) => {
      return `
### Feedback ${index + 1}${response.respondent_name ? ` (from ${response.respondent_name})` : ''}
**Relationship:** ${response.relationship || 'Not specified'}
**Key Strengths:** ${response.strengths}
**Positive Moments:** ${response.positive_moments || 'Not provided'}
**Qualities Observed:** ${response.qualities || 'Not provided'}
**Additional Comments:** ${response.additional_comments || 'None'}
`
    })
    .join('\n---\n')

  const challengesSection = challenges
    ? `

The user has also shared some challenges or obstacles they are currently facing:
"${challenges}"

Please include a dedicated section in the report that addresses how their identified strengths can help them overcome these specific challenges. Be practical and actionable.`
    : ''

  const prompt = `You are an expert in the "Best Reflected Self" exercise, a powerful self-development methodology that helps people understand their unique strengths and positive impact on others through feedback from people who know them.

A user named "${requestTitle}" has collected feedback from ${feedbackResponses.length} people who know them well.${requestContext ? ` Context: ${requestContext}` : ''}

Here is all the feedback they received:

${feedbackSummary}${challengesSection}

Based on this feedback, create a comprehensive "Best Reflected Self" report. Structure it as follows:

## Your Best Reflected Self Portrait

### Strengths Overview
At the very beginning, provide a simple strength visualization in this exact format (this will be parsed by the app):
<!-- STRENGTHS_DATA_START -->
[List 5-7 key strengths, one per line, each followed by a number 1-10 representing frequency/emphasis in feedback]
Example format:
Leadership: 8
Empathy: 9
Problem Solving: 7
<!-- STRENGTHS_DATA_END -->

### Core Strengths & Themes
Identify 3-5 recurring themes or strengths that appear across multiple pieces of feedback. For each theme:
- Give it a clear, memorable name
- Explain how it manifests based on the feedback
- Include specific examples or quotes from the feedback

### Your Unique Impact
Describe how you positively impact others. What do people experience when they interact with you? What makes you memorable?

### Key Qualities
List the top qualities that define you at your best, drawing from the feedback received.

### Powerful Stories & Moments
Highlight 2-3 specific stories or moments that were shared in the feedback that exemplify you at your best.
${challenges ? `
### Overcoming Your Challenges
Based on the challenges shared ("${challenges}"), explain how the identified strengths can be leveraged to overcome these obstacles. Provide specific, actionable strategies.
` : ''}
### Insights for Growth
Based on these strengths, provide 3-5 actionable insights for how you can:
- Leverage these strengths more intentionally
- Apply them in new contexts
- Build on your natural gifts

### Your Best Self Summary
A 2-3 paragraph narrative that captures who you are at your best, written in second person ("You are someone who...").

Make the report personal, insightful, and actionable. Focus on specific examples from the feedback rather than generic statements. This should feel like a meaningful portrait of someone at their best.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const textContent = message.content.find((block) => block.type === 'text')
  return textContent ? textContent.text : 'Unable to generate report.'
}
