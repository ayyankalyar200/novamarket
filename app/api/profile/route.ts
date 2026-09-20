import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { username, full_name, country, avatar_url } = await request.json()

    // Check username uniqueness (if changing)
    if (username) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", user.id)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        )
      }
    }

    const updates: any = {}
    if (username !== undefined) updates.username = username
    if (full_name !== undefined) updates.full_name = full_name
    if (country !== undefined) updates.country = country
    if (avatar_url !== undefined) updates.avatar_url = avatar_url

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ profile: data })
  } catch (error: any) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
