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

    const { action, role: newRole, reason } = await request.json()

    // Get target user
    const { data: targetProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single()

    if (!targetProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Can't modify yourself in certain actions
    if (id === user.id && (action === "ban" || action === "change_role")) {
      return NextResponse.json(
        { error: "You cannot perform this action on yourself" },
        { status: 400 }
      )
    }

    // ============================================
    // BAN USER
    // ============================================
    if (action === "ban") {
      // Can't ban other admins
      if (targetProfile.role === "admin") {
        return NextResponse.json(
          { error: "Cannot ban another admin. Remove admin access first." },
          { status: 400 }
        )
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          is_banned: true,
          banned_reason: reason || "Violation of terms",
          banned_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error

      return NextResponse.json({ success: true, action: "banned" })
    }

    // ============================================
    // UNBAN USER
    // ============================================
    if (action === "unban") {
      const { error } = await supabase
        .from("profiles")
        .update({
          is_banned: false,
          banned_reason: null,
          banned_at: null,
        })
        .eq("id", id)

      if (error) throw error

      return NextResponse.json({ success: true, action: "unbanned" })
    }

    // ============================================
    // CHANGE ROLE
    // ============================================
    if (action === "change_role") {
      if (!newRole || !["buyer", "seller", "admin"].includes(newRole)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 })
      }

      // Check: agar last admin ko change kar rahe hain
      if (targetProfile.role === "admin" && newRole !== "admin") {
        const { count: adminCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "admin")

        if (adminCount && adminCount <= 1) {
          return NextResponse.json(
            { error: "Cannot remove the last admin. Promote another user to admin first." },
            { status: 400 }
          )
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", id)

      if (error) throw error

      return NextResponse.json({
        success: true,
        action: "role_changed",
        new_role: newRole,
      })
    }

    // ============================================
    // REMOVE ADMIN (demote to buyer/seller)
    // ============================================
    if (action === "remove_admin") {
      if (targetProfile.role !== "admin") {
        return NextResponse.json(
          { error: "User is not an admin" },
          { status: 400 }
        )
      }

      // Check last admin
      const { count: adminCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin")

      if (adminCount && adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot remove last admin. Promote another user first." },
          { status: 400 }
        )
      }

      const demoteTo = newRole || "buyer"

      const { error } = await supabase
        .from("profiles")
        .update({ role: demoteTo })
        .eq("id", id)

      if (error) throw error

      return NextResponse.json({
        success: true,
        action: "admin_removed",
        new_role: demoteTo,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("User action error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
