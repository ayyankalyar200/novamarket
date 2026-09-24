import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { items } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    const sellerIds = [...new Set(items.map((i: any) => i.seller_id))] as string[]
    const { data: sellers } = await supabase
      .from("profiles")
      .select("id, stripe_account_id, username")
      .in("id", sellerIds)

    if (!sellers || sellers.length === 0) {
      return NextResponse.json({ error: "Sellers not found" }, { status: 404 })
    }

    const sellersWithoutStripe = sellers.filter((s) => !s.stripe_account_id)
    if (sellersWithoutStripe.length > 0) {
      return NextResponse.json(
        { error: `Seller not connected to Stripe: ${sellersWithoutStripe.map((s) => s.username).join(", ")}` },
        { status: 400 }
      )
    }

    const primarySeller = sellers[0]

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const totalAmount = items.reduce(
      (sum: number, i: any) => sum + i.price * i.quantity,
      0
    )

    // ⚡ COMMISSION REMOVED — 100% to seller during FREE period
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      customer_email: user.email,
      // ⚡ NO application_fee_amount — seller gets 100%
      payment_intent_data: {
        transfer_data: {
          destination: primarySeller.stripe_account_id!,
        },
      },
      metadata: {
        user_id: user.id,
        seller_id: primarySeller.id,
        items: JSON.stringify(
          items.map((i: any) => ({
            product_id: i.id,
            quantity: i.quantity,
            price: i.price,
          }))
        ),
      },
    })

    const { data: order } = await supabase
      .from("orders")
      .insert({
        buyer_id: user.id,
        total: totalAmount,
        status: "pending",
        stripe_session_id: session.id,
        payment_status: "pending",
        return_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (order) {
      for (const item of items) {
        await supabase.from("order_items").insert({
          order_id: order.id,
          product_id: item.id,
          seller_id: item.seller_id,
          quantity: item.quantity,
          price: item.price,
        })
      }
    }

    return NextResponse.json({ url: session.url, order_id: order?.id })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

