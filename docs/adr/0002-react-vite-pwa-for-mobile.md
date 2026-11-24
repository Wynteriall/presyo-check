---
status: accepted
---

# React + Vite Mobile-First, Desktop-Adaptive PWA for v1

PresyoCheck v1 is built as a **React + Vite Progressive Web App (`vite-plugin-pwa`)** with a mobile-first, desktop-adaptive responsive layout and thin `src/platform/` device adapters rather than a React Native (Expo) app or an upfront Capacitor native wrapper.

## Context

PresyoCheck is developed on **Windows** on a **`$0` / free-tier budget** inside a **React + Vite** capstone program while targeting **Android & iOS Shoppers** (and a clean post-capstone path to production). Primary-source research in [Research React mobile options for Android and iOS from a React + Vite base](https://github.com/Wynteriall/presyo-check/issues/4) established that neither Capacitor nor Expo EAS Build can sign an installable physical-device `.ipa` for iOS without a paid **`$99/yr` Apple Developer Program** membership (and macOS/Xcode for Capacitor), while Google Play publishing for new personal accounts requires `$25` plus 12 opted-in closed testers for 14 continuous days. Meanwhile, [Choose target user personas and core problems](https://github.com/Wynteriall/presyo-check/issues/5) deferred push/price alerts and [Choose v1 retail chains and price-data sourcing strategy](https://github.com/Wynteriall/presyo-check/issues/6) ruled out barcode scanning and receipt OCR for v1, removing the primary native-only drivers for v1.

## Considered Options

- **React Native (Expo)**: Rejected for v1 because it replaces Vite with Metro and standard DOM/Tailwind CSS with React Native primitives, breaking React + Vite program alignment, and restricts `$0` physical iOS demos from Windows to running inside Expo Go (no standalone PresyoCheck icon).
- **React + Vite + Capacitor upfront**: Rejected for v1 because adding Android Studio/Gradle wrapper maintenance yields only a sideloadable Android `.apk` while iOS still falls back to the PWA from Windows at `$0`, with no native-only plugins needed in v1.
- **React + Vite mobile-first, desktop-adaptive PWA (chosen)**: Preserves 100% React + Vite alignment, delivers instant HTTPS URL access on phones and laptops plus `$0` standalone Home Screen installation on both Android Chrome and iOS Safari, caches the compact ~80–120 Hero SKU catalog and local shopping list for offline in-aisle supermarket use, and keeps an additive Capacitor (`webDir: 'dist'`) or Google Play TWA (`Bubblewrap`) upgrade path open.

## Consequences

- **Zero native-store friction in v1, non-destructive native path later**: Isolating `storage`, `geolocation`, and `installPrompt` behind thin `src/platform/` adapters (with zero Capacitor packages in v1) lets a post-v1 Capacitor or TWA wrap swap platform implementations without rewriting React UI components.
- **Responsive web ergonomics from day 1**: Mobile 360–430px touch UX (bottom tab bar, `100dvh`, safe-area insets) stays primary while `md:` / `lg:` Tailwind breakpoints adapt cleanly to top navigation and wider centered layouts (`max-w-5xl`) on laptops for pre-trip planning and capstone demos.
- **iOS Safari storage eviction trade-off**: Because **Shoppers** are unauthenticated in v1 and regular iOS Safari evicts script-writable storage after 7 days of browser use without visiting the site, v1 pairs local-first storage (`navigator.storage.persist()`) with proactive Android `beforeinstallprompt` and dismissible 2-step iOS *"Share → Add to Home Screen"* guides, deferring cloud list sync until accounts arrive post-v1.
- **Non-disruptive offline runtime**: `vite-plugin-pwa` uses `registerType: 'prompt'` so app-shell updates never force-reload mid-aisle while catalog **Price Observations** refresh independently in the background; static HTTPS hosting is deferred to [Design backend, storage, and data-refresh architecture](https://github.com/Wynteriall/presyo-check/issues/10) so frontend and backend hosting are decided together.
