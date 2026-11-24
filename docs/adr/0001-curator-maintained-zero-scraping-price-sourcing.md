---
status: accepted
---

# Curator-Maintained, Zero-Scraping Price Sourcing for v1

PresyoCheck v1 sources walk-in grocery prices strictly through a **Curator**-maintained, zero-scraping, zero-AI, zero-OCR workflow (~80–120 Hero SKUs across 5 **Retail Chains** via Google Sheet/CSV sync, saved product `reference_url` checks, and a mobile Store-Aisle Checklist) rather than automated web scraping, delivery-aggregator feeds, receipt OCR, or open public crowdsourcing.

## Context

Primary-source verification in [Research Philippine grocery price and promo data sources](https://github.com/Wynteriall/presyo-check/issues/3) established that no major Philippine grocery chain provides a public pricing API: Puregold (app-only), Robinsons (web storefronts discontinued), Dali, and Alfamart lack first-party retail web catalogs; SM Markets, Landers, and S&R sit behind Cloudflare/SPA selectors with explicit `robots.txt` or Terms-of-Service anti-scraping prohibitions; and delivery aggregators (GrabMart, Foodpanda, MetroMart, Pickaroo) enforce hard WAF/ToS blocks while carrying 15%–33% commission markups that distort walk-in **Shelf Prices**. Open Food Facts Philippine data (~9,490 items) also exhibits corrupted pack-size units and `503` anonymous load-shedding.

## Considered Options

- **Automated web scraping / aggregator feeds**: Rejected due to explicit ToS/`robots.txt` violations, brittle Cloudflare/SPA breakage on a `$0` budget, missing offline-first chains, and 15%–33% delivery markup distortion.
- **Open public crowdsourcing + receipt OCR / barcode scanning + AI flyer parsing**: Rejected for v1 to avoid moderation/spam overhead, thermal-receipt OCR complexity, barcode-scanner friction, and AI API/hallucination risk while keeping solo capstone and early-production upkeep fast.
- **Curator-maintained fast-refresh workflow (chosen)**: Trims v1 to 5 high-contrast chains (**SM Markets**, **Puregold**, **Dali**, **Landers**, **S&R**), enforces **Strict Walk-In Shelf Only** purity, defers **Store Deals / weekly promos** to post-v1, keeps **DTI SRP** strictly as an optional reference badge and CSV typo guardrail, skips Open Food Facts, and gives **Shoppers** a lightweight *"Flag outdated price"* button to prioritize curator refreshes.

## Consequences

- **High accuracy and `$0` sustainability**: Every **Price Observation** reflects verified walk-in pricing with clear **Store Branch** provenance and zero third-party API breakage.
- **Bounded catalog size**: v1 intentionally targets ~80–120 high-impact Hero SKUs (~250–350 price rows) rather than thousands of unmaintained SKUs so rolling 5–10 minute refreshes keep prices within the 14-day freshness window.
- **Clean post-v1 expansion path**: Storing `source`, `pricing_zone`, and `store_branch` on every **Price Observation** allows adding new **Pricing Zones** (e.g., Cebu, Davao), deferred chains (Alfamart, Robinsons), **Store Deals**, or moderated crowdsourcing post-v1 without schema redesign.
