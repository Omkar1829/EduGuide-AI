# EduGuide AI

A modern, premium-feeling SaaS landing page for **EduGuide AI** — your personal AI study guide — built with React, Tailwind CSS and Framer Motion. Includes a fully functional dark/light theme system and a polished floating chatbot UI.

![EduGuide AI preview](./public/vite.svg)

## ✨ Features

- **React + Vite** (JavaScript only, no TypeScript)
- **Tailwind CSS** with class-based dark mode
- **Framer Motion** animations (hover, fade, slide-up, stagger)
- **Dark / light mode**
  - Toggle button in the navbar (sun / moon with animated transition)
  - Preference stored in `localStorage`
  - Auto-detects system preference on first visit
  - Respects system changes when the user hasn't picked manually
  - No flash-of-wrong-theme on load (inline bootstrap script)
- **Premium UI**
  - Rounded-2xl cards with soft shadows and hover scale
  - Clear typography hierarchy (`text-xl`, `text-2xl`, `font-semibold`)
  - Consistent spacing, grid and color tokens across pages
- **Chatbot**
  - Floating launcher (bottom-right)
  - Gradient header (indigo → purple)
  - User messages right-aligned (colored bubble)
  - Bot messages left-aligned (neutral bubble)
  - Animated typing indicator
  - Styled input with gradient send button
  - Slide-up open animation and fade/slide message animations

## 🧱 Tech stack

- [React](https://react.dev/) 19
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) 3 (class-based `dark:`)
- [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# production build
npm run build

# preview the production build
npm run preview
```

The app runs at [http://localhost:5173](http://localhost:5173).

## 🗂 Project structure

```
src/
├─ components/
│  ├─ Chatbot.jsx        # Floating chatbot + mini chat UI
│  ├─ CTA.jsx
│  ├─ Features.jsx
│  ├─ Footer.jsx
│  ├─ Hero.jsx
│  ├─ HowItWorks.jsx
│  ├─ Navbar.jsx         # Sticky navbar with theme toggle
│  ├─ Pricing.jsx
│  └─ ThemeToggle.jsx    # Sun/moon toggle button
├─ context/
│  └─ ThemeContext.jsx   # Theme provider + useTheme hook
├─ App.jsx
├─ index.css             # Tailwind directives + component utilities
└─ main.jsx              # App entry, wraps <App /> in <ThemeProvider />
```

## 🌗 Theme system — how it works

1. `index.html` runs a tiny inline script that reads `localStorage` (or the system preference) and sets `class="dark"` on `<html>` **before** React mounts. This prevents any flash of the wrong theme.
2. `ThemeProvider` (`src/context/ThemeContext.jsx`) keeps React state in sync with the `dark` class on `<html>` and persists changes to `localStorage` under the key `eduguide-theme`.
3. If the user hasn't set an explicit preference, the provider listens to `prefers-color-scheme` and follows the OS.
4. `<ThemeToggle />` in the navbar calls `toggleTheme()` from the `useTheme()` hook.

```jsx
import { useTheme } from './context/ThemeContext'

function MyComponent() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>{theme === 'dark' ? 'Light' : 'Dark'}</button>
}
```

## 🎨 Design tokens

- Background: `bg-gray-50` (light) / `bg-gray-900` (dark)
- Cards: `bg-white` (light) / `bg-gray-800` (dark)
- Text: `text-gray-800` (light) / `text-white` (dark)
- Borders: `border-gray-200` (light) / `border-gray-700` (dark)
- Brand gradient: `from-indigo-600 to-purple-600`

These are centralized as `.eg-card`, `.eg-btn-primary`, `.eg-btn-ghost`, `.eg-input` in `src/index.css`.

## 📝 License

MIT
