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
      if (j && j.ok) { setTimeout(() => window.lcmbInspection(p), 0); return true; }
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

  window.lcmbInspection = async function (p) {
    if (document.getElementById("insp")) return;
    const done = document.getElementById("done");
    if (!done) return;
    document.head.appendChild(el("style", {}, css));
    const lead = document.getElementById("doneLead");
    if (lead) lead.textContent = "Last step: pick a time for Luke to come out for the site inspection. It takes about an hour.";
    const box = el("div", { id: "insp", className: "insp" }, '<div class="ld"><span class="sp"></span>Finding Luke\'s free times…</div>');
    (lead || done.firstChild).insertAdjacentElement("afterend", box);
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
    const go = el("button", { className: "btn go", disabled: true }, "Pick a time above");
    const days = {};
    j.slots.forEach(s => { (days[s.day] = days[s.day] || []).push(s); });
    Object.keys(days).forEach(d => {
      box.appendChild(el("div", { className: "day" }, d));
      const row = el("div", { className: "times" });
      days[d].forEach(s => {
        const b = el("button", { className: "tb", type: "button" }, s.time);
        b.onclick = () => { box.querySelectorAll(".tb.on").forEach(x => x.classList.remove("on")); b.classList.add("on"); pick = s;
          go.disabled = false; go.textContent = "Book " + s.day + " at " + s.time; };
        row.appendChild(b);
      });
      box.appendChild(row);
    });
    box.appendChild(go);
    box.appendChild(el("p", { className: "more" }, "None of these suit? " + phoneLine()));
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

  // Link for customers who have already accepted: …/?book=1 goes straight to the time picker.
  document.addEventListener("DOMContentLoaded", () => {
    if (!/[?&]book=1/.test(location.search)) return;
    const form = document.getElementById("acceptForm"), done = document.getElementById("done");
    if (!form || !done) return;
    const nm = (document.getElementById("nm") || {}).value || "";
    const em = (document.getElementById("em") || {}).value || "";
    const meta = ((document.querySelector(".hmeta") || {}).textContent || "").split(" · ");
    form.style.display = "none"; done.style.display = "block";
    const dn = document.getElementById("dName"); if (dn) dn.textContent = nm.split(" ")[0];
    const conf = document.getElementById("conf"); if (conf) conf.style.display = "none";
    window.lcmbInspection({ page: location.origin + location.pathname, name: nm, email: em, address: /\d/.test(meta[1] || "") ? meta[1] : "" });
    setTimeout(() => document.getElementById("accept").scrollIntoView({ behavior: "smooth" }), 300);
  });
})();
