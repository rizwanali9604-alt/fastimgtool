/**
 * First-party cookie / ads choice banner.
 * Enable Google's certified CMP as well: AdSense → Privacy & messaging.
 */
(function () {
  'use strict';
  if (typeof window.gtag !== 'function') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }

  var KEY = 'ft_consent';
  var choice = null;
  try {
    choice = localStorage.getItem(KEY);
  } catch (e) {}

  function apply(granted) {
    var state = granted ? 'granted' : 'denied';
    window.gtag('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state
    });
    try {
      localStorage.setItem(KEY, granted ? 'granted' : 'denied');
    } catch (e) {}
  }

  function hide(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  if (choice === 'granted' || choice === 'denied') return;

  var bar = document.createElement('div');
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Cookie and advertising choices');
  bar.style.cssText =
    'position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#0b1225;color:#e6edf7;border-top:1px solid #1e293b;padding:16px 20px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;font:14px/1.5 system-ui,sans-serif;box-shadow:0 -8px 24px rgba(0,0,0,.35);';
  bar.innerHTML =
    '<p style="margin:0;max-width:720px;color:#a0b3d9;">We use cookies for analytics and, if you allow it, Google ads. Images you edit stay in your browser. See <a href="/privacy.html" style="color:#4da3ff;">Privacy</a>.</p>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
    '<button type="button" id="ftConsentReject" style="background:#1e293b;color:#e6edf7;border:1px solid #334155;border-radius:8px;padding:8px 14px;cursor:pointer;font-weight:600;">Reject ads cookies</button>' +
    '<button type="button" id="ftConsentAccept" style="background:#4da3ff;color:#050b18;border:none;border-radius:8px;padding:8px 14px;cursor:pointer;font-weight:600;">Accept</button>' +
    '</div>';
  document.body.appendChild(bar);
  document.getElementById('ftConsentAccept').addEventListener('click', function () {
    apply(true);
    hide(bar);
  });
  document.getElementById('ftConsentReject').addEventListener('click', function () {
    apply(false);
    hide(bar);
  });
})();
