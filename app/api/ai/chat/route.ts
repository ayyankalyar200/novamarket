import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buyerAIAssistant, isAIAvailable } from '@/lib/ai/client'

export async function POST(request: Request) {
  try {
    if (!isAIAvailable()) {
      return NextResponse.json(
        { error: 'AI service not available' },
        { status: 503 }
      )
    }

    const { message, history = [] } = await request.json()

    if (!message || message.trim().length < 2) {
      return NextResponse.json(
        { error: 'Message required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch some products for context
    const { data: products } = await supabase
      .from('products')
      .select('id, title, price, stock, description')
      .eq('status', 'active')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .limit(20)

    const result = await buyerAIAssistant(
      message.trim(),
      products || [],
      history
    )

    return NextResponse.json({
      response: result.text,
      provider: result.provider,
    })
  } catch (error: any) {
    console.error('Buyer AI error:', error)
    return NextResponse.json(
      { error: error.message || 'AI failed' },
      { status: 500 }
    )
  }
}
