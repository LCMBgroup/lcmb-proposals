// Installation scheduling & battery rebate notice (Luke, 19 Nov 2026).
// Shown on solar & battery quotes until the end of 30 January 2027 (Brisbane time), then hides itself.
(function () {
  var END = Date.UTC(2027, 0, 30, 14, 0, 0); // 31 Jan 2027 00:00 in Brisbane (UTC+10)
  if (Date.now() >= END) return;
  function add() {
    if (document.getElementById("rebateNotice")) return;
    var host = document.querySelector("#accept .wrap");
    if (!host) return;
    var css = document.createElement("style");
    css.textContent =
      "#rebateNotice{background:#EEF5FD;border:1px solid #CFE0F5;border-left:4px solid #1B3664;border-radius:14px;padding:16px 18px;margin:0 0 22px;text-align:left}" +
      "#rebateNotice b.t{display:block;color:#1B3664;font:700 16px Montserrat,Inter,sans-serif;margin:0 0 8px}" +
      "#rebateNotice p{margin:0 0 8px;font-size:14px;line-height:1.55;color:#33363b}" +
      "#rebateNotice p:last-child{margin:0}";
    document.head.appendChild(css);
    var box = document.createElement("div");
    box.id = "rebateNotice";
    box.innerHTML =
      '<b class="t">Installation Scheduling &amp; Battery Rebate</b>' +
      "<p>We are currently working to complete installations before the government battery rebate reduces on 1 January 2027.</p>" +
      "<p>Please be aware that weather delays or other circumstances outside our control may affect installation dates. If your installation is delayed into January, your proposal will need to be re-quoted to reflect the reduced rebate.</p>" +
      "<p>Saturday installations may also be available if you prefer an earlier installation date. These attract an additional charge to cover staff overtime.</p>";
    host.insertBefore(box, host.firstChild);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
})();
