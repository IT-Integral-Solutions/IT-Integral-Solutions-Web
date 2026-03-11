/* =============================================================================
   ANALYTICS — Google Analytics 4 + ITANALYTICS helper
   Fuente única de verdad para todo el tracking del sitio.
   ============================================================================= */

// ─── 1. CONFIG ────────────────────────────────────────────────────────────────
const GA_MEASUREMENT_ID = 'G-TKNN5J2Z5Y';

// ─── 2. CARGA DINÁMICA DE GTAG.JS ────────────────────────────────────────────
(function loadGtag() {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
})();

window.dataLayer = window.dataLayer || [];

function gtag() {
  window.dataLayer.push(arguments);
}

gtag('js', new Date());

gtag('config', GA_MEASUREMENT_ID, {
  anonymize_ip: true,
  send_page_view: true
});

// ─── 3. OBJETO GLOBAL DE TRACKING ────────────────────────────────────────────
window.ITANALYTICS = {
  trackPageView(page) {
    gtag('event', 'page_view', {
      page_path: page || window.location.pathname
    });
  },

  trackEvent(category, action, label, extra = {}) {
    gtag('event', action, {
      event_category: category,
      event_label: label || '',
      ...extra
    });
  },

  trackConversion(type, extra = {}) {
    const conversions = {
      'nav-cta-click':          { event: 'cta_click',       label: 'Navbar - Iniciar Proyecto' },
      'hero-cta-contacto':      { event: 'cta_click',       label: 'Hero - Contanos tu proyecto' },
      'hero-cta-proceso':       { event: 'cta_click',       label: 'Hero - Ver como trabajamos' },
      'problem-cta-click':      { event: 'cta_click',       label: 'Problemas - Quiero una solucion a medida' },
      'whatsapp-float-click':   { event: 'whatsapp_click',  label: 'Float - WhatsApp' },
      'form-submit':            { event: 'form_submit',     label: 'Contacto - Formulario enviado' },
      'portfolio-disney-click': { event: 'portfolio_click', label: 'Portfolio - Con Magui a Disney' }
    };

    const conversion = conversions[type];

    if (conversion) {
      gtag('event', conversion.event, {
        event_category: 'conversion',
        event_label: conversion.label,
        ...extra
      });
    } else {
      gtag('event', 'conversion', {
        event_category: 'conversion',
        event_label: type,
        ...extra
      });
    }
  }
};

// ─── 4. SCROLL DEPTH ─────────────────────────────────────────────────────────
(function setupScrollDepth() {
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

    milestones.forEach((m) => {
      if (pct >= m && !reached.has(m)) {
        reached.add(m);
        gtag('event', 'scroll_depth', {
          event_category: 'engagement',
          event_label: `${m}%`,
          value: m
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ─── 5. TRACKING AUTOMÁTICO DE INTERACCIONES ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // CTA navbar
  const navCta = document.querySelector('.nav-cta');
  if (navCta) {
    navCta.addEventListener('click', () => {
      window.ITANALYTICS.trackConversion('nav-cta-click');
    });
  }

  // Hero CTAs
  const heroButtons = document.querySelectorAll('.hero-buttons a');
  heroButtons.forEach((btn) => {
    const text = btn.textContent.trim().toLowerCase();

    btn.addEventListener('click', () => {
      if (text.includes('contanos')) {
        window.ITANALYTICS.trackConversion('hero-cta-contacto');
      } else if (text.includes('proceso') || text.includes('trabajamos')) {
        window.ITANALYTICS.trackConversion('hero-cta-proceso');
      } else {
        window.ITANALYTICS.trackEvent('cta', 'cta_click', btn.textContent.trim());
      }
    });
  });

  // CTA sección problemas
  const problemCta = Array.from(document.querySelectorAll('a, button')).find((el) =>
    el.textContent.trim().toLowerCase().includes('quiero una solución a medida') ||
    el.textContent.trim().toLowerCase().includes('quiero una solucion a medida')
  );

  if (problemCta) {
    problemCta.addEventListener('click', () => {
      window.ITANALYTICS.trackConversion('problem-cta-click');
    });
  }

  // Botón WhatsApp flotante
  const whatsappBtn = document.querySelector('.wa-float');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      window.ITANALYTICS.trackConversion('whatsapp-float-click');
    });
  }

  // Formulario de contacto
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      window.ITANALYTICS.trackConversion('form-submit');
    });
  }

  // Clicks en portfolio
  const portfolioLinks = document.querySelectorAll('#portfolio a');
  portfolioLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const card = link.closest('.portfolio-card');
      const titleEl = card ? card.querySelector('.portfolio-title') : null;
      const projectName = titleEl ? titleEl.textContent.trim() : link.textContent.trim();

      if (projectName.toLowerCase().includes('con magui')) {
        window.ITANALYTICS.trackConversion('portfolio-disney-click');
      } else {
        window.ITANALYTICS.trackEvent('portfolio', 'portfolio_click', projectName);
      }
    });
  });

  // Clicks en enlaces externos
  const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="mailto:"], a[href^="tel:"]');
  externalLinks.forEach((link) => {
    link.addEventListener('click', () => {
      window.ITANALYTICS.trackEvent('outbound', 'click', link.href);
    });
  });
});