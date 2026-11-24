import {
  CHAIN_LIST,
  PRICE_OBSERVATIONS,
  PRODUCTS,
  RETAIL_CHAINS,
  SUBSTITUTE_GROUPS,
} from './catalog';
import type {
  BasketMode,
  EnrichedObservation,
  Product,
  RetailChain,
  RetailChainId,
  ShoppingListItem,
  SortMode,
  SubstituteGroup,
} from './types';

export function formatPeso(amount: number): string {
  return Number.isInteger(amount) ? `₱${amount}` : `₱${amount.toFixed(2)}`;
}

export function computeUnitPrice(product: Product, shelfPricePeso: number): number {
  if (product.unitKind === 'pc') {
    return shelfPricePeso / product.netAmount;
  }
  // Normalize g -> 100g, mL -> 100mL
  return (shelfPricePeso / product.netAmount) * 100;
}

export function formatUnitPrice(unitPricePeso: number, unitDisplayLabel: SubstituteGroup['unitDisplayLabel']): string {
  return `₱${unitPricePeso.toFixed(2)}/${unitDisplayLabel.replace('₱/', '')}`;
}

export function formatVerifiedAge(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return '1d ago';
  return `${days}d ago`;
}

export function isClubEligible(
  chainId: RetailChainId,
  optedInClubs: Record<'landers' | 'snr', boolean>
): boolean {
  if (chainId === 'landers') return optedInClubs.landers;
  if (chainId === 'snr') return optedInClubs.snr;
  return true;
}

export function enrichObservations(
  observations: typeof PRICE_OBSERVATIONS,
  optedInClubs: Record<'landers' | 'snr', boolean>,
  flaggedIds: Set<string>,
  sortMode: SortMode
): EnrichedObservation[] {
  const productMap = new Map(PRODUCTS.map((p) => [p.id, p]));
  const groupMap = new Map(SUBSTITUTE_GROUPS.map((g) => [g.id, g]));

  const base = observations
    .map((obs) => {
      const product = productMap.get(obs.productId);
      if (!product) return null;
      const group = groupMap.get(product.groupId);
      const chain = RETAIL_CHAINS[obs.chainId];
      if (!group || !chain) return null;

      const unitPricePeso = computeUnitPrice(product, obs.shelfPricePeso);
      const isEligible = isClubEligible(chain.id, optedInClubs);

      return {
        observation: obs,
        product,
        chain,
        group,
        unitPricePeso,
        unitPriceFormatted: formatUnitPrice(unitPricePeso, group.unitDisplayLabel),
        isMemberOnly: chain.memberOnly,
        isEligible,
        isStale: obs.verifiedDaysAgo > 14,
        isBestUnitPrice: false,
        isLowestUpfrontPrice: false,
        isFlagged: flaggedIds.has(obs.id),
      };
    })
    .filter((item): item is EnrichedObservation => item !== null);

  const eligible = base.filter((e) => e.isEligible);
  if (eligible.length > 0) {
    const minUnit = Math.min(...eligible.map((e) => e.unitPricePeso));
    const minShelf = Math.min(...eligible.map((e) => e.observation.shelfPricePeso));

    let bestUnitMarked = false;
    let lowestUpfrontMarked = false;
    for (const item of base) {
      if (!item.isEligible) continue;
      if (!bestUnitMarked && Math.abs(item.unitPricePeso - minUnit) < 0.001) {
        item.isBestUnitPrice = true;
        bestUnitMarked = true;
      }
      if (!lowestUpfrontMarked && Math.abs(item.observation.shelfPricePeso - minShelf) < 0.001) {
        item.isLowestUpfrontPrice = true;
        lowestUpfrontMarked = true;
      }
    }
  }

  return [...base].sort((a, b) => {
    // Keep eligible observations ranked ahead of locked Member Only items, or sort purely by price
    // Show all visible prices cleanly sorted by requested price axis, with eligible tie-breaker
    const metricA = sortMode === 'unit' ? a.unitPricePeso : a.observation.shelfPricePeso;
    const metricB = sortMode === 'unit' ? b.unitPricePeso : b.observation.shelfPricePeso;
    if (Math.abs(metricA - metricB) > 0.001) return metricA - metricB;
    if (a.isEligible !== b.isEligible) return a.isEligible ? -1 : 1;
    return a.observation.shelfPricePeso - b.observation.shelfPricePeso;
  });
}

export interface SearchResolution {
  kind: 'product' | 'group' | 'empty';
  query: string;
  matchedProduct?: Product;
  matchedGroup?: SubstituteGroup;
  exactRows: EnrichedObservation[];
  substituteRows: EnrichedObservation[];
}

