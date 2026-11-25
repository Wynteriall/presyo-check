# PresyoCheck

Philippine mobile grocery price-comparison and shopping-planning companion across retail chains.

## Language

**Shopper**:
An end user comparing grocery prices or planning a retail store trip in PresyoCheck (unauthenticated by default in v1).
_Avoid_: User, Customer, Buyer, Account

**Shelf Price**:
The upfront peso amount paid at checkout for a single sellable pack or item before conditional promos.
_Avoid_: Sticker price, Retail price, Unit price (when referring to pack price)

**Unit Price**:
Normalized cost per standard measure (`₱/100g`, `₱/100mL`, or `₱/pc`) calculated from a product's Shelf Price and net pack quantity.
_Avoid_: Price per piece (when referring to a whole pack), SRP

**Effective Unit Price**:
Normalized cost per standard measure after applying a mathematically deterministic deal (straight markdown, B1T1 / Buy-X-Take-Y, or multi-pack bundle).
_Avoid_: Promo price, Sale price

**Membership Gate**:
A paid club membership or loyalty-card requirement (such as a Landers/S&R annual fee or SMAC card) needed to qualify for a listed price or deal.
_Avoid_: Paywall, Discount tier

**Retail Chain**:
A grocery brand banner compared in PresyoCheck (such as SM Markets, Puregold, Dali, Landers, or S&R).
_Avoid_: Store, Merchant, Vendor, Supermarket (when including clubs or discounters)

**Store Branch**:
A specific physical outlet of a Retail Chain (such as Savemore Imus or Puregold Shaw Blvd) used for price provenance and proximity.
_Avoid_: Location, Outlet, Shop

**Pricing Zone**:
A geographic market sharing a common baseline price rollup (such as Mega Manila), distinct from administrative city boundaries.
_Avoid_: Region, Area, City (when referring to price scope)

**Price Observation**:
A timestamped, provenance-tagged record of a product's walk-in Shelf Price at a Retail Chain, optionally tied to a specific Store Branch within a Pricing Zone.
_Avoid_: Price entry, Listing, Quote

**Curator**:
A trusted maintainer responsible for seeding and refreshing PresyoCheck's product catalog and Price Observations, distinct from an unauthenticated Shopper.
_Avoid_: Admin, Moderator, Editor

**Substitute Group**:
A curated set of comparable grocery products across national brands and private labels that satisfy the same everyday shopping need (such as chocolate spread or 1L cooking oil).
_Avoid_: Category, Dupe list, Equivalence set

**Shopping List**:
A Shopper's active collection of specific products and generic shopping needs used for cross-chain basket planning.
_Avoid_: Cart, Wishlist, Basket

**Basket Comparison**:
The computed side-by-side total of a Shopping List across Retail Chains, contrasting the best 1-stop Retail Chain against a practical 2-store split under the Shopper's active Membership Gate and substitute preferences.
_Avoid_: Checkout total, Price estimate

**Price Flag**:
A Shopper-submitted signal indicating that a Price Observation appears outdated in-store, used to prioritize Curator refresh queues without automatically modifying live prices.
_Avoid_: Dispute, Report, Price edit

**Product**:
A distinct sellable grocery SKU (brand, variant, and net pack quantity/measure) assigned to one primary Substitute Group and an optional DTI SRP benchmark.
_Avoid_: Item, Article, Goods

**DTI SRP**:
An optional government-published Suggested Retail Price benchmark attached to a Product for Shopper value context and Curator data-entry validation, distinct from walk-in Shelf Price.
_Avoid_: Official price, Price cap

