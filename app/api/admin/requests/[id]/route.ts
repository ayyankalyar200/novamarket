import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getResend, EMAIL_FROM } from "@/lib/email/client"
import { sellerApprovedEmail, sellerRejectedEmail } from "@/lib/email/templates"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (adminProfile?.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const { action, reason } = await request.json()

    const { data: sellerRequest } = await supabase
      .from("seller_requests")
      .select(`
        *,
        profiles:user_id (id, username)
      `)
      .eq("id", id)
      .single()

    if (!sellerRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    if (sellerRequest.status !== "pending") {
      return NextResponse.json(
        { error: "Request already reviewed" },
        { status: 400 }
      )
    }

    // Get user email
    const { data: { user: targetUser } } = await supabase.auth.admin.getUserById(
      sellerRequest.user_id
    )

    const userEmail = targetUser?.email
    const username = sellerRequest.profiles?.username || "User"
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    // ============================================
    // APPROVE
    // ============================================
    if (action === "approve") {
      await supabase
        .from("seller_requests")
        .update({
          status: "approved",
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id)

      await supabase
        .from("profiles")
        .update({
          role: "seller",
          store_name: sellerRequest.store_name,
          store_description: sellerRequest.store_description,
          store_category: sellerRequest.store_category,
          phone: sellerRequest.phone,
          address: sellerRequest.address,
          tax_id: sellerRequest.tax_id,
          seller_since: new Date().toISOString(),
          seller_terms_accepted: true,
        })
        .eq("id", sellerRequest.user_id)

      // Send approval email (optional)
      try {
        const resend = getResend()
        if (resend && userEmail) {
          const { subject, html } = sellerApprovedEmail({
            username,
            storeName: sellerRequest.store_name,
            dashboardUrl: `${siteUrl}/dashboard/seller`,
          })

          await resend.emails.send({
            from: EMAIL_FROM,
            to: userEmail,
            subject,
            html,
          })
          console.log(`✅ Approval email sent to ${userEmail}`)
        } else {
          console.log(`📧 Approval email skipped (email disabled or no email)`)
        }
      } catch (emailError) {
        console.error("❌ Email send failed (non-blocking):", emailError)
      }

      return NextResponse.json({ success: true, action: "approved" })
    }

    // ============================================
    // REJECT
    // ============================================
    if (action === "reject") {
      await supabase
        .from("seller_requests")
        .update({
          status: "rejected",
          admin_notes: reason || null,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id)

      // Send rejection email (optional)
      try {
        const resend = getResend()
        if (resend && userEmail) {
          const { subject, html } = sellerRejectedEmail({
            username,
            storeName: sellerRequest.store_name,
            reason,
          })

          await resend.emails.send({
            from: EMAIL_FROM,
            to: userEmail,
            subject,
            html,
          })
          console.log(`✅ Rejection email sent to ${userEmail}`)
        } else {
          console.log(`📧 Rejection email skipped`)
        }
      } catch (emailError) {
        console.error("❌ Email send failed (non-blocking):", emailError)
      }

      return NextResponse.json({ success: true, action: "rejected" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Request action error:", error)
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    )
  }
}
