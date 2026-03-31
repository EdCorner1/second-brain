'use client'

import { useState, useEffect } from 'react'


export default function WeeklyReview() {
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({
    week: `Week of ${new Date().toLocaleDateString()}`,
    date: new Date().toISOString().split('T')[0],
    videosPublished: 0,
    incomeEarned: 0,
    goalsCompleted: 0,
    highlights: '',
    blockers: '',
    nextWeek: ''
  })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('weekly-reviews') || '[]')
    setReviews(saved)
  }, [])

  const addReview = () => {
    if (!newReview.date) return
    const updated = [...reviews, { ...newReview, id: Date.now() }]
    setReviews(updated)
    localStorage.setItem('weekly-reviews', JSON.stringify(updated))
    setNewReview({
      week: `Week of ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString().split('T')[0],
      videosPublished: 0,
      incomeEarned: 0,
      goalsCompleted: 0,
      highlights: '',
      blockers: '',
      nextWeek: ''
    })
  }

  const deleteReview = (id: number) => {
    const updated = reviews.filter(r => r.id !== id)
    setReviews(updated)
    localStorage.setItem('weekly-reviews', JSON.stringify(updated))
  }

  const sortedReviews = [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const totalVideos = reviews.reduce((sum, r) => sum + r.videosPublished, 0)
  const totalIncome = reviews.reduce((sum, r) => sum + r.incomeEarned, 0)
  const avgVideosPerWeek = reviews.length > 0 ? Math.round(totalVideos / reviews.length) : 0

  return (
    <div>
      <h1>📊 Weekly Review & Progress</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Track weekly wins, blockers, and plan next week</p>

      {/* Stats */}
      <div className="grid">
        <div className="stat-box">
          <div className="stat-label">Total Videos</div>
          <div className="stat-value">{totalVideos}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Avg per Week</div>
          <div className="stat-value">{avgVideosPerWeek}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total Income</div>
          <div className="stat-value">${totalIncome.toLocaleString()}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Reviews</div>
          <div className="stat-value">{reviews.length}</div>
        </div>
      </div>

      {/* New Review */}
      <div className="card" style={{ marginTop: '30px' }}>
        <h3>Weekly Review</h3>
        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr', marginTop: '16px' }}>
          <div>
            <label>Week</label>
            <input
              type="text"
              placeholder="e.g., Week of March 31"
              value={newReview.week}
              onChange={(e) => setNewReview({ ...newReview, week: e.target.value })}
            />
          </div>
          <div>
            <label>Date</label>
            <input
              type="date"
              value={newReview.date}
              onChange={(e) => setNewReview({ ...newReview, date: e.target.value })}
            />
          </div>

          <div>
            <label>Videos Published</label>
            <input
              type="number"
              min="0"
              value={newReview.videosPublished}
              onChange={(e) => setNewReview({ ...newReview, videosPublished: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label>Income Earned</label>
            <input
              type="number"
              min="0"
              value={newReview.incomeEarned}
              onChange={(e) => setNewReview({ ...newReview, incomeEarned: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label>Goals Completed</label>
            <input
              type="number"
              min="0"
              value={newReview.goalsCompleted}
              onChange={(e) => setNewReview({ ...newReview, goalsCompleted: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div></div>

          <textarea
            placeholder="Highlights & wins this week"
            value={newReview.highlights}
            onChange={(e) => setNewReview({ ...newReview, highlights: e.target.value })}
            rows={2}
            style={{ gridColumn: '1 / -1' }}
          />

          <textarea
            placeholder="Blockers & challenges"
            value={newReview.blockers}
            onChange={(e) => setNewReview({ ...newReview, blockers: e.target.value })}
            rows={2}
            style={{ gridColumn: '1 / -1' }}
          />

          <textarea
            placeholder="Focus for next week"
            value={newReview.nextWeek}
            onChange={(e) => setNewReview({ ...newReview, nextWeek: e.target.value })}
            rows={2}
            style={{ gridColumn: '1 / -1' }}
          />

          <button onClick={addReview} style={{ gridColumn: '1 / -1' }}>Save Weekly Review</button>
        </div>
      </div>

      {/* Reviews */}
      <div style={{ marginTop: '30px' }}>
        <h2>Past Reviews</h2>
        {sortedReviews.length === 0 ? (
          <div className="card">
            <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Complete your first week review above!</p>
          </div>
        ) : (
          sortedReviews.map(review => (
            <div key={review.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3>{review.week}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {new Date(review.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <button onClick={() => deleteReview(review.id)} style={{ background: '#e74c3c', color: 'white', padding: '6px 12px' }}>Delete</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px', padding: '12px', background: 'var(--bg-dark)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Videos</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)' }}>{review.videosPublished}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Income</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)' }}>${review.incomeEarned}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Goals</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)' }}>{review.goalsCompleted}</div>
                </div>
              </div>

              {review.highlights && (
                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ marginBottom: '8px', color: '#27ae60' }}>✨ Highlights</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{review.highlights}</p>
                </div>
              )}

              {review.blockers && (
                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ marginBottom: '8px', color: '#e74c3c' }}>🚧 Blockers</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{review.blockers}</p>
                </div>
              )}

              {review.nextWeek && (
                <div>
                  <h4 style={{ marginBottom: '8px', color: 'var(--accent)' }}>🎯 Next Week</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{review.nextWeek}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
