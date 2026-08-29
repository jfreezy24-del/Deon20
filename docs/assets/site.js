/* Deon20 — nav behaviour. Everything below is progressive: with JS off the
   header still renders and every link still works. */
(function () {
  var toggle = document.querySelector('.navtoggle');
  var nav = document.querySelector('.mainnav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var drops = Array.prototype.slice.call(document.querySelectorAll('.dropdown'));

  drops.forEach(function (d) {
    var btn = d.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !d.classList.contains('open');
      drops.forEach(function (o) { o.classList.remove('open'); });
      d.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  document.addEventListener('click', function (e) {
    drops.forEach(function (d) {
      if (!d.contains(e.target)) {
        d.classList.remove('open');
        var b = d.querySelector('button');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    drops.forEach(function (d) {
      d.classList.remove('open');
      var b = d.querySelector('button');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
    if (nav) nav.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  });
})();
