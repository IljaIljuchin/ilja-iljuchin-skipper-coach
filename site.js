// Footer: show the current copyright year and the page's last update
// in the visitor's own time zone. The <time datetime> value is stamped
// by .githooks/pre-commit whenever a page is committed.
(function () {
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
  document.querySelectorAll('time.last-updated').forEach(function (el) {
    var updated = new Date(el.getAttribute('datetime'));
    if (isNaN(updated)) return;
    el.textContent = updated.toLocaleString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  });
})();
