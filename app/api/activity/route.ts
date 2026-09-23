import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { action, entity_type, entity_id, metadata } = body

    if (!action) {
      return NextResponse.json({ error: 'Action required' }, { status: 400 })
    }

    // Get IP + User Agent
    const headers = request.headers
    const ip_address = 
      headers.get('x-forwarded-for')?.split(',')[0] ||
      headers.get('x-real-ip') ||
      'unknown'
    const user_agent = headers.get('user-agent') || 'unknown'

    // Log activity
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action,
        entity_type: entity_type || null,
        entity_id: entity_id || null,
        metadata: metadata || {},
        ip_address,
        user_agent,
      })

    if (error) throw error

    // Update last_active_at
    await supabase
      .from('profiles')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', user.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Activity log error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
