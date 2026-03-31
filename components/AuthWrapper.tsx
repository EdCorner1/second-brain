'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthed, setIsAuthed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Auth page doesn't need checking
    if (pathname === '/auth') {
      setIsLoading(false)
      return
    }

    // Check localStorage for token
    const token = localStorage.getItem('auth-token')
    if (token) {
      setIsAuthed(true)
      setIsLoading(false)
    } else {
      // Not authenticated, redirect to login
      router.push('/auth')
      setIsLoading(false)
    }
  }, [pathname, router])

  // If on auth page, just render
  if (pathname === '/auth') {
    return <>{children}</>
  }

  // Still loading, show nothing
  if (isLoading) {
    return <div style={{ background: '#0f0f0f' }} />
  }

  // Not authenticated, redirect already happened
  if (!isAuthed) {
    return null
  }

  // Authenticated, render children
  return <>{children}</>
}
