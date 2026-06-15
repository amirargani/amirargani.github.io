/**
 * GDPR-Compliant Font Loader
 * ===========================
 * Dynamically loads Google Fonts from fonts.googleapis.com if preference/analytics cookies
 * are allowed, otherwise falls back to self-hosted local WOFF2 files via font.css.
 * Listens for cookieConsentChanged events to switch styles in real-time.
 */

(function () {
  const gFontsUrl = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;500;600;700;800&display=swap";
  const localFontsUrl = "src/css/font.css";
  const localStorageKey = "portfolio_cookie_consent";
  
  let currentLink = null;

  /**
   * Resolves and updates font files dynamically based on GDPR-compliant user cookie choices.
   */
  function updateFonts() {
    const consentStr = localStorage.getItem(localStorageKey);
    let useGoogleFonts = false;

    if (consentStr) {
      try {
        const consent = JSON.parse(consentStr);
        useGoogleFonts = !!consent.fonts;
      } catch (e) {
        console.error("Failed to parse cookie consent for fonts:", e);
      }
    }

    const targetUrl = useGoogleFonts ? gFontsUrl : localFontsUrl;

    if (currentLink && currentLink.getAttribute("href") === targetUrl) {
      return;
    }

    const newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.href = targetUrl;
    
    if (useGoogleFonts) {
      const preconnect1 = document.createElement("link");
      preconnect1.rel = "preconnect";
      preconnect1.href = "https://fonts.googleapis.com";
      preconnect1.id = "gfonts-preconnect-1";
      
      const preconnect2 = document.createElement("link");
      preconnect2.rel = "preconnect";
      preconnect2.href = "https://fonts.gstatic.com";
      preconnect2.crossOrigin = "anonymous";
      preconnect2.id = "gfonts-preconnect-2";

      document.head.appendChild(preconnect1);
      document.head.appendChild(preconnect2);
    } else {
      const p1 = document.getElementById("gfonts-preconnect-1");
      const p2 = document.getElementById("gfonts-preconnect-2");
      if (p1) p1.remove();
      if (p2) p2.remove();
    }

    document.head.appendChild(newLink);

    if (currentLink) {
      currentLink.remove();
    }
    currentLink = newLink;
  }

  updateFonts();
  document.addEventListener("cookieConsentChanged", updateFonts);
})();