export function resolveCompareSearch(
  query: string,
  selectedGroupId: string | null,
  selectedProductId: string | null,
  optedInClubs: Record<'landers' | 'snr', boolean>,
  flaggedIds: Set<string>,
  sortMode: SortMode
): SearchResolution {
  const trimmed = query.trim().toLowerCase();

  // 1. Direct selected product focus (unless query changed away from it)
  if (selectedProductId) {
    const prod = PRODUCTS.find((p) => p.id === selectedProductId);
    if (prod) {
      const grp = SUBSTITUTE_GROUPS.find((g) => g.id === prod.groupId)!;
      const exactObs = PRICE_OBSERVATIONS.filter((o) => o.productId === prod.id);
      const subObs = PRICE_OBSERVATIONS.filter((o) => {
        const p = PRODUCTS.find((x) => x.id === o.productId);
        return p && p.groupId === prod.groupId && p.id !== prod.id;
      });
      return {
        kind: 'product',
        query,
        matchedProduct: prod,
        matchedGroup: grp,
        exactRows: enrichObservations(exactObs, optedInClubs, flaggedIds, sortMode),
        substituteRows: enrichObservations(subObs, optedInClubs, flaggedIds, sortMode),
      };
    }
  }

  // 2. If user typed a search query, match specific product first, then substitute group
  if (trimmed.length > 0) {
    const matchedProd = PRODUCTS.find((p) => {
      const full = `${p.brand} ${p.name} ${p.packLabel}`.toLowerCase();
      return full.includes(trimmed) || p.brand.toLowerCase() === trimmed;
    });

    // If query uniquely leans toward a specific brand (e.g. "nutella", "minola", "purefoods", "ariel")
    if (matchedProd) {
      const grp = SUBSTITUTE_GROUPS.find((g) => g.id === matchedProd.groupId)!;
      const exactObs = PRICE_OBSERVATIONS.filter((o) => o.productId === matchedProd.id);
      const subObs = PRICE_OBSERVATIONS.filter((o) => {
        const p = PRODUCTS.find((x) => x.id === o.productId);
        return p && p.groupId === matchedProd.groupId && p.id !== matchedProd.id;
      });
      return {
        kind: 'product',
        query,
        matchedProduct: matchedProd,
        matchedGroup: grp,
        exactRows: enrichObservations(exactObs, optedInClubs, flaggedIds, sortMode),
        substituteRows: enrichObservations(subObs, optedInClubs, flaggedIds, sortMode),
      };
    }

    const matchedGroup = SUBSTITUTE_GROUPS.find(
      (g) =>
        g.label.toLowerCase().includes(trimmed) ||
        g.shortLabel.toLowerCase().includes(trimmed) ||
        g.keywords.some((kw) => trimmed.includes(kw) || kw.includes(trimmed))
    );

    if (matchedGroup) {
      const grpObs = PRICE_OBSERVATIONS.filter((o) => {
        const p = PRODUCTS.find((x) => x.id === o.productId);
        return p?.groupId === matchedGroup.id;
      });
      return {
        kind: 'group',
        query,
        matchedGroup,
        exactRows: [],
        substituteRows: enrichObservations(grpObs, optedInClubs, flaggedIds, sortMode),
      };
    }

    return {
      kind: 'empty',
      query,
      exactRows: [],
      substituteRows: [],
    };
  }

  // 3. Fallback to selectedGroupId or first group ("Chocolate Hazelnut Spread")
  const activeGroup =
    SUBSTITUTE_GROUPS.find((g) => g.id === selectedGroupId) ?? SUBSTITUTE_GROUPS[0];
  const grpObs = PRICE_OBSERVATIONS.filter((o) => {
    const p = PRODUCTS.find((x) => x.id === o.productId);
    return p?.groupId === activeGroup.id;
  });

  return {
    kind: 'group',
    query,
    matchedGroup: activeGroup,
    exactRows: [],
    substituteRows: enrichObservations(grpObs, optedInClubs, flaggedIds, sortMode),
  };
}

export interface ResolvedBasketLine {
  item: ShoppingListItem;
  chainId: RetailChainId;
  chosenProduct: Product;
  shelfPricePeso: number;
  lineTotalPeso: number;
  storeBranch: string;
  verifiedDaysAgo: number;
  isSubstitute: boolean;
}

export interface ChainBasketSummary {
  chain: RetailChain;
  carriedCount: number;
  totalCount: number;
  totalShelfPricePeso: number;
  lines: ResolvedBasketLine[];
  uncarriedItems: ShoppingListItem[];
}

export interface TwoStoreSplitSummary {
  chains: [RetailChain, RetailChain];
  carriedCount: number;
  totalCount: number;
  totalShelfPricePeso: number;
  lines: ResolvedBasketLine[];
  uncarriedItems: ShoppingListItem[];
  savingsVsBestOneStop: number;
}

export interface SwapSuggestion {
  itemId: string;
  currentProductLabel: string;
  suggestedProduct: Product;
  suggestedChain: RetailChain;
  savingsPeso: number;
}

