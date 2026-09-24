import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/notifications'
import { getResend, EMAIL_FROM } from '@/lib/email/client'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Verify admin
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (adminProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const {
      title,
      message,
      link,
      target, // 'all' | 'buyers' | 'sellers' | 'admins'
      priority, // 'info' | 'success' | 'warning' | 'promo' | 'urgent'
      send_email, // boolean
    } = await request.json()

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message required' },
        { status: 400 }
      )
    }

    // Get target users
    let query = supabase.from('profiles').select('id, username')

    if (target === 'buyers') {
      query = query.eq('role', 'buyer')
    } else if (target === 'sellers') {
      query = query.eq('role', 'seller')
    } else if (target === 'admins') {
      query = query.eq('role', 'admin')
    }
    // 'all' = no filter

    const { data: users } = await query

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'No users found' }, { status: 404 })
    }

    // Create notifications for all users
    let successCount = 0
    let emailCount = 0
    const errors: string[] = []

    for (const u of users) {
      try {
        await createNotification({
          userId: u.id,
          type: 'admin_announcement',
          title,
          message,
          link: link || undefined,
          metadata: { priority, target },
        })
        successCount++
      } catch (err: any) {
        errors.push(`${u.username}: ${err.message}`)
      }
    }

    // Send emails if requested
    if (send_email) {
      try {
        const resend = getResend()
        if (resend) {
          // Get user emails from auth
          const emails: string[] = []
          for (const u of users) {
            const { data: { user: authUser } } = await supabase.auth.admin.getUserById(u.id)
            if (authUser?.email) emails.push(authUser.email)
          }

          if (emails.length > 0) {
            await resend.emails.send({
              from: EMAIL_FROM,
              to: emails,
              subject: `📢 ${title}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">📢 ${title}</h1>
                  </div>
                  <div style="background: white; border: 1px solid #e5e7eb; border-top: none; padding: 30px; border-radius: 0 0 12px 12px;">
                    <p style="color: #374151; font-size: 16px; line-height: 1.6;">${message}</p>
                    ${link ? `<a href="https://nova-market-09.vercel.app${link}" style="display: inline-block; background: #9333ea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">View Details →</a>` : ''}
                  </div>
                  <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
                    NovaMarket — Buy & Sell Anything
                  </p>
                </div>
              `,
            })
            emailCount = emails.length
          }
        }
      } catch (emailError) {
        console.error('Email failed:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      notifications_sent: successCount,
      emails_sent: emailCount,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error: any) {
    console.error('Announcement error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send announcement' },
      { status: 500 }
    )
  }
}
