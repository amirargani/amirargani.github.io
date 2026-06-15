/**
 * Amir Argani - Core Page Controller & Localisation
 *
 * Translations are loaded from:
 *   translations/de.js  → window.de
 *   translations/en.js  → window.en
 */

var translations = { de, en };

// Global variables representing current application state
let currentLang = localStorage.getItem("portfolio_lang") || "en";

/**
 * Asynchronously loads HTML fragments from specified paths inside 'data-include' attributes
 * and injects them directly into the target containers. Utilizes Promise.all to fetch
 * fragments concurrently for optimal loading performance.
 * 
 * @returns {Promise<void>} Resolves when all HTML includes have been processed and loaded.
 */
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

/**
 * Calculates the dynamic average progress for skill categories based on their
 * underlying sub-skills. Updates the circular gauges, computes overall expertise
 * percentage for the dashboard KPI cards, updates practical experience duration,
 * certificate counts, and GitHub repository metrics.
 */
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

  // Calculate dynamic overall average for the KPI card
  let overallTotal = 0;
  let overallCount = 0;
  radialProgresses.forEach(item => {
    const progress = parseInt(item.getAttribute("data-progress") || "0", 10);
    if (progress > 0) {
      overallTotal += progress;
      overallCount++;
    }
  });
  const overallAverage = overallCount > 0 ? Math.round(overallTotal / overallCount) : 0;
  const kpiAvgElem = document.getElementById("kpi-average-expertise");
  if (kpiAvgElem) {
    kpiAvgElem.setAttribute("data-val", overallAverage);
    const kpisRow = document.querySelector(".skills-kpis");
    if (kpisRow && kpisRow.classList.contains("active")) {
      kpiAvgElem.innerHTML = `${overallAverage}<span class="kpi-suffix">%</span>`;
    } else {
      kpiAvgElem.innerHTML = `0<span class="kpi-suffix">%</span>`;
    }
  }

  // Calculate dynamic overall count of mastered technologies (excluding Office 365 for strict IT/Tech relevance)
  const allSkillItems = document.querySelectorAll(".skill-list .skill-item");
  let technicalSkillsCount = 0;
  allSkillItems.forEach(item => {
    const card = item.closest(".skill-cat-card");
    if (card) {
      const titleElem = card.querySelector("h3[data-i18n]");
      if (titleElem) {
        const catKey = titleElem.getAttribute("data-i18n");
        if (catKey === "cat_office_365") {
          return; // skip Office 365!
        }
      }
    }
    technicalSkillsCount++;
  });

  const kpiTechElem = document.getElementById("kpi-technologies-mastered");
  if (kpiTechElem) {
    kpiTechElem.setAttribute("data-val", technicalSkillsCount);
    const kpisRow = document.querySelector(".skills-kpis");
    if (kpisRow && kpisRow.classList.contains("active")) {
      kpiTechElem.innerHTML = `${technicalSkillsCount}<span class="kpi-suffix">+</span>`;
    } else {
      kpiTechElem.innerHTML = `0<span class="kpi-suffix">+</span>`;
    }
  }

  // Calculate dynamic Technical Experience (excluding Karun School) & Overall Experience (including Karun School)
  let techMonths = 0;
  let overallMonths = 0;
  const expHeader = Array.from(document.querySelectorAll('.resume-header h3')).find(h3 => h3.getAttribute('data-i18n') === 'resume_exp_title');
  if (expHeader) {
    const expSectionContainer = expHeader.closest('.resume-section');
    if (expSectionContainer) {
      const items = expSectionContainer.querySelectorAll('.timeline-item');
      items.forEach(item => {
        const titleElem = item.querySelector('.timeline-title');
        const isKarunSchool = titleElem && titleElem.getAttribute('data-i18n') === 'cv_exp_4_title';
        const metaElem = item.querySelector('.timeline-meta');
        if (metaElem) {
          const text = metaElem.textContent;
          const match = text.match(/(\d{2})\.(\d{4})\s*[-\u2013\u2014]\s*(\d{2})\.(\d{4})/);
          if (match) {
            const startMonth = parseInt(match[1], 10);
            const startYear = parseInt(match[2], 10);
            const endMonth = parseInt(match[3], 10);
            const endYear = parseInt(match[4], 10);

            const months = (endYear * 12 + endMonth) - (startYear * 12 + startMonth) + 1;
            overallMonths += months;
            if (!isKarunSchool) {
              techMonths += months;
            }
          }
        }
      });
    }
  }

  const techYears = Math.round(techMonths / 12);
  const overallYears = Math.round(overallMonths / 12);
  const suffix = currentLang === "de" ? "+ Jahre" : "+ Years"; // Translate suffix dynamically!

  // Update Technical Experience KPI Card
  const kpiExpElem = document.getElementById("kpi-practical-experience");
  if (kpiExpElem) {
    kpiExpElem.setAttribute("data-val", techYears);
    kpiExpElem.setAttribute("data-suffix", suffix);
    const kpisRow = document.querySelector(".skills-kpis");
    if (kpisRow && kpisRow.classList.contains("active")) {
      kpiExpElem.innerHTML = `${techYears}<span class="kpi-suffix">${suffix}</span>`;
    } else {
      kpiExpElem.innerHTML = `0<span class="kpi-suffix">${suffix}</span>`;
    }
  }

  // Update Overall Experience KPI Card
  const kpiOverallElem = document.getElementById("kpi-overall-experience");
  if (kpiOverallElem) {
    kpiOverallElem.setAttribute("data-val", overallYears);
    kpiOverallElem.setAttribute("data-suffix", suffix);
    const kpisRow = document.querySelector(".skills-kpis");
    if (kpisRow && kpisRow.classList.contains("active")) {
      kpiOverallElem.innerHTML = `${overallYears}<span class="kpi-suffix">${suffix}</span>`;
    } else {
      kpiOverallElem.innerHTML = `0<span class="kpi-suffix">${suffix}</span>`;
    }
  }

  // Calculate dynamic Earned Certificates count from the certificates section
  let certificateCount = 0;
  const certHeader = Array.from(document.querySelectorAll('.resume-header h3')).find(h3 => h3.getAttribute('data-i18n') === 'resume_cert_title');
  if (certHeader) {
    const certSectionContainer = certHeader.closest('.resume-section');
    if (certSectionContainer) {
      const items = certSectionContainer.querySelectorAll('.timeline-item');
      certificateCount = items.length;
    }
  }
  const kpiCertElem = document.getElementById("kpi-earned-certificates");
  if (kpiCertElem) {
    kpiCertElem.setAttribute("data-val", certificateCount);
    const kpisRow = document.querySelector(".skills-kpis");
    if (kpisRow && kpisRow.classList.contains("active")) {
      kpiCertElem.innerHTML = `${certificateCount}<span class="kpi-suffix">+</span>`;
    } else {
      kpiCertElem.innerHTML = `0<span class="kpi-suffix">+</span>`;
    }
  }

  // Calculate dynamic GitHub Repositories count
  let repoCount = 0;
  const allRepoItems = document.querySelectorAll(".repo-item");
  if (allRepoItems) {
    repoCount = allRepoItems.length;
  }
  const kpiRepoElem = document.getElementById("kpi-github-repos");
  if (kpiRepoElem) {
    kpiRepoElem.setAttribute("data-val", repoCount);
    const kpisRow = document.querySelector(".skills-kpis");
    if (kpisRow && kpisRow.classList.contains("active")) {
      kpiRepoElem.innerHTML = `${repoCount}<span class="kpi-suffix">+</span>`;
    } else {
      kpiRepoElem.innerHTML = `0<span class="kpi-suffix">+</span>`;
    }
  }
}

