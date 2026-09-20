import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { product_id } = await request.json()

    if (!product_id) {
      return NextResponse.json({ error: "Missing product_id" }, { status: 400 })
    }

    // Check if already in wishlist
    const { data: existing } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product_id)
      .single()

    if (existing) {
      // Remove from wishlist
      await supabase
        .from("wishlists")
        .delete()
        .eq("id", existing.id)

      return NextResponse.json({ in_wishlist: false, action: "removed" })
    } else {
      // Add to wishlist
      const { error } = await supabase
        .from("wishlists")
        .insert({
          user_id: user.id,
          product_id,
        })

      if (error) throw error

      return NextResponse.json({ in_wishlist: true, action: "added" })
    }
  } catch (error: any) {
    console.error("Wishlist error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ items: [] })
    }

    const { data } = await supabase
      .from("wishlists")
      .select("product_id")
      .eq("user_id", user.id)

    return NextResponse.json({
      items: data?.map((w) => w.product_id) || [],
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
