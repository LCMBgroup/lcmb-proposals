// LCMB brand extras shared by every quote: customer video testimonials.
(function () {
  const VIDS = [
    { src: "../assets/video/testimonial-wayne.mp4", poster: "../assets/video/testimonial-wayne.jpg", name: "Wayne", note: "LCMB customer" },
    { src: "../assets/video/testimonial-gus.mp4", poster: "../assets/video/testimonial-gus.jpg", name: "Gus", note: "Worongary" },
    { src: "../assets/video/testimonial-1.mp4", poster: "../assets/video/testimonial-1.jpg", name: "LCMB customer", note: "In their own words" }
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
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
