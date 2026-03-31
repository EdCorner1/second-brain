# Ed's Second Brain 🧠

Your personal mission control dashboard. All-in-one hub for goals, clients, finances, content, health, ideas, and brand.

## 11 Dashboard Sections

1. **🏠 Dashboard** — Live stats: income progress to $10K goal, goals count, clients, content, workouts, ideas. Quick-action cards.
2. **🎯 Goals & Habits** — Create personal/business goals with target, description, progress tracking (0-100%). Save & manage.
3. **👤 Personal Brand** — Logo URL, mission statement, brand colors (#CCFF00, #1a1a1a, #0f0f0f), fonts, website links (portfolio, podcast, newsletter, YouTube, Twitter).
4. **📧 Emails** — Placeholder for future email provider integration (Hostinger, Gmail, Outlook ready).
5. **💰 Financial Tracker** — Income tracker with client list, monthly rates, progress bar to $10K goal. Add/remove clients, see real-time total.
6. **👥 Clients** — Manage all clients: name, monthly rate, status (active/pending/paused), detailed notes. Quick status updates.
7. **📅 Content Calendar** — Schedule content across TikTok, YouTube, Instagram, Twitter/X, LinkedIn. Track status (planned → filming → editing → scheduled → published). Sort by due date.
8. **🍽️ Meal Planning** — Save meal ideas with ingredients, prep instructions, servings. Reference for meal prep.
9. **💡 Idea Bank** — Brain dump ideas: apps, business, content. Track status (brainstorm → planning → building). Categorize, search.
10. **💪 Health & Fitness** — Daily log: sleep hours, workouts, energy (1-5), mood (1-5), notes. Track trends, see stats.
11. **🌐 Website** — Website project details: site URL, tech framework, design inspiration, design notes, code snippets.

## Key Features

✅ **Live Dashboard** — Real-time stats pulling from all sections  
✅ **Local Storage** — 100% private, no cloud, no tracking  
✅ **Dark Mode** — Auto-detects system preference  
✅ **Responsive** — Mobile-first, works on phone/tablet/desktop  
✅ **Fast** — Zero backend, instant saves  
✅ **Status Tracking** — Color-coded status indicators throughout  
✅ **Data Persistence** — Survives browser refresh, tab close, session reload  

## Design

- **Font:** Space Grotesk (modern, geometric)
- **Colors:** Dark theme (#0f0f0f bg, #1a1a1a sidebar, #2a2a2a cards)
- **Accent:** Neon green (#CCFF00) for buttons, links, progress
- **Borders:** Subtle (#333333) with rounded corners (8-12px)
- **Mobile:** Hamburger menu, full responsive layout

## Quick Start

```bash
cd /home/node/.openclaw/workspace/second-brain
npm install
npm run dev
```

Open http://localhost:3000

## Tech Stack

- **Next.js 14** — React framework
- **TypeScript** — Type safety
- **localStorage** — Local data persistence
- **CSS** — Hand-crafted styles (no Tailwind)

## Future Integrations

- [ ] Supabase for cloud sync
- [ ] Kit API for newsletter stats
- [ ] Email provider API
- [ ] GitHub/Notion sync
- [ ] Export to PDF
- [ ] Dark/Light mode toggle
- [ ] Mobile app (React Native)

## Project Structure

```
second-brain/
├── app/
│   ├── page.tsx (Dashboard)
│   ├── goals/
│   ├── brand/
│   ├── financial/
│   ├── clients/
│   ├── content-calendar/
│   ├── meals/
│   ├── ideas/
│   ├── health/
│   ├── emails/
│   ├── website/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Sidebar.tsx
│   └── Sidebar.css
├── package.json
└── next.config.js
```

## Notes

- All data saved to browser localStorage (no backend calls)
- Data persists across browser sessions
- Perfect for local-first, privacy-focused workflows
- Ready for Supabase integration when needed
