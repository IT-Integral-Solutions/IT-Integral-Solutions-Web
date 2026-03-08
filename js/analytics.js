// ——— GOOGLE ANALYTICS 4 PLACEHOLDER ———
// Replace UA-XXXXX with real ID when ready
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
// gtag('js', new Date());
// gtag('config', 'G-XXXXXXXXXX');

// ——— CUSTOM PAGE TRACKING ———
window.ITANALYTICS = {
  pageViews: {},
  sectionViews: {},
  conversions: [],
  trackPageView: function (page) {
    this.pageViews[page] = (this.pageViews[page] || 0) + 1;
    console.log('[Analytics] Page view:', page);
  },
  trackSection: function (section) {
    this.sectionViews[section] = (this.sectionViews[section] || 0) + 1;
    console.log('[Analytics] Section viewed:', section);
  },
  trackConversion: function (event) {
    this.conversions.push({ event, time: new Date().toISOString() });
    console.log('[Analytics] Conversion:', event);
  }
};

window.ITANALYTICS.trackPageView('home');
