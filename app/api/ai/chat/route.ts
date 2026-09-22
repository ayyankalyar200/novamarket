import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateAIText, isAIAvailable } from '@/lib/ai/client'

export async function POST(request: Request) {
  try {
    if (!isAIAvailable()) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      )
    }

    const { message } = await request.json()

    if (!message || message.trim().length < 2) {
      return NextResponse.json(
        { error: 'Message required' },
        { status: 400 }
      )
    }

    // Get some products for context
    const supabase = await createClient()
    const { data: products } = await supabase
      .from('products')
      .select('title, price, category_id')
      .eq('status', 'active')
      .eq('is_hidden', false)
      .limit(20)

    const productList = products
      ?.slice(0, 15)
      .map((p: any) => `• ${p.title} - $${p.price}`)
      .join('\n') || 'No products available'

    const prompt = `You are Nova AI, a friendly shopping assistant for NovaMarket marketplace.

User message: "${message}"

Current trending products:
${productList}

Respond helpfully in 2-3 sentences:
- If they're looking for products, suggest categories and mention we have many options
- Be conversational and friendly
- Don't use emojis except at start
- Keep it under 100 words

Response:`

    const { text } = await generateAIText(prompt, {
      maxTokens: 300,
      temperature: 0.8,
    })

    return NextResponse.json({ response: text.trim() })
  } catch (error: any) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: error.message || 'Chat failed' },
      { status: 500 }
    )
  }
}
