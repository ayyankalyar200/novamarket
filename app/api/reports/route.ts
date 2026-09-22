import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Please login to submit a report" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { reported_user_id, reported_product_id, reason, description } = body

    if (!reason) {
      return NextResponse.json(
        { error: "Please select a reason" },
        { status: 400 }
      )
    }

    if (!reported_user_id && !reported_product_id) {
      return NextResponse.json(
        { error: "Nothing to report" },
        { status: 400 }
      )
    }

    // Prevent self-reporting
    if (reported_user_id === user.id) {
      return NextResponse.json(
        { error: "You cannot report yourself" },
        { status: 400 }
      )
    }

    // Check if user already reported
    const { data: existing } = await supabase
      .from("reports")
      .select("id")
      .eq("reporter_id", user.id)
      .eq("status", "pending")
      .or(
        reported_product_id
          ? `reported_product_id.eq.${reported_product_id}`
          : `reported_user_id.eq.${reported_user_id}`
      )
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: "You already have a pending report for this" },
        { status: 400 }
      )
    }

    // Create report
    const { data: report, error } = await supabase
      .from("reports")
      .insert({
        reporter_id: user.id,
        reported_user_id: reported_user_id || null,
        reported_product_id: reported_product_id || null,
        reason,
        description: description?.trim() || null,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      report_id: report.id,
      message: "Thank you! Our team will review your report.",
    })
  } catch (error: any) {
    console.error("Report error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to submit report" },
      { status: 500 }
    )
  }
}
