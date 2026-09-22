'use client'

import { useTheme } from '@/lib/theme-context'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until mounted (avoids hydration mismatch)
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg border border-gray-200 w-10 h-10"
        aria-label="Toggle theme"
      />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition border border-gray-200 dark:border-gray-700"
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  )
}
