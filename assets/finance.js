// Brighte finance estimator for LCMB Group quotes.
// Rates/fees from Brighte's published pages, current as at 1 Oct 2026. Update here if Brighte changes them.
(function(){
  var PRODUCTS = {
    green: { name: "Brighte Green Loan (discounted battery rate)", rate: 0.0849, estFee: 199, estAdded: true, weeklyFee: 2.99,
             terms: [2,3,5,7,10],
             note: "8.49% p.a. fixed (comparison rate 10.21% p.a.^). Establishment fee from $199 added to the loan. $2.99/week account fee included." },
    solar: { name: "Brighte Green Loan", rate: 0.0999, estFee: 199, estAdded: true, weeklyFee: 2.99,
             terms: [2,3,5,7,10],
             note: "From 9.99% p.a. fixed (comparison rate 11.70% p.a.^). Establishment fee from $199 added to the loan. $2.99/week account fee included. Your rate depends on Brighte's credit assessment." },
    zero:  { name: "Brighte 0% Interest Payment Plan", rate: 0, estFee: 75, estAdded: false, weeklyFee: 2.30,
             terms: [1,2,3,5,7,10],
             note: "0% interest. $75 establishment fee payable on your first repayment. $2.30/week account fee included." }
  };
  var root = document.getElementById('finance'); if (!root) return;
  var state = { p: (root.dataset.product && PRODUCTS[root.dataset.product]) ? root.dataset.product : 'green', t: 5 };
  var $ = function(s){ return root.querySelector(s); };
  var money = function(n, dp){ return '$' + n.toLocaleString('en-AU', {minimumFractionDigits: dp||0, maximumFractionDigits: dp||0}); };

  function amount(){
    var el = document.getElementById('sTot');
    var v = el ? parseFloat(el.textContent.replace(/[^0-9.]/g,'')) : 0;
    return isFinite(v) ? v : 0;
  }
  function fortnightly(prod, amt, years){
    var n = years * 26, P = amt + (prod.estAdded ? prod.estFee : 0), base;
    if (prod.rate === 0) base = P / n;
    else { var r = prod.rate / 26; base = P * r / (1 - Math.pow(1 + r, -n)); }
    return base + prod.weeklyFee * 2;
  }
  function renderTerms(){
    var prod = PRODUCTS[state.p];
    if (prod.terms.indexOf(state.t) < 0) state.t = 5;
    $('.fterms').innerHTML = prod.terms.map(function(y){
      return '<button type="button" data-t="'+y+'" class="'+(y===state.t?'on':'')+'">'+y+' yr'+(y>1?'s':'')+'</button>';
    }).join('');
    root.querySelectorAll('.fterms button').forEach(function(b){ b.onclick = function(){ state.t = +b.dataset.t; update(); }; });
  }
  function update(){
    var prod = PRODUCTS[state.p], amt = amount();
    root.querySelectorAll('.fprod button').forEach(function(b){ b.classList.toggle('on', b.dataset.p === state.p); });
    renderTerms();
    var f = fortnightly(prod, amt, state.t);
    $('#fWeek').innerHTML = money(f/2) + '<small> /week</small>';
    $('#fFort').textContent = 'About ' + money(f, 2) + ' per fortnight over ' + state.t + ' year' + (state.t>1?'s':'') + ', on ' + money(amt) + (prod.estAdded ? ' plus the $199 establishment fee' : '') + '.';
    $('#fNote').textContent = prod.note;
    // headline: lowest weekly across both products at 10 years
    var low = fortnightly(PRODUCTS[state.p], amt, 10) / 2;
    $('#fFrom').textContent = 'from about ' + money(low) + '/week';
  }
  root.querySelectorAll('.fprod button').forEach(function(b){ b.onclick = function(){ state.p = b.dataset.p; update(); }; });
  var tot = document.getElementById('sTot');
  if (tot && 'MutationObserver' in window) new MutationObserver(update).observe(tot, {childList:true, characterData:true, subtree:true});
  update();

  // One tap: "I'd like to finance with Brighte" -> Luke is notified straight away.
  var key = 'lcmb_fin_' + location.pathname;
  var out = $('.fout');
  if (out && !document.getElementById('finGo')) {
    var box = document.createElement('div');
    box.className = 'fin-cta';
    box.innerHTML = '<button type="button" class="btn" id="finGo">Yes, I\'d like to use Brighte finance</button>' +
      '<p class="fin-sub">No forms here. Luke will be in touch to set up your Brighte application.</p>';
    out.appendChild(box);
    var go = document.getElementById('finGo');
    var done = function () {
      box.innerHTML = '<div class="fin-ok"><b>Thanks, we\'ve let Luke know you\'d like to use Brighte finance.</b><br>He\'ll be in touch to set up your application. You can still accept your quote below.</div>';
    };
    var seen = false; try { seen = !!localStorage.getItem(key); } catch (e) {}
    if (seen) done();
    go && (go.onclick = async function () {
      go.disabled = true; go.textContent = 'Sending…';
      var meta = ((document.querySelector('.hmeta') || {}).textContent || '').split(' · ');
      var on = document.querySelector('#seg2 button.on, .seg button.on');
      var p = { type: 'finance', page: location.origin + location.pathname,
        name: (document.getElementById('nm') || {}).value || '', email: (document.getElementById('em') || {}).value || '',
        address: meta[1] || '', option: on ? on.textContent.trim() : '', price: money(amount()),
        term: state.t + ' years', weekly: ($('#fWeek') || {}).textContent || '' };
      var ok = false;
      try {
        var r = await fetch(window.LCMB_ACCEPT_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(p) });
        var j = await r.json(); ok = !!(j && j.ok);
      } catch (e) {}
      if (ok) { try { localStorage.setItem(key, '1'); } catch (e) {} try { window.lcmbTrack && window.lcmbTrack('finance request'); } catch (e) {} done(); }
      else { go.disabled = false; go.textContent = 'Couldn\'t send. Tap to try again, or call Luke on 0483 927 024'; }
    });
  }
})();
