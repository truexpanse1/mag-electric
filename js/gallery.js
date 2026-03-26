(function () {
  'use strict';

  var filters   = document.querySelectorAll('.gallery-filter');
  var groups    = document.querySelectorAll('.gallery-group');
  var evSection = document.getElementById('gallery-ev-section');

  if (!filters.length) return;

  /* -- Filter -- */
  var FADE_MS = 260;

  function showGroup(g) {
    g.classList.remove('g-hidden', 'g-out');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { g.classList.add('g-in'); });
    });
  }

  function hideGroup(g) {
    g.classList.remove('g-in');
    g.classList.add('g-out');
    setTimeout(function () {
      if (g.classList.contains('g-out')) {
        g.classList.add('g-hidden');
        g.classList.remove('g-out');
      }
    }, FADE_MS);
  }

  /* Show all groups on load */
  groups.forEach(function (g) { g.classList.add('g-in'); });

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;

      groups.forEach(function (g) {
        var match = filter === 'all' || g.dataset.group === filter;
        if (match) showGroup(g); else hideGroup(g);
      });

      if (evSection) {
        evSection.style.display = (filter === 'all' || filter === 'ev') ? '' : 'none';
      }
    });
  });

  /* -- Lightbox -- */
  var lb      = document.getElementById('gallery-lightbox');
  var lbImg   = document.getElementById('lb-img');
  var lbTitle = document.getElementById('lb-title');
  var lbCat   = document.getElementById('lb-cat');
  var lbClose = document.getElementById('lb-close');
  var lbPrev  = document.getElementById('lb-prev');
  var lbNext  = document.getElementById('lb-next');

  if (!lb) return;

  var currentImages = [];
  var lbIndex = 0;

  function parseImages(groupEl) {
    try { return JSON.parse(groupEl.dataset.images || '[]'); }
    catch (e) { return []; }
  }

  function updateNavVisibility() {
    var total = currentImages.length;
    /* Hide prev at first image, hide next at last image; hide both if only one image */
    lbPrev.style.display = (total > 1 && lbIndex > 0)            ? '' : 'none';
    lbNext.style.display = (total > 1 && lbIndex < total - 1)    ? '' : 'none';
  }

  function renderLb() {
    var img = currentImages[lbIndex];
    if (!img) return;
    lbImg.src           = img.src;
    lbImg.alt           = img.title || '';
    lbTitle.textContent = img.title || '';
    lbCat.textContent   = img.cat   || '';
    updateNavVisibility();
  }

  function openLb(groupEl, idx) {
    currentImages = parseImages(groupEl);
    if (!currentImages.length) return;
    /* Clamp idx to valid range — no wrapping */
    lbIndex = Math.max(0, Math.min(idx || 0, currentImages.length - 1));
    renderLb();
    lb.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lb.classList.remove('lb-open');
    document.body.style.overflow = '';
    setTimeout(function () { lbImg.src = ''; }, 300);
  }

  function navLb(dir) {
    var next = lbIndex + dir;
    if (next < 0 || next >= currentImages.length) return; /* already at end, do nothing */
    lbIndex = next;
    renderLb();
  }

  /* Click on hero or thumb */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-group-idx]');
    if (!trigger) return;
    var groupEl = trigger.closest('.gallery-group');
    if (!groupEl) return;
    e.preventDefault();
    openLb(groupEl, parseInt(trigger.dataset.groupIdx || 0, 10));
  });

  /* Keyboard */
  document.addEventListener('keydown', function (e) {
    if (lb.classList.contains('lb-open')) {
      if (e.key === 'Escape')     { closeLb(); return; }
      if (e.key === 'ArrowLeft')  { navLb(-1); return; }
      if (e.key === 'ArrowRight') { navLb(1);  return; }
    }
    if (e.key === 'Enter' || e.key === ' ') {
      var trigger = document.activeElement && document.activeElement.closest('[data-group-idx]');
      if (!trigger) return;
      var groupEl = trigger.closest('.gallery-group');
      if (groupEl) openLb(groupEl, parseInt(trigger.dataset.groupIdx, 10));
    }
  });

  /* EV featured section image -> single-image lightbox (no nav arrows needed) */
  if (evSection) {
    var evImgEl = evSection.querySelector('.gallery-ev-img img');
    if (evImgEl) {
      evImgEl.parentElement.style.cursor = 'pointer';
      evImgEl.parentElement.addEventListener('click', function () {
        currentImages = [{ src: evImgEl.src, title: 'Tesla Wall Connector Install', cat: 'EV & Battery' }];
        lbIndex = 0;
        renderLb();
        lb.classList.add('lb-open');
        document.body.style.overflow = 'hidden';
      });
    }
  }

  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click',  function () { navLb(-1); });
  lbNext.addEventListener('click',  function () { navLb(1);  });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
}());
