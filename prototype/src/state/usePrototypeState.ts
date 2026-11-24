import { useMemo, useState } from 'react';
import { CITIES, INITIAL_SHOPPING_LIST, PRODUCTS, RETAIL_CHAINS } from '../data/catalog';
import {
  computeBasketAnalysis,
  formatShoppingListAsText,
  resolveCompareSearch,
} from '../data/pricing';
import type {
  BasketMode,
  CityOption,
  PriceFlagRecord,
  Product,
  ShoppingListItem,
  SortMode,
  SubstituteGroup,
} from '../data/types';

export interface PrototypeActions {
  setSearchQuery: (q: string) => void;
  selectGroup: (groupId: string) => void;
  selectProduct: (productId: string | null) => void;
  setSortMode: (mode: SortMode) => void;
  setCityId: (cityId: string) => void;
  toggleClub: (clubId: 'landers' | 'snr') => void;
  setBasketMode: (mode: BasketMode) => void;
  addProductToList: (product: Product) => void;
  addGroupToList: (group: SubstituteGroup) => void;
  removeListItem: (itemId: string) => void;
  updateListQuantity: (itemId: string, delta: number) => void;
  toggleCheckOff: (itemId: string) => void;
  swapListItem: (itemId: string, newProduct: Product) => void;
  flagObservation: (
    observationId: string,
    productName: string,
    chainName: string,
    observedPeso?: number
  ) => void;
  toggleOfflineMode: () => void;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  copyListToClipboard: () => Promise<string>;
}

export interface PrototypeState {
  searchQuery: string;
  selectedGroupId: string;
  selectedProductId: string | null;
  sortMode: SortMode;
  city: CityOption;
  optedInClubs: Record<'landers' | 'snr', boolean>;
  shoppingList: ShoppingListItem[];
  checkedOffIds: Set<string>;
  basketMode: BasketMode;
  flaggedIds: Set<string>;
  flagHistory: PriceFlagRecord[];
  isOfflineSimulated: boolean;
  onboardingOpen: boolean;
  lastCopiedText: string | null;
  searchResult: ReturnType<typeof resolveCompareSearch>;
  basketAnalysis: ReturnType<typeof computeBasketAnalysis>;
}

