import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeImageForSearch, isAIAvailable } from '@/lib/ai/client'

export async function POST(request: Request) {
  try {
    if (!isAIAvailable()) {
      return NextResponse.json(
        { error: 'AI service not available' },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Validate size (max 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image too large. Max 5MB' },
        { status: 400 }
      )
    }

    // Validate type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files allowed' },
        { status: 400 }
      )
    }

    // Convert to base64
    const arrayBuffer = await imageFile.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    // Get products for matching
    const supabase = await createClient()
    const { data: products } = await supabase
      .from('products')
      .select('id, title, price, images, seller_id, stock, description')
      .eq('status', 'active')
      .eq('is_hidden', false)
      .limit(30)

    if (!products || products.length === 0) {
      return NextResponse.json({
        keywords: [],
        results: [],
        message: 'No products available to match'
      })
    }

    // Analyze image with AI
    const { keywords, bestMatches } = await analyzeImageForSearch(
      base64,
      imageFile.type,
      products
    )

    // Get seller info for matches
    const sellerIds = [...new Set(bestMatches.map((p: any) => p.seller_id).filter(Boolean))]
    const { data: sellers } = sellerIds.length > 0
      ? await supabase.from('profiles').select('id, username').in('id', sellerIds)
      : { data: [] }

    const results = bestMatches.map((p: any) => ({
      ...p,
      profiles: sellers?.find((s: any) => s.id === p.seller_id) || null,
    }))

    return NextResponse.json({
      success: true,
      keywords,
      results,
    })
  } catch (error: any) {
    console.error('Image search error:', error)
    return NextResponse.json(
      { error: error.message || 'Image search failed' },
      { status: 500 }
    )
  }
}
