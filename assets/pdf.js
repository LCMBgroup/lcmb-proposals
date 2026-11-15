// "Download quote (PDF)": opens the browser's print / Save as PDF with every section expanded.
window.lcmbPDF = function () {
  var opened = [];
  document.querySelectorAll('details:not([open])').forEach(function (d) {
    if (!d.classList.contains('fdisc')) { d.open = true; opened.push(d); }
  });
  var fin = document.querySelector('details.fdisc'); var finWas = fin && fin.open; if (fin) fin.open = true;
  document.querySelectorAll('.rv').forEach(function (e) { e.classList.add('in'); });
  var t = document.title;
  document.title = t.replace(/^LCMB Group – Battery proposal for /, 'LCMB Group quote – ');
  setTimeout(function () {
    window.print();
    setTimeout(function () {
      document.title = t;
      opened.forEach(function (d) { d.open = false; });
      if (fin) fin.open = finWas;
    }, 500);
  }, 150);
  return false;
};
