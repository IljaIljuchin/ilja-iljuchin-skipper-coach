// Footer: show the current copyright year and the page's last update
// in the visitor's own time zone. The <time datetime> value is stamped
// by .githooks/pre-commit whenever a page is committed.
(function () {
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
