'use client';

import { useEffect } from 'react';

/**
 * PWA / offline caching is currently DISABLED.
 *
 * The previous offline cache (public/sw.js) poisoned `npm run dev` by serving
 * stale `/_next/static/*` chunks from Cache Storage, causing hydration
 * mismatches and outdated UI. public/sw.js is now a self-removing kill switch.
 *
 * This component no longer registers anything. It only performs a belt-and-
 * suspenders teardown of any service worker + caches that a browser may still
 * have from before, in every environment. Once we're confident all clients are
 * clean, this can be deleted or re-implemented as a real, dev-guarded,
 * hard-versioned PWA registration.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      })
      .catch(() => {});

    if ('caches' in window) {
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .catch(() => {});
    }
  }, []);

  return null;
}
