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
