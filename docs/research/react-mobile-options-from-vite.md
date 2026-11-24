# React Mobile Options for Android and iOS from a React + Vite Base

- **Ticket:** [Wynteriall/presyo-check#4](https://github.com/Wynteriall/presyo-check/issues/4) (Part of Map [#1](https://github.com/Wynteriall/presyo-check/issues/1))
- **Context:** PresyoCheck — a mobile-focused Philippine grocery price-comparison React app built as a capstone in a **React + Vite** program, developed on **Windows**, targeting **Android and iOS** on a **$0 / free-tier budget**, with a clean path to production.
- **Options Evaluated:**
  1. **React + Vite mobile-first PWA** (`vite-plugin-pwa`)
  2. **React + Vite + Capacitor** (wrapping the Vite web bundle for native Android & iOS)
  3. **React Native (Expo)**

---

## Executive Verdict

**Recommended v1 (capstone) path: Option 1 — React + Vite mobile-first PWA (`vite-plugin-pwa`), architected with thin device-capability adapters so Option 2 (Capacitor) can wrap the exact same codebase later without a rewrite.**

Why this wins under PresyoCheck's constraints:
1. **100% React + Vite alignment:** Keeps Vite (`vite build` -> `dist/`), standard React DOM, HTML/CSS, Tailwind CSS v4 (`@tailwindcss/vite`), and standard web UI/routing libraries intact. Expo replaces Vite with Metro and replaces HTML/CSS with React Native primitives.
2. **Only path that gives a real, standalone-icon $0 iOS + Android demo from Windows:** On Windows without a Mac or a $99/yr Apple Developer Program membership, neither Capacitor nor EAS Build can sign an installable `.ipa` for a physical iPhone. A PWA installs to the Home Screen on both Android Chrome and iOS Safari directly from a free HTTPS URL (e.g., Cloudflare Pages) with zero sideloading warnings and zero third-party sandbox app — and even supports **iOS Web Push via APNs at $0**.
3. **Zero-friction capstone evaluation:** Panelists and test shoppers open a single HTTPS link on any iPhone or Android phone immediately (no Android "Install unknown apps" prompts, no asking evaluators to install Expo Go).
4. **Incremental production path:** Wrapping a well-built Vite PWA in Capacitor (`webDir: 'dist'`) or Google Play Trusted Web Activity (Bubblewrap) later is additive, whereas starting with Expo is a day-1 stack departure from Vite.

**When to pick an alternative instead:**
- **Add Capacitor *now* (hybrid PWA + Android APK):** Only if you specifically want a sideloadable Android `.apk` during the capstone *on top of* serving the exact same Vite build as a PWA to iOS devices (since Windows + $0 cannot build native iOS binaries anyway).
- **Choose Expo instead:** Only if your program explicitly approves replacing Vite with Metro + React Native, **and** live in-aisle 1D barcode scanning is a non-negotiable hero feature where native camera scanning outperforms WASM web scanning enough to justify iOS testers running inside **Expo Go** (no standalone PresyoCheck icon on iOS at $0).

---

## Side-by-Side Decision Comparison Matrix

| Dimension | 1. React + Vite Mobile-First PWA (`vite-plugin-pwa`) | 2. React + Vite + Capacitor | 3. React Native (Expo) |
| :--- | :--- | :--- | :--- |
| **React + Vite Curriculum Fit** | **Full (100%).** Native Vite, React DOM, HTML/CSS, Tailwind v4 (`@tailwindcss/vite`), web UI ecosystem. | **Full (100%).** Drops directly onto Vite's `dist/` output (`webDir: 'dist'`); same web code & Tailwind. | **Low.** Uses **Metro** bundler (Vite is not officially supported), React Native primitives (`<View>`, `<Text>`), and NativeWind instead of standard CSS. |
| **Windows Local Dev ($0)** | Full (`vite dev` + `vite build`, zero native SDKs). | **Android only** (Android Studio + SDK on Windows). **No local iOS builds** (requires macOS + Xcode). | Full JS/TS dev (`npx expo start` + Expo Go) + Android Studio/Gradle locally. **No local iOS Simulator/builds** (requires macOS). |
| **Physical Android Demo ($0)** | Open HTTPS URL in Chrome; optional 1-tap install (`beforeinstallprompt` -> WebAPK). | Build & sideload `.apk` locally via Android Studio ($0), or serve web/PWA build. | Scan QR in **Expo Go**, or build standalone `.apk` locally or via EAS Build Free (15 Android builds/mo). |
| **Physical iOS Demo from Windows ($0, no Mac)** | Open HTTPS URL in iOS Safari -> Share -> **Add to Home Screen** (standalone app chrome & icon). | **No native iOS binary possible** at $0 from Windows. Must fall back to iOS Safari / PWA build. | Scan QR in **Expo Go** only. **No standalone `.ipa`** — EAS Build for physical iOS devices requires $99/yr Apple Developer account. |
| **Standalone Home-Screen Icon on iOS ($0)** | **Yes** (manual Safari Share -> Add to Home Screen). | **Only via PWA fallback** (no native `.ipa`). | **No** (runs inside Expo Go app icon/wrapper at $0). |
| **Camera & Grocery Barcode Scanning (EAN-13 / UPC-A)** | `getUserMedia` + WASM decoder (`Sec-ant/barcode-detector` / `zxing-wasm`). Native `BarcodeDetector` is **unsupported on iOS Safari**. Good enough with text-search fallback; weaker in low light than native. | Native ML Kit / ZXing / Apple Vision via `@capacitor/barcode-scanner` (Android/iOS). **No web implementation** — requires a web scanner fallback if iOS runs as PWA. | **Strongest at $0.** `expo-camera` (`CameraView` / `launchScanner` using Google Code Scanner & iOS `DataScannerViewController`) supports `ean13`/`upc_a` and **works inside Expo Go** on both OSes. |
| **Offline Storage & Eviction Risk** | Workbox SW cache + IndexedDB. **Risk:** iOS Safari wipes script-writable storage after 7 days of browser use without site interaction; Home Screen web apps are isolated & support `storage.persist()`. | **Warning:** Capacitor docs advise against `localStorage`/IndexedDB in `WKWebView` due to OS eviction under disk pressure. Use `@capacitor/preferences` + `@capacitor-community/sqlite`. | **Strongest.** `expo-sqlite` provides durable native SQLite on device (no WebView eviction) and **works in Expo Go**. |
| **Push Notifications ($0 on Both OSes)** | **Yes (only option at $0 on iOS!).** W3C Web Push + VAPID works on Android Chrome and iOS 16.4+ **Home Screen web apps** via APNs with **no Apple Developer account**. | `@capacitor/push-notifications` uses FCM (Android, $0) and APNs (iOS — **requires $99/yr Apple Developer account**). | Local notifications work in Expo Go. **Remote push removed from Expo Go on Android (SDK 53+)** -> requires Dev Build + FCM; iOS remote push requires **$99/yr Apple Developer account**. |
| **Free-Tier Hosting / Distribution ($0)** | Static HTTPS hosting: **Cloudflare Pages** (unlimited static bandwidth, commercial allowed) or Vercel Hobby (100 GB/mo, non-commercial only). | Same web hosting for PWA fallback + manual Android `.apk` distribution. **Note:** Ionic Appflow stopped new sales Feb 2025 (EOL Dec 2027). | EAS Build Free (15 Android + 15 iOS builds/mo, low-priority queue) + EAS Update Free (1,000 MAUs) + Expo Go QR links. |
| **Path to Production (App Stores Later)** | Add Capacitor (`webDir: 'dist'`) or Google Play TWA (`Bubblewrap`) without rewriting UI. Must invest in native-like UX to pass **Apple Guideline 4.2**. | Already wrapped for Play Store ($25 + 12 testers / 14 days) & App Store ($99/yr + macOS/CI). Same **Apple Guideline 4.2** UX bar applies. | Cleanest native-feeling App Store & Play Store path (lowest Guideline 4.2 risk) + EAS Submit; optional web via Metro/Expo Web. |

---

## Detailed Findings Against Primary Sources

### 1. Alignment with a React + Vite Curriculum

- **React + Vite PWA (`vite-plugin-pwa`):** Vite compiles standard React + TypeScript + CSS (including Tailwind CSS v4 via `@tailwindcss/vite`) into static assets in `dist/` ([Vite Building for Production](https://vite.dev/guide/build.html)). Adding `vite-plugin-pwa` generates the Web App Manifest (`manifest.webmanifest`), Workbox Service Worker (`sw.js`), and registration script directly inside `vite.config.ts` with zero change to React component authoring ([vite-plugin-pwa Guide](https://vite-pwa-org.netlify.app/guide/)).
- **React + Vite + Capacitor:** Capacitor explicitly targets existing web builds. Pointing `webDir: "dist"` in `capacitor.config.ts` and running `npm run build && npx cap sync` copies the compiled Vite output into native `android/` and `ios/` wrapper shells ([Capacitor Getting Started](https://capacitorjs.com/docs/getting-started)). 100% of Vite, DOM HTML/CSS, Tailwind, and React web libraries remain valid.
- **React Native (Expo):** Expo **does not officially support Vite**; its universal bundler for Android, iOS, and Web is **Metro** (`expo.web.bundler: "metro"`), chosen for Hermes native bytecode pipelines and uniform cross-platform bundling ([Expo Web Workflow](https://docs.expo.dev/workflow/web/), [Customizing Metro](https://docs.expo.dev/guides/customizing-metro/)). UI is built with React Native primitives (`<View>`, `<Text>`, `<Pressable>`) rather than HTML/DOM. Using Tailwind requires **NativeWind**, which adds Metro/Babel CSS-interop configuration and only supports the React Native style subset. Standard web component kits (Radix, shadcn/ui, web DOM routing/charting) do not transfer directly.

---

### 2. Developing, Testing, and Demoing on Android & iOS from Windows ($0 Budget)

#### Platform Gatekeepers (Apple & Google Primary Policies)
Before comparing frameworks, two platform-level rules govern **all** native mobile builds regardless of tooling:

1. **Apple Developer Program ($99 USD/year):** Required for App Store publishing, TestFlight beta distribution (up to 100 internal and 10,000 external testers), Ad Hoc device provisioning (up to 100 devices/year), and native APNs push notification keys ([Apple Developer Program — How It Works](https://developer.apple.com/programs/how-it-works/), [Apple Support — Choosing a Membership](https://developer.apple.com/support/compare-memberships/)). A **free Apple ID ("Personal Team")** allows local Xcode builds to a USB-tethered personal iPhone **only on macOS**, expires every **7 days**, and prohibits TestFlight, Ad Hoc distribution, and native Push Notifications.
2. **Google Play Console ($25 USD one-time + mandatory closed testing):** Publishing on Google Play costs a one-time **$25 USD** registration fee ([Google Play Console Help — Get started](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en)). Furthermore, **new personal developer accounts** (created after November 13, 2023) must run a **closed test with at least 12 testers opted in continuously for at least 14 days** before applying for production access ([Google Play Console Help — App testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)). However, Android allows **sideloading `.apk` files directly at $0** with no Play Console account.

#### What Each Option Can Actually Do on Windows at $0

- **Option 1 — React + Vite PWA:**
  - **Dev & Test:** Standard browser DevTools + Vite dev server on Windows, deployed to HTTPS via free-tier static hosting.
  - **Android & iOS Demo:** Evaluators open one HTTPS URL on Android Chrome or iOS Safari and install PresyoCheck to their Home Screen on both OSes. **No Mac, no Apple Developer fee, no Google Play fee, no sideloading warnings, no wrapper app.**
- **Option 2 — React + Vite + Capacitor:**
  - **Android on Windows ($0):** Fully supported. Capacitor 8 requires Android Studio (which bundles the JDK and Android SDK; Capacitor 8 notes a minimum of Android Studio 2025.2.1) and produces sideloadable `.apk` files locally on Windows ([Capacitor Environment Setup](https://capacitorjs.com/docs/getting-started/environment-setup)).
  - **iOS on Windows ($0):** **Blocked for native binaries.** Capacitor's environment docs state explicitly: *"To build iOS apps, you will need macOS"* (plus Xcode and Xcode Command Line Tools) ([Capacitor Environment Setup](https://capacitorjs.com/docs/getting-started/environment-setup)).
  - **Critical ecosystem update on cloud builds:** Although Capacitor's environment page still mentions Ionic Appflow for iOS cloud builds, **Ionic officially stopped selling Appflow to new customers on February 11, 2025, with final End of Life on December 31, 2027** ([Ionic Official Announcement](https://ionic.io/blog/important-announcement-the-future-of-ionics-commercial-products)). While **GitHub Actions** provides macOS runners (free on public repositories; on private repositories, GitHub Free's 2,000 included minutes/month incur a **10x macOS multiplier** = ~200 macOS minutes/month) ([GitHub Actions Billing Docs](https://docs.github.com/en/billing/managing-billing-for-your-products/about-billing-for-github-actions)), cloud macOS compilation **still cannot sign an installable physical-device `.ipa` without a paid $99/yr Apple Developer account**.
  - **Practical result:** On Windows at $0, Capacitor delivers a native Android `.apk`, while iOS testers must use the underlying Vite web/PWA build in Safari.
- **Option 3 — React Native (Expo):**
  - **Quick Demo on Windows ($0):** **Expo Go** allows scanning a QR code from a Windows machine (`npx expo start`) to run on **both physical Android and physical iOS devices at $0** with no Mac and no Apple Developer account ([Expo Environment Setup](https://docs.expo.dev/get-started/set-up-your-environment/)).
  - **EAS Free Plan Limits ($0/month):** Includes **15 Android builds + 15 iOS builds per month** on a low-priority queue, **60 minutes** of CI/CD Workflows, App Store/Play Store submission, and **EAS Update for up to 1,000 MAUs** ([Expo Pricing](https://expo.dev/pricing)). Hosted cloud Simulators are **not** included in Free (requires the **Starter** plan at **$19/month**).
  - **Critical iOS Physical-Device Catch:** Per Expo's official EAS Build docs, building an `.ipa` for a **physical iOS device** (development build, Ad Hoc preview, or TestFlight) **requires a paid Apple Developer account ($99/yr)** ([EAS Build Setup](https://docs.expo.dev/build/setup/)). Free iOS EAS builds without an Apple Developer account only work for **iOS Simulator builds** (`"simulator": true`), which require a Mac locally ([EAS Build for iOS Simulators](https://docs.expo.dev/build-reference/simulators/)).
  - **Practical result:** On Windows at $0, Expo can produce a standalone Android `.apk` (local Gradle or EAS Build Free), but **iOS testing and demoing is strictly limited to Expo Go** — meaning no standalone PresyoCheck home-screen icon, no custom native modules/config plugins, and no custom app icon/splash screen on iOS.

---

### 3. Mobile Capabilities Relevant to PresyoCheck

#### A. Camera & Barcode Scanning (Philippine Grocery EAN-13 `480...` & UPC-A)
In Philippine supermarkets (SM Markets/Savemore, Puregold, Robinsons, Landers, Dali, Alfamart, 7-Eleven), most packaged SKUs carry 1D **EAN-13** or **UPC-A** barcodes.

- **PWA (Web):**
  - Camera streaming uses `navigator.mediaDevices.getUserMedia()`, which works on Android Chrome and iOS Safari (including standalone Home Screen PWAs) **only over HTTPS / `localhost`** and on a user gesture ([MDN `getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)). On iOS SPAs, streams must be explicitly stopped (`track.stop()`) on unmount/route changes to prevent stuck camera states.
  - **Key iOS gap:** The browser-native **`BarcodeDetector` API is NOT supported on Safari or any iOS browser** (all iOS browsers use WebKit) ([MDN `BarcodeDetector`](https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector)).
  - **Library choice matters:** The widely cited `mebjas/html5-qrcode` package has had **no release since v2.3.8 (April 2023)** and is effectively dormant ([`mebjas/html5-qrcode` GitHub](https://github.com/mebjas/html5-qrcode)). For a modern Vite PWA, use **[`Sec-ant/barcode-detector`](https://github.com/Sec-ant/barcode-detector)** — a spec-compliant `BarcodeDetector` ponyfill backed by `zxing-wasm` (ZXing-C++ compiled to WebAssembly) that uses native `BarcodeDetector` on Chrome Android and falls back to WASM on iOS Safari.
  - **Real-world trade-off:** Web 1D barcode scanning on iOS Safari works for clear, well-lit barcodes, but is noticeably less forgiving on small/curved/low-light grocery packaging than native scanners due to limited WebKit autofocus/macro/torch controls. Fast text/brand search should remain the primary lookup flow.
- **Capacitor:**
  - The official **`@capacitor/barcode-scanner`** plugin (Ionic/OutSystems) wraps Google ML Kit / ZXing on Android (requires `minSdkVersion = 26`) and Apple Vision on iOS (supports `EAN_13`/`UPC_A`, noting Apple Vision treats both interchangeably) ([Capacitor Barcode Scanner API](https://capacitorjs.com/docs/apis/barcode-scanner)).
  - **Caveat:** `@capacitor/barcode-scanner` is **Android and iOS native only** — it does not provide a web implementation. If iOS runs as a PWA during a Windows capstone, you still have to build the web `getUserMedia` + WASM scanner fallback. (By contrast, [`@capacitor/camera`](https://capacitorjs.com/docs/apis/camera) for still photos — e.g., shelf-tag or receipt capture — *does* support Web/PWA via [`@ionic/pwa-elements`](https://capacitorjs.com/docs/web/pwa-elements).)
- **Expo:**
  - **`expo-camera`** supports live barcode scanning (`CameraView` with `onBarcodeScanned`) and native OS modal scanning (`CameraView.launchScanner()`, backed by Google Code Scanner on Android and Apple's `DataScannerViewController` on iOS 16+), explicitly supporting `ean13`, `ean8`, `upc_a`, `upc_e`, and `qr` ([Expo Camera Docs](https://docs.expo.dev/versions/latest/sdk/camera/)).
  - Crucially, `expo-camera` is **pre-bundled in Expo Go**, making Expo the strongest out-of-the-box native barcode scanner on both Android and iOS at $0.

#### B. Offline Storage & Caching (Weak Indoor Supermarket Signal)
Philippine grocery shoppers often encounter dead cellular zones inside concrete supermarkets/malls, making cached shopping lists and recently viewed price comparisons important.

- **PWA (Web):**
  - `vite-plugin-pwa` uses Workbox to precache the app shell and configure runtime caching for API responses ([vite-plugin-pwa Guide](https://vite-pwa-org.netlify.app/guide/)). Structured offline data (shopping lists, cached SKU comparisons) lives in **IndexedDB**.
  - **iOS Safari / WebKit Storage Rules (Primary Policy):**
    - Under Intelligent Tracking Prevention (ITP), WebKit enforces a **7-day cap on script-writable storage** (`localStorage`, `IndexedDB`, `Cache API`, Service Worker registrations) if a website in regular Safari receives no user interaction for **7 days of Safari browser use** ([WebKit — Full Third-Party Cookie Blocking and More](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)).
    - **Home Screen Web App exemption:** Web apps added to the iOS Home Screen operate with an **isolated usage counter** separate from Safari; WebKit explicitly states that first-party data for actively used Home Screen web apps is not expected to be purged under Safari's ITP rule ([WebKit — Full Third-Party Cookie Blocking and More](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)).
    - **Safari 17+ Quotas & Persistence:** Starting in Safari 17 / iOS 17, WebKit raised per-origin quota to **up to 60% of total disk space** for browser apps (vs. **15%** for non-browser WebKit apps like Capacitor's `WKWebView`) and supports `navigator.storage.persist()` using Home Screen installation as a persistence heuristic ([WebKit — Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/)).
  - **Design implication:** Treat IndexedDB/SW cache as an **offline cache synced to a backend database** (or user-exportable), never as the sole unbacked source of truth for shoppers who use regular Safari without installing to Home Screen.
- **Capacitor:**
  - Capacitor's official Storage Guide explicitly warns **not** to rely on `localStorage` or `IndexedDB` inside `WKWebView` for critical state, because iOS can evict WebView storage under disk pressure ([Capacitor Storage Guide](https://capacitorjs.com/docs/guides/storage)).
  - Recommended durable native stack: [`@capacitor/preferences`](https://capacitorjs.com/docs/apis/preferences) (`UserDefaults` / `SharedPreferences`) for small key-value settings/session state, and SQLite (e.g., `@capacitor-community/sqlite`) for relational/offline datasets ([Capacitor Storage Guide](https://capacitorjs.com/docs/guides/storage)).
- **Expo:**
  - [`expo-sqlite`](https://docs.expo.dev/versions/latest/sdk/sqlite/) provides a full native SQLite database file on device immune to browser/WebView eviction, and is included directly in **Expo Go**.

#### C. Home-Screen / App Install UX
- **PWA (Web):**
  - **Android Chrome:** Fires the `beforeinstallprompt` event, letting PresyoCheck render a custom in-app "Install App" banner/button that installs a full-screen WebAPK to the Android home screen and app drawer ([MDN `beforeinstallprompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event)).
  - **iOS Safari:** **Does NOT support `beforeinstallprompt`** ([MDN `beforeinstallprompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event)). Users must tap Safari's Share icon -> **"Add to Home Screen"**. Mitigation: detect iOS Safari non-standalone mode (`!window.navigator.standalone`) and show a dismissible 2-step visual hint. Once added, PresyoCheck gets its own Home Screen icon and standalone full-screen UI at $0.
- **Capacitor:** Sideloaded Android `.apk` installs as a native icon (requires enabling "Install unknown apps" on Android during capstone). On Windows + $0, iOS falls back to manual PWA Add to Home Screen.
- **Expo:** Standalone `.apk` on Android; **no standalone Home Screen icon on iOS at $0** (users launch inside Expo Go).

#### D. Push Notifications (Deal / Price-Drop Alerts)
- **PWA (Web):**
  - **Only path that supports real remote push notifications on BOTH Android and iOS at $0.**
  - Since **iOS / iPadOS 16.4**, WebKit supports standard W3C Web Push (Push API + Notifications API + Service Workers + VAPID) for **Home Screen web apps**, routed through Apple's APNs **without requiring an Apple Developer Program membership** ([WebKit — Web Push for Web Apps on iOS and iPadOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)). Requirements: app must be added to the Home Screen with `display: "standalone"` or `"fullscreen"`, and `Notification.requestPermission()` must be triggered by a user gesture.
- **Capacitor:**
  - [`@capacitor/push-notifications`](https://capacitorjs.com/docs/apis/push-notifications) uses FCM on Android ($0) and native APNs on iOS — which **requires a paid $99/yr Apple Developer account** and Xcode capabilities configuration.
- **Expo:**
  - Per official [`expo-notifications`](https://docs.expo.dev/versions/latest/sdk/notifications/) docs: **"Push notifications (remote notifications) functionality provided by `expo-notifications` is unavailable in Expo Go on Android from SDK 53. A development build is required to use push notifications. Local notifications (in-app notifications) remain available in Expo Go."**
  - Remote push on Android therefore requires leaving Expo Go for a Development Build + FCM v1 credentials, and remote push on iOS requires a Development/Production build + **$99/yr Apple Developer account** for APNs keys.

---

### 4. Free-Tier Hosting & Distribution Paths ($0 Capstone -> Production)

| Distribution Channel | Cost & Gatekeepers | Best Fit |
| :--- | :--- | :--- |
| **Cloudflare Pages (Free)** | **$0.** Unlimited static bandwidth & requests, 500 builds/month, 25 MiB max file size, automatic HTTPS, **commercial use permitted** ([Cloudflare Pages Limits](https://developers.cloudflare.com/pages/platform/limits/)). | **Best $0 production-capable host** for React + Vite PWA. |
| **Vercel Hobby (Free)** | **$0.** 100 GB Fast Data Transfer/month, hard-paused if exceeded, **strictly non-commercial / personal use only** ([Vercel Hobby Plan](https://vercel.com/docs/plans/hobby)). | Fine for private capstone prototype; must upgrade ($20/mo Pro) or move if PresyoCheck ever commercializes. |
| **Android APK Sideload** | **$0.** Local Android Studio (Capacitor / RN) or EAS Build Free (15 Android builds/mo). | Optional capstone deliverable for Android testers. |
| **Google Play Store (TWA via Bubblewrap, Capacitor, or Expo)** | **$25 one-time** + **12 opted-in closed testers for 14 continuous days** for new personal accounts ([Play Console Help](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)). | Post-capstone Android production launch. PWAs can ship via [Bubblewrap / Trusted Web Activity (TWA)](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start) using `/.well-known/assetlinks.json`, or via Capacitor for native plugins. |
| **Apple App Store / TestFlight** | **$99/year** + macOS/CI build + App Review (including **Guideline 4.2 Minimum Functionality**). | Post-capstone iOS native launch once revenue/funding justifies annual membership. |

---

### 5. Path to Production: PWA -> Capacitor vs. Starting with Expo

#### Path A: Start with React + Vite PWA -> Wrap with Capacitor (or TWA) Later
- **Migration mechanics:** Zero rewrite of React components, state, routing, or Tailwind styles. Install `@capacitor/core` and `@capacitor/cli`, configure `webDir: 'dist'`, run `npx cap add android` / `npx cap add ios`, and swap thin adapter implementations (e.g., `scanner.ts` switching from `barcode-detector` WASM to `@capacitor/barcode-scanner`; `storage.ts` adding SQLite; `notifications.ts` adding `@capacitor/push-notifications`) using `Capacitor.isNativePlatform()`. The exact same Vite repository continues deploying as a web app + PWA simultaneously.
- **Google Play shortcut:** If native plugins aren't even needed on Android, Chrome Labs' **Bubblewrap** packages the live HTTPS PWA directly into a Play Store `.aab` via **Trusted Web Activity (TWA)** ([Chrome for Developers — TWA Quick Start](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start)).
- **Key production risk — Apple App Review Guideline 4.2 (Minimum Functionality):** Apple's App Review Guidelines state: *"Your app should include features, content, and UI that elevate it beyond a repackaged website. If your app is not particularly useful, unique, or 'app-like,' it doesn't belong on the App Store."* ([Apple App Review Guidelines §4.2](https://developer.apple.com/app-store/review/guidelines/)). A Capacitor app that simply frames a desktop-style website is routinely rejected under 4.2. To pass later, PresyoCheck must feel genuinely mobile-native from day 1 (bottom navigation, touch-first gestures, offline shopping list utility, native barcode scanner / haptics when wrapped).

#### Path B: Start with React Native (Expo)
- **Migration mechanics:** Zero framework migration later if PresyoCheck's end-state is a native-first consumer mobile app in both app stores. Native navigation transitions, gestures, `expo-camera`, and `expo-sqlite` naturally clear Apple's Guideline 4.2 bar, and EAS Build + EAS Submit automate store releases once $99/yr + $25 store accounts are purchased.
- **Upfront capstone cost:** Leaves Vite and standard web React behind on day 1, adds Metro/NativeWind/RN ecosystem friction inside a React + Vite capstone timeline, and degrades the $0 iOS capstone demo experience (Expo Go wrapper instead of a standalone PresyoCheck Home Screen icon).

---

## Architectural Guardrails for PresyoCheck (If Choosing Option 1: React + Vite PWA)

To preserve a clean, low-regret upgrade path to Capacitor (Option 2) while maximizing v1 mobile quality:

1. **Isolate device APIs behind thin adapters:** Place barcode scanning (`scanner`), offline persistence (`storage`), and push notifications (`notifications`) behind narrow TypeScript interfaces so web implementations (`barcode-detector` + `zxing-wasm`, IndexedDB, Web Push) can later branch to Capacitor native plugins via `Capacitor.isNativePlatform()` without touching UI components.
2. **Design "app-like" mobile UI from day 1:** Use mobile-first viewport handling (`100dvh`, `env(safe-area-inset-*)`), bottom tab navigation, fast skeleton/optimistic states, and offline-resilient shopping list views. This delivers strong PWA UX now *and* protects against Apple Guideline 4.2 rejection if wrapped in Capacitor later.
3. **Never rely on browser IndexedDB as the sole unbacked store:** Sync user shopping lists / saved stores to the backend (with IndexedDB + Service Worker as an offline-first cache/queue) to neutralize iOS Safari's 7-day non-Home-Screen storage eviction.
4. **Ship an explicit iOS "Add to Home Screen" guide:** Pair Android's `beforeinstallprompt` button with a small iOS Safari instruction prompt (Share -> Add to Home Screen) so iOS shoppers unlock standalone chrome, isolated storage persistence, and $0 iOS Web Push.
5. **Host on Cloudflare Pages (Free):** Gives automatic HTTPS (mandatory for Service Workers, `getUserMedia`, and Web Push), unlimited static bandwidth, and no non-commercial license cliff when transitioning toward production.

---

## Primary Sources

- **Vite & PWA**
  - Vite — Building for Production: https://vite.dev/guide/build.html
  - `vite-plugin-pwa` — Official Guide: https://vite-pwa-org.netlify.app/guide/
  - MDN — `BarcodeDetector` API: https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector
  - MDN — `Window: beforeinstallprompt` Event: https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event
  - MDN — `MediaDevices.getUserMedia()`: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  - WebKit Blog — *Web Push for Web Apps on iOS and iPadOS* (iOS 16.4+): https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
  - WebKit Blog — *Updates to Storage Policy* (Safari 17+ quotas & `persist()`): https://webkit.org/blog/14403/updates-to-storage-policy/
  - WebKit Blog — *Full Third-Party Cookie Blocking and More* (7-day cap & Home Screen web app exemption): https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
  - `Sec-ant/barcode-detector` (ZXing-WASM ponyfill): https://github.com/Sec-ant/barcode-detector
  - `mebjas/html5-qrcode` (last release v2.3.8, Apr 2023): https://github.com/mebjas/html5-qrcode
- **Ionic Capacitor**
  - Capacitor — Getting Started (`webDir: 'dist'`): https://capacitorjs.com/docs/getting-started
  - Capacitor — Environment Setup (iOS macOS/Xcode & Android Studio): https://capacitorjs.com/docs/getting-started/environment-setup
  - Capacitor — Data Storage Guide (`WKWebView` eviction, Preferences, SQLite): https://capacitorjs.com/docs/guides/storage
  - Capacitor — `@capacitor/preferences` API: https://capacitorjs.com/docs/apis/preferences
  - Capacitor — `@capacitor/barcode-scanner` API: https://capacitorjs.com/docs/apis/barcode-scanner
  - Capacitor — `@capacitor/camera` API: https://capacitorjs.com/docs/apis/camera
  - Capacitor — PWA Elements (`@ionic/pwa-elements`): https://capacitorjs.com/docs/web/pwa-elements
  - Capacitor — `@capacitor/push-notifications` API: https://capacitorjs.com/docs/apis/push-notifications
  - Ionic Blog — *Important Announcement: The Future of Ionic's Commercial Products* (Appflow sunset/EOL): https://ionic.io/blog/important-announcement-the-future-of-ionics-commercial-products
- **React Native & Expo**
  - Expo — Developing for Web (Metro bundler): https://docs.expo.dev/workflow/web/
  - Expo — Customizing Metro: https://docs.expo.dev/guides/customizing-metro/
  - Expo — Set Up Your Environment (Expo Go vs Development Builds): https://docs.expo.dev/get-started/set-up-your-environment/
  - Expo — EAS Build Introduction & Setup (Apple Developer account requirement): https://docs.expo.dev/build/setup/
  - Expo — Building for iOS Simulators (`"simulator": true`): https://docs.expo.dev/build-reference/simulators/
  - Expo — `expo-camera` SDK Docs (barcode scanning & `launchScanner`): https://docs.expo.dev/versions/latest/sdk/camera/
  - Expo — `expo-notifications` SDK Docs (SDK 53+ Expo Go Android push removal): https://docs.expo.dev/versions/latest/sdk/notifications/
  - Expo — `expo-sqlite` SDK Docs: https://docs.expo.dev/versions/latest/sdk/sqlite/
  - Expo — Pricing (EAS Free & Starter Plans): https://expo.dev/pricing
- **App Stores, Hosting & CI**
  - Apple Developer Program — How It Works ($99/yr, TestFlight): https://developer.apple.com/programs/how-it-works/
  - Apple Developer Support — Choosing a Membership: https://developer.apple.com/support/compare-memberships/
  - Apple App Review Guidelines (§4.2 Minimum Functionality): https://developer.apple.com/app-store/review/guidelines/
  - Google Play Console Help — Get Started ($25 fee): https://support.google.com/googleplay/android-developer/answer/6112435?hl=en
  - Google Play Console Help — App Testing Requirements for New Personal Accounts (12 testers / 14 days): https://support.google.com/googleplay/android-developer/answer/14151465?hl=en
  - Chrome for Developers — Trusted Web Activity (TWA) & Bubblewrap Quick Start: https://developer.chrome.com/docs/android/trusted-web-activity/quick-start
  - Cloudflare Pages — Limits (Free tier): https://developers.cloudflare.com/pages/platform/limits/
  - Vercel — Hobby Plan (Free tier & non-commercial terms): https://vercel.com/docs/plans/hobby
  - GitHub Docs — About Billing for GitHub Actions (macOS 10x multiplier & public repo allowance): https://docs.github.com/en/billing/managing-billing-for-your-products/about-billing-for-github-actions
