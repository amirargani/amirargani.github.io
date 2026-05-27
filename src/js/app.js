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
