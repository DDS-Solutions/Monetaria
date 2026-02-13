# Monetaria Design System: Deep Ocean

**Vibe:** Bioluminescent, Deep Sea, Premium, Scientific.
**Keywords:** Abyss, Cyan, Gold, Glass, Precision.

---

## 1. Color Palette

### Primary (The Abyss)
- **Ocean Dark:** `#051219` (Main Background - The Abyss)
- **Ocean Medium:** `#0D2438` (Cards/Drawers - Midnight Zone)
- **Ocean Light:** `#1A3A4A` (Headers/Overlays - Twilight Zone)

### Accents (Bioluminescence)
- **Cyan Neon:** `#00E5FF` (Primary Action, Glows, "Gem" Grading)
- **Cyan Dark:** `#00B8D4` (Borders, Depth)

### Value (The Treasure)
- **Gold:** `#FFFFD54F` (Secondary Buttons, Prices, Species Names)

### Functional
- **Text Primary:** `#FFFFFF`
- **Text Muted:** `#B0BEC5` (Blue-Grey)
- **Error/Defect:** `#FF5252`

---

## 2. Typography

### Headings (Display)
**Font:** `Georgia` (Serif)
- **H1, H2, H3:** Matches app's usage of serif for scientific/display text.
- **Weight:** Bold.

### Body (UI)
**Font:** `Inter` or `system-ui` (Sans-serif) for readability on web, backing up `Georgia` if needed for stylistic consistency with app.
*Note: App uses Georgia for body too, but for web legibility, we might blend Inter for long text while keeping Georgia for headers.*

---

## 3. UI Patterns

### Glassmorphism (Ocean Glass)
- Background: `rgba(13, 36, 56, 0.7)`
- Border: `1px solid rgba(0, 229, 255, 0.3)`
- Blur: `backdrop-filter: blur(12px)`

### Shadows (Depth)
- Cyan Glow: `0 0 15px rgba(0, 229, 255, 0.3)`
- Deep Drop: `0 10px 30px rgba(0, 0, 0, 0.8)`

---

## 4. Components

### Hero
- Gradient: Linear from Top (`Ocean Light`) to Bottom (`Ocean Dark`).
- Effect: "Bioluminescent Particles" (JS).

### Cards
- Background: `Ocean Medium`
- Border: `Cyan Dark`
- Hover: `Cyan Neon` border + Glow.
