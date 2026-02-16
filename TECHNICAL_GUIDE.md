# Love Ability Gym - Technical Guide

This document provides a comprehensive technical overview of the Love Ability Gym application. It is intended for developers who want to understand the architecture, data flow, implementation details, and development workflows.

## 🏗️ Architecture Overview

The application is a **Client-Side Rendered (CSR)** Single Page Application (SPA) built with **React 19** and **Vite**. It adheres to **"Offline-First"** principles, utilizing **IndexedDB** (primary) and **localStorage** (fallback) for data persistence and **Service Workers** for asset caching, making it a fully functional **Progressive Web App (PWA)**.

### Tech Stack
| Category | Technology | Reasoning |
|----------|------------|-----------|
| **Framework** | React 19 | Leveraging latest features like hooks and concurrent rendering. |
| **Build Tool** | Vite 6 | Extremely fast HMR and optimized production builds. |
| **Routing** | React Router v6 | Standard declarative routing for SPAs. |
| **State** | React Context API | Sufficient for global state (User, Theme, Language) without Redux bloat. |
| **Styling** | CSS Modules + CSS Variables | Scoped component styles via `*.module.css`, plus native CSS custom properties for theming. |
| **Animation** | Framer Motion | Declarative animations for complex UI transitions (Shared Layout, Page Transitions). |
| **Testing** | Vitest + RTL | Fast integration with Vite; standard component testing utilities. |
| **PWA** | `vite-plugin-pwa` | Automates Service Worker generation and manifest management via Workbox. |

---

## 📂 Directory Structure

```text
src/
├── assets/              # Static assets (images, icons)
├── components/          # Shared reusable UI components
│   ├── DailyCheckIn.jsx # Core "Check-In" logic and UI
│   ├── DailyCheckIn.module.css # Scoped styles
│   ├── BottomNav.jsx    # Bottom navigation bar
│   ├── BottomNav.module.css # Scoped styles
│   ├── RadarChart.jsx   # Visualization wrapper
│   ├── profile/         # Decomposed Profile sub-components
│   │   ├── ProfileHeader.jsx   # Avatar, name, edit form
│   │   ├── StatsOverview.jsx   # Streak & activity count cards
│   │   ├── ActivityHistory.jsx # Log table with delegation
│   │   └── LogItem.jsx         # Tool-specific log renderer
│   └── ...
├── context/             # Global State Managers (React Context)
│   ├── AppProvider.jsx  # Composite provider wrapper (initializes StorageService)
│   ├── UserContext.jsx  # Gamification state (XP, Level, Streak) — safe JSON parsing
│   └── LanguageContext.jsx # I18n provider
├── data/                # Static data definitions
│   ├── emotionTaxonomy.js # Core data structure for Emotion Scan
│   └── storyBusterQuiz.js # Quiz logic data
├── hooks/               # Custom React Hooks
│   └── useEmotionAnalysis.js # Business logic for scoring emotions
├── i18n/                # Translation definitions
│   └── translations.js  # Dictionary for 'en' and 'zh'
├── integration/         # Integration Tests
│   └── __tests__/       # User flow verification
├── modules/             # Feature-specific modules (Scalable structure)
│   └── module1/         # "Emotion Awareness" module
│       ├── pages/       # Module-specific routes
│       └── components/  # Module-specific UI
├── pages/               # Top-level Route Components
│   ├── Dashboard.jsx    # Main landing view
│   ├── Profile.jsx      # User stats and history (decomposed)
│   ├── Profile.module.css # Scoped styles for Profile page
│   └── ...
├── services/            # Singleton Business Services
│   ├── StorageService.js # Hybrid IndexedDB + localStorage service
│   └── db.js            # Native IndexedDB wrapper (zero dependencies)
└── App.jsx              # App Root & Routing Setup
```

---

## 💾 Data Persistence Strategy

The application uses a **"Hybrid Local-First"** architecture. It functions 100% offline using **IndexedDB** (primary) and **localStorage** (fallback/profiles) but can optionally sync to the cloud when online.

