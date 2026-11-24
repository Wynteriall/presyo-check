// PROTOTYPE SAMPLE DATA — Illustrative Philippine grocery Shelf Prices for UI/UX evaluation only.
// Not live verified store prices. All canonical terms follow GLOSSARY.md.

import type {
  CityOption,
  PriceObservation,
  Product,
  RetailChain,
  ShoppingListItem,
  SubstituteGroup,
} from './types';

export const RETAIL_CHAINS: Record<RetailChain['id'], RetailChain> = {
  sm: {
    id: 'sm',
    name: 'SM Markets',
    shortName: 'SM',
    kind: 'Supermarket',
    memberOnly: false,
    defaultBranchNote: 'Savemore / SM Supermarket / SM Hypermarket',
  },
  puregold: {
    id: 'puregold',
    name: 'Puregold',
    shortName: 'Puregold',
    kind: 'Supermarket',
    memberOnly: false,
    defaultBranchNote: 'Puregold Price Club / Jr.',
  },
  dali: {
    id: 'dali',
    name: 'Dali Everyday Grocery',
    shortName: 'Dali',
    kind: 'Hard Discounter',
    memberOnly: false,
    defaultBranchNote: 'Dali neighborhood store',
  },
  landers: {
    id: 'landers',
    name: 'Landers Superstore',
    shortName: 'Landers',
    kind: 'Membership Club',
    memberOnly: true,
    defaultBranchNote: 'Requires Landers membership',
  },
  snr: {
    id: 'snr',
    name: 'S&R Membership Shopping',
    shortName: 'S&R',
    kind: 'Membership Club',
    memberOnly: true,
    defaultBranchNote: 'Requires S&R membership',
  },
};

export const CHAIN_LIST: RetailChain[] = Object.values(RETAIL_CHAINS);

export const SUBSTITUTE_GROUPS: SubstituteGroup[] = [
  {
    id: 'choc-spread',
    label: 'Chocolate Hazelnut Spread',
    shortLabel: 'Choc Spread',
    keywords: ['chocolate spread', 'hazelnut', 'nutella', 'gonutt', 'goya', 'spread'],
    unitDisplayLabel: '₱/100g',
  },
  {
    id: 'cooking-oil',
    label: 'Cooking Oil (1L)',
    shortLabel: 'Cooking Oil',
    keywords: ['cooking oil', 'oil', 'minola', 'jolly', 'kulina', 'mantika'],
    unitDisplayLabel: '₱/100mL',
    dtiSrpNote: 'DTI BNPC SRP benchmark available',
  },
  {
    id: 'milk-1l',
    label: 'Full Cream Milk (1L)',
    shortLabel: 'Milk 1L',
    keywords: ['milk', 'full cream', 'selecta', 'anchor', 'all-time', 'gatas'],
    unitDisplayLabel: '₱/100mL',
  },
  {
    id: 'coffee-3in1',
    label: '3-in-1 Coffee Mix',
    shortLabel: '3-in-1 Coffee',
    keywords: ['coffee', '3-in-1', '3in1', 'nescafe', 'kopiko', 'kape'],
    unitDisplayLabel: '₱/pc',
  },
  {
    id: 'corned-beef',
    label: 'Canned Corned Beef (150g)',
    shortLabel: 'Corned Beef',
    keywords: ['corned beef', 'purefoods', 'argentina', 'holiday', 'canned'],
    unitDisplayLabel: '₱/100g',
    dtiSrpNote: 'DTI BNPC SRP benchmark available',
  },
  {
    id: 'detergent',
    label: 'Laundry Powder Detergent',
    shortLabel: 'Detergent',
    keywords: ['detergent', 'laundry', 'ariel', 'surf', 'linis', 'sabon'],
    unitDisplayLabel: '₱/100g',
  },
];

