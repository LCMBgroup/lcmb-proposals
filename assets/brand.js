// LCMB brand extras shared by every quote: customer video testimonials.
(function () {
  const VIDS = [
    { src: "../assets/video/testimonial-wayne.mp4", poster: "../assets/video/testimonial-wayne.jpg", name: "Wayne", note: "LCMB customer" },
    { src: "../assets/video/testimonial-gus.mp4", poster: "../assets/video/testimonial-gus.jpg", name: "Gus", note: "Worongary" },
    { src: "../assets/video/testimonial-1.mp4", poster: "../assets/video/testimonial-1.jpg", name: "Rob", note: "LCMB customer" }
  ];
  function build() {
    const why = document.querySelector("#why .wrap");
    if (!why || document.querySelector(".vids")) return;
    const box = document.createElement("div");
    box.className = "vids";
    box.innerHTML = '<h3>Hear it from our customers</h3><p class="sub">Real LCMB customers, filmed at their homes.</p><div class="vrow"></div>';
    const row = box.querySelector(".vrow");
    VIDS.forEach(v => {
      const f = document.createElement("figure");
      f.className = "vcard";
      f.innerHTML = '<video preload="none" playsinline poster="' + v.poster + '" src="' + v.src + '"></video>' +
        '<button class="play" type="button" aria-label="Play ' + v.name + '\'s video"><i></i></button>' +
        '<figcaption>' + v.name + '<small>' + v.note + '</small></figcaption>';
      const vid = f.querySelector("video");
      f.querySelector(".play").onclick = () => {
        document.querySelectorAll(".vcard video").forEach(o => { if (o !== vid) o.pause(); });
        f.classList.add("on"); vid.controls = true; vid.play();
        try { window.lcmbTrack && window.lcmbTrack("video " + v.name); } catch (e) {}
      };
      row.appendChild(f);
    });
    const anchor = why.querySelector(".rv-mini") || why.lastElementChild;
    why.insertBefore(box, anchor);
  }
  const IC = {
    Electrical: '<svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
    "Air conditioning": '<svg viewBox="0 0 24 24"><path d="M12 2v20M4.9 6.5l14.2 11M19.1 6.5 4.9 17.5M9 4l3 2 3-2M9 20l3-2 3 2"/></svg>',
    Solar: '<svg viewBox="0 0 24 24"><path d="M4 20 6 11h12l2 9zM9 11l-1 9M15 11l1 9M5 15.5h14M12 2v3M5.5 4.5l1.8 1.8M18.5 4.5l-1.8 1.8"/></svg>',
    Battery: '<svg viewBox="0 0 24 24"><rect x="7" y="4" width="10" height="17" rx="2"/><path d="M10 2h4M13 8l-3 5h4l-3 5"/></svg>'
  };
  function brandBits() {
    const hw = document.querySelector(".hero .wrap");
    if (hw && !hw.querySelector(".svc")) {
      const svc = document.createElement("div");
      svc.className = "svc";
      svc.innerHTML = Object.keys(IC).map(k => "<span>" + IC[k] + k + "</span>").join("");
      const meta = hw.querySelector(".hmeta");
      (meta || hw.lastElementChild).insertAdjacentElement("afterend", svc);
    }
    const ft = document.querySelector("footer");
    if (ft && !ft.querySelector(".svcline")) {
      const l = document.createElement("span");
      l.className = "svcline";
      l.textContent = "Electrical \u2022 Air conditioning \u2022 Solar \u2022 Battery \u00b7 Locally owned & operated";
      const img = ft.querySelector("img");
      if (img && img.nextSibling) ft.insertBefore(l, img.nextSibling.nextSibling || null); else ft.appendChild(l);
    }
  }
  function go() { build(); brandBits(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
