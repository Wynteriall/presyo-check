# Philippine Grocery Shoppers, Pain Points, and Competitor Audit

> **Ticket**: [`Wynteriall/presyo-check#2`](https://github.com/Wynteriall/presyo-check/issues/2) (Part of Map [`#1`](https://github.com/Wynteriall/presyo-check/issues/1))  
> **Scope**: Primary-source research on Philippine grocery shopper segments, recurring multi-chain price-comparison pain points, Philippine and international competitor apps, retention vs. failure mechanics, and concrete opportunity gaps for **PresyoCheck**.

---

## 1. Executive Summary & Philippine Macro Context

Filipino households operate under sustained food-budget pressure inside one of Southeast Asia's most fragmented grocery landscapes, yet no mainstream consumer app cleanly unifies **cross-chain prices, cross-brand/private-label substitutes, unit-price math, and loyalty/promo mechanics** in a single mobile-first shopping companion.

### Key Market Realities (Primary Sources)

| Indicator | Verified Figure / Fact | Primary Source |
| :--- | :--- | :--- |
| **Average Annual Family Income & Expenditure** | **₱353,230** income (+15.0% vs. 2021) / **₱258,050** expenditure (+12.8% vs. 2021) | PSA 2023 Family Income and Expenditure Survey (FIES) |
| **Food Share of Household Spending** | Single largest expenditure category: **~38%–41%** national aggregate; **57%+** among the bottom 30% income group | PSA FIES / PIDS household expenditure analyses |
| **Modern Grocery Oligopoly + Fragmentation** | Top 3 conglomerates (**SM Markets**, **Puregold/S&R**, **Robinsons Retail**) control ~50% of modern grocery retail, while traditional *sari-sari* trade still holds ~39%–41% of FMCG value | USDA FAS GAIN *Retail Foods Philippines* (2023–2025); Worldpanel by Kantar |
| **Channel Explosion (2024–2025 Footprints)** | **Puregold**: 680 stores + 33 S&R warehouses; **SM Markets**: 350+ supermarkets/hypermarkets/Savemore + **2,300–2,400+ Alfamart**; **Robinsons Food**: 761–799 stores (~151–157 Robinsons Supermarket, ~159 Easymart, ~38 The Marketplace, Shopwise); **Landers**: 16 warehouses; **Dali**: **1,181–1,300+** stores; **O!Save**: **750** stores; **7-Eleven**: **4,130–4,500+** stores | Corporate disclosures (Puregold, RRHI, PSC/7-Eleven, SM/Alfamart, Dali, O!Save) |
| **Private-Label Expansion** | **7%–10%** of PH grocery F&B sales (~US$900M sector, above the ~6% APAC average) and rising as stigma dissolves | USDA FAS GAIN *Private Label Philippines*; NielsenIQ 2025 Global Outlook |
| **Core Shopping Shift** | "Spending-control mode": **more frequent trips, smaller baskets**, aggressive downtrading to private labels/discounters, and dual payday (*kinsenas*/*katapusan*) bulk vs. mid-cycle *tingi* (sachet) buying | Worldpanel by Kantar & NielsenIQ PH (2024–2025) |
| **Mobile Ecosystem** | **97.5M** internet users (83.8% penetration), **142M** cellular connections (98.2% broadband); **85%–86% Android vs. 13%–14% iOS** | DataReportal *Digital 2025: The Philippines*; Statcounter |

**Implication for PresyoCheck**: A Philippine grocery comparator cannot be designed like a Western desktop-first or single-supermarket clone. It must be **Android-optimized**, tolerant of poor in-store mobile signal, built around **multi-format channel switching** (supermarkets + discounters + warehouse clubs + convenience minimarts), and native to **private-label swaps and unit-price normalization**.

---

## 2. Philippine Grocery Shopper Segments

Combining Kantar/NielsenIQ consumer-panel findings, PSA FIES income dynamics, corporate loyalty data, and recurring self-reported budgets and shopping routines across Philippine consumer communities (`r/Philippines`, `r/adultingph`, `r/FrugalPH`, `r/phinvest`, `r/SoloLivingPH`), four distinct retail-chain shopper segments emerge:

| Segment | Typical Monthly Grocery Spend | Shopping Cadence | Primary Retail Channel Mix | Core Decision Trigger | Highest-Leverage PresyoCheck Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Budget-Conscious Household / Family Managers** | ₱8,000–₱20,000+ (family of 3–6) | Major restocks on **15th & 30th (*kinsenas* / *katapusan*)** + weekly fresh fill-ins | Puregold, SM Supermarket / Savemore, Robinsons, Dali/O!Save (+ *palengke* outside v1) | Stretching fixed payday cash across maximum household volume | Payday basket planning, exact vs. private-label unit-price swaps, loyalty-card promo tracking |
| **2. Solo Young Professionals & Condo Renters** | ₱4,000–₱8,000 | Weekly or bi-weekly planned runs + frequent convenience fill-ins | SM / Savemore, Robinsons / The Marketplace, Dali, Alfamart / 7-Eleven (emergency), MetroMart / Pickaroo | Time scarcity, tiny fridge/pantry storage, avoiding spoilage & condo-floor convenience markups | Fast search/price check, right-sized pack unit-price comparison (avoiding bulk waste AND convenience tax) |
| **3. College Students & Dormers** | ₱2,000–₱3,500 | Weekly allowance cycles + 2–3x/week micro-trips | Dali, Alfamart, 7-Eleven, nearby Savemore / Puregold Jr. | Hard weekly peso ceiling; minimal/no cooking gear; testing unfamiliar budget brands | Ultra-budget brand/dupe discovery (e.g., Dali GoNutt, SM Bonus), sachet vs. small-pack unit-price reality checks, roommate split lists |
| **4. Bulk, Membership & *Sulit* Value Hunters** | ₱8,000–₱25,000+ (large families, *pasabuy*/splitters, micro-food operators) | Bi-weekly/monthly warehouse runs + event-driven sale strikes | Landers, S&R, Puregold (Perks / TNAP), `dalidash.ph` case orders | Maximizing per-unit ROI, amortizing ₱700/yr club fees, catching B1T1 / Piso Sale / Crazy Sale | Effective unit price during B1T1/promos, membership-gated price visibility, cross-chain arbitrage (club vs. supermarket vs. discounter) |

### Segment Deep-Dives

#### 1. Budget-Conscious Household / Family Managers
- **Behavioral Pattern**: Directly reflects Kantar/NielsenIQ's **payday cycle** — heavy supermarket/hypermarket baskets immediately after the 15th and 30th (*sweldo*), followed by smaller proximity fill-in trips as cash tightens mid-cycle.
- **Shopping Habits**: Frequently carry multiple loyalty cards (SMAC, Go Rewards, Puregold Perks), monitor Facebook pages/Viber groups for weekend promos, and routinely split dry goods (Puregold/Dali) from fresh goods/variety (SM/Robinsons).
- **Primary Friction**: Mentally comparing a Puregold regular price against an SM weekend B1T1 or a Dali private-label alternative across different gram weights while standing in a crowded aisle.

#### 2. Solo Young Professionals & Condo Renters
- **Behavioral Pattern**: Urban BPO/corporate workers living in Metro Manila, Cebu, or Davao condos/apartments. High reliance on batch cooking (3–4 days of meals) and proximity retail (ground-floor Alfamart, 7-Eleven, Uncle John's, or Robinsons Easymart).
- **Shopping Habits**: Often fall into the **"condo convenience tax"** (paying marked-up prices downstairs for mid-week ingredients) or get burned by delivery markups/stock-outs on MetroMart/Pickaroo/GrabMart. Warehouse club bulk packs frequently spoil before a solo renter finishes them unless split with neighbors/family.
- **Primary Friction**: Knowing *when* a medium pack at Savemore beats both a tiny convenience-store pack and a massive Landers tub that will expire half-eaten.

#### 3. College Students & Dormers
- **Behavioral Pattern**: Strict weekly allowances (₱500–₱900/week for groceries/pantry food), limited storage/refrigeration, heavy reliance on pantry staples (noodles, canned tuna/sardines, bread, spreads, 3-in-1 coffee, biscuits, toiletries).
- **Shopping Habits**: Early adopters of **Dali Everyday Grocery** and **SM Bonus** for low sticker prices; frequently share rooms/fridges and split larger packs with dormmates.
- **Primary Friction**: Cash-flow pressure forces micro-pack/sachet buying even when unit costs are higher, and unfamiliar house brands carry trial risk on a tiny budget (hence heavy reliance on peer "dupe" recommendations).

#### 4. Bulk, Membership & *Sulit* Value Hunters
- **Behavioral Pattern**: Large multi-generational households, savvy deal hunters, and small food-business/*sari-sari* resellers (Puregold's *Tindahan ni Aling Puring* base and `dalidash.ph` case buyers).
- **Shopping Habits**: Pay ₱700/year for **Landers** and/or **S&R** (often hunting 50%-off ₱350 renewal promos), aggressively target **Landers Super Crazy Sale / Piso Sale** and **S&R Members' Treat**, and compare warehouse multi-packs against mainstream supermarket prices.
- **Primary Friction**: Warehouse clubs are *not* automatically cheaper per gram on local staples than Puregold or Dali; shoppers lack an objective calculator that compares a Landers 2-pack B1T1 against a Puregold regular shelf price per 100g/100mL.

---

## 3. Recurring Philippine Shopper Pain Points

Six recurring friction clusters dominate documented Philippine consumer studies, DTI regulatory advisories, app reviews, and PH shopper forums:

### 3.1 Fragmented Multi-Chain Discovery & Online/In-Store Mismatches
- **No single source of truth across formats**: SM Markets (`smmarkets.ph`), Puregold Mobile, Landers (`landers.ph`), and S&R (`snrshopping.com`) operate siloed catalogs; **Robinsons shut down GoRobinsons/GoCart in mid-2024** and pushed online fulfillment exclusively to third-party delivery apps (MetroMart, GrabMart, Foodpanda, Pickaroo).
- **Discounter & minimart catalog blind spots**: Fast-growing budget chains — **Dali** (1,181–1,300+ stores), **O!Save** (750 stores), and **Alfamart** (2,300–2,400+ stores) — have minimal or non-retail digital catalogs. Dali's official `dalidash.ph` targets wholesale/case buyers in select Metro Manila zones rather than everyday single-item browsing nationwide.
- **Online vs. shelf discrepancies**: In-store yellow-tag markdowns, branch-specific clearance, and branch-level pricing variances frequently diverge from online listings; weighted items (meat/produce) are estimates online; and online shoppers regularly report unannounced cancellations or substitutions.

### 3.2 Deal, Promo & Loyalty-Tier Opacity
Philippine grocery promos are heavily gated, fragmented across Facebook posts, Viber communities, paper flyers, and proprietary apps, and difficult to evaluate apples-to-apples:

| Retailer / Program | Access / Fee | Key Promo Mechanics | Shopper Pain Point |
| :--- | :--- | :--- | :--- |
| **SM Markets (SMAC)** | SMAC Start (Free virtual); SMAC Blue (₱200 / 5 yrs) | Weekend / 3-Day Sales, SMAC-exclusive markdowns, points multipliers | In-store yellow tags often don't sync with `smmarkets.ph`; promo terms hidden behind SMAC tiers |
| **Robinsons (Go Rewards)** | Free virtual app; ₱100 physical card | 1 pt = ₱1 redemption, partner coupons, Red Tag/bundle promos | Standalone GoCart shut down; users complain of Go Rewards app login/linking bugs |
| **Puregold (Perks / TNAP)** | Perks (₱100 kit); TNAP (business docs/reg, up to 3% rebates) | Wholesale "Kitang-Kita" cases, Ka-Asenso coupon booklets, P-Wallet promos | Retail vs. wholesale/TNAP pricing split; stock sync lags in Puregold Mobile |
| **Landers Superstore** | **₱700/yr** personal (₱350 on 50% promos; ₱400 ext.) | **Super Crazy Sale**, **Piso Sale** (₱1 items with minimum spend), B1T1 | Membership-gated checkout; Piso Sale requires minimum basket threshold that obscures true savings |
| **S&R Membership Shopping** | **₱700/yr** Gold (₱400 supplementary) | **Members' Treat** B1T1 / deep bulk markdowns; online non-member surcharge | Difficult to tell if a B1T1 club pack actually beats Puregold/Dali per gram |

### 3.3 Cross-Brand & Private-Label Substitute Blindness
Exact-SKU comparison misses the single biggest way Filipino shoppers actually save money: **switching brands or pack tiers within a category**. Every major chain pushes exclusive house brands that *cannot* be matched by barcode/UPC across chains:
- **SM Markets**: *SM Bonus*, *Alfa Savers*
- **Puregold / S&R**: *Pure Basics*, *Member's Value*, *Fresh Pick*
- **Robinsons Retail**: *SureBuy*, *Robinsons*, *Healthy You*
- **Landers**: *Founders*
- **Dali**: *GoNutt*, *Chipsy*, *Healthy Cow*, *Kulina*, *Grandbisco*

**Concrete Philippine Example — Chocolate Hazelnut Spread**:
- **Nutella 350g** (Landers / major supermarkets): ~**₱339.95** → **~₱97.13 / 100g**
- **Goya Choco/Double Hazelnut 350g** (SM / WalterMart): ~**₱175–₱235** → **~₱50.00–₱67.14 / 100g**
- **Dali GoNutt Hazelnut Spread 350g** (Dali in-store / `dalidash.ph` retail ref): ~**₱75–₱130** → **~₱21.43–₱37.14 / 100g** (60%–75% cheaper per 100g than Nutella)
- **Landers Founders Hazelnut Spread 750g** (Landers exclusive): larger bulk jar sold only at Landers, impossible to compare via exact-SKU matching.

Because PH shoppers constantly crowdsource "best budget dupes for X" on Reddit and TikTok, an app limited to exact-barcode matching solves only half the shopper's real decision.

### 3.4 Shrinkflation, Missing Shelf Unit-Pricing & *Tingi* Math Confusion
- **Legal gap in shelf unit pricing**: Under **Republic Act No. 7394 (Consumer Act of the Philippines, Articles 81–82)** and **DTI DAO No. 09, s. 2002**, retailers must display the all-inclusive price **per unit of sale** (per piece/pack/bottle), *not* a standardized price per 100g or 100mL as mandated in the UK/EU/Australia. Shoppers are forced to do mental division in the aisle.
- **Permitted shrinkflation**: The DTI permits manufacturers to downsize grammage while keeping retail prices unchanged provided packaging states the new net weight and cost justification passes Price Act (RA 7581) review. PH consumers regularly report covert downsizing across instant coffee, snacks, canned goods, and detergents. DTI itself announced plans to add unit-cost (price per gram/mL) to SRP bulletins and e-Presyo specifically to counter shrinkflation confusion.
- **Sachet vs. bottle nuance**: While bulk/refill bottles generally win on raw ₱/g or ₱/mL, PH shoppers document two counter-intuitive realities: (1) occasional **"reverse economy of scale" anomalies** where promo sachets/twin-packs beat small bottles per gram, and (2) **behavioral cash-flow and portion-control trade-offs** (pre-dosed sachets fit daily budgets and stop household over-pouring of shampoo/detergent).

### 3.5 Multi-Store Trip Planning vs. Hidden Friction Costs
- Splitting a basket across Dali (dry staples) + Puregold (branded goods) + SM/Landers (meat/bulk) routinely yields **15%–30% item-level savings**, per PH community reports and global basket-comparison benchmarks.
- However, naive "cheapest per item across 5 stores" lists fail in real Metro Manila / Philippine traffic: extra jeepney/tricycle/Grab fares, mall parking fees (₱50–₱100+), fuel, long checkout queues, and out-of-stock risk quickly wipe out ₱80 in theoretical item savings. Shoppers need a realistic **single-store winner vs. 2-store split** trade-off.

### 3.6 In-Store Signal Dead Zones
- Many major Philippine supermarkets sit in thick concrete mall basements or lower-ground floors (SM, Robinsons, Landmark, hypermarkets) where cellular data drops to zero or crawls. Any price-comparison companion that requires live round-trip network requests just to open a shopping list or check saved comparisons breaks at the exact moment of purchase.

---

## 4. Competitor & Ecosystem Audit

### 4.1 Philippine Government & Public Price Trackers

| Tool | Scope & Coverage | Strengths | Core Failures / Gaps |
| :--- | :--- | :--- | :--- |
| **DTI e-Presyo** (`e-presyo.dti.gov.ph`) | Official DTI SRP & prevailing price tracker covering only **~190–204 BNPC SKUs** (sardines, milk, coffee, noodles, bread, soap, etc.) | Official regulatory reference; anti-overpricing complaint channel; DTI pushing unit-cost & AI upgrades (e-Presyo 2.0) | Covers <1% of a supermarket's assortment; zero promos/B1T1, zero private-label/cross-brand discovery; frequent portal downtime/timeouts; stale updates; neglected mobile apps with very low consumer adoption |
| **DA Bantay Presyo** (`da.gov.ph`) | Department of Agriculture prevailing wet-market (*palengke*) prices (rice, meat, fish, vegetables) | Useful macro baseline for agricultural staples (reused by indie trackers like AnoMura) | Wet-market only (outside PresyoCheck v1 scope); daily PDF/table format not built for consumer trip planning |

### 4.2 Philippine Retailer-Owned Apps & Digital Catalogs

| Chain / App | Active Digital Channels | Strengths | Limitations for Price Comparison |
| :--- | :--- | :--- | :--- |
| **SM Markets** (`smmarkets.ph`, ShopSM, SM Malls Online, SMAC) | Direct grocery web/app + loyalty app; same-day delivery (~₱150 fee, free-shipping promos at ~₱1,500–₱2,000+) or free pickup | Broad nationwide catalog (350+ stores), SMAC points online, SM Bonus visibility, flexible payments (GCash/Maya/COD) | Single-chain walled garden; no unit-price sorting; in-store yellow-tag markdowns often missing online; frequent review complaints of unannounced cancellations/substitutions |
| **Robinsons Retail** (~~GoRobinsons / GoCart~~ → **Go Rewards**) | **GoRobinsons & GoCart shut down mid-2024**; online fulfillment moved entirely to MetroMart, GrabMart, Foodpanda, Pickaroo; vouchers/points in Go Rewards | Go Rewards unifies points across Robinsons Supermarket, Shopwise, The Marketplace, GoTyme (1 pt = ₱1) | **No direct proprietary online catalog anymore**; Go Rewards app suffers registration/login/linking bugs in Play Store reviews; price discovery split across 3rd-party delivery apps |
| **Puregold** (Puregold Mobile w/ **SALLY**; Aling Puring App) | Direct mobile ordering, in-store barcode scanning, "SALLY" assistant, zero concierge fees, P-Wallet promos | Strong everyday low prices on national brands; fast barcode add & re-order; skips checkout lines | Single-chain only; app sluggishness & local branch stock-sync mismatches; no cross-chain or unit-price comparison |
| **Landers.ph** & **S&R** (`snrshopping.com`) | Proprietary club e-commerce (Landers powered via internal SnapMart logistics) | Online prices mirror warehouse shelf prices (no 3rd-party item markup); clear substitution rules; exposes Crazy Sale/Piso Sale & Founders/Member's Value lines | **Hard membership paywall** (₱700/yr; S&R charges non-member surcharge online); scheduled slots; bulk-only SKUs hard to compare against regular supermarket packs |
| **Dali** (`dali.ph` / `dalidash.ph`), **O!Save**, **Alfamart**, **7-Eleven** (`CLiQQ Shop`) | `dalidash.ph` (official Shopify bulk/case ordering for Metro Manila/Pasig); `cliqqshop.com` (24/7 branch pickup); O!Save & Alfamart largely offline-first | Dali & O!Save deliver lowest everyday prices via lean ops & private labels; 7-Eleven CLiQQ offers free branch pickup & rewards | **Biggest digital blind spot in PH grocery**: O!Save & Alfamart lack consumer price catalogs; `dalidash.ph` is wholesale/case-focused; none support cross-store comparison |

### 4.3 Philippine Multi-Store Delivery Aggregators

| App | Model & Partner Stores | Strengths | Why They Fail as Price-Comparison Tools |
| :--- | :--- | :--- | :--- |
| **MetroMart** (`metromart.com`) | Multi-store supermarket marketplace (Robinsons, S&R, The Marketplace, Landmark, AllDay, Watsons) | Broadest supermarket variety in one app; partners largely mirror in-store prices; 1–2 hr delivery | **Store-siloed browsing**: users must pick a store *before* browsing/searching; no cross-store price comparison table, no unit-price sorting, no private-label substitute view; delivery & service fees distort small baskets |
| **Pickaroo** (`pickaroo.com`) | Curated on-demand personal shopper & concierge (Landers, S&R, upscale markets, wet markets) | High-touch shopper chat, real-time substitution photos, multi-store batching | Positioned for affluent convenience; delivery + shopper fees (and convenience markups on select merchants) make it ill-suited for budget comparison; no cross-chain price comparator |
| **GrabMart / Foodpanda Shops** | Quick-commerce convenience & partner grocers | Ultra-fast 30–60 min delivery, ubiquitous app install base | Noticeable item markups + delivery/small-order fees; optimized for urgent checkout, never for lowest-price discovery |

### 4.4 Emerging Local Philippine Indie Price Trackers

A crucial market finding is that **grassroots PH price trackers have recently emerged**, validating real local demand while exposing clear product gaps:

| Local App | Positioning & Stores Covered | Standout Features | Clear Gaps / Limitations |
| :--- | :--- | :--- | :--- |
| **Budolista** (`budolista.ph`) | Community price check + deals hub (SM Markets, WalterMart, Metro, Watsons) | Side-by-side price checks, curated *sulit* vouchers/bank promos, grocery list + fuel tracker | Primarily **exact/identical-product matching**; uneven catalog coverage and price-history depth; excludes hard discounters (Dali/O!Save) & club promo math |
| **AnoMura** (`anomura.today`) | Ad-free indie tracker (DA *Bantay Presyo* wet markets, DOE fuel, Metro Manila online groceries & SM snapshots) | **Unit pricing** (per kg/L/pc) + 7-day to 1-year price history with *"mura / mahal / totoong sale"* (real sale) flags | Heavily anchored in *palengke*/DA baselines and select Metro Manila online feeds; not built around multi-chain supermarket/discounter/club substitute comparison or split-trip planning |
| **GrocerIQ** (`groceriq.site`) | Offline-first mobile grocery companion (SM, Puregold, Robinsons, Landers, S&R, WalterMart, Dali, Alfamart) | **100% offline-first** for concrete mall dead zones; barcode scan; receipt OCR; "Suki" AI swaps & unit-price (`₱/g`, `₱/mL`) | **Crowdsourcing/manual cold-start problem** (unlogged items require manual shelf entry); key differentiators (receipt OCR, unit-price Smart Swaps, AI) are **paywalled behind Pro** |
| **Low Price Dito** (`lowpricedito.com`) | D2C budget FMCG store + budget planning tools (sister to *Wholesale Dito*) | Competitive direct-to-consumer prices on staples | Retailer-owned D2C channel, not an unbiased multi-chain comparator |

### 4.5 International Benchmarks & Failure Post-Mortems

| Platform (Region) | Core Mechanic | What Retains Users (Proven Wins) | What Fails or Limits It (Warnings) |
| :--- | :--- | :--- | :--- |
| **Flipp** (US / Canada) | Weekly circular/flyer aggregator (2,000+ retailers; 4.7+★ app ratings) | **Habitual weekly reset** (replaces paper flyers); item search across local ads; 1-tap clip-to-shopping-list; built-in loyalty card wallet; retailer-funded syndication avoids anti-scraping hostility | Promo-only: misses everyday non-flyer shelf prices; weak unit-price comparison across pack sizes and private labels |
| **Trolley.co.uk** (UK) | Structured daily catalog comparator (130,000+ SKUs across Tesco, Sainsbury's, Asda, Morrisons, Aldi, Lidl) | High catalog depth; automatic **unit pricing** (£/100g, £/L); price history charts; price-drop alerts; barcode scanner; browser extension | Trustpilot complaints over **loyalty dual-pricing gaps** (Tesco Clubcard / Sainsbury's Nectar prices diverging from scraped base prices) and imperfect own-brand equivalence across chains |
| **Grocer.nz** (New Zealand) | Grassroots mobile/web comparator for NZ's oligopoly (PAK'nSAVE, Woolworths, New World) | Clean, fast indie UX; live cross-store list comparison; price history (v2) to expose fake specials; cloud-synced store-grouped lists | Ongoing struggle matching **store-brand equivalents** (e.g., Pams vs. Woolworths home brand) — exact same gap as PH! |
| **WiseList / Frugl / Half Price** (Australia) | Live Coles/Woolworths/ALDI comparison, weekly 50%-off tracker, household companion | **Wednesday catalogue-reset notifications**; shared family shopping lists (social lock-in); watchlist price-drop pings; split-basket savings summaries; "Half Price only" quick-scan filter; pantry/receipt history | Heavy feature sprawl in WiseList/Frugl can overwhelm casual users; core power features (barcode scan, split optimization, extended history) gated behind paid subscriptions |
| **PriceSpy** (Nordics / UK / NZ) | General retail/electronics comparator (non-grocery benchmark) | Gold-standard **price-history transparency** ("is this sale actually cheap?") | Non-grocery focus; exact-SKU/model-number matching does not translate directly to grocery private labels or variable grammage |
| **Basket Savings** (US) — *POST-MORTEM* | Crowdsourced "Waze for groceries" whole-basket comparison (`basketsavings.com`) | Validated strong user appeal for **whole-basket total** + distance-vs.-savings trade-off (exposing 20%–30% local store gaps) | **Acquired by Fobi AI (May 2022) & effectively sunsetted / pulled from app stores.** Crowdsourcing collapsed under 30,000–50,000 SKUs/store, weekly promo churn, volunteer fatigue, and hyper-local price staleness |
| **mySupermarket** (UK) — *POST-MORTEM* | Pioneer UK multi-supermarket basket & swap comparator (2006–2020) | Proved shoppers love real-time "swap & save" prompts (cheaper pack sizes / own-brand swaps) during cart building | **Shut down March 1, 2020** (pivoted to B2B retail data analytics). Dependent on supermarket affiliate payouts and brittle scraping; chains resisted direct price undercutting, and maintaining cross-chain SKU/shrinkflation alignment became unsustainable on consumer ad/affiliate margins |

---

## 5. What Retains Users vs. What Kills Grocery Price-Comparison Apps

### What Retains Users (Proven Habit Loops)
1. **Calendar-Anchored Cadence**: Successful apps hook onto an existing shopping ritual (Australia's Wednesday catalogue reset; North America's weekend Flipp flyer browse). In the Philippines, the natural hook is the **15th & 30th *sweldo*/*kinsenas* payday cycle** plus weekend/monthly club sale alerts.
2. **Utility Beyond Single-Item Lookup (List Lock-In)**: Users quickly churn from one-off price calculators. Apps that become the shopper's **reusable shopping list** (pinned staples, quick re-add, store-grouped checklist, optional family/roommate sharing) achieve recurring weekly retention.
3. **Instant "Aha!" Clarity on Unit Price & Real Deals**: Seeing `₱28/100g vs. ₱97/100g` or a *"True Sale / Lowest in 90 days"* badge (AnoMura, Grocer.nz, Trolley.co.uk) builds immediate trust and emotional payoff ("*sulit!*") in under 5 seconds.
4. **Whole-Basket & Practical Split Answers**: Knowing *"Puregold saves you ₱245 on this 15-item list vs. SM, or split Dali + SM to save ₱380"* converts abstract item prices into a concrete trip decision.
5. **Zero-Friction In-Aisle Usability**: Offline-cached lists/prices (GrocerIQ lesson), fast search, and zero forced sign-up wall before showing value.

### What Kills Grocery Price-Comparison Apps
1. **Stale or Unverifiable Prices (Trust Collapse)**: One bad trip where shelf prices are ₱30 higher than the app permanently destroys user trust. Hiding data age makes staleness feel like deception.
2. **Pure Crowdsourcing Cold-Start & Contributor Churn**: The "Waze for groceries" fallacy (Basket Savings). Unlike gas stations (3–4 fuel grades), a supermarket carries 30,000–50,000 SKUs changing weekly; unpaid shoppers will not manually type prices in-aisle after the novelty fades.
3. **Exact-SKU-Only Blindness**: Matching only identical barcodes ignores Dali, O!Save, SM Bonus, Pure Basics, SureBuy, and Landers Founders — erasing the exact 20%–70% cross-brand savings Filipino budget shoppers care about most.
4. **Ignoring Loyalty & Membership Gates**: Showing Landers/S&R member prices or SMAC-only discounts as universally available misleads non-members (the exact Tesco Clubcard / Nectar complaint against Trolley.co.uk).
5. **Over-Engineering Checkout or Heavy Manual Entry**: Trying to compete with MetroMart/GrabMart on fulfillment (or forcing users to scan every receipt before seeing prices) bloats scope and kills adoption.
6. **Fragile Retailer Dependency**: Relying on one scraped retailer or retailer-funded affiliate links creates existential failure risk (mySupermarket, GoCart shutdown).

---

## 6. Opportunity Gaps & Design Recommendations for PresyoCheck

For a **mobile-focused React capstone with a clean path to production** (and a $0/free-tier budget), these six opportunity gaps separate PresyoCheck from both local and global competitors:

### Gap 1: First-Class "Substitute Group" Comparison (Exact SKU + Cross-Brand/Private Label)
- **Why**: No Philippine app cleanly answers *"I need chocolate hazelnut spread / 1L cooking oil / laundry detergent — show me the exact brand across chains AND the cheapest store-brand/discounter dupes side-by-side."*
- **Design implication**: Model a canonical **Product Concept / Substitute Group** (e.g., *Hazelnut Chocolate Spread*) linking exact national-brand SKUs (Nutella 350g across SM/Puregold/Landers) alongside curated cross-brand and private-label equivalents (Goya 350g, Landers Founders 750g, Dali GoNutt 350g), all ranked by normalized unit price.

### Gap 2: Always-On Unit-Price Engine (`₱/100g`, `₱/100mL`, `₱/pc`) + Effective Promo Math
- **Why**: Philippine law (RA 7394) does not require shelf per-100g tags, shrinkflation is widespread, and B1T1 / multi-pack / sachet math trips up every shopper segment.
- **Design implication**: Compute normalized unit price on every product card automatically, calculate **effective unit price** for promos (e.g., B1T1 = 50% effective unit cost; Piso Sale = flag minimum-spend requirement), and surface a clear **pack-size trade-off indicator** (*Best per 100g* vs. *Lowest upfront peso* for cash-constrained students/tingi buyers).

### Gap 3: Loyalty & Membership Filter ("My Cards / Clubs")
- **Why**: Landers (₱700/yr), S&R (₱700/yr), SMAC, Go Rewards, and Puregold Perks create multi-tier pricing across chains.
- **Design implication**: Let shoppers toggle which chains/memberships they hold (no account required — persisted locally). Display member/loyalty prices with clear badges (`Landers Member`, `SMAC Promo`) and exclude gated warehouse prices from "best total" calculations unless the user opted in.

### Gap 4: Trust-First Price Freshness & Low-Friction Verification (Not Heavy Crowdsourcing)
- **Why**: Pure crowdsourcing dies (Basket Savings), while hidden staleness kills trust (DTI e-Presyo, Trolley complaints).
- **Design implication**: Always display **provenance + freshness badges** (e.g., `Online catalog · Verified 2d ago` or `Promo flyer · Ends Nov 30`). Offer an optional, ultra-low-friction **"Still ₱175? 👍 / Update"** micro-action for in-store shoppers rather than relying on users to build the catalog from scratch.

### Gap 5: Realistic Multi-Store Basket Planner (*Single Best Store* vs. *Smart 2-Store Split*)
- **Why**: Shoppers want total-trip answers (Basket/WiseList insight), but recommending a 5-store itinerary ignores PH commute/parking costs.
- **Design implication**: On the shopping list screen, show (1) **Cheapest 1-Stop Store**, (2) **Smart 2-Store Split** capped to user-selected nearby chains with a *"Saves ₱X extra — worth a 2nd stop?"* callout, and (3) a **1-tap "Swap to Cheaper Brand" optimizer** showing instant peso savings if the user accepts house-brand/discounter substitutes.

### Gap 6: Android-First, Offline-Tolerant Companion UX (Zero Login Wall)
- **Why**: 85%–86% of PH mobile users run Android, and concrete mall/basement supermarkets routinely kill mobile signal.
- **Design implication**: Optimize for mid-range Android viewports and touch ergonomics; allow instant search and list building without forced sign-in; cache active shopping lists and recently viewed comparisons locally so shoppers can still check prices and check off items inside basement aisles with zero signal.

---

## 7. Primary Sources & References

### Official Statistics, Legal Frameworks & Market Intelligence
- **Philippine Statistics Authority (PSA)** — *2023 Family Income and Expenditure Survey (FIES)* (average annual family income ₱353,230; expenditure ₱258,050; food expenditure share analyses via PSA / PIDS): `https://psa.gov.ph`
- **USDA Foreign Agricultural Service (FAS / GAIN)** — *Retail Foods Annual: Philippines* & *Private Label Opportunities in the Philippines* (Big 3 conglomerate share, private-label 7%–10% share & ~US$900M market, retailer private-label portfolios): `https://www.fas.usda.gov` / `https://apps.fas.usda.gov`
- **Worldpanel by Kantar & NielsenIQ (NIQ)** — *Philippines FMCG / Global Consumer Outlook 2024–2025* (spending-control mode, more frequent/smaller baskets, sachet/*tingi* resilience, discounter & private-label shift, *kinsenas*/*katapusan* payday spikes): `https://www.kantar.com`, `https://nielseniq.com`
- **Republic Act No. 7394 (Consumer Act of the Philippines, Arts. 81–82)** & **DTI DAO No. 09, s. 2002** — Price Tag Law, shelf-pricing rules, and DTI advisories on shrinkflation, ~190–204 monitored BNPC SKUs, and unit-price transparency: `https://www.dti.gov.ph`, `https://lawphil.net`
- **DataReportal & Statcounter** — *Digital 2025: The Philippines* (97.5M internet users, 142M mobile connections, 98.2% broadband; 85%–86% Android vs. 13%–14% iOS share): `https://datareportal.com`, `https://gs.statcounter.com`

