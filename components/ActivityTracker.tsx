'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ActivityTracker() {
  useEffect(() => {
    const trackLogin = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        // Track login once per session
        const sessionKey = `login_tracked_${user.id}`
        const alreadyTracked = sessionStorage.getItem(sessionKey)

        if (!alreadyTracked) {
          await fetch('/api/activity/login', { method: 'POST' })
          sessionStorage.setItem(sessionKey, 'true')
        }
      } catch (err) {
        console.error('Activity track error:', err)
      }
    }

    trackTrack()
    
    function trackTrack() {
      trackLogin()
    }
  }, [])

  return null
}
