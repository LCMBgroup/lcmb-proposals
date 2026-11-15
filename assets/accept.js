// Sends a proposal acceptance straight to LCMB Group, then lets the customer book their site inspection.
window.LCMB_ACCEPT_URL = "https://script.google.com/macros/s/AKfycby0JLYqj82QpHe-z7-h8yMLbWJR7oJ0ZpK-uTDF4CLPhah4VB5OeO2anco882LTL4sR/exec";
window.lcmbSendAccept = async function (p) {
  if (/__ACCEPT_URL__/.test(window.LCMB_ACCEPT_URL)) return false; // not switched on yet: use the email button
  const em = document.getElementById("em");
  if (em && em.value && !p.email) p.email = em.value;
  for (let i = 0; i < 2; i++) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 20000);
    try {
      const r = await fetch(window.LCMB_ACCEPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(p),
        signal: ctl.signal
      });
      const j = await r.json();
      clearTimeout(t);
      if (j && j.ok) { setTimeout(() => window.lcmbGoBook(), 900); return true; }
    } catch (e) { clearTimeout(t); }
  }
  return false;
};

// ---------- Site inspection booking ----------
(function () {
  const css = `
  .insp{max-width:560px;margin:0 auto 20px;text-align:left}
  .insp .ld{display:flex;align-items:center;gap:10px;justify-content:center;color:#5A5A5C;font-size:15px;padding:14px}
  .insp .sp{width:18px;height:18px;border:3px solid #d6dcea;border-top-color:#1B3664;border-radius:50%;animation:ispin .8s linear infinite}
  @keyframes ispin{to{transform:rotate(360deg)}}
  .insp .day{font-weight:700;color:#1B3664;font-size:14px;margin:14px 0 8px}
  .insp .times{display:flex;flex-wrap:wrap;gap:8px}
  .insp .tb{border:1.5px solid #c9d2e3;background:#fff;border-radius:999px;padding:9px 14px;font:inherit;font-size:14.5px;cursor:pointer;color:#1f1f1f}
  .insp .tb.on{background:#1B3664;border-color:#1B3664;color:#fff}
  .insp .go{display:block;width:100%;margin-top:18px}
  .insp .go[disabled]{opacity:.45;cursor:default}
  .insp .ok{background:#eaf7f1;border:1.5px solid #9fd9bf;border-radius:14px;padding:16px 18px;text-align:center;font-size:15.5px}
  .insp .more{font-size:13.5px;color:#5A5A5C;margin-top:12px;text-align:center}`;
  function el(tag, attrs, html) { const e = document.createElement(tag); Object.assign(e, attrs || {}); if (html != null) e.innerHTML = html; return e; }
  function phoneLine() { return 'Prefer to arrange it by phone? Call Luke on <a href="tel:0483927024">0483 927 024</a>.'; }

  window.lcmbInspection = async function (p, host, lead) {
    if (document.getElementById("insp")) return;
    document.head.appendChild(el("style", {}, css));
    const box = el("div", { id: "insp", className: "insp" }, '<div class="ld"><span class="sp"></span>Finding Luke\'s free windows…</div>');
    host.appendChild(box);
    const fail = msg => { box.innerHTML = '<div class="ok">' + msg + '</div>'; };
    let j;
    try {
      const u = window.LCMB_ACCEPT_URL + "?type=slots&page=" + encodeURIComponent(p.page) + "&addr=" + encodeURIComponent(p.address || "");
      j = await fetch(u).then(r => r.json());
    } catch (e) { j = null; }
    if (j && j.booked) { if (lead) lead.textContent = "You're all set."; return fail("Your site inspection is booked for <b>" + j.booked + "</b>.<br>" + phoneLine()); }
    if (!j || !j.ok || !j.slots || !j.slots.length) {
      if (lead) lead.textContent = "Luke has your acceptance.";
      return fail("He'll be in touch shortly to book your site inspection.<br>" + phoneLine());
    }
    box.innerHTML = "";
    let pick = null;
    const go = el("button", { className: "btn go", disabled: true }, "Pick a window above");
    const days = {};
    j.slots.forEach(s => { (days[s.day] = days[s.day] || []).push(s); });
    Object.keys(days).forEach(d => {
      box.appendChild(el("div", { className: "day" }, d));
      const row = el("div", { className: "times" });
      days[d].forEach(s => {
        const b = el("button", { className: "tb", type: "button" }, s.time);
        b.onclick = () => { box.querySelectorAll(".tb.on").forEach(x => x.classList.remove("on")); b.classList.add("on"); pick = s;
          go.disabled = false; go.textContent = "Book " + s.day + ", " + s.time; };
        row.appendChild(b);
      });
      box.appendChild(row);
    });
    box.appendChild(go);
    box.appendChild(el("p", { className: "more" }, "None of these suit? Call Luke on <a href=\"tel:0483927024\">0483 927 024</a>."));
    go.onclick = async () => {
      if (!pick) return;
      go.disabled = true; go.textContent = "Booking…";
      let r = null;
      try {
        r = await fetch(window.LCMB_ACCEPT_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ type: "book", page: p.page, name: p.name, address: p.address, email: p.email || "", phone: p.phone || "", t: pick.t }) }).then(x => x.json());
      } catch (e) { r = null; }
      if (r && r.ok) {
        if (lead) lead.textContent = "You're all set.";
        fail("Your site inspection is booked for <b>" + r.label + "</b>." + (p.email ? "<br>We've emailed you a confirmation." : "") + "<br>" + phoneLine());
        try { window.lcmbTrack && window.lcmbTrack("inspection booked"); } catch (e) {}
      } else if (r && r.error === "taken") {
        go.textContent = "That time was just taken. Please pick another";
        const sel = box.querySelector(".tb.on"); if (sel) { sel.remove(); } pick = null;
      } else {
        go.disabled = false; go.textContent = "Couldn't book that. Tap to try again";
      }
    };
  };

  window.lcmbGoBook = function () {
    const q = new URLSearchParams(location.search); q.set("book", "1");
    location.href = location.pathname + "?" + q.toString();
  };

  // The booking screen: shown after accepting, or from a …/?book=1 link.
  const scss = `
  html.bk,html.bk body{background:#F4F8FD}
  html.bk body>*:not(#bookScreen){display:none !important}
  #bookScreen{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:0 0 50px;font-family:Inter,system-ui,sans-serif;color:#1f1f1f}
  #bookScreen .bs-top{position:relative;width:100%;background:#fff;padding:20px 18px 74px;display:flex;justify-content:center;overflow:hidden;box-shadow:0 2px 14px rgba(20,40,77,.08)}
  #bookScreen .bs-top img{height:54px;width:auto;position:relative;z-index:1}
  #bookScreen .bs-stripes{position:absolute;left:0;right:0;bottom:0;height:58px;background:linear-gradient(115deg,#1E3A6E 0 46%,#3FA9F5 46% 56%,#1E3A6E 56% 100%)}
  #bookScreen .bs-card{margin:-40px auto 0;width:calc(100% - 36px) !important;position:relative;z-index:2}
  #bookScreen .bs-tick{background:#3FA9F5 !important}
  #bookScreen h1,#bookScreen h2{color:#1E3A6E}
  #bookScreen .insp .tb.on{background:#1E3A6E;border-color:#1E3A6E}
  #bookScreen .insp .day{color:#1E3A6E}
  #bookScreen .btn.go{background:#1E3A6E}
  #bookScreen .bs-card{background:#fff;border-radius:22px;box-shadow:0 18px 44px rgba(15,35,71,.10);max-width:620px;width:100%;padding:34px 26px 28px;text-align:center}
  #bookScreen .bs-tick{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#2FD69B,#12A473);display:grid;place-items:center;margin:0 auto 14px}
  #bookScreen h1{font-size:25px;margin:0 0 6px;color:#0F2347}
  #bookScreen .bs-sub{color:#5A5A5C;margin:0 0 6px;font-size:15px}
  #bookScreen h2{font-size:19px;margin:26px 0 4px;color:#1B3664;text-align:center}
  #bookScreen h2::after,#bookScreen h1::after{display:none}
  #bookScreen .bs-lead{color:#5A5A5C;margin:0 0 6px;font-size:14.5px}
  #bookScreen .bs-back{margin-top:22px;font-size:14px;color:#1B3664}`;
  document.addEventListener("DOMContentLoaded", () => {
    if (!/[?&]book=1/.test(location.search)) return;
    const nm = (document.getElementById("nm") || {}).value || "";
    const em = (document.getElementById("em") || {}).value || "";
    const meta = ((document.querySelector(".hmeta") || {}).textContent || "").split(" · ");
    document.head.appendChild(el("style", {}, scss));
    document.documentElement.classList.add("bk");
    const first = nm.split(" ")[0];
    const q = new URLSearchParams(location.search); q.delete("book");
    const back = location.pathname + (q.toString() ? "?" + q.toString() : "");
    const scr = el("div", { id: "bookScreen" },
      '<div class="bs-top"><img src="../assets/brand/logo-navy.png" alt="LCMB Group"><span class="bs-stripes"></span></div>' +
      '<div class="bs-card"><div class="bs-tick"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>' +
      '<h1>Thanks' + (first ? ", " + first.replace(/</g, "") : "") + '! Your quote is accepted.</h1>' +
      '<h2>Pick a time for your site inspection</h2>' +
      '<p class="bs-lead" id="bsLead">Pick a 2-hour window. Luke will arrive within it, and the inspection takes about an hour.</p>' +
      '<div id="bsHost"></div></div>' +
      '<a class="bs-back" href="' + back + '">Back to your quote</a>');
    document.body.appendChild(scr);
    window.scrollTo(0, 0);
    window.lcmbInspection({ page: location.origin + location.pathname, name: nm, email: em, address: /\d/.test(meta[1] || "") ? meta[1] : "" },
      document.getElementById("bsHost"), document.getElementById("bsLead"));
  });
})();
