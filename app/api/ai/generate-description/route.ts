import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateProductDescription, isAIAvailable } from '@/lib/ai/client'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (!isAIAvailable()) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      )
    }

    const { title, category, keywords } = await request.json()

    if (!title || title.trim().length < 3) {
      return NextResponse.json(
        { error: 'Product title required' },
        { status: 400 }
      )
    }

    const description = await generateProductDescription(
      title,
      category,
      keywords
    )

    return NextResponse.json({ description })
  } catch (error: any) {
    console.error('AI description error:', error)
    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    )
  }
}