### Philippine Retailers, Loyalty Programs & Local Apps
- **DTI e-Presyo & Consumer Care**: `https://e-presyo.dti.gov.ph`, `https://www.dti.gov.ph`
- **SM Markets Online & SMAC**: `https://smmarkets.ph`, `https://www.smac.ph` (SM Markets 350+ stores; SMAC Start free / Blue ₱200; Alfamart 2,300–2,400+ stores)
- **Puregold Price Club, Puregold Mobile (SALLY) & S&R Membership Shopping**: `https://www.puregold.com.ph`, `https://www.snrshopping.com`, Google Play listing for Puregold Mobile (680 Puregold stores, 33 S&R warehouses; S&R ₱700/yr; Perks ₱100; TNAP up to 3% rebates)
- **Robinsons Retail Holdings, Inc. (RRHI) & Go Rewards**: `https://www.robinsonsretailholdings.com.ph`, `https://www.gorewards.com.ph` (761–799 food stores; GoCart/GoRobinsons mid-2024 sunset; Go Rewards virtual free / ₱100 card)
- **Landers Superstore**: `https://www.landers.ph` (16 branches; ₱700/yr membership, ₱350 promos; Super Crazy Sale / Piso Sale; Founders hazelnut spread & Nutella pricing)
- **Dali Everyday Grocery & DALI D@sh**: `https://dali.ph`, `https://dalidash.ph` (1,181–1,300+ stores end-2025; GoNutt and exclusive private labels)
- **O!Save** (750 stores end-2025 via RRHI / trade disclosures) & **Philippine Seven Corporation / 7-Eleven CLiQQ Shop**: `https://www.7-eleven.com.ph`, `https://cliqqshop.com`, `https://www.cliqq.net` (4,130 end-2024 → 4,500+ stores)
- **MetroMart & Pickaroo**: `https://www.metromart.com`, `https://pickaroo.com` (official store listings, pricing/fee models, user reviews)
- **Emerging PH Price Trackers**: Budolista (`https://budolista.ph`), AnoMura (`https://anomura.today`), GrocerIQ (`https://groceriq.site`), Low Price Dito (`https://lowpricedito.com`)
- **PH Consumer Community Evidence**: Recurring discussions on `r/Philippines`, `r/adultingph`, `r/FrugalPH`, `r/phinvest`, and `r/SoloLivingPH` covering solo/dorm grocery budgets, Dali vs. Puregold vs. SM vs. Landers comparisons, GoNutt/Goya/SM Bonus substitutes, sachet vs. bottle behavior, and shrinkflation sightings.

### International Grocery Comparison Benchmarks & Post-Mortems
- **Flipp** (US/Canada): `https://flipp.com`, Apple App Store & Google Play listings
- **Trolley.co.uk** (UK): `https://www.trolley.co.uk`, Chrome Web Store & Trustpilot user feedback
- **Grocer.nz** (New Zealand): `https://grocer.nz`, Apple App Store listing & NZ consumer discussions
- **WiseList, Frugl & Half Price** (Australia): Apple App Store & Google Play listings (`WiseList`, `Frugl Grocery`, `Half Price: Coles & Woolworths`)
- **Basket Savings** (US post-mortem): Acquisition by Fobi AI (May 2022) and subsequent consumer app sunset (`basketsavings.com` / retail industry coverage via *The Spoon*, *RetailWire*, *GroceryChop*)
- **mySupermarket** (UK post-mortem): Official March 1, 2020 consumer shutdown announcement and B2B pivot (*MoneySavingExpert*, *Grocery Gazette*, *Dealroom*)
