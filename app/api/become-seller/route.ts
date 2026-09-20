import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getResend, EMAIL_FROM } from "@/lib/email/client"
import { newRequestAdminEmail } from "@/lib/email/templates"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const {
      store_name,
      store_description,
      store_category,
      phone,
      address,
      tax_id,
      terms_accepted,
    } = body

    // Validation
    if (!store_name || store_name.trim().length < 3) {
      return NextResponse.json({ error: "Store name must be at least 3 characters" }, { status: 400 })
    }
    if (!store_description || store_description.trim().length < 20) {
      return NextResponse.json({ error: "Store description must be at least 20 characters" }, { status: 400 })
    }
    if (!store_category) {
      return NextResponse.json({ error: "Please select a store category" }, { status: 400 })
    }
    if (!phone || phone.trim().length < 10) {
      return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 })
    }
    if (!address || address.trim().length < 5) {
      return NextResponse.json({ error: "Please enter a valid address" }, { status: 400 })
    }
    if (!terms_accepted) {
      return NextResponse.json({ error: "You must accept the seller terms" }, { status: 400 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_banned, username")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (profile.is_banned) {
      return NextResponse.json({ error: "Your account has been banned" }, { status: 403 })
    }

    if (profile.role === "seller" || profile.role === "admin") {
      return NextResponse.json({ error: "You are already a seller" }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from("seller_requests")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: "You already have a pending seller request" }, { status: 400 })
    }

    const { data: newRequest, error: insertError } = await supabase
      .from("seller_requests")
      .insert({
        user_id: user.id,
        store_name: store_name.trim(),
        store_description: store_description.trim(),
        store_category,
        phone: phone.trim(),
        address: address.trim(),
        tax_id: tax_id?.trim() || null,
        status: "pending",
      })
      .select()
      .single()

    if (insertError || !newRequest) {
      console.error("Insert error:", insertError)
      return NextResponse.json(
        { error: "Database error: " + (insertError?.message || "Unknown") },
        { status: 500 }
      )
    }

    // Send admin notification (optional)
    try {
      const resend = getResend()
      if (resend) {
        const { data: admins } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "admin")

        if (admins && admins.length > 0) {
          const adminEmails: string[] = []
          for (const admin of admins) {
            const { data: { user: adminUser } } = await supabase.auth.admin.getUserById(admin.id)
            if (adminUser?.email) adminEmails.push(adminUser.email)
          }

          if (adminEmails.length > 0) {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
            const { subject, html } = newRequestAdminEmail({
              username: profile.username || "User",
              userEmail: user.email || "",
              storeName: store_name,
              storeCategory: store_category,
              phone: phone,
              address: address,
              adminUrl: `${siteUrl}/admin/requests`,
            })

            await resend.emails.send({
              from: EMAIL_FROM,
              to: adminEmails,
              subject,
              html,
            })
            console.log(`✅ Admin notification sent to ${adminEmails.length} admins`)
          }
        }
      } else {
        console.log("📧 Email skipped (RESEND_API_KEY not set)")
      }
    } catch (emailError) {
      console.error("Email failed (non-blocking):", emailError)
    }

    return NextResponse.json({
      success: true,
      message: "Your seller request has been submitted.",
      request_id: newRequest.id,
    })
  } catch (error: any) {
    console.error("Seller request error:", error)
    return NextResponse.json(
      { error: "Server error: " + (error.message || "Unknown") },
      { status: 500 }
    )
  }
}
