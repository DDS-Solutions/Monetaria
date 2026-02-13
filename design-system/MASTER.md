# Monetaria Design System: The Curator's Cabinet

**Vibe:** Premium, Scientific, Tactile, Heritage.
**Keywords:** Mahogany, Brass, Specimen, Precision, Gallery.

---

## 1. Color Palette

### Primary (The Cabinet)
- **Mahogany Deep:** `#3E2723` (Backgrounds, Footers)
- **Mahogany Rich:** `#5D4037` (Cards, Drawer Fronts)
- **Velvet Black:** `#1A1A1A` (Hero Backgrounds, Contrast)

### Accents (The Hardware)
- **Brass Gold:** `#C5A065` (Primary Buttons, Highlights, Borders)
- **Brass Light:** `#E6C996` (Hover States, Icons)

### Functional (The Science)
- **Scientific White:** `#F5F5F5` (Text, Data Panels)
- **Data Blue:** `#64B5F6` (AI Confidence Scores, Links)
- **Alert Red:** `#EF5350` (Defect Heatmaps)

---

## 2. Typography

### Headings (Heritage)
**Font:** `Playfair Display` (Serif)
- **H1:** 4.5rem, Weight 700, Letter-spacing -0.02em (Hero)
- **H2:** 3rem, Weight 600 (Section Headers)
- **H3:** 1.5rem, Weight 600 (Card Titles)

### Body & Data (Precision)
**Font:** `Inter` (Sans-serif)
- **Body:** 1rem, Weight 400, Line-height 1.6
- **Captions:** 0.875rem, Weight 500 (Image definitions)

### Technical Specs (Taxonomy)
**Font:** `JetBrains Mono` or `Roboto Mono`
- **Use for:** Species names, lat/long data, grade scores (e.g., "F++", "Gem")

---

## 3. UI Components

### Cards ("The Specimen Drawer")
- **Background:** Mahogany Rich (`#5D4037`) with a subtle wood grain texture (CSS pattern).
- **Border:** 1px Solid Brass Gold (`#C5A065`) opacity 0.3.
- **Shadow:** Deep drop shadow to create depth (`box-shadow: 0 10px 30px rgba(0,0,0,0.5)`).

### Buttons ("The Brass Plate")
- **Primary:** Solid Brass Gold background, Dark Mahogany text. Uppercase, tracked out (`letter-spacing: 1px`).
- **Secondary:** Transparent background, Brass Gold border.

### Visual Effects
- **"Museum Glass":** Glassmorphism used ONLY for AI overlays.
    - `background: rgba(255, 255, 255, 0.05)`
    - `backdrop-filter: blur(10px)`
    - `border: 1px solid rgba(255, 255, 255, 0.1)`
- **"Spotlight":** Radial gradients in CSS to mimic museum track lighting on hero objects.

---

## 4. UX Patterns
- **Scroll Reveal:** Elements shouldn't just "appear"; they should feel like a drawer sliding open.
- **Hover States:** Specimen cards should lift (transform Y) and "gloss up" (brightness filter).
- **Micro-interactions:** Buttons should have a metallic "sheen" animation on hover.

---

## 5. Accessibility & Performance
- **Contrast:** Ensure Brass text on Mahogany meets WCAG AA.
- **Images:** All shell images must be WebP, lazy-loaded. Alt text must describe species and condition.
- **Motion:** Respect `prefers-reduced-motion`.
