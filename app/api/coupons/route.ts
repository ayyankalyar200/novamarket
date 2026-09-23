import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check seller/admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'seller' && profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only sellers can create coupons' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_purchase_amount,
      max_discount_amount,
      usage_limit,
      per_user_limit,
      expires_at,
    } = body

    // Validation
    if (!code || code.trim().length < 3) {
      return NextResponse.json({ error: 'Code required (min 3 chars)' }, { status: 400 })
    }

    if (!['percentage', 'fixed'].includes(discount_type)) {
      return NextResponse.json({ error: 'Invalid discount type' }, { status: 400 })
    }

    if (!discount_value || discount_value <= 0) {
      return NextResponse.json({ error: 'Valid discount value required' }, { status: 400 })
    }

    if (discount_type === 'percentage' && discount_value > 100) {
      return NextResponse.json({ error: 'Percentage cannot exceed 100' }, { status: 400 })
    }

    // Check code uniqueness
    const { data: existing } = await supabase
      .from('coupons')
      .select('id')
      .eq('code', code.toUpperCase().trim())
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      )
    }

    // Create coupon
    const { data: coupon, error } = await supabase
      .from('coupons')
      .insert({
        seller_id: profile.role === 'admin' ? null : user.id,
        code: code.toUpperCase().trim(),
        description: description?.trim() || null,
        discount_type,
        discount_value,
        min_purchase_amount: min_purchase_amount || 0,
        max_discount_amount: max_discount_amount || null,
        usage_limit: usage_limit || null,
        per_user_limit: per_user_limit || 1,
        expires_at: expires_at || null,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, coupon })
  } catch (error: any) {
    console.error('Coupon create error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// GET - List coupons (for seller)
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ coupons: [] })
    }

    const { data: coupons } = await supabase
      .from('coupons')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ coupons: coupons || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
