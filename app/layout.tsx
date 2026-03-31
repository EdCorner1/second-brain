import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import AuthWrapper from '@/components/AuthWrapper'

export const metadata: Metadata = {
  title: "Ed's Second Brain",
  description: 'Personal mission control dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthWrapper>
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
        </AuthWrapper>
      </body>
    </html>
  )
}
