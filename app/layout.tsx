import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import OfflineBanner from "@/components/OfflineBanner";

// Emitted as a plain inline <script> at the top of <body> so it runs during
// HTML parse, before the client bundle boots and before hydration.
//
// Background: an earlier public/sw.js was a cache-first offline cache. On
// localhost it kept serving stale `/_next/static/*` chunks from Cache Storage,
// so the browser hydrated an outdated client bundle (old emoji
// `<span class="text-3xl">`) against fresh server HTML (new lucide `<svg>`) →
// "Hydration failed", with the old icons still on screen.
//
// public/sw.js is now a self-removing kill switch, but a browser that still
// has the old worker won't pick that up until its next SW update check. This
// script short-circuits that: if a service worker currently controls the page,
// unregister it, wipe every cache, and reload once (the one-shot sessionStorage
// guard prevents a loop). After that reload the page is service-worker-free.
const SW_TEARDOWN = `
(function () {
  try {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) return;
    if (sessionStorage.getItem('__sw_torndown__')) return;
    Promise.all([
      navigator.serviceWorker.getRegistrations().then(function (regs) {
        return Promise.all(regs.map(function (r) { return r.unregister(); }));
      }),
      window.caches
        ? caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (k) { return caches.delete(k); }));
          })
        : null,
    ])
      .catch(function () {})
      .then(function () {
        sessionStorage.setItem('__sw_torndown__', '1');
        window.location.reload();
      });
  } catch (e) {}
})();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DC&M AI 타로점",
  description: "컴퓨터공학부 학술 정동아리 DC&M의 AI 타로 운세 서비스",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AI 타로점",
  },
};

// Next 16 requires themeColor in the viewport export, not metadata.
export const viewport: Viewport = {
  themeColor: "#7c3aed",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: SW_TEARDOWN }} />
        <ServiceWorkerRegister />
        <OfflineBanner />
        {children}
      </body>
    </html>
  );
}