### Data Layer (`src/services/db.js`)
A zero-dependency native IndexedDB wrapper providing async CRUD for log data.
- **Database**: `love_ability_gym_db` (version 1)
- **Object Store**: `logs` with indexes on `moduleName`, `createdAt`, and `tool`.
- **Why IndexedDB**: Async, does not block the main thread, supports >5MB of data (unlike localStorage).

### StorageService (`src/services/StorageService.js`)
A singleton service that coordinates IndexedDB, localStorage, and Supabase.
- **Initialization**: `StorageService.init()` is called once in `AppProvider`. It: 
  1. Migrates existing localStorage logs → IndexedDB (one-time).
  2. Pre-fills an **in-memory cache** from IndexedDB for instant synchronous reads.
- **Writes**: Dual-write to IndexedDB (primary) and localStorage (backup).
- **Reads**: Always from in-memory cache (`getLogs()`, `getAllLogs()` are synchronous).
- **Profile/Stats**: Remain in localStorage (small, key-value data). 
- **Namespace**: Keys are prefixed with `love_gym_`.
- **Data Integrity**: Includes try-catch blocks to handle `JSON.parse` errors or `QuotaExceededError`.

**Key Methods**:
- `init()`: One-time migration + cache warm-up.
- `saveLog(moduleName, data)`: Appends a new timestamped record.
- `getLogs(moduleName)`: Retrieves records from cache (sync).
- `getStats()` / `saveStats()`: Manages user gamification data.
- `syncEntryToCloud(moduleName, entry)`: Fire-and-forget push to Supabase.
- `syncWithCloud()`: Full bi-directional sync (Pull → Merge → Push).

### Sync Strategy

The sync system uses **Delta Sync** to minimize bandwidth:

1.  **Writes**: When a user saves a log, it is written to IndexedDB + cache immediately. If the user is logged in, an async call tries to upsert it to Supabase `user_logs`.
2.  **Reads**: The app *always* reads from the in-memory cache for UI rendering to ensure instant load times.
3.  **Delta Fetch**: `syncWithCloud()` tracks a `last_sync_timestamp` in localStorage. On sync, it only fetches records from Supabase where `created_at > last_sync_timestamp`, avoiding O(N) full-table downloads.
4.  **Push Unsynced**: After pulling cloud changes, the sync process pushes any local entries created after `last_sync_timestamp` to the cloud.
5.  **Conflict Resolution**: Uses **Last-Write-Wins (LWW)** based on `updatedAt` timestamps. When the same UUID exists in both local and cloud, the entry with the newer `updatedAt` (or `createdAt` fallback) wins. Each entry carries an `updatedAt` field set at creation time.
6.  **Timestamp Update**: After a successful sync cycle, `last_sync_timestamp` is updated to the current time.

```
┌─────────────┐    delta fetch    ┌──────────────┐
│   Client    │ ──────────────>   │   Supabase   │
│  (IndexedDB │   gt(last_sync)   │  (user_logs) │
│   + Cache)  │ <──────────────   │              │
│             │   push unsynced   │              │
│             │ ──────────────>   │              │
└─────────────┘                   └──────────────┘
```

---

## 🧩 State Management

Global state is managed via React Context to avoid prop-drilling.

### 1. UserContext (`UserContext.jsx`)
Handles gamification and user identity.
- **State**: `level`, `xp`, `streak`, `lastActivityDate`.
- **Logic**:
    - `addXp(amount)`: Increments XP, calculates Level up (Level * 100 XP), and updates Streak based on `lastActivityDate` (consecutive days check).
    - **Persistence**: Automatically syncs state changes to `love_gym_stats`.

### 2. LanguageContext (`LanguageContext.jsx`)
Handles content localization.
- **State**: `language` (default: 'zh-TW', fallback: 'en').
- **Logic**: Updates the `<html>` lang attribute and provides the `t(path)` helper function.

### 3. AppProvider (`AppProvider.jsx`)
A higher-order component that composes all contexts. It also handles **PWA Installation Events**:
- Listens for `beforeinstallprompt`.
- Exposes `deferredPrompt` and `installPWA` method to UI components (e.g., `PWAInstallPrompt.jsx`).

