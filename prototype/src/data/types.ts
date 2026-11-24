export type RetailChainId = 'sm' | 'puregold' | 'dali' | 'landers' | 'snr';

export interface RetailChain {
  id: RetailChainId;
  name: string;
  shortName: string;
  kind: 'Supermarket' | 'Hard Discounter' | 'Membership Club';
  memberOnly: boolean;
  defaultBranchNote: string;
}

export type UnitKind = 'g' | 'mL' | 'pc';

export interface SubstituteGroup {
  id: string;
  label: string;
  shortLabel: string;
  keywords: string[];
  unitDisplayLabel: '₱/100g' | '₱/100mL' | '₱/pc';
  dtiSrpNote?: string;
}

export interface Product {
  id: string;
  groupId: string;
  brand: string;
  name: string;
  packLabel: string;
  netAmount: number;
  unitKind: UnitKind;
  isHouseBrand: boolean;
  dtiSrpPeso?: number;
}

export interface PriceObservation {
  id: string;
  productId: string;
  chainId: RetailChainId;
  storeBranch: string;
  pricingZone: 'Mega Manila';
  shelfPricePeso: number;
  verifiedDaysAgo: number;
}

export interface CityOption {
  id: string;
  name: string;
  province: string;
  pricingZone: 'Mega Manila' | 'Out of Zone';
  nearbyChains: RetailChainId[];
}

export type SortMode = 'unit' | 'shelf';
export type BasketMode = 'exact' | 'substitutes';

export interface ShoppingListItem {
  id: string;
  kind: 'product' | 'generic';
  groupId: string;
  productId?: string;
  label: string;
  quantity: number;
}

export interface PriceFlagRecord {
  observationId: string;
  productName: string;
  chainName: string;
  observedPeso?: number;
  queuedOffline: boolean;
  flaggedAtLabel: string;
}

export interface EnrichedObservation {
  observation: PriceObservation;
  product: Product;
  chain: RetailChain;
  group: SubstituteGroup;
  unitPricePeso: number;
  unitPriceFormatted: string;
  isMemberOnly: boolean;
  isEligible: boolean;
  isStale: boolean;
  isBestUnitPrice: boolean;
  isLowestUpfrontPrice: boolean;
  isFlagged: boolean;
}

export type VariantKey = 'A' | 'B' | 'C';
