'use client'

import { useState, useEffect } from 'react'


export default function PersonalBrand() {
  const [brand, setBrand] = useState({
    logo: '',
    missionStatement: '',
    colors: { primary: '#CCFF00', secondary: '#1a1a1a', accent: '#0f0f0f' },
    fonts: ['Space Grotesk'],
    websites: { portfolio: '', podcast: '', newsletter: '', youtube: '', twitter: '' }
  })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('brand') || '{}')
    if (Object.keys(saved).length) setBrand({ ...brand, ...saved })
  }, [])

  const saveBrand = () => {
    localStorage.setItem('brand', JSON.stringify(brand))
    alert('Brand assets saved!')
  }

  return (
    <div>
      <h1>👤 Personal Brand</h1>

      <div className="card">
        <h3>Brand Identity</h3>
        <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
          <div>
            <label>Logo URL</label>
            <input
              type="text"
              placeholder="https://..."
              value={brand.logo}
              onChange={(e) => setBrand({ ...brand, logo: e.target.value })}
            />
          </div>
          <div>
            <label>Mission Statement</label>
            <textarea
              placeholder="Your mission..."
              value={brand.missionStatement}
              onChange={(e) => setBrand({ ...brand, missionStatement: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Colors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '16px' }}>
          <div>
            <label>Primary</label>
            <input
              type="color"
              value={brand.colors.primary}
              onChange={(e) => setBrand({ ...brand, colors: { ...brand.colors, primary: e.target.value } })}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{brand.colors.primary}</span>
          </div>
          <div>
            <label>Secondary</label>
            <input
              type="color"
              value={brand.colors.secondary}
              onChange={(e) => setBrand({ ...brand, colors: { ...brand.colors, secondary: e.target.value } })}
            />
          </div>
          <div>
            <label>Accent</label>
            <input
              type="color"
              value={brand.colors.accent}
              onChange={(e) => setBrand({ ...brand, colors: { ...brand.colors, accent: e.target.value } })}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Websites & Links</h3>
        <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
          {Object.entries(brand.websites).map(([key, value]) => (
            <div key={key}>
              <label style={{ textTransform: 'capitalize' }}>{key}</label>
              <input
                type="url"
                placeholder="https://..."
                value={value}
                onChange={(e) => setBrand({ ...brand, websites: { ...brand.websites, [key]: e.target.value } })}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Primary Font</h3>
        <input
          type="text"
          value={brand.fonts[0]}
          onChange={(e) => setBrand({ ...brand, fonts: [e.target.value] })}
          placeholder="e.g., Space Grotesk"
        />
      </div>

      <button onClick={saveBrand} style={{ marginTop: '20px', width: '100%' }}>Save Brand Assets</button>
    </div>
  )