/**
 * Updates the overall page texts to the selected language by retrieving localized keys
 * from the dictionary objects. Manages the preference cookie persistence, translates
 * tooltips, active classes, circular gauges, and triggers dashboard chart redraws.
 * 
 * @param {string} lang - The language code ('de' or 'en') to switch the application to.
 */
function updateLanguage(lang) {
  currentLang = lang;

  // Only save language choice if Preference Cookies are accepted

  const consent = localStorage.getItem("portfolio_cookie_consent");
  let allowPreferences = true;
  if (consent) {
    try {
      const consentObj = JSON.parse(consent);
      allowPreferences = !!consentObj.preferences;
    } catch (e) {}
  }

  if (allowPreferences) {
    localStorage.setItem("portfolio_lang", lang);
  } else {
    localStorage.removeItem("portfolio_lang");
  }


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

  // Recalculate slider highlight position after text length updates
  if (typeof window.updateToggleSlider === "function") {
    setTimeout(() => {
      window.updateToggleSlider();
    }, 50);
  }

  // Remove the initialization loader class to reveal page contents
  document.documentElement.classList.remove("lang-loading");
}

/**
 * Animates linear and radial skill progress indicators with a clean visual delay.
 * Linear bars are filled left-to-right using high-performance width transitions,
 * while radial gauges utilize strokeDashoffset computations.
 */
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

