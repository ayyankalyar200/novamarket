export type CouponType = 'percentage' | 'fixed'

export type Coupon = {
  id: string
  seller_id: string | null
  code: string
  description: string | null
  discount_type: CouponType
  discount_value: number
  min_purchase_amount: number
  max_discount_amount: number | null
  usage_limit: number | null
  usage_count: number
  per_user_limit: number
  applicable_to: string
  product_ids: string[]
  category_id: number | null
  starts_at: string
  expires_at: string | null
  is_active: boolean
  created_at: string
}

export function calculateDiscount(
  coupon: Coupon,
  subtotal: number
): number {
  if (subtotal < coupon.min_purchase_amount) return 0

  let discount = 0

  if (coupon.discount_type === 'percentage') {
    discount = (subtotal * coupon.discount_value) / 100
  } else {
    discount = coupon.discount_value
  }

  // Apply max discount cap
  if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
    discount = coupon.max_discount_amount
  }

  // Don't exceed subtotal
  if (discount > subtotal) {
    discount = subtotal
  }

  return Math.round(discount * 100) / 100
}

export function generateCouponCode(prefix: string = 'NOVA'): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = prefix + '-'
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function formatCouponValue(coupon: Coupon): string {
  if (coupon.discount_type === 'percentage') {
    return `${coupon.discount_value}% OFF`
  }
  return `$${coupon.discount_value} OFF`
}

export function isCouponExpired(coupon: Coupon): boolean {
  if (!coupon.expires_at) return false
  return new Date(coupon.expires_at) < new Date()
}

export function getCouponStatus(coupon: Coupon): 'active' | 'expired' | 'used_up' | 'inactive' {
  if (!coupon.is_active) return 'inactive'
  if (isCouponExpired(coupon)) return 'expired'
  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
    return 'used_up'
  }
  return 'active'
}
