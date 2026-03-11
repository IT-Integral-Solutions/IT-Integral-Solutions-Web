/* =============================================================================
   MAIN — UI interactions + analytics event listeners
   Toda la lógica de interfaz del sitio en un lugar.
   Secciones:
     1. Custom cursor
     2. Particles hero
     3. Navbar scroll + mobile menu
     4. Reveal on scroll (IntersectionObserver)
     5. Counters animados
     6. FAQ accordion
     7. Footer year
     8. Analytics event listeners
   ============================================================================= */

(function () {
  'use strict';


  // ─── 1. CUSTOM CURSOR ────────────────────────────────────────────────────────

  var cursor     = document.getElementById('cursor');
  var cursorRing = document.getElementById('cursorRing');

  if (cursor && cursorRing) {
    var cx = 0, cy = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', function (e) {
      cx = e.clientX;
      cy = e.clientY;
      cursor.style.transform = 'translate(' + (cx - 4) + 'px, ' + (cy - 4) + 'px)';
    });

    (function animateRing() {
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      cursorRing.style.transform = 'translate(' + (rx - 16) + 'px, ' + (ry - 16) + 'px)';
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .service-card, .portfolio-card, .faq-question').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('cursor--hover');
        cursorRing.classList.add('cursor-ring--hover');
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('cursor--hover');
        cursorRing.classList.remove('cursor-ring--hover');
      });
    });
  }


  // ─── 2. PARTICLES HERO ───────────────────────────────────────────────────────

  var particlesContainer = document.getElementById('particles');

  if (particlesContainer) {
    if (!document.getElementById('particle-style')) {
      var style = document.createElement('style');
      style.id  = 'particle-style';
      style.textContent = '@keyframes particleFloat { 0% { transform: translate(0,0) scale(1); opacity:0.2; } 100% { transform: translate(0,-20px) scale(1.4); opacity:0.7; } }';
      document.head.appendChild(style);
    }

    for (var i = 0; i < 55; i++) {
      (function () {
        var p        = document.createElement('div');
        var size     = Math.random() * 3 + 1;
        var duration = Math.random() * 15 + 8;
        var delay    = Math.random() * 8;
        var opacity  = Math.random() * 0.5 + 0.1;
        p.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;'
          + 'left:' + (Math.random()*100) + '%;top:' + (Math.random()*100) + '%;'
          + 'background:rgba(0,212,255,' + opacity + ');border-radius:50%;pointer-events:none;'
          + 'animation:particleFloat ' + duration + 's ' + delay + 's infinite ease-in-out alternate;';
        particlesContainer.appendChild(p);
      })();
    }
  }


  // ─── 3. NAVBAR ───────────────────────────────────────────────────────────────

  var navbar     = document.getElementById('navbar');
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var menuClose  = document.getElementById('menuClose');

  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  window.closeMobile = function () {
    if (mobileMenu) mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (menuClose) menuClose.addEventListener('click', window.closeMobile);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (l) {
      l.addEventListener('click', window.closeMobile);
    });
  }


  // ─── 4. REVEAL ON SCROLL ─────────────────────────────────────────────────────

  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }


  // ─── 5. COUNTERS ANIMADOS ────────────────────────────────────────────────────

  var counters = document.querySelectorAll('.stat-num[data-count]');

  if (counters.length && 'IntersectionObserver' in window) {
    var cntObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el      = entry.target;
        var target  = parseInt(el.getAttribute('data-count'), 10);
        var duration = 1800;
        var startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(ease * target);
          if (progress < 1) { requestAnimationFrame(step); }
          else { el.textContent = target; }
        }
        requestAnimationFrame(step);
        cntObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cntObs.observe(el); });
  }


  // ─── 6. FAQ ACCORDION ────────────────────────────────────────────────────────

  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item   = btn.closest('.faq-item');
      var answer = item ? item.querySelector('.faq-answer') : null;
      var isOpen = item && item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        var a = o.querySelector('.faq-answer');
        if (a) a.style.maxHeight = null;
      });

      if (!isOpen && item && answer) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });


  // ─── 7. FOOTER YEAR ──────────────────────────────────────────────────────────

  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // ─── 8. ANALYTICS EVENT LISTENERS ───────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.ITANALYTICS) return;

    document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta, .form-submit').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.ITANALYTICS.trackEvent('cta', 'cta_click', btn.textContent.trim());
      });
    });

    var waBtn = document.querySelector('.wa-float');
    if (waBtn) {
      waBtn.addEventListener('click', function () {
        window.ITANALYTICS.trackConversion('whatsapp-float-click');
      });
    }

    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function () {
        window.ITANALYTICS.trackConversion('form-submit');
      });
    }

    document.querySelectorAll('.portfolio-link').forEach(function (link) {
      link.addEventListener('click', function () {
        var card  = link.closest('.portfolio-card');
        var title = card ? card.querySelector('.portfolio-title') : null;
        window.ITANALYTICS.trackEvent('portfolio', 'portfolio_click', title ? title.textContent.trim() : link.href);
      });
    });
  });

})();
