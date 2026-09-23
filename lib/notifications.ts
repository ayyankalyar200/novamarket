import { createClient } from '@/lib/supabase/server'

type NotificationType = 
  | 'order_placed' 
  | 'order_paid' 
  | 'order_shipped' 
  | 'order_delivered'
  | 'message_received' 
  | 'review_posted' 
  | 'seller_approved' 
  | 'seller_rejected'
  | 'product_hidden' 
  | 'user_banned' 
  | 'price_dropped' 
  | 'back_in_stock'
  | 'new_follower' 
  | 'admin_announcement' 
  | 'report_resolved'

type CreateNotificationParams = {
  userId: string
  type: NotificationType
  title: string
  message?: string
  link?: string
  metadata?: Record<string, any>
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        message: params.message || null,
        link: params.link || null,
        metadata: params.metadata || {},
      })

    if (error) {
      console.error('Notification create error:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Notification error:', err)
    return false
  }
}

// ============================================
// PRE-BUILT NOTIFICATION TEMPLATES
// ============================================

export async function notifyOrderPlaced(
  sellerId: string,
  orderId: string,
  total: number
) {
  return createNotification({
    userId: sellerId,
    type: 'order_placed',
    title: '🎉 New Order Received!',
    message: `You have a new order worth $${total.toFixed(2)}`,
    link: `/dashboard/seller/orders`,
    metadata: { order_id: orderId, total },
  })
}

export async function notifyOrderPaid(
  sellerId: string,
  orderId: string,
  total: number
) {
  return createNotification({
    userId: sellerId,
    type: 'order_paid',
    title: '💰 Payment Received',
    message: `Payment of $${total.toFixed(2)} confirmed`,
    link: `/dashboard/seller/orders`,
    metadata: { order_id: orderId, total },
  })
}

export async function notifyMessageReceived(
  recipientId: string,
  senderName: string,
  conversationId: string,
  preview: string
) {
  return createNotification({
    userId: recipientId,
    type: 'message_received',
    title: `💬 New message from ${senderName}`,
    message: preview.slice(0, 100),
    link: `/messages/${conversationId}`,
    metadata: { conversation_id: conversationId },
  })
}

export async function notifySellerApproved(userId: string) {
  return createNotification({
    userId,
    type: 'seller_approved',
    title: '🎉 Seller Application Approved!',
    message: 'Congratulations! You can now start selling on NovaMarket.',
    link: `/dashboard/seller`,
  })
}

export async function notifySellerRejected(userId: string, reason?: string) {
  return createNotification({
    userId,
    type: 'seller_rejected',
    title: 'Seller Application Update',
    message: reason || 'Your application was not approved at this time.',
    link: `/become-seller`,
  })
}

export async function notifyReviewPosted(
  sellerId: string,
  productTitle: string,
  rating: number,
  productId: string
) {
  return createNotification({
    userId: sellerId,
    type: 'review_posted',
    title: `⭐ New ${rating}-star review`,
    message: `Review posted on "${productTitle}"`,
    link: `/product/${productId}`,
    metadata: { rating, product_id: productId },
  })
}

export async function notifyProductHidden(
  sellerId: string,
  productTitle: string,
  reason: string,
  productId: string
) {
  return createNotification({
    userId: sellerId,
    type: 'product_hidden',
    title: '⚠️ Product Hidden',
    message: `Your product "${productTitle}" has been hidden. Reason: ${reason}`,
    link: `/dashboard/seller/products`,
    metadata: { product_id: productId },
  })
}

export async function notifyUserBanned(userId: string, reason: string) {
  return createNotification({
    userId,
    type: 'user_banned',
    title: '🚫 Account Suspended',
    message: reason,
  })
}

export async function notifyPriceDropped(
  userId: string,
  productTitle: string,
  newPrice: number,
  productId: string
) {
  return createNotification({
    userId,
    type: 'price_dropped',
    title: '💸 Price Drop Alert!',
    message: `"${productTitle}" is now $${newPrice.toFixed(2)}`,
    link: `/product/${productId}`,
    metadata: { product_id: productId, new_price: newPrice },
  })
}

export async function notifyAdminAnnouncement(
  userId: string,
  title: string,
  message: string,
  link?: string
) {
  return createNotification({
    userId,
    type: 'admin_announcement',
    title,
    message,
    link,
  })
}
