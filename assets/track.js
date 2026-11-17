// Proposal view tracking for LCMB Group proposal pages.
// Sends visits, time on page, scroll depth, section time and clicks to LCMB's Google Sheet.
(function () {
  try {
    var qs = new URLSearchParams(location.search);
    if (qs.get("me") === "1") localStorage.setItem("lcmb_owner", "1");
    if (qs.get("me") === "0") localStorage.removeItem("lcmb_owner");
    if (localStorage.getItem("lcmb_owner") === "1") return; // Luke's own devices are not tracked
  } catch (e) {}
  if (!window.LCMB_ACCEPT_URL || /__ACCEPT_URL__/.test(window.LCMB_ACCEPT_URL)) return;

  var page = location.href.split("#")[0].split("?")[0];
  var customer = document.title.replace(/^.*proposal for /i, "");
  var vid = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  var visitNo = 1;
  try {
    var k = "lcmb_visits_" + location.pathname;
    visitNo = (parseInt(localStorage.getItem(k) || "0", 10) || 0) + 1;
    localStorage.setItem(k, String(visitNo));
  } catch (e) {}

  var ua = navigator.userAgent;
  var device = /iPhone/.test(ua) ? "iPhone" : /iPad/.test(ua) ? "iPad" : /Android/.test(ua) ? (/Mobile/.test(ua) ? "Android phone" : "Android tablet") :
    /Macintosh/.test(ua) ? (navigator.maxTouchPoints > 1 ? "iPad" : "Mac") : /Windows/.test(ua) ? "Windows PC" : "Other";

  var seconds = 0, maxScroll = 0, opened = false, sent = 0;
  var secTime = {}, clicks = [], current = null, order = [];

  // Name each section by its id or heading
  var sections = Array.prototype.slice.call(document.querySelectorAll("section"));
  function secName(s) {
    var h = s.querySelector("h2");
    var label = h ? h.textContent.trim().replace(/\s+/g, " ") : (s.id || "");
    if (!label && s.classList.contains("lift")) label = "Top of page";
    return label.slice(0, 50) || "Section";
  }
  var names = sections.map(secName);

  function inView() {
    var mid = window.innerHeight / 2, best = null;
    for (var i = 0; i < sections.length; i++) {
      var r = sections[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) { best = names[i]; break; }
    }
    return best;
  }
  function scrollPct() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    return h > 0 ? Math.min(100, Math.round((window.scrollY / h) * 100)) : 100;
  }

  function send(type) {
    var body = JSON.stringify({
      type: "track", event: type, vid: vid, customer: customer, page: page, device: device,
      visitNo: visitNo, seconds: seconds, maxScroll: maxScroll,
      sections: order.map(function (n) { return n + " " + secTime[n] + "s"; }).join(", "),
      furthest: order.length ? order[order.length - 1] : "",
      clicks: clicks.join("; ").slice(0, 1500)
    });
    try {
      if (navigator.sendBeacon) { navigator.sendBeacon(window.LCMB_ACCEPT_URL, new Blob([body], { type: "text/plain" })); return; }
    } catch (e) {}
    try { fetch(window.LCMB_ACCEPT_URL, { method: "POST", body: body, keepalive: true, headers: { "Content-Type": "text/plain" } }); } catch (e) {}
  }

  // Tick once a second while the page is actually visible
  setInterval(function () {
    if (document.visibilityState !== "visible") return;
    seconds++;
    maxScroll = Math.max(maxScroll, scrollPct());
    var s = inView();
    if (s) {
      if (!(s in secTime)) { secTime[s] = 0; order.push(s); }
      secTime[s]++;
    }
    if (!opened && seconds >= 3) { opened = true; send("open"); sent = seconds; }
    else if (opened && seconds - sent >= 20) { send("update"); sent = seconds; }
  }, 1000);

  function flush() { if (opened) { send("update"); sent = seconds; } }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(); });
  window.addEventListener("pagehide", flush);

  function log(t) {
    var stamp = Math.floor(seconds / 60) + ":" + ("0" + (seconds % 60)).slice(-2);
    clicks.push(stamp + " " + t);
    if (opened) { send("update"); sent = seconds; }
  }
  // Lets other scripts log events (finance request, inspection booked, video plays).
  window.lcmbTrack = function (t) { try { if (/^video /.test(t)) t = "Played " + t.slice(6) + "'s video"; log(t.charAt(0).toUpperCase() + t.slice(1)); } catch (e) {} };

  // Testimonial videos: how long each one was watched (logged when paused or finished).
  function watched(v) { var s = 0, r = v.played; for (var i = 0; i < r.length; i++) s += r.end(i) - r.start(i); return Math.round(s); }
  function vidName(v) { var c = v.closest && v.closest("figure"); var f = c && c.querySelector("figcaption"); return f ? f.firstChild.textContent.trim() : "testimonial"; }
  function vidLog(e) {
    var v = e.target; if (!v || v.tagName !== "VIDEO") return;
    var w = watched(v), d = Math.round(v.duration || 0);
    if (w < 1 || v._lcmbLogged === w) return; v._lcmbLogged = w;
    log("Watched " + vidName(v) + "'s video " + w + "s" + (d ? " of " + d + "s" : "") + (e.type === "ended" ? " (to the end)" : ""));
  }
  document.addEventListener("pause", vidLog, true);
  document.addEventListener("ended", vidLog, true);

  // Google reviews: logged the first time the reviews are on screen, with time spent on them.
  var revTime = 0, revSeen = false, revOn = false;
  if ("IntersectionObserver" in window) {
    var revWatch = function () {
      var r = document.querySelector(".rv-mini");
      if (!r) return;
      new IntersectionObserver(function (es) {
        revOn = es[0].isIntersecting;
        if (revOn && !revSeen) { revSeen = true; log("Saw Google reviews"); }
      }, { threshold: 0.4 }).observe(r);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", revWatch); else revWatch();
    setInterval(function () { if (revOn && document.visibilityState === "visible") revTime++; }, 1000);
    var revFlush = function () { if (revTime >= 3 && revTime !== revFlush.last) { revFlush.last = revTime; clicks = clicks.filter(function (c) { return !/ Read Google reviews \d+s$/.test(c); }); log("Read Google reviews " + revTime + "s"); } };
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") revFlush(); }, true);
    window.addEventListener("pagehide", revFlush, true);
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest("button, a, label.app, .addon, summary, .seg button") : null;
    if (!el) return;
    if (el.matches(".seg button")) return log("Chose " + el.textContent.trim());
    if (el.matches("label.app")) {
      var on = !el.classList.contains("on"); // state before the page toggles it
      return log("Calculator: " + (el.querySelector(".t") || el).textContent.trim() + (on ? " on" : " off"));
    }
    if (el.matches(".addon")) return log("Extra: " + ((el.querySelector("b") || el).textContent.trim()));
    if (el.matches("summary")) {
      var d = el.parentElement;
      if (d && !d.open) log("Opened FAQ: " + el.textContent.trim().slice(0, 60));
      return;
    }
    if (el.id === "go") return log("Pressed Accept");
    if (el.id === "copy") return log("Copied confirmation");
    if (el.id === "mail") return log("Tapped Email it to Luke");
    var href = el.getAttribute && el.getAttribute("href") || "";
    if (/^tel:/.test(href)) return log("Tapped call");
    if (/^mailto:/.test(href)) return log("Tapped email");
    if (/google\.com\/local\/reviews|g\.page|maps\.app/.test(href)) return log("Opened Google reviews");
    var t = el.textContent.trim().replace(/\s+/g, " ").slice(0, 40);
    if (t) log("Clicked " + t);
  }, true);
  var started = false;
  document.addEventListener("focusin", function (e) {
    if (!started && e.target && (e.target.id === "nm" || e.target.id === "ph")) { started = true; log("Started accept form"); }
  });
})();
