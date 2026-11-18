// "Book my free site inspection" button under the price card, taking the customer to the booking step.
(function () {
  function add() {
    if (document.getElementById("bookCta")) return;
    var price = document.getElementById("oPrice");
    var left = price && price.closest(".left");
    var card = left && left.parentElement;
    if (!card || !document.getElementById("accept")) return;
    var w = document.createElement("div");
    w.id = "bookCta";
    w.style.cssText = "margin:16px 0 0;text-align:center";
    w.innerHTML = '<a class="btn" href="#accept" style="display:inline-flex;justify-content:center;width:100%;max-width:420px;padding:15px">Book my free site inspection</a>' +
      '<div style="margin-top:8px;font-size:13px;color:#5a5a5c">Pick a time that suits you. It\'s free, takes about an hour, and confirms your final price.</div>';
    w.querySelector("a").onclick = function (e) {
      e.preventDefault();
      var go = document.getElementById("go");
      (go || document.getElementById("accept")).scrollIntoView({ behavior: "smooth", block: "center" });
    };
    card.parentNode.insertBefore(w, card.nextSibling);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
})();