export const PRODUCTS: Product[] = [
  // 1. Chocolate Spread
  {
    id: 'nutella-350',
    groupId: 'choc-spread',
    brand: 'Nutella',
    name: 'Nutella Hazelnut Spread',
    packLabel: '350g jar',
    netAmount: 350,
    unitKind: 'g',
    isHouseBrand: false,
  },
  {
    id: 'nutella-200',
    groupId: 'choc-spread',
    brand: 'Nutella',
    name: 'Nutella Hazelnut Spread',
    packLabel: '200g jar',
    netAmount: 200,
    unitKind: 'g',
    isHouseBrand: false,
  },
  {
    id: 'goya-350',
    groupId: 'choc-spread',
    brand: 'Goya',
    name: 'Goya Double Hazelnut Spread',
    packLabel: '350g jar',
    netAmount: 350,
    unitKind: 'g',
    isHouseBrand: false,
  },
  {
    id: 'landers-hazelnut-400',
    groupId: 'choc-spread',
    brand: 'Founders',
    name: 'Founders Hazelnut Chocolate Spread',
    packLabel: '400g jar',
    netAmount: 400,
    unitKind: 'g',
    isHouseBrand: true,
  },
  {
    id: 'dali-gonutt-400',
    groupId: 'choc-spread',
    brand: 'GoNutt',
    name: 'GoNutt Chocolate Hazelnut Spread',
    packLabel: '400g jar',
    netAmount: 400,
    unitKind: 'g',
    isHouseBrand: true,
  },

  // 2. Cooking Oil 1L
  {
    id: 'minola-1l',
    groupId: 'cooking-oil',
    brand: 'Minola',
    name: 'Minola Premium Coconut Cooking Oil',
    packLabel: '1L bottle',
    netAmount: 1000,
    unitKind: 'mL',
    isHouseBrand: false,
    dtiSrpPeso: 88.0,
  },
  {
    id: 'jolly-oil-1l',
    groupId: 'cooking-oil',
    brand: 'Jolly',
    name: 'Jolly Claro Palm Cooking Oil',
    packLabel: '1L pouch',
    netAmount: 1000,
    unitKind: 'mL',
    isHouseBrand: false,
    dtiSrpPeso: 88.0,
  },
  {
    id: 'dali-kulina-1l',
    groupId: 'cooking-oil',
    brand: 'Kulina',
    name: 'Kulina Vegetable Cooking Oil',
    packLabel: '1L bottle',
    netAmount: 1000,
    unitKind: 'mL',
    isHouseBrand: true,
    dtiSrpPeso: 88.0,
  },

  // 3. Milk 1L
  {
    id: 'selecta-milk-1l',
    groupId: 'milk-1l',
    brand: 'Selecta',
    name: 'Selecta Fortified Full Cream Milk',
    packLabel: '1L carton',
    netAmount: 1000,
    unitKind: 'mL',
    isHouseBrand: false,
  },
  {
    id: 'anchor-milk-1l',
    groupId: 'milk-1l',
    brand: 'Anchor',
    name: 'Anchor Full Cream Milk',
    packLabel: '1L carton',
    netAmount: 1000,
    unitKind: 'mL',
    isHouseBrand: false,
  },
  {
    id: 'dali-alltime-1l',
    groupId: 'milk-1l',
    brand: 'All-Time',
    name: 'All-Time Full Cream Milk',
    packLabel: '1L carton',
    netAmount: 1000,
    unitKind: 'mL',
    isHouseBrand: true,
  },

  // 4. 3-in-1 Coffee (highlights Lowest Upfront vs Best Unit Price)
  {
    id: 'nescafe-10s',
    groupId: 'coffee-3in1',
    brand: 'Nescafe',
    name: 'Nescafe Creamy White 3-in-1',
    packLabel: '10 sachets',
    netAmount: 10,
    unitKind: 'pc',
    isHouseBrand: false,
  },
  {
    id: 'nescafe-30s',
    groupId: 'coffee-3in1',
    brand: 'Nescafe',
    name: 'Nescafe Creamy White Value Pack',
    packLabel: '30 sachets',
    netAmount: 30,
    unitKind: 'pc',
    isHouseBrand: false,
  },
  {
    id: 'kopiko-10s',
    groupId: 'coffee-3in1',
    brand: 'Kopiko',
    name: 'Kopiko Blanca 3-in-1',
    packLabel: '10 sachets',
    netAmount: 10,
    unitKind: 'pc',
    isHouseBrand: false,
  },

  // 5. Canned Corned Beef
  {
    id: 'purefoods-150',
    groupId: 'corned-beef',
    brand: 'Purefoods',
    name: 'Purefoods Corned Beef',
    packLabel: '150g can',
    netAmount: 150,
    unitKind: 'g',
    isHouseBrand: false,
    dtiSrpPeso: 42.5,
  },
  {
    id: 'argentina-150',
    groupId: 'corned-beef',
    brand: 'Argentina',
    name: 'Argentina Corned Beef',
    packLabel: '150g can',
    netAmount: 150,
    unitKind: 'g',
    isHouseBrand: false,
    dtiSrpPeso: 38.0,
  },
  {
    id: 'dali-holiday-150',
    groupId: 'corned-beef',
    brand: 'Holiday',
    name: 'Holiday Beef Loaf / Corned Beef',
    packLabel: '150g can',
    netAmount: 150,
    unitKind: 'g',
    isHouseBrand: true,
    dtiSrpPeso: 38.0,
  },

  // 6. Laundry Detergent
  {
    id: 'ariel-1100',
    groupId: 'detergent',
    brand: 'Ariel',
    name: 'Ariel Sunrise Fresh Powder',
    packLabel: '1.1kg pouch',
    netAmount: 1100,
    unitKind: 'g',
    isHouseBrand: false,
  },
  {
    id: 'surf-1100',
    groupId: 'detergent',
    brand: 'Surf',
    name: 'Surf Sun Fresh Powder',
    packLabel: '1.1kg pouch',
    netAmount: 1100,
    unitKind: 'g',
    isHouseBrand: false,
  },
  {
    id: 'dali-linis-1000',
    groupId: 'detergent',
    brand: 'Linis',
    name: 'Linis Power Laundry Powder',
    packLabel: '1kg pouch',
    netAmount: 1000,
    unitKind: 'g',
    isHouseBrand: true,
  },
];