export interface BasketAnalysis {
  mode: BasketMode;
  oneStopRankings: ChainBasketSummary[];
  bestOneStop: ChainBasketSummary | null;
  recommendedTwoStoreSplit: TwoStoreSplitSummary | null;
  swapSuggestions: SwapSuggestion[];
}

function findBestObservationForItemAtChain(
  item: ShoppingListItem,
  chainId: RetailChainId,
  mode: BasketMode
): { product: Product; shelfPricePeso: number; storeBranch: string; verifiedDaysAgo: number; isSubstitute: boolean } | null {
  const candidates = PRICE_OBSERVATIONS.filter((obs) => {
    if (obs.chainId !== chainId) return false;
    const prod = PRODUCTS.find((p) => p.id === obs.productId);
    if (!prod) return false;
    if (item.kind === 'product' && mode === 'exact') {
      return prod.id === item.productId;
    }
    return prod.groupId === item.groupId;
  });

  if (candidates.length === 0) return null;

  // Pick best Unit Price within the chain (honoring pack-size band / unit math)
  let best = candidates[0];
  let bestProd = PRODUCTS.find((p) => p.id === best.productId)!;
  let bestUnit = computeUnitPrice(bestProd, best.shelfPricePeso);

  for (let i = 1; i < candidates.length; i++) {
    const obs = candidates[i];
    const prod = PRODUCTS.find((p) => p.id === obs.productId)!;
    const unit = computeUnitPrice(prod, obs.shelfPricePeso);
    // Prefer exact product on tie or close unit price; otherwise pick lowest unit price
    if (unit < bestUnit - 0.01) {
      best = obs;
      bestProd = prod;
      bestUnit = unit;
    }
  }

  return {
    product: bestProd,
    shelfPricePeso: best.shelfPricePeso,
    storeBranch: best.storeBranch,
    verifiedDaysAgo: best.verifiedDaysAgo,
    isSubstitute: item.kind === 'product' && bestProd.id !== item.productId,
  };
}

