// Small site helpers, loaded on every page.
(function () {
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
  // References: one quote at a time, dots to switch, gentle autoplay.
  // Blocks stay hidden until real quotes exist; add ?references to the URL to preview them.
  var preview = /[?&]references\b/.test(location.search);
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-references]').forEach(function (box) {
    if (preview) box.hidden = false;
    var items = box.querySelectorAll('.reference');
    if (items.length < 2) return;
    var dots = document.createElement('div');
    dots.className = 'references-dots';
    var current = 0, timer = null;
    var label = locale === 'cs-CZ' ? 'Zobrazit referenci ' : 'Show reference ';
    function show(i) {
      items[current].classList.remove('is-active');
      dots.children[current].removeAttribute('aria-current');
      current = (i + items.length) % items.length;
      items[current].classList.add('is-active');
      dots.children[current].setAttribute('aria-current', 'true');
    }
    items.forEach(function (item, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', label + (i + 1));
      b.addEventListener('click', function () { show(i); });
      dots.appendChild(b);
    });
    dots.children[0].setAttribute('aria-current', 'true');
    box.querySelector('.wrap').appendChild(dots);
    function start() { if (!calm && !timer) timer = setInterval(function () { show(current + 1); }, 8000); }
    function stop() { clearInterval(timer); timer = null; }
    box.addEventListener('mouseenter', stop);
    box.addEventListener('mouseleave', start);
    box.addEventListener('focusin', stop);
    box.addEventListener('focusout', start);
    start();
  });
})();
