import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const headers = request.headers
    const ip_address = 
      headers.get('x-forwarded-for')?.split(',')[0] ||
      headers.get('x-real-ip') ||
      'unknown'

    const { data: profile } = await supabase
      .from('profiles')
      .select('login_count')
      .eq('id', user.id)
      .single()

    await supabase
      .from('profiles')
      .update({
        last_login_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
        login_count: (profile?.login_count || 0) + 1,
        last_login_ip: ip_address,
      })
      .eq('id', user.id)

    await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'login',
        metadata: { source: 'web' },
        ip_address,
        user_agent: headers.get('user-agent') || 'unknown',
      })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Login track error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
