import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { seller_id, product_id } = await request.json()

    if (!seller_id) {
      return NextResponse.json({ error: "Seller required" }, { status: 400 })
    }

    if (seller_id === user.id) {
      return NextResponse.json(
        { error: "Cannot message yourself" },
        { status: 400 }
      )
    }

    // Check if conversation exists
    let query = supabase
      .from("conversations")
      .select("id")
      .eq("buyer_id", user.id)
      .eq("seller_id", seller_id)

    if (product_id) {
      query = query.eq("product_id", product_id)
    } else {
      query = query.is("product_id", null)
    }

    const { data: existing } = await query.maybeSingle()

    if (existing) {
      return NextResponse.json({ conversation_id: existing.id })
    }

    // Create new conversation
    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({
        buyer_id: user.id,
        seller_id,
        product_id: product_id || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ conversation_id: conversation.id })
  } catch (error: any) {
    console.error("Conversation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
