// Consent-gated Google Analytics. Nothing is sent to Google until the visitor
// accepts the "analytics" category; see privacy.html.
const GA_ID = 'G-WWBMDVC8E3';

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
window.gtag = gtag;

gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
});

let gaLoaded = false;

function loadAnalytics() {
  if (gaLoaded) return;
  gaLoaded = true;
  gtag('consent', 'update', { analytics_storage: 'granted' });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-WWBMDVC8E3';
  document.head.appendChild(script);
  gtag('js', new Date());
  gtag('config', GA_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

window.CookieConsent.run({
  cookie: { expiresAfterDays: 182 },
  guiOptions: {
    consentModal: { layout: 'box inline', position: 'bottom right' },
    preferencesModal: { layout: 'box' },
  },
  categories: {
    necessary: { enabled: true, readOnly: true },
    analytics: {
      autoClear: { cookies: [{ name: /^_ga/ }] },
    },
  },
  onConsent: () => {
    if (window.CookieConsent.acceptedCategory('analytics')) loadAnalytics();
  },
  onChange: ({ changedCategories }) => {
    if (!changedCategories.includes('analytics')) return;
    if (window.CookieConsent.acceptedCategory('analytics')) {
      loadAnalytics();
    } else {
      gtag('consent', 'update', { analytics_storage: 'denied' });
      // The loaded GA tag can't be unloaded, so reload to stop it.
      window.location.reload();
    }
  },
  language: {
    default: 'en',
    translations: {
      en: {
        consentModal: {
          title: 'Cookies on Weven',
          description:
            'We would like to use Google Analytics to understand how visitors find and use this page. It only runs if you accept. Read our <a href="/privacy">privacy notice</a>.',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage preferences',
        },
        preferencesModal: {
          title: 'Cookie preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Save settings',
          closeIconLabel: 'Close',
          sections: [
            {
              title: 'Your choice',
              description:
                'Choose which cookies you allow. You can change this at any time with "Cookie settings" in the footer. More in our <a href="/privacy">privacy notice</a>.',
            },
            {
              title: 'Strictly necessary',
              description: 'Stores only your consent choice, so we can respect it.',
              linkedCategory: 'necessary',
            },
            {
              title: 'Statistics',
              description:
                'Google Analytics shows us how visitors find and use this page. Ad personalisation and Google signals are off.',
              linkedCategory: 'analytics',
            },
          ],
        },
      },
    },
  },
});
