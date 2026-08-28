// ============================================================================
// KILL SWITCH — this service worker only exists to REMOVE itself.
// ============================================================================
//
// An earlier version of this file was a real offline cache. On localhost it
// kept serving stale `/_next/static/*` chunks from Cache Storage under
// `npm run dev`: the browser booted an outdated client bundle (old emoji
// `<span class="text-3xl">`) against freshly server-rendered HTML (new
// lucide `<svg>`) → "Hydration failed", and the UI showed the old icons.
//
// The browser always revalidates the service-worker script itself over the
// network (bypassing any SW fetch handler, and `updateViaCache: 'none'` is
// set at registration), so shipping this file is enough to reach every
// browser that still has the old worker. On activation it deletes every
// cache, unregisters itself, and reloads all open tabs — leaving a clean,
// service-worker-free origin.
//
// Do NOT reintroduce offline caching here without a hard-versioned cache
// name AND a dev guard in the registration code. See
// components/ServiceWorkerRegister.tsx.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 1. Drop every Cache Storage entry (old app-shell + chunk caches).
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));

      // 2. Remove this registration.
      await self.registration.unregister();

      // 3. Force every controlled tab to reload from the network so it
      //    picks up the real, uncached app.
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) {
        client.navigate(client.url);
      }
    })(),
  );
});

// No fetch handler: while this worker is briefly active it stays completely
// transparent and every request goes straight to the network.