---

## 🌐 Internationalization (i18n)

Translations are stored in `src/i18n/translations.js` as a nested JSON object.

**Adding a New Language**:
1. Add the language key (e.g., `es`) to the `translations` object.
2. Update `LanguageContext.jsx` to accept the new language code.
3. Add a switcher option in `Profile.jsx`.

---
 
## ♿ Accessibility (a11y)

The application follows accessibility best practices across its interactive components:

### Navigation (`BottomNav.jsx`)
- `role="navigation"` and `aria-label="Main navigation"` on the `<nav>` element.
- `aria-current="page"` on the active tab button.
- `aria-label` on each nav button for screen readers.
- Material Icons hidden from screen readers with `aria-hidden="true"`.

### Interactive Elements
- **Buttons**: All interactive buttons include `aria-label` attributes (back button, settings, retake assessment, check-in CTA).
- **Clickable Non-Buttons**: Avatar and edit icon use `role="button"` and `tabIndex={0}` for keyboard accessibility.
- **Decorative Content**: Emoji icons use `aria-hidden="true"` to prevent screen reader noise.

### Components with a11y
| Component | Attributes |
|-----------|------------|
| `BottomNav` | `role`, `aria-label`, `aria-current`, `aria-hidden` |
| `DailyCheckIn` | `aria-label`, `aria-hidden` on emoji |
| `ProfileHeader` | `aria-label`, `aria-hidden`, `role`, `tabIndex` |
| `Profile` | `aria-label` on back/retake buttons |

---

## 🎨 UI & Animations

### Styling Architecture

The application uses **CSS Modules** for component-scoped styles and **CSS Variables** for global theming.

| Pattern | Usage |
|---------|-------|
| CSS Modules (`*.module.css`) | Scoped component styles: `BottomNav`, `DailyCheckIn`, `Profile`, `ProfileHeader`, `StatsOverview`, `ActivityHistory` |
| CSS Variables | Global theming: colors, shadows, spacing defined in `index.css` |
| Inline styles | Only for truly dynamic values (e.g., computed bar widths) |

**Migration Note**: The codebase was migrated from inline styles to CSS Modules. If adding new components, always use CSS Modules for styling.

### Page Transitions
We use `framer-motion`'s `AnimatePresence` with `mode="wait"` to create smooth transitions between routes.
- **PageTransition Component**: Wraps main route components to define entry/exit animations (fade + slide up).

### Shared Layout Animation (SOS)
The Crisis Mode (SOS) feature uses `layoutId` to create a seamless morphing effect.
- **Button to Overlay**: The floating SOS button and the full specific screen overlay share the same `layoutId="crisis-orb"`.
- **Auto-Animate**: Framer Motion automatically calculates the transform between the two states, making the button appear to "expand" into the page.

 
 ## ☁️ Backend (Supabase)
 
 Although the app is client-heavy, it uses Supabase for optional features.
 
 ### Database Schema (`user_logs`)
 A generic JSONB storage table to support flexible data from different modules.
 | Column | Type | Description |
 |--------|------|-------------|
 | `id` | uuid | Primary Key |
 | `user_id` | uuid | Foreign Key to `auth.users` |
 | `module_name` | text | Partition key (e.g., 'module1') |
 | `data` | jsonb | The actual log content |
 | `client_id` | text | Unique ID generated on client for deduping |
 | `created_at` | timestamptz | Server timestamp |
 
 ### Authentication
 - Managed via Supabase Auth.
 - Supports Email/Password signup.
 - Session persistence handled by Supabase SDK.
 
 ---
 
 ## 🚀 Performance Optimizations

### 1. Hybrid Splash Screen
Eliminates the "White Screen of Death" during React hydration.
- **Static**: Critical CSS/HTML inlined in `index.html` displays immediately.
- **Dynamic**: `SplashScreen.jsx` takes over once React loads, then fades out.

