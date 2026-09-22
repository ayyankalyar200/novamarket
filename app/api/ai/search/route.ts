import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { aiSearch, isAIAvailable } from '@/lib/ai/client'

export async function POST(request: Request) {
  try {
    if (!isAIAvailable()) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      )
    }

    const { query } = await request.json()

    if (!query || query.trim().length < 3) {
      return NextResponse.json(
        { error: 'Please describe what you want in more detail' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch some products for AI to choose from
    const { data: products } = await supabase
      .from('products')
      .select('*, profiles(username)')
      .eq('status', 'active')
      .eq('is_hidden', false)
      .limit(30)

    if (!products || products.length === 0) {
      return NextResponse.json({ results: [] })
    }

    // Get AI recommendations
    const results = await aiSearch(query, products)

    return NextResponse.json({ results })
  } catch (error: any) {
    console.error('AI search error:', error)
    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    )
  }
}
