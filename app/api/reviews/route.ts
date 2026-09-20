import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { product_id, rating, comment } = await request.json()

    if (!product_id || !rating) {
      return NextResponse.json(
        { error: "Missing product_id or rating" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    // Check if user has purchased this product
    const { data: purchased } = await supabase
      .from("order_items")
      .select(`
        id,
        orders!inner (buyer_id, status)
      `)
      .eq("product_id", product_id)
      .eq("orders.buyer_id", user.id)
      .in("orders.status", ["paid", "shipped", "delivered"])
      .limit(1)

    if (!purchased || purchased.length === 0) {
      return NextResponse.json(
        { error: "You must purchase this product to review it" },
        { status: 403 }
      )
    }

    // Check if user already reviewed
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("product_id", product_id)
      .eq("buyer_id", user.id)
      .single()

    if (existing) {
      // Update existing review
      const { data, error } = await supabase
        .from("reviews")
        .update({ rating, comment })
        .eq("id", existing.id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ review: data, action: "updated" })
    } else {
      // Create new review
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          product_id,
          buyer_id: user.id,
          rating,
          comment,
        })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ review: data, action: "created" })
    }
  } catch (error: any) {
    console.error("Review error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
