'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      setIsAuthed(true)
      setIsLoading(false)
    } else {
      router.push('/auth')
    }
  }, [router])

  if (isLoading) {
    return <div style={{ background: '#0f0f0f', minHeight: '100vh' }} />
  }

  if (!isAuthed) {
    return null
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
