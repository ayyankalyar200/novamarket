import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateDiscount } from '@/lib/coupons'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { code, subtotal } = await request.json()

    if (!code || !subtotal) {
      return NextResponse.json(
        { error: 'Code and subtotal required' },
        { status: 400 }
      )
    }

    // Find coupon
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .maybeSingle()

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 404 }
      )
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Coupon has expired' },
        { status: 400 }
      )
    }

    // Check start date
    if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) {
      return NextResponse.json(
        { error: 'Coupon is not yet active' },
        { status: 400 }
      )
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return NextResponse.json(
        { error: 'Coupon usage limit reached' },
        { status: 400 }
      )
    }

    // Check min purchase
    if (subtotal < coupon.min_purchase_amount) {
      return NextResponse.json(
        { error: `Minimum purchase of $${coupon.min_purchase_amount} required` },
        { status: 400 }
      )
    }

    // Check per-user limit
    if (user && coupon.per_user_limit) {
      const { count } = await supabase
        .from('coupon_usage')
        .select('*', { count: 'exact', head: true })
        .eq('coupon_id', coupon.id)
        .eq('user_id', user.id)

      if (count && count >= coupon.per_user_limit) {
        return NextResponse.json(
          { error: 'You have already used this coupon' },
          { status: 400 }
        )
      }
    }

    // Calculate discount
    const discount = calculateDiscount(coupon, subtotal)

    if (discount <= 0) {
      return NextResponse.json(
        { error: 'Coupon does not apply to this order' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        description: coupon.description,
      },
      discount,
      final_total: subtotal - discount,
    })
  } catch (error: any) {
    console.error('Coupon validate error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
