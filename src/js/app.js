/**
 * Amir Argani - Portfolio Interactions & Modal Triggers
 */

/**
 * Registers custom mousemove mouse listeners on all '.glow-card' elements to calculate
 * mouse positions relative to elements, enabling dynamic radial hover lighting gradients.
 */
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

  /**
   * Scrapes and configures collapsible resume timeline details wrappers. Wraps bullet points,
   * generates toggle control buttons, translates button labels, and manages layout expansions.
   */
  function initTimelineCollapsibles() {
    const timelineItems = document.querySelectorAll(".timeline-item");
    timelineItems.forEach(item => {
      const list = item.querySelector(".timeline-list");
      if (!list) return;

      // Create collapsible wrapper
      const wrapper = document.createElement("div");
      wrapper.className = "timeline-list-wrapper";
      
      // Move the list inside the wrapper
      list.parentNode.insertBefore(wrapper, list);
      wrapper.appendChild(list);

      // Get current language to set initial button text
      const activeLang = typeof currentLang !== "undefined" ? currentLang : "en";
      const initialText = activeLang === "de" ? "Details anzeigen" : "Show Details";

      // Create toggle button
      const button = document.createElement("button");
      button.className = "timeline-toggle-btn";
      button.setAttribute("aria-expanded", "false");
      button.innerHTML = `
        <svg class="timeline-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
        <span class="timeline-toggle-text" data-i18n="timeline_show_details">${initialText}</span>
        <svg class="timeline-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      `;

      // Insert button before wrapper
      wrapper.parentNode.insertBefore(button, wrapper);

      // Click handler
      button.addEventListener("click", () => {
        const isExpanded = wrapper.classList.toggle("expanded");
        button.classList.toggle("active", isExpanded);
        button.setAttribute("aria-expanded", isExpanded ? "true" : "false");

        const textSpan = button.querySelector(".timeline-toggle-text");
        const nextKey = isExpanded ? "timeline_hide_details" : "timeline_show_details";
        textSpan.setAttribute("data-i18n", nextKey);

        // Update text in active language
        const currentActiveLang = typeof currentLang !== "undefined" ? currentLang : "en";
        if (typeof translations !== "undefined" && translations[currentActiveLang] && translations[currentActiveLang][nextKey]) {
          textSpan.innerHTML = translations[currentActiveLang][nextKey];
        } else {
          textSpan.innerHTML = isExpanded 
            ? (currentActiveLang === "de" ? "Details ausblenden" : "Hide Details")
            : (currentActiveLang === "de" ? "Details anzeigen" : "Show Details");
        }
      });
    });
  }

  initTimelineCollapsibles();

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

  let activePdfCancelFn = null;

  /**
   * Opens the PDF viewer modal to display a certificate. Manages the custom loading state,
   * exponential backoff reloading, iframe load listeners, and full error handlers.
   * 
   * @param {string} pdfUrl - The path or URL to the certificate PDF file.
   * @param {string} title - The title of the certificate to display in the modal header.
   */
  function openPdfModal(pdfUrl, title) {
    if (!modal || !modalIframe) return;

    // Clean up any previously running timers just in case
    if (activePdfCancelFn) activePdfCancelFn();

    modalTitle.textContent = title;

    // First, make the modal visible in the DOM
    modal.classList.add("open");
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    // Show loader
    if (pdfLoader) pdfLoader.style.display = "flex";

    // Sub-elements of loader
    const loaderSpinner = document.getElementById("pdf-loader-spinner");
    const loaderError = document.getElementById("pdf-loader-error");
    const loaderErrorText = document.getElementById("pdf-loader-error-text");

    // Reset loader display state to default spinner view
    if (loaderSpinner) loaderSpinner.style.display = "flex";
    if (loaderError) loaderError.style.display = "none";

    // Base URL for Google Docs viewer
    const baseTargetUrl = "https://docs.google.com/gview?url=" + encodeURIComponent(pdfUrl) + "&embedded=true";

    // Force a hard iframe reset before loading the PDF content.
    modalIframe.src = "about:blank";

    let loadAttempts = 0;
    const maxAttempts = 3;
    let retryTimeout = null;
    let isLoaded = false;

    const hideLoader = () => {
      if (pdfLoader) pdfLoader.style.display = "none";
    };

    const cancelRetry = () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
        retryTimeout = null;
      }
    };

    // Global cancel function for closing modal
    activePdfCancelFn = () => {
      cancelRetry();
      hideLoader();
    };

    const loadIframe = () => {
      if (!modal.classList.contains("open")) return;
      if (isLoaded) return;

      loadAttempts += 1;
      console.log(`Loading PDF attempt ${loadAttempts} of ${maxAttempts}...`);

      // Show loader again for retries if it was hidden
      if (pdfLoader) pdfLoader.style.display = "flex";

      // Cache-busting parameter t
      modalIframe.src = baseTargetUrl + "&t=" + new Date().getTime() + "_" + loadAttempts;

      // Set up the auto-retry timeout
      cancelRetry();
      if (loadAttempts < maxAttempts) {
        retryTimeout = setTimeout(() => {
          if (!isLoaded && modal.classList.contains("open")) {
            console.warn(`PDF load attempt ${loadAttempts} timed out. Retrying...`);
            loadIframe();
          }
        }, 5500); // Wait 5.5 seconds before retrying
      } else {
        // After maximum attempts, if it's still not loaded, show the error warning text
        retryTimeout = setTimeout(() => {
          if (!isLoaded && modal.classList.contains("open")) {
            console.error("PDF failed to load after all attempts. Showing manual reload hint.");

            // Hide spinner and show error message
            if (loaderSpinner) loaderSpinner.style.display = "none";
            if (loaderError) {
              loaderError.style.display = "flex";
              if (loaderErrorText) {
                loaderErrorText.textContent = translations[currentLang]?.cert_loader_error || "";
              }
            }
          }
        }, 5500); // Wait 5.5 seconds for the 3rd attempt to render, then show error if not loaded
      }
    };

    modalIframe.onload = () => {
      // Ignore if load event fired for about:blank or if modal was closed
      if (modalIframe.src === "about:blank" || modalIframe.src === "" || !modal.classList.contains("open")) {
        return;
      }
      console.log("PDF iframe onload triggered successfully.");
      isLoaded = true;
      cancelRetry();
      hideLoader();
    };

    // Wire up reload button in header for manual reload
    const reloadBtn = document.getElementById("cert-modal-reload");
    if (reloadBtn) {
      // Clear previous event listener by cloning the button
      const newReloadBtn = reloadBtn.cloneNode(true);
      reloadBtn.parentNode.replaceChild(newReloadBtn, reloadBtn);

      newReloadBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        isLoaded = false;
        loadAttempts = 0; // Reset attempts for manual reload

        // Restore loader spinner view
        if (loaderSpinner) loaderSpinner.style.display = "flex";
        if (loaderError) loaderError.style.display = "none";

        loadIframe();
      });
    }

    // Start initial loading after a short layout delay
    setTimeout(() => {
      loadIframe();
    }, 300);
  }

  /**
   * Closes the PDF viewer modal, cleans up iframe sources, cancels any pending reload timers,
   * and restores body scrolling.
   */
  function closePdfModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";

    // Cancel all running load and retry timers immediately
    if (activePdfCancelFn) {
      activePdfCancelFn();
      activePdfCancelFn = null;
    }

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

  // ==========================================
  // Dynamic Skill Icons Injection
  // ==========================================
      const skillIcons = {
    // Data Analysis & BI Tools
    "Exploratory Data Analysis": `<svg viewBox="0 0 1024 1024" fill="currentColor" width="18" height="18"><path fill="currentColor" d="m665.216 768 110.848 192h-73.856L591.36 768H433.024L322.176 960H248.32l110.848-192H160a32 32 0 0 1-32-32V192H64a32 32 0 0 1 0-64h896a32 32 0 1 1 0 64h-64v544a32 32 0 0 1-32 32H665.216zM832 192H192v512h640V192zM352 448a32 32 0 0 1 32 32v64a32 32 0 0 1-64 0v-64a32 32 0 0 1 32-32zm160-64a32 32 0 0 1 32 32v128a32 32 0 0 1-64 0V416a32 32 0 0 1 32-32zm160-64a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V352a32 32 0 0 1 32-32z" /></svg>`,
    "Machine Learning": `<svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><path d="M27,24a2.9609,2.9609,0,0,0-1.2854.3008L21.4141,20H18v2h2.5859l3.7146,3.7148A2.9665,2.9665,0,0,0,24,27a3,3,0,1,0,3-3Zm0,4a1,1,0,1,1,1-1A1.0009,1.0009,0,0,1,27,28Z" /><path d="M27,13a2.9948,2.9948,0,0,0-2.8157,2H18v2h6.1843A2.9947,2.9947,0,1,0,27,13Zm0,4a1,1,0,1,1,1-1A1.0009,1.0009,0,0,1,27,17Z" /><path d="M27,2a3.0033,3.0033,0,0,0-3,3,2.9657,2.9657,0,0,0,.3481,1.373L20.5957,10H18v2h3.4043l4.3989-4.2524A2.9987,2.9987,0,1,0,27,2Zm0,4a1,1,0,1,1,1-1A1.0009,1.0009,0,0,1,27,6Z" /><path d="M18,6h2V4H18a3.9756,3.9756,0,0,0-3,1.3823A3.9756,3.9756,0,0,0,12,4H11a9.01,9.01,0,0,0-9,9v6a9.01,9.01,0,0,0,9,9h1a3.9756,3.9756,0,0,0,3-1.3823A3.9756,3.9756,0,0,0,18,28h2V26H18a2.0023,2.0023,0,0,1-2-2V8A2.0023,2.0023,0,0,1,18,6ZM12,26H11a7.0047,7.0047,0,0,1-6.92-6H6V18H4V14H7a3.0033,3.0033,0,0,0,3-3V9H8v2a1.0009,1.0009,0,0,1-1,1H4.08A7.0047,7.0047,0,0,1,11,6h1a2.0023,2.0023,0,0,1,2,2v4H12v2h2v4H12a3.0033,3.0033,0,0,0-3,3v2h2V21a1.0009,1.0009,0,0,1,1-1h2v4A2.0023,2.0023,0,0,1,12,26Z" /></svg>`,
    "Streamlit": `<svg viewBox="0 0 50 50" fill="currentColor" width="18" height="18"><path d="M49.42 15.55c0 0-6.18 18.8-6.2 18.83L35 20.22l12.25-6.54c.57-.3 1.22-.22 1.7.19C49.44 14.28 49.62 14.94 49.42 15.55zM40.18 33.14L17.37 19.46l6.29-10.22c.27-.46.76-.73 1.28-.74.48 0 1.02.25 1.3.69L40.18 33.14zM40.22 35.5H9.81c-1.07 0-2.03-.68-2.4-1.69L.6 15.6c-.23-.6-.06-1.28.42-1.71.48-.43 1.15-.51 1.72-.21L40.22 35.5z" /></svg>`,
    "Power BI": `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.571 0h-4.571v24h4.571V0Zm-6.286 6.857H6.714V24h4.571V6.857ZM5 13.714H.429V24H5V13.714Z" /></svg>`,
    "Tableau": `<svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><path d="M15.536 0.235v2.937h-2.624v0.771h2.624v2.937h0.933v-2.937h2.624v-0.771h-2.624v-2.937zM23.579 3.251v4.328h-3.943v1.233h3.943v4.251h1.391l0.009-2.109 0.032-2.099 1.953-0.032 1.943-0.011v-1.233h-3.937v-4.328zM7.036 3.328v4.256h-3.984v1.228h3.984v4.256h1.313v-4.256h4.015v-1.233h-4.015v-4.251zM15.151 10.355v4.791h-4.405v1.584h4.405v4.797h1.709v-4.797h4.411v-1.584h-4.411v-4.791zM28.115 12.421v2.959h-2.688v1.084h2.688v3.015h1.183v-3.015h2.703v-1.084h-2.703v-2.959zM2.631 12.593v2.901h-2.631v0.828h2.631v2.928h0.891v-2.928h2.667v-0.828h-2.709v-2.901zM23.579 18.62v4.339h-4.027v1.235h4.027v4.285h1.427v-4.285h3.979v-1.235h-3.979v-4.339zM6.959 18.631v4.328h-3.943v1.235h3.943v4.255h1.468v-4.255h3.937v-1.235h-3.937v-4.333h-0.733zM15.38 24.735v2.937h-2.625v1.077h2.625v3.016h1.24l0.016-1.489 0.020-1.527h2.631v-1.077h-2.667v-2.937z" /></svg>`,
    "Apache Spark": `<svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><path d="M14.417 0c-0.568 0.016-1.125 0.286-1.594 0.807-0.26 0.292-0.479 0.615-0.661 0.964-0.469 0.885-0.563 1.885-0.74 2.854-0.328 1.818-0.651 3.635-0.969 5.453-0.036 0.214-0.125 0.302-0.323 0.359-2.359 0.745-4.719 1.484-7.063 2.25-0.516 0.167-1.031 0.385-1.484 0.672-1.391 0.885-1.599 2.339-0.557 3.615 0.464 0.563 1.057 0.953 1.714 1.245 1.469 0.656 2.938 1.302 4.401 1.964 0.026 0.010 0.047 0.016 0.068 0.026h-0.005l1.745 0.714c0 0.031 0 0.057 0 0.094-0.266 2.708-0.521 5.417-0.776 8.13-0.052 0.557-0.016 1.104 0.182 1.641 0.422 1.156 1.417 1.526 2.505 0.932 0.495-0.271 0.891-0.661 1.25-1.089 1.828-2.167 3.661-4.328 5.484-6.5 0.146-0.177 0.271-0.198 0.484-0.13 0.464 0.156 0.927 0.307 1.391 0.464h0.005c0.026 0.016 0.057 0.026 0.094 0.042l0.193 0.057c1.661 0.552 3.573 1.031 5.234 1.583 0.536 0.177 0.833 0.219 1.396 0.13 0.417-0.063 0.792-0.083 1.104-0.313 0.802-0.443 1.328-1.276 1.318-2.245-0.005-0.568-0.208-1.083-0.469-1.578-1.094-2.078-2.182-4.151-3.281-6.224-0.104-0.198-0.099-0.323 0.052-0.5 1.839-2.151 3.672-4.313 5.51-6.474 0.359-0.427 0.682-0.875 0.87-1.411 0.411-1.167-0.12-2.094-1.333-2.318-0.547-0.094-1.109-0.063-1.646 0.089-2.635 0.698-5.266 1.391-7.891 2.094-0.234 0.063-0.349 0.021-0.474-0.193-1.063-1.792-2.141-3.578-3.229-5.354-0.245-0.411-0.536-0.792-0.87-1.135-0.495-0.49-1.068-0.729-1.635-0.714zM14.646 4.938c0.104 0.073 0.193 0.167 0.25 0.281 1.161 1.927 2.323 3.854 3.479 5.786 0.094 0.156 0.182 0.208 0.37 0.156 2.036-0.542 4.068-1.083 6.104-1.62 0.49-0.13 0.979-0.255 1.474-0.385-0.021 0.099-0.068 0.193-0.135 0.266-1.677 1.974-3.354 3.948-5.036 5.917-0.146 0.177-0.161 0.297-0.057 0.495 1.25 2.406 2.359 4.411 3.333 6.349l-4.927-1.359c-0.719-0.24-1.438-0.479-2.156-0.719-0.214-0.073-0.333-0.042-0.479 0.13-1.661 1.984-3.339 3.964-5.010 5.943-0.063 0.078-0.146 0.141-0.24 0.172 0.047-0.5 0.089-1.005 0.135-1.51 0.203-2.099 0.396-4.193 0.604-6.292-0.042-0.422 0.156-0.536-0.432-0.724-1.99-0.792-4.458-1.76-6.417-2.542 0.089-0.083 0.198-0.146 0.318-0.177 2.396-0.76 4.792-1.521 7.193-2.276 0.167-0.052 0.266-0.12 0.281-0.307 0.016-0.198 0.068-0.396 0.099-0.589 0.323-1.818 0.646-3.635 0.969-5.453 0.094-0.516 0.188-1.026 0.281-1.542z" /></svg>`,

    // Programming
    "C#/.NET Core": `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zM9.426 7.12a5.55 5.55 0 0 1 1.985.38v1.181a4.5 4.5 0 0 0-2.25-.566 3.439 3.439 0 0 0-2.625 1.087 4.099 4.099 0 0 0-1.012 2.906 3.9 3.9 0 0 0 .945 2.754 3.217 3.217 0 0 0 2.482 1.023 4.657 4.657 0 0 0 2.464-.634l-.004 1.08a5.543 5.543 0 0 1-2.625.555 4.211 4.211 0 0 1-3.228-1.297 4.793 4.793 0 0 1-1.212-3.409 5.021 5.021 0 0 1 1.365-3.663 4.631 4.631 0 0 1 3.473-1.392 5.55 5.55 0 0 1 .12-.004 5.55 5.55 0 0 1 .122 0zm5.863.155h.836l-.555 2.652h1.661l.567-2.652h.81l-.555 2.652 1.732-.004-.15.697H17.91l-.412 1.98h1.852l-.176.698h-1.816l-.58 2.625h-.83l.567-2.625h-1.65l-.555 2.625h-.81l.555-2.625h-1.74l.131-.698h1.748l.401-1.976h-1.826l.138-.697h1.826zm.142 3.345L15 12.6h1.673l.423-1.98z" /></svg>`,
    "AL Programming Language": `<svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M11.616,7.986A1.559,1.559,0,0,0,10.16,7H10.1a1.558,1.558,0,0,0-1.456.986L2,25H5.806l1.015-2.834h6.621L14.457,25h3.8ZM7.944,18.956l2.188-6.111,2.188,6.116Z" style="fill:currentColor" /><path d="M23.829,21.671V7.129H20.3V22.747A2.346,2.346,0,0,0,22.57,25H30V21.672Z" style="fill:currentColor" /></g></svg>`,
    "Visual Basic": `<svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M6.67,7.836,9,18.915,11.336,7.836H16L11.336,24.164H6.672L2,7.836Z" style="fill:currentColor" /><path d="M18.331,7.836h7.6a4.08,4.08,0,0,1,2.9,1.749,3.78,3.78,0,0,1,.571,2.04,3.985,3.985,0,0,1-.571,2.034,4.108,4.108,0,0,1-2.341,1.763,4.1,4.1,0,0,1,2.929,1.756,3.8,3.8,0,0,1,.58,2.1,4.663,4.663,0,0,1-.579,2.546,5.047,5.047,0,0,1-3.5,2.338H18.331ZM23,14.252h1.166a1.754,1.754,0,0,0,0-3.5H23Zm0,7H24.39a2.047,2.047,0,0,0,0-4.089H23Z" style="fill:currentColor" /></g></svg>`,
    "C++": `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12.207 16.278C11.1241 17.343 9.63879 18 8 18C4.68629 18 2 15.3137 2 12C2 8.68629 4.68629 6 8 6C9.67492 6 11.1896 6.6863 12.278 7.79303L13.6923 6.37878C12.2418 4.91014 10.2272 4 8 4C3.58172 4 0 7.58172 0 12C0 16.4183 3.58172 20 8 20C10.1911 20 12.1764 19.1192 13.6212 17.6923L12.207 16.278Z" fill="currentColor" /><path d="M15 9H13V11H11V13H13V15H15V13H17V11H15V9Z" fill="currentColor" /><path d="M20 9H22V11H24V13H22V15H20V13H18V11H20V9Z" fill="currentColor" /></svg>`,
    "HTML5": `<svg viewBox="-1 0 20 20" fill="currentColor" width="18" height="18"><desc>Created with Sketch.</desc><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Dribbble-Light-Preview" transform="translate(-61.000000, -7639.000000)" fill="currentColor"><g id="icons" transform="translate(56.000000, 160.000000)"><path d="M19.4350881,7485 L19.4279481,7485 L10.8119794,7485 L11.0180201,7487 L19.2300674,7487 C19.109707,7488.752 18.7455658,7492.464 18.6119454,7494.153 L13.99949,7495.451 L13.99949,7495.455 L13.98929,7495.46 L9.37377458,7493.836 L9.05757353,7490 L11.3199411,7490 L11.4800816,7492.063 L13.99337,7493 L13.99949,7493 L16.5086984,7492.1 L16.7667592,7489 L8.95659319,7489 C8.91885306,7488.599 8.43333144,7483.392 8.34867116,7483 L19.6370488,7483 C19.5738086,7483.66 19.5095484,7484.338 19.4350881,7485 L19.4350881,7485 Z M5,7479 L6.63812546,7497.148 L13.98929,7499 L21.3598345,7497.111 L23,7479 L5,7479 Z" id="html-[#124]" /></g></g></g></svg>`,
    "CSS3": `<svg viewBox="0 0 512 512" fill="currentColor" width="18" height="18"><g id="c133de6af664cd4f011a55de6b001b19"><path display="inline" d="M483.111,0.501l-42.59,461.314l-184.524,49.684L71.47,461.815L28.889,0.501H483.111z M397.29,94.302   H255.831H111.866l6.885,55.708h137.08h7.7l-7.7,3.205l-132.07,55.006l4.38,54.453l127.69,0.414l68.438,0.217l-4.381,72.606   l-64.058,18.035v-0.057l-0.525,0.146l-61.864-15.617l-3.754-45.07h-0.205H132.1h-0.202l7.511,87.007l116.423,34.429v-0.062   l0.21,0.062l115.799-33.802l15.021-172.761h-131.03h-0.323l0.323-0.14l135.83-58.071L397.29,94.302z" /></g></svg>`,
    "JavaScript": `<svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><path d="M0 0h32v32h-32zM29.38 24.37c-0.234-1.464-1.188-2.688-4.005-3.833-0.979-0.458-2.073-0.781-2.396-1.521-0.12-0.438-0.141-0.677-0.063-0.938 0.203-0.865 1.219-1.12 2.021-0.88 0.521 0.161 1 0.557 1.302 1.198 1.38-0.901 1.38-0.901 2.339-1.5-0.359-0.557-0.536-0.802-0.781-1.036-0.839-0.943-1.958-1.422-3.776-1.38l-0.943 0.12c-0.901 0.219-1.76 0.698-2.281 1.339-1.516 1.719-1.078 4.719 0.76 5.964 1.818 1.359 4.479 1.656 4.823 2.938 0.318 1.563-1.161 2.063-2.625 1.88-1.078-0.24-1.677-0.781-2.339-1.781l-2.438 1.401c0.276 0.641 0.599 0.917 1.078 1.479 2.318 2.339 8.12 2.219 9.161-1.339 0.036-0.12 0.318-0.943 0.099-2.198zM17.401 14.708h-2.995c0 2.583-0.016 5.151-0.016 7.74 0 1.641 0.083 3.151-0.182 3.615-0.443 0.917-1.573 0.802-2.089 0.641-0.526-0.26-0.797-0.62-1.104-1.141-0.089-0.141-0.151-0.26-0.172-0.26l-2.432 1.5c0.406 0.839 1 1.563 1.766 2.021 1.141 0.682 2.672 0.901 4.276 0.542 1.042-0.302 1.943-0.922 2.411-1.88 0.682-1.24 0.536-2.76 0.531-4.464 0.016-2.74 0-5.479 0-8.24z" /></svg>`,
    "TypeScript": `<svg viewBox="0 0 15 15" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H15V15H0V0ZM10 6C8.89543 6 8 6.89543 8 8C8 9.10457 8.89543 10 10 10H11C11.5523 10 12 10.4477 12 11C12 11.5523 11.5523 12 11 12H10C9.44772 12 9 11.5523 9 11H8C8 12.1046 8.89543 13 10 13H11C12.1046 13 13 12.1046 13 11C13 9.89543 12.1046 9 11 9H10C9.44772 9 9 8.55228 9 8C9 7.44772 9.44772 7 10 7H11.1667C11.6269 7 12 7.3731 12 7.83333V8H13V7.83333C13 6.82081 12.1792 6 11.1667 6H10ZM3 6H8V7H6V13H5V7H3V6Z" fill="currentColor" /></svg>`,
    "Node.js": `<svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M17.1725 2.29872C16.4627 1.89953 15.5373 1.90132 14.8269 2.29872C11.2689 4.26227 7.71082 6.22641 4.15216 8.18906C3.45969 8.55335 2.99264 9.29698 3.00009 10.0688V21.9328C2.99509 22.7197 3.48622 23.4705 4.19655 23.8298C5.21871 24.3736 6.2118 24.9726 7.25244 25.4802C8.45451 26.0709 9.95843 26.2015 11.1752 25.5855C12.1629 25.075 12.6016 23.9395 12.6003 22.896C12.6083 18.9806 12.6016 15.0651 12.6034 11.1496C12.6269 10.9756 12.4962 10.7896 12.3064 10.7938C11.8517 10.7866 11.3964 10.7896 10.9417 10.7926C10.7699 10.7764 10.6022 10.9191 10.6152 11.0918C10.6091 14.982 10.6164 18.8734 10.6115 22.7642C10.6214 23.3024 10.2578 23.8196 9.73913 24.0014C8.5412 24.4213 5.12198 22.2012 5.12198 22.2012C4.9965 22.1431 4.91682 22.007 4.92912 21.8718C4.92912 17.9576 4.92973 14.0433 4.92912 10.1297C4.91187 9.97191 5.00912 9.8298 5.15402 9.76538C8.70033 7.8134 12.2448 5.85654 15.7911 3.90336C15.9143 3.82115 16.086 3.8214 16.2089 3.90396C19.7552 5.85654 23.3003 7.81161 26.8472 9.76368C26.9926 9.828 27.0857 9.9725 27.0709 10.1297C27.0703 14.0433 27.0721 17.9576 27.0697 21.8713C27.0802 22.0098 27.0086 22.144 26.8793 22.2048C23.3661 24.1462 19.8129 26.025 16.3315 28.0228C16.1796 28.1099 16.0075 28.2086 15.8373 28.1126C14.9218 27.6062 14.0174 27.0801 13.1049 26.5688C13.0057 26.5069 12.8794 26.4803 12.7759 26.5496C12.3668 26.7652 11.982 26.9398 11.5122 27.1258C10.8524 27.387 10.9578 27.4938 11.5529 27.8405C12.62 28.4444 13.6889 29.0459 14.756 29.6504C15.4585 30.0888 16.4024 30.12 17.1275 29.7149C20.6861 27.7538 24.2436 25.7904 27.8029 23.8293C28.5113 23.468 29.0049 22.7202 28.9999 21.9327V10.0688C29.0068 9.31264 28.5576 8.58227 27.886 8.21259C24.3156 6.23947 20.7435 4.27064 17.1725 2.29872Z" fill="currentColor" /><path d="M22.5419 11.2062C21.1452 10.459 19.4836 10.4192 17.9315 10.5169C16.8102 10.6277 15.6309 10.9371 14.814 11.7409C13.9761 12.5489 13.7937 13.8537 14.1917 14.9085C14.4769 15.6539 15.1948 16.1386 15.9372 16.395C16.8935 16.7326 17.8979 16.837 18.9026 16.9414C19.819 17.0366 20.7357 17.1319 21.6165 17.4042C21.9763 17.5234 22.3953 17.7058 22.5055 18.0973C22.6073 18.5609 22.4957 19.0998 22.1193 19.4219C20.9237 20.3682 17.5979 20.2232 16.4166 19.4784C15.939 19.1611 15.7332 18.5994 15.6495 18.0641C15.6402 17.8973 15.5059 17.7443 15.3248 17.757C14.8713 17.7516 14.4178 17.7528 13.9643 17.7564C13.8061 17.7431 13.6416 17.8557 13.6329 18.0172C13.5397 20.4689 15.7914 21.5377 17.9039 21.773C19.1108 21.888 20.3442 21.8814 21.5327 21.6224C22.4261 21.419 23.3219 21.0444 23.9369 20.3563C24.6953 19.52 24.8444 18.2749 24.5043 17.2332C24.2443 16.4559 23.5012 15.9573 22.7416 15.7008C21.7086 15.3466 20.4844 15.1562 19.5488 15.0671C18.1889 14.9376 16.5729 14.9905 16.188 14.0969C16.0345 13.629 16.1651 13.048 16.5951 12.7602C17.7328 11.9885 20.0483 12.091 21.2265 12.6675C21.7675 12.9384 22.081 13.4948 22.2104 14.0565C22.2344 14.2215 22.3454 14.3937 22.5364 14.3865C22.9868 14.3955 23.4372 14.3889 23.8875 14.3895C24.0422 14.4003 24.2116 14.313 24.2418 14.1546C24.2227 12.9806 23.6232 11.7788 22.5419 11.2062Z" fill="currentColor" /></g></svg>`,
    "React": `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect width="24" height="24" fill="none" /><path d="M12,10.11A1.87,1.87,0,1,1,10.13,12,1.88,1.88,0,0,1,12,10.11M7.37,20c.63.38,2-.2,3.6-1.7a24.22,24.22,0,0,1-1.51-1.9A22.7,22.7,0,0,1,7.06,16c-.51,2.14-.32,3.61.31,4m.71-5.74-.29-.51a7.91,7.91,0,0,0-.29.86c.27.06.57.11.88.16l-.3-.51m6.54-.76.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17,9,12.6,9,12,9s-1.17,0-1.71,0c-.29.47-.61.94-.91,1.47L8.57,12l.81,1.5c.3.53.62,1,.91,1.47.54,0,1.11,0,1.71,0s1.17,0,1.71,0c.29-.47.61-.94.91-1.47M12,6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0,10.44c.19-.22.39-.45.59-.72H11.41c.2.27.4.5.59.72M16.62,4c-.62-.38-2,.2-3.59,1.7a24.22,24.22,0,0,1,1.51,1.9,22.7,22.7,0,0,1,2.4.36c.51-2.14.32-3.61-.32-4m-.7,5.74.29.51a7.91,7.91,0,0,0,.29-.86c-.27-.06-.57-.11-.88-.16l.3.51m1.45-7c1.47.84,1.63,3.05,1,5.63,2.54.75,4.37,2,4.37,3.68s-1.83,2.93-4.37,3.68c.62,2.58.46,4.79-1,5.63s-3.45-.12-5.37-1.95c-1.92,1.83-3.91,2.79-5.38,1.95s-1.62-3-1-5.63c-2.54-.75-4.37-2-4.37-3.68S3.08,9.07,5.62,8.32c-.62-2.58-.46-4.79,1-5.63s3.46.12,5.38,1.95c1.92-1.83,3.91-2.79,5.37-1.95M17.08,12A22.51,22.51,0,0,1,18,14.26c2.1-.63,3.28-1.53,3.28-2.26S20.07,10.37,18,9.74A22.51,22.51,0,0,1,17.08,12M6.92,12A22.51,22.51,0,0,1,6,9.74c-2.1.63-3.28,1.53-3.28,2.26S3.93,13.63,6,14.26A22.51,22.51,0,0,1,6.92,12m9,2.26-.3.51c.31,0,.61-.1.88-.16a7.91,7.91,0,0,0-.29-.86l-.29.51M13,18.3c1.59,1.5,3,2.08,3.59,1.7s.83-1.82.32-4a22.7,22.7,0,0,1-2.4.36A24.22,24.22,0,0,1,13,18.3M8.08,9.74l.3-.51c-.31,0-.61.1-.88.16a7.91,7.91,0,0,0,.29.86l.29-.51M11,5.7C9.38,4.2,8,3.62,7.37,4s-.82,1.82-.31,4a22.7,22.7,0,0,1,2.4-.36A24.22,24.22,0,0,1,11,5.7Z" /></svg>`,
    "ASP.NET CORE/MVC": `<svg viewBox="0 0 512 512" fill="currentColor" width="18" height="18"><g id="5151e0c8492e5103c096af88a51eafb7"><path display="inline" d="M295.474,319.537c0.826,4.135,1.24,11.37,1.24,21.707v80.997h-22.327v-80.129   c0-9.097-0.868-15.894-2.604-20.404c-1.737-4.507-4.817-8.104-9.241-10.792c-4.424-2.683-9.613-4.031-15.567-4.031   c-9.51,0-17.717,3.019-24.622,9.055c-6.905,6.037-10.357,17.49-10.357,34.359v71.942h-22.327V290.512h20.094v18.73   c9.675-14.472,23.65-21.707,41.925-21.707c7.938,0,15.236,1.426,21.893,4.279c6.657,2.853,11.64,6.595,14.947,11.226   S294.15,313.17,295.474,319.537z M511.5,423.052c-6.284,1.323-11.908,1.984-16.869,1.984c-8.104,0-14.389-1.281-18.854-3.845   c-4.465-2.563-7.607-5.934-9.427-10.109c-1.819-4.172-2.729-12.962-2.729-26.358v-79.542h-48.475   c0.111,0.12,0.235,0.219,0.347,0.339c11.164,11.99,16.746,28.859,16.746,50.608c0,1.322-0.042,3.308-0.124,5.953h-98.239   c0.827,14.472,4.92,25.553,12.279,33.243c7.36,7.69,16.539,11.535,27.537,11.535c8.187,0,15.174-2.149,20.963-6.45   c5.788-4.3,10.378-11.163,13.769-20.59l23.071,2.853c-3.639,13.479-10.378,23.939-20.219,31.382s-22.41,11.164-37.708,11.164   c-19.268,0-34.545-5.934-45.832-17.8c-11.288-11.862-16.932-28.509-16.932-49.926c0-22.162,5.706-39.362,17.117-51.601   c11.412-12.238,26.214-18.357,44.406-18.357c2.199,0,4.354,0.095,6.454,0.281h84.839v-28.579h22.203v28.579h22.451v17.365h-22.451   v80.782c0,6.367,0.393,10.461,1.178,12.28c0.786,1.819,2.067,3.267,3.846,4.341c1.777,1.075,4.32,1.613,7.628,1.613   c2.481,0,5.747-0.29,9.8-0.869L511.5,423.052z M408.672,343.725c-0.993-11.081-3.805-19.392-8.435-24.932   c-7.112-8.601-16.332-12.9-27.661-12.9c-10.254,0-18.875,3.432-25.862,10.295c-6.987,6.864-10.854,16.043-11.598,27.537H408.672z    M157.881,395.42c-4.035,0-7.459,1.435-10.279,4.354c-2.82,2.898-4.217,6.405-4.217,10.548c0,4.035,1.397,7.529,4.217,10.473   c2.82,2.944,6.244,4.425,10.279,4.425c4.139,0,7.662-1.48,10.56-4.425c2.906-2.943,4.35-6.438,4.35-10.473   c0-4.044-1.443-7.55-4.35-10.489C165.542,396.875,162.02,395.42,157.881,395.42z M301.047,267.196   c-11.577,5.086-26.172,7.629-43.785,7.629c-30.928,0-52.345-5.954-64.253-17.862c-0.05-0.05-0.096-0.103-0.146-0.152l5.604,14.913   h-58.84l-9.101-30.018H66.737l-8.865,30.018H0.5L68.846,89.883h61.292l45.653,121.494l50.461-3.161   c1.158,8.683,3.514,15.3,7.07,19.847c5.789,7.361,14.058,11.039,24.808,11.039c8.021,0,14.203-1.879,18.544-5.644   c4.342-3.763,6.513-8.125,6.513-13.086c0-4.714-2.067-8.932-6.202-12.652c-4.135-3.722-13.728-7.235-28.777-10.544   c-24.642-5.538-42.214-12.899-52.716-22.078c-10.585-9.18-15.877-20.88-15.877-35.104c0-9.344,2.708-18.172,8.125-26.482   c5.416-8.311,13.562-14.841,24.436-19.598c10.874-4.755,25.779-7.133,44.716-7.133c23.237,0,40.954,4.323,53.151,12.962   c12.197,8.642,19.453,22.39,21.769,41.243l-52.965,3.102c-1.405-8.187-4.362-14.141-8.869-17.862   c-4.506-3.721-10.729-5.581-18.667-5.581c-6.533,0-11.453,1.385-14.761,4.155c-3.308,2.771-4.961,6.14-4.961,10.108   c0,2.896,1.364,5.502,4.093,7.814c2.646,2.4,8.931,4.633,18.854,6.698c24.56,5.293,42.152,10.649,52.778,16.063   c10.626,5.416,18.358,12.137,23.195,20.156c2.479,4.109,4.312,8.472,5.521,13.079V89.883h93.401   c20.342,0,35.578,4.837,45.708,14.512c10.13,9.676,15.195,23.443,15.195,41.306c0,18.357-5.521,32.705-16.56,43.041   c-11.04,10.339-27.889,15.505-50.546,15.505h-30.762v67.478h-56.438v-44.868c-1.574,6.286-4.216,12.271-7.939,17.952   C321.638,254.649,312.624,262.111,301.047,267.196z M392.464,167.407h13.769c10.832,0,18.44-1.88,22.823-5.645   c4.383-3.762,6.573-8.577,6.573-14.45c0-5.706-1.901-10.543-5.705-14.513c-3.804-3.969-10.957-5.954-21.459-5.954h-16.001V167.407z    M118.871,202.386l-20.07-65.368l-19.863,65.368H118.871z" /></g></svg>`,

    // App Development
    "Swift": `<svg viewBox="0 -1 20 20" fill="currentColor" width="18" height="18"><desc>Created with Sketch.</desc><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Dribbble-Light-Preview" transform="translate(-380.000000, -7520.000000)" fill="currentColor"><g id="icons" transform="translate(56.000000, 160.000000)"><path d="M336.322,7360 C345.113,7366.02452 342.27,7372.66771 342.27,7372.66771 C342.27,7372.66771 344.77,7375.5122 343.759,7378 C343.759,7378 342.728,7376.25784 340.999,7376.25784 C339.332,7376.25784 338.353,7378 334.999,7378 C327.531,7378 324,7371.71249 324,7371.71249 C330.728,7376.1732 335.322,7373.01433 335.322,7373.01433 C332.291,7371.24093 325.843,7362.75985 325.843,7362.75985 C331.458,7367.57725 333.885,7368.84785 333.885,7368.84785 C332.437,7367.64073 328.374,7361.74216 328.374,7361.74216 C331.624,7365.05923 338.082,7369.68719 338.082,7369.68719 C339.916,7364.56549 336.322,7360 336.322,7360" id="swift-[#146]" /></g></g></g></svg>`,
    "Java": `<svg viewBox="0 0 512 512" fill="currentColor" width="18" height="18"><g id="5151e0c8492e5103c096af88a51e8d81"><path display="inline" d="M193.918,208.369c-4.729-10.456-6.849-22.652-3.236-33.731c3.612-11.327,11.703-20.413,19.794-28.878   c22.525-22.531,50.285-39.085,72.316-61.986c12.197-12.573,22.278-27.634,25.762-44.937c2.864-12.695,1.496-25.764-1.117-38.337   c11.7,13.319,15.559,32.363,12.197,49.541c-3.608,19.292-14.316,36.344-26.886,51.031c-10.081,11.827-21.659,22.282-33.731,31.993   c-14.065,11.327-27.88,23.524-36.716,39.457c-7.472,12.943-9.215,28.876-4.11,42.942c8.341,24.146,27.756,42.071,38.338,64.848   c-11.703-10.332-23.152-21.036-33.86-32.361C211.471,236.001,200.889,223.307,193.918,208.369z M257.398,189.448   c-2.115,19.792,8.213,38.462,20.539,53.151c5.972,6.596,11.076,14.687,11.323,23.899c0.251,12.318-6.716,23.774-15.684,31.861   c2.119-0.246,3.612-2.115,5.355-3.11c13.443-8.589,26.385-19.418,32.982-34.227c4.357-10.083,3.362-22.034-2.362-31.371   c-6.724-10.953-15.559-20.662-20.786-32.61c-2.867-6.721-3.862-14.562-1.496-21.657c3.114-9.583,9.834-17.426,16.93-24.272   c19.54-18.544,43.189-31.743,65.844-46.179c-28.629,8.214-56.883,19.542-81.03,37.343   C273.702,153.727,259.515,169.658,257.398,189.448z M393.447,283.052c13.568,0.748,26.882,10.704,29.374,24.397   c2.366,11.825-3.358,23.524-10.705,32.485c-12.075,14.438-28.382,24.771-44.807,33.609c-1.622,0.991-2.99,2.237-4.235,3.608   c21.659-5.478,43.314-13.689,60.867-27.756c9.705-8.091,18.294-18.799,20.163-31.619c1.743-11.076-2.86-22.528-11.077-29.871   c-9.96-9.09-24.021-12.448-37.218-10.704c-7.593,0.995-15.931,2.613-21.158,8.961C380.877,284.921,386.971,282.429,393.447,283.052   z M123.22,318.647c16.303,4.357,33.108,5.603,49.787,6.724c14.936,0.995,29.875,1.246,44.937,1.12   c38.833-0.619,77.916-3.236,116.003-11.699c3.608-0.87,7.593-1.493,10.833-3.733c6.347-4.11,13.313-7.347,20.162-10.583   c-30.995,4.979-62.113,9.215-93.478,11.205c-31.74,1.991-63.731,3.236-95.593,1.121c-9.086-0.87-18.423-1.371-26.886-4.858   c-1.994-0.87-4.733-2.609-3.738-5.227c1.869-3.361,5.603-4.977,8.839-6.72c13.694-6.473,28.629-10.081,43.193-14.313   c-25.021-0.376-49.916,5.971-72.814,15.806c-5.105,2.491-10.83,4.481-14.936,8.714c-1.622,1.739-1.622,4.732,0.247,6.222   C113.511,315.787,118.487,317.28,123.22,318.647z M324.864,352.88c-21.784,3.859-43.694,7.472-65.726,8.589   c-24.147,1.618-48.294,0.247-72.191-2.241c-4.604-0.623-9.211-1.368-13.317-3.483c-2.116-1.246-4.231-3.236-4.106-5.854   c0.247-4.106,3.73-6.967,6.222-9.956c-7.715,2.739-15.434,5.599-21.906,10.708c-2.742,2.116-5.478,5.474-4.733,9.208   c1.125,4.356,5.356,6.97,9.09,8.96c9.208,4.733,19.54,6.846,29.625,8.714c25.511,4.11,51.527,4.235,77.167,2.488   c27.141-2.115,54.148-6.594,80.411-14.313C337.932,362.342,330.836,358.479,324.864,352.88z M188.068,395.951   c-6.97,1.99-14.066,4.357-19.79,8.957c-2.868,2.241-5.105,6.104-3.734,9.713c1.743,4.604,6.1,7.347,10.203,9.705   c10.708,5.854,22.78,8.589,34.604,10.708c26.765,4.229,54.27,3.608,80.908-1.12c15.806-2.989,31.615-7.221,46.301-13.815   c-9.584-3.984-18.917-8.467-27.878-13.693c-15.559,2.738-31.246,5.603-47.178,6.598c-21.032,1.618-42.319-0.125-63.355-2.738   c-4.98-1.121-11.202-1.618-14.563-5.976C181.847,400.677,185.828,398.063,188.068,395.951z M358.345,475.982   c17.424-3.604,34.977-7.719,50.908-15.806c4.976-2.867,11.076-5.979,12.698-11.95c0.87-5.725-5.105-8.714-9.337-11.08   c2.613,2.993,4.356,7.347,1.74,10.83c-4.357,5.853-11.821,8.091-18.42,10.332c-20.66,5.85-42.072,8.216-63.355,10.582   c-56.385,5.102-113.146,6.348-169.528,1.618c-18.92-1.994-38.217-4.109-56.264-10.829c-2.86-1.246-7.217-2.492-7.217-6.352   c1.117-3.354,4.357-5.227,7.217-6.845c12.945-6.595,27.384-10.207,41.822-11.077c-4.228-2.491-9.208-2.738-14.062-2.613   c-12.076,0.373-23.9,3.483-35.349,7.347c-9.834,3.604-19.916,7.59-27.76,14.811c-3.111,2.735-5.971,7.962-2.739,11.699   c4.98,5.353,12.699,6.72,19.54,8.338c38.338,6.599,77.171,10.328,116.011,11.699C255.781,488.184,307.684,485.942,358.345,475.982z    M409.378,482.706c-23.402,7.468-47.672,11.574-71.822,14.936c-41.696,5.227-83.769,6.845-125.716,5.603   c-25.515-0.995-51.03-2.738-76.176-6.974c5.85,3.984,13.071,5.227,19.794,7.096c28.257,5.976,57.255,7.096,86.01,7.966   c42.19,0.748,84.387-0.87,125.962-7.468c19.669-3.48,39.459-7.715,57.13-16.927c9.215-4.854,18.552-12.326,20.163-23.152   C435.391,473.741,421.951,478.349,409.378,482.706z" /></g></svg>`,
    "Flutter & Dart": `<svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><path d="M18.909 14.84l-8.086 8.070 8.085 8.085h9.214l-8.073-8.083 8.073-8.073h-9.212zM18.892 1.004l-15.013 14.996 4.624 4.624 19.599-19.603h-9.194z" /></svg>`,

    // Cloud & DevOps
    "AWS": `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6.763 11.212c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 01-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 01-.287-.375 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.39-.384-.59-.894-.59-1.533 0-.678.24-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272-.09.04-.184.075-.28.104a.488.488 0 01-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 01.224-.167 4.577 4.577 0 011.005-.36 4.84 4.84 0 011.246-.151c.95 0 1.644.216 2.091.647.44.43.662 1.085.662 1.963v2.586h.016zm-3.24 1.214c.263 0 .534-.048.822-.144a1.78 1.78 0 00.758-.51 1.27 1.27 0 00.272-.512c.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 00-.735-.136 6.02 6.02 0 00-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 6.726a1.398 1.398 0 01-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 01.32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 01.311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 01-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 01-.303.08h-.687c-.15 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32L12.32 7.747l-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08l-.686.001zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 01-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.32.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 00.415-.758.777.777 0 00-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 01-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .36.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 01.24.2.43.43 0 01.071.263v.375c0 .168-.064.256-.184.256a.83.83 0 01-.303-.096 3.652 3.652 0 00-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.16.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926a2.157 2.157 0 01-.583.703c-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z" /><path d="M.378 15.475c3.384 1.963 7.56 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.44-.2.814.287.383.607-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351zm23.531-.2c.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151l.175-.439c.343-.88.802-2.198.52-2.555-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399z" /></svg>`,
    "Docker": `<svg viewBox="0 0 340 268" fill="currentColor" width="18" height="18"><g class="st2"><path class="st1" d="M334,110.1c-8.3-5.6-30.2-8-46.1-3.7-.9-15.8-9-29.2-24-40.8l-5.5-3.7-3.7,5.6c-7.2,11-10.3,25.7-9.2,39,.8,8.2,3.7,17.4,9.2,24.1-20.7,12-39.8,9.3-124.3,9.3H0c-.4,19.1,2.7,55.8,26,85.6,2.6,3.3,5.4,6.5,8.5,9.6,19,19,47.6,32.9,90.5,33,65.4,0,121.4-35.3,155.5-120.8,11.2.2,40.8,2,55.3-26,.4-.5,3.7-7.4,3.7-7.4l-5.5-3.7h0ZM85.2,92.7h-36.7v36.7h36.7v-36.7ZM132.6,92.7h-36.7v36.7h36.7v-36.7ZM179.9,92.7h-36.7v36.7h36.7v-36.7ZM227.3,92.7h-36.7v36.7h36.7v-36.7ZM37.8,92.7H1.1v36.7h36.7v-36.7ZM85.2,46.3h-36.7v36.7h36.7v-36.7ZM132.6,46.3h-36.7v36.7h36.7v-36.7ZM179.9,46.3h-36.7v36.7h36.7v-36.7ZM179.9,0h-36.7v36.7h36.7V0Z" /></g></svg>`,
    "Azure DevOps": `<svg viewBox="0 0 16 16" fill="currentColor" width="18" height="18"><path fill="currentColor" d="M15 3.622v8.512L11.5 15l-5.425-1.975v1.958L3.004 10.97l8.951.7V4.005L15 3.622zm-2.984.428L6.994 1v2.001L2.382 4.356 1 6.13v4.029l1.978.873V5.869l9.038-1.818z" /></svg>`,

    // Databases
    "SQL Server": `<svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><path d="M16.776 27.848h0.008c0.019 0.047-0.719 2.087-0.987 2.734-0.061 0.145-0.082 0.181-0.115 0.179q-0.897-0.113-1.791-0.25c-1.132-0.172-3.028-0.504-3.506-0.612l-0.111-0.025 0.679-0.152c1.455-0.327 2.153-0.504 2.862-0.721 1.059-0.328 1.944-0.677 2.797-1.083l-0.125 0.054c0.076-0.039 0.173-0.080 0.271-0.116l0.020-0.006zM11.124 26.522c0.006 0.006-0.316 0.522-0.882 1.415-0.24 0.376-0.511 0.806-0.604 0.952-0.094 0.147-0.23 0.372-0.302 0.5l-0.134 0.231-0.067-0.017c-0.162-0.044-1.311-0.45-1.613-0.57-0.429-0.17-0.777-0.333-1.114-0.514l0.057 0.028c-0.299-0.149-0.555-0.314-0.793-0.503l0.009 0.007 1.381-0.377c1.989-0.542 3.090-0.854 3.811-1.080 0.136-0.041 0.249-0.074 0.25-0.071zM11.926 26.5c0.004-0.004 0.206 0.067 0.452 0.16 0.447 0.178 1.009 0.357 1.584 0.501l0.099 0.021c0.713 0.185 1.579 0.34 2.463 0.435l0.083 0.007c0.1 0.008 0.152 0.020 0.137 0.030-0.031 0.020-0.7 0.242-1.191 0.397q-2.889 0.879-5.793 1.703c-0.003 0-0.007 0-0.011 0-0.068 0-0.132-0.019-0.187-0.051l0.002 0.001c0.080-0.115 0.16-0.215 0.244-0.311l-0.003 0.003c0.613-0.73 1.22-1.538 1.781-2.379l0.063-0.1q0.137-0.21 0.275-0.419zM8.302 23.909l0.146 0.164c0.605 0.684 1.308 1.264 2.092 1.72l0.040 0.022c0.093 0.047 0.173 0.1 0.245 0.161l-0.002-0.001q-2.698 0.978-5.411 1.912-0.046-0.028-0.090-0.060l-0.084-0.060 0.131-0.19c0.425-0.616 0.96-1.293 2.131-2.702zM7.721 23.687c0.011 0.011-0.567 0.838-1.375 1.969l-0.734 1.028c-0.121 0.174-0.306 0.447-0.411 0.61l-0.191 0.295-0.202-0.171c-0.305-0.268-0.581-0.55-0.836-0.851l-0.010-0.012c-0.346-0.409-0.609-0.901-0.753-1.441l-0.006-0.026c-0.047-0.217-0.050-0.327-0.004-0.341q1.207-0.291 2.417-0.569l1.625-0.381c0.261-0.063 0.477-0.113 0.48-0.111zM18.077 23.333l0.003 0.004c0 0.1-0.229 1.035-0.42 1.712-0.16 0.566-0.295 1.010-0.544 1.796q-0.095 0.318-0.21 0.63c-1.418-0.246-2.677-0.611-3.875-1.096l0.126 0.045q-0.407-0.159-0.799-0.354c0.163-0.092 0.363-0.189 0.569-0.273l0.038-0.014c2.068-0.901 4.21-1.928 4.942-2.369 0.048-0.035 0.104-0.062 0.165-0.079l0.004-0.001zM13.591 21.767c-0.025 0.084-0.052 0.154-0.083 0.222l0.004-0.011c-0.538 1.267-1.066 2.309-1.651 3.314l0.075-0.14q-0.15 0.275-0.315 0.541c-0.006 0-0.142-0.082-0.305-0.181-0.921-0.554-1.705-1.225-2.363-2.007l-0.012-0.014-0.080-0.1 0.415-0.114c1.572-0.423 2.898-0.894 4.176-1.452l-0.19 0.074c0.178-0.075 0.325-0.136 0.327-0.132zM14.313 21.53c0.099 0.047 0.179 0.092 0.257 0.14l-0.011-0.006c1.001 0.57 2.161 1.034 3.385 1.332l0.093 0.019 0.105 0.025-0.144 0.079c-0.602 0.335-2.588 1.161-4.616 1.921q-0.321 0.12-0.641 0.242c-0.030 0.015-0.064 0.027-0.1 0.033l-0.002 0c0-0.005 0.084-0.165 0.186-0.357 0.501-0.908 0.983-1.983 1.381-3.098l0.049-0.157c0.029-0.091 0.055-0.169 0.059-0.172zM7.229 20.261c0.019 0 0.014 0.035-0.015 0.201q-0.037 0.242-0.051 0.487c-0.005 0.069-0.008 0.149-0.008 0.229 0 0.585 0.151 1.135 0.416 1.612l-0.009-0.017c0.092 0.187 0.165 0.342 0.161 0.345-0.034 0.029-3.037 0.907-3.981 1.166l-0.544 0.15c-0.034 0.010-0.036 0.003-0.025-0.075 0.231-0.9 0.694-1.671 1.32-2.273l0.002-0.002c0.426-0.449 0.918-0.83 1.462-1.128l0.031-0.015q0.614-0.352 1.24-0.681zM18.491 18.92v0.192c-0.014 1.331-0.129 2.624-0.339 3.885l0.020-0.146c-0.907-0.265-1.694-0.598-2.432-1.008l0.060 0.030c-0.412-0.217-0.759-0.434-1.090-0.671l0.028 0.019c0.004-0.005 0.192-0.104 0.417-0.221 0.984-0.509 1.797-0.993 2.58-1.517l-0.096 0.060c0.277-0.185 0.694-0.486 0.786-0.567zM10.658 18.602c-0.156 0.381-0.305 0.689-0.47 0.988l0.025-0.050c-0.439 0.857-0.924 1.701-1.566 2.73l-0.227 0.36c-0.023 0.034-0.033 0.023-0.102-0.117-0.153-0.304-0.274-0.656-0.346-1.026l-0.004-0.026c-0.027-0.18-0.043-0.388-0.043-0.599 0-0.267 0.025-0.527 0.072-0.78l-0.004 0.026c0.059-0.284 0.056-0.277 0.19-0.345 0.577-0.296 2.457-1.177 2.475-1.161zM11.568 18.227l0.012 0.005c0.025 0.046 0.048 0.1 0.068 0.156l0.002 0.008c0.21 0.515 0.462 0.96 0.764 1.366l-0.012-0.016c0.378 0.497 0.795 0.932 1.258 1.314l0.013 0.011c0.029 0.025 0.037 0.020-0.702 0.3q-1.421 0.536-2.867 1c-0.409 0.132-0.755 0.244-0.769 0.25-0.041 0.014-0.029-0.011 0.091-0.197 0.625-1.019 1.226-2.208 1.732-3.446l0.061-0.168c0.077-0.2 0.152-0.4 0.166-0.445 0.010-0.054 0.048-0.098 0.099-0.115l0.001-0c0.024-0.013 0.051-0.020 0.081-0.021h0zM14.536 17.057c0.006 0.137 0.010 0.299 0.010 0.46 0 0.302-0.013 0.602-0.038 0.898l0.003-0.039c-0.107 0.858-0.29 1.635-0.547 2.376l0.024-0.081c-0.306-0.259-0.582-0.528-0.838-0.816l-0.007-0.008c-0.314-0.355-0.592-0.753-0.82-1.183l-0.016-0.033c-0.092-0.173-0.177-0.377-0.245-0.589l-0.008-0.027c0.070-0.050 2.463-0.975 2.481-0.959zM15.165 16.816c0.15 0.056 0.28 0.129 0.397 0.218l-0.004-0.003c0.753 0.486 1.653 0.995 2.582 1.456l0.167 0.075c0.17 0.075 0.189 0.045-0.2 0.309-0.892 0.596-1.917 1.156-2.991 1.626l-0.13 0.051q-0.205 0.094-0.414 0.177c0.010-0.093 0.029-0.178 0.056-0.259l-0.003 0.009c0.278-0.949 0.452-2.043 0.483-3.174l0-0.018c0.002-0.452 0.002-0.455 0.046-0.466h0.008zM18.224 15.813c0.131 0.671 0.216 1.455 0.238 2.255l0 0.020c0.005 0.041 0.008 0.088 0.008 0.136 0 0.061-0.005 0.121-0.014 0.179l0.001-0.006c-0.035 0-0.769-0.431-1.29-0.757q-0.738-0.465-1.452-0.965c-0.044-0.035-0.039-0.036 0.332-0.164 0.631-0.217 2.129-0.697 2.177-0.697zM19.599 15.007l-6.008 1.959-5.223 2.307-1.462 0.387q-0.559 0.529-1.185 1.075c-0.462 0.401-0.895 0.765-1.225 1.027-0.436 0.362-0.826 0.749-1.18 1.167l-0.011 0.014c-0.359 0.426-0.656 0.919-0.867 1.455l-0.012 0.036c-0.079 0.232-0.124 0.499-0.124 0.777 0 0.553 0.18 1.064 0.485 1.477l-0.005-0.007c0.853 1.079 1.957 1.921 3.227 2.445l0.053 0.019c0.788 0.341 1.749 0.672 2.738 0.934l0.149 0.034c1.786 0.425 3.893 0.737 6.048 0.869l0.108 0.005c0.113 0.007 0.244 0.010 0.377 0.010 0.148 0 0.294-0.005 0.439-0.014l-0.020 0.001c0.188-0.303 0.384-0.668 0.559-1.044l0.028-0.068c0.836-1.607 1.563-3.48 2.084-5.438l0.044-0.196c0.257-1.126 0.45-2.463 0.538-3.828l0.004-0.077c0.034-0.442 0.046-1.916 0.020-2.417-0.035-0.783-0.117-1.516-0.244-2.234l0.015 0.102c-0.011-0.041-0.017-0.088-0.017-0.136 0-0.018 0.001-0.036 0.003-0.053l-0 0.002c0.017-0.012 0.074-0.031 0.812-0.246zM14.214 4.5c0.019 0.001 0.040 0.040 0.096 0.164 0.155 0.34 0.637 1.26 0.754 1.437 0.037 0.059 0.1 0.062-0.541-0.041-1.537-0.247-2.036-0.331-2.036-0.341 0.030-0.026 0.064-0.049 0.101-0.066l0.003-0.001c0.524-0.297 0.977-0.614 1.396-0.969l-0.013 0.011 0.219-0.184zM8.776 3.414l0.639 0.797c0.352 0.437 0.705 0.873 0.782 0.967 0.047 0.052 0.092 0.109 0.132 0.17l0.003 0.005c-0.017 0.014-0.925-0.162-1.406-0.274q-0.508-0.108-1.003-0.265l-0.25-0.080 0.001-0.061c0.004-0.306 0.39-0.759 1.045-1.22zM8.955 3.271l0.176 0.060c1.353 0.403 2.955 0.72 4.601 0.89l0.116 0.010c0.15 0.013 0.277 0.026 0.281 0.030-0.078 0.049-0.171 0.099-0.268 0.145l-0.017 0.007c-0.644 0.322-1.353 0.716-1.844 1.023-0.085 0.059-0.181 0.113-0.283 0.157l-0.011 0.004q-0.107-0.015-0.212-0.034l-0.18-0.029-0.456-0.444c-0.801-0.775-1.426-1.375-1.668-1.6zM13.331 1.237h0.006c0.004 0.004 0.021 0.131 0.040 0.281 0.091 0.715 0.246 1.362 0.463 1.979l-0.020-0.067c0.167 0.5 0.17 0.471-0.030 0.415-0.462-0.129-2.539-0.485-4.041-0.694q-0.224-0.029-0.446-0.066c-0.019-0.019 1.083-0.596 1.572-0.825 0.626-0.29 2.333-1 2.457-1.023zM13.407 1.004c-0.1-0.012-1.713 0.569-2.749 0.988-1.215 0.464-2.258 0.999-3.234 1.63l0.067-0.041c-0.242 0.166-0.445 0.369-0.605 0.604l-0.005 0.008c-0.017 0.045-0.026 0.097-0.026 0.151 0 0.001 0 0.002 0 0.003v-0l0.61 0.575 1.447 0.462 3.448 0.617 3.94 0.677 0.040-0.337-0.035-0.006-0.519-0.083-0.106-0.185q-0.803-1.417-1.471-2.905c-0.223-0.49-0.448-1.098-0.634-1.722l-0.028-0.108c-0.085-0.304-0.094-0.322-0.14-0.329zM12.159 15.326c-0.275 0.353-0.553 0.667-0.85 0.962l-0.001 0.001c-0.829 0.851-1.753 1.602-2.757 2.239l-0.062 0.037c-0.135 0.086-0.257 0.162-0.275 0.172-0.029 0.017 0.010-0.027 0.482-0.542 0.297-0.324 0.525-0.592 0.785-0.928 0.121-0.174 0.272-0.318 0.446-0.429l0.006-0.004c0.671-0.485 2.208-1.526 2.226-1.508zM12.863 15.152c0.021-0.004 0.050 0.035 0.174 0.219 0.252 0.376 0.431 0.823 0.506 1.304l0.002 0.019 0.010 0.091-0.621 0.24c-1.112 0.432-2.138 0.858-2.832 1.175-0.194 0.090-0.535 0.252-0.759 0.365s-0.406 0.2-0.406 0.195 0.14-0.111 0.312-0.235c1.29-0.925 2.411-1.962 3.392-3.121l0.022-0.027c0.094-0.115 0.18-0.215 0.191-0.222l0.008-0.002zM11.335 13.952c0.387 0.187 0.72 0.403 1.023 0.654l-0.008-0.007c-0.077 0.081-0.163 0.152-0.257 0.212l-0.006 0.003c-0.431 0.311-1.087 0.805-1.466 1.107-0.4 0.319-0.414 0.329-0.369 0.259 0.208-0.3 0.41-0.643 0.586-1.002l0.021-0.047c0.125-0.254 0.253-0.568 0.363-0.891l0.017-0.059c0.023-0.087 0.056-0.163 0.098-0.232l-0.002 0.004zM17.071 12.546c0.011 0.011-0.615 0.887-0.986 1.382-0.445 0.591-1.237 1.581-1.782 2.224q-0.209 0.255-0.432 0.496c-0.012 0.004-0.019-0.062-0.020-0.166-0.005-0.596-0.147-1.157-0.395-1.657l0.010 0.022c-0.104-0.21-0.121-0.26-0.1-0.28 0.085-0.077 1.408-0.832 2.242-1.278 0.574-0.307 1.453-0.755 1.463-0.743zM18.019 12.309l0.221 0.144c0.597 0.393 1.109 0.773 1.598 1.179l-0.030-0.024c0.257 0.215 0.756 0.662 0.858 0.77l0.055 0.059-0.367 0.103q-2.818 0.769-5.561 1.779c-0.209 0.076-0.387 0.14-0.4 0.14-0.026 0-0.052 0.024 0.416-0.407 1.136-1.036 2.14-2.184 3.006-3.435l0.044-0.067zM14.41 10.824c-0.076 0.354-0.158 0.647-0.255 0.933l0.017-0.059c-0.293 0.865-0.646 1.612-1.072 2.309l0.028-0.050-0.112 0.184-0.254-0.246c-0.241-0.246-0.52-0.454-0.827-0.616l-0.018-0.009c-0.084-0.038-0.156-0.081-0.224-0.13l0.004 0.002c0-0.037 0.775-0.741 1.372-1.247 0.429-0.362 1.33-1.083 1.34-1.072zM15.004 10.719c0.064 0.012 0.654 0.287 1.098 0.51 0.406 0.204 1.022 0.532 1.053 0.561 0.004 0.004-0.212 0.116-0.482 0.251-0.854 0.427-1.585 0.83-2.347 1.296-0.219 0.134-0.4 0.242-0.406 0.242-0.019 0-0.012-0.016 0.11-0.239 0.395-0.721 0.713-1.557 0.91-2.438l0.012-0.064c0.018-0.077 0.037-0.125 0.051-0.121zM25.111 9.682c0.099 0.034 0.184 0.076 0.263 0.128l-0.004-0.003c1.152 0.666 2.147 1.421 3.038 2.283l-0.004-0.004c0.242 0.237 0.834 0.854 0.825 0.858l-0.454 0.036c-2.513 0.227-4.799 0.622-7.020 1.182l0.309-0.066c-0.16 0.037-0.297 0.070-0.307 0.070-0.009 0 0.166-0.175 0.389-0.39 1.136-1.011 2.063-2.229 2.726-3.598l0.030-0.069c0.11-0.222 0.204-0.416 0.207-0.427h0.003zM24.764 9.591c0.009 0.010-0.292 0.481-0.48 0.75-0.275 0.392-0.671 0.907-1.576 2.046l-1.192 1.502q-0.163 0.212-0.336 0.416c-0.042-0.053-0.084-0.112-0.124-0.174l-0.005-0.009c-0.525-0.777-1.132-1.445-1.821-2.018l-0.016-0.013q-0.166-0.139-0.337-0.272c-0.035-0.024-0.065-0.049-0.092-0.078l-0-0c0-0.012 0.771-0.342 1.36-0.582q1.71-0.687 3.471-1.237c0.552-0.169 1.14-0.337 1.148-0.33zM11.505 9.578c0.012-0.012 0.642 0.135 0.986 0.231 0.668 0.187 1.205 0.372 1.729 0.582l-0.115-0.040c0 0.005-0.121 0.111-0.269 0.235-0.594 0.496-1.167 1.016-1.853 1.678q-0.185 0.186-0.385 0.356c-0.009 0-0.012-0.029-0.008-0.062 0.040-0.341 0.063-0.736 0.063-1.136 0-0.566-0.045-1.122-0.133-1.663l0.008 0.059c-0.013-0.070-0.022-0.152-0.025-0.235l-0-0.003zM19.728 7.689c0.041 0 0.869 0.225 1.296 0.354 1.245 0.372 2.271 0.756 3.265 1.198l-0.172-0.068 0.331 0.15-0.234 0.054c-2.031 0.457-3.779 1.013-5.459 1.701l0.226-0.082c-0.134 0.055-0.25 0.1-0.259 0.1 0.025-0.088 0.057-0.165 0.097-0.237l-0.003 0.006c0.438-0.879 0.748-1.902 0.874-2.981l0.004-0.044c0.007-0.084 0.022-0.151 0.034-0.151zM19.383 7.635c-0.018 0.223-0.054 0.427-0.106 0.625l0.006-0.025c-0.297 0.999-0.686 1.869-1.171 2.675l0.029-0.052c-0.064 0.119-0.127 0.22-0.196 0.316l0.006-0.008c-0.106-0.045-0.196-0.093-0.281-0.148l0.007 0.004c-0.493-0.292-1.078-0.584-1.685-0.836l-0.096-0.035q-0.176-0.069-0.347-0.15c-0.030-0.027 1.428-0.993 2.202-1.457 0.619-0.371 1.615-0.926 1.632-0.908zM14.559 6.68c0.014-0.013 1.879 0.31 2.727 0.472 0.632 0.121 1.546 0.312 1.601 0.336 0.027 0.010-0.067 0.062-0.371 0.2-1.147 0.504-2.124 1.044-3.045 1.66l0.071-0.045c-0.232 0.155-0.426 0.282-0.43 0.282-0.006-0.063-0.009-0.136-0.009-0.209 0-0.027 0-0.055 0.001-0.082l-0 0.004c0-0.005 0-0.011 0-0.018 0-0.885-0.18-1.727-0.504-2.494l0.016 0.042c-0.021-0.042-0.040-0.092-0.055-0.144l-0.001-0.006zM14.247 6.635c0.075 0.146 0.132 0.316 0.16 0.495l0.001 0.010c0.14 0.544 0.22 1.168 0.22 1.811 0 0.232-0.010 0.462-0.031 0.689l0.002-0.029-0.015 0.047-0.234-0.075c-0.485-0.155-1.275-0.387-1.952-0.575q-0.354-0.091-0.7-0.212c0.256-0.284 0.518-0.546 0.793-0.794l0.009-0.008c0.519-0.453 1.088-0.899 1.68-1.314l0.066-0.044zM10.314 5.888c0.091 0.009 0.174 0.024 0.255 0.045l-0.011-0.002c0.774 0.17 2.156 0.437 3.043 0.587 0.101 0.012 0.192 0.032 0.28 0.062l-0.010-0.003c-0.035 0.031-0.075 0.057-0.12 0.076l-0.003 0.001c-0.149 0.075-0.752 0.436-0.953 0.571-0.482 0.319-0.903 0.657-1.29 1.029l0.003-0.003q-0.12 0.123-0.246 0.24c-0.019-0.047-0.037-0.105-0.050-0.163l-0.001-0.008c-0.244-0.87-0.521-1.608-0.851-2.316l0.039 0.093q-0.049-0.101-0.089-0.206zM8.077 5.271c0.068 0.016 0.126 0.035 0.181 0.056l-0.010-0.003c0.17 0.058 0.395 0.125 0.657 0.199 0.182 0.050 0.384 0.105 0.599 0.159 0.272 0.070 0.499 0.13 0.501 0.134 0.030 0.034 0.489 1.497 0.645 2.058 0.060 0.215 0.105 0.394 0.101 0.397-0.041-0.051-0.079-0.108-0.11-0.169l-0.003-0.006c-0.626-1.039-1.406-1.916-2.321-2.628l-0.021-0.016q-0.113-0.086-0.22-0.18zM6.908 4.135c-0.030 0.059-0.048 0.128-0.048 0.202 0 0.070 0.016 0.136 0.044 0.194l-0.001-0.003c0.114 0.197 0.256 0.364 0.422 0.502l0.003 0.002s2.018 1.969 2.266 2.254c1.023 1.118 1.65 2.613 1.65 4.254 0 0.021-0 0.043-0 0.064l0-0.003c0.001 0.050 0.002 0.109 0.002 0.168 0 1.128-0.265 2.193-0.736 3.138l0.018-0.041c-1.527 2.742-3.544 5.030-5.954 6.82l-0.057 0.040 0.45-0.15c0.456-0.317 0.985-0.635 1.533-0.919l0.081-0.038c2.067-1.14 4.539-2.27 7.096-3.225l0.4-0.131c4.265-1.603 9.372-3.016 14.634-3.989l0.991-0.152-0.062-0.1c-0.31-0.491-0.61-0.909-0.933-1.309l0.020 0.026c-0.886-1.084-1.955-1.981-3.165-2.653l-0.056-0.028c-2.024-1.075-4.373-1.893-6.854-2.328l-0.144-0.021q-1.365-0.257-2.738-0.469-2.456-0.377-4.904-0.8c-0.531-0.094-1.325-0.226-1.851-0.34-0.488-0.104-0.891-0.215-1.284-0.346l0.083 0.024c-0.335-0.131-0.806-0.259-0.907-0.643z" /></svg>`,
    "MySQL": `<svg viewBox="0 -2 256 256" fill="currentColor" width="18" height="18"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"><path d="M235.648276,194.211632 C221.729851,193.864559 210.942872,195.257272 201.895604,199.083964 C199.285899,200.127406 195.109927,200.128498 194.761767,203.433458 C196.154498,204.826189 196.328034,207.087716 197.546096,209.001055 C199.635192,212.479551 203.287247,217.178343 206.593317,219.614507 C210.246461,222.397748 213.900691,225.180989 217.727416,227.617153 C224.513092,231.793125 232.168625,234.22817 238.779677,238.404123 C242.608577,240.838067 246.434123,243.971711 250.261934,246.581411 C252.176407,247.971926 253.393381,250.234545 255.829549,251.104446 L255.829549,250.582732 C254.611442,249.016479 254.263282,246.754952 253.046308,245.015144 C251.307592,243.275341 249.566702,241.709083 247.826899,239.96928 C242.781025,233.1847 236.518133,227.268984 229.732547,222.397748 C224.166065,218.56995 211.986355,213.35055 209.724764,206.913051 C209.724764,206.913051 209.55014,206.73951 209.376604,206.56597 C213.204371,206.217787 217.727416,204.82618 221.381691,203.781623 C227.297466,202.215374 232.690457,202.563548 238.779677,200.998382 C241.562919,200.30203 244.347292,199.432129 247.130533,198.562222 L247.130533,196.997075 C244.00022,193.864532 241.737588,189.689684 238.431517,186.731778 C229.558965,179.075113 219.815379,171.595269 209.724764,165.332394 C204.330685,161.852792 197.371472,159.590151 191.630412,156.633369 C189.543536,155.587729 186.062797,155.06712 184.845823,153.327299 C181.713302,149.499523 179.973499,144.45476 177.711982,139.930579 C172.668329,130.360605 167.794863,119.749306 163.44541,109.658665 C160.315096,102.872993 158.400651,96.0872892 154.572862,89.8245233 C136.653166,60.2479054 117.167095,42.3281102 87.242308,24.7554574 C80.8048232,21.1023052 73.1503779,19.5360541 64.9730628,17.6227124 C60.6246649,17.4480683 56.2740469,17.1009966 51.9245072,16.9263525 C49.1412661,15.7082579 46.3569195,12.4033092 43.9207465,10.8370441 C34.0058755,4.5730961 8.42942301,-8.99607108 1.1220548,8.92370237 C-3.57563582,20.2324516 8.08126754,31.366477 12.0825475,37.1086812 C15.041536,41.1100178 18.8682195,45.6330512 20.9562053,50.1572463 C22.1742941,53.1129226 22.5213621,56.2465484 23.7394509,59.3779766 C26.523793,67.031339 29.1323922,75.5578744 32.7866404,82.691806 C34.7010855,86.3449577 36.7879657,90.1727422 39.2241297,93.477666 C40.6157457,95.3910055 43.0508086,96.2620126 43.5736286,99.3934363 C41.1385747,102.873029 40.9639284,108.092452 39.5711977,112.441992 C33.3083548,132.101492 35.7445143,156.4588 44.617071,170.89889 C47.4003121,175.247297 54.0124069,184.818421 62.8850316,181.164182 C70.7141415,178.032744 68.9743337,168.115626 71.2358604,159.41661 C71.7586894,157.327523 71.4105022,155.937017 72.4539446,154.545383 C72.4548508,154.718924 72.4539446,154.893561 72.4539446,154.893561 C74.8901041,159.764788 77.3251715,164.46251 79.5866891,169.333656 C84.980736,177.858025 94.3750434,186.731674 102.204103,192.647503 C106.381181,195.777808 109.686136,201.171877 114.905523,203.086313 L114.905523,202.563484 L114.557345,202.563484 C113.512801,200.997231 111.947645,200.301958 110.55602,199.083892 C107.424591,195.952463 103.943884,192.124665 101.50883,188.645081 C94.2025447,178.901486 87.7639408,168.115635 82.0228486,156.980496 C79.2396075,151.587555 76.8034481,145.671734 74.5419214,140.278811 C73.497378,138.189729 73.497378,135.059406 71.7575748,134.015973 C69.1478745,137.842647 65.3211911,141.148717 63.4067461,145.846417 C60.1028916,153.327344 59.7536034,162.548097 58.5355192,172.116947 C57.8402503,172.291598 58.187332,172.116947 57.8391493,172.465138 C52.2726627,171.072408 50.3582176,165.332394 48.2701955,160.460052 C43.0507905,148.107926 42.1808935,128.273684 46.7050387,114.008236 C47.923123,110.353988 53.142528,98.8717128 51.0545422,95.3921019 C50.0110998,92.0860273 46.5303924,90.1726969 44.6170529,87.5629967 C42.3555262,84.2569266 39.9193668,80.082065 38.35421,76.4278576 C34.1782383,66.6853811 32.0902615,55.898411 27.5672354,46.1548154 C25.4792496,41.6306665 21.8261069,36.9340837 18.8682195,32.7592063 C15.563264,28.0615284 11.9090067,24.7554574 9.29927023,19.1878506 C8.43046966,17.2745089 7.21128439,14.1430915 8.60290945,12.0550966 C8.95109211,10.6634847 9.64634733,10.1417599 11.0390689,9.79357497 C13.3005955,7.87912949 19.7380848,10.3152907 21.9995616,11.3587363 C28.4370509,13.9673251 33.8300058,16.4046087 39.2240527,20.0577513 C41.6591111,21.7975523 44.2688113,25.1036232 47.4002396,25.9735239 L51.0544833,25.9735239 C56.6220709,27.1905053 62.8849274,26.3216898 68.1043279,27.8868652 C77.3261638,30.843648 85.6758644,35.1942543 93.1579696,39.8919512 C115.95003,54.332049 134.738553,74.8626147 147.440063,99.3934454 C149.528049,103.39367 150.396845,107.04901 152.31129,111.22389 C155.965538,119.749365 160.488578,128.448376 164.14173,136.799218 C167.794872,144.975401 171.274474,153.327362 176.493861,160.113048 C179.104667,163.765094 189.542403,165.67953 194.240026,167.593975 C197.719632,169.159141 203.113711,170.551871 206.245112,172.465206 C212.159801,176.117243 218.075576,180.29433 223.643145,184.295646 C226.427474,186.382535 235.125402,190.733144 235.648231,194.21165 L235.648276,194.211632 L235.648276,194.211632 Z" fill="currentColor" /><path d="M58.1864892,43.0222644 C55.2286063,43.0222644 53.1417305,43.3715526 51.0537447,43.8932806 C51.0537447,43.8923744 51.0537447,44.0679225 51.0537447,44.2414633 L51.4019319,44.2414633 C52.794658,47.0247034 55.2286154,48.9391485 56.968414,51.3741978 C58.3611446,54.1574389 59.5781143,56.9417945 60.9708449,59.7261412 C61.1443766,59.5514948 61.3179175,59.3779585 61.3179175,59.3779585 C63.7551915,57.6370498 64.9721657,54.8538087 64.9721657,50.6789426 C63.9276177,49.4608583 63.7540769,48.2427786 62.8841798,47.0246944 C61.8407374,45.283782 59.5781052,44.414995 58.1864892,43.0222644 L58.1864892,43.0222644 L58.1864892,43.0222644 Z" fill="currentColor" /></g></svg>`,
    "PostgreSQL": `<svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><path d="M22.839 0c-1.245 0.011-2.479 0.188-3.677 0.536l-0.083 0.027c-0.751-0.131-1.516-0.203-2.276-0.219-1.573-0.027-2.923 0.353-4.011 0.989-1.073-0.369-3.297-1.016-5.641-0.885-1.629 0.088-3.411 0.583-4.735 1.979-1.312 1.391-2.009 3.547-1.864 6.485 0.041 0.807 0.271 2.124 0.656 3.837 0.38 1.709 0.917 3.709 1.589 5.537 0.672 1.823 1.405 3.463 2.552 4.577 0.572 0.557 1.364 1.032 2.296 0.991 0.652-0.027 1.24-0.313 1.751-0.735 0.249 0.328 0.516 0.468 0.755 0.599 0.308 0.167 0.599 0.281 0.907 0.355 0.552 0.14 1.495 0.323 2.599 0.135 0.375-0.063 0.771-0.187 1.167-0.359 0.016 0.437 0.032 0.869 0.047 1.307 0.057 1.38 0.095 2.656 0.505 3.776 0.068 0.183 0.251 1.12 0.969 1.953 0.724 0.833 2.129 1.349 3.739 1.005 1.131-0.24 2.573-0.677 3.532-2.041 0.948-1.344 1.375-3.276 1.459-6.412 0.020-0.172 0.047-0.312 0.072-0.448l0.224 0.021h0.027c1.208 0.052 2.521-0.12 3.62-0.631 0.968-0.448 1.703-0.901 2.239-1.708 0.131-0.199 0.281-0.443 0.319-0.86 0.041-0.411-0.199-1.063-0.595-1.364-0.791-0.604-1.291-0.375-1.828-0.26-0.525 0.115-1.063 0.176-1.599 0.192 1.541-2.593 2.645-5.353 3.276-7.792 0.375-1.443 0.584-2.771 0.599-3.932 0.021-1.161-0.077-2.187-0.771-3.077-2.177-2.776-5.235-3.548-7.599-3.573-0.073 0-0.145 0-0.219 0zM22.776 0.855c2.235-0.021 5.093 0.604 7.145 3.228 0.464 0.589 0.6 1.448 0.584 2.511s-0.213 2.328-0.573 3.719c-0.692 2.699-2.011 5.833-3.859 8.652 0.063 0.047 0.135 0.088 0.208 0.115 0.385 0.161 1.265 0.296 3.025-0.063 0.443-0.095 0.767-0.156 1.105 0.099 0.167 0.14 0.255 0.349 0.244 0.568-0.020 0.161-0.077 0.317-0.177 0.448-0.339 0.509-1.009 0.995-1.869 1.396-0.76 0.353-1.855 0.536-2.817 0.547-0.489 0.005-0.937-0.032-1.319-0.152l-0.020-0.004c-0.147 1.411-0.484 4.203-0.704 5.473-0.176 1.025-0.484 1.844-1.072 2.453-0.589 0.615-1.417 0.979-2.537 1.219-1.385 0.297-2.391-0.021-3.041-0.568s-0.948-1.276-1.125-1.719c-0.124-0.307-0.187-0.703-0.249-1.235-0.063-0.531-0.104-1.177-0.136-1.911-0.041-1.12-0.057-2.24-0.041-3.365-0.577 0.532-1.296 0.88-2.068 1.016-0.921 0.156-1.739 0-2.228-0.12-0.24-0.063-0.475-0.151-0.693-0.271-0.229-0.12-0.443-0.255-0.588-0.527-0.084-0.156-0.109-0.337-0.073-0.509 0.041-0.177 0.145-0.328 0.287-0.443 0.265-0.215 0.615-0.333 1.14-0.443 0.959-0.199 1.297-0.333 1.5-0.496 0.172-0.135 0.371-0.416 0.713-0.828 0-0.015 0-0.036-0.005-0.052-0.619-0.020-1.224-0.181-1.771-0.479-0.197 0.208-1.224 1.292-2.468 2.792-0.521 0.624-1.099 0.984-1.713 1.011-0.609 0.025-1.163-0.281-1.631-0.735-0.937-0.912-1.688-2.48-2.339-4.251s-1.177-3.744-1.557-5.421c-0.375-1.683-0.599-3.037-0.631-3.688-0.14-2.776 0.511-4.645 1.625-5.828s2.641-1.625 4.131-1.713c2.672-0.151 5.213 0.781 5.724 0.979 0.989-0.672 2.265-1.088 3.859-1.063 0.756 0.011 1.505 0.109 2.24 0.292l0.027-0.016c0.323-0.109 0.651-0.208 0.984-0.28 0.907-0.215 1.833-0.324 2.76-0.339zM22.979 1.745h-0.197c-0.76 0.009-1.527 0.099-2.271 0.26 1.661 0.735 2.916 1.864 3.801 3 0.615 0.781 1.12 1.64 1.505 2.557 0.152 0.355 0.251 0.651 0.303 0.88 0.031 0.115 0.047 0.213 0.057 0.312 0 0.052 0.005 0.105-0.021 0.193 0 0.005-0.005 0.016-0.005 0.021 0.043 1.167-0.249 1.957-0.287 3.072-0.025 0.808 0.183 1.756 0.235 2.792 0.047 0.973-0.072 2.041-0.703 3.093 0.052 0.063 0.099 0.125 0.151 0.193 1.672-2.636 2.88-5.547 3.521-8.032 0.344-1.339 0.525-2.552 0.541-3.509 0.016-0.959-0.161-1.657-0.391-1.948-1.792-2.287-4.213-2.871-6.24-2.885zM16.588 2.088c-1.572 0.005-2.703 0.48-3.561 1.193-0.887 0.74-1.48 1.745-1.865 2.781-0.464 1.224-0.625 2.411-0.688 3.219l0.021-0.011c0.475-0.265 1.099-0.536 1.771-0.687 0.667-0.157 1.391-0.204 2.041 0.052 0.657 0.249 1.193 0.848 1.391 1.749 0.939 4.344-0.291 5.959-0.744 7.177-0.172 0.443-0.323 0.891-0.443 1.349 0.057-0.011 0.115-0.027 0.172-0.032 0.323-0.025 0.572 0.079 0.719 0.141 0.459 0.192 0.771 0.588 0.943 1.041 0.041 0.12 0.072 0.244 0.093 0.38 0.016 0.052 0.027 0.109 0.027 0.167-0.052 1.661-0.048 3.323 0.015 4.984 0.032 0.719 0.079 1.349 0.136 1.849 0.057 0.495 0.135 0.875 0.188 1.005 0.171 0.427 0.421 0.984 0.875 1.364 0.448 0.381 1.093 0.631 2.276 0.381 1.025-0.224 1.656-0.527 2.077-0.964 0.423-0.443 0.672-1.052 0.833-1.984 0.245-1.401 0.729-5.464 0.787-6.224-0.025-0.579 0.057-1.021 0.245-1.36 0.187-0.344 0.479-0.557 0.735-0.672 0.124-0.057 0.244-0.093 0.343-0.125-0.104-0.145-0.213-0.291-0.323-0.432-0.364-0.443-0.667-0.937-0.891-1.463-0.104-0.22-0.219-0.439-0.344-0.647-0.176-0.317-0.4-0.719-0.635-1.172-0.469-0.896-0.979-1.989-1.245-3.052-0.265-1.063-0.301-2.161 0.376-2.932 0.599-0.688 1.656-0.973 3.233-0.812-0.047-0.141-0.072-0.261-0.151-0.443-0.359-0.844-0.828-1.636-1.391-2.355-1.339-1.713-3.511-3.412-6.859-3.469zM7.735 2.156c-0.167 0-0.339 0.005-0.505 0.016-1.349 0.079-2.62 0.468-3.532 1.432-0.911 0.969-1.509 2.547-1.38 5.167 0.027 0.5 0.24 1.885 0.609 3.536 0.371 1.652 0.896 3.595 1.527 5.313 0.629 1.713 1.391 3.208 2.12 3.916 0.364 0.349 0.681 0.495 0.968 0.485 0.287-0.016 0.636-0.183 1.063-0.693 0.776-0.937 1.579-1.844 2.412-2.729-1.199-1.047-1.787-2.629-1.552-4.203 0.135-0.984 0.156-1.907 0.135-2.636-0.015-0.708-0.063-1.176-0.063-1.473 0-0.011 0-0.016 0-0.027v-0.005l-0.005-0.009c0-1.537 0.272-3.057 0.792-4.5 0.375-0.996 0.928-2 1.76-2.819-0.817-0.271-2.271-0.676-3.843-0.755-0.167-0.011-0.339-0.016-0.505-0.016zM24.265 9.197c-0.905 0.016-1.411 0.251-1.681 0.552-0.376 0.433-0.412 1.193-0.177 2.131 0.233 0.937 0.719 1.984 1.172 2.855 0.224 0.437 0.443 0.828 0.619 1.145 0.183 0.323 0.313 0.547 0.391 0.745 0.073 0.177 0.157 0.333 0.24 0.479 0.349-0.74 0.412-1.464 0.375-2.224-0.047-0.937-0.265-1.896-0.229-2.864 0.037-1.136 0.261-1.876 0.277-2.751-0.324-0.041-0.657-0.068-0.985-0.068zM13.287 9.355c-0.276 0-0.552 0.036-0.823 0.099-0.537 0.131-1.052 0.328-1.537 0.599-0.161 0.088-0.317 0.188-0.463 0.303l-0.032 0.025c0.011 0.199 0.047 0.667 0.063 1.365 0.016 0.76 0 1.728-0.145 2.776-0.323 2.281 1.333 4.167 3.276 4.172 0.115-0.469 0.301-0.944 0.489-1.443 0.541-1.459 1.604-2.521 0.708-6.677-0.145-0.677-0.437-0.953-0.839-1.109-0.224-0.079-0.457-0.115-0.697-0.109zM23.844 9.625h0.068c0.083 0.005 0.167 0.011 0.239 0.031 0.068 0.016 0.131 0.037 0.183 0.073 0.052 0.031 0.088 0.083 0.099 0.145v0.011c0 0.063-0.016 0.125-0.047 0.183-0.041 0.072-0.088 0.14-0.145 0.197-0.136 0.151-0.319 0.251-0.516 0.281-0.193 0.027-0.385-0.025-0.547-0.135-0.063-0.048-0.125-0.1-0.172-0.157-0.047-0.047-0.073-0.109-0.084-0.172-0.004-0.061 0.011-0.124 0.052-0.171 0.048-0.048 0.1-0.089 0.157-0.12 0.129-0.073 0.301-0.125 0.5-0.152 0.072-0.009 0.145-0.015 0.213-0.020zM13.416 9.849c0.068 0 0.147 0.005 0.22 0.015 0.208 0.032 0.385 0.084 0.525 0.167 0.068 0.032 0.131 0.084 0.177 0.141 0.052 0.063 0.077 0.14 0.073 0.224-0.016 0.077-0.048 0.151-0.1 0.208-0.057 0.068-0.119 0.125-0.192 0.172-0.172 0.125-0.385 0.177-0.599 0.151-0.215-0.036-0.412-0.14-0.557-0.301-0.063-0.068-0.115-0.141-0.157-0.219-0.047-0.073-0.067-0.156-0.057-0.24 0.021-0.14 0.141-0.219 0.256-0.26 0.131-0.043 0.271-0.057 0.411-0.052zM25.495 19.64h-0.005c-0.192 0.073-0.353 0.1-0.489 0.163-0.14 0.052-0.251 0.156-0.317 0.285-0.089 0.152-0.156 0.423-0.136 0.885 0.057 0.043 0.125 0.073 0.199 0.095 0.224 0.068 0.609 0.115 1.036 0.109 0.849-0.011 1.896-0.208 2.453-0.469 0.453-0.208 0.88-0.489 1.255-0.817-1.859 0.38-2.905 0.281-3.552 0.016-0.156-0.068-0.307-0.157-0.443-0.267zM14.787 19.765h-0.027c-0.072 0.005-0.172 0.032-0.375 0.251-0.464 0.52-0.625 0.848-1.005 1.151-0.385 0.307-0.88 0.469-1.875 0.672-0.312 0.063-0.495 0.135-0.615 0.192 0.036 0.032 0.036 0.043 0.093 0.068 0.147 0.084 0.333 0.152 0.485 0.193 0.427 0.104 1.124 0.229 1.859 0.104 0.729-0.125 1.489-0.475 2.141-1.385 0.115-0.156 0.124-0.391 0.031-0.641-0.093-0.244-0.297-0.463-0.437-0.52-0.089-0.043-0.183-0.068-0.276-0.084z" /></svg>`,
    "SQLite": `<svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><path d="M4.884 2.334c-1.265 0.005-2.289 1.029-2.293 2.294v20.754c0.004 1.264 1.028 2.288 2.293 2.292h11.769c-0.056-0.671-0.088-1.452-0.088-2.241 0-0.401 0.008-0.801 0.025-1.198l-0.002 0.057c-0.008-0.077-0.014-0.176-0.020-0.25q-0.229-1.498-0.591-2.972c-0.119-0.504-0.277-0.944-0.478-1.36l0.017 0.039c-0.080-0.126-0.127-0.279-0.127-0.443 0-0.034 0.002-0.068 0.006-0.101l-0 0.004c0.003-0.173 0.020-0.339 0.049-0.501l-0.003 0.019c0.088-0.523 0.19-0.963 0.314-1.394l-0.022 0.088 0.271-0.035c-0.021-0.044-0.018-0.081-0.039-0.121l-0.051-0.476q0.224-0.751 0.477-1.492l0.25-0.024c-0.010-0.020-0.012-0.047-0.023-0.066l-0.054-0.395c1.006-4.731 3.107-8.864 6.029-12.272l-0.031 0.037c0.082-0.086 0.166-0.16 0.247-0.242zM28.094 1.655c-1.29-1.15-2.849-0.687-4.39 0.68q-0.356 0.319-0.684 0.669c-2.8 3.294-4.843 7.319-5.808 11.747l-0.033 0.18c0.261 0.551 0.494 1.201 0.664 1.876l0.016 0.075q0.115 0.436 0.205 0.878s-0.024-0.089-0.12-0.37l-0.062-0.182q-0.019-0.050-0.041-0.1c-0.172-0.4-0.647-1.243-0.857-1.611-0.179 0.529-0.337 1.022-0.47 1.47 0.413 0.863 0.749 1.867 0.959 2.917l0.014 0.083s-0.031-0.124-0.184-0.552c-0.342-0.739-0.664-1.338-1.015-1.919l0.050 0.089c-0.185 0.464-0.292 1.001-0.292 1.564 0 0.1 0.003 0.199 0.010 0.297l-0.001-0.013c0.219 0.426 0.401 0.921 0.519 1.439l0.008 0.043c0.357 1.375 0.606 3.049 0.606 3.049l0.021 0.28c-0.015 0.342-0.023 0.744-0.023 1.147 0 0.805 0.034 1.602 0.101 2.39l-0.007-0.103c0.058 1.206 0.283 2.339 0.651 3.406l-0.026-0.086 0.194-0.105c-0.346-1.193-0.545-2.564-0.545-3.981 0-0.344 0.012-0.684 0.035-1.022l-0.003 0.046c0.221-3.782 0.964-7.319 2.158-10.641l-0.083 0.264c1.655-4.9 4.359-9.073 7.861-12.417l0.012-0.011c-2.491 2.249-5.863 9.535-6.873 12.232-0.963 2.42-1.798 5.294-2.365 8.263l-0.048 0.305c0.664-1.639 1.914-2.926 3.483-3.622l0.042-0.017s1.321-1.63 2.864-3.956c-1.195 0.25-2.184 0.521-3.15 0.843l0.199-0.057c-0.75 0.314-0.952 0.421-0.952 0.421 1.288-0.791 2.777-1.515 4.337-2.092l0.178-0.058c2.867-4.515 5.991-10.929 2.845-13.736z" /></svg>`,
    "MongoDB": `<svg viewBox="0 0 1024 1024" fill="currentColor" width="18" height="18"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"><circle cx="512" cy="512" r="512" style="fill:currentColor" /><path d="M648.86 449.44c-32.34-142.73-108.77-189.66-117-207.59-9-12.65-18.12-35.15-18.12-35.15-.15-.38-.39-1.05-.67-1.7-.93 12.65-1.41 17.53-13.37 30.29-18.52 14.48-113.54 94.21-121.27 256.37-7.21 151.24 109.25 241.36 125 252.85l1.79 1.27v-.11c.1.76 5 36 8.44 73.34H526a726.68 726.68 0 0 1 13-78.53l1-.65a204.48 204.48 0 0 0 20.11-16.45l.72-.65c33.48-30.93 93.67-102.47 93.08-216.53a347.07 347.07 0 0 0-5.05-56.76zM512.35 659.12s0-212.12 7-212.08c5.46 0 12.53 273.61 12.53 273.61-9.72-1.17-19.53-45.03-19.53-61.53z" style="fill:#fff" /></g></svg>`,

    // Automation & ETL
    "Make": `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6.989 4.036L.062 17.818a.577.577 0 00.257.774l3.733 1.876a.577.577 0 00.775-.256L11.753 6.43a.577.577 0 00-.257-.775L7.763 3.78a.575.575 0 00-.774.257z" /><path d="M19.245 3.832h4.179c.318 0 .577.26.577.577v15.425a.578.578 0 01-.577.578h-4.179a.578.578 0 01-.577-.578V4.41c0-.318.259-.577.577-.577z" /><path d="M12.815 4.085L9.85 19.108a.576.576 0 00.453.677l4.095.826c.314.063.62-.14.681-.454l2.964-15.022a.577.577 0 00-.453-.677l-4.096-.827a.577.577 0 00-.68.454z" /></svg>`,
    "n8n": `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path clip-rule="evenodd" d="M24 8.4c0 1.325-1.102 2.4-2.462 2.4-1.146 0-2.11-.765-2.384-1.8h-3.436c-.602 0-1.115.424-1.214 1.003l-.101.592a2.38 2.38 0 01-.8 1.405c.412.354.704.844.8 1.405l.1.592A1.222 1.222 0 0015.719 15h.975c.273-1.035 1.237-1.8 2.384-1.8 1.36 0 2.461 1.075 2.461 2.4S20.436 18 19.078 18c-1.147 0-2.11-.765-2.384-1.8h-.975c-1.204 0-2.23-.848-2.428-2.005l-.101-.592a1.222 1.222 0 00-1.214-1.003H10.97c-.308.984-1.246 1.7-2.356 1.7-1.11 0-2.048-.716-2.355-1.7H4.817c-.308.984-1.246 1.7-2.355 1.7C1.102 14.3 0 13.225 0 11.9s1.102-2.4 2.462-2.4c1.183 0 2.172.815 2.408 1.9h1.337c.236-1.085 1.225-1.9 2.408-1.9 1.184 0 2.172.815 2.408 1.9h.952c.601 0 1.115-.424 1.213-1.003l.102-.592c.198-1.157 1.225-2.005 2.428-2.005h3.436c.274-1.035 1.238-1.8 2.384-1.8C22.898 6 24 7.075 24 8.4zm-1.23 0c0 .663-.552 1.2-1.232 1.2-.68 0-1.23-.537-1.23-1.2 0-.663.55-1.2 1.23-1.2.68 0 1.231.537 1.231 1.2zM2.461 13.1c.68 0 1.23-.537 1.23-1.2 0-.663-.55-1.2-1.23-1.2-.68 0-1.231.537-1.231 1.2 0 .663.55 1.2 1.23 1.2zm6.153 0c.68 0 1.231-.537 1.231-1.2 0-.663-.55-1.2-1.23-1.2-.68 0-1.231.537-1.231 1.2 0 .663.55 1.2 1.23 1.2zm10.462 3.7c.68 0 1.23-.537 1.23-1.2 0-.663-.55-1.2-1.23-1.2-.68 0-1.23.537-1.23 1.2 0 .663.55 1.2 1.23 1.2z" /></svg>`,
    "Apache Airflow": `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12.033 10.713c-.691 0-1.263.564-1.263 1.255 0 .69.572 1.262 1.263 1.262a1.258 1.258 0 000-2.517zm0 .797c.258 0 .457.2.457.458s-.2.458-.457.458c-.259 0-.458-.2-.458-.458s.199-.458.458-.458zM.65.001C.577.001.544.013.3.041.053.07-.027.364.03.673c.055.31.072.205.196.384.124.18 4.228 4.144 6.352 6.216l-3.625 3.72-.133.133-.007.008c-1.25 1.282-1.91 3.251-2.296 5.433C.13 18.748.03 21.161 0 23.35a.63.63 0 00.554.62.757.757 0 00.118 0 .608.608 0 00.384-.184h.007l6.209-6.37c4.021 3.721 4.12 5.08 9.294 6.067 2.182.386 4.595.487 6.784.517a.626.626 0 00.62-.546l.008-.008a.746.746 0 00-.008-.133.621.621 0 00-.177-.37v-.008l-6.378-6.208L21.047 13c.046-.043.089-.088.133-.133l.007-.008c1.25-1.281 1.918-3.244 2.304-5.426.385-2.182.479-4.595.509-6.783a.627.627 0 00-.546-.62L23.446.02a.668.668 0 00-.133.008.608.608 0 00-.369.178h-.007l-6.209 6.37-3.72-3.624-.133-.133-.008-.008C11.586 1.562 9.617.894 7.434.509 5.18.26 2.917.034.65 0zm.48.835c2.039.038 4.213.12 6.164.465 2.105.372 3.927 1.03 5.012 2.089h.008l.103.11c.023.023.049.053.074.082.002.003.005.004.007.008l.008.008.015.015c0 .002-.002.008 0 .008.002.003.005.004.007.008.128.176.354.52.42.664.049.101.093.208.134.325.179.519.268 1.166.206 1.985v.008c-.014.181-.038.37-.066.569-.014.095-.033.2-.052.31a10.753 10.753 0 01-.14.642c-.028.115-.056.232-.089.347v.008c-.13.468-.3.976-.51 1.52-.052.138-.103.272-.161.414-.046.111-.099.225-.148.34l-.258.051c-.875-1.655-1.831-2.8-2.688-3.455-.432-.33-.837-.54-1.225-.627h-.007c-.387-.084-.8-.027-1.07.251l.038.075.32-.239zm22.036.288c-.038 2.04-.12 4.218-.465 6.17-.372 2.105-1.031 3.928-2.09 5.013l-.11.103c-.03.026-.062.059-.096.088l-.015.016h-.007c-.174.126-.527.36-.672.428-.101.047-.21.1-.325.14h-.007c-.516.177-1.166.26-1.979.2-.183-.016-.375-.031-.576-.06l-.302-.052h-.008a10.905 10.905 0 01-.642-.14h-.007c-.117-.03-.234-.065-.347-.096a16.097 16.097 0 01-1.521-.502c-.136-.052-.279-.111-.421-.17a20.905 20.905 0 01-.317-.132c.009-.063-.079.096 0 0a.666.666 0 00-.052-.288c1.638-.87 2.78-1.814 3.433-2.665.331-.433.548-.844.635-1.233.087-.386.027-.806-.251-1.077l.007.008.11.351zM13.9 4.947l2.532 2.466.015.015.015.015c.038.038.078.11.03.332-.022.095-.146.264-.207.391-.082.166-.116.3-.274.502-.546.7-1.616 1.566-3.137 2.377.046-.107.09-.213.133-.317.06-.147.115-.294.17-.436.218-.568.4-1.103.538-1.602a11.804 11.804 0 00.244-1.063V7.62c.019-.107.043-.212.059-.324a8.97 8.97 0 00.067-.628c.05-.677-.07-1.196-.185-1.72zM7.774 7.51c1.592.72 2.634 2.424 3.277 3.617-.108-.047-.217-.089-.324-.133-.147-.06-.294-.115-.436-.17a17.265 17.265 0 00-1.595-.539H8.69c-.125-.034-.244-.067-.362-.096-.24-.059-.476-.106-.701-.148-.108-.018-.22-.034-.332-.051V9.98a10.394 10.394 0 00-.628-.067c-.68-.051-1.202.069-1.727.185l2.473-2.532.03-.03c.036-.039.11-.08.332-.03zm-1.167 3.203c.18.012.368.038.569.067h.007c.096.015.194.034.303.052.205.038.418.085.642.14l.177.044c.057.015.113.027.17.044h.007c.47.13.974.299 1.521.51.137.053.28.104.42.162.12.049.24.103.363.155l.014.266c-1.64.87-2.787 1.82-3.44 2.672-.332.433-.548.837-.635 1.225v.008c-.087.387-.027.8.251 1.07H6.97l-.188-.335-5.94 6.071c.04-2.037.114-4.208.458-6.156.372-2.105 1.031-3.928 2.09-5.012v-.008c.024-.027.053-.048.08-.074l.03-.03a1.788 1.788 0 01.089-.081h.007c.006-.004.01-.012.015-.016.171-.125.533-.367.68-.435a3.658 3.658 0 01.331-.133c.519-.18 1.166-.269 1.986-.207zm5.153.2c-.415.132-.698.42-.834.834l.44-.49zm.546.03l.18.323.146.095.405.313c-.148-.348-.372-.603-.73-.73zm-.288.517c.312 0 .554.242.554.553a.547.547 0 01-.554.554.547.547 0 01-.553-.554c0-.31.242-.554.554-.554zm-1.048.863c.14.363.381.61.746.746l-.241-.276-.203-.234zm2.06.038l-.282.116-.062.178-.284.327c.29-.142.498-.324.628-.62zm-.074.51c.106.045.213.096.318.14.147.06.292.115.435.17.566.217 1.098.394 1.595.53.128.039.253.067.369.097.24.059.476.114.701.155.107.019.22.034.332.051.216.03.426.058.628.074.68.052 1.202-.068 1.727-.184l-2.473 2.532-.015.015-.014.015c-.037.038-.115.074-.325.03h-.008c-.216-.05-.531-.204-.893-.487-.7-.547-1.567-1.618-2.377-3.137zm-1.83.088l-.134.317c-.06.147-.115.294-.17.436a17.065 17.065 0 00-.531 1.594c-.036.128-.067.251-.096.37-.06.24-.114.475-.155.7a12.379 12.379 0 00-.052.333 9.86 9.86 0 00-.073.628c-.052.68.068 1.202.184 1.727L7.567 16.59l-.015-.023-.015-.008v-.008c-.04-.04-.078-.101-.03-.317.002-.004 0-.002 0-.008.05-.216.206-.532.488-.893.546-.7 1.613-1.567 3.13-2.377zm1.04.258c.866 1.626 1.81 2.776 2.658 3.426.433.332.836.548 1.225.634h.008c.387.085.799.027 1.07-.25l-.035-.071-.304.27 6.09 5.942c-2.04-.04-4.22-.122-6.172-.467-2.105-.372-3.928-1.03-5.012-2.089h-.008l-.022-.023-.03-.03c-.008-.008-.013-.019-.022-.03l-.03-.03c-.023-.027-.053-.057-.08-.089v-.008c-.003-.004-.012-.01-.015-.015a6.316 6.316 0 01-.436-.679 3.49 3.49 0 01-.133-.332c-.18-.519-.269-1.166-.206-1.986.013-.18.037-.368.066-.568v-.008c.014-.094.033-.196.052-.303.037-.205.085-.419.14-.642v-.008l.044-.17.045-.17v-.008c.13-.47.298-.973.51-1.52.052-.137.111-.28.169-.42.047-.115.097-.231.148-.348l.28-.015z" /></svg>`,

    // Tools & Platforms
    "Git": `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 5C6 4.44772 6.44772 4 7 4C7.55228 4 8 4.44772 8 5C8 5.55228 7.55228 6 7 6C6.44772 6 6 5.55228 6 5ZM8 7.82929C9.16519 7.41746 10 6.30622 10 5C10 3.34315 8.65685 2 7 2C5.34315 2 4 3.34315 4 5C4 6.30622 4.83481 7.41746 6 7.82929V16.1707C4.83481 16.5825 4 17.6938 4 19C4 20.6569 5.34315 22 7 22C8.65685 22 10 20.6569 10 19C10 17.7334 9.21506 16.6501 8.10508 16.2101C8.45179 14.9365 9.61653 14 11 14H13C16.3137 14 19 11.3137 19 8V7.82929C20.1652 7.41746 21 6.30622 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.30622 15.8348 7.41746 17 7.82929V8C17 10.2091 15.2091 12 13 12H11C9.87439 12 8.83566 12.3719 8 12.9996V7.82929ZM18 6C18.5523 6 19 5.55228 19 5C19 4.44772 18.5523 4 18 4C17.4477 4 17 4.44772 17 5C17 5.55228 17.4477 6 18 6ZM6 19C6 18.4477 6.44772 18 7 18C7.55228 18 8 18.4477 8 19C8 19.5523 7.55228 20 7 20C6.44772 20 6 19.5523 6 19Z" fill="currentColor" /></svg>`,
    "GitHub": `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M9.29183 21V18.4407L9.3255 16.6219C9.36595 16.0561 9.58639 15.5228 9.94907 15.11C9.95438 15.1039 9.95972 15.0979 9.9651 15.0919C9.9791 15.0763 9.96988 15.0511 9.94907 15.0485V15.0485C7.52554 14.746 5.0005 13.7227 5.0005 9.26749C4.9847 8.17021 5.3427 7.10648 6.00437 6.27215C6.02752 6.24297 6.05103 6.21406 6.07492 6.18545V6.18545C6.10601 6.1482 6.11618 6.09772 6.10194 6.05134C6.10107 6.04853 6.10021 6.04571 6.09935 6.04289C6.0832 5.9899 6.06804 5.93666 6.05388 5.88321C5.81065 4.96474 5.86295 3.98363 6.20527 3.09818C6.20779 3.09164 6.21034 3.08511 6.2129 3.07858C6.22568 3.04599 6.25251 3.02108 6.28698 3.01493V3.01493C6.50189 2.97661 7.37036 2.92534 9.03298 4.07346C9.08473 4.10919 9.13724 4.14609 9.19053 4.18418V4.18418C9.22901 4.21168 9.27794 4.22011 9.32344 4.20716C9.32487 4.20675 9.32631 4.20634 9.32774 4.20593C9.41699 4.18056 9.50648 4.15649 9.59617 4.1337C11.1766 3.73226 12.8234 3.73226 14.4038 4.1337C14.4889 4.1553 14.5737 4.17807 14.6584 4.20199C14.6602 4.20252 14.6621 4.20304 14.6639 4.20356C14.7174 4.21872 14.7749 4.20882 14.8202 4.17653V4.17653C14.8698 4.14114 14.9187 4.10679 14.967 4.07346C16.6257 2.92776 17.4894 2.9764 17.7053 3.01469V3.01469C17.7404 3.02092 17.7678 3.04628 17.781 3.07946C17.7827 3.08373 17.7843 3.08799 17.786 3.09226C18.1341 3.97811 18.1894 4.96214 17.946 5.88321C17.9315 5.93811 17.9159 5.9928 17.8993 6.04723V6.04723C17.8843 6.09618 17.8951 6.14942 17.9278 6.18875C17.9289 6.18998 17.9299 6.19121 17.9309 6.19245C17.9528 6.21877 17.9744 6.24534 17.9956 6.27215C18.6573 7.10648 19.0153 8.17021 18.9995 9.26749C18.9995 13.747 16.4565 14.7435 14.0214 15.015V15.015C14.0073 15.0165 14.001 15.0334 14.0105 15.0439C14.0141 15.0479 14.0178 15.0519 14.0214 15.0559C14.2671 15.3296 14.4577 15.6544 14.5811 16.0103C14.7101 16.3824 14.7626 16.7797 14.7351 17.1754V21" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><path d="M4 17C4.36915 17.0523 4.72159 17.1883 5.03065 17.3975C5.3397 17.6068 5.59726 17.8838 5.7838 18.2078C5.94231 18.4962 6.15601 18.7504 6.41264 18.9557C6.66927 19.161 6.96379 19.3135 7.27929 19.4043C7.59478 19.4952 7.92504 19.5226 8.25112 19.485C8.5772 19.4475 8.89268 19.3457 9.17946 19.1855" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`,
    "hasura.io": `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M2.122.001a.393.393 0 0 0-.336.139C.448 1.725.034 6.02.724 8.172A4.54 4.54 0 0 1 .88 10.38c-.133.73-.269 1.612-.269 2.222C.611 18.895 5.712 24 12.001 24c6.29 0 11.388-5.102 11.388-11.399 0-.613-.133-1.493-.27-2.222a4.54 4.54 0 0 1 .157-2.207c.69-2.15.276-6.447-1.062-8.032a.405.405 0 0 0-.649.05l-1.649 2.59a1.268 1.268 0 0 1-1.693.275A11.325 11.325 0 0 0 12 1.203c-2.297 0-4.435.682-6.223 1.852a1.27 1.27 0 0 1-1.693-.276L2.434.19a.41.41 0 0 0-.312-.189zM12 3.805a8.835 8.835 0 0 1 8.82 8.824c-.004 4.864-3.959 8.823-8.82 8.823-4.861 0-8.816-3.959-8.816-8.824a8.836 8.836 0 0 1 5.048-7.976A8.73 8.73 0 0 1 12 3.805zM9.566 8.732a.254.254 0 0 0-.219.127.253.253 0 0 0 .003.255l1.848 3.111-2.482 3.787a.257.257 0 0 0-.011.26.252.252 0 0 0 .222.134h1.859a.258.258 0 0 0 .213-.116l1.341-2.098 1.202 2.086a.251.251 0 0 0 .22.128h1.832a.247.247 0 0 0 .219-.128.234.234 0 0 0 .006-.255l-2.253-3.908-1.933-3.259a.251.251 0 0 0-.22-.124z" /></svg>`,

    // Office 365
    "Excel": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="10" y1="3" x2="10" y2="21"></line></svg>`,
    "Word": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
    "PowerPoint": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line></svg>`,

  };

  const genericIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;

  document.querySelectorAll('.skill-list .skill-item').forEach(item => {
    if (item.parentNode.classList.contains('skill-item-content')) return;

    const nameSpan = item.querySelector('.skill-name');
    if (!nameSpan) return;

    const skillName = nameSpan.textContent.trim();

    let svgIcon = skillIcons[skillName];
    if (!svgIcon) {
      const i18nKey = nameSpan.getAttribute('data-i18n');
      if (i18nKey) {
        const originalVal = (typeof en !== 'undefined' && en[i18nKey]) || (typeof de !== 'undefined' && de[i18nKey]);
        if (originalVal) {
          svgIcon = skillIcons[originalVal];
        }
      }
    }
    if (!svgIcon) {
      svgIcon = genericIcon;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'skill-item-wrapper';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'skill-item-icon';
    iconDiv.innerHTML = svgIcon;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'skill-item-content';

    item.parentNode.insertBefore(wrapper, item);
    contentDiv.appendChild(item);
    wrapper.appendChild(iconDiv);
    wrapper.appendChild(contentDiv);
  });

  // ==========================================
  // Cookie Consent Banner & GDPR Manager
  // ==========================================
  /**
   * Initializes the Cookie Consent Banner & GDPR Manager. Handles default choices,
   * customized cookies panels, saving consents to local storage, triggering analytical scripts,
   * and providing smooth, modern, glowing toast notifications upon preference saving.
   */
  function initCookieBanner() {
    const banner = document.getElementById("cookie-banner");
    if (!banner) return;

    const acceptAllBtn = document.getElementById("cookie-accept-all");
    const customizeBtn = document.getElementById("cookie-customize");
    const rejectAllBtn = document.getElementById("cookie-reject-all");
    const saveSettingsBtn = document.getElementById("cookie-save-settings");
    const footerLink = document.getElementById("open-cookie-settings");

    const prefChk = document.getElementById("cookie-pref-chk");
    const analyticsChk = document.getElementById("cookie-analytics-chk");

    const localStorageKey = "portfolio_cookie_consent";

    // Show banner if consent not yet given
    const consent = localStorage.getItem(localStorageKey);
    if (!consent) {
      setTimeout(() => {
        banner.classList.add("show");
      }, 1000);
    }

    // Save consent helper
    function saveConsent(preferences, analytics) {
      const consentObj = {
        necessary: true,
        preferences: preferences,
        analytics: analytics
      };
      localStorage.setItem(localStorageKey, JSON.stringify(consentObj));

      // Handle Preference cookies de-persist
      if (!preferences) {
        localStorage.removeItem("portfolio_lang");
        localStorage.removeItem("portfolio_dashboard_view");
      } else {
        if (typeof currentLang !== "undefined") {
          localStorage.setItem("portfolio_lang", currentLang);
        }
      }


      banner.classList.remove("show", "expanded");
      
      // Emit custom event in case other components need to react to consent changes
      const event = new CustomEvent("cookieConsentChanged", { detail: consentObj });
      document.dispatchEvent(event);

      // Update analytics state and hide/show charts in real-time
      updateAnalyticsState();

      // Show dynamic toast notification stating exactly what occurred
      const activeLang = typeof currentLang !== "undefined" ? currentLang : "en";
      let toastMsg = "";

      if (preferences && analytics) {
        // Accept All
        toastMsg = typeof translations !== "undefined" && translations[activeLang] && translations[activeLang]["cookie_toast_accept_all"]
          ? translations[activeLang]["cookie_toast_accept_all"]
          : (activeLang === "de" ? "Alle Cookies wurden erfolgreich akzeptiert!" : "All cookies have been successfully accepted!");
        showCookieToast(toastMsg, "success");
      } else if (!preferences && !analytics) {
        // Reject All
        toastMsg = typeof translations !== "undefined" && translations[activeLang] && translations[activeLang]["cookie_toast_reject_all"]
          ? translations[activeLang]["cookie_toast_reject_all"]
          : (activeLang === "de" ? "Optionale Cookies wurden erfolgreich abgelehnt." : "Optional cookies have been successfully declined.");
        showCookieToast(toastMsg, "reject");
      } else {
        // Custom save settings
        toastMsg = typeof translations !== "undefined" && translations[activeLang] && translations[activeLang]["cookie_toast_custom"]
          ? translations[activeLang]["cookie_toast_custom"]
          : (activeLang === "de" ? "Cookie-Einstellungen wurden erfolgreich gespeichert!" : "Cookie preferences have been successfully saved!");
        showCookieToast(toastMsg, "success");
      }
    }

    // Glassmorphic Toast Notification for cookie changes
    function showCookieToast(message, type = "success") {
      const existingToast = document.getElementById("cookie-toast");
      if (existingToast) {
        existingToast.remove();
      }

      const toast = document.createElement("div");
      toast.id = "cookie-toast";
      toast.className = `cookie-toast ${type}`;
      toast.innerHTML = `
        <div class="cookie-toast-content">
          <svg class="cookie-toast-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-7.07 17.07A10 10 0 0 0 19 19a10 10 0 0 0 3-7c0-2-1-3-2-4a3 3 0 0 1-3.5-3.5C16 3.5 15 2 12 2zm-4.5 11a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 7.5 13zm2-5a1.2 1.2 0 1 1 1.2-1.2A1.2 1.2 0 0 1 9.5 8zm3.5 8.5a1.8 1.8 0 1 1 1.8-1.8 1.8 1.8 0 0 1-1.8 1.8zm0-5.5a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5zm3.5 3a1.2 1.2 0 1 1 1.2-1.2 1.2 1.2 0 0 1-1.2 1.2z" />
            <circle cx="18.5" cy="3.5" r="0.8" />
            <circle cx="21" cy="6.5" r="1.1" />
          </svg>
          <span class="cookie-toast-text">${message}</span>
        </div>
        <button class="cookie-toast-close" aria-label="Close Notification">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="cookie-toast-progress"></div>
      `;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.classList.add("show");
      }, 50);

      const closeBtn = toast.querySelector(".cookie-toast-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          dismissToast(toast);
        });
      }

      setTimeout(() => {
        if (toast.parentNode) {
          dismissToast(toast);
        }
      }, 4000);
    }

    function dismissToast(toast) {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 400);
    }

    // Dynamic overlay blocker checker for Analytics cookies
    function updateAnalyticsState() {
      const featured = document.querySelector(".skills-featured");
      if (!featured) return;

      const consent = localStorage.getItem(localStorageKey);
      let allowAnalytics = true;
      if (consent) {
        try {
          const consentObj = JSON.parse(consent);
          allowAnalytics = !!consentObj.analytics;
        } catch (e) {
          console.error("Error parsing consent for analytics overlay", e);
        }
      }

      if (allowAnalytics) {
        featured.classList.remove("analytics-blocked");
        // Re-run animation for standard charts
        if (typeof animateFeaturedCharts === "function") {
          animateFeaturedCharts();
        }
      } else {
        featured.classList.add("analytics-blocked");
      }
    }

    // Bind event listeners
    if (acceptAllBtn) {
      acceptAllBtn.addEventListener("click", () => {
        saveConsent(true, true);
      });
    }

    if (rejectAllBtn) {
      rejectAllBtn.addEventListener("click", () => {
        saveConsent(false, false);
      });
    }

    if (customizeBtn) {
      customizeBtn.addEventListener("click", () => {
        banner.classList.toggle("expanded");
      });
    }

    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener("click", () => {
        const isPref = prefChk ? prefChk.checked : false;
        const isAnalytics = analyticsChk ? analyticsChk.checked : false;
        saveConsent(isPref, isAnalytics);
      });
    }

    // Bind enable button inside charts overlay
    const overlayBtn = document.getElementById("enable-analytics-overlay-btn");
    if (overlayBtn) {
      overlayBtn.addEventListener("click", () => {
        banner.classList.add("show", "expanded");
        if (prefChk) {
          const currentConsent = localStorage.getItem(localStorageKey);
          if (currentConsent) {
            try {
              const consentObj = JSON.parse(currentConsent);
              prefChk.checked = !!consentObj.preferences;
              analyticsChk.checked = !!consentObj.analytics;
            } catch (e) {}
          } else {
            prefChk.checked = true;
            analyticsChk.checked = true;
          }
        }
      });
    }

    if (footerLink) {
      footerLink.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Restore checkbox states from saved consent, if any
        const currentConsent = localStorage.getItem(localStorageKey);
        if (currentConsent) {
          try {
            const consentObj = JSON.parse(currentConsent);
            if (prefChk) prefChk.checked = !!consentObj.preferences;
            if (analyticsChk) analyticsChk.checked = !!consentObj.analytics;
          } catch (err) {
            console.error("Error parsing saved cookie consent", err);
          }
        } else {
          // If no consent exists, check by default
          if (prefChk) prefChk.checked = true;
          if (analyticsChk) analyticsChk.checked = true;
        }

        // Show banner and expand settings
        banner.classList.add("show", "expanded");
      });
    }

    // Bind close button ('X')
    const closeBannerBtn = document.getElementById("cookie-close-btn");
    if (closeBannerBtn) {
      closeBannerBtn.addEventListener("click", () => {
        banner.classList.remove("show", "expanded");
      });
    }

    // Run active checkers on initial page load
    updateAnalyticsState();

  }

  // --- Chart Info Modal Controller ---
  function initChartInfoModal() {
    const infoBtn = document.getElementById("chart-info-btn");
    const modal = document.getElementById("chart-info-modal");
    const closeBtn = document.getElementById("chart-info-close");
    const modalTitle = document.getElementById("chart-info-title");
    const modalBody = document.getElementById("chart-info-body");

    if (!infoBtn || !modal || !modalBody || !modalTitle) return;

    function openModal() {
      // Find which chart view is currently active
      const activeBtn = document.querySelector(".toggle-btn.active");
      if (!activeBtn) return;
      const currentView = activeBtn.getAttribute("data-view");

      // Load translations based on current language
      const lang = (typeof currentLang !== "undefined") ? currentLang : "en";
      const translationsDict = (typeof translations !== "undefined") ? translations : null;

      if (currentView === "radial") {
        modalTitle.textContent = (translationsDict && translationsDict[lang]) 
          ? translationsDict[lang]["radial_info_title"] 
          : "Circular Gauges Guide";
        modalBody.innerHTML = (translationsDict && translationsDict[lang])
          ? `<p>${translationsDict[lang]["radial_info_text"]}</p>`
          : "<p>The circular gauges visualize my current level of knowledge across various technological domains.</p>";
      } else if (currentView === "radar") {
        modalTitle.textContent = (translationsDict && translationsDict[lang]) 
          ? translationsDict[lang]["radar_info_title"] 
          : "Radar Chart Guide";
        modalBody.innerHTML = (translationsDict && translationsDict[lang])
          ? `<p>${translationsDict[lang]["radar_info_text"]}</p>`
          : "<p>This radar chart maps the distribution of my technical competencies across five major domains.</p>";
      } else if (currentView === "matrix") {
        modalTitle.textContent = (translationsDict && translationsDict[lang])
          ? translationsDict[lang]["matrix_info_title"]
          : "Skill Bubble Matrix Guide";
        modalBody.innerHTML = (translationsDict && translationsDict[lang])
          ? `<p>${translationsDict[lang]["matrix_info_text"]}</p>`
          : "<p>The Skill Bubble Matrix maps individual technologies on a two-dimensional grid.</p>";
      } else if (currentView === "bar") {
        modalTitle.textContent = (translationsDict && translationsDict[lang])
          ? translationsDict[lang]["bar_info_title"]
          : "Bar Chart Guide";
        modalBody.innerHTML = (translationsDict && translationsDict[lang])
          ? `<p>${translationsDict[lang]["bar_info_text"]}</p>`
          : "<p>This bar chart illustrates my practical experience in years for each core technology.</p>";
      } else if (currentView === "line") {
        modalTitle.textContent = (translationsDict && translationsDict[lang])
          ? translationsDict[lang]["line_info_title"]
          : "Line Chart Guide";
        modalBody.innerHTML = (translationsDict && translationsDict[lang])
          ? `<p>${translationsDict[lang]["line_info_text"]}</p>`
          : "<p>This line chart visualizes my professional learning curve and skill growth over the past years.</p>";
      }

      modal.classList.add("open");
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    function closeModal() {
      modal.classList.remove("open");
      document.body.style.overflow = ""; // Restore background scroll
    }

    infoBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    // Close modal when clicking outside the box (directly on the overlay)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close modal on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        closeModal();
      }
    });
  }

  initChartInfoModal();
  initCookieBanner();
});

