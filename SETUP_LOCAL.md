# Running Second Brain Locally on Mac

This guide will help you run your Second Brain dashboard on your Mac.

## Prerequisites

Make sure you have these installed:

```bash
node --version   # Should be v18+ (you have v24)
npm --version    # Should be v8+
```

If not installed, download from https://nodejs.org

## Setup Steps

### 1. Clone or Download the Project

**Option A: Clone from GitHub**
```bash
git clone https://github.com/EdCorner1/second-brain.git
cd second-brain
```

**Option B: Download the folder**
Already on your Mac? Just navigate to the project folder in Terminal.

### 2. Install Dependencies

```bash
npm install
```

This downloads all packages needed to run the app. Takes ~2-3 minutes first time.

### 3. Start the Development Server

```bash
npm run dev
```

Output should show:
```
> ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 4. Open in Browser

Go to: **http://localhost:3000**

You should see a login page. Enter the password:
```
EdCorner$2026!SecondBrain
```

Done! Your dashboard is running locally.

---

## Usage Tips

**Keep it running:**
- Terminal must stay open while you use the app
- Press `Ctrl+C` to stop

**Restart after edits:**
- If you edit code, the app auto-reloads
- Just refresh your browser

**Access from other devices:**
- On your network, use: `http://YOUR_MAC_IP:3000`
- Find your IP: `ifconfig | grep inet`

---

## Build for Production

To create an optimized version:

```bash
npm run build
npm run start
```

This creates a faster, smaller version. Still runs locally on port 3000.

---

## Project Structure

```
second-brain/
├── app/              # Pages (Dashboard, Clients, Financial, etc.)
├── components/       # Sidebar, shared components
├── netlify/functions/# Backend (email sync)
├── public/          # Static files
├── package.json     # Dependencies
├── tsconfig.json    # TypeScript config
└── next.config.js   # Next.js config
```

---

## Troubleshooting

**Port 3000 already in use:**
```bash
# Use a different port
PORT=3001 npm run dev
# Then go to http://localhost:3001
```

**npm install fails:**
```bash
# Clear cache and try again
npm cache clean --force
npm install
```

**Blank page / errors in console:**
- Press F12 to open browser console
- Check for red errors
- Refresh the page (`Cmd+R`)

**Password not working:**
- Password is case-sensitive
- Check spelling: `EdCorner$2026!SecondBrain`
- Edit `app/auth/page.tsx` to change it

---

## Deploy to Netlify

When you want to share with others:

1. Push to GitHub (already done)
2. Go to https://netlify.com
3. Click **"Add new site"** → **"Import existing project"**
4. Choose GitHub → **EdCorner1/second-brain**
5. Build settings auto-fill, click **Deploy**

Done! Your app is live at `ed-second-brain.netlify.app`

---

## Change the Password

Edit `app/auth/page.tsx`, find this line:

```typescript
const correctPassword = 'EdCorner$2026!SecondBrain'
```

Change to anything you want. Then restart the server.

---

## Keyboard Shortcuts (Future)

- `Cmd+K` — Quick search (coming soon)
- `Cmd+/` — Help menu (coming soon)

---

## Questions?

Check the main `README.md` for full feature list and documentation.
