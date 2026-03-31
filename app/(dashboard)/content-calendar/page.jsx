'use client'

import { useState, useEffect } from 'react'


export default function ContentCalendar() {
  const [content, setContent] = useState([])
  const [newContent, setNewContent] = useState({
    title: '',
    platform: 'tiktok',
    status: 'planned',
    dueDate: '',
    client: '',
    notes: ''
  })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('content-calendar') || '[]')
    setContent(saved)
  }, [])

  const addContent = () => {
    if (!newContent.title.trim() || !newContent.dueDate) return
    const updated = [...content, { ...newContent, id: Date.now() }]
    setContent(updated)
    localStorage.setItem('content-calendar', JSON.stringify(updated))
    setNewContent({ title: '', platform: 'tiktok', status: 'planned', dueDate: '', client: '', notes: '' })
  }

  const updateStatus = (id: number, status: ContentItem['status']) => {
    const updated = content.map(c => c.id === id ? { ...c, status } : c)
    setContent(updated)
    localStorage.setItem('content-calendar', JSON.stringify(updated))
  }

  const deleteContent = (id: number) => {
    const updated = content.filter(c => c.id !== id)
    setContent(updated)
    localStorage.setItem('content-calendar', JSON.stringify(updated))
  }

  const platformIcons: { [key: string]: string } = {
    tiktok: '🎵',
    youtube: '🎬',
    instagram: '📸',
    twitter: '𝕏',
    linkedin: '💼'
  }

  const statusColors: { [key: string]: string } = {
    planned: '#666',
    filming: '#f39c12',
    editing: '#3498db',
    scheduled: '#9b59b6',
    published: '#27ae60'
  }

  const sortedContent = [...content].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  return (
    <div>
      <h1>📅 Content Calendar</h1>

      <div className="card">
        <h3>Schedule New Content</h3>
        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr', marginTop: '16px' }}>
          <input
            type="text"
            placeholder="Content title"
            value={newContent.title}
            onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
          />
          <select
            value={newContent.platform}
            onChange={(e) => setNewContent({ ...newContent, platform: e.target.value as ContentItem['platform'] })}
          >
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter/X</option>
            <option value="linkedin">LinkedIn</option>
          </select>

          <input
            type="text"
            placeholder="Client"
            value={newContent.client}
            onChange={(e) => setNewContent({ ...newContent, client: e.target.value })}
          />
          <input
            type="date"
            value={newContent.dueDate}
            onChange={(e) => setNewContent({ ...newContent, dueDate: e.target.value })}
          />

          <select
            value={newContent.status}
            onChange={(e) => setNewContent({ ...newContent, status: e.target.value as ContentItem['status'] })}
            style={{ gridColumn: '1 / -1' }}
          >
            <option value="planned">Planned</option>
            <option value="filming">Filming</option>
            <option value="editing">Editing</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>

          <textarea
            placeholder="Notes"
            value={newContent.notes}
            onChange={(e) => setNewContent({ ...newContent, notes: e.target.value })}
            rows={2}
            style={{ gridColumn: '1 / -1' }}
          />
          <button onClick={addContent} style={{ gridColumn: '1 / -1' }}>Add to Calendar</button>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Upcoming Content</h2>
        {sortedContent.length === 0 ? (
          <div className="card">
            <p style={{ color: 'var(--text-secondary)' }}>No content scheduled. Add one above!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {sortedContent.map(item => (
              <div key={item.id} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{platformIcons[item.platform]}</span>
                    <h3 style={{ margin: 0 }}>{item.title}</h3>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {item.client} • Due: {new Date(item.dueDate).toLocaleDateString()}
                  </p>
                  {item.notes && <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.notes}</p>}
                  
                  <div style={{ marginTop: '12px' }}>
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value as ContentItem['status'])}
                      style={{
                        padding: '6px 8px',
                        background: statusColors[item.status],
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}
                    >
                      <option value="planned">Planned</option>
                      <option value="filming">Filming</option>
                      <option value="editing">Editing</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <button onClick={() => deleteContent(item.id)} style={{ background: '#e74c3c', color: 'white', padding: '6px 12px', height: 'fit-content' }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h3>Content Stats</h3>
        <div className="grid">
          <div className="stat-box">
            <div className="stat-label">Total Planned</div>
            <div className="stat-value">{content.length}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Published</div>
            <div className="stat-value">{content.filter(c => c.status === 'published').length}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{content.filter(c => ['filming', 'editing', 'scheduled'].includes(c.status)).length}</div>
          </div>
        </div>
      </div>
    </div>
  )
