/* =============================================================================
   ANALYTICS — Google Analytics 4 + ITANALYTICS helper
   Fuente única de verdad para todo el tracking del sitio.
   Reemplazar GA_MEASUREMENT_ID por el ID real de GA4 antes de producción.
   ============================================================================= */


// ─── 1. GA4 INIT ─────────────────────────────────────────────────────────────

window.dataLayer = window.dataLayer || [];

function gtag() {
  window.dataLayer.push(arguments);
}

gtag('js', new Date());

gtag('config', 'GA_MEASUREMENT_ID', {
  anonymize_ip: true,
  send_page_view: true
});


// ─── 2. ITANALYTICS — objeto global de tracking ───────────────────────────────

window.ITANALYTICS = {

  /**
   * Registra una vista de página manual.
   * Útil para SPAs o secciones con navegación sin recarga.
   * @param {string} page - ruta o nombre de la página
   */
  trackPageView(page) {
    gtag('event', 'page_view', {
      page_path: page || window.location.pathname
    });
  },

  /**
   * Evento genérico reutilizable.
   * @param {string} category - agrupación del evento (ej: 'engagement')
   * @param {string} action   - acción ejecutada (ej: 'click')
   * @param {string} label    - detalle adicional (ej: nombre del botón)
   */
  trackEvent(category, action, label) {
    gtag('event', action, {
      event_category: category,
      event_label: label || ''
    });
  },

  /**
   * Conversiones predefinidas del sitio.
   * Cada tipo mapea a un evento específico en GA4.
   * @param {string} type - identificador de la conversión
   */
  trackConversion(type) {
    const conversions = {
      'nav-cta-click':         { event: 'cta_click',       label: 'Navbar — Iniciar Proyecto' },
      'hero-cta-contacto':     { event: 'cta_click',       label: 'Hero — Contanos tu proyecto' },
      'hero-cta-proceso':      { event: 'cta_click',       label: 'Hero — Ver cómo trabajamos' },
      'portfolio-disney-click':{ event: 'portfolio_click', label: 'Portfolio — Con Magui a Disney' },
      'whatsapp-float-click':  { event: 'whatsapp_click',  label: 'Float — WhatsApp' },
      'form-submit':           { event: 'form_submit',     label: 'Contacto — Formulario enviado' }
    };

    const conversion = conversions[type];

    if (conversion) {
      gtag('event', conversion.event, {
        event_category: 'conversion',
        event_label: conversion.label
      });
    } else {
      // Conversión no mapeada — se trackea igual con el type como label
      gtag('event', 'conversion', {
        event_category: 'conversion',
        event_label: type
      });
    }
  }

};


// ─── 3. SCROLL DEPTH ─────────────────────────────────────────────────────────
// Trackea cuánto del contenido leyó el usuario: 25%, 50%, 75%, 100%

(function () {
  const milestones = [25, 50, 75, 100];
  const reached = new Set();

  function getScrollPercent() {
    const el = document.documentElement;
    const scrolled = el.scrollTop || document.body.scrollTop;
    const total = el.scrollHeight - el.clientHeight;
    return total > 0 ? Math.round((scrolled / total) * 100) : 0;
  }

  function onScroll() {
    const pct = getScrollPercent();
    milestones.forEach(function (m) {
      if (pct >= m && !reached.has(m)) {
        reached.add(m);
        gtag('event', 'scroll_depth', {
          event_category: 'engagement',
          event_label: m + '%',
          value: m
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
