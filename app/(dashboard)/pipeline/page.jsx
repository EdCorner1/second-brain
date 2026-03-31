'use client'

import { useState, useEffect } from 'react'


export default function ContentPipeline() {
  const [pipeline, setPipeline] = useState([])
  const [newItem, setNewItem] = useState({
    title: '',
    client: 'Pingo AI',
    stage: 'research',
    dueDate: '',
    batchSize: 1,
    notes: ''
  })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('pipeline') || '[]')
    setPipeline(saved)
  }, [])

  const addItem = () => {
    if (!newItem.title.trim() || !newItem.dueDate) return
    const updated = [...pipeline, { ...newItem, id: Date.now() }]
    setPipeline(updated)
    localStorage.setItem('pipeline', JSON.stringify(updated))
    setNewItem({ title: '', client: 'Pingo AI', stage: 'research', dueDate: '', batchSize: 1, notes: '' })
  }

  const moveStage = (id: number, direction: 'forward' | 'back') => {
    const stages: PipelineItem['stage'][] = ['research', 'scripted', 'filming', 'editing', 'ready', 'uploaded']
    const updated = pipeline.map(item => {
      if (item.id !== id) return item
      const currentIdx = stages.indexOf(item.stage)
      if (direction === 'forward' && currentIdx < stages.length - 1) {
        return { ...item, stage: stages[currentIdx + 1] }
      }
      if (direction === 'back' && currentIdx > 0) {
        return { ...item, stage: stages[currentIdx - 1] }
      }
      return item
    })
    setPipeline(updated)
    localStorage.setItem('pipeline', JSON.stringify(updated))
  }

  const deleteItem = (id: number) => {
    const updated = pipeline.filter(p => p.id !== id)
    setPipeline(updated)
    localStorage.setItem('pipeline', JSON.stringify(updated))
  }

  const stageColors: { [key: string]: string } = {
    research: '#666',
    scripted: '#3498db',
    filming: '#f39c12',
    editing: '#9b59b6',
    ready: '#27ae60',
    uploaded: '#95a5a6'
  }

  const stageLabels: { [key: string]: string } = {
    research: '🔍 Research',
    scripted: '📝 Scripted',
    filming: '🎬 Filming',
    editing: '✂️ Editing',
    ready: '✅ Ready',
    uploaded: '⬆️ Uploaded'
  }

  const stages = ['research', 'scripted', 'filming', 'editing', 'ready', 'uploaded']
  const stageCounts = stages.map(stage => pipeline.filter(p => p.stage === stage).length)

  // Sort by due date
  const sortedPipeline = [...pipeline].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  return (
    <div>
      <h1>🎬 Content Pipeline</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Track content from research → upload</p>

      {/* Stats by Stage */}
      <div className="grid">
        {stages.map((stage, idx) => (
          <div key={stage} className="stat-box">
            <div className="stat-label">{stageLabels[stage]}</div>
            <div className="stat-value">{stageCounts[idx]}</div>
          </div>
        ))}
      </div>

      {/* Add New */}
      <div className="card" style={{ marginTop: '30px' }}>
        <h3>Add to Pipeline</h3>
        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr', marginTop: '16px' }}>
          <input
            type="text"
            placeholder="Video title / concept"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          />
          <select
            value={newItem.client}
            onChange={(e) => setNewItem({ ...newItem, client: e.target.value })}
          >
            <option value="Pingo AI">Pingo AI</option>
            <option value="Naive.app">Naive.app</option>
            <option value="Airalo">Airalo</option>
            <option value="Next Clip">Next Clip</option>
            <option value="Limber">Limber</option>
            <option value="Detris">Detris</option>
            <option value="Clawbite">Clawbite</option>
            <option value="Personal">Personal Brand</option>
          </select>

          <input
            type="date"
            value={newItem.dueDate}
            onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
          />
          <input
            type="number"
            placeholder="Batch size (# of videos)"
            min="1"
            value={newItem.batchSize}
            onChange={(e) => setNewItem({ ...newItem, batchSize: parseInt(e.target.value) || 1 })}
          />

          <select
            value={newItem.stage}
            onChange={(e) => setNewItem({ ...newItem, stage: e.target.value as PipelineItem['stage'] })}
            style={{ gridColumn: '1 / -1' }}
          >
            <option value="research">Research</option>
            <option value="scripted">Scripted</option>
            <option value="filming">Filming</option>
            <option value="editing">Editing</option>
            <option value="ready">Ready</option>
            <option value="uploaded">Uploaded</option>
          </select>

          <textarea
            placeholder="Notes (trending concepts, hooks, etc.)"
            value={newItem.notes}
            onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
            rows={2}
            style={{ gridColumn: '1 / -1' }}
          />

          <button onClick={addItem} style={{ gridColumn: '1 / -1' }}>Add to Pipeline</button>
        </div>
      </div>

      {/* Pipeline by Stage */}
      <div style={{ marginTop: '30px' }}>
        <h2>Your Pipeline</h2>
        {sortedPipeline.length === 0 ? (
          <div className="card">
            <p style={{ color: 'var(--text-secondary)' }}>No items in pipeline. Start adding above!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {sortedPipeline.map(item => (
              <div key={item.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '4px' }}>{item.title}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {item.client} • {item.batchSize} video{item.batchSize !== 1 ? 's' : ''} • Due {new Date(item.dueDate).toLocaleDateString()}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      {stages.map((stage, idx) => (
                        <div
                          key={stage}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            background: item.stage === stage ? stageColors[stage] : 'var(--bg-dark)',
                            color: item.stage === stage ? 'white' : 'var(--text-secondary)',
                            fontSize: '11px',
                            fontWeight: item.stage === stage ? '600' : '400',
                            cursor: 'pointer',
                            border: item.stage === stage ? `2px solid ${stageColors[stage]}` : '1px solid var(--border)',
                            transition: 'all 0.2s'
                          }}
                        >
                          {stageLabels[stage]}
                        </div>
                      ))}
                    </div>

                    {item.notes && (
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        <strong>Notes:</strong> {item.notes}
                      </p>
                    )}
                  </div>

                  <button onClick={() => deleteItem(item.id)} style={{ background: '#e74c3c', color: 'white', padding: '6px 12px', height: 'fit-content' }}>
                    Delete
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => moveStage(item.id, 'back')}
                    disabled={item.stage === 'research'}
                    style={{ background: item.stage === 'research' ? '#999' : '#3498db', color: 'white', flex: 1, opacity: item.stage === 'research' ? 0.5 : 1 }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => moveStage(item.id, 'forward')}
                    disabled={item.stage === 'uploaded'}
                    style={{ background: item.stage === 'uploaded' ? '#999' : 'var(--accent)', color: item.stage === 'uploaded' ? 'var(--text-secondary)' : 'var(--bg-dark)', flex: 1, opacity: item.stage === 'uploaded' ? 0.5 : 1 }}
                  >
                    Forward →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="card" style={{ marginTop: '30px' }}>
        <h3>Pipeline Stats</h3>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <p><strong>Total Videos:</strong> {pipeline.reduce((sum, p) => sum + p.batchSize, 0)}</p>
          <p><strong>In Progress:</strong> {pipeline.filter(p => ['research', 'scripted', 'filming', 'editing'].includes(p.stage)).length} batches</p>
          <p><strong>Ready to Upload:</strong> {pipeline.filter(p => p.stage === 'ready').length} batches</p>
          <p><strong>Already Uploaded:</strong> {pipeline.filter(p => p.stage === 'uploaded').length} batches</p>
        </div>
      </div>
    </div>
  )
