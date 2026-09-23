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

    console.log('Send message:', { conversation_id, content, user: user.id })

    if (!conversation_id) {
      return NextResponse.json(
        { error: 'Conversation ID required' },
        { status: 400 }
      )
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Message content required' },
        { status: 400 }
      )
    }

    // Verify conversation exists and user is part of it
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, buyer_id, seller_id')
      .eq('id', conversation_id)
      .single()

    if (convError) {
      console.error('Conversation fetch error:', convError)
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Check authorization
    const isBuyer = conversation.buyer_id === user.id
    const isSeller = conversation.seller_id === user.id

    if (!isBuyer && !isSeller) {
      return NextResponse.json(
        { error: 'Not authorized to send in this conversation' },
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
      console.error('Message insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to send: ' + insertError.message },
        { status: 500 }
      )
    }

    // Update conversation last message
    const updateField = isBuyer ? 'seller_unread_count' : 'buyer_unread_count'

    await supabase
      .from('conversations')
      .update({
        last_message_at: new Date().toISOString(),
        last_message_preview: content.trim().slice(0, 100),
        [updateField]: 1,
      })
      .eq('id', conversation_id)

    // Reset sender's unread count
    const resetField = isBuyer ? 'buyer_unread_count' : 'seller_unread_count'
    await supabase
      .from('conversations')
      .update({ [resetField]: 0 })
      .eq('id', conversation_id)

    return NextResponse.json({
      success: true,
      message,
    })
  } catch (error: any) {
    console.error('Send message exception:', error)
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}
