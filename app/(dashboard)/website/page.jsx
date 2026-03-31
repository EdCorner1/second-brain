'use client'

import { useState, useEffect } from 'react'

interface WebsiteData {
  siteUrl: string
  framework: string
  designNotes: string
  inspiration: string
  codeSnippets: string
}

export default function Website() {
  const [website, setWebsite] = useState<WebsiteData>({
    siteUrl: '',
    framework: 'HTML + CSS',
    designNotes: '',
    inspiration: 'https://edcornerugc.framer.website',
    codeSnippets: ''
  })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('website') || '{}')
    if (Object.keys(saved).length) setWebsite({ ...website, ...saved })
  }, [])

  const saveWebsite = () => {
    localStorage.setItem('website', JSON.stringify(website))
    alert('Website details saved!')
  }

  return (
    <div>
      <h1>🌐 Website</h1>

      <div className="card">
        <h3>Website Details</h3>
        <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
          <div>
            <label>Site URL</label>
            <input
              type="url"
              placeholder="https://yoursite.com"
              value={website.siteUrl}
              onChange={(e) => setWebsite({ ...website, siteUrl: e.target.value })}
            />
          </div>
          <div>
            <label>Framework/Tech</label>
            <input
              type="text"
              placeholder="e.g., HTML + CSS, Next.js, Framer"
              value={website.framework}
              onChange={(e) => setWebsite({ ...website, framework: e.target.value })}
            />
          </div>
          <div>
            <label>Design Inspiration URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={website.inspiration}
              onChange={(e) => setWebsite({ ...website, inspiration: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Design Notes</h3>
        <textarea
          placeholder="Layout ideas, color schemes, typography, etc."
          value={website.designNotes}
          onChange={(e) => setWebsite({ ...website, designNotes: e.target.value })}
          rows={4}
          style={{ width: '100%' }}
        />
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Code Snippets</h3>
        <textarea
          placeholder="Paste HTML, CSS, or component code here for reference"
          value={website.codeSnippets}
          onChange={(e) => setWebsite({ ...website, codeSnippets: e.target.value })}
          rows={6}
          style={{ width: '100%', fontFamily: 'monospace' }}
        />
      </div>

      <button onClick={saveWebsite} style={{ marginTop: '20px', width: '100%' }}>Save Website Details</button>
    </div>
  )
}
