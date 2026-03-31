'use client'

import { useEffect, useState } from 'react'

interface Goal {
  id: number
  title: string
  description: string
  target: string
  progress: number
  category: 'personal' | 'business'
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState({ title: '', description: '', target: '', category: 'personal' as const, progress: 0 })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('goals') || '[]')
    setGoals(saved)
  }, [])

  const saveGoal = () => {
    if (!newGoal.title.trim()) return
    const updated = [...goals, { ...newGoal, id: Date.now() }]
    setGoals(updated)
    localStorage.setItem('goals', JSON.stringify(updated))
    setNewGoal({ title: '', description: '', target: '', category: 'personal', progress: 0 })
  }

  const deleteGoal = (id: number) => {
    const updated = goals.filter(g => g.id !== id)
    setGoals(updated)
    localStorage.setItem('goals', JSON.stringify(updated))
  }

  const updateProgress = (id: number, progress: number) => {
    const updated = goals.map(g => g.id === id ? { ...g, progress } : g)
    setGoals(updated)
    localStorage.setItem('goals', JSON.stringify(updated))
  }

  return (
    <div>
      <h1>🎯 Goals & Habits</h1>

      <div className="card">
        <h3>Add New Goal</h3>
        <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
          <input
            type="text"
            placeholder="Goal title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            rows={3}
          />
          <input
            type="text"
            placeholder="Target (e.g., $10K/month)"
            value={newGoal.target}
            onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
          />
          <select
            value={newGoal.category}
            onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as 'personal' | 'business' })}
          >
            <option value="personal">Personal</option>
            <option value="business">Business</option>
          </select>
          <button onClick={saveGoal}>Save Goal</button>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Your Goals</h2>
        {goals.length === 0 ? (
          <div className="card">
            <p style={{ color: 'var(--text-secondary)' }}>No goals yet. Create one above!</p>
          </div>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: start', marginBottom: '12px' }}>
                <div>
                  <h3>{goal.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>
                    {goal.category === 'business' ? '💼' : '👤'} {goal.category}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>{goal.description}</p>
                  <p style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600' }}>Target: {goal.target}</p>
                </div>
                <button onClick={() => deleteGoal(goal.id)} style={{ background: '#e74c3c', color: 'white', padding: '6px 12px' }}>Delete</button>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px' }}>Progress</span>
                  <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{goal.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
