# CareConnect Web Application

> Supporting Care, Connecting Hearts

A responsive Progressive Web App (PWA) for healthcare professionals built with React, TypeScript, and Tailwind CSS.

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v3
- **Forms:** react-hook-form
- **Icons:** lucide-react
- **PWA:** Custom service worker + Web App Manifest

---

## Prerequisites

- Node.js 18+
- npm 9+

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SWEN-661-Team-2/team_2_project.git
cd team_2_project
```

### 2. Navigate to the React app

```bash
cd apps/react
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel` from the `apps/react` directory
3. Follow the prompts
4. For subsequent deploys: `vercel --prod`

### Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist/` folder into [Netlify Drop](https://app.netlify.com/drop)
3. Or connect your GitHub repo in the Netlify dashboard

### GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
2. Add to `package.json` scripts: `"deploy": "gh-pages -d dist"`
3. Run: `npm run build && npm run deploy`

---

## Project Structure

```
apps/react/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
├── src/
│   ├── app/
│   │   └── components/
│   │       ├── Login.tsx
│   │       ├── CareConnectNavigation.tsx
│   │       ├── CareConnectDashboard.tsx
│   │       ├── TaskManagement.tsx
│   │       ├── SchedulePage.tsx
│   │       ├── PatientCare.tsx
│   │       ├── SettingsPage.tsx
│   │       ├── NewAppointmentModal.tsx
│   │       ├── AddPatientModal.tsx
│   │       └── CreateTaskModal.tsx
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Entry point + SW registration
│   └── index.css              # Tailwind directives
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## Features

- **Responsive design** — mobile (320px), tablet (768px), desktop (1024px+)
- **Left-handed mode** — sidebar moves from left to right
- **PWA** — installable, offline-capable
- **Authentication** — login with form validation
- **Dashboard** — task summary, schedule, care log, activity feed
- **Task Management** — filter, search, create tasks
- **Schedule** — calendar view with appointment timeline
- **Patient Care** — patient list with detailed records
- **Settings** — accessibility and notification preferences

---

## Responsive Breakpoints

| Breakpoint | Width | Navigation |
|---|---|---|
| Mobile | < 768px | Bottom tab bar |
| Tablet | 768px – 1023px | Icon-only sidebar (80px) |
| Desktop | 1024px+ | Full labeled sidebar (256px) |

---

## PWA

The app is PWA-enabled. To install:

1. Open the deployed app in Chrome
2. Click the install icon in the address bar
3. Or use the browser menu → "Add to Home Screen"

Offline support: static assets and previously visited pages are cached via the service worker.

---

## Accessibility

- WCAG 2.1 Level AA compliant
- Keyboard navigable — all interactive elements accessible via Tab
- ARIA labels on all controls
- Focus indicators visible at all times
- Minimum 48px touch targets on mobile
- Screen reader compatible

---

## Contributing

This app is part of the SWEN-661 Team 2 CareConnect project. See the root repository README for contribution guidelines.


---