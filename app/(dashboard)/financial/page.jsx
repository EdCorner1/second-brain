'use client'

import { useState, useEffect } from 'react'


export default function FinancialTracker() {
  const [financial, setFinancial] = useState({
    total: 6000,
    expenses: 0,
    clients: [
      { id: '1', name: 'Pingo AI', monthly: 900, status: 'active', rate: '$900 base + views bonuses' },
      { id: '2', name: 'Naive.app', monthly: 1200, status: 'active', rate: '$1,200/month ($40/video)' },
      { id: '3', name: 'Airalo', monthly: 600, status: 'active', rate: '$600/month (2 videos)' },
      { id: '4', name: 'Next Clip', monthly: 300, status: 'active', rate: '$300/month (12 videos)' },
      { id: '5', name: 'Limber', monthly: 1000, status: 'active', rate: '$200 trial → $1K retainer' },
      { id: '6', name: 'Detris', monthly: 1000, status: 'pending', rate: '$1,000/month (pending close)' },
      { id: '7', name: 'Clawbite', monthly: 1000, status: 'pending', rate: '$1,000/month (pending close)' }
    ]
  })
  const [newClient, setNewClient] = useState({ name: '', monthly: 0, status: 'pending', rate: '' })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('financial') || '{}')
    if (Object.keys(saved).length) setFinancial({ ...financial, ...saved })
  }, [])

  const addClient = () => {
    if (!newClient.name.trim()) return
    const updated = {
      ...financial,
      clients: [...financial.clients, { ...newClient, id: Date.now().toString(), status: newClient.status | 'pending' | 'paused' }],
      total: newClient.status === 'active' ? financial.total + newClient.monthly : financial.total
    }
    setFinancial(updated)
    localStorage.setItem('financial', JSON.stringify(updated))
    setNewClient({ name: '', monthly: 0, status: 'pending', rate: '' })
  }

  const removeClient = (id: string) => {
    const client = financial.clients.find(c => c.id === id)
    if (!client) return
    const updated = {
      ...financial,
      clients: financial.clients.filter(c => c.id !== id),
      total: client.status === 'active' ? financial.total - client.monthly : financial.total
    }
    setFinancial(updated)
    localStorage.setItem('financial', JSON.stringify(updated))
  }

  const updateStatus = (id: string, status: 'active' | 'pending' | 'paused') => {
    const client = financial.clients.find(c => c.id === id)
    if (!client) return
    
    let newTotal = financial.total
    if (client.status === 'active' && status !== 'active') newTotal -= client.monthly
    if (client.status !== 'active' && status === 'active') newTotal += client.monthly
    
    const updated = {
      ...financial,
      clients: financial.clients.map(c => c.id === id ? { ...c, status } : c),
      total: newTotal
    }
    setFinancial(updated)
    localStorage.setItem('financial', JSON.stringify(updated))
  }

  const gap = Math.max(0, 10000 - financial.total)
  const activeTotal = financial.clients.filter(c => c.status === 'active').reduce((sum, c) => sum + c.monthly, 0)
  const pendingTotal = financial.clients.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.monthly, 0)

  return (
    <div>
      <h1>💰 Financial Tracker</h1>

      <div className="grid">
        <div className="stat-box">
          <div className="stat-label">Active Monthly</div>
          <div className="stat-value">${activeTotal.toLocaleString()}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Pending Close</div>
          <div className="stat-value" style={{ color: '#f39c12' }}>${pendingTotal.toLocaleString()}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total (w/ Pending)</div>
          <div className="stat-value">${financial.total.toLocaleString()}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">To $10K Goal</div>
          <div className="stat-value" style={{ color: gap === 0 ? 'var(--accent)' : '#ff9800' }}>
            ${gap.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h3>Progress to $10K Goal</h3>
        <div style={{ height: '24px', background: 'var(--bg-dark)', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, (financial.total / 10000) * 100)}%`,
              background: 'var(--accent)',
              transition: 'width 0.3s'
            }}
          />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          ${financial.total.toLocaleString()} / $10,000 ({Math.round((financial.total / 10000) * 100)}%)
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
            placeholder="Monthly amount"
            value={newClient.monthly || ''}
            onChange={(e) => setNewClient({ ...newClient, monthly: parseInt(e.target.value) || 0 })}
          />
          <input
            type="text"
            placeholder="Rate details (e.g., $X/video)"
            value={newClient.rate}
            onChange={(e) => setNewClient({ ...newClient, rate: e.target.value })}
            style={{ gridColumn: '1 / -1' }}
          />
          <select
            value={newClient.status}
            onChange={(e) => setNewClient({ ...newClient, status: e.target.value | 'pending' | 'paused' })}
            style={{ gridColumn: '1 / -1' }}
          >
            <option value="active">Active</option>
            <option value="pending">Pending Close</option>
            <option value="paused">Paused</option>
          </select>
          <button onClick={addClient} style={{ gridColumn: '1 / -1' }}>Add Client</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h3>Active Clients ({financial.clients.filter(c => c.status === 'active').length})</h3>
        <div style={{ marginTop: '16px' }}>
          {financial.clients.filter(c => c.status === 'active').map((client) => (
            <div key={client.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              borderBottom: '1px solid var(--border)',
              fontSize: '14px'
            }}>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '2px' }}>{client.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{client.rate}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--accent)', fontWeight: '600' }}>${client.monthly}/mo</div>
                <button
                  onClick={() => updateStatus(client.id, 'paused')}
                  style={{ background: '#e74c3c', color: 'white', padding: '3px 6px', fontSize: '10px', marginTop: '4px' }}
                >
                  Pause
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {financial.clients.filter(c => c.status === 'pending').length > 0 && (
        <div className="card" style={{ marginTop: '30px' }}>
          <h3>Pending Close ({financial.clients.filter(c => c.status === 'pending').length})</h3>
          <div style={{ marginTop: '16px' }}>
            {financial.clients.filter(c => c.status === 'pending').map((client) => (
              <div key={client.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderBottom: '1px solid var(--border)',
                fontSize: '14px'
              }}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '2px' }}>{client.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{client.rate}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#f39c12', fontWeight: '600' }}>${client.monthly}/mo</div>
                  <button
                    onClick={() => updateStatus(client.id, 'active')}
                    style={{ background: '#27ae60', color: 'white', padding: '3px 6px', fontSize: '10px', marginTop: '4px' }}
                  >
                    Activate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