export function usePrototypeState(): [PrototypeState, PrototypeActions] {
  const [searchQuery, setSearchQueryRaw] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('choc-spread');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('unit');
  const [cityId, setCityId] = useState('imus');
  const [optedInClubs, setOptedInClubs] = useState<Record<'landers' | 'snr', boolean>>({
    landers: false,
    snr: false,
  });
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(INITIAL_SHOPPING_LIST);
  const [checkedOffIds, setCheckedOffIds] = useState<Set<string>>(() => new Set());
  const [basketMode, setBasketMode] = useState<BasketMode>('exact');
  const [flagHistory, setFlagHistory] = useState<PriceFlagRecord[]>([]);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [lastCopiedText, setLastCopiedText] = useState<string | null>(null);

  const city = useMemo(
    () => CITIES.find((c) => c.id === cityId) ?? CITIES[0],
    [cityId]
  );

  const flaggedIds = useMemo(
    () => new Set(flagHistory.map((f) => f.observationId)),
    [flagHistory]
  );

  const searchResult = useMemo(
    () =>
      resolveCompareSearch(
        searchQuery,
        selectedGroupId,
        selectedProductId,
        optedInClubs,
        flaggedIds,
        sortMode
      ),
    [searchQuery, selectedGroupId, selectedProductId, optedInClubs, flaggedIds, sortMode]
  );

  const basketAnalysis = useMemo(
    () => computeBasketAnalysis(shoppingList, basketMode, optedInClubs),
    [shoppingList, basketMode, optedInClubs]
  );

  const actions: PrototypeActions = {
    setSearchQuery: (q: string) => {
      setSearchQueryRaw(q);
      setSelectedProductId(null);
    },
    selectGroup: (groupId: string) => {
      setSelectedGroupId(groupId);
      setSelectedProductId(null);
      setSearchQueryRaw('');
    },
    selectProduct: (productId: string | null) => {
      setSelectedProductId(productId);
      if (productId) {
        const p = PRODUCTS.find((item) => item.id === productId);
        if (p) setSelectedGroupId(p.groupId);
      }
    },
    setSortMode,
    setCityId,
    toggleClub: (clubId: 'landers' | 'snr') => {
      setOptedInClubs((prev) => ({ ...prev, [clubId]: !prev[clubId] }));
    },
    setBasketMode,
    addProductToList: (product: Product) => {
      setShoppingList((prev) => {
        const existing = prev.find(
          (item) => item.kind === 'product' && item.productId === product.id
        );
        if (existing) {
          return prev.map((item) =>
            item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [
          ...prev,
          {
            id: `li-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            kind: 'product',
            groupId: product.groupId,
            productId: product.id,
            label: `${product.brand} ${product.name.replace(product.brand, '').trim()} ${product.packLabel}`,
            quantity: 1,
          },
        ];
      });
    },
    addGroupToList: (group: SubstituteGroup) => {
      setShoppingList((prev) => {
        const existing = prev.find(
          (item) => item.kind === 'generic' && item.groupId === group.id
        );
        if (existing) {
          return prev.map((item) =>
            item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [
          ...prev,
          {
            id: `li-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            kind: 'generic',
            groupId: group.id,
            label: `${group.label} (Any brand)`,
            quantity: 1,
          },
        ];
      });
    },
    removeListItem: (itemId: string) => {
      setShoppingList((prev) => prev.filter((item) => item.id !== itemId));
      setCheckedOffIds((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    },
    updateListQuantity: (itemId: string, delta: number) => {
      setShoppingList((prev) =>
        prev
          .map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity + delta } : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    toggleCheckOff: (itemId: string) => {
      setCheckedOffIds((prev) => {
        const next = new Set(prev);
        if (next.has(itemId)) next.delete(itemId);
        else next.add(itemId);
        return next;
      });
    },
    swapListItem: (itemId: string, newProduct: Product) => {
      setShoppingList((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                kind: 'product',
                productId: newProduct.id,
                groupId: newProduct.groupId,
                label: `${newProduct.brand} ${newProduct.name.replace(newProduct.brand, '').trim()} ${newProduct.packLabel}`,
              }
            : item
        )
      );
    },
    flagObservation: (
      observationId: string,
      productName: string,
      chainName: string,
      observedPeso?: number
    ) => {
      setFlagHistory((prev) => {
        if (prev.some((f) => f.observationId === observationId)) return prev;
        return [
          ...prev,
          {
            observationId,
            productName,
            chainName,
            observedPeso,
            queuedOffline: isOfflineSimulated,
            flaggedAtLabel: isOfflineSimulated ? 'Queued offline' : 'Sent to Curator queue',
          },
        ];
      });
    },
    toggleOfflineMode: () => setIsOfflineSimulated((prev) => !prev),
    openOnboarding: () => setOnboardingOpen(true),
    closeOnboarding: () => setOnboardingOpen(false),
    copyListToClipboard: async () => {
      const text = formatShoppingListAsText(shoppingList, checkedOffIds, basketAnalysis);
      setLastCopiedText(text);
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        }
      } catch {
        // Clipboard permission optional in prototype
      }
      return text;
    },
  };

  return [
    {
      searchQuery,
      selectedGroupId,
      selectedProductId,
      sortMode,
      city,
      optedInClubs,
      shoppingList,
      checkedOffIds,
      basketMode,
      flaggedIds,
      flagHistory,
      isOfflineSimulated,
      onboardingOpen,
      lastCopiedText,
      searchResult,
      basketAnalysis,
    },
    actions,
  ];
}

export { RETAIL_CHAINS };
