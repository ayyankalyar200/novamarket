'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  userId: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function UserStatus({
  userId,
  showText = true,
  size = 'md',
}: Props) {
  const [status, setStatus] = useState<'online' | 'active' | 'offline'>('offline')
  const [lastActive, setLastActive] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const check = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('last_active_at')
        .eq('id', userId)
        .maybeSingle()

      if (!data?.last_active_at) {
        setStatus('offline')
        return
      }

      setLastActive(data.last_active_at)
      const diff = Date.now() - new Date(data.last_active_at).getTime()
      const mins = diff / 60000

      if (mins < 5) {
        setStatus('online')
      } else if (mins < 30) {
        setStatus('active')
      } else {
        setStatus('offline')
      }
    }

    check()
    const interval = setInterval(check, 15000) // Every 15 sec
    return () => clearInterval(interval)
  }, [userId])

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          color: 'bg-green-500',
          text: 'Online',
          textColor: 'text-green-600 dark:text-green-400',
        }
      case 'active':
        return {
          color: 'bg-yellow-500',
          text: 'Active',
          textColor: 'text-yellow-600 dark:text-yellow-400',
        }
      default:
        return {
          color: 'bg-gray-400',
          text: lastActive ? formatLastSeen(lastActive) : 'Offline',
          textColor: 'text-gray-500 dark:text-gray-400',
        }
    }
  }

  const formatLastSeen = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString()
  }

  const config = getStatusConfig()

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={`${dotSizes[size]} ${config.color} rounded-full ${
          status === 'online' ? 'animate-pulse' : ''
        }`}
      />
      {showText && (
        <span className={`${textSizes[size]} ${config.textColor} font-medium`}>
          {config.text}
        </span>
      )}
    </div>
  )
}
