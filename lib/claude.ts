import Anthropic from '@anthropic-ai/sdk'
import { FeedbackResponse } from './supabase'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function generateBestReflectedSelfReport(
  feedbackResponses: FeedbackResponse[],
  requestTitle: string,
  requestContext?: string | null,
  challenges?: string | null,
  language: 'en' | 'pl' = 'en'
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

  const sectionHeadings = language === 'pl'
    ? {
        portrait: 'Twój Portret Najlepszego Ja',
        yourArchetype: 'Twój Archetyp',
        strengthsOverview: 'Przegląd Mocnych Stron',
        coreStrengths: 'Główne Mocne Strony i Tematy',
        uniqueImpact: 'Twój Unikalny Wpływ',
        keyQualities: 'Kluczowe Cechy',
        powerfulStories: 'Inspirujące Historie i Momenty',
        overcomingChallenges: 'Pokonywanie Twoich Wyzwań',
        insightsForGrowth: 'Wskazówki do Rozwoju',
        bestSelfSummary: 'Podsumowanie Twojego Najlepszego Ja',
      }
    : {
        portrait: 'Your Best Reflected Self Portrait',
        yourArchetype: 'Your Archetype',
        strengthsOverview: 'Strengths Overview',
        coreStrengths: 'Core Strengths & Themes',
        uniqueImpact: 'Your Unique Impact',
        keyQualities: 'Key Qualities',
        powerfulStories: 'Powerful Stories & Moments',
        overcomingChallenges: 'Overcoming Your Challenges',
        insightsForGrowth: 'Insights for Growth',
        bestSelfSummary: 'Your Best Self Summary',
      }

  const reportLanguage = language === 'pl'
    ? 'WRITE THIS ENTIRE REPORT IN POLISH (Polski). Every single word must be in Polish - no English words allowed.'
    : 'Write this report in English.'

  const prompt = `${reportLanguage}

You are an expert in the "Best Reflected Self" exercise, a self-development methodology that helps people understand their unique strengths through feedback from people who know them.

A user named "${requestTitle}" has collected feedback from ${feedbackResponses.length} people who know them well.${requestContext ? ` Context: ${requestContext}` : ''}

Here is all the feedback they received:

${feedbackSummary}${challengesSection}

Based on this feedback, create a comprehensive "Best Reflected Self" report.

FIRST, provide the archetype classification in this exact format (will be parsed by the app):

<!-- ARCHETYPE_DATA_START -->
name: [A creative 2-3 word archetype name${language === 'pl' ? ' IN POLISH' : ''}, like "${language === 'pl' ? 'Empatyczny Lider' : 'Empathetic Leader'}", "${language === 'pl' ? 'Cichy Katalizator' : 'Quiet Catalyst'}", "${language === 'pl' ? 'Mądry Doradca' : 'Wise Counselor'}", etc.]
icon: [Choose ONE emoji: 🌟 ⭐ 💡 🎯 🔥 💪 🌊 🦁 🦋 🌱 🎨 🏔️ ⚡ 🌈 🤝 💎 🧭 🔮 👑 🌺]
description: [One sentence${language === 'pl' ? ' IN POLISH' : ''} describing what makes this archetype unique]
<!-- ARCHETYPE_DATA_END -->

SECOND, provide EXACTLY 4 key strengths in this exact format (will be parsed by the app to display as cards):

<!-- STRENGTHS_CARDS_START -->
strength1_title: [Short 2-3 word title${language === 'pl' ? ' IN POLISH' : ''}]
strength1_desc: [One short sentence describing how it manifests${language === 'pl' ? ' IN POLISH' : ''}]
strength2_title: [Short 2-3 word title${language === 'pl' ? ' IN POLISH' : ''}]
strength2_desc: [One short sentence describing how it manifests${language === 'pl' ? ' IN POLISH' : ''}]
strength3_title: [Short 2-3 word title${language === 'pl' ? ' IN POLISH' : ''}]
strength3_desc: [One short sentence describing how it manifests${language === 'pl' ? ' IN POLISH' : ''}]
strength4_title: [Short 2-3 word title${language === 'pl' ? ' IN POLISH' : ''}]
strength4_desc: [One short sentence describing how it manifests${language === 'pl' ? ' IN POLISH' : ''}]
<!-- STRENGTHS_CARDS_END -->

THIRD, provide ONE powerful quote from the feedback that best captures this person at their best:

<!-- QUOTE_START -->
quote: [A meaningful quote or paraphrased feedback${language === 'pl' ? ' IN POLISH' : ''}]
source: [${language === 'pl' ? 'Opinia od współpracownika/przyjaciela/etc.' : 'Feedback from a colleague/friend/etc.'}]
<!-- QUOTE_END -->

Then continue with the following sections:

## ${sectionHeadings.uniqueImpact}
Describe how this person positively impacts others. What do people experience when they interact with them? What makes them memorable? Keep it to 2-3 paragraphs.

## ${sectionHeadings.powerfulStories}
Highlight 2-3 specific stories or moments that were shared in the feedback that exemplify this person at their best.
${challenges ? `
## ${sectionHeadings.overcomingChallenges}
Based on the challenges shared ("${challenges}"), explain how the identified strengths can be leveraged to overcome these obstacles. Provide specific, actionable strategies.
` : ''}
## ${sectionHeadings.insightsForGrowth}
Provide 3-5 actionable insights for how to:
- Leverage these strengths more intentionally
- Apply them in new contexts
- Build on natural gifts

## ${sectionHeadings.bestSelfSummary}
A 2-3 paragraph narrative that captures who this person is at their best, written in second person ("${language === 'pl' ? 'Jesteś osobą, która...' : 'You are someone who...'}").

Make the report personal, insightful, and actionable. Focus on specific examples from the feedback rather than generic statements.

CRITICAL: You MUST include ALL THREE data blocks (ARCHETYPE_DATA, STRENGTHS_CARDS, QUOTE) exactly as shown. These are parsed by the application. Do not skip them or modify the format.${language === 'pl' ? ' REMEMBER: THE ENTIRE REPORT MUST BE IN POLISH.' : ''}`

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
