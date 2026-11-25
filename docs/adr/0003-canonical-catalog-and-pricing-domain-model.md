---
status: accepted
---

# Canonical Catalog, Substitute Matching, and Pricing Domain Model

PresyoCheck v1 models its ~80–120 Hero **Products** and ~250–350 **Price Observations** using a flat SKU-to-**Substitute Group** hierarchy, uniform per-group **Unit Price** normalization, append-only **Price Observations**, and chain-default **Membership Gates** with per-observation override support.

## Context

[Choose v1 retail chains and price-data sourcing strategy](https://github.com/Wynteriall/presyo-check/issues/6) and [Decide MVP feature set and core mobile user journeys](https://github.com/Wynteriall/presyo-check/issues/8) locked a Curator-maintained Sheet/CSV + mobile Store-Aisle Checklist workflow across 5 **Retail Chains** (**SM Markets**, **Puregold**, **Dali**, **Landers**, **S&R**) under **Location-Aware 3-Tier Lookup** (`Mega Manila` active in v1), `>14d` staleness warnings, **Unit Price** (`₱/100g`, `₱/100mL`, `₱/pc`) vs. **Shelf Price** comparison, and **Substitute Group** matching. Issue [#9](https://github.com/Wynteriall/presyo-check/issues/9) settles the canonical entity relationships and invariants before backend/storage architecture ([#10](https://github.com/Wynteriall/presyo-check/issues/10)).

## Canonical Entities & Invariants

### 1. Product & Substitute Group
- **`SubstituteGroup`**: `id`, `slug`, `name` (e.g., `"Chocolate Spread"`, `"Cooking Oil (1L)"`), `category` (for quick-browse chips), `measure_type` (`weight` | `volume` | `count`), `base_unit_label` (`₱/100g` | `₱/100mL` | `₱/pc`).
  - *Invariant*: Every **Substitute Group** enforces a single `measure_type` across all member **Products** so **Unit Price** comparisons are always apples-to-apples.
- **`Product`** (flat SKU): `id`, `substitute_group_id` (FK, required), `brand`, `name`, `variant`, `net_quantity` (numeric total in grams, mL, or pieces for the sellable pack, e.g., `350` for 350g or `360` for `6 x 60g`), `measure_type` (must match parent `SubstituteGroup.measure_type`), `pack_label` (display string e.g. `"350g jar"`, `"6 x 60g"`, `"12 pcs"`), `dti_srp_price` (optional numeric PHP), `dti_srp_updated_at` (optional date), `is_active` (boolean).
  - *Unit Price calculation*:
    - `weight`: `(shelf_price / net_quantity) * 100` → `₱/100g`
    - `volume`: `(shelf_price / net_quantity) * 100` → `₱/100mL`
    - `count`: `shelf_price / net_quantity` → `₱/pc`
  - *Multi-packs*: Multi-packs use total pack quantity (`6 x 60g` → `360g`) unless the group is `count`-based (e.g., eggs `12 pcs`, tissue `4 rolls`).

### 2. Geography, Retail Chains & Store Branches
- **`PricingZone`**: `id` (`mega-manila` active in v1), `name` (`Mega Manila`), `is_active`.
- **`RetailChain`**: `id` (`sm-markets`, `puregold`, `dali`, `landers`, `snr`), `name`, `default_membership_gate` (`none` | `landers_club` | `snr_club`).
- **`StoreBranch`**: `id`, `retail_chain_id`, `pricing_zone_id`, `name` (e.g., `"Savemore Imus"`, `"Puregold Shaw Blvd"`), `city_municipality` (searchable city/municipality string), `is_active`.

### 3. Price Observation & Price Flag (Append-Only)
- **`PriceObservation`**: `id`, `product_id`, `retail_chain_id`, `store_branch_id` (nullable; null = chain-wide **Pricing Zone** baseline), `pricing_zone_id`, `shelf_price` (numeric PHP, `> 0`), `membership_gate` (nullable; null inherits `RetailChain.default_membership_gate`), `source` (`curator_sheet` | `curator_aisle` | `curator_url`), `reference_url` (optional URL for Curator quick-refresh), `observed_at` (timestamp), `status` (`active` | `archived`).
  - *Live Price Resolution (Location-Aware 3-Tier Lookup)*:
    1. **Tier 1 (Branch)**: Latest `active` **Price Observation** matching `(product_id, retail_chain_id, store_branch_id)` for a **Store Branch** in the Shopper's selected city/municipality.
    2. **Tier 2 (Zone Baseline)**: Latest `active` **Price Observation** matching `(product_id, retail_chain_id, pricing_zone_id)` (preferring `store_branch_id IS NULL`, or latest verified branch observation rolled up to `Mega Manila`).
    3. **Tier 3 (Out-of-Zone Reference)**: When the Shopper's selected city is outside active **Pricing Zones**, resolve against `Mega Manila` baseline and surface an out-of-zone reference banner.
  - *Staleness*: `observed_at` older than 14 days triggers the `>14d` staleness badge without hiding the observation.
  - *Post-v1 extensibility*: `membership_gate`, `pricing_zone_id`, and `source` allow adding SMAC/Perks member-only prices, **Effective Unit Price** promo fields, provincial **Pricing Zones**, and moderated crowdsourcing without schema breaking changes.
- **`PriceFlag`**: `id`, `price_observation_id`, `reason` (`wrong_price` | `out_of_stock` | `other`), `note` (optional), `created_at`, `resolved_at` (nullable), `resolution` (nullable).
  - *Invariant*: Submitting a **Price Flag** never auto-modifies or hides the live **Price Observation**; it queues the observation for **Curator** verification.

### 4. Local-First Shopper Entities
- **`ShoppingListItem`** (persisted locally on Shopper device in v1): `id`, `target_type` (`product` | `substitute_group`), `target_id`, `quantity` (integer `>= 1`), `checked` (boolean).
- **`BasketComparison`** (computed client-side): Evaluates the **Shopping List** against live **Price Observations** filtered by active **Membership Gate** toggles and `allow_substitutes` mode (`Exact Brands` vs. `Best Value (Allow Substitutes)`), returning coverage (`X/Y items`), best 1-stop **Retail Chain**, and best practical 2-store split.

## Consequences

- **1-row-per-SKU CSV/Sheet simplicity**: Curators maintain flat **Product** rows and **Price Observations** without managing complex many-to-many variant tables.
- **Guaranteed apples-to-apples Unit Prices**: Enforcing `measure_type` on `SubstituteGroup` eliminates mixed-unit comparison bugs in UI cards and **Basket Comparison**.
- **Auditability & zero-flicker flagging**: Append-only **Price Observations** preserve price provenance and allow Shoppers to flag stale prices safely.
