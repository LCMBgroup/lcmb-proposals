// AIR CON pages only (folders starting ac-). Load BEFORE ac-accept.js and finance.js.
// Solar/battery pages never load this file.
window.LCMB_AC = {
  name: "Haydyn",
  fullName: "Haydyn O'Hara",
  phone: "0483 927 024",
  email: "projects@lcmbgroup.com.au",

  // Meet the team, shared by every air con page. photo:"" shows initials until a photo is
  // added to assets/ (e.g. "../assets/haydyn.jpg"). lic:"" hides the licence line.
  team: [
    { n: "Haydyn", role: "Air con sales & installations", lic: "", photo: "../assets/team-haydyn.jpg", lead: true, d: "Your main contact from quote to handover, and the one who'll come out for your site inspection." },
    { n: "Lochie", role: "Air conditioning tech", lic: "", photo: "../assets/team-lochie.jpg", d: "Part of the LCMB air con install crew." },
    { n: "Tom", role: "Air conditioning tech", lic: "", photo: "../assets/team-tom.jpg", d: "Part of the LCMB air con install crew." },
    { n: "Badi", role: "Air conditioning tech", lic: "", photo: "../assets/team-badi.jpg", d: "Part of the LCMB air con install crew." },
    { n: "Joe", role: "Air conditioning tech", lic: "", photo: "../assets/team-joe.jpg", d: "Part of the LCMB air con install crew." }
  ],

  // Google reviews that mention ducted / air con ONLY, copied word for word from Google.
  // The reviews block stays hidden while this list is empty. Never shorten, edit or invent.
  // { name: "Chris B.", job: "Ducted air con", text: "…full review text…" }
  // Ducted job videos (edited by LCMB's videographer, from Drive), shown at the bottom of every air con page.
  videos: [
    { src: "../assets/video/ducted-mudgeeraba.mp4", poster: "../assets/video/ducted-mudgeeraba.jpg", name: "Double-storey ducted", note: "14 kW Daikin + AirTouch 5 · Mudgeeraba" },
    { src: "../assets/video/ducted-hope-island.mp4", poster: "../assets/video/ducted-hope-island.jpg", name: "Ducted install", note: "Hope Island" },
    { src: "../assets/video/ducted-airtouch5.mp4", poster: "../assets/video/ducted-airtouch5.jpg", name: "AirTouch 5 smart control", note: "Ducted zoning upgrade" }
  ],

  // Copied word for word from LCMB GROUP's Google reviews (topic "ducted system installation" / search "Hayden"), 22 Nov 2026. All 5 stars.
  // Luke's rule: ducted only, prefer ones naming Haydyn, avoid ones naming Luke. Never edit the wording.
  reviews: [
    {
      "name": "Chris B.",
      "job": "Ducted air con + battery",
      "text": "I had Luke and Hayden help me to get a solar battery and ducted installed. The guys were awesome! Friendly, quick, efficient and great customer service.\nTheir team stuck around afterwards to help me get my head around the apps for both the battery and ducted which I needed a bit of help with.\nWhile they weren't the cheapest option I was quoted, I felt as though they actually listened to what I was after, then they also gave their professional opinion. I'd definitely recommend them to anyone"
    },
    {
      "name": "Gary W.",
      "job": "Air con",
      "text": "Absolutely top-notch service . Dealt with the options didn't try to upsell me something I didn't need Very easy to deal with . Will be telling others . Hayden and Lochie are to be congratulated . Thanks again"
    },
    {
      "name": "Teneille F.",
      "job": "Ducted air con",
      "text": "We recently had LCMB Group quote us for a ducted air conditioning system on 22/09. After carefully reviewing all quotes and requesting some clarifications and additions on 11/10, we confirmed we were ready to proceed on 12/10 and paid the deposit as agreed. By 23/10, the entire system was installed—in just 8 hours!\n\nThe team of four on site were exceptional. They kept me informed throughout the process, explaining what was going where and how it would work. They were respectful, efficient, and incredibly tidy—leaving the space spotless after the install. I couldn’t be happier with the quality of their work and the professionalism they showed.\n\nThey also did a fantastic job walking me through how to use the system at the end—clear, patient, and thorough, which gave me full confidence in operating everything smoothly.\n\nBonus points for their sweet interactions with our two puppies—every time they came into the lounge room, they gave them a little love and attention, which was just the cherry on top 😂.\n\nHighly recommend LCMB Group for anyone looking for a seamless, well-communicated, and expertly executed aircon installation. Job very well done!"
    },
    {
      "name": "Perry C.",
      "job": "Ducted replacement",
      "text": "We had an 20 year old ducted air system that had blown due to a cyclone. LCMB removed the old system and replaced it with a new one. The guys turned up on time, were very careful and thorough with the removal of the old system and were fantastic with the installation of the new system. They were prompt, very courteous and got the job done quickly. They thoroughly cleaned up after themselves. Can’t recommend them enough. We love our new control panel."
    },
    {
      "name": "Matthew R.",
      "job": "Ducted air con",
      "text": "I don’t often do reviews, but couldn’t let this one pass. The guys arrived on time, despite coming from the GC (we are in ippy), they were well dressed, professional and did one hell of a job with our ducted aircon. Everything flowed very smoothly from the initial quote to the final run down of the ducted system. I don’t know these guys, nor did they ask for a review. Their current rating speaks for itself. Do yourself a favour and book this company."
    },
    {
      "name": "Gabriel K.",
      "job": "Ducted air con",
      "text": "We have done recently our ducted aircon, very happy to the being to the end the team was very professional and clean they did amazing job they were on time good communication skill, price was good too.\nCouldn’t be more happier.\nThanks guy keep it up the good job 😊"
    },
    {
      "name": "Jessica d.",
      "job": "Ducted air con",
      "text": "A pleasure to deal with, fair pricing, and great system! Loving our ducted aircon, and would highly recommend LCMB to anyone. It's refreshing to deal with such respectful and efficient trades."
    },
    {
      "name": "Marg H.",
      "job": "Ducted air con",
      "text": "The team fitted ducted AC to my home and also new lighting and upgrades. I couldn't ask for better service and they were prompt, polite and very professional. Many thanks to you all for a great job."
    },
    {
      "name": "Nathan L.",
      "job": "Ducted air con",
      "text": "Great team to work with.\nDucted system installed within a week of providing a very competitive quote.\nThe workman were great, and went above and beyond to provide a great service."
    }
  ],

  // Product showcases used by extras with info:"<key>". Images are official Polyaire assets
  // (Drive: Polyaire Marketing Assets), used as supplied. Points paraphrase the AirTouch 5 brochure.
  products: {
    airtouch5: {
      logo: "../assets/ac-airtouch5-logo.png",
      photo: "../assets/ac-airtouch5-wall.jpg",
      app: "../assets/ac-airtouch5-app.png",
      tag: "Australia's smartest air conditioning controller, designed in Australia for Australian homes.",
      points: [
        ["Every room, its own temperature", "Sensors in each zone track the temperature room by room and find hot and cold spots, instead of reading one spot in the house."],
        ["Control from anywhere", "Run it from the wall touchscreen, the phone app or by voice."],
        ["Geofencing", "Turns the air con off when you leave and back on as you head home."],
        ["Temperature alerts", "Get a notification on your phone if the house gets too hot or cold."],
        ["Saves energy on its own", "Built-in smarts adjust airflow room by room, adapt to the weather and only send air where it's needed."],
        ["Usage insights", "See how much you run the air con over a day, a week or a month, and where you can save."],
        ["Sleep, Away, timers and favourites", "One-touch comfort settings and set-and-forget routines."],
        ["5-year AirTouch warranty", "Plus online updates that keep it current."]
      ]
    }
  }
};

