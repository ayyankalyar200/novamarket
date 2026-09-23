import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sellerAIAssistant, isAIAvailable } from '@/lib/ai/client'

export async function POST(request: Request) {
  try {
    if (!isAIAvailable()) {
      return NextResponse.json(
        { error: 'AI service not available' },
        { status: 503 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { message } = await request.json()

    if (!message || message.trim().length < 2) {
      return NextResponse.json(
        { error: 'Message required' },
        { status: 400 }
      )
    }

    // Get seller context
    const [profileRes, productsRes, orderItemsRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('store_name, username')
        .eq('id', user.id)
        .single(),
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('seller_id', user.id),
      supabase
        .from('order_items')
        .select('quantity, price')
        .eq('seller_id', user.id),
    ])

    const totalRevenue =
      orderItemsRes.data?.reduce(
        (sum: number, i: any) => sum + i.quantity * i.price,
        0
      ) || 0

    const result = await sellerAIAssistant(message.trim(), {
      storeName: profileRes.data?.store_name || profileRes.data?.username,
      totalProducts: productsRes.count || 0,
      totalRevenue,
      totalOrders: orderItemsRes.data?.length || 0,
    })

    return NextResponse.json({
      response: result.text,
      provider: result.provider,
    })
  } catch (error: any) {
    console.error('Seller AI error:', error)
    return NextResponse.json(
      { error: error.message || 'AI failed' },
      { status: 500 }
    )
  }
}
