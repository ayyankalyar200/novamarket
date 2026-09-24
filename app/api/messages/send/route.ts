import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { conversation_id, content } = body

    console.log('📨 Sending message:', { conversation_id, content })

    if (!conversation_id || !content?.trim()) {
      return NextResponse.json(
        { error: 'Conversation ID and content required' },
        { status: 400 }
      )
    }

    // Verify conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, buyer_id, seller_id')
      .eq('id', conversation_id)
      .single()

    if (convError || !conversation) {
      console.error('Conversation not found:', convError)
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    const isBuyer = conversation.buyer_id === user.id
    const isSeller = conversation.seller_id === user.id

    if (!isBuyer && !isSeller) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    // Insert message
    const { data: message, error: insertError } = await supabase
      .from('messages')
      .insert({
        conversation_id,
        sender_id: user.id,
        content: content.trim(),
        is_read: false,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed: ' + insertError.message },
        { status: 500 }
      )
    }

    console.log('✅ Message inserted:', message.id)

    // Update conversation
    const updateField = isBuyer ? 'seller_unread_count' : 'buyer_unread_count'
    const resetField = isBuyer ? 'buyer_unread_count' : 'seller_unread_count'

    await supabase
      .from('conversations')
      .update({
        last_message_at: new Date().toISOString(),
        last_message_preview: content.trim().slice(0, 100),
        [updateField]: 1,
        [resetField]: 0,
      })
      .eq('id', conversation_id)

    // Notify recipient
    const recipientId = isBuyer ? conversation.seller_id : conversation.buyer_id
    try {
      const { createNotification } = await import('@/lib/notifications')
      const { data: senderProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      await createNotification({
        userId: recipientId,
        type: 'message_received',
        title: `💬 New message from ${senderProfile?.username || 'User'}`,
        message: content.trim().slice(0, 100),
        link: `/messages/${conversation_id}`,
        metadata: { conversation_id },
      })
    } catch (notifyErr) {
      console.error('Notification failed:', notifyErr)
    }

    return NextResponse.json({ success: true, message })
  } catch (error: any) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}
