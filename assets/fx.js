// Gentle scroll-in animations for proposal pages.
(function(){
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els = document.querySelectorAll('.card, .gallery figure, .band .wrap > *, section h2, .nosub');
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold: .12, rootMargin: '0px 0px -40px 0px'});
  els.forEach(function(el, i){
    if (el.closest('.lift') || el.closest('header')) return; // keep the top of the page instant
    var r = el.getBoundingClientRect();
    if (r.top < innerHeight) return; // already on screen
    el.classList.add('rv');
    var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.transitionDelay = Math.min(sib, 4) * 70 + 'ms';
    io.observe(el);
  });
})();
