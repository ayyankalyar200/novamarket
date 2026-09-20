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

    // Get seller accounts
    const sellerIds = [...new Set(items.map((i: any) => i.seller_id))] as string[]
    const { data: sellers, error: sellersError } = await supabase
      .from("profiles")
      .select("id, stripe_account_id, username")
      .in("id", sellerIds)

    if (sellersError) {
      console.error("Sellers fetch error:", sellersError)
      return NextResponse.json({ error: sellersError.message }, { status: 500 })
    }

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
    const commissionRate = 0.05

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
    const applicationFee = Math.round(totalAmount * commissionRate * 100)

    // STEP 1: Create order FIRST (before Stripe session)
    console.log("Creating order for user:", user.id)

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        buyer_id: user.id,
        total: totalAmount,
        status: "pending",
        payment_status: "pending",
        shipping_address: {},
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error("Order insert error:", orderError)
      return NextResponse.json(
        { error: `Order creation failed: ${orderError?.message}` },
        { status: 500 }
      )
    }

    console.log("Order created:", order.id)

    // STEP 2: Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      seller_id: item.seller_id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Order items insert error:", itemsError)
      // Rollback
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json(
        { error: `Order items failed: ${itemsError.message}` },
        { status: 500 }
      )
    }

    console.log("Order items created:", orderItems.length)

    // STEP 3: Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      customer_email: user.email,
      payment_intent_data: {
        application_fee_amount: applicationFee,
        transfer_data: {
          destination: primarySeller.stripe_account_id!,
        },
      },
      metadata: {
        user_id: user.id,
        order_id: order.id,
        seller_id: primarySeller.id,
      },
    })

    console.log("Stripe session created:", session.id)

    // STEP 4: Update order with session ID
    const { error: updateError } = await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id)

    if (updateError) {
      console.error("Order update error:", updateError)
    }

    return NextResponse.json({ url: session.url, order_id: order.id })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
