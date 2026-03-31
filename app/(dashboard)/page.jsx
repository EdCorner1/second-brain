'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    goals: 0, 
    clients: 0,
    income: 0,
    contentScheduled: 0,
    workouts: 0,
    ideas: 0
  })

  useEffect(() => {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]')
    const clients = JSON.parse(localStorage.getItem('clients-full') || '[]')
    const financial = JSON.parse(localStorage.getItem('financial') || '{}')
    const calendar = JSON.parse(localStorage.getItem('content-calendar') || '[]')
    const health = JSON.parse(localStorage.getItem('health') || '[]')
    const ideas = JSON.parse(localStorage.getItem('ideas') || '[]')

    const totalWorkouts = health.reduce((sum: number, log: any) => sum + log.workouts, 0)

    setStats({
      goals: goals.length,
      clients: clients.length,
      income: financial.total || 0,
      contentScheduled: calendar.filter((c: any) => c.status !== 'published').length,
      workouts: totalWorkouts,
      ideas: ideas.length
    })
  }, [])

  const gap = Math.max(0, 10000 - stats.income)
  const progress = Math.round((stats.income / 10000) * 100)

  return (
    <div>
      <h1>🎯 Dashboard</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Your mission control hub — quick overview of everything</p>

      {/* Income Goal */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '16px' }}>💰 $10K/Month Goal</h2>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Progress</span>
            <span style={{ color: 'var(--accent)', fontWeight: '600' }}>${stats.income.toLocaleString()} / $10,000</span>
          </div>
          <div style={{ height: '24px', background: 'var(--bg-dark)', borderRadius: '12px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, progress)}%`,
                background: 'var(--accent)',
                transition: 'width 0.3s'
              }}
            />
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            {progress}% complete • ${gap.toLocaleString()} to go
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid">
        <div className="stat-box">
          <div className="stat-label">Active Goals</div>
          <div className="stat-value">{stats.goals}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Clients</div>
          <div className="stat-value">{stats.clients}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Content Planned</div>
          <div className="stat-value">{stats.contentScheduled}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total Workouts</div>
          <div className="stat-value">{stats.workouts}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Ideas</div>
          <div className="stat-value">{stats.ideas}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Monthly Income</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>${(stats.income / 1000).toFixed(1)}K</div>
        </div>
      </div>

      {/* Action Cards */}
      <div style={{ marginTop: '40px' }}>
        <h2>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '16px' }}>
          <Link href="/goals">
            <div className="card" style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '100px', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎯</div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>Add Goal</div>
            </div>
          </Link>

          <Link href="/clients">
            <div className="card" style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '100px', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>👥</div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>View Clients</div>
            </div>
          </Link>

          <Link href="/financial">
            <div className="card" style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '100px', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>💰</div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>Check Income</div>
            </div>
          </Link>

          <Link href="/content-calendar">
            <div className="card" style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '100px', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📅</div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>Schedule</div>
            </div>
          </Link>

          <Link href="/health">
            <div className="card" style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '100px', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>💪</div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>Log Health</div>
            </div>
          </Link>

          <Link href="/brand">
            <div className="card" style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '100px', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>⭐</div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>Brand</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Info Cards */}
      <div style={{ marginTop: '40px' }}>
        <h2>System Info</h2>
        <div className="card">
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            ✓ All data stored locally in browser<br/>
            ✓ 100% private — nothing syncs to cloud<br/>
            ✓ Persists across sessions<br/>
            <br/>
            <strong style={{ color: 'var(--text-primary)' }}>Version 1.0.0</strong> — built for you, designed by you
          </p>
        </div>
      </div>
    </div>
  )
