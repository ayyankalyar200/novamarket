import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe/server"

export async function POST(request: Request) {
  try {
    const { session_id } = await request.json()

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
    }

    console.log("Confirming session:", session_id)

    // Fetch session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id)

    console.log("Stripe payment status:", session.payment_status)

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed", status: session.payment_status },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update order status
    const { data: order, error } = await supabase
      .from("orders")
      .update({
        status: "paid",
        payment_status: "paid",
      })
      .eq("stripe_session_id", session_id)
      .select()
      .single()

    if (error) {
      console.error("Order update error:", error)
      return NextResponse.json(
        { error: error.message, details: error.details, hint: error.hint },
        { status: 500 }
      )
    }

    if (!order) {
      console.error("No order found with session_id:", session_id)
      return NextResponse.json(
        { error: "Order not found with this session ID" },
        { status: 404 }
      )
    }

    console.log("Order confirmed:", order.id)

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error("Confirm error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
