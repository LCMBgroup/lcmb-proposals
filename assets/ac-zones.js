// AIR CON pages only. Interactive "how your zoning works" map, phone-first.
// Draws a roof-space duct diagram from JOB.zoneMap (indoor unit -> ducts -> dampers -> outlets in
// each room) plus a zone controller underneath. Layout is illustrative, not a floor plan.
// Solar pages never load this.
window.lcmbZoneMap = function (JOB, host) {
  var Z = JOB.zoneMap;
  if (!Z || !Z.rooms || !Z.rooms.length || !host) return false;
  var R = Z.rooms, AT = Z.upgrade || null, NS = "http://www.w3.org/2000/svg";
  var css = `
  .zx{padding:0;overflow:hidden}
  .zx-head{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;padding:14px 14px 12px;border-bottom:1px solid var(--line)}
  .zx-seg{display:inline-flex;background:var(--brand-soft);border-radius:999px;padding:3px;flex:none}
  .zx-seg button{border:0;background:none;font:700 13px Inter;color:var(--brand);padding:8px 13px;border-radius:999px;cursor:pointer;min-height:36px;transition:background .2s,color .2s}
  .zx-seg button.on{background:var(--brand);color:#fff}
  .zx-seg.hc button.on[data-m=cool]{background:#2F8FE0}.zx-seg.hc button.on[data-m=heat]{background:#E8692E}
  .zx-main{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr)}
  .zx-dia{padding:12px 12px 6px;background:linear-gradient(180deg,#F7FAFE,#fff)}
  .zx-dia svg{width:100%;height:auto;display:block;touch-action:manipulation}
  .zx-cap{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:var(--muted);padding:4px 4px 8px}
  .zx-cap b{color:var(--brand)}
  .zx-ctl{border-left:1px solid var(--line);padding:12px 14px 14px;display:flex;flex-direction:column;gap:10px;background:#FBFCFE}
  .zx-pre{display:flex;gap:6px;flex-wrap:wrap}
  .zx-pre button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:7px 12px;font:600 12.5px Inter;color:var(--brand);cursor:pointer;min-height:34px}
  .zx-pre button:active{background:var(--brand-soft)}
  .zx-rows{display:flex;flex-direction:column;gap:6px}
  .zx-row{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--line);border-radius:12px;padding:8px 10px;min-height:52px}
  .zx-row.on{border-color:var(--air)}
  .zx-sw{width:46px;height:28px;border-radius:999px;background:#CBD2DF;position:relative;flex:none;border:0;cursor:pointer;transition:background .2s;padding:0}
  .zx-sw::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:transform .2s}
  .zx-row.on .zx-sw{background:var(--air)}.zx-row.on .zx-sw::after{transform:translateX(18px)}
  .zx-sw[disabled]{opacity:.55;cursor:default}
  .zx-nm{flex:1;min-width:0}.zx-nm b{display:block;font:700 14px Inter;color:var(--brand);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .zx-nm span{font-size:11.5px;color:var(--muted)}
  .zx-tp{display:flex;align-items:center;gap:4px;flex:none}
  .zx-tp button{width:32px;height:32px;border-radius:50%;border:0;background:var(--brand-soft);color:var(--brand);font:700 17px Inter;cursor:pointer;line-height:1;padding:0}
  .zx-row.on .zx-tp button,.zx-set .zx-tp button{background:var(--air);color:#fff}
  .zx-tp output{font:800 15px Montserrat,Inter,sans-serif;color:var(--brand);min-width:36px;text-align:center}
  .zx-set{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--line);border-radius:12px;padding:8px 10px}
  .zx-set span{font-size:12.5px;color:var(--muted);flex:1}
  .zx-msg{font-size:13px;line-height:1.45;color:#2c2a4a;background:var(--brand-soft);border-radius:12px;padding:10px 12px;min-height:58px}
  .zx-msg img{float:right;width:54px;margin:-2px -2px 4px 8px}
  .zx-add{width:100%;justify-content:center;min-height:46px}.zx-add.added{background:#0F8A5F}
  .zx-note{font-size:11px;color:var(--muted);padding:8px 14px 12px;border-top:1px solid var(--line)}
  .zx svg .rm{cursor:pointer;outline:none}
  .zx svg .rm rect.box{fill:#F1F3F8;stroke:#D5DBE6;stroke-width:1.2;transition:fill .3s,stroke .3s}
  .zx svg .rm.on rect.box{fill:var(--air-soft);stroke:var(--air)}
  .zx svg .duct{fill:none;stroke:#D7DDE8;stroke-width:7;stroke-linecap:round;stroke-linejoin:round}
  .zx svg .flow{fill:none;stroke:var(--air);stroke-width:3;stroke-linecap:round;stroke-dasharray:3 9;opacity:0;transition:opacity .35s}
  .zx svg .flow.on{opacity:1;animation:zxFlow .9s linear infinite}
  @keyframes zxFlow{to{stroke-dashoffset:-12}}
  .zx svg .grille{fill:#fff;stroke:#B9C2D3;stroke-width:1.2}
  .zx svg .rm.on .grille{stroke:var(--air)}
  .zx svg .rm.on .gl{stroke:var(--air)}
  .zx svg .ring{fill:none;stroke:var(--air);stroke-width:1.6;opacity:0}
  .zx svg .rm.on .ring{animation:zxRing 1.8s ease-out infinite}
  @keyframes zxRing{0%{opacity:.8;transform:scale(.6)}100%{opacity:0;transform:scale(1.9)}}
  .zx svg .dmp line{stroke:#8A94A8;stroke-width:2;stroke-linecap:round;transition:transform .35s}
  .zx svg .dmp circle{fill:#fff;stroke:#8A94A8;stroke-width:1.4}
  .zx svg .dmp.open line{transform:rotate(90deg)}
  .zx svg .dmp.open circle,.zx svg .dmp.open line{stroke:var(--air)}
  .zx svg text{font-family:Inter,sans-serif;pointer-events:none}
  .zx svg .unit rect{fill:var(--brand)}
  .zx svg .fan{transform-origin:center;transform-box:fill-box}
  .zx svg .fan.run{animation:zxSpin 1s linear infinite}
  @keyframes zxSpin{to{transform:rotate(360deg)}}
  @media(max-width:760px){.zx-main{grid-template-columns:1fr}.zx-ctl{border-left:0;border-top:1px solid var(--line)}.zx-head{justify-content:center}}
  @media(prefers-reduced-motion:reduce){.zx svg .flow.on,.zx svg .rm.on .ring,.zx svg .fan.run{animation:none}}`;
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---------- state ----------
  var S = { at: false, mode: "cool", set: 22, on: [], t: [] };
  R.forEach(function (r, i) { S.on[i] = true; S.t[i] = 22; });
  var isConst = function (i) { return !S.at && R[i].zone === "constant"; };
  var isOn = function (i) { return isConst(i) || S.on[i]; };
  var label = function (i) { return S.at ? "Zone " + R[i].at : (R[i].zone === "constant" ? "Always on" : "Zone " + R[i].zone); };

  // ---------- layout: rooms in two rows around a central trunk duct ----------
  var W = 360, half = Math.ceil(R.length / 2), top = R.slice(0, half), bot = R.slice(half);
  var RH = 92, Y1 = 8, TRUNK = Y1 + RH + 34, Y2 = TRUNK + 34, H = (bot.length ? Y2 + RH : TRUNK + 30) + 8;
  var boxes = [];
  function place(row, y, below, offset) {
    var gap = 6, wsum = row.reduce(function (t, r) { return t + Math.max(1, r.outlets); }, 0);
    var avail = W - 16 - gap * (row.length - 1), x = 8;
    row.forEach(function (r, k) {
      var w = avail * Math.max(1, r.outlets) / wsum, i = offset + k, outs = [];
      for (var n = 0; n < r.outlets; n++) outs.push(x + w * (n + 1) / (r.outlets + 1));
      boxes[i] = { x: x, y: y, w: w, h: RH, below: below, outs: outs, oy: below ? y + 22 : y + RH - 22 };
      x += w + gap;
    });
  }
  place(top, Y1, false, 0); place(bot, Y2, true, half);
  var allX = []; boxes.forEach(function (b) { allX = allX.concat(b.outs); });
  var UX = W / 2, UW = 88, UH = 30;
  var minX = Math.min.apply(null, allX.concat([UX - UW / 2])), maxX = Math.max.apply(null, allX.concat([UX + UW / 2]));

  function el(tag, a, parent) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); if (parent) parent.appendChild(e); return e; }

  host.innerHTML =
    '<div class="card zx" id="zx">' +
      '<div class="zx-head">' +
        (AT ? '<div class="zx-seg" id="zxZ"><button type="button" data-z="std" class="on">Standard</button><button type="button" data-z="at">With ' + AT.name + '</button></div>' : '') +
        '<div class="zx-seg hc" id="zxM"><button type="button" data-m="cool" class="on">❄ Cool</button><button type="button" data-m="heat">☀ Heat</button></div>' +
      '</div>' +
      '<div class="zx-main">' +
        '<div class="zx-dia"><div class="zx-cap"><span>In your roof space</span><span id="zxCount"></span></div><div id="zxSvg"></div></div>' +
        '<div class="zx-ctl">' +
          '<div class="zx-pre" id="zxPre"></div>' +
          '<div class="zx-set" id="zxSet"><span>One temperature for every zone</span><div class="zx-tp"><button type="button" data-s="-1" aria-label="Cooler">−</button><output id="zxSetV">22°</output><button type="button" data-s="1" aria-label="Warmer">+</button></div></div>' +
          '<div class="zx-rows" id="zxRows"></div>' +
          '<div class="zx-msg" id="zxMsg"></div>' +
          (AT ? '<button type="button" class="btn zx-add" id="zxAdd"></button>' : '') +
        '</div>' +
      '</div>' +
      '<div class="zx-note">Tap a room or a switch to turn its zone on or off. Diagram is illustrative, not a floor plan. Your outlet positions and duct runs are confirmed at the site inspection.</div>' +
    '</div>';
  var $ = function (s) { return host.querySelector(s); }, root = $("#zx");

  // ---------- build the SVG once ----------
  var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Duct diagram of your zones" });
  $("#zxSvg").appendChild(svg);
  var gD = el("g", {}, svg), gF = el("g", {}, svg), gR = el("g", {}, svg);
  el("path", { class: "duct", d: "M" + minX + " " + TRUNK + " H" + maxX }, gD);
  var trunkL = el("path", { class: "flow", d: "M" + UX + " " + TRUNK + " H" + minX }, gF);
  var trunkR = el("path", { class: "flow", d: "M" + UX + " " + TRUNK + " H" + maxX }, gF);
  var parts = [];
  R.forEach(function (r, i) {
    var b = boxes[i], p = { flows: [], dmp: null }, edge = b.below ? b.y : b.y + b.h;
    b.outs.forEach(function (ox) {
      el("path", { class: "duct", d: "M" + ox + " " + TRUNK + " V" + b.oy }, gD);
      p.flows.push(el("path", { class: "flow", d: "M" + ox + " " + TRUNK + " V" + b.oy }, gF));
    });
    var d = el("g", { class: "dmp", transform: "translate(" + b.outs[0] + " " + (TRUNK + edge) / 2 + ")" }, gR);
    el("circle", { r: 6 }, d); var ln = el("line", { x1: -4.5, y1: 0, x2: 4.5, y2: 0 }, d); ln.style.transformOrigin = "0 0";
    p.dmp = d;
    var g = el("g", { class: "rm", "data-i": i, tabindex: 0, role: "button" }, gR);
    el("rect", { class: "box", x: b.x, y: b.y, width: b.w, height: b.h, rx: 10 }, g);
    var ty = b.below ? b.y + b.h - 30 : b.y + 20;
    var nm = el("text", { x: b.x + b.w / 2, y: ty, "text-anchor": "middle", "font-size": 11.5, "font-weight": 700, fill: "#1B3664" }, g);
    nm.textContent = b.w < 95 ? r.name.replace(/^bedroom\s*/i, "Bed ") : r.name;
    p.zt = el("text", { x: b.x + b.w / 2, y: ty + 14, "text-anchor": "middle", "font-size": 9.5, "font-weight": 700, "letter-spacing": ".05em", fill: "#5A6478" }, g);
    b.outs.forEach(function (ox) {
      var rg = el("circle", { class: "ring", cx: ox, cy: b.oy, r: 9 }, g); rg.style.transformOrigin = ox + "px " + b.oy + "px";
      el("rect", { class: "grille", x: ox - 8, y: b.oy - 8, width: 16, height: 16, rx: 3 }, g);
      for (var k = -4; k <= 4; k += 4) el("line", { class: "gl", x1: ox + k, y1: b.oy - 5, x2: ox + k, y2: b.oy + 5, stroke: "#B9C2D3", "stroke-width": 1.2 }, g);
    });
    p.g = g; parts[i] = p;
  });
  var u = el("g", { class: "unit" }, gR);
  el("rect", { x: UX - UW / 2, y: TRUNK - UH / 2, width: UW, height: UH, rx: 8 }, u);
  var fan = el("g", { class: "fan" }, u);
  el("circle", { cx: UX - UW / 2 + 15, cy: TRUNK, r: 9, fill: "none", stroke: "#fff", "stroke-width": 1.6, "stroke-dasharray": "5 4" }, fan);
  var ut = el("text", { x: UX + 11, y: TRUNK + 3.5, "text-anchor": "middle", "font-size": 9.5, "font-weight": 700, fill: "#fff" }, u); ut.textContent = "Indoor unit";

  // ---------- presets ----------
  var pre = [["All on", function () { R.forEach(function (r, i) { S.on[i] = true; }); }]];
  (Z.presets || []).forEach(function (p) { pre.push([p.name, function () { R.forEach(function (r, i) { S.on[i] = p.on.indexOf(i) > -1; }); }]); });
  pre.push(["All off", function () { R.forEach(function (r, i) { S.on[i] = false; }); }]);
  $("#zxPre").innerHTML = pre.map(function (p, k) { return '<button type="button" data-p="' + k + '">' + p[0] + '</button>'; }).join("");
  host.querySelectorAll("#zxPre button").forEach(function (b) { b.onclick = function () { pre[+b.dataset.p][1](); draw(); }; });

  var flashing = null;
  function flash(t) { clearTimeout(flashing); $("#zxMsg").textContent = t; flashing = setTimeout(function () { flashing = null; draw(); }, 4500); }
  function toggle(i) {
    if (isConst(i)) { flash(R[i].name + " has the constant outlet. It stays open whenever the system runs, to keep the system's minimum airflow." + (AT ? " With " + AT.name + " it becomes its own zone." : "")); return; }
    S.on[i] = !S.on[i]; draw();
  }

  function draw() {
    root.style.setProperty("--air", S.mode === "heat" ? "#E8692E" : "#2F8FE0");
    root.style.setProperty("--air-soft", S.mode === "heat" ? "#FFF1EA" : "#EAF4FD");
    var outs = 0, outsOn = 0;
    R.forEach(function (r, i) {
      var on = isOn(i), p = parts[i];
      outs += r.outlets; if (on) outsOn += r.outlets;
      p.g.classList.toggle("on", on); p.g.setAttribute("aria-pressed", on);
      p.flows.forEach(function (f) { f.classList.toggle("on", on); });
      p.dmp.classList.toggle("open", on); p.dmp.style.display = isConst(i) ? "none" : "";
      p.zt.textContent = (S.at && on ? S.t[i] + "° · " : "") + label(i).toUpperCase();
    });
    var any = outsOn > 0;
    trunkL.classList.toggle("on", any); trunkR.classList.toggle("on", any); fan.classList.toggle("run", any);
    $("#zxCount").innerHTML = any ? "<b>" + (S.mode === "heat" ? "Heating" : "Cooling") + "</b> · air to " + outsOn + " of " + outs + " outlets" : "<b>System off</b>";
    $("#zxSet").style.display = S.at ? "none" : "";
    $("#zxSetV").textContent = S.set + "°";
    $("#zxRows").innerHTML = R.map(function (r, i) {
      var on = isOn(i), c = isConst(i);
      return '<div class="zx-row' + (on ? " on" : "") + '" data-i="' + i + '">' +
        '<button type="button" class="zx-sw" aria-label="' + r.name + (on ? " on" : " off") + '"' + (c ? " disabled" : "") + '></button>' +
        '<div class="zx-nm"><b>' + r.name + '</b><span>' + label(i) + ' · ' + r.outlets + ' outlet' + (r.outlets > 1 ? "s" : "") + '</span></div>' +
        (S.at ? '<div class="zx-tp"><button type="button" data-d="-1" aria-label="Cooler">−</button><output>' + S.t[i] + '°</output><button type="button" data-d="1" aria-label="Warmer">+</button></div>' : '') +
      '</div>';
    }).join("");
    host.querySelectorAll(".zx-row").forEach(function (row) {
      var i = +row.dataset.i;
      row.querySelector(".zx-sw").onclick = function () { toggle(i); };
      row.querySelectorAll(".zx-tp button").forEach(function (b) {
        b.onclick = function () { S.t[i] = Math.max(16, Math.min(30, S.t[i] + (+b.dataset.d))); S.on[i] = true; draw(); };
      });
    });
    if (!flashing) {
      var c = R.filter(function (r) { return r.zone === "constant"; })[0];
      $("#zxMsg").innerHTML = S.at
        ? (AT.app ? '<img src="' + AT.app + '" alt="">' : "") + "<b>" + AT.name + ":</b> every room is its own zone with its own temperature sensor, so each room gets its own setting. Control it from the wall screen or your phone."
        : "<b>Standard zoning:</b> switch each zone on or off at the wall. Closed zones get no air, and all open zones share one temperature." + (c ? " The " + c.name.toLowerCase() + " outlet stays open to keep airflow." : "");
    }
    if (AT) {
      var picked = document.querySelector('.addon.on[data-id="' + AT.extra + '"]'), b = $("#zxAdd");
      b.classList.toggle("added", !!picked);
      b.textContent = picked ? "✓ " + AT.name + " added to your quote" : "Add " + AT.name + " to my quote";
    }
  }

  // ---------- events ----------
  parts.forEach(function (p, i) {
    p.g.addEventListener("click", function () { toggle(i); });
    p.g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(i); } });
  });
  host.querySelectorAll("#zxZ button").forEach(function (b) {
    b.onclick = function () {
      S.at = b.dataset.z === "at"; clearTimeout(flashing); flashing = null;
      host.querySelectorAll("#zxZ button").forEach(function (x) { x.classList.toggle("on", x === b); });
      try { window.lcmbTrack && window.lcmbTrack("zoning " + (S.at ? "upgrade" : "standard")); } catch (e) {}
      draw();
    };
  });
  host.querySelectorAll("#zxM button").forEach(function (b) {
    b.onclick = function () { S.mode = b.dataset.m; host.querySelectorAll("#zxM button").forEach(function (x) { x.classList.toggle("on", x === b); }); draw(); };
  });
  host.querySelectorAll("#zxSet button").forEach(function (b) { b.onclick = function () { S.set = Math.max(16, Math.min(30, S.set + (+b.dataset.s))); draw(); }; });
  if (AT) $("#zxAdd").onclick = function () {
    var a = document.querySelector('.addon[data-id="' + AT.extra + '"]');
    if (a && !a.classList.contains("on")) a.click();
    if (!S.at) host.querySelector('#zxZ button[data-z="at"]').click(); else draw();
    try { window.lcmbTrack && window.lcmbTrack("zoning add upgrade"); } catch (e) {}
  };
  document.addEventListener("click", function (e) { if (AT && e.target.closest(".addon")) setTimeout(draw, 0); });
  draw();
  return true;
};