(function () {
  var AC = window.LCMB_AC, tel = AC.phone.replace(/\s/g, "");

  // finance.js is shared with the solar pages and names Luke; on air con pages show Haydyn instead.
  function swapNames(root) {
    if (!root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) {
      var t = n.nodeValue;
      if (/Luke|0483 927 024/.test(t)) n.nodeValue = t.replace(/Luke/g, AC.name).replace(/0483 927 024/g, AC.phone);
    }
  }
  function watchFinance() {
    var f = document.getElementById("finance");
    if (!f) return;
    swapNames(f);
    new MutationObserver(function () { swapNames(f); }).observe(f, { childList: true, subtree: true, characterData: true });
  }

  // "Book my free site inspection" button under the price card (air con wording).
  function bookCta() {
    if (document.getElementById("bookCta")) return;
    var price = document.getElementById("oPrice");
    var left = price && price.closest(".left");
    var card = left && left.parentElement;
    if (!card || !document.getElementById("accept")) return;
    var w = document.createElement("div");
    w.id = "bookCta";
    w.style.cssText = "margin:16px 0 0;text-align:center";
    w.innerHTML = '<a class="btn" href="#accept" style="display:inline-flex;justify-content:center;width:100%;max-width:420px;padding:15px">Book my free site inspection</a>' +
      '<div style="margin-top:8px;font-size:13px;color:#5a5a5c">Pick a time that suits you. ' + AC.name + ' checks the site and confirms your final price.</div>';
    w.querySelector("a").onclick = function (e) {
      e.preventDefault();
      (document.getElementById("go") || document.getElementById("accept")).scrollIntoView({ behavior: "smooth", block: "center" });
    };
    card.parentNode.insertBefore(w, card.nextSibling);
  }

  // Phone links on the page: any element with data-ac-phone gets Haydyn's number.
  function phones() {
    document.querySelectorAll("[data-ac-phone]").forEach(function (a) { a.textContent = AC.phone; if (a.tagName === "A") a.href = "tel:" + tel; });
  }

  function go() { watchFinance(); bookCta(); phones(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