### 2. Code Splitting
- **Route-based**: `Dashboard` and `Profile` are lazy-loaded via `React.lazy`.
- **Component-based**: Heavy visualization libraries (like `recharts`, if used) should be split.

### 3. Asset Optimization
- **Preloading**: Critical assets (fonts, logo) are preloaded in `<head>`.
- **WebP**: Images use modern WebP format where possible.

---

## 📱 Progressive Web App (PWA)

Configured via `vite-plugin-pwa`.
- **Manifest**: `vite.config.js` generates `manifest.webmanifest` (Name, Icons, Theme Color).
- **Service Worker**: Using **Workbox** with `generateSW` strategy.
    - **Caching**: 
        - `StaleWhileRevalidate` for CSS/JS/HTML.
        - `CacheFirst` for images and fonts.
- **Offline Fallback**: The app loads from shell cache when offline.

---

## 🧪 Testing

### Test Infrastructure

| File | Purpose |
|------|---------|
| `src/setupTests.js` | Global mocks: `matchMedia`, Supabase client (`auth.getSession`, `auth.onAuthStateChange`, `auth.getUser`) |
| `src/test-utils.jsx` | Custom async `render()` function that wraps components in `act()` + `AllTheProviders` wrapper |

### Async Rendering Strategy

The `AuthProvider` gates rendering on a `loading` state that depends on `supabase.auth.getSession()` resolving. To handle this:
- `test-utils.jsx` exports an async `render()` that wraps all renders in `act(async () => ...)`, flushing microtasks before assertions.
- All test files that render components with providers use `await render(<Component />)`.
- Integration tests that import directly from `@testing-library/react` wrap renders in `await act(async () => ...)`.

### Test Suites

| Suite | Tests | Coverage Area |
|-------|-------|---------------|
| `DailyCheckIn.test.jsx` | 3 | Check-in UI states |
| `CrisisOverlay.test.jsx` | 2 | Crisis mode UI |
| `PWAInstallPrompt.test.jsx` | 6 | PWA install flows (Android/iOS) |
| `Dashboard.test.jsx` | 8 | Dashboard rendering & navigation |
| `Profile.test.jsx` | 5 | Profile page rendering |
| `Settings.test.jsx` | 4 | Settings page actions |
| `AppProvider.test.jsx` | 5 | Provider initialization & PWA events |
| `UserContext.test.jsx` | 5 | Gamification state (XP, streaks) |
| `useEmotionAnalysis.test.jsx` | 14 | Emotion scoring business logic |
| `StorageService.test.js` | 14 | CRUD, migration, error handling |
| `UserFlow.test.jsx` | 2 | End-to-end user flows |
| **Total** | **73** | |

### Mocking Strategy

| Mock Target | Approach | Why |
|-------------|----------|-----|
| `supabase` | Global mock in `setupTests.js` | Avoid real network calls; provides resolved promises for auth |
| `StorageService` | Per-test `vi.mock()` with `init`, `clearAllData`, `saveProfile`, etc. | Isolate component logic from storage |
| `RadarChart` / `EmotionInsights` | Module mock returning simple `<div>` | Avoid Canvas/SVG dependencies in jsdom |
| `react-router-dom` | `vi.mock()` for `useNavigate` | Spy on navigation without full router |
| `IndexedDB` | N/A — `db.js` detects jsdom and falls back to localStorage | No fake-indexeddb dependency needed |

### Test Commands
```bash
npm test          # Run all tests (watch mode)
npm test run      # Run once and exit
npm test --coverage # Generate coverage report
```

---

## 🛠️ Development Workflow

### Prerequisites
- Node.js v18+
- npm v9+

### Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server (port 5173). |
| `npm run build` | Compile for production (to `/dist`). |
| `npm run preview` | Serve the production build locally. |
| `npm test` | Run test suite. |

### Deployment
The app is static. Build output (`dist/`) can be deployed to any static host.
1. Run `npm run build`.
2. Upload `dist` folder to Netlify, Vercel, or GitHub Pages.
   - For **Vercel**: Connect repo, existing settings work out of the box.
   - For **Sub-path Hosting**: Update `base` in `vite.config.js`.
