/**
 * Amir Argani - Portfolio Interactions & Modal Triggers
 */

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

// Portfolio visual interactive events inside DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Setup visual card hover lights
  setupCardGlowEffect();

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

  // ==========================================
  // PDF Viewer Modal Logic
  // ==========================================
  const certButtons = document.querySelectorAll(".cert-open-btn");
  const modal = document.getElementById("cert-modal");
  const modalIframe = document.getElementById("cert-modal-iframe");
  const modalTitle = document.getElementById("cert-modal-title");
  const modalClose = document.getElementById("cert-modal-close");
  const pdfLoader = document.getElementById("pdf-loader");

  function openPdfModal(pdfUrl, title) {
    if (!modal || !modalIframe) return;

    modalTitle.textContent = title;

    // First, make the modal visible in the DOM
    modal.classList.add("open");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
    
    // Show loader
    if (pdfLoader) pdfLoader.style.display = "flex";

    // Always use Google Docs viewer for PDF embeds to keep contextmenu control stable.
    const targetUrl = "https://docs.google.com/gview?url=" + encodeURIComponent(pdfUrl) + "&embedded=true" + "&t=" + new Date().getTime();

    // Force a hard iframe reset before loading the PDF content.
    modalIframe.src = "about:blank";

    const hideLoader = () => {
      if (pdfLoader) pdfLoader.style.display = "none";
    };

    let loadAttempts = 0;
    let iframeLoadStarted = false;
    const loadIframe = () => {
      if (!modal.classList.contains("open")) return;
      loadAttempts += 1;
      iframeLoadStarted = true;
      modalIframe.src = targetUrl;
    };

    const cancelLoaderTimers = () => {
      if (loaderTimeout) clearTimeout(loaderTimeout);
      if (reloadTimeout) clearTimeout(reloadTimeout);
    };

    let loaderTimeout = setTimeout(() => {
      hideLoader();
    }, 4000);

    let reloadTimeout = setTimeout(() => {
      if (modal.classList.contains("open") && loadAttempts === 1) {
        loadIframe();
      }
    }, 1200);

    modalIframe.onload = () => {
      if (!iframeLoadStarted) return;
      cancelLoaderTimers();
      hideLoader();
    };

    setTimeout(() => {
      loadIframe();
    }, 300);
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
  // PDF Security: Block Right-Click & Download Shortcuts (Chrome & Safari)
  // ==========================================

  const pdfBlocker = document.getElementById("pdf-contextmenu-blocker");
  const blockPdfContextMenu = (e) => {
    if (modal && modal.classList.contains("open")) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  // Global capture-phase handler for any context menu while the modal is open.
  document.addEventListener("contextmenu", blockPdfContextMenu, true);

  if (pdfBlocker) {
    pdfBlocker.addEventListener("contextmenu", blockPdfContextMenu, true);
  }

  if (modal) {
    modal.addEventListener("contextmenu", blockPdfContextMenu, true);
  }

  if (modalIframe) {
    modalIframe.addEventListener("contextmenu", blockPdfContextMenu, true);
  }

  // Block keyboard shortcuts for printing and saving while modal is open
  document.addEventListener("keydown", (e) => {
    if (modal && modal.classList.contains("open")) {
      // Ctrl+P (Print), Ctrl+S (Save), Cmd+P (Mac Print), Cmd+S (Mac Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P" || e.key === "s" || e.key === "S")) {
        e.preventDefault();
        return false;
      }
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
