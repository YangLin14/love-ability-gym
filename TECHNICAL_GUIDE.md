# Love Ability Gym - Technical Guide

This document provides a comprehensive technical overview of the Love Ability Gym application. It is intended for developers who want to understand the architecture, data flow, implementation details, and development workflows.

## 🏗️ Architecture Overview

The application is a **Client-Side Rendered (CSR)** Single Page Application (SPA) built with **React 19** and **Vite**. It adheres to "Offline-First" principles, utilizing **localStorage** for data persistence and **Service Workers** for asset caching, making it a fully functional **Progressive Web App (PWA)**.

### Tech Stack
| Category | Technology | Reasoning |
|----------|------------|-----------|
| **Framework** | React 19 | Leveraging latest features like hooks and concurrent rendering. |
| **Build Tool** | Vite 6 | Extremely fast HMR and optimized production builds. |
| **Routing** | React Router v6 | Standard declarative routing for SPAs. |
| **State** | React Context API | Sufficient for global state (User, Theme, Language) without Redux bloat. |
| **Styling** | CSS Variables | Native, performant dynamic theming (e.g., color modes) without CSS-in-JS overhead. |
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
│   ├── RadarChart.jsx   # Visualization wrapper
│   └── ...
├── context/             # Global State Managers (React Context)
│   ├── AppProvider.jsx  # Composite provider wrapper
│   ├── UserContext.jsx  # Gamification state (XP, Level, Streak)
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
│   ├── Profile.jsx      # User stats and history
│   └── ...
├── services/            # Singleton Business Services
│   └── StorageService.js # LocalStorage abstraction layer
└── App.jsx              # App Root & Routing Setup
```

---

## 💾 Data Persistence Strategy

The application uses a **"Hybrid Local-First"** architecture. It functions 100% offline using `localStorage` but can optionally sync to the cloud when online.
 
 ### StorageService (`src/services/StorageService.js`)
 A singleton service that abstracts both `localStorage` and `Supabase` interactions.
- **Namespace**: Keys are prefixed with `love_gym_` (e.g., `love_gym_logs`).
- **Data Integrity**: Includes try-catch blocks to handle `JSON.parse` errors or `QuotaExceededError`.
- **Caching**: Maintains an in-memory `cache` to reduce synchronous File I/O (localStorage access) during high-frequency operations.

**Key Methods**:
- `saveLog(moduleName, data)`: Appends a new timestamped record.
- `getLogs(moduleName)`: Retrieves and parses all records for a module.
 - `getStats()` / `saveStats()`: Manages user gamification data.
 - `syncEntryToCloud(moduleName, entry)`: Attempts to push a single log to Supabase immediately (Fire-and-Forget).
 - `syncWithCloud()`: Performs a full bi-directional sync (Pull -> Merge -> Push).
 
 ### Sync Strategy
 1.  **Writes**: When a user saves a log, it is written to `localStorage` immediately. If the user is logged in, an async call tries to upsert it to Supabase `user_logs`.
 2.  **Reads**: The app *always* reads from `localStorage` for UI rendering to ensure instant load times.
 3.  **Conflict Resolution**: Uses a "Merge Union" strategy based on unique IDs (`client_id`). It does not currently handle modification conflicts (last write wins).

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
 
 ## 🎨 UI & Animations
 
 ### 1. Page Transitions
 We use `framer-motion`'s `AnimatePresence` with `mode="wait"` to create smooth transitions between routes.
 - **PageTransition Component**: Wraps main route components to define entry/exit animations (fade + slide up).
 
 ### 2. Shared Layout Animation (SOS)
 The Crisis Mode (SOS) feature uses `layoutId` to create a seamless morphing effect.
 - **Button to Overlay**: The floating SOS button and the full specific screen overlay share the same `layoutId="crisis-orb"`.
 - **Auto-Animate**: Framer Motion automatically calculates the transform between the two states, making the button appear to "expand" into the page.
 
 ---
 
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

## 🧪 Experimentation & Quality Assurance

### Testing Pyramid
1.  **Unit Tests**: `src/**/*.test.jsx` (e.g., `CrisisOverlay.test.jsx`). Fast, component/function isolation.
2.  **Integration Tests**: `src/integration/`. Verifies full user flows (Dashboard -> Check-In -> Profile).

### Test Commands
```bash
npm test          # Run all tests
npm test --watch  # Interactive mode
npm test --coverage # Generate coverage report
```

### Mocking
- **LocalStorage**: Mocked in `setupTests.js` to ensure isolation.
- **Complex UI**: Mocks `RadarChart` to avoid Canvas dependencies in JSDOM.

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