export function computeBasketAnalysis(
  items: ShoppingListItem[],
  mode: BasketMode,
  optedInClubs: Record<'landers' | 'snr', boolean>
): BasketAnalysis {
  const eligibleChains = CHAIN_LIST.filter((c) => isClubEligible(c.id, optedInClubs));

  const oneStopRankings: ChainBasketSummary[] = eligibleChains.map((chain) => {
    const lines: ResolvedBasketLine[] = [];
    const uncarriedItems: ShoppingListItem[] = [];

    for (const item of items) {
      const match = findBestObservationForItemAtChain(item, chain.id, mode);
      if (!match) {
        uncarriedItems.push(item);
      } else {
        lines.push({
          item,
          chainId: chain.id,
          chosenProduct: match.product,
          shelfPricePeso: match.shelfPricePeso,
          lineTotalPeso: match.shelfPricePeso * item.quantity,
          storeBranch: match.storeBranch,
          verifiedDaysAgo: match.verifiedDaysAgo,
          isSubstitute: match.isSubstitute,
        });
      }
    }

    const totalShelfPricePeso = lines.reduce((acc, l) => acc + l.lineTotalPeso, 0);
    return {
      chain,
      carriedCount: lines.length,
      totalCount: items.length,
      totalShelfPricePeso,
      lines,
      uncarriedItems,
    };
  });

  // Coverage honesty: ALWAYS rank higher carriedCount first, then lowest Shelf Price sum
  oneStopRankings.sort((a, b) => {
    if (b.carriedCount !== a.carriedCount) return b.carriedCount - a.carriedCount;
    return a.totalShelfPricePeso - b.totalShelfPricePeso;
  });

  const bestOneStop = oneStopRankings[0] ?? null;

  // Evaluate practical 2-store split among eligible chains
  let bestSplitCandidate: TwoStoreSplitSummary | null = null;
  for (let i = 0; i < eligibleChains.length; i++) {
    for (let j = i + 1; j < eligibleChains.length; j++) {
      const c1 = eligibleChains[i];
      const c2 = eligibleChains[j];
      const lines: ResolvedBasketLine[] = [];
      const uncarriedItems: ShoppingListItem[] = [];

      for (const item of items) {
        const m1 = findBestObservationForItemAtChain(item, c1.id, mode);
        const m2 = findBestObservationForItemAtChain(item, c2.id, mode);

        let chosen: { chainId: RetailChainId; match: NonNullable<typeof m1> } | null = null;
        if (m1 && m2) {
          chosen =
            m1.shelfPricePeso <= m2.shelfPricePeso
              ? { chainId: c1.id, match: m1 }
              : { chainId: c2.id, match: m2 };
        } else if (m1) {
          chosen = { chainId: c1.id, match: m1 };
        } else if (m2) {
          chosen = { chainId: c2.id, match: m2 };
        }

        if (!chosen) {
          uncarriedItems.push(item);
        } else {
          lines.push({
            item,
            chainId: chosen.chainId,
            chosenProduct: chosen.match.product,
            shelfPricePeso: chosen.match.shelfPricePeso,
            lineTotalPeso: chosen.match.shelfPricePeso * item.quantity,
            storeBranch: chosen.match.storeBranch,
            verifiedDaysAgo: chosen.match.verifiedDaysAgo,
            isSubstitute: chosen.match.isSubstitute,
          });
        }
      }

      const carriedCount = lines.length;
      const totalShelfPricePeso = lines.reduce((acc, l) => acc + l.lineTotalPeso, 0);

      if (
        !bestSplitCandidate ||
        carriedCount > bestSplitCandidate.carriedCount ||
        (carriedCount === bestSplitCandidate.carriedCount &&
          totalShelfPricePeso < bestSplitCandidate.totalShelfPricePeso)
      ) {
        bestSplitCandidate = {
          chains: [c1, c2],
          carriedCount,
          totalCount: items.length,
          totalShelfPricePeso,
          lines,
          uncarriedItems,
          savingsVsBestOneStop: 0,
        };
      }
    }
  }

  let recommendedTwoStoreSplit: TwoStoreSplitSummary | null = null;
  if (bestSplitCandidate && bestOneStop && items.length > 0) {
    const delta = bestOneStop.totalShelfPricePeso - bestSplitCandidate.totalShelfPricePeso;
    // Only recommend 2-store split if coverage is >= best 1-stop AND it genuinely saves pesos (or unlocks missing items)
    if (
      (bestSplitCandidate.carriedCount > bestOneStop.carriedCount) ||
      (bestSplitCandidate.carriedCount === bestOneStop.carriedCount && delta > 0)
    ) {
      recommendedTwoStoreSplit = {
        ...bestSplitCandidate,
        savingsVsBestOneStop: Math.max(0, delta),
      };
    }
  }

  // 1-tap swap-to-save chips for specific products that have cheaper substitutes
  const swapSuggestions: SwapSuggestion[] = [];
  if (mode === 'exact') {
    for (const item of items) {
      if (item.kind !== 'product' || !item.productId) continue;
      const currentObs = PRICE_OBSERVATIONS.filter(
        (o) => o.productId === item.productId && isClubEligible(o.chainId, optedInClubs)
      );
      if (currentObs.length === 0) continue;
      const minCurrent = Math.min(...currentObs.map((o) => o.shelfPricePeso));

      const altObs = PRICE_OBSERVATIONS.filter((o) => {
        if (!isClubEligible(o.chainId, optedInClubs)) return false;
        const p = PRODUCTS.find((x) => x.id === o.productId);
        return p && p.groupId === item.groupId && p.id !== item.productId;
      });
      if (altObs.length === 0) continue;
      altObs.sort((a, b) => a.shelfPricePeso - b.shelfPricePeso);
      const cheapestAlt = altObs[0];
      const savings = (minCurrent - cheapestAlt.shelfPricePeso) * item.quantity;
      if (savings >= 5) {
        const prod = PRODUCTS.find((p) => p.id === cheapestAlt.productId)!;
        const chain = RETAIL_CHAINS[cheapestAlt.chainId];
        swapSuggestions.push({
          itemId: item.id,
          currentProductLabel: item.label,
          suggestedProduct: prod,
          suggestedChain: chain,
          savingsPeso: savings,
        });
      }
    }
  }

  return {
    mode,
    oneStopRankings,
    bestOneStop,
    recommendedTwoStoreSplit,
    swapSuggestions,
  };
}

export function formatShoppingListAsText(
  items: ShoppingListItem[],
  checkedIds: Set<string>,
  analysis: BasketAnalysis
): string {
  const header =
    analysis.recommendedTwoStoreSplit && analysis.recommendedTwoStoreSplit.savingsVsBestOneStop > 0
      ? `PresyoCheck Shopping List (2-Store Split: ${analysis.recommendedTwoStoreSplit.chains
          .map((c) => c.shortName)
          .join(' + ')} · ${formatPeso(analysis.recommendedTwoStoreSplit.totalShelfPricePeso)})`
      : analysis.bestOneStop
      ? `PresyoCheck Shopping List (1-Stop: ${analysis.bestOneStop.chain.name} · ${formatPeso(
          analysis.bestOneStop.totalShelfPricePeso
        )})`
      : 'PresyoCheck Shopping List';

  const rows = items.map((item) => {
    const mark = checkedIds.has(item.id) ? '[x]' : '[ ]';
    return `${mark} ${item.quantity}x ${item.label}`;
  });

  return [header, '---', ...rows].join('\n');
}
