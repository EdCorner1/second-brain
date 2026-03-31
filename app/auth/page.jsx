'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Auth() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('auth-token')
    if (token) {
      router.push('/')
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Verify password (you can change this)
    const correctPassword = 'EdCorner$2026!SecondBrain' // Strong password - change to your preference

    if (password === correctPassword) {
      localStorage.setItem('auth-token', 'authenticated')
      router.push('/')
    } else {
      setError('Invalid password')
      setPassword('')
    }

    setIsLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Space Grotesk', sans-serif"
    }}>
      <div style={{
        background: '#2a2a2a',
        border: '1px solid #333333',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '28px',
          marginBottom: '8px',
          color: '#ffffff'
        }}>
          🧠 Second Brain
        </h1>
        <p style={{
          color: '#888888',
          marginBottom: '30px',
          fontSize: '14px'
        }}>
          Mission Control
        </p>

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '12px',
              color: '#888888',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#1a1a1a',
                border: '1px solid #333333',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: "'Space Grotesk', sans-serif",
                boxSizing: 'border-box'
              }}
              autoFocus
            />
          </div>

          {error && (
            <div style={{
              background: '#e74c3c',
              color: 'white',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: '#CCFF00',
              color: '#0f0f0f',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontFamily: "'Space Grotesk', sans-serif",
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            {isLoading ? 'Authenticating...' : 'Unlock Dashboard'}
          </button>
        </form>

        <p style={{
          fontSize: '11px',
          color: '#666666',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          Private dashboard. Password protected.
        </p>
      </div>
    </div>
  )
}
