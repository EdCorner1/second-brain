'use client'

import { useState, useEffect } from 'react'

interface HealthLog {
  id: number
  date: string
  sleep: number
  workouts: number
  energy: 1 | 2 | 3 | 4 | 5
  mood: 1 | 2 | 3 | 4 | 5
  notes: string
}

export default function HealthFitness() {
  const [logs, setLogs] = useState<HealthLog[]>([])
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    sleep: 8,
    workouts: 0,
    energy: 3 as const,
    mood: 3 as const,
    notes: ''
  })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('health') || '[]')
    setLogs(saved)
  }, [])

  const addLog = () => {
    const updated = [...logs, { ...newLog, id: Date.now() }]
    setLogs(updated)
    localStorage.setItem('health', JSON.stringify(updated))
    setNewLog({
      date: new Date().toISOString().split('T')[0],
      sleep: 8,
      workouts: 0,
      energy: 3,
      mood: 3,
      notes: ''
    })
  }

  const deleteLog = (id: number) => {
    const updated = logs.filter(l => l.id !== id)
    setLogs(updated)
    localStorage.setItem('health', JSON.stringify(updated))
  }

  const avgSleep = logs.length > 0 ? (logs.reduce((sum, l) => sum + l.sleep, 0) / logs.length).toFixed(1) : '0'
  const totalWorkouts = logs.reduce((sum, l) => sum + l.workouts, 0)
  const avgEnergy = logs.length > 0 ? (logs.reduce((sum, l) => sum + l.energy, 0) / logs.length).toFixed(1) : '0'

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div>
      <h1>💪 Health & Fitness</h1>

      <div className="card">
        <h3>Log Today</h3>
        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr', marginTop: '16px' }}>
          <div>
            <label>Date</label>
            <input
              type="date"
              value={newLog.date}
              onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
            />
          </div>
          <div>
            <label>Sleep Hours</label>
            <input
              type="number"
              min="0"
              max="12"
              value={newLog.sleep}
              onChange={(e) => setNewLog({ ...newLog, sleep: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label>Workouts</label>
            <input
              type="number"
              min="0"
              max="5"
              value={newLog.workouts}
              onChange={(e) => setNewLog({ ...newLog, workouts: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label>Energy Level</label>
            <select
              value={newLog.energy}
              onChange={(e) => setNewLog({ ...newLog, energy: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
            >
              <option value="1">Low (1)</option>
              <option value="2">Below Average (2)</option>
              <option value="3">Average (3)</option>
              <option value="4">Good (4)</option>
              <option value="5">Excellent (5)</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / 2' }}>
            <label>Mood</label>
            <select
              value={newLog.mood}
              onChange={(e) => setNewLog({ ...newLog, mood: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
            >
              <option value="1">Bad (1)</option>
              <option value="2">Below Average (2)</option>
              <option value="3">Neutral (3)</option>
              <option value="4">Good (4)</option>
              <option value="5">Excellent (5)</option>
            </select>
          </div>

          <textarea
            placeholder="Notes (how you felt, what you did, etc.)"
            value={newLog.notes}
            onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
            rows={2}
            style={{ gridColumn: '1 / -1' }}
          />

          <button onClick={addLog} style={{ gridColumn: '1 / -1' }}>Log Health Data</button>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Health Stats</h2>
        <div className="grid">
          <div className="stat-box">
            <div className="stat-label">Average Sleep</div>
            <div className="stat-value">{avgSleep}h</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Total Workouts</div>
            <div className="stat-value">{totalWorkouts}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Average Energy</div>
            <div className="stat-value" style={{ fontSize: '20px' }}>{renderStars(Math.round(parseFloat(avgEnergy)))}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Recent Logs</h2>
        {sortedLogs.length === 0 ? (
          <div className="card">
            <p style={{ color: 'var(--text-secondary)' }}>No logs yet. Start tracking above!</p>
          </div>
        ) : (
          sortedLogs.map(log => (
            <div key={log.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3>{new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '20px 30px', marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <div>😴 Sleep: {log.sleep}h</div>
                    <div>🏋️ Workouts: {log.workouts}</div>
                    <div>⚡ Energy: {renderStars(log.energy)}</div>
                    <div>😊 Mood: {renderStars(log.mood)}</div>
                  </div>
                </div>
                <button onClick={() => deleteLog(log.id)} style={{ background: '#e74c3c', color: 'white', padding: '6px 12px' }}>Delete</button>
              </div>
              {log.notes && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{log.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
