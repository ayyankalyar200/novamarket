import { NextResponse } from 'next/server'
import { verifyRecaptcha } from '@/lib/recaptcha'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 400 }
      )
    }

    const result = await verifyRecaptcha(token)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Verification failed', score: result.score },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      score: result.score,
    })
  } catch (error: any) {
    console.error('reCAPTCHA verify error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
