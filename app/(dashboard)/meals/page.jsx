'use client'

import { useState, useEffect } from 'react'


export default function MealPlanning() {
  const [meals, setMeals] = useState([])
  const [newMeal, setNewMeal] = useState({ name: '', prep: '', servings: 1, ingredients: '' })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('meals') || '[]')
    setMeals(saved)
  }, [])

  const addMeal = () => {
    if (!newMeal.name.trim()) return
    const updated = [...meals, { ...newMeal, id: Date.now() }]
    setMeals(updated)
    localStorage.setItem('meals', JSON.stringify(updated))
    setNewMeal({ name: '', prep: '', servings: 1, ingredients: '' })
  }

  const deleteMeal = (id: number) => {
    const updated = meals.filter(m => m.id !== id)
    setMeals(updated)
    localStorage.setItem('meals', JSON.stringify(updated))
  }

  return (
    <div>
      <h1>🍽️ Meal Planning & Prep</h1>

      <div className="card">
        <h3>Add Meal</h3>
        <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
          <input
            type="text"
            placeholder="Meal name"
            value={newMeal.name}
            onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
          />
          <textarea
            placeholder="Prep instructions"
            value={newMeal.prep}
            onChange={(e) => setNewMeal({ ...newMeal, prep: e.target.value })}
            rows={3}
          />
          <textarea
            placeholder="Ingredients"
            value={newMeal.ingredients}
            onChange={(e) => setNewMeal({ ...newMeal, ingredients: e.target.value })}
            rows={3}
          />
          <input
            type="number"
            placeholder="Servings"
            min="1"
            value={newMeal.servings}
            onChange={(e) => setNewMeal({ ...newMeal, servings: parseInt(e.target.value) || 1 })}
          />
          <button onClick={addMeal}>Add Meal</button>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Your Meals</h2>
        {meals.length === 0 ? (
          <div className="card">
            <p style={{ color: 'var(--text-secondary)' }}>No meals planned. Add one above!</p>
          </div>
        ) : (
          meals.map(meal => (
            <div key={meal.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3>{meal.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Servings: {meal.servings}</p>
                </div>
                <button onClick={() => deleteMeal(meal.id)} style={{ background: '#e74c3c', color: 'white', padding: '6px 12px' }}>Delete</button>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ marginBottom: '8px' }}>Ingredients</h4>
                <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontSize: '14px' }}>{meal.ingredients}</p>
              </div>

              <div>
                <h4 style={{ marginBottom: '8px' }}>Prep Instructions</h4>
                <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontSize: '14px' }}>{meal.prep}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