export const PRICE_OBSERVATIONS: PriceObservation[] = [
  // Chocolate spread
  { id: 'obs-1', productId: 'nutella-350', chainId: 'sm', storeBranch: 'Savemore Imus', pricingZone: 'Mega Manila', shelfPricePeso: 219, verifiedDaysAgo: 2 },
  { id: 'obs-2', productId: 'nutella-350', chainId: 'puregold', storeBranch: 'Puregold Anabu', pricingZone: 'Mega Manila', shelfPricePeso: 214, verifiedDaysAgo: 4 },
  { id: 'obs-3', productId: 'nutella-350', chainId: 'landers', storeBranch: 'Landers Vermosa', pricingZone: 'Mega Manila', shelfPricePeso: 199, verifiedDaysAgo: 3 },
  { id: 'obs-4', productId: 'nutella-350', chainId: 'snr', storeBranch: 'S&R Imus', pricingZone: 'Mega Manila', shelfPricePeso: 205, verifiedDaysAgo: 16 }, // >14d stale
  { id: 'obs-5', productId: 'nutella-200', chainId: 'sm', storeBranch: 'Savemore Imus', pricingZone: 'Mega Manila', shelfPricePeso: 145, verifiedDaysAgo: 2 },
  { id: 'obs-6', productId: 'goya-350', chainId: 'sm', storeBranch: 'SM Hypermarket Molino', pricingZone: 'Mega Manila', shelfPricePeso: 148, verifiedDaysAgo: 5 },
  { id: 'obs-7', productId: 'goya-350', chainId: 'puregold', storeBranch: 'Puregold Anabu', pricingZone: 'Mega Manila', shelfPricePeso: 142, verifiedDaysAgo: 4 },
  { id: 'obs-8', productId: 'landers-hazelnut-400', chainId: 'landers', storeBranch: 'Landers Vermosa', pricingZone: 'Mega Manila', shelfPricePeso: 129, verifiedDaysAgo: 3 },
  { id: 'obs-9', productId: 'dali-gonutt-400', chainId: 'dali', storeBranch: 'Dali Tanzang Luma', pricingZone: 'Mega Manila', shelfPricePeso: 79, verifiedDaysAgo: 1 },

  // Cooking oil 1L
  { id: 'obs-10', productId: 'minola-1l', chainId: 'sm', storeBranch: 'Savemore Imus', pricingZone: 'Mega Manila', shelfPricePeso: 96, verifiedDaysAgo: 2 },
  { id: 'obs-11', productId: 'minola-1l', chainId: 'puregold', storeBranch: 'Puregold Shaw Blvd', pricingZone: 'Mega Manila', shelfPricePeso: 91, verifiedDaysAgo: 18 }, // >14d stale
  { id: 'obs-12', productId: 'minola-1l', chainId: 'snr', storeBranch: 'S&R Imus', pricingZone: 'Mega Manila', shelfPricePeso: 86, verifiedDaysAgo: 5 },
  { id: 'obs-13', productId: 'jolly-oil-1l', chainId: 'sm', storeBranch: 'Savemore Imus', pricingZone: 'Mega Manila', shelfPricePeso: 88, verifiedDaysAgo: 3 },
  { id: 'obs-14', productId: 'jolly-oil-1l', chainId: 'puregold', storeBranch: 'Puregold Anabu', pricingZone: 'Mega Manila', shelfPricePeso: 85, verifiedDaysAgo: 4 },
  { id: 'obs-15', productId: 'dali-kulina-1l', chainId: 'dali', storeBranch: 'Dali Tanzang Luma', pricingZone: 'Mega Manila', shelfPricePeso: 72, verifiedDaysAgo: 1 },

  // Full cream milk 1L
  { id: 'obs-16', productId: 'selecta-milk-1l', chainId: 'sm', storeBranch: 'Savemore Imus', pricingZone: 'Mega Manila', shelfPricePeso: 109, verifiedDaysAgo: 2 },
  { id: 'obs-17', productId: 'selecta-milk-1l', chainId: 'puregold', storeBranch: 'Puregold Anabu', pricingZone: 'Mega Manila', shelfPricePeso: 105, verifiedDaysAgo: 3 },
  { id: 'obs-18', productId: 'anchor-milk-1l', chainId: 'landers', storeBranch: 'Landers Vermosa', pricingZone: 'Mega Manila', shelfPricePeso: 98, verifiedDaysAgo: 4 },
  { id: 'obs-19', productId: 'anchor-milk-1l', chainId: 'snr', storeBranch: 'S&R Imus', pricingZone: 'Mega Manila', shelfPricePeso: 99, verifiedDaysAgo: 6 },
  { id: 'obs-20', productId: 'dali-alltime-1l', chainId: 'dali', storeBranch: 'Dali Tanzang Luma', pricingZone: 'Mega Manila', shelfPricePeso: 69, verifiedDaysAgo: 1 },

  // 3-in-1 Coffee (Lowest Upfront ₱79 Kopiko 10s vs Best Unit ₱7.80/pc Nescafe 30s)
  { id: 'obs-21', productId: 'nescafe-10s', chainId: 'sm', storeBranch: 'Savemore Imus', pricingZone: 'Mega Manila', shelfPricePeso: 89, verifiedDaysAgo: 2 },
  { id: 'obs-22', productId: 'nescafe-10s', chainId: 'puregold', storeBranch: 'Puregold Anabu', pricingZone: 'Mega Manila', shelfPricePeso: 85, verifiedDaysAgo: 3 },
  { id: 'obs-23', productId: 'nescafe-30s', chainId: 'sm', storeBranch: 'SM Hypermarket Molino', pricingZone: 'Mega Manila', shelfPricePeso: 243, verifiedDaysAgo: 2 },
  { id: 'obs-24', productId: 'nescafe-30s', chainId: 'puregold', storeBranch: 'Puregold Anabu', pricingZone: 'Mega Manila', shelfPricePeso: 234, verifiedDaysAgo: 3 },
  { id: 'obs-25', productId: 'nescafe-30s', chainId: 'landers', storeBranch: 'Landers Vermosa', pricingZone: 'Mega Manila', shelfPricePeso: 225, verifiedDaysAgo: 5 },
  { id: 'obs-26', productId: 'kopiko-10s', chainId: 'dali', storeBranch: 'Dali Tanzang Luma', pricingZone: 'Mega Manila', shelfPricePeso: 79, verifiedDaysAgo: 2 },
  { id: 'obs-27', productId: 'kopiko-10s', chainId: 'puregold', storeBranch: 'Puregold Anabu', pricingZone: 'Mega Manila', shelfPricePeso: 83, verifiedDaysAgo: 4 },

  // Corned Beef
  { id: 'obs-28', productId: 'purefoods-150', chainId: 'sm', storeBranch: 'Savemore Imus', pricingZone: 'Mega Manila', shelfPricePeso: 44, verifiedDaysAgo: 2 },
  { id: 'obs-29', productId: 'purefoods-150', chainId: 'puregold', storeBranch: 'Puregold Anabu', pricingZone: 'Mega Manila', shelfPricePeso: 42, verifiedDaysAgo: 4 },
  { id: 'obs-30', productId: 'purefoods-150', chainId: 'snr', storeBranch: 'S&R Imus', pricingZone: 'Mega Manila', shelfPricePeso: 40, verifiedDaysAgo: 7 },
  { id: 'obs-31', productId: 'argentina-150', chainId: 'sm', storeBranch: 'Savemore Imus', pricingZone: 'Mega Manila', shelfPricePeso: 37, verifiedDaysAgo: 3 },
  { id: 'obs-32', productId: 'argentina-150', chainId: 'puregold', storeBranch: 'Puregold Anabu', pricingZone: 'Mega Manila', shelfPricePeso: 35.5, verifiedDaysAgo: 4 },
  { id: 'obs-33', productId: 'dali-holiday-150', chainId: 'dali', storeBranch: 'Dali Tanzang Luma', pricingZone: 'Mega Manila', shelfPricePeso: 29, verifiedDaysAgo: 15 }, // >14d stale

  // Laundry Detergent (Dali only carries house substitute, not exact Ariel/Surf)
  { id: 'obs-34', productId: 'ariel-1100', chainId: 'sm', storeBranch: 'SM Hypermarket Molino', pricingZone: 'Mega Manila', shelfPricePeso: 189, verifiedDaysAgo: 2 },
  { id: 'obs-35', productId: 'ariel-1100', chainId: 'puregold', storeBranch: 'Puregold Anabu', pricingZone: 'Mega Manila', shelfPricePeso: 182, verifiedDaysAgo: 3 },
  { id: 'obs-36', productId: 'ariel-1100', chainId: 'landers', storeBranch: 'Landers Vermosa', pricingZone: 'Mega Manila', shelfPricePeso: 175, verifiedDaysAgo: 5 },
  { id: 'obs-37', productId: 'surf-1100', chainId: 'sm', storeBranch: 'Savemore Imus', pricingZone: 'Mega Manila', shelfPricePeso: 138, verifiedDaysAgo: 2 },
  { id: 'obs-38', productId: 'surf-1100', chainId: 'puregold', storeBranch: 'Puregold Anabu', pricingZone: 'Mega Manila', shelfPricePeso: 132, verifiedDaysAgo: 4 },
  { id: 'obs-39', productId: 'dali-linis-1000', chainId: 'dali', storeBranch: 'Dali Tanzang Luma', pricingZone: 'Mega Manila', shelfPricePeso: 78, verifiedDaysAgo: 1 },
];

