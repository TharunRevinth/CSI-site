# CSI Desktop Environment

An interactive, desktop-inspired web application for CSI. Built with [Next.js](https://nextjs.org), [Framer Motion](https://www.framer.com/motion/), React, and GSAP. 

## Features

- **💻 macOS Desktop Interface**: A premium operating system shell featuring a fully functional magnifying dock, a dynamic Menubar, action centers, and desktop shortcuts.
- **🔍 Spotlight Search Console**: Press `Cmd + K` or click the search icon to open a floating macOS-style search palette. Search across apps, projects, and members, with arrow-key navigation and instant execution.
- **🎮 CSI Multi-Game Arcade (`Arcade.app`)**: A retro neon-green console containing 5 fully-playable canvas games:
  * **CSI Snake**: Classic block builder with speed increments.
  * **Neon Tetris**: Stack and rotate pieces to clear lines.
  * **Matrix Invaders**: Pixel space shooter against alien waves.
  * **Cyber Pong**: Solos vs computer paddle AI.
  * **Cyber Runner**: Dodge lane obstacles at high speeds.
  * *High-score persistence using `localStorage` for all games.*
- **📝 Code Editor Challenge (`Challenge.js`)**: A cryptography decryption puzzle. Fixing the loop's bug (subtraction cipher offsets) reveals hidden event coordinates and unlocks an interactive holographic **VIP Ticket** badge on the desktop.
- **📅 Glassmorphic Desktop Widgets**: Side-pinned dashboard panels showing digital time/date (hydration-safe), dynamic CPU/RAM usage bars, and a CSI Scheduler calendar highlighting upcoming events.
- **⌨️ Interactive Terminal Shell**: Run commands like `help`, `about`, `projects`, `neofetch` (CSI specs printout), and `matrix` (full-canvas green code falling animation).
- **🎛️ Optimized Window Physics & Transitions**:
  * **Split Layout**: Restricted glassmorphic blur to side navigation bars (Finder & Mail) while using high-contrast solid backgrounds for content areas to boost legibility and rendering performance.
  * **macOS Animation**: Smooth slide-to-dock minimizing and fullscreen maximizing coordinate transitions utilizing custom springs and MotionValues.
- **🚀 Reduced Initial Load Time**: Artificial greeting cycles optimized from 4.5s to 1.5s alongside Next.js code-splitting to prevent early load of heavy graphics libraries.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Styling/Animations**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## Getting Started

1. **Install dependencies**

```bash
npm install
```

2. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Structure

- `/src/components` - Core UI components including `DesktopWindow`, `MacDock`, and animated modules.
- `/src/components/sections` - Content sections meant to act as discrete app windows on the desktop.
- `/public` - Static assets and icons.
