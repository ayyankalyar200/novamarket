import { NextResponse } from 'next/server'

export async function verifyRecaptcha(token: string): Promise<{
  success: boolean
  score?: number
  error?: string
}> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    console.warn('⚠️ RECAPTCHA_SECRET_KEY not set - skipping verification')
    return { success: true }
  }

  if (!token) {
    return { success: false, error: 'No reCAPTCHA token provided' }
  }

  try {
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    )

    const data = await response.json()

    // Score threshold (0.5 = moderate, higher = stricter)
    const scoreThreshold = 0.5

    if (!data.success) {
      return { success: false, error: 'reCAPTCHA verification failed' }
    }

    if (data.score < scoreThreshold) {
      return {
        success: false,
        score: data.score,
        error: 'Suspicious activity detected',
      }
    }

    return { success: true, score: data.score }
  } catch (error: any) {
    console.error('reCAPTCHA verification error:', error)
    return { success: false, error: 'reCAPTCHA verification error' }
  }
}
