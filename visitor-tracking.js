(() => {
  const SUPABASE_URL = "https://ibkbahsmhxwiccivcesi.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_CmYr6ADC7ubTe8bHqGOfsg_Xftq8usO";
  if (!window.supabase || !window.supabase.createClient) return;
  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  const visitorKey = "yma_visitor_id";
  let visitorId = localStorage.getItem(visitorKey);
  if (!visitorId) {
    visitorId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() :
      "v-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem(visitorKey, visitorId);
  }
  const ua = navigator.userAgent || "";
  const device = /tablet|ipad/i.test(ua) ? "tablet" : /mobile|android|iphone/i.test(ua) ? "mobile" : "desktop";
  const path = (location.pathname || "/").slice(0, 300);
  const title = (document.title || "").slice(0, 200);
  let referrer = null;
  try { if (document.referrer) { const r = new URL(document.referrer); referrer = (r.origin + r.pathname).slice(0, 500); } } catch (_) {}
  async function record(eventType) {
    try {
      const { data } = await db.auth.getSession();
      const userId = data && data.session && data.session.user ? data.session.user.id : null;
      const { error } = await db.from("site_visitor_events").insert({
        visitor_id: visitorId, user_id: userId, page_path: path, page_title: title,
        referrer, device_type: device, event_type: eventType
      });
      if (error) console.warn("Visitor analytics:", error.message);
    } catch (e) { console.warn("Visitor analytics unavailable.", e); }
  }
  record("page_view");
  const heartbeat = setInterval(() => { if (!document.hidden) record("heartbeat"); }, 60000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) record("heartbeat"); });
  window.addEventListener("pagehide", () => clearInterval(heartbeat), { once: true });
})();
