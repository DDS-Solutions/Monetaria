# Monetaria Website

The official marketing website for **Monetaria** - the "Digital Cabinet" for serious shell collectors.

## 🎨 Design System: "The Curator's Cabinet"
This website implements a custom design system blending **Luxury Heritage** (Mahogany, Brass, Serif fonts) with **Scientific Precision** (Grid data, Monospace accessors, Analysis overlays).

### Core Features
- **Parallax Hero:** Mouse-reactive background movement for depth.
- **Spotlight Cards:** Dynamic cursor-tracking radial bioluminescence on specimen cards.
- **Scroll Reveal:** "Drawer opening" animations for sections.
- **AI Vision Grading:** Interactive specimen scanning with simulated conchological liveness check, surface gloss scoring, defect marker overlays, and WoRMS taxonomy tree.
- **Quick Test Specimen Controls:** 1-click test shells (Tiger Cowrie, Gem Glory of the Seas, and Ethical Safety Gate demonstration).
- **VIP Waitlist Drawer:** Modal dialog with localStorage registration.

## 🛠 Tech Stack
- **HTML5:** Semantic structure, ARIA accessibility attributes, Schema.org JSON-LD structured data.
- **CSS3:** Custom variables, Deep Ocean palette, Glassmorphism, smooth animations.
- **Vanilla JS (ES Modules):** Clean architecture with VisionEngine simulator.
- **Development Tooling:** Vite dev server and build pipeline.
- **Hosting:** GitHub Pages.

## 💻 Local Development
```bash
npm install
npm run dev
```

## 📂 Project Structure
```
/css
  style.css      # Design System, layout, animations & modal
/js
  main.js        # Controller for parallax, spotlight, modals & UI state
  vision_engine.js # Conchological vision analysis simulation & samples
/design-system
  MASTER.md      # Deep Ocean design tokens & pattern specifications
/docs
  PLAN-monetaria-website.md # Development roadmap & requirements
package.json     # Vite tooling & dependencies
index.html       # Main landing page
robots.txt       # Crawler directives
sitemap.xml      # Search engine indexing map
```

## 🚀 Deployment
Hosted via [GitHub Pages](https://pages.github.com/).
**Live URL:** [https://dds-solutions.github.io/monetaria/](https://dds-solutions.github.io/monetaria/)

## 📄 License
© 2026 DDS Solutions. All rights reserved.
