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

## 📋 Changelog

All notable enhancements to this repository are documented below:

### [v1.0.0] - 2026-05-24
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
