# CSI Desktop Environment

An interactive, desktop-inspired web application for CSI. Built with [Next.js](https://nextjs.org), [Framer Motion](https://www.framer.com/motion/), React, and GSAP. 

## Features

- **macOS Desktop Interface**: A premium operating system shell featuring a fully functional magnifying dock, action centers, and desktop shortcuts. (Top menubar removed for a clean full-screen look).
- **Dynamic Wallpaper Engine**: Switch between four premium animated live wallpapers directly from the Action Center drawer:
  * **Neural Network (Default)**: Interactive canvas particles tracking mouse movements.
  * **Cyber Grid**: Retro-cyberpunk grid lines with a vertical sweeping neon-cyan laser.
  * **Aurora Flow**: Shifting fluid purple/blue organic gradients.
  * **Charcoal Matte**: A clean, professional dark slate with micro-dot arrays.
- **Right-click Customization**: Right-clicking the desktop opens a Context Menu mapping "Change Wallpaper..." directly to the Action Center drawer, keeping controls accessible.
- **Premium Bespoke Glassmorphic Icons**: Mapped custom, unique flat glassmorphic neon icons (About, Domains, Events, Projects, Terminal, Arcade, Team, Neural Hub, Contact, Code Editor, VIP Ticket) resolving placeholder duplicates.
- **Interactive Events Dashboard (Events.app)**: An official event RSVP tracker:
  * **Detailed Event Agendas**: Time-indexed schedules for Hackathons, Workshops, and Summits.
  * **Speaker Profiles**: Cards detailing bios, photos, and roles of guest speakers/judges (e.g. from Microsoft, OpenAI, Google).
  * **RSVP Passes**: Clicking RSVP generates an overlay ticket card displaying event details and a custom scanable mock QR code.
  * **Calendar Syncing**: Direct integration with Google/Apple calendars to download event reminders.
- **Physics-based Neural Hub (NeuralHub.app)**: A categorized graph showing the club's structure:
  * **Drag & Throw Physics**: Drag any member's node and throw it with velocity using custom canvas physics.
  * **Collision Overlap Resolution**: Nodes dynamically push away from each other so they do not clump or merge.
  * **Department Clusters**: Nodes automatically group and drift toward gravitational centers for their domains: Executive Core (Amber Gold), Technical (Electric Blue), Design & Content (Hot Pink), and Management & Marketing (Emerald Green).
- **Spotlight Search Console**: Press Cmd/Ctrl + K to open a floating macOS-style search palette. Search across apps, projects, and members, with arrow-key navigation and instant execution.
- **CSI Multi-Game Arcade (Arcade.app)**: A retro neon-green console containing 5 fully-playable canvas games:
  * **CSI Snake**: Classic block builder with speed increments.
  * **Neon Tetris**: Stack and rotate pieces to clear lines.
  * **Matrix Invaders**: Pixel space shooter against alien waves.
  * **Cyber Pong**: Solos vs computer paddle AI.
  * **Cyber Runner**: Dodge lane obstacles at high speeds.
  * *High-score persistence using localStorage for all games.*
- **Code Editor Challenge (Challenge.js)**: A cryptography decryption puzzle. Fixing the loop's bug (subtraction cipher offsets) reveals hidden event coordinates and unlocks an interactive holographic VIP Ticket badge on the desktop.
- **Glassmorphic Desktop Widgets**: Side-pinned dashboard panels showing digital time/date, dynamic CPU/RAM usage bars, and a CSI Scheduler calendar highlighting upcoming events.
- **Interactive Terminal Shell**: Run commands like help, about, projects, neofetch (CSI specs printout), and matrix (full-canvas green code falling animation).
- **Optimized Window Physics & Transitions**:
  * **Split Layout**: Restricted glassmorphic blur to side navigation bars (Finder & Mail) while using high-contrast solid backgrounds for content areas to boost legibility and rendering performance.
  * **macOS Animation**: Smooth slide-to-dock minimizing and fullscreen maximizing coordinate transitions utilizing custom springs and MotionValues.
- **Legible Loading Sequence**: Startup hello language cycles slowed down to a readable 350ms (3.2 seconds total load time) with a synchronized progress bar.

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
