import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { conversation_id, content } = await request.json()

    if (!conversation_id || !content?.trim()) {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      )
    }

    // Verify user is part of conversation
    const { data: conversation } = await supabase
      .from("conversations")
      .select("buyer_id, seller_id")
      .eq("id", conversation_id)
      .single()

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    if (
      conversation.buyer_id !== user.id &&
      conversation.seller_id !== user.id
    ) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Create message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id,
        sender_id: user.id,
        content: content.trim(),
      })
      .select()
      .single()

    if (error) throw error

    // Reset unread count for sender
    const updateField =
      conversation.buyer_id === user.id
        ? "buyer_unread_count"
        : "seller_unread_count"

    await supabase
      .from("conversations")
      .update({ [updateField]: 0 })
      .eq("id", conversation_id)

    return NextResponse.json({ success: true, message })
  } catch (error: any) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
