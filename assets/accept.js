// Sends a proposal acceptance straight to LCMB Group.
window.LCMB_ACCEPT_URL = "__ACCEPT_URL__";
window.lcmbSendAccept = async function (p) {
  if (/__ACCEPT_URL__/.test(window.LCMB_ACCEPT_URL)) return false; // not switched on yet: use the email button
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
      if (j && j.ok) return true;
    } catch (e) { clearTimeout(t); }
  }
  return false;
};
