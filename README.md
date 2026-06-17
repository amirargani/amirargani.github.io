# Amir Argani | Data Scientist & Software Engineer

Welcome to the official repository for my interactive, ultra-modern, and premium developer portfolio website.

🌐 **Live Site**: [https://amirargani.github.io/](https://amirargani.github.io/)

---

## 🚀 Badges & Core Stack

[![License](https://img.shields.io/badge/License-Apache_2.0-D22128?style=for-the-badge&logo=apache)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Shell Script](https://img.shields.io/badge/Shell_Script-4EAA25?style=for-the-badge&logo=gnu-bash&logoColor=white)](https://www.gnu.org/software/bash/)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)](https://pages.github.com/)



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
  * Features 5 specialized data visualization modes: **Radial Gauges (Default)**, an **Interactive Radar/Spider Chart**, a **Skill Bubble Matrix** (Expertise vs. Frequency), a **Horizontal Bar Chart**, and a **Line & Area Chart**.
  * Interactive category pointers that smoothly scroll to detail cards with custom neon glow pulse animations on click.
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
    │   ├── app.css        # Thematic progress card fills, certificate modals, and togglers
    │   └── font.css       # Local self-hosted font-face declarations
    ├── fav/               # Local optimized favicon and app icon files
    │   ├── favicon.ico    # Legacy fallback multi-resolution browser icon
    │   ├── favicon-16x16.png  # Standard 16x16 browser tab favicon
    │   ├── favicon-32x32.png  # Standard 32x32 browser tab favicon
    │   └── apple-touch-icon.png  # Apple iOS homescreen bookmark touch icon
    ├── font/              # Local self-hosted Web Open Font Format (WOFF2) font files
    │   ├── Inter-*.woff2  # Inter font weights (Light, Regular, Medium, SemiBold)
    │   └── Outfit-*.woff2 # Outfit font weights (Regular, Medium, SemiBold, Bold, ExtraBold)
    ├── icon/              # Static vector icon assets directory
    ├── js/                # Client-side JavaScript modules directory
    │   ├── core.js        # Core bilingual translation hooks, counters, and smooth scrolling
    │   ├── charts.js      # Skills dashboard visualizer (Radar, Matrix, Line, Bar charts)
    │   ├── fonts.js       # Dynamic fonts loader module (Google Fonts CDN vs local fallback)
    │   └── app.js         # Modal retry mechanics, repository filters, and animations
    ├── py/                # Auxiliary Python utility scripts directory
    │   ├── compile_icons.py # Optimizes and compiles static SVGs into inline skillIcons JS module
    │   ├── generate_favicons.py # Downloads user GitHub avatar and generates local multi-res favicon files
    │   ├── download_fonts.py # Automates downloading and staging of local font assets
    │   ├── consolidate_translations.py # Consolidates duplicate translation values in locale mappings
    │   ├── find_duplicates.py # Scans and reports duplicate translation keys
    │   └── find_duplicate_values.py # Identifies identical translation values across keys
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

Refer to the [Changelog.md](Changelog.md) for a detailed history of changes and new features.

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
