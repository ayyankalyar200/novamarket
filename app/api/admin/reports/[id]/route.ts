import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

    // Check admin
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (adminProfile?.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const { action, reason } = await request.json()

    // Get report
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single()

    if (reportError || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    let actionError = null

    // ============================================
    // HIDE PRODUCT (Soft Delete)
    // ============================================
    if (action === "hide_product") {
      if (!report.reported_product_id) {
        return NextResponse.json(
          { error: "No product to hide" },
          { status: 400 }
        )
      }

      console.log("Hiding product:", report.reported_product_id)

      const { error } = await supabase
        .from("products")
        .update({
          is_hidden: true,
          hidden_reason: reason || `Reported: ${report.reason}`,
          hidden_at: new Date().toISOString(),
          hidden_by: user.id,
        })
        .eq("id", report.reported_product_id)

      if (error) {
        console.error("Hide product error:", error)
        actionError = error.message
      } else {
        console.log("✅ Product hidden successfully")
      }
    }

    // ============================================
    // UNHIDE PRODUCT (Restore)
    // ============================================
    if (action === "unhide_product") {
      if (!report.reported_product_id) {
        return NextResponse.json(
          { error: "No product to unhide" },
          { status: 400 }
        )
      }

      const { error } = await supabase
        .from("products")
        .update({
          is_hidden: false,
          hidden_reason: null,
          hidden_at: null,
          hidden_by: null,
        })
        .eq("id", report.reported_product_id)

      if (error) {
        console.error("Unhide product error:", error)
        actionError = error.message
      }
    }

    // ============================================
    // BAN USER
    // ============================================
    if (action === "ban_user") {
      if (!report.reported_user_id) {
        return NextResponse.json(
          { error: "No user to ban" },
          { status: 400 }
        )
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          is_banned: true,
          banned_reason: reason || `Banned due to report: ${report.reason}`,
          banned_at: new Date().toISOString(),
        })
        .eq("id", report.reported_user_id)

      if (error) {
        console.error("Ban user error:", error)
        actionError = error.message
      }
    }

    // ============================================
    // UPDATE REPORT STATUS
    // ============================================
    const newStatus =
      action === "dismiss"
        ? "dismissed"
        : action === "resolve" ||
          action === "hide_product" ||
          action === "ban_user"
        ? "resolved"
        : "reviewed"

    await supabase
      .from("reports")
      .update({
        status: newStatus,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        admin_notes: `Action: ${action}${reason ? ` | ${reason}` : ""}`,
      })
      .eq("id", id)

    if (actionError) {
      return NextResponse.json(
        { error: actionError, partial: true },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, action, status: newStatus })
  } catch (error: any) {
    console.error("Report action error:", error)
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    )
  }
}
