// Small site helpers, loaded on every page.
(function () {
  // Pages still in progress (marked data-preview-only, e.g. Runs) are shown
  // on dev and preview hosts only, never on the production domain.
  var host = location.hostname;
  if (host !== 'www.iljuchin.com' && host !== 'iljuchin.com') {
    document.documentElement.classList.add('is-preview');
  }

  // Footer: current copyright year and the page's last update date.
  // The <time datetime> value is stamped by .githooks/pre-commit.
  // Date format follows the page language (<html lang="cs"> on Czech pages).
  var locale = document.documentElement.lang === 'cs' ? 'cs-CZ' : 'en-GB';
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
  document.querySelectorAll('time.last-updated').forEach(function (el) {
    var updated = new Date(el.getAttribute('datetime'));
    if (isNaN(updated)) return;
    el.textContent = updated.toLocaleDateString(locale, {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  });
})();
