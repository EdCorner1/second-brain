'use client'

import { useEffect, useState } from 'react'



export default function Emails() {
  const [config, setConfig] = useState(null)
  const [emails, setEmails] = useState([])
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [isLoadingEmails, setIsLoadingEmails] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [draftReply, setDraftReply] = useState('')
  const [isComposing, setIsComposing] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    appPassword: '',
    imapServer: 'imap.hostinger.com',
    imapPort: 993,
    smtpServer: 'smtp.hostinger.com',
    smtpPort: 587
  })

  useEffect(() => {
    const saved = localStorage.getItem('email-config')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setConfig(parsed)
        setFormData(parsed)
      } catch (e) {
        console.error('Failed to load email config')
      }
    }
  }, [])

  const saveConfig = () => {
    if (!formData.email || !formData.appPassword) {
      alert('Please fill in email and password')
      return
    }
    const newConfig = {
      email: formData.email,
      appPassword: formData.appPassword,
      imapServer: formData.imapServer,
      imapPort: formData.imapPort,
      smtpServer: formData.smtpServer,
      smtpPort: formData.smtpPort
    }
    setConfig(newConfig)
    localStorage.setItem('email-config', JSON.stringify(newConfig))
    setIsSettingsOpen(false)
    alert('Email settings saved! Now fetch your emails.')
  }

  const fetchEmails = async () => {
    if (!config) {
      alert('Please configure email settings first')
      setIsSettingsOpen(true)
      return
    }

    setIsLoadingEmails(true)
    try {
      const response = await fetch('/.netlify/functions/email-sync', {
        method: 'POST',
        body: JSON.stringify({
          action: 'fetch',
          config: config
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch emails')
      }

      setEmails(data.emails || [])
      alert(`✓ Fetched ${data.emails?.length || 0} emails from ${config.email}`)
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoadingEmails(false)
    }
  }

  const sendReply = async () => {
    if (!selectedEmail || !draftReply.trim() || !config) {
      alert('Please type a reply')
      return
    }

    try {
      const response = await fetch('/.netlify/functions/email-sync', {
        method: 'POST',
        body: JSON.stringify({
          action: 'send',
          config: config,
          to: selectedEmail.from,
          subject: 'Re: ' + selectedEmail.subject,
          body: draftReply
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email')
      }

      alert('✓ Reply sent to ' + selectedEmail.from)
      setDraftReply('')
      setIsComposing(false)
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const markRead = (id: string) => {
    setEmails(emails.map(e => e.id === id ? { ...e, read: true } : e))
  }

  return (
    <div>
      <h1>📧 Emails</h1>

      {!config ? (
        <div className="card">
          <h3>Connect Your Email</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Set up your Hostinger email to receive and reply to messages directly from your dashboard.
          </p>
          <button onClick={() => setIsSettingsOpen(true)} style={{ width: '100%' }}>
            Configure Email Settings
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Connected to: <strong>{config.email}</strong>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={fetchEmails} disabled={isLoadingEmails}>
                {isLoadingEmails ? '⟳ Fetching...' : '🔄 Refresh'}
              </button>
              <button onClick={() => setIsSettingsOpen(true)} style={{ background: '#3498db' }}>
                ⚙️ Settings
              </button>
            </div>
          </div>

          {emails.length === 0 ? (
            <div className="card">
              <p style={{ color: 'var(--text-secondary)' }}>
                No emails yet. Click refresh to fetch your inbox.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
              {/* Email List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {emails.map(email => (
                  <div
                    key={email.id}
                    onClick={() => {
                      setSelectedEmail(email)
                      if (!email.read) markRead(email.id)
                    }}
                    style={{
                      padding: '12px',
                      background: email.read ? 'var(--bg-card)' : 'var(--bg-dark)',
                      border: selectedEmail?.id === email.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontWeight: email.read ? '400' : '600'
                    }}
                  >
                    <div style={{ fontSize: '12px', color: email.read ? 'var(--text-secondary)' : 'var(--accent)', marginBottom: '4px' }}>
                      {email.from}
                    </div>
                    <div style={{ fontSize: '13px', marginBottom: '4px' }}>{email.subject}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {new Date(email.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Email Detail */}
              {selectedEmail && (
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ marginBottom: '4px' }}>{selectedEmail.subject}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                        From: {selectedEmail.from}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {new Date(selectedEmail.date).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedEmail(null)}
                      style={{ background: 'var(--bg-dark)', color: 'var(--text-secondary)', padding: '6px 12px', border: '1px solid var(--border)' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{
                    background: 'var(--bg-dark)',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    minHeight: '120px',
                    whiteSpace: 'pre-wrap',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    lineHeight: '1.6'
                  }}>
                    {selectedEmail.body || selectedEmail.preview}
                  </div>

                  {!isComposing ? (
                    <button
                      onClick={() => setIsComposing(true)}
                      style={{ width: '100%' }}
                    >
                      ✎ Reply
                    </button>
                  ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      <textarea
                        placeholder="Type your reply..."
                        value={draftReply}
                        onChange={(e) => setDraftReply(e.target.value)}
                        rows={6}
                        style={{ width: '100%' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={sendReply} style={{ flex: 1 }}>Send</button>
                        <button
                          onClick={() => {
                            setIsComposing(false)
                            setDraftReply('')
                          }}
                          style={{ flex: 1, background: '#999' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Email Settings</h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                style={{ background: 'var(--bg-dark)', color: 'var(--text-secondary)', padding: '4px 8px', border: 'none' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="your@hostinger.email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label>App Password</label>
                <input
                  type="password"
                  placeholder="Generate in Hostinger settings"
                  value={formData.appPassword}
                  onChange={(e) => setFormData({ ...formData, appPassword: e.target.value })}
                />
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Create an app-specific password in your Hostinger email settings for security.
                </p>
              </div>

              <hr style={{ borderColor: 'var(--border)', margin: '8px 0' }} />

              <div>
                <label>IMAP Server</label>
                <input
                  type="text"
                  value={formData.imapServer}
                  onChange={(e) => setFormData({ ...formData, imapServer: e.target.value })}
                />
              </div>

              <div>
                <label>IMAP Port</label>
                <input
                  type="number"
                  value={formData.imapPort}
                  onChange={(e) => setFormData({ ...formData, imapPort: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label>SMTP Server</label>
                <input
                  type="text"
                  value={formData.smtpServer}
                  onChange={(e) => setFormData({ ...formData, smtpServer: e.target.value })}
                />
              </div>

              <div>
                <label>SMTP Port</label>
                <input
                  type="number"
                  value={formData.smtpPort}
                  onChange={(e) => setFormData({ ...formData, smtpPort: parseInt(e.target.value) })}
                />
              </div>

              <div style={{ background: 'rgba(204, 255, 0, 0.1)', padding: '12px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <strong>Default Hostinger settings:</strong><br/>
                IMAP: imap.hostinger.com:993<br/>
                SMTP: smtp.hostinger.com:587
              </div>

              <button onClick={saveConfig} style={{ width: '100%' }}>Save Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
