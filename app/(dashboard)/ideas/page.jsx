'use client'

import { useState, useEffect } from 'react'


export default function IdeaBank() {
  const [ideas, setIdeas] = useState([])
  const [newIdea, setNewIdea] = useState({ title: '', description: '', category: 'app', status: 'brainstorm' })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('ideas') || '[]')
    setIdeas(saved)
  }, [])

  const addIdea = () => {
    if (!newIdea.title.trim()) return
    const updated = [...ideas, { ...newIdea, id: Date.now() }]
    setIdeas(updated)
    localStorage.setItem('ideas', JSON.stringify(updated))
    setNewIdea({ title: '', description: '', category: 'app', status: 'brainstorm' })
  }

  const deleteIdea = (id: number) => {
    const updated = ideas.filter(i => i.id !== id)
    setIdeas(updated)
    localStorage.setItem('ideas', JSON.stringify(updated))
  }

  const updateStatus = (id: number, status: 'brainstorm' | 'planning' | 'building') => {
    const updated = ideas.map(i => i.id === id ? { ...i, status } : i)
    setIdeas(updated)
    localStorage.setItem('ideas', JSON.stringify(updated))
  }

  return (
    <div>
      <h1>💡 Idea Bank</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Brain dump for apps, businesses, and content ideas</p>

      <div className="card">
        <h3>New Idea</h3>
        <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
          <input
            type="text"
            placeholder="Idea title"
            value={newIdea.title}
            onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
          />
          <textarea
            placeholder="Describe your idea..."
            value={newIdea.description}
            onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
            rows={3}
          />
          <select
            value={newIdea.category}
            onChange={(e) => setNewIdea({ ...newIdea, category: e.target.value | 'business' | 'content' })}
          >
            <option value="app">App</option>
            <option value="business">Business</option>
            <option value="content">Content</option>
          </select>
          <button onClick={addIdea}>Save Idea</button>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Your Ideas</h2>
        {ideas.length === 0 ? (
          <div className="card">
            <p style={{ color: 'var(--text-secondary)' }}>No ideas yet. Start brainstorming!</p>
          </div>
        ) : (
          ideas.map(idea => (
            <div key={idea.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <h3>{idea.title}</h3>
                  <p style={{ fontSize: '12px', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--accent)', textTransform: 'capitalize' }}>
                      {idea.category}
                    </span>
                    {' '} •{' '}
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: idea.status === 'building' ? '#27ae60' : idea.status === 'planning' ? '#f39c12' : '#666',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {idea.status}
                    </span>
                  </p>
                </div>
                <button onClick={() => deleteIdea(idea.id)} style={{ background: '#e74c3c', color: 'white', padding: '6px 12px' }}>Delete</button>
              </div>

              <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', whiteSpace: 'pre-wrap' }}>{idea.description}</p>

              <select
                value={idea.status}
                onChange={(e) => updateStatus(idea.id, e.target.value | 'planning' | 'building')}
                style={{ width: '100%' }}
              >
                <option value="brainstorm">Brainstorm</option>
                <option value="planning">Planning</option>
                <option value="building">Building</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  )
