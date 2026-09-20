import { Resend } from 'resend'

let resendClient: Resend | null = null

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY not set - emails disabled')
    return null
  }

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }

  return resendClient
}

export const EMAIL_FROM =
  process.env.EMAIL_FROM || 'NovaMarket <onboarding@resend.dev>'

export const isEmailEnabled = () => !!process.env.RESEND_API_KEY
