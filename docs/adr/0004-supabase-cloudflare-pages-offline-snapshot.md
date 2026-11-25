---
status: accepted
---

# Supabase Free Tier, Cloudflare Pages, and Offline-First Catalog Snapshot

PresyoCheck v1 runs on **Cloudflare Pages** (React + Vite PWA) backed by **Supabase Free Tier** (PostgreSQL + Row-Level Security + Curator Auth), downloading the compact ~80–120 Hero **Product** catalog snapshot into IndexedDB for 100% offline-capable client-side search, **Basket Comparison**, and queued **Price Flags** / **Curator** aisle updates.

## Context

[ADR-0001](0001-curator-maintained-zero-scraping-price-sourcing.md) bounds v1 to ~80–120 Hero **Products** (~250–350 active **Price Observations**) with zero scraping, [ADR-0002](0002-react-vite-pwa-for-mobile.md) locks a `$0` React + Vite mobile-first PWA (`vite-plugin-pwa`, `registerType: 'prompt'`) with thin `src/platform/` adapters, and [ADR-0003](0003-canonical-catalog-and-pricing-domain-model.md) defines the canonical domain entities. Issue [#10](https://github.com/Wynteriall/presyo-check/issues/10) settles the `$0` hosting, database, offline sync, and **Curator** ingestion architecture.

## Architecture Decisions

1. **Database & Auth — Supabase Free Tier (PostgreSQL + RLS)**:
   - Stores `pricing_zones`, `retail_chains`, `store_branches`, `substitute_groups`, `products`, `price_observations`, and `price_flags`.
   - **Row-Level Security (RLS)**:
     - Anonymous **Shoppers**: `SELECT` on catalog/branch/observation tables; `INSERT`-only on `price_flags` (cannot modify or hide live `price_observations`).
     - Authenticated **Curators** (Supabase Auth email/password or magic link for `/curator`): `INSERT`/`UPDATE` on catalog, `price_observations`, and `price_flags` resolution.
   - *Operational note*: Supabase Free Tier pauses after 7 days of inactivity; keep a lightweight health-check ping or wake the project prior to capstone demos.

2. **Frontend Hosting — Cloudflare Pages**:
   - Hosts the static React + Vite PWA bundle with unlimited free-tier bandwidth, automatic HTTPS (required for Service Workers and Geolocation), and GitHub branch/PR preview deploys.

3. **Client-Side Caching, Search & Basket Comparison**:
   - Because the full v1 catalog snapshot is `<100 KB` JSON, the PWA fetches the active catalog snapshot on load and persists it in **IndexedDB** (via `src/platform/storage` + TanStack Query / `idb-keyval`) with stale-while-revalidate background refresh.
   - **Search & Substitute Matching**: Instant client-side normalized token/fuzzy search over `Product` (`brand`, `name`, `variant`) and `SubstituteGroup` (`name`, `category`) — zero network latency and 100% functional inside low-signal supermarket aisles.
   - **Basket Comparison**: Computed deterministically client-side over the cached snapshot using the **Shopper**'s active **Membership Gate** toggles, `allow_substitutes` mode, and Location-Aware 3-Tier Lookup.

4. **Curator Sheet/CSV Sync & Offline Mutation Queue**:
   - **In-app `/curator` CSV & Google Sheet Sync**: **Curators** upload a CSV or fetch a published Google Sheet CSV URL inside `/curator`, previewing diffs and **DTI SRP** typo guardrails (e.g., flagging `Shelf Price` deviating >50% from **DTI SRP**) before batch-inserting new `price_observations` to Supabase.
   - **Offline Queue**: Shopper **Price Flags** and **Curator** mobile Store-Aisle Checklist observations are queued in IndexedDB when offline and automatically flushed to Supabase once connectivity returns.

## Consequences

- **True `$0` production-capable stack**: Zero custom backend servers to maintain, zero bandwidth caps on Cloudflare Pages, and native SQL relational integrity in Supabase.
- **Zero-lag in-aisle UX**: **Shoppers** experience instant search, **Unit Price** toggling, and **Basket Comparison** even in basement/concrete supermarkets with no signal.
- **Clean post-v1 upgrade path**: Adding **Shopper** accounts for cloud-synced **Shopping Lists**, **Store Deals**, or moderated crowdsourcing later uses the same Supabase project and RLS model without re-architecting the frontend.
