'use client'

import { useState, useEffect } from 'react'

interface Client {
  id: string
  name: string
  monthlyRate: number
  status: 'active' | 'pending' | 'paused'
  contentPerMonth: number
  videoType: string
  startDate?: string
  endDate?: string
  notes: string
  contact?: string
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Pingo AI',
      monthlyRate: 900,
      status: 'active',
      contentPerMonth: 30,
      videoType: '1 TikTok/day (~30/month)',
      notes: '$30/video. Can batch 10 videos/hour = ~$300/hr effective rate. KEEPER.',
      contact: 'TBD'
    },
    {
      id: '2',
      name: 'Naive.app',
      monthlyRate: 1200,
      status: 'active',
      contentPerMonth: 30,
      videoType: '1 video/day (~30/month)',
      notes: '$40/video. High-value, high-volume. KEEPER.',
      contact: 'TBD'
    },
    {
      id: '3',
      name: 'Airalo',
      monthlyRate: 600,
      status: 'active',
      contentPerMonth: 2,
      videoType: '2 videos/month',
      notes: 'Low time commitment. Keep.',
      contact: 'TBD'
    },
    {
      id: '4',
      name: 'Next Clip',
      monthlyRate: 300,
      status: 'active',
      contentPerMonth: 12,
      videoType: '12 videos/month',
      notes: '',
      contact: 'TBD'
    },
    {
      id: '5',
      name: 'Limber',
      monthlyRate: 1000,
      status: 'active',
      contentPerMonth: 30,
      videoType: '~1 video/day',
      notes: '$200 trial → moving to $1K retainer + bonuses (April 4 onwards)',
      contact: 'TBD'
    },
    {
      id: '6',
      name: 'Detris',
      monthlyRate: 1000,
      status: 'pending',
      contentPerMonth: 30,
      videoType: '1 video/day',
      notes: 'Pending close. Will scope 1 video/day for TikTok, YT Shorts, Insta (repurposed). LinkedIn content strategy added.',
      contact: 'TBD'
    },
    {
      id: '7',
      name: 'Clawbite',
      monthlyRate: 1000,
      status: 'pending',
      contentPerMonth: 30,
      videoType: '1 video/day',
      notes: 'Pending close. Separate brand accounts (TikTok, Insta). Using Ed personal LinkedIn as case study.',
      contact: 'TBD'
    }
  ])
  const [newClient, setNewClient] = useState({
    name: '',
    monthlyRate: 0,
    status: 'pending' as const,
    contentPerMonth: 0,
    videoType: '',
    notes: '',
    contact: ''
  })
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('clients-full') || '[]')
    if (saved.length) setClients(saved)
  }, [])

  const addClient = () => {
    if (!newClient.name.trim()) return
    const updated = [...clients, { ...newClient, id: Date.now().toString(), status: newClient.status as 'active' | 'pending' | 'paused' }]
    setClients(updated)
    localStorage.setItem('clients-full', JSON.stringify(updated))
    setNewClient({ name: '', monthlyRate: 0, status: 'pending', contentPerMonth: 0, videoType: '', notes: '', contact: '' })
  }

  const updateClient = (id: string, updates: Partial<Client>) => {
    const updated = clients.map(c => c.id === id ? { ...c, ...updates } : c)
    setClients(updated)
    localStorage.setItem('clients-full', JSON.stringify(updated))
  }

  const deleteClient = (id: string) => {
    const updated = clients.filter(c => c.id !== id)
    setClients(updated)
    localStorage.setItem('clients-full', JSON.stringify(updated))
  }

  const activeClients = clients.filter(c => c.status === 'active')
  const pendingClients = clients.filter(c => c.status === 'pending')
  const pausedClients = clients.filter(c => c.status === 'paused')

  const statusColor = (status: string) => ({
    active: '#27ae60',
    pending: '#f39c12',
    paused: '#999'
  }[status] || '#666')

  return (
    <div>
      <h1>👥 Clients & Workflow</h1>

      <div className="grid">
        <div className="stat-box">
          <div className="stat-label">Active</div>
          <div className="stat-value">{activeClients.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Pending</div>
          <div className="stat-value" style={{ color: '#f39c12' }}>{pendingClients.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total Content</div>
          <div className="stat-value">{clients.reduce((sum, c) => sum + c.contentPerMonth, 0)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total Value</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>
            ${clients.filter(c => c.status === 'active').reduce((sum, c) => sum + c.monthlyRate, 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h3>Add New Client</h3>
        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr', marginTop: '16px' }}>
          <input
            type="text"
            placeholder="Client name"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Monthly rate"
            value={newClient.monthlyRate || ''}
            onChange={(e) => setNewClient({ ...newClient, monthlyRate: parseInt(e.target.value) || 0 })}
          />
          <input
            type="text"
            placeholder="Video type (e.g., 1 TikTok/day)"
            value={newClient.videoType}
            onChange={(e) => setNewClient({ ...newClient, videoType: e.target.value })}
          />
          <input
            type="number"
            placeholder="Content per month"
            value={newClient.contentPerMonth || ''}
            onChange={(e) => setNewClient({ ...newClient, contentPerMonth: parseInt(e.target.value) || 0 })}
          />
          <select
            value={newClient.status}
            onChange={(e) => setNewClient({ ...newClient, status: e.target.value as 'active' | 'pending' | 'paused' })}
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="paused">Paused</option>
          </select>
          <input
            type="text"
            placeholder="Contact email/handle"
            value={newClient.contact}
            onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
          />
          <textarea
            placeholder="Notes"
            value={newClient.notes}
            onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
            rows={2}
            style={{ gridColumn: '1 / -1' }}
          />
          <button onClick={addClient} style={{ gridColumn: '1 / -1' }}>Add Client</button>
        </div>
      </div>

      {activeClients.length > 0 && (
        <div className="card" style={{ marginTop: '30px' }}>
          <h3>Active Clients ({activeClients.length})</h3>
          <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
            {activeClients.map(client => (
              <div key={client.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <div
                  onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}
                  style={{
                    padding: '12px',
                    background: 'var(--bg-dark)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{client.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {client.videoType} • ${client.monthlyRate}/mo
                    </div>
                  </div>
                  <div style={{ color: 'var(--accent)', fontWeight: '600' }}>
                    {expandedId === client.id ? '−' : '+'}
                  </div>
                </div>

                {expandedId === client.id && (
                  <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '12px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      <p><strong>Rate:</strong> ${client.monthlyRate}/month</p>
                      <p><strong>Content:</strong> {client.contentPerMonth}/month</p>
                      <p><strong>Type:</strong> {client.videoType}</p>
                      {client.contact && <p><strong>Contact:</strong> {client.contact}</p>}
                      {client.notes && <p><strong>Notes:</strong> {client.notes}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => updateClient(client.id, { status: 'paused' })}
                        style={{ background: '#e74c3c', color: 'white', padding: '6px 12px', flex: 1, fontSize: '12px' }}
                      >
                        Pause
                      </button>
                      <button
                        onClick={() => deleteClient(client.id)}
                        style={{ background: '#8b0000', color: 'white', padding: '6px 12px', flex: 1, fontSize: '12px' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingClients.length > 0 && (
        <div className="card" style={{ marginTop: '30px' }}>
          <h3>Pending Close ({pendingClients.length})</h3>
          <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
            {pendingClients.map(client => (
              <div key={client.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <div
                  onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}
                  style={{
                    padding: '12px',
                    background: 'rgba(243, 156, 18, 0.1)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{client.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {client.videoType} • ${client.monthlyRate}/mo
                    </div>
                  </div>
                  <div style={{ color: '#f39c12', fontWeight: '600' }}>
                    {expandedId === client.id ? '−' : '+'}
                  </div>
                </div>

                {expandedId === client.id && (
                  <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '12px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      <p><strong>Rate:</strong> ${client.monthlyRate}/month</p>
                      <p><strong>Content:</strong> {client.contentPerMonth}/month</p>
                      <p><strong>Type:</strong> {client.videoType}</p>
                      {client.contact && <p><strong>Contact:</strong> {client.contact}</p>}
                      {client.notes && <p><strong>Notes:</strong> {client.notes}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => updateClient(client.id, { status: 'active' })}
                        style={{ background: '#27ae60', color: 'white', padding: '6px 12px', flex: 1, fontSize: '12px' }}
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => deleteClient(client.id)}
                        style={{ background: '#8b0000', color: 'white', padding: '6px 12px', flex: 1, fontSize: '12px' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