/**
 * Initializes and registers scroll observer listeners utilizing IntersectionObserver API.
 * Handles the lazy triggering of progress bars, circular gauges, and dashboard KPI counts
 * when they enter the viewport.
 */
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

        // 3) KPIs count-up: animate when the kpis row enters view
        if (entry.target.classList.contains("skills-kpis")) {
          const kpiNums = entry.target.querySelectorAll(".kpi-num");
          kpiNums.forEach(kpi => {
            const val = parseInt(kpi.getAttribute("data-val") || "0", 10);
            const suffix = kpi.getAttribute("data-suffix") || "";
            animateKpiCounter(kpi, val, suffix);
          });
        }
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  animatedElements.forEach(el => observer.observe(el));
}

/**
 * Animates a text counter from 0 to the target percentage value.
 * Utilizes requestAnimationFrame for smooth 60fps rendering with an ease-out-cubic curve.
 * 
 * @param {HTMLElement} element - The DOM element whose textContent will be animated.
 * @param {number} targetValue - The target percentage number (0-100).
 */
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

/**
 * Animates a KPI metric counter from 0 to the target value and appends a suffix.
 * Utilizes high-performance requestAnimationFrame with an ease-out-cubic curve.
 * 
 * @param {HTMLElement} element - The DOM element containing the counter number.
 * @param {number} targetValue - The numeric value to count up to.
 * @param {string} [suffix=""] - Optional units or suffix characters (e.g. '+', '%', ' Years').
 */
function animateKpiCounter(element, targetValue, suffix = "") {
  if (!element) return;
  let current = 0;
  const duration = 1400; // Count up duration
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
    current = Math.round(easeProgress * targetValue);
    element.innerHTML = `${current}<span class="kpi-suffix">${suffix}</span>`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.innerHTML = `${targetValue}<span class="kpi-suffix">${suffix}</span>`;
    }
  }
  requestAnimationFrame(update);
}

/**
 * Redraws and animates radial charts. Left for compatibility and language switch scenarios.
 */
function animateRadialCircles() {
  if (typeof animateFeaturedCharts === "function") {
    animateFeaturedCharts();
  }
}

/**
 * Triggered on viewport entry to animate individual linear skill bars within a single category card.
 * Uses a double requestAnimationFrame to ensure DOM resets are painted cleanly before transitioning.
 * 
 * @param {HTMLElement} card - The parent skill-cat-card element containing sub-skill items.
 */
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

/**
 * Compatibility wrapper to trigger radial and linear animations for all skill cards.
 */
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
