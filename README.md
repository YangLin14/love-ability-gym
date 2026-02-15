# 💪 Love Ability Gym

A mobile-first web application for training emotional intelligence and relationship skills through interactive exercises and guided practices.

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

## 📖 About

Love Ability Gym is not about finding love—it's about **building the capacity to love**. Through 5 core modules, users can strengthen their "emotional muscles" with practical tools and exercises.

### 🎯 Core Modules

| Module | Focus | Key Tools |
|--------|-------|-----------|
| **Module 1** | 覺察 (Awareness) | Emotion Scan, Story Buster, Rapid Awareness, Attribution Shift, Happiness Scale, Time Travel |
| **Module 2** | 表達 (Expression) | Draft Builder, Vocabulary Swap, Apology Builder |
| **Module 3** | 共情 (Empathy) | Anger Decoder, Deep Listening Lab, Perspective Switcher |
| **Module 4** | 允許 (Allowing) | Permission Slip, Reframing Tool |
| **Module 5** | 影響 (Influence) | Spotlight Journal, Time Capsule, Vision Board |

## ✨ Features

- 🌐 **Bilingual Support** - Full English and Traditional Chinese (繁體中文)
- ☁️ **Optional Cloud Sync** - Secure backup and multi-device sync via Supabase
- 🎬 **Smooth Animations** - Seamless page transitions and expanding UI elements
- ♿ **Accessible Design** - Screen reader friendly forms and semantic HTML
- 🚀 **Instant Splash Screen** - Immediate load with smooth transitions
- 📲 **PWA Ready** - Installable as a native app with offline capabilities
- 📱 **Mobile-First Design** - Optimized for phone use
- 📊 **Progress Tracking** - XP system and emotional weather charts
- 🆘 **Crisis Mode** - Quick-access breathing exercises for emotional emergencies
- 💾 **Local Storage** - All data stored privately on your device

## 🔒 Data & Privacy

**Your data belongs to you.**

- **Local Storage**: All logs, journal entries, and progress are stored exclusively in your browser's `localStorage` (prefixed with `love_gym_`).
- **Local Storage**: All logs, journal entries, and progress are stored primarily in your browser's `localStorage` (prefixed with `love_gym_`).
- **Hybrid Sync**: If you choose to sign in, data is backed up to a private Supabase database for multi-device access.
- **Privacy First**: Syncing is completely optional. If you don't sign in, data never leaves your device.
- **⚠️ Important**: Clearing your browser cache or uninstalling the PWA will delete your data. We recommend backing up manually if needed.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YangLin14/love-ability-gym.git
cd love-ability-gym

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
love-ability-gym/
├── docs/                    # Design documentation
├── public/                  # Static assets
├── src/
│   ├── components/          # Shared UI components
│   ├── context/             # React context providers
│   ├── i18n/                # Internationalization
│   ├── modules/             # Feature modules (1-5)
│   │   ├── module1/         # Awareness tools
│   │   ├── module2/         # Expression tools
│   │   ├── module3/         # Empathy tools
│   │   ├── module4/         # Allowing tools
│   │   └── module5/         # Influence tools
│   ├── pages/               # Main pages (Dashboard, Profile, Onboarding)
│   ├── services/            # Storage and utility services
│   └── styles/              # Global styles and theme
├── index.html
├── package.json
└── vite.config.js
```

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with CSS Variables
- **Animation**: Framer Motion
- **State Management**: React Context
- **Storage**: LocalStorage (Offline-first) + Supabase (Optional Sync)
- **Database**: PostgreSQL (via Supabase)
- **Charts**: Custom SVG components
- **Testing**: Vitest, React Testing Library
- **PWA**: Vite PWA Plugin

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

Inspired by principles from:
- Nonviolent Communication (NVC)
- Emotional Intelligence research
- Cognitive Behavioral Therapy (CBT)
- Attachment theory

---

<p align="center">
  <strong>你變了，世界就變了。</strong><br>
  <em>"You change, the world changes."</em>
</p>