export const CITIES: CityOption[] = [
  { id: 'imus', name: 'Imus', province: 'Cavite', pricingZone: 'Mega Manila', nearbyChains: ['dali', 'sm', 'puregold', 'landers', 'snr'] },
  { id: 'bacoor', name: 'Bacoor', province: 'Cavite', pricingZone: 'Mega Manila', nearbyChains: ['sm', 'puregold', 'dali', 'landers'] },
  { id: 'makati', name: 'Makati', province: 'NCR', pricingZone: 'Mega Manila', nearbyChains: ['sm', 'puregold', 'landers', 'snr'] },
  { id: 'qc', name: 'Quezon City', province: 'NCR', pricingZone: 'Mega Manila', nearbyChains: ['sm', 'puregold', 'dali', 'landers', 'snr'] },
  { id: 'pasig', name: 'Pasig', province: 'NCR', pricingZone: 'Mega Manila', nearbyChains: ['sm', 'puregold', 'dali', 'landers', 'snr'] },
  { id: 'taguig', name: 'Taguig', province: 'NCR', pricingZone: 'Mega Manila', nearbyChains: ['sm', 'landers', 'snr', 'puregold'] },
  { id: 'mandaluyong', name: 'Mandaluyong', province: 'NCR', pricingZone: 'Mega Manila', nearbyChains: ['sm', 'puregold', 'dali', 'snr'] },
  { id: 'antipolo', name: 'Antipolo', province: 'Rizal', pricingZone: 'Mega Manila', nearbyChains: ['sm', 'puregold', 'dali'] },
  { id: 'santarosa', name: 'Santa Rosa', province: 'Laguna', pricingZone: 'Mega Manila', nearbyChains: ['sm', 'puregold', 'dali', 'landers', 'snr'] },
  { id: 'malolos', name: 'Malolos', province: 'Bulacan', pricingZone: 'Mega Manila', nearbyChains: ['sm', 'puregold', 'dali'] },
  // Out-of-zone examples to demonstrate honest reference fallback banner
  { id: 'cebu', name: 'Cebu City', province: 'Cebu', pricingZone: 'Out of Zone', nearbyChains: ['sm', 'puregold', 'landers', 'snr'] },
  { id: 'davao', name: 'Davao City', province: 'Davao del Sur', pricingZone: 'Out of Zone', nearbyChains: ['sm', 'puregold', 'snr'] },
];

export const INITIAL_SHOPPING_LIST: ShoppingListItem[] = [
  {
    id: 'li-1',
    kind: 'product',
    groupId: 'choc-spread',
    productId: 'nutella-350',
    label: 'Nutella Hazelnut Spread 350g',
    quantity: 1,
  },
  {
    id: 'li-2',
    kind: 'product',
    groupId: 'cooking-oil',
    productId: 'minola-1l',
    label: 'Minola Coconut Cooking Oil 1L',
    quantity: 1,
  },
  {
    id: 'li-3',
    kind: 'product',
    groupId: 'corned-beef',
    productId: 'purefoods-150',
    label: 'Purefoods Corned Beef 150g',
    quantity: 2,
  },
  {
    id: 'li-4',
    kind: 'product',
    groupId: 'detergent',
    productId: 'ariel-1100',
    label: 'Ariel Sunrise Fresh 1.1kg',
    quantity: 1,
  },
  {
    id: 'li-5',
    kind: 'generic',
    groupId: 'milk-1l',
    label: 'Full Cream Milk 1L (Any brand)',
    quantity: 2,
  },
];
