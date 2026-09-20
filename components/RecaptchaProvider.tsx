'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { ReactNode } from 'react'

export default function RecaptchaProvider({ children }: { children: ReactNode }) {
  // next.config.ts ke 'env' block se value milegi
  const siteKey = process.env.RECAPTCHA_SITE_KEY

  if (!siteKey) {
    console.warn('⚠️ RECAPTCHA_SITE_KEY not set - reCAPTCHA disabled')
    return <>{children}</>
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
