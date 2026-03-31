'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import "./globals.css"
import Sidebar from "@/components/Sidebar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthed, setIsAuthed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if on auth page
    if (pathname === '/auth') {
      setIsLoading(false)
      return
    }

    // Check for auth token
    const token = localStorage.getItem('auth-token')
    if (token) {
      setIsAuthed(true)
      setIsLoading(false)
    } else {
      router.push('/auth')
    }
  }, [pathname, router])

  if (pathname === '/auth') {
    return (
      <html lang="en">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
          <title>Second Brain - Login</title>
        </head>
        <body>{children}</body>
      </html>
    )
  }

  if (isLoading) {
    return (
      <html lang="en">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <body style={{ background: '#0f0f0f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: "'Space Grotesk', sans-serif" }}>
          Loading...
        </body>
      </html>
    )
  }

  if (!isAuthed) {
    return null
  }

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <title>Ed's Second Brain</title>
      </head>
      <body>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
