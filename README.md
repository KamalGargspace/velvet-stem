# Velvet & Stem 🌸

**Velvet & Stem** is a luxury, scroll-driven cinematic web application that brings the experience of personalized flower gifting to life. Inspired by Apple's signature scrolling landing pages, this project creates a buttery-smooth, hardware-accelerated 60fps image sequence animation tightly bound to the user's scroll position.

---

## ✨ Features
- **Cinematic Scroll Sequences**: Scrub through hundreds of high-resolution frames as you scroll down the page, seamlessly transitioning between different "phases" of bouquet creation.
- **GSAP ScrollTrigger Integration**: Precision-timed sticky text, fade-ins, and scroll markers layered gracefully on top of the fixed canvas sequence.
- **Temporal Lerp Smoothing**: The custom animation engine adds calculated momentum, interpolating the current scroll position so that skipping frames (like when using a fast scroll wheel) still results in a beautifully smooth glide.
- **Intelligent Preloading**: Frames are fetched asynchronously and buffered exactly where they are needed to prevent network saturation and visual stuttering.

---

## 🏗️ Architecture & Core Components

This application utilizes an advanced `<canvas>` rendering pipeline for maximum performance, separating the DOM overlay from the background imagery.

### 1. `useImageSequence.ts` (The Animation Engine)
This custom React hook is the beating heart of the cinematic sequence. It is responsible for:
- **Parallel Priority Preloading**: Automatically fetching frames ahead of the user's current scroll position.
- **Canvas Rendering**: Using hardware-accelerated `ctx.drawImage` to paint frames exactly 1:1, avoiding GPU layout thrashing by never resizing the canvas mid-sequence.
- **The "Secret Sauce" Lerp**: Instead of jumping directly to the target frame that matches the scroll progress, the render loop (bound to `gsap.ticker`) moves the `displayFrame` slightly closer to the `targetFrame` on every tick. This creates physical momentum and hides low framerates.

### 2. `PhaseScene.tsx` (The Scroll Wrapper)
This component manages the physical scrollable area and the GSAP ScrollTrigger logic:
- Creates a `fixed` canvas container that stays pinned to the viewport.
- Uses a `relative` wrapper with a massive height (e.g., `500vh`) to force the user to scrub slowly.
- Ties the section's scroll progress to the `useImageSequence` progress.
- Controls the `opacity` and `visibility` of different canvas layers as the user enters and leaves different phases.

### 3. `TransitionScene.tsx`
A specialized bridge component that gracefully links the core storytelling phases. It handles the crossfades between different image sequences to ensure there are no hard visual cuts.

---

## 🛠️ Technology Stack
- **Framework**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Animation**: [GSAP](https://gsap.com/) & ScrollTrigger
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Rendering**: HTML5 `<canvas>` API

---

## 🚀 Getting Started

To run the project locally:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

---

*Crafted with precision. Designed to evoke emotion.*
