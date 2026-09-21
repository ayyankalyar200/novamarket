'use client'

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useCallback } from 'react'

export function useRecaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const getToken = useCallback(
    async (action: string = 'submit'): Promise<string | null> => {
      if (!executeRecaptcha) {
        console.warn('⚠️ reCAPTCHA not ready')
        return null
      }

      try {
        const token = await executeRecaptcha(action)
        return token
      } catch (err) {
        console.error('reCAPTCHA error:', err)
        return null
      }
    },
    [executeRecaptcha]
  )

  return { getToken, isReady: !!executeRecaptcha }
}
