/**
 * Amir Argani - Portfolio Controller & Localisation
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
      // If it has children (like nested SVGs or icons), we might only want to replace text.
      // But we can use innerHTML for clean integration if we format translations correctly.
      element.innerHTML = translations[lang][key];
    }
  });

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
  // Note: animateSkillBars() is intentionally NOT called here —
  // it is triggered once by the IntersectionObserver when the user scrolls to #skills
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

// Animate only the circular radial gauges (once on scroll into view)
function animateRadialCircles() {
  const circles = document.querySelectorAll(".radial-progress");
  circles.forEach((item, index) => {
    const progress = parseInt(item.getAttribute("data-progress") || "0", 10);
    const circle = item.querySelector(".progress-circle-fill");
    if (!circle) return;
    const radius = (circle.r && circle.r.baseVal && circle.r.baseVal.value > 0) ? circle.r.baseVal.value : 45;
    const circumference = 2 * Math.PI * radius;
    const targetOffset = circumference - (progress / 100) * circumference;

    // Reset to empty (no transition)
    circle.style.transition = "none";
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = String(circumference);

    // Double rAF: ensures browser has painted the reset before starting transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          circle.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)";
          circle.style.strokeDashoffset = String(targetOffset);
        }, index * 80);
      });
    });
  });
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

// Legacy: kept for compatibility (e.g. language switch scenario)
function animateSkillBars() {
  animateRadialCircles();
  document.querySelectorAll(".skill-cat-card").forEach(card => animateBarsInCard(card));
}


// Mouse movement interactive light effect (glow cards)
function setupCardGlowEffect() {
  const cards = document.querySelectorAll(".glow-card");

  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}

// Document ready entry point
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

  // Setup visual effects & animations
  setupScrollAnimations();
  setupCardGlowEffect();

  // Dynamic smooth scroll-to-card for circular gauges
  document.querySelectorAll(".radial-progress[data-category]").forEach(gauge => {
    gauge.addEventListener("click", () => {
      const catKey = gauge.getAttribute("data-category");
      const bottomTitle = document.querySelector(`.skill-cat-card h3[data-i18n="${catKey}"]`);
      if (bottomTitle) {
        const card = bottomTitle.closest(".skill-cat-card");
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });

          // Trigger a beautiful brief glowing pulse to draw attention to the targeted card
          card.classList.add("pulsing-glow");
          setTimeout(() => {
            card.classList.remove("pulsing-glow");
          }, 1500);
        }
      }
    });
  });

  // GitHub Repositories Filter Logic
  const filterBtns = document.querySelectorAll(".repo-filter-btn");
  const repoItems = document.querySelectorAll(".repo-item");

  if (filterBtns.length > 0 && repoItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filterValue = btn.getAttribute("data-filter");

        repoItems.forEach(item => {
          if (item.hasAttribute("open")) {
            item.removeAttribute("open");
          }

          if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
            item.style.display = "block";
            item.style.opacity = "0";
            item.style.transform = "translateY(10px)";
            item.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            }, 50);
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

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

  // ==========================================
  // PDF Viewer Modal Logic
  // ==========================================
  const certButtons = document.querySelectorAll(".cert-open-btn");
  const modal = document.getElementById("cert-modal");
  const modalIframe = document.getElementById("cert-modal-iframe");
  const modalTitle = document.getElementById("cert-modal-title");
  const modalClose = document.getElementById("cert-modal-close");

  function openPdfModal(pdfUrl, title) {
    if (!modal || !modalIframe) return;

    modalTitle.textContent = title;

    // First, make the modal visible in the DOM
    modal.classList.add("open");
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    // Fix: Wait a tiny bit for the layout to compute before setting the iframe src.
    // This prevents the common Google Docs Viewer "blank screen on first load" bug.
    // We also append a timestamp to bypass Google's aggressive 204 No Content cache.
    setTimeout(() => {
      const cacheBuster = "&t=" + new Date().getTime();
      modalIframe.src = "https://docs.google.com/gview?url=" + encodeURIComponent(pdfUrl) + "&embedded=true" + cacheBuster;
    }, 100);
  }

  function closePdfModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    // Clear iframe src after animation to stop loading
    setTimeout(() => {
      if (modalIframe) modalIframe.src = "";
    }, 350);
  }

  // Attach click events to all certificate buttons
  certButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".cert-card");
      if (!card) return;

      // Get the correct PDF based on current language and decode it
      const pdfUrlBase64 = card.getAttribute(`data-pdf-${currentLang}`);
      let pdfUrl = "";
      try {
        pdfUrl = atob(pdfUrlBase64);
      } catch (e) {
        console.error("Error decoding PDF URL", e);
        return;
      }

      const titleElement = card.querySelector(".cert-title");
      const title = titleElement ? titleElement.textContent : "Certificate";

      openPdfModal(pdfUrl, title);
    });
  });

  // Close modal when close button is clicked
  if (modalClose) {
    modalClose.addEventListener("click", closePdfModal);
  }

  // Close modal when clicking outside the box (on the overlay)
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closePdfModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) {
      closePdfModal();
    }
  });

  // ==========================================
  // Clean URL Smooth Scrolling (No Hash in URL)
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      // Only process valid IDs (e.g. #about), skip raw "#"
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault(); // Prevent URL from changing
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });

          // If there is a mobile menu checkbox, uncheck it to close the menu
          const menuToggle = document.getElementById('menu-toggle');
          if (menuToggle && menuToggle.checked) {
            menuToggle.checked = false;
          }
        }
      }
    });
  });

});
