This Design System documentation is reverse-engineered from the provided portfolio landing page for "Jethro Adebisi."

# Design System: "Cyber-Minimalist Engineer"

## 1. Core Principles
*   **Technical Brutalism**: The use of monospace fonts and high-contrast accents evokes a terminal-like, developer-centric aesthetic.
*   **Immersive Interactivity**: The removal of the default system cursor in favor of a custom, GSAP-animated cursor and noise overlay suggests a highly curated, "app-like" experience rather than a standard document-style website.
*   **Depth through Texture**: Instead of heavy shadows, the design uses a subtle SVG noise filter and low-opacity white layers (`rgba`) to create depth on a near-black background.
*   **Precision & Clarity**: High-contrast text against a dark background ensures readability while maintaining a "dark mode" default.

## 2. Color Palette

### Base Colors
| Role | Hex / Value | Tailwind Equivalent (Approx) |
| :--- | :--- | :--- |
| **Background** | `#050505` | `bg-[#050505]` (Near Black) |
| **Primary Text** | `#e2e8f0` | `text-slate-200` |
| **Accent** | `#00FFC2` | `text-[#00FFC2]` (Electric Cyan) |

### UI Surfaces
| Role | Value | Description |
| :--- | :--- | :--- |
| **Card Background** | `rgba(255, 255, 255, 0.03)` | Ultra-subtle translucent white |
| **Border** | `rgba(255, 255, 255, 0.1)` | Low-contrast hairline borders |
| **Noise Overlay** | `opacity: 0.04` | Global texture overlay |

## 3. Typography
The system relies exclusively on a single monospace family to reinforce the "Engineer" persona.

*   **Primary Font**: `Space Mono`, monospace (Google Fonts).
*   **Weights**: 400 (Regular), 700 (Bold).
*   **Scale**:
    *   **Body**: Defaulting to `16px` via Tailwind's base, color `slate-200`.
    *   **Headings**: (Inferred) Likely uppercase or bold weights to distinguish hierarchy without switching font families.

## 4. Spacing & Layout
*   **Framework**: Tailwind CSS (Utility-first).
*   **Scrolling**: `scroll-smooth` enabled for internal navigation.
*   **Layout Patterns**:
    *   **Fixed Overlays**: The noise texture and custom cursors are fixed to the viewport (`z-index: 9999+`).
    *   **Containerization**: Uses standard Tailwind spacing, but emphasizes full-screen immersion.

## 5. Components

### Custom Cursor (Interactive)
*   **Main Pointer**: 20px x 20px circle, background color `var(--accent)`.
*   **Blend Mode**: `mix-blend-mode: difference` (allows the cursor to invert colors of elements it passes over).
*   **Follower**: A larger, 40px secondary element (GSAP-driven) to provide "lagged" visual feedback.

### Cards / Containers
*   **Style**: Flat, no box-shadow.
*   **Fill**: `var(--card-bg)`.
*   **Stroke**: 1px solid `var(--border)`.

### Global Effects
*   **Noise Filter**: A persistent SVG fractal noise filter applied via a fixed `div` to give the digital screen a tactile, analog feel.

## 6. Iconography
*   **Style**: While not explicitly rendered in the snippet, the tech stack and aesthetic suggest the use of **Lucide-React** or **Phosphor Icons**—specifically thin-stroke (2px) icons that match the technical weight of `Space Mono`.

---

## Reference HTML

```html
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jethro Adebisi | Engineer & Designer</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <!-- CSS / Frameworks -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

    <style>
        :root {
            --accent: #00FFC2;
            --bg: #050505;
            --card-bg: rgba(255, 255, 255, 0.03);
            --border: rgba(255, 255, 255, 0.1);
        }

        body {
            font-family: 'Space Mono', monospace;
            background-color: var(--bg);
            color: #e2e8f0;
            cursor: none;
        }

        /* Noise Overlay */
        .noise {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            opacity: 0.04;
            z-index: 9999;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .custom-cursor {
            width: 20px;
            height: 20px;
            background: var(--accent);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 10000;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        }

        .cursor-follower {
            width: 40px;
            height: 4
```