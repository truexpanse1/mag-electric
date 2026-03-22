(function () {
  'use strict';

  var filters  = document.querySelectorAll('.gallery-filter');
  var cards    = document.querySelectorAll('.gallery-card');
  var evSection = document.getElementById('gallery-ev-section');

  if (!filters.length) return;

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active pill
      filters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.dataset.filter;

      // Show / hide cards
      cards.forEach(function (card) {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });

      // Show / hide Tesla EV featured section
      if (evSection) {
        evSection.style.display = (filter === 'all' || filter === 'ev') ? '' : 'none';
      }
    });
  });
}());
