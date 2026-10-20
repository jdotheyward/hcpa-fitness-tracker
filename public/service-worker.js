/* eslint-disable no-restricted-globals */

// Bump CACHE_VERSION only if the caching strategy itself changes. New deploys
// are picked up without a bump: pages are fetched network-first and the
// build's hashed bundles get new URLs on every release.
const CACHE_VERSION = "v2";
const APP_CACHE = `semaj-fit-app-${CACHE_VERSION}`;
const FONT_CACHE = `semaj-fit-fonts-${CACHE_VERSION}`;
const KEEP = [APP_CACHE, FONT_CACHE];

const SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/brand/semaj-mark.png",
  "/brand/semaj-wordmark.png",
];

// Install: cache the app shell plus the current build's JS/CSS, read from the
// asset manifest Create React App writes on every build.
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_CACHE);
      let urls = SHELL;
      try {
        const res = await fetch("/asset-manifest.json", { cache: "no-store" });
        if (res.ok) {
          const manifest = await res.json();
          urls = urls.concat((manifest.entrypoints || []).map((p) => `/${p.replace(/^\//, "")}`));
        }
      } catch (e) {
        // Dev server has no asset manifest; runtime caching covers it.
      }
      await Promise.all(urls.map((url) => cache.add(new Request(url, { cache: "reload" })).catch(() => {})));
      await self.skipWaiting();
    })()
  );
});

// Activate: drop caches from older versions (including the old hcpa-fitness-v1).
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.filter((n) => !KEEP.includes(n)).map((n) => caches.delete(n)));
      await self.clients.claim();
    })()
  );
});

async function networkFirst(request, fallbackUrl) {
  const cache = await caches.open(APP_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(fallbackUrl || request, response.clone());
    return response;
  } catch (e) {
    const cached = await cache.match(fallbackUrl || request);
    if (cached) return cached;
    throw e;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(APP_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === "opaque")) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Page loads: always try the network so new deploys show up immediately;
  // fall back to the cached shell when offline.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, "/index.html"));
    return;
  }

  if (url.origin === self.location.origin) {
    if (url.pathname === "/asset-manifest.json") return;
    // Hashed build output never changes at a given URL.
    if (url.pathname.startsWith("/static/")) {
      event.respondWith(cacheFirst(request));
      return;
    }
    event.respondWith(staleWhileRevalidate(request, APP_CACHE));
    return;
  }

  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(staleWhileRevalidate(request, FONT_CACHE));
  }
});
