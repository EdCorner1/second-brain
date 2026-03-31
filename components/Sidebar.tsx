'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import './Sidebar.css'

const menuItems = [
  { href: '/', label: '🏠 Dashboard', icon: '📊' },
  { href: '/goals', label: '🎯 Goals & Habits', icon: '✅' },
  { href: '/brand', label: '👤 Personal Brand', icon: '⭐' },
  { href: '/financial', label: '💰 Financial Tracker', icon: '📈' },
  { href: '/clients', label: '👥 Clients', icon: '🤝' },
  { href: '/pipeline', label: '🎬 Content Pipeline', icon: '🎞️' },
  { href: '/content-calendar', label: '📅 Content Calendar', icon: '📹' },
  { href: '/weekly', label: '📊 Weekly Review', icon: '📋' },
  { href: '/emails', label: '📧 Emails', icon: '💌' },
  { href: '/meals', label: '🍽️ Meal Planning', icon: '🥗' },
  { href: '/ideas', label: '💡 Idea Bank', icon: '💭' },
  { href: '/health', label: '💪 Health & Fitness', icon: '⚡' },
  { href: '/website', label: '🌐 Website', icon: '🖥️' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
        ☰
      </button>
      
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Ed's Brain</h2>
          <p className="tagline">Mission Control</p>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>v1.0.0</p>
        </div>
      </aside>
    </>
  )
}
