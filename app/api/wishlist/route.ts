import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// ============================================
// GET: Fetch user's wishlist
// ============================================
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ items: [] })
    }

    const { data, error } = await supabase
      .from("wishlists")
      .select("product_id")
      .eq("user_id", user.id)

    if (error) {
      console.error("Wishlist fetch error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      items: data?.map((w) => w.product_id) || [],
    })
  } catch (error: any) {
    console.error("Wishlist GET error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ============================================
// POST: Add/Remove from wishlist (toggle)
// ============================================
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

    console.log("Wishlist toggle:", { user_id: user.id, product_id })

    // Check if already in wishlist
    const { data: existing, error: checkError } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product_id)
      .maybeSingle()

    if (checkError) {
      console.error("Wishlist check error:", checkError)
    }

    if (existing) {
      // Remove from wishlist
      const { error: deleteError } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", existing.id)

      if (deleteError) {
        console.error("Wishlist delete error:", deleteError)
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }

      console.log("✅ Removed from wishlist")
      return NextResponse.json({ in_wishlist: false, action: "removed" })
    } else {
      // Add to wishlist
      const { error: insertError } = await supabase
        .from("wishlists")
        .insert({
          user_id: user.id,
          product_id,
        })

      if (insertError) {
        console.error("Wishlist insert error:", insertError)
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        )
      }

      console.log("✅ Added to wishlist")
      return NextResponse.json({ in_wishlist: true, action: "added" })
    }
  } catch (error: any) {
    console.error("Wishlist POST error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
