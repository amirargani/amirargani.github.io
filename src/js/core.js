/**
 * Amir Argani - Core Page Controller & Localisation
 *
 * Translations are loaded from:
 *   translations/de.js  → window.de
 *   translations/en.js  → window.en
 */

var translations = { de, en };

// Global variables
let currentLang = localStorage.getItem("portfolio_lang") || "en";

// Load HTML fragments from src/htm into elements with data-include
async function loadHtmlIncludes() {
  const includes = document.querySelectorAll("[data-include]");
  await Promise.all(Array.from(includes).map(async (element) => {
    const url = element.getAttribute("data-include");
    if (!url) return;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.status}`);
      }
      element.innerHTML = await response.text();
    } catch (error) {
      console.error("HTML include failed:", url, error);
      element.innerHTML = `<!-- HTML include failed: ${url} -->`;
    }
  }));
}

// Calculate dynamic category percentages based on bottom subcategories
function calculateCategoryPercentages() {
  const radialProgresses = document.querySelectorAll(".radial-progress[data-category]");
  radialProgresses.forEach(item => {
    const catKey = item.getAttribute("data-category");
    // Find the category card in the bottom grid
    const bottomTitle = document.querySelector(`.skill-cat-card h3[data-i18n="${catKey}"]`);
    if (bottomTitle) {
      const card = bottomTitle.closest(".skill-cat-card");
      if (card) {
        const skillItems = card.querySelectorAll(".skill-list .skill-item");
        let total = 0;
        let count = 0;
        skillItems.forEach(skill => {
          const progressAttr = skill.getAttribute("data-progress");
          if (progressAttr) {
            total += parseInt(progressAttr, 10);
            count++;
          }
        });
        const average = count > 0 ? Math.round(total / count) : 0;
        item.setAttribute("data-progress", average);

        const valElem = item.querySelector(".gauge-val");
        if (valElem) {
          valElem.textContent = `${average}%`;
        }
        const barValElem = item.querySelector(".bar-val");
        if (barValElem) {
          barValElem.textContent = `${average}%`;
        }
        const colValElem = item.querySelector(".column-val");
        if (colValElem) {
          colValElem.textContent = `${average}%`;
        }
      }
    }
  });
}

// Function to update the page texts
function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("portfolio_lang", lang);

  // Update HTML lang attribute
  document.documentElement.setAttribute("lang", lang);

  // Find all elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      element.innerHTML = translations[lang][key];
    }
  });

  // Translate Reload button tooltip dynamically
  const reloadBtn = document.getElementById("cert-modal-reload");
  if (reloadBtn) {
    const titleText = lang === "de" ? "PDF neu laden" : "Reload PDF";
    reloadBtn.setAttribute("title", titleText);
    reloadBtn.setAttribute("aria-label", titleText);
  }

  // Handle active states on language switch buttons
  document.querySelectorAll(".lang-btn").forEach(btn => {
    const btnLang = btn.getAttribute("data-lang");
    if (btnLang === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Calculate dynamic percentages for circular gauges (data-progress set here)
  calculateCategoryPercentages();

  // Dynamic charts translation redraw (safety checked since charts.js loads after core.js)
  if (typeof animateFeaturedCharts === "function") {
    animateFeaturedCharts();
  }
}

// Skill bars progress animation — runs once on page load with stagger
function animateSkillBars() {
  const skillItems = document.querySelectorAll(".skill-item, .radial-progress");

  skillItems.forEach((item, index) => {
    const progress = item.getAttribute("data-progress");
    const delay = index * 55; // 55ms stagger between each bar/circle

    // Animate linear progress bar
    const bar = item.querySelector(".progress-bar-fill");
    if (bar) {
      bar.style.transition = "none";
      bar.style.width = "0%";         // reset to start
      bar.getBoundingClientRect();    // force reflow
      setTimeout(() => {
        bar.style.transition = "width 1.4s cubic-bezier(0.16, 1, 0.3, 1)";
        bar.style.width = `${progress}%`;
      }, delay);
    }

    // Animate radial progress ring
    const circle = item.querySelector(".progress-circle-fill");
    if (circle) {
      const radius = (circle.r && circle.r.baseVal && circle.r.baseVal.value > 0) ? circle.r.baseVal.value : 45;
      const circumference = 2 * Math.PI * radius;
      const targetOffset = circumference - (progress / 100) * circumference;

      circle.style.transition = "none";
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = circumference; // reset to empty
      circle.getBoundingClientRect();                 // force reflow
      setTimeout(() => {
        circle.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)";
        circle.style.strokeDashoffset = targetOffset;
      }, delay);
    }
  });
}

// Setup reveal animations on scroll
function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll(".reveal");
  const skillsFeatured = document.querySelector(".skills-featured");
  let circlesAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // fire once per element

        // 1) Circular gauges: animate when the featured gauge row enters view
        if (!circlesAnimated && entry.target.classList.contains("skills-featured")) {
          circlesAnimated = true;
          setTimeout(() => animateRadialCircles(), 150);
        }

        // 2) Linear bars: animate per card when each skill-cat-card enters view
        if (entry.target.classList.contains("skill-cat-card")) {
          setTimeout(() => animateBarsInCard(entry.target), 150);
        }
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  animatedElements.forEach(el => observer.observe(el));
}

// Dynamic counter animation helper
function animateTextCounter(element, targetValue) {
  if (!element) return;
  let current = 0;
  const duration = 1200; // Match transition time
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
    current = Math.round(easeProgress * targetValue);
    element.textContent = `${current}%`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = `${targetValue}%`;
    }
  }
  requestAnimationFrame(update);
}

// Legacy: kept for compatibility (e.g. language switch scenario)
function animateRadialCircles() {
  if (typeof animateFeaturedCharts === "function") {
    animateFeaturedCharts();
  }
}

// Animate only the linear progress bars inside a given skill category card
function animateBarsInCard(card) {
  const bars = card.querySelectorAll(".skill-item");
  bars.forEach((item, index) => {
    const progress = parseInt(item.getAttribute("data-progress") || "0", 10);
    const bar = item.querySelector(".progress-bar-fill");
    if (!bar) return;

    // Reset to 0 (no transition)
    bar.style.transition = "none";
    bar.style.width = "0%";

    // Double rAF: ensures browser has painted reset before transition starts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          bar.style.transition = "width 1.4s cubic-bezier(0.16, 1, 0.3, 1)";
          bar.style.width = `${progress}%`;
        }, index * 80);
      });
    });
  });
}

// Compatibility wrapper
function animateSkillBars() {
  animateRadialCircles();
  document.querySelectorAll(".skill-cat-card").forEach(card => animateBarsInCard(card));
}

// Core setup triggers inside DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  loadHtmlIncludes().then(() => {
    // Setup language toggle triggers
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const selectedLang = btn.getAttribute("data-lang");
        updateLanguage(selectedLang);
      });
    });
  });

  // Mobile menu control
  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      mobileToggle.classList.toggle("active");
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        mobileToggle.classList.remove("active");
      });
    });
  }

  // Set initial language
  updateLanguage(currentLang);

  // Setup visual scroll animations
  setupScrollAnimations();

  // Back to Top Button logic
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});
