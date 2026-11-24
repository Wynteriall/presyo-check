import { useState } from 'react';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Flag,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  WifiOff,
  X,
} from 'lucide-react';
import { CITIES, RETAIL_CHAINS, SUBSTITUTE_GROUPS } from '../../data/catalog';
import { formatPeso, formatVerifiedAge } from '../../data/pricing';
import type { EnrichedObservation, RetailChainId } from '../../data/types';
import type { PrototypeActions, PrototypeState } from '../../state/usePrototypeState';

interface VariantProps {
  state: PrototypeState;
  actions: PrototypeActions;
  isPhonePreview: boolean;
}

type TabC = 'compare' | 'list' | 'zones';
type MatrixFilter = 'all' | 'exact' | 'subs';

export function VariantC({ state, actions, isPhonePreview }: VariantProps) {
  const [tab, setTab] = useState<TabC>('compare');
  const [matrixFilter, setMatrixFilter] = useState<MatrixFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [flagPesoMap, setFlagPesoMap] = useState<Record<string, string>>({});
  const [cityFilter, setCityFilter] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const totalQty = state.shoppingList.reduce((acc, i) => acc + i.quantity, 0);
  const filteredCities = CITIES.filter((c) =>
    `${c.name} ${c.province}`.toLowerCase().includes(cityFilter.trim().toLowerCase())
  );

  const handleCopy = async () => {
    await actions.copyListToClipboard();
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2200);
  };

  const renderMatrixRow = (row: EnrichedObservation) => {
    const isExpanded = expandedId === row.observation.id;
    const isLocked = row.isMemberOnly && !row.isEligible;

    return (
      <div
        key={row.observation.id}
        className={`rounded-xl border transition ${
          row.isBestUnitPrice
            ? 'border-[#C8FF3D]/60 bg-[#1B2418]'
            : isLocked
            ? 'border-white/10 bg-[#121820]/70 opacity-80'
            : 'border-white/10 bg-[#161D27]'
        }`}
      >
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button
            type="button"
            onClick={() => setExpandedId(isExpanded ? null : row.observation.id)}
            className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-grotesk text-xs font-bold uppercase tracking-wider text-zinc-200">
                  {row.chain.shortName}
                </span>
                {row.product.isHouseBrand && (
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-300">
                    House
                  </span>
                )}
                {row.isMemberOnly && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      row.isEligible
                        ? 'bg-[#38BDF8]/20 text-[#38BDF8]'
                        : 'border border-[#38BDF8]/40 text-[#38BDF8]/80'
                    }`}
                  >
                    Member Only
                  </span>
                )}
                {row.isLowestUpfrontPrice && !row.isBestUnitPrice && (
                  <span className="rounded bg-[#FFB020]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FFB020]">
                    Lowest Upfront
                  </span>
                )}
                {row.isStale && (
                  <span className="rounded bg-[#FFB020]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FFB020]">
                    &gt;14d
                  </span>
                )}
                {row.isFlagged && (
                  <span className="rounded bg-[#FF5C5C]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FF5C5C]">
                    Flagged
                  </span>
                )}
              </div>
              <div className="mt-0.5 truncate text-xs font-medium text-zinc-100">
                {row.product.name}{' '}
                <span className="text-zinc-400">· {row.product.packLabel}</span>
              </div>
            </div>

            <div className="shrink-0 text-right font-mono-code">
              <div
                className={`text-sm font-bold ${
                  row.isBestUnitPrice ? 'text-[#C8FF3D]' : 'text-white'
                }`}
              >
                {state.sortMode === 'unit'
                  ? row.unitPriceFormatted
                  : formatPeso(row.observation.shelfPricePeso)}
              </div>
              <div className="text-[10px] text-zinc-400">
                {state.sortMode === 'unit'
                  ? `Shelf ${formatPeso(row.observation.shelfPricePeso)}`
                  : row.unitPriceFormatted}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => actions.addProductToList(row.product)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-[#C8FF3D] transition hover:bg-[#C8FF3D] hover:text-[#0D1117]"
            aria-label={`Add ${row.product.name} to list`}
            title="Add to Shopping List"
          >
            <Plus className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setExpandedId(isExpanded ? null : row.observation.id)}
            className="text-zinc-500 hover:text-zinc-200"
            aria-label="Toggle row details"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {isExpanded && (
          <div className="border-t border-white/10 bg-black/25 px-3 py-2.5 text-xs text-zinc-300">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div>
                  <span className="text-zinc-500">Store Branch:</span>{' '}
                  <span className="font-medium text-zinc-100">
                    {row.observation.storeBranch}
                  </span>{' '}
                  <span className="text-zinc-500">({row.observation.pricingZone})</span>
                </div>
                <div>
                  <span className="text-zinc-500">Verified:</span>{' '}
                  <span className={row.isStale ? 'font-bold text-[#FFB020]' : 'text-zinc-200'}>
                    {formatVerifiedAge(row.observation.verifiedDaysAgo)}
                    {row.isStale && ' — May be outdated'}
                  </span>
                </div>
                {row.product.dtiSrpPeso && (
                  <div className="font-mono-code text-[11px] text-[#38BDF8]">
                    DTI SRP Reference: {formatPeso(row.product.dtiSrpPeso)}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {isLocked && (
                  <button
                    type="button"
                    onClick={() => actions.toggleClub(row.chain.id as 'landers' | 'snr')}
                    className="rounded-lg border border-[#38BDF8]/50 bg-[#38BDF8]/15 px-2.5 py-1 text-[11px] font-semibold text-[#38BDF8]"
                  >
                    Opt into {row.chain.shortName}
                  </button>
                )}
                {state.searchResult.kind === 'group' && (
                  <button
                    type="button"
                    onClick={() => actions.selectProduct(row.product.id)}
                    className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-zinc-200"
                  >
                    Exact Pack
                  </button>
                )}
              </div>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2">
              {row.isFlagged ? (
                <span className="font-mono-code text-[11px] font-bold text-[#FF5C5C]">
                  ✓ Price Flag recorded ({state.isOfflineSimulated ? 'queued offline' : 'Curator queue'})
                </span>
              ) : (
                <>
                  <input
                    type="number"
                    placeholder="Observed ₱ (opt)"
                    value={flagPesoMap[row.observation.id] ?? ''}
                    onChange={(e) =>
                      setFlagPesoMap((prev) => ({
                        ...prev,
                        [row.observation.id]: e.target.value,
                      }))
                    }
                    className="w-32 rounded-lg border border-white/15 bg-[#0D1117] px-2.5 py-1 font-mono-code text-[11px] text-white placeholder:text-zinc-500 focus:border-[#FF5C5C] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = flagPesoMap[row.observation.id];
                      const parsed = val ? Number(val) : undefined;
                      actions.flagObservation(
                        row.observation.id,
                        row.product.name,
                        row.chain.shortName,
                        Number.isFinite(parsed) ? parsed : undefined
                      );
                    }}
                    className="flex items-center gap-1 rounded-lg border border-[#FF5C5C]/40 bg-[#FF5C5C]/15 px-2.5 py-1 text-[11px] font-bold text-[#FF5C5C] hover:bg-[#FF5C5C]/25"
                  >
                    <Flag className="h-3 w-3" />
                    <span>Flag outdated price</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCompareTab = () => {
    const { searchResult } = state;
    const allRows = [...searchResult.exactRows, ...searchResult.substituteRows];
    const winnerRow = allRows.find((r) => r.isBestUnitPrice) ?? allRows.find((r) => r.isEligible);
    const lowestUpfrontRow = allRows.find(
      (r) => r.isLowestUpfrontPrice && !r.isBestUnitPrice
    );

    const visibleRows =
      searchResult.kind === 'product'
        ? matrixFilter === 'exact'
          ? searchResult.exactRows
          : matrixFilter === 'subs'
          ? searchResult.substituteRows
          : allRows
        : searchResult.substituteRows;

    return (
      <div className="space-y-3">
        {searchResult.kind === 'empty' ? (
          <div className="rounded-2xl border border-white/10 bg-[#161D27] p-5 text-center">
            <div className="font-mono-code text-[11px] font-bold uppercase text-[#FFB020]">
              Out of v1 Hero Catalog
            </div>
            <h2 className="font-grotesk mt-1 text-xl font-bold text-white">
              No prices tracked for &ldquo;{state.searchQuery}&rdquo;
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              Jump directly to a tracked Substitute Group:
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {SUBSTITUTE_GROUPS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => actions.selectGroup(g.id)}
                  className="rounded-lg border border-[#C8FF3D]/40 bg-[#C8FF3D]/10 px-3 py-1.5 font-grotesk text-xs font-bold text-[#C8FF3D]"
                >
                  {g.shortLabel}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Luminous Winner Slab */}
            {winnerRow && (
              <div className="rounded-2xl border border-[#C8FF3D]/40 bg-gradient-to-br from-[#1B2618] to-[#161D27] p-4 shadow-[0_0_24px_rgba(200,255,61,0.08)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-[#C8FF3D] px-2.5 py-0.5 font-mono-code text-[10px] font-bold uppercase tracking-wider text-[#0D1117]">
                    Best Unit Value · {winnerRow.chain.shortName}
                  </span>
                  <div className="flex items-center gap-1 rounded-lg bg-black/30 p-0.5 font-mono-code text-[10px]">
                    <button
                      type="button"
                      onClick={() => actions.setSortMode('unit')}
                      className={`rounded px-2 py-0.5 ${
                        state.sortMode === 'unit'
                          ? 'bg-[#C8FF3D] font-bold text-[#0D1117]'
                          : 'text-zinc-400'
                      }`}
                    >
                      Unit ₱
                    </button>
                    <button
                      type="button"
                      onClick={() => actions.setSortMode('shelf')}
                      className={`rounded px-2 py-0.5 ${
                        state.sortMode === 'shelf'
                          ? 'bg-[#C8FF3D] font-bold text-[#0D1117]'
                          : 'text-zinc-400'
                      }`}
                    >
                      Shelf ₱
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 flex items-end justify-between gap-3">
                  <div>
                    <div className="font-mono-code text-3xl font-bold leading-none text-[#C8FF3D]">
                      {winnerRow.unitPriceFormatted}
                    </div>
                    <div className="font-grotesk mt-1 text-base font-bold text-white">
                      {winnerRow.product.name} ({winnerRow.product.packLabel})
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {winnerRow.observation.storeBranch} · Verified{' '}
                      {formatVerifiedAge(winnerRow.observation.verifiedDaysAgo)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono-code text-2xl font-bold text-white">
                      {formatPeso(winnerRow.observation.shelfPricePeso)}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-400">
                      Shelf Price
                    </div>
                  </div>
                </div>

                {lowestUpfrontRow && (
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-[#FFB020]/35 bg-[#FFB020]/10 px-2.5 py-1.5 text-[11px] text-[#FFB020]">
                    <span>
                      Lowest Upfront Shelf Price: <strong>{lowestUpfrontRow.chain.shortName}</strong>{' '}
                      {lowestUpfrontRow.product.brand} ({lowestUpfrontRow.product.packLabel})
                    </span>
                    <span className="font-mono-code font-bold">
                      {formatPeso(lowestUpfrontRow.observation.shelfPricePeso)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Filter & Group Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              {searchResult.kind === 'product' ? (
                <div className="flex items-center gap-1.5">
                  {(
                    [
                      ['all', `All (${allRows.length})`],
                      ['exact', `Exact Pack (${searchResult.exactRows.length})`],
                      ['subs', `Substitutes (${searchResult.substituteRows.length})`],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setMatrixFilter(key)}
                      className={`rounded-lg px-2.5 py-1 font-mono-code text-[11px] font-bold transition ${
                        matrixFilter === key
                          ? 'bg-white text-[#0D1117]'
                          : 'border border-white/10 bg-[#161D27] text-zinc-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => actions.selectProduct(null)}
                    className="ml-1 text-[11px] text-zinc-400 underline hover:text-white"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <div className="font-grotesk text-xs font-bold uppercase tracking-wider text-zinc-400">
                  {searchResult.matchedGroup?.label} ({visibleRows.length} prices)
                </div>
              )}

              {searchResult.matchedGroup && (
                <button
                  type="button"
                  onClick={() => actions.addGroupToList(searchResult.matchedGroup!)}
                  className="font-mono-code text-[11px] font-bold text-[#C8FF3D] hover:underline"
                >
                  + Generic need
                </button>
              )}
            </div>

            {/* Matrix Rows */}
            <div className="space-y-2">{visibleRows.map(renderMatrixRow)}</div>
          </>
        )}
      </div>
    );
  };

  const renderListTab = () => {
    const { basketAnalysis } = state;
    const best = basketAnalysis.bestOneStop;
    const split = basketAnalysis.recommendedTwoStoreSplit;
    const activePlan = split ?? best;

    // Group active plan lines by Store Stop
    const stopMap = new Map<RetailChainId, NonNullable<typeof activePlan>['lines']>();
    if (activePlan) {
      for (const line of activePlan.lines) {
        const arr = stopMap.get(line.chainId) ?? [];
        arr.push(line);
        stopMap.set(line.chainId, arr);
      }
    }

    // Remaining unpaid checkout total excluding checked-off items
    const remainingTotal = activePlan
      ? activePlan.lines
          .filter((l) => !state.checkedOffIds.has(l.item.id))
          .reduce((acc, l) => acc + l.lineTotalPeso, 0)
      : 0;

    return (
      <div className="space-y-3">
        {/* Route Decision Banner */}
        <div className="rounded-2xl border border-white/10 bg-[#161D27] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex rounded-lg border border-white/10 bg-[#0D1117] p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => actions.setBasketMode('exact')}
                className={`rounded-md px-2.5 py-1 ${
                  state.basketMode === 'exact'
                    ? 'bg-white text-[#0D1117]'
                    : 'text-zinc-400'
                }`}
              >
                Exact Brands
              </button>
              <button
                type="button"
                onClick={() => actions.setBasketMode('substitutes')}
                className={`rounded-md px-2.5 py-1 ${
                  state.basketMode === 'substitutes'
                    ? 'bg-[#C8FF3D] font-bold text-[#0D1117]'
                    : 'text-zinc-400'
                }`}
              >
                Best Value (Substitutes)
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 font-mono-code text-[11px] font-bold text-zinc-200 hover:bg-white/10"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy for Messenger</span>
            </button>
          </div>

          {copiedToast && (
            <div className="mt-2 rounded-lg bg-[#C8FF3D]/15 px-3 py-1.5 font-mono-code text-[11px] font-bold text-[#C8FF3D]">
              ✓ Shopping List copied to clipboard
            </div>
          )}

          <div className={`mt-3 grid gap-2 ${isPhonePreview ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
            {best && (
              <div className="rounded-xl border border-white/10 bg-[#0D1117]/70 p-3">
                <div className="flex items-center justify-between gap-2 font-mono-code text-[10px] uppercase text-zinc-400">
                  <span>Best 1-Stop Route</span>
                  <span
                    className={
                      best.carriedCount < best.totalCount
                        ? 'font-bold text-[#FF5C5C]'
                        : 'font-bold text-[#C8FF3D]'
                    }
                  >
                    {best.carriedCount}/{best.totalCount} carried
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-between gap-2">
                  <span className="font-grotesk text-lg font-bold text-white">
                    {best.chain.name}
                  </span>
                  <span className="font-mono-code shrink-0 text-xl font-bold text-white">
                    {formatPeso(best.totalShelfPricePeso)}
                  </span>
                </div>
              </div>
            )}

            {split ? (
              <div className="rounded-xl border border-[#C8FF3D]/50 bg-[#1B2618] p-3">
                <div className="flex items-center justify-between gap-2 font-mono-code text-[10px] uppercase">
                  <span className="text-[#C8FF3D]">2-Store Split</span>
                  {split.savingsVsBestOneStop > 0 && (
                    <span className="rounded bg-[#C8FF3D] px-1.5 py-0.5 font-bold text-[#0D1117]">
                      Save {formatPeso(split.savingsVsBestOneStop)} vs 1-stop
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-baseline justify-between gap-2">
                  <span className="font-grotesk text-lg font-bold text-white">
                    {split.chains.map((c) => c.shortName).join(' + ')}
                  </span>
                  <span className="font-mono-code shrink-0 text-xl font-bold text-[#C8FF3D]">
                    {formatPeso(split.totalShelfPricePeso)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center rounded-xl border border-dashed border-white/15 bg-[#0D1117]/40 p-3 text-xs text-zinc-400">
                1-stop at {best?.chain.shortName} is already cheaper than any 2-store split.
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 font-mono-code text-xs">
            <span className="text-zinc-400">Remaining at Checkout:</span>
            <span className="text-base font-bold text-[#C8FF3D]">
              {formatPeso(remainingTotal)}
            </span>
          </div>
        </div>

        {/* 1-Tap Swap-to-Save */}
        {basketAnalysis.swapSuggestions.length > 0 && (
          <div className="rounded-2xl border border-[#C8FF3D]/25 bg-[#161D27] p-3">
            <div className="font-mono-code text-[10px] font-bold uppercase text-[#C8FF3D]">
              1-Tap Swap to Save
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {basketAnalysis.swapSuggestions.map((sw) => (
                <button
                  key={sw.itemId}
                  type="button"
                  onClick={() => actions.swapListItem(sw.itemId, sw.suggestedProduct)}
                  className="rounded-lg border border-[#C8FF3D]/40 bg-[#C8FF3D]/10 px-2.5 py-1 font-mono-code text-[11px] font-bold text-[#C8FF3D] hover:bg-[#C8FF3D]/20"
                >
                  Swap {sw.currentProductLabel.split(' ')[0]} → {sw.suggestedChain.shortName}{' '}
                  {sw.suggestedProduct.brand} (-{formatPeso(sw.savingsPeso)})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Items Grouped by Store Stop with Large Check-Off Circles */}
        {Array.from(stopMap.entries()).map(([chainId, lines], stopIdx) => {
          const chain = RETAIL_CHAINS[chainId];
          const stopSubtotal = lines.reduce((acc, l) => acc + l.lineTotalPeso, 0);
          return (
            <div
              key={chainId}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#161D27]"
            >
              <div className="flex items-center justify-between border-b border-white/10 bg-black/25 px-3.5 py-2">
                <span className="font-grotesk text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Stop {stopIdx + 1}: {chain.name}
                </span>
                <span className="font-mono-code text-xs font-bold text-[#C8FF3D]">
                  {formatPeso(stopSubtotal)}
                </span>
              </div>

              <div className="divide-y divide-white/5">
                {lines.map((line) => {
                  const checked = state.checkedOffIds.has(line.item.id);
                  return (
                    <div
                      key={line.item.id}
                      className={`flex items-center gap-3 px-3.5 py-3 transition ${
                        checked ? 'opacity-45' : ''
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => actions.toggleCheckOff(line.item.id)}
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          checked
                            ? 'border-[#C8FF3D] bg-[#C8FF3D] text-[#0D1117]'
                            : 'border-zinc-500 bg-transparent'
                        }`}
                        aria-label={`Check off ${line.item.label}`}
                      >
                        {checked && <Check className="h-4 w-4 stroke-[3]" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div
                          className={`truncate text-sm font-semibold text-white ${
                            checked ? 'line-through' : ''
                          }`}
                        >
                          {line.chosenProduct.name} ({line.chosenProduct.packLabel})
                        </div>
                        <div className="font-mono-code text-[10px] text-zinc-400">
                          {line.isSubstitute ? 'House substitute · ' : 'Exact match · '}
                          {line.storeBranch} · {formatPeso(line.lineTotalPeso)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#0D1117] px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => actions.updateListQuantity(line.item.id, -1)}
                          className="p-1 text-zinc-400 hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-mono-code min-w-[18px] text-center text-xs font-bold text-white">
                          {line.item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => actions.updateListQuantity(line.item.id, 1)}
                          className="p-1 text-zinc-400 hover:text-white"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Uncarried Items Band */}
        {activePlan && activePlan.uncarriedItems.length > 0 && (
          <div className="rounded-2xl border border-[#FF5C5C]/40 bg-[#FF5C5C]/10 p-3">
            <div className="font-mono-code text-[10px] font-bold uppercase text-[#FF5C5C]">
              Uncarried in Current Route ({activePlan.uncarriedItems.length})
            </div>
            <div className="mt-1 space-y-1 text-xs text-zinc-200">
              {activePlan.uncarriedItems.map((u) => (
                <div key={u.id}>• {u.label}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderZonesTab = () => (
    <div className="space-y-3">
      <div className="rounded-2xl border border-white/10 bg-[#161D27] p-4">
        <div className="font-mono-code text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          City / Municipality &amp; Pricing Zone
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/15 bg-[#0D1117] px-3 py-2">
          <MapPin className="h-4 w-4 text-[#C8FF3D]" />
          <input
            type="text"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Search Philippine city..."
            className="w-full bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none"
          />
        </div>
        <div className="mt-2.5 grid max-h-48 grid-cols-1 gap-1.5 overflow-y-auto sm:grid-cols-2">
          {filteredCities.map((c) => {
            const active = c.id === state.city.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => actions.setCityId(c.id)}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition ${
                  active
                    ? 'border-[#C8FF3D] bg-[#C8FF3D]/15 font-bold text-[#C8FF3D]'
                    : 'border-white/10 bg-[#0D1117]/60 text-zinc-300 hover:border-white/25'
                }`}
              >
                <span>
                  {c.name}, {c.province}
                </span>
                <span className="font-mono-code text-[10px] opacity-75">
                  {c.pricingZone === 'Out of Zone' ? 'Outside' : 'Mega Manila'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#161D27] p-4">
        <div className="font-mono-code text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Membership Gate Clubs
        </div>
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          {(['landers', 'snr'] as const).map((clubId) => {
            const active = state.optedInClubs[clubId];
            return (
              <button
                key={clubId}
                type="button"
                onClick={() => actions.toggleClub(clubId)}
                className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                  active
                    ? 'border-[#38BDF8] bg-[#38BDF8]/15 text-[#38BDF8]'
                    : 'border-white/10 bg-[#0D1117]/60 text-zinc-300'
                }`}
              >
                <div>
                  <div className="font-grotesk text-sm font-bold">
                    {clubId === 'landers' ? 'Landers Superstore' : 'S&R Membership'}
                  </div>
                  <div className="text-[11px] opacity-80">
                    {active ? 'Included in winners & totals' : 'Member Only (browse only)'}
                  </div>
                </div>
                <ShieldCheck className="h-5 w-5 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-[#161D27] p-4">
        <button
          type="button"
          onClick={actions.toggleOfflineMode}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 font-mono-code text-xs font-bold ${
            state.isOfflineSimulated
              ? 'border-[#FFB020] bg-[#FFB020]/20 text-[#FFB020]'
              : 'border-white/15 bg-[#0D1117] text-zinc-300'
          }`}
        >
          <WifiOff className="h-3.5 w-3.5" />
          <span>{state.isOfflineSimulated ? 'Offline Sim: ON' : 'Simulate Offline'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setTourStep(0);
            actions.openOnboarding();
          }}
          className="flex items-center gap-1.5 rounded-lg bg-[#C8FF3D] px-3 py-2 font-mono-code text-xs font-bold text-[#0D1117]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Replay Walkthrough</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D1117] text-zinc-100">
      {/* Top Frosted Command & Category Rail */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0D1117]/90 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-grotesk text-lg font-bold tracking-tight text-white">
                PRESYO<span className="text-[#C8FF3D]">CHECK</span>
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono-code text-[10px] text-zinc-300">
                {state.city.name}
              </span>
            </div>

            {/* Desktop Top Navigation */}
            {!isPhonePreview && (
              <nav className="hidden md:flex items-center gap-1 rounded-xl border border-white/10 bg-[#161D27] p-1">
                {(
                  [
                    ['compare', 'Compare'],
                    ['list', `List (${totalQty})`],
                    ['zones', 'Zones & Clubs'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`rounded-lg px-3 py-1 font-grotesk text-xs font-bold transition ${
                      tab === id
                        ? 'bg-[#C8FF3D] text-[#0D1117]'
                        : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            )}
          </div>

          {/* Search + Category Chips */}
          <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-white/15 bg-[#161D27] px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-zinc-400" />
            <input
              type="text"
              value={state.searchQuery}
              onChange={(e) => {
                actions.setSearchQuery(e.target.value);
                setTab('compare');
              }}
              placeholder="Search Nutella, cooking oil, milk, coffee..."
              className="w-full bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none"
            />
            {state.searchQuery && (
              <button
                type="button"
                onClick={() => actions.setSearchQuery('')}
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5 text-zinc-400" />
              </button>
            )}
          </div>

          <div className="no-scrollbar mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {SUBSTITUTE_GROUPS.map((g) => {
              const active =
                state.searchResult.matchedGroup?.id === g.id &&
                state.searchQuery.trim() === '' &&
                tab === 'compare';
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    actions.selectGroup(g.id);
                    setTab('compare');
                  }}
                  className={`shrink-0 rounded-full px-3 py-1 font-grotesk text-[11px] font-semibold transition ${
                    active
                      ? 'bg-[#C8FF3D] text-[#0D1117]'
                      : 'border border-white/10 bg-[#161D27] text-zinc-300 hover:border-white/25'
                  }`}
                >
                  {g.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Out-of-zone & Offline Banners */}
      {state.city.pricingZone === 'Out of Zone' && (
        <div className="border-b border-[#FFB020]/30 bg-[#FFB020]/10 px-3 py-1.5 text-center font-mono-code text-[11px] text-[#FFB020]">
          <AlertTriangle className="mr-1 inline h-3.5 w-3.5" />
          Showing Mega Manila reference prices for {state.city.name} — local prices coming soon.
        </div>
      )}
      {state.isOfflineSimulated && (
        <div className="border-b border-[#FFB020]/30 bg-[#FFB020]/15 px-3 py-1.5 text-center font-mono-code text-[11px] text-[#FFB020]">
          Offline Basement Mode · Cached catalog active · Price Flags queued locally
        </div>
      )}

      {/* Main Content */}
      <main className={`mx-auto max-w-5xl px-3 py-4 ${isPhonePreview ? 'pb-36' : 'pb-32 md:pb-24'}`}>
        {tab === 'compare' && renderCompareTab()}
        {tab === 'list' && renderListTab()}
        {tab === 'zones' && renderZonesTab()}
      </main>

      {/* Mobile Floating Frosted Glass Dock */}
      <div
        className={`${
          isPhonePreview ? 'fixed bottom-3' : 'fixed bottom-16 md:hidden'
        } left-1/2 z-30 flex w-[min(92vw,360px)] -translate-x-1/2 items-center gap-1 rounded-2xl border border-white/15 bg-[#161D27]/95 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.55)] backdrop-blur-lg`}
      >
        {(
          [
            ['compare', 'Compare'],
            ['list', `List (${totalQty})`],
            ['zones', 'Zones & Clubs'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 rounded-xl py-2 font-grotesk text-xs font-bold transition ${
              tab === id
                ? 'bg-[#C8FF3D] text-[#0D1117]'
                : 'text-zinc-300 hover:bg-white/5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Full-Bleed 4-Step Illuminated Walkthrough */}
      {state.onboardingOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0D1117]/95 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#161D27] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-1 gap-1.5 pr-4">
                {[0, 1, 2, 3].map((stepIdx) => (
                  <div
                    key={stepIdx}
                    className={`h-1.5 flex-1 rounded-full ${
                      stepIdx <= tourStep ? 'bg-[#C8FF3D]' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={actions.closeOnboarding}
                className="font-mono-code text-xs font-bold uppercase text-zinc-400 hover:text-white"
              >
                Skip
              </button>
            </div>

            {tourStep === 0 && (
              <div className="mt-6">
                <div className="font-mono-code text-[11px] uppercase text-[#C8FF3D]">
                  01 / Search
                </div>
                <h2 className="font-grotesk mt-1 text-2xl font-bold text-white">
                  Search an exact brand or an everyday need
                </h2>
                <p className="mt-2 text-sm text-zinc-300">
                  Type &ldquo;Nutella 350g&rdquo; for exact chain prices, or &ldquo;chocolate
                  spread&rdquo; to rank every brand and house dupe together.
                </p>
              </div>
            )}

            {tourStep === 1 && (
              <div className="mt-6">
                <div className="font-mono-code text-[11px] uppercase text-[#C8FF3D]">
                  02 / Unit Price &amp; Clubs
                </div>
                <h2 className="font-grotesk mt-1 text-2xl font-bold text-white">
                  Normalized Unit Price + honest Member badges
                </h2>
                <p className="mt-2 text-sm text-zinc-300">
                  Compare ₱/100g, ₱/100mL, or ₱/pc across SM, Puregold, and Dali. Landers &amp;
                  S&amp;R stay visible with a cyan <strong>Member Only</strong> tag.
                </p>
              </div>
            )}

            {tourStep === 2 && (
              <div className="mt-6">
                <div className="font-mono-code text-[11px] uppercase text-[#C8FF3D]">
                  03 / Store-Stop Route
                </div>
                <h2 className="font-grotesk mt-1 text-2xl font-bold text-white">
                  1-Stop Convenience vs. 2-Store Split
                </h2>
                <p className="mt-2 text-sm text-zinc-300">
                  See exact coverage (<span className="font-mono-code">X/Y carried</span>) and
                  only split across two stores when it saves real pesos over your best 1-stop chain.
                </p>
              </div>
            )}

            {tourStep === 3 && (
              <div className="mt-6 space-y-3">
                <div className="font-mono-code text-[11px] uppercase text-[#C8FF3D]">
                  04 / Your Setup
                </div>
                <h2 className="font-grotesk text-2xl font-bold text-white">
                  Pick your City &amp; Club Cards
                </h2>
                <select
                  value={state.city.id}
                  onChange={(e) => actions.setCityId(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#0D1117] px-3 py-2.5 text-xs font-semibold text-white"
                >
                  {CITIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}, {c.province} ({c.pricingZone})
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  {(['landers', 'snr'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => actions.toggleClub(c)}
                      className={`flex-1 rounded-xl border py-2.5 font-grotesk text-xs font-bold ${
                        state.optedInClubs[c]
                          ? 'border-[#38BDF8] bg-[#38BDF8]/20 text-[#38BDF8]'
                          : 'border-white/15 bg-[#0D1117] text-zinc-300'
                      }`}
                    >
                      {c === 'landers' ? 'Landers' : 'S&R'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                disabled={tourStep === 0}
                onClick={() => setTourStep((s) => Math.max(0, s - 1))}
                className="font-mono-code text-xs font-bold text-zinc-400 disabled:opacity-30"
              >
                Back
              </button>
              {tourStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setTourStep((s) => s + 1)}
                  className="rounded-xl bg-[#C8FF3D] px-5 py-2 font-grotesk text-xs font-bold text-[#0D1117]"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={actions.closeOnboarding}
                  className="rounded-xl bg-[#C8FF3D] px-5 py-2 font-grotesk text-xs font-bold text-[#0D1117]"
                >
                  Enter Basement Board
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
