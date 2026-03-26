(function () {
  'use strict';

  var filters   = document.querySelectorAll('.gallery-filter');
  var cards     = document.querySelectorAll('.gallery-card');
  var evSection = document.getElementById('gallery-ev-section');

  if (!filters.length) return;

  /* ── Stagger entrance via IntersectionObserver ── */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var card  = entry.target;
      var delay = parseInt(card.dataset.enterDelay || 0, 10);
      setTimeout(function () { card.classList.add('g-in'); }, delay);
      io.unobserve(card);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(function (card, i) {
    card.dataset.enterDelay = Math.min(i, 9) * 55;
    io.observe(card);
  });

  /* ── Filter helpers ── */
  var FADE_MS = 260;

  function showCard(card) {
    card.classList.remove('g-hidden', 'g-out');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { card.classList.add('g-in'); });
    });
  }

  function hideCard(card) {
    card.classList.remove('g-in');
    card.classList.add('g-out');
    setTimeout(function () {
      if (card.classList.contains('g-out')) {
        card.classList.add('g-hidden');
        card.classList.remove('g-out');
      }
    }, FADE_MS);
  }

  var currentFilter = 'all';

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;

      cards.forEach(function (card) {
        var matches = currentFilter === 'all' || card.dataset.category === currentFilter;
        if (matches) showCard(card); else hideCard(card);
      });

      if (evSection) {
        evSection.style.display = (currentFilter === 'all' || currentFilter === 'ev') ? '' : 'none';
      }
    });
  });

  /* ── Lightbox ── */
  var lb      = document.getElementById('gallery-lightbox');
  var lbImg   = document.getElementById('lb-img');
  var lbTitle = document.getElementById('lb-title');
  var lbCat   = document.getElementById('lb-cat');
  var lbClose = document.getElementById('lb-close');
  var lbPrev  = document.getElementById('lb-prev');
  var lbNext  = document.getElementById('lb-next');

  if (!lb) return;

  var lbIndex = 0;

  function visibleCards() {
    return Array.from(cards).filter(function (c) {
      return !c.classList.contains('g-hidden') && !c.classList.contains('g-out');
    });
  }

  function openLightbox(idx) {
    var visible = visibleCards();
    if (!visible.length) return;
    lbIndex = ((idx % visible.length) + visible.length) % visible.length;
    var card  = visible[lbIndex];
    var img   = card.querySelector('.gallery-card-img img');
    var title = card.querySelector('.gallery-card-title');
    var cat   = card.querySelector('.gallery-card-cat');
    lbImg.src           = img   ? img.src   : '';
    lbImg.alt           = img   ? img.alt   : '';
    lbTitle.textContent = title ? title.textContent : '';
    lbCat.textContent   = cat   ? cat.textContent   : '';
    lb.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
    lbPrev.style.display = visible.length > 1 ? '' : 'none';
    lbNext.style.display = visible.length > 1 ? '' : 'none';
  }

  function closeLightbox() {
    lb.classList.remove('lb-open');
    document.body.style.overflow = '';
    setTimeout(function () { lbImg.src = ''; }, 300);
  }

  function navLightbox(dir) { openLightbox(lbIndex + dir); }

  cards.forEach(function (card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function () {
      var visible = visibleCards();
      var idx = visible.indexOf(card);
      openLightbox(idx >= 0 ? idx : 0);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  function () { navLightbox(-1); });
  lbNext.addEventListener('click',  function () { navLightbox(1); });

  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('lb-open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });
}());
