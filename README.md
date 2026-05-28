# Amir Argani | Data Scientist & Software Engineer

Welcome to the official repository for my interactive, ultra-modern, and premium developer portfolio website.

🌐 **Live Site**: [https://amirargani.github.io/](https://amirargani.github.io/)

---

## 🚀 Badges & Core Stack

[![License](https://img.shields.io/badge/License-Apache_2.0-D22128?style=for-the-badge&logo=apache)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)](https://pages.github.com/)
[![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)



---

## 📌 Table of Contents

- [🚀 Badges & Core Stack](#-badges--core-stack)
- [📖 About the Project](#-about-the-project)
- [🌟 Key Features](#-key-features)
- [🛠️ Technology Stack](#️-technology-stack-portfolio-frontend)
- [📂 Project Structure](#-project-structure)
- [💻 Local Development & Testing](#-local-development--testing)
- [📋 Changelog](#-changelog)
- [⚡ Deployment & Workflow Automation](#-deployment--workflow-automation)
- [⚖️ License](#️-license)

---

## 📖 About the Project

This project is a high-performance, single-page application (SPA) portfolio built using standard modern frontend technologies. It is designed to act as an immersive showcase of my engineering skills, professional experiences, and open-source contributions. 

The website is engineered with a **dark-mode glassmorphic design system**, custom neon drop shadows, fluid interactive micro-animations, and complete bilingual support.

---

## 🌟 Key Features

* **Bilingual Localization System**: Built-in translation engine supporting instantaneous, reactive toggling between **German (DE)** and **English (EN)** without page reloads.
* **Interactive Dynamic Dashboard**: 
  * 8 circular progress gauges mapping primary tech categories.
  * Interactive category pointers that smoothly scroll to detail cards with neon glow pulse animations on click.
* **Live GitHub Accordion Showcase**: Custom-engineered repository gallery that fetches and categorizes my top 10 open-source repositories using interactive, CSS-animated `<details>` and `<summary>` wrappers.
* **Advanced Thematic Styling**: Unique, highly premium neon layouts including custom radial pulsing glows, premium neon card borders, and responsive styling.
* **Keychain-Safe Publishing Helper**: Interactive shell-script verification for seamless, single-command production updates.

---

## 🛠️ Technology Stack (Portfolio Frontend)

* **Structure**: Standard HTML5 (Semantic elements)
* **Styling**: Vanilla CSS3 (Custom design tokens, Flexbox, CSS Grid, media query breakpoints, and keyframe animations)
* **Interactivity**: Pure Javascript (ES6+)
* **Hosting**: GitHub Pages (Static website hosting)
* **Version Control**: Git

---

## 📂 Project Structure

```text
amirargani.github.io/
├── .gitattributes         # Git path-specific configurations (line ending normalization)
├── .gitignore             # File and directory patterns to ignore in Git
├── LICENSE                # Apache License 2.0 file
├── README.md              # Comprehensive project documentation, structure and changelog
├── index.html             # Main single-page portfolio application entry point
├── publish.sh             # Interactive helper script to automate Git commits and deploys
└── src/                   # Application source code directory
    ├── css/               # Stylesheets directory
    │   ├── styles.css     # Global style tokens, custom scrollbar, and navigation frame
    │   ├── core.css       # Modular styling system utilities and layout frames
    │   └── app.css        # Thematic progress card fills, certificate modals, and togglers
    ├── fav/               # Local optimized favicon and app icon files
    │   ├── favicon.ico    # Legacy fallback multi-resolution browser icon
    │   ├── favicon-16x16.png  # Standard 16x16 browser tab favicon
    │   ├── favicon-32x32.png  # Standard 32x32 browser tab favicon
    │   └── apple-touch-icon.png  # Apple iOS homescreen bookmark touch icon
    ├── icon/              # Static vector icon assets directory
    ├── js/                # Client-side JavaScript modules directory
    │   ├── core.js        # Core bilingual translation hooks, counters, and smooth scrolling
    │   ├── charts.js      # Skills dashboard visualizer (Radar, Matrix, Line, Bar charts)
    │   └── app.js         # Modal retry mechanics, repository filters, and animations
    ├── py/                # Auxiliary Python utility scripts directory
    │   ├── compile_icons.py # Optimizes and compiles static SVGs into inline skillIcons JS module
    │   └── generate_favicons.py # Downloads user GitHub avatar and generates local multi-res favicon files
    └── translations/      # Localization language directory
        ├── de.js          # German locale translation mappings
        └── en.js          # English locale translation mappings
```

---

## 💻 Local Development & Testing

For local development and testing, particularly when verifying browser-specific assets like favicons in Safari, it is highly recommended to run a local web server rather than opening `index.html` directly via the `file://` protocol (since Safari and other modern browsers block favicon rendering on the local filesystem for security reasons).

To run a quick local development server:
1. Open your terminal in the root of the repository.
2. Start Python's built-in HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
3. Navigate to the local server in your browser:
   ```text
   http://localhost:8000
   ```

> [!TIP]
> **Safari Favicon Caching**: Safari caches website icons aggressively in a persistent system-level cache (`~/Library/Safari/Favicon Cache/`). If you make updates to favicons and they do not appear, open a **Safari Private Window** to view them immediately, or clear the system-level favicon cache folder.

---

## 📋 Changelog

All notable enhancements to this repository are documented below:

### [v1.1.0]
#### Added
* **Manual Reload Option**: Integrated a custom-styled, bilingual SVG Reload button with an active glowing cyan hover state directly in the PDF modal header.
* **Bilingual Tooltips**: Implemented runtime translation hooks in `core.js` to dynamically localize the tooltips and accessibility tags ("Reload PDF" / "PDF neu laden") depending on the active locale.
* **Dark Loading Backdrop Overlay**: Re-engineered the PDF loader overlay (`#pdf-loader`) with a full-screen glassmorphic backdrop (`rgba(10, 11, 18, 0.95)` with a `4px` blur), eliminating browser-specific iframe white flashes for seamless dark-mode transitions.
* **Interactive Retry Fallback Overlay**: Added a fail-safe interactive recovery overlay (`#pdf-loader-error`) that prompts the user with a bilingual warning if the proxy connection times out after 3 loading attempts (approx. 16.5 seconds), offering a manual reload click trigger.
* **New Technical Skill**: Added Apache Spark (62%) to the *Data Analysis & BI Tools* category with complete bilingual translation mappings and automated average score recalculations.
* **Full-Width Skill Cards Layout**: Redesigned the Skills Dashboard category cards to utilize a sleek full-width single-column layout, ensuring clean grid symmetry and maximum text and progress bar readability.
* **Custom SVG Icons Compilation**: Compiled and optimized 34 high-fidelity, single-color SVG assets from the `src/icon/` directory directly into `app.js`, stripping redundant metadata and mapping dark fills to `currentColor` for dynamic theme integrations.
* **Dynamic SVG Chart Label Translation**: Hooked the global `animateFeaturedCharts()` routine directly into `updateLanguage()` in `core.js` to automatically translate and refresh all interactive SVG chart labels (Radar, Scatter Matrix, Line, Bar) dynamically upon toggling language modes.
* **Local Favicon Integration**: Migrated the remote avatar references to robust local resources in the new `src/fav/` directory (`favicon.ico`, `favicon-32x32.png`, `favicon-16x16.png`, and `apple-touch-icon.png`) for offline reliability and clean localized asset management.

#### Fixed
* **Flickering & Abort Errors**: Eliminated transient "PDF was not displayed" proxy errors by removing an aggressive 1.2-second unconditional iframe reload timer.
* **Auto-Retry & Safety Loop**: Structured a robust auto-retry connection loop in `app.js` (up to 3 attempts, waiting 5.5 seconds each) utilizing query timestamps to force a fresh proxy load.
* **Thread Cleanup**: Introduced modal lifecycle cleanup bindings (`activePdfCancelFn`) to instantly cancel all pending retry timeouts on close, preventing background network memory leaks.
* **Mobile Skills Viewport Optimization**: Disabled and hid the complex circular gauge switcher on mobile viewports (widths <= 576px), automatically routing the default dashboard view to the highly responsive Radar chart.
* **Mobile PDF Modal Viewport Height**: Rescaled the certificate modal dialog box on mobile screens to `min(78vh, 540px)` to perfectly match the aspect ratio of standard A4 documents and eliminate the empty black void below the iframe.
* **Mobile & Tablet Repository Filter Optimization**: Compacted all repository category filters into sleek circular icon badges on viewport widths <= 1024px, ensuring all five filters align cleanly in a single row without awkward text wraps.
* **Machine Learning Icon Background Fix**: Fixed the solid square rendering blockage on the *Machine Learning* icon by removing a redundant transparent Illustrator bounding-box rect which lost its `fill: none` styling after tag cleanups.
* **Theme-specific Row Hover Highlights**: Replaced rigid, alternating row hover highlights with dynamic `:has()` parent card selectors, ensuring the glowing border and icon highlight perfectly match the specific category's brand color (solving the purple hover clash on the green Databases card).

### [v1.0.9]
#### Fixed
* **PDF Viewer Stability**: Resolved the intermittent first-load blank PDF startup in Safari/Chrome/Edge by resetting the iframe to `about:blank`, then reloading with a cache-busting Google Docs Viewer URL and keeping the loader visible until actual load completion.
* **Bilingual PDF Loader**: Added translation support for the certificate loading text via the new `cert_loader_text` key, so the modal shows the correct language in both English and German.
* **Safari Right-Click Protection**: Reverted the Safari-native PDF embed path introduced in commit `af8cb55` because it bypassed our right-click blocker. The viewer now uses the stable shared Google Docs Viewer path again to reliably disable context-menu actions while the modal is open.
* **JavaScript Bugfix**: Corrected the missing closing brace in `openPdfModal()` and restored a clean modal open/close flow.

### [v1.0.8]
#### Added
* **Dynamic Interactive Charts Expansion**: Upgraded the Skills Dashboard to feature five specialized, interactive data visualization views:
  * **Radial Gauges (Default)**: Visual circular progress gauges mapping technical categories.
  * **Interactive Radar Chart**: A premium polygonal spider-chart visualization.
  * **Skill Bubble Matrix**: An interactive 2D bubble scatter plot showing category Expertise vs. Frequency of Use.
  * **Horizontal Bar Chart**: Clean linear comparator rows with custom animations.
  * **Line & Area Chart**: A continuous visual trend chart with custom glowing gradient areas.
* **Stable Layout Dimensioning**: Standardized the glassmorphic Skills featured `.glow-card` container height to a perfectly stable `520px` (with standard uniform `3rem 2rem` padding) on desktop to guarantee zero jumpiness or layout shifting when toggling between the five views.
* **High-Performance Modular Script Split**: Separated the single, large JavaScript file into three specialized modules loaded sequentially in `index.html` to optimize execution speeds:
  * `src/js/core.js`: Framework core (multilingual translations engine, dynamic counter/average maths, scroll reveal observers, mobile menus, and back-to-top buttons).
  * `src/js/charts.js`: Dashboard visualizer (Data configurations, dynamic SVG path builders, vertex animations, and view togglers).
  * `src/js/app.js`: Interactive components (Mouse glows, Base64 PDF viewer modal triggers, repo filters, and hashless smooth scrolls).
* **Dynamic DOM-Based Tooltip Extraction**: Designed a utility function `getSubSkillsFromDOM(catKey)` that dynamically traverses the DOM, extracting localized sub-skill name strings and progress percentages from the bottom skill category cards. Hooked this extractor into the Radar, Bar, and Line charts to show live translated details on hover.
* **Pulsing Green Status Dot**: Added a highly premium, glowing Apple-style status indicator dot next to the **LIVE** dashboard title inside the header of the glassmorphic IDE frame. Powered by a custom infinite CSS keyframe breath animation (`live-pulse-glow`).
* **Sliding Capsule Highlight Backdrop**: Engineered a sliding capsule highlight background (`.toggle-slider`) behind the dashboard buttons with a custom elastic ease transition (`transition: left 0.35s cubic-bezier(0.25, 1, 0.5, 1)`) and high-performance Javascript positioning.
* **Branding Suffix Cleanups & Version Placement**:
  * Removed unnecessary verbose suffixes like `(Scikit-Learn, Regression, etc.)`, `(Business Central)`, and `(S3, IAM, EC2, RDS, Lambda, etc.)` from technical skill labels for a cleaner, modern look.
  * Positioned the project release version `v1.0.8` elegantly below the logo in the header with mobile media query alignment.

### [v1.0.7]
#### Added
* **Fluid Fullwidth Footer Watermark**: Implemented an ultra-premium fluid typography system using CSS `clamp(3.2rem, 16vw, 20rem)` and proportional `em` letter spacing (`-0.04em`). The giant `AMIRARGANI` watermark now scales fluidly and seamlessly to span the full screen width (**Fullwidth**) across all resolutions without any jumps, overlaps, or horizontal scrollbar overflows.
* **Balanced 2-Column Skills Grid**: Optimized `.skills-grid-wrapper` to display the 10 Skill Category Cards in a stunning 2-column grid on desktop viewports (`> 992px`), cutting vertical scrolling distance in half and creating perfect layout symmetry.
* **Adaptive Card Paddings**: Dynamically scaled card paddings (`.glow-card`, `.skill-cat-card`, `.cert-card`) from `2.5rem` down to `1.25rem` (20px) on mobile viewports to maximize readable screen space.
* **Typography Scaling**: Adjusted heading size of `.project-details h3` and overall padding balances under smaller viewports to prevent awkward line breaks and guarantee premium readability.

### [v1.0.6]
#### Added
* **Interactive Watermark Logo**: Integrated a giant, semi-transparent watermark logo `AMIRARGANI` at the absolute bottom of the footer, beautifully bleeding off the page.
* **AI Scan Line Animation**: Added a looping background scan line animation (`aiLaserScan`) that sweeps a glowing cyan laser back and forth across the watermark using `background-clip: text`.
* **Pixel-Perfect Responsive Spacing**: Optimized vertical spacing on all viewports using fluid, mathematically proportional viewport sizing to ensure consistent spacing between copyright text and the footer watermark.
* **Branded GitHub Icon Integration**: Replaced generic external-link arrow icons with the official GitHub logo SVG on both the main repositories button and all individual project links for a cohesive brand identity.
* **Refined Accordion Hover Physics**: Aligned all accordion project button hovers with the site's default lift animation (`translateY(-3px)`) while keeping inline icons static relative to the text.
* **Custom SVG Icons in Hero Section**: Integrated modern line-art SVG icons (briefcase for career roles and map-pin for preferences) inside translation-safe containers to prevent icon loss during language switches.
* **English-First Default Localization**: Translated all remaining hardcoded German elements, meta tags, and ARIA labels in `index.html` to establish English as the professional default language while maintaining full toggle support.

### [v1.0.5]
#### Added
* **Dynamic Footer Year**: Upgraded the footer copyright text to utilize a dynamic JavaScript date function (`new Date().getFullYear()`), ensuring the displayed year automatically updates to the current year.

### [v1.0.4]
#### Fixed
* **Google Docs Viewer Initialization**: Resolved a known Google Docs Viewer iframe bug where the PDF would load as a blank screen on the first click. Implemented a forced layout computation delay (`100ms`) and dynamic timestamp query parameters (`&t=...`) to aggressively bypass proxy caching and ensure reliable rendering.

### [v1.0.3]
#### Added
* **Clean URL Navigation**: Intercepted anchor links via JavaScript to enable buttery smooth scrolling to sections while completely suppressing the `#hash` from appearing in the browser's address bar, maintaining a pristine `https://amirargani.github.io/` base URL at all times.

### [v1.0.2]
#### Added
* **Link Obfuscation**: Upgraded security by internally Base64-encoding all PDF source URLs in the HTML so that raw asset links cannot be scraped or seen in plain text by inspecting the source code.
* **Safari Scroll Performance**: Restructured the Google Docs Viewer iframe to utilize internal viewport optimization, completely eliminating load delay and scroll lag on iOS and macOS Safari.

### [v1.0.1]
#### Added
* **Certificates Showcase**: Integrated a new section to display official Data Science certificates.
* **Secure PDF Viewer**: Engineered a custom modal using Google Docs Viewer to display PDFs natively on all browsers while forcefully preventing native downloads (especially overriding Safari's un-removable HUD) and fully blocking right-click/context menus.
* **Consistent Button Styling**: Standardized global button CSS so all action buttons mirror the premium LinkedIn button aesthetic perfectly.

### [v1.0.0]
#### Added
* **Premium Portfolio Core**: Implemented a responsive single-page portfolio with glassmorphism layout, fluid animations, and customized circular progress gauges.
* **Bilingual Switcher**: Integrated immediate translation support between German (`DE`) and English (`EN`) across all pages.
* **GitHub Repository Accordion**: Dynamic, interactive accordions showcasing 10 open-source repositories, categorised and filterable via modern SVG vector icons.
* **Mobile Screen Language Switcher**: Repositioned the `DE`/`EN` buttons next to the mobile menu hamburger button for perfect, responsive vertical alignment.
* **LinkedIn Connection CTA**: Upgraded the main contact button to point directly to LinkedIn (*"Auf LinkedIn vernetzen"* / *"Connect on LinkedIn"*) with safe blank targets.
* **Apache License 2.0**: Added the official `LICENSE` file for open-source compliance and copyright protection.
* **Automated Publishing Script**: Created the interactive `publish.sh` shell helper to automate local commits, remote links, and secure HTTPS pushes to GitHub Pages.
* **Repository Configurations**: Configured professional `.gitignore` and `.gitattributes` filters to normalize line endings (`eol=lf`), protect binary media assets, and keep public stats pure.


---

## ⚡ Deployment & Workflow Automation

To make updates fast and friction-free, I've created an automated deployment script: **`publish.sh`**. 

To publish new code changes to your live GitHub Pages site, simply run:
```bash
./publish.sh
```

### Script Execution Flow:
1. Verifies local Git status and completes any pending local commits on the `main` branch.
2. Ensures the repository remote points securely to `amirargani.github.io.git`.
3. Handles publishing and secure remote pushes over HTTPS.
4. Triggers the automatic GitHub Pages Actions build pipeline.

---

## ⚖️ License

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the `LICENSE` file for the specific language governing permissions and limitations under the License.
