const CACHE = "tarot-study-v1";
const ASSETS = [
  "./index.html","./app.css","./app.js",
  "./data_major.js","./data_wands.js","./data_cups.js","./data_swords.js","./data_pentacles.js","./data_spreads.js",
  "./manifest.json","./icon-192.png","./icon-512.png"
];
self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", e=>{ self.clients.claim(); });
self.addEventListener("fetch", e=>{
  e.respondWith(
    caches.match(e.request).then(res=> res || fetch(e.request))
  );
});
