import { useState } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  Flag,
  Lock,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  WifiOff,
  X,
} from 'lucide-react';
import { CITIES, SUBSTITUTE_GROUPS } from '../../data/catalog';
import { formatPeso, formatVerifiedAge } from '../../data/pricing';
import type { EnrichedObservation } from '../../data/types';
import type { PrototypeActions, PrototypeState } from '../../state/usePrototypeState';

interface VariantProps {
  state: PrototypeState;
  actions: PrototypeActions;
  isPhonePreview: boolean;
}

export function VariantB({ state, actions, isPhonePreview }: VariantProps) {
  const [mobileView, setMobileView] = useState<'prices' | 'basket'>('prices');
  const [contextSheetOpen, setContextSheetOpen] = useState(false);
  const [inspectedObs, setInspectedObs] = useState<EnrichedObservation | null>(null);
  const [inAisleMode, setInAisleMode] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
  const [flagDraftPeso, setFlagDraftPeso] = useState('');
  const [copiedBanner, setCopiedBanner] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const activeClubCount = Number(state.optedInClubs.landers) + Number(state.optedInClubs.snr);
  const totalQty = state.shoppingList.reduce((acc, i) => acc + i.quantity, 0);

  const filteredCities = CITIES.filter((c) =>
    `${c.name} ${c.province}`.toLowerCase().includes(cityQuery.trim().toLowerCase())
  );

  const handleCopy = async () => {
    await actions.copyListToClipboard();
    setCopiedBanner(true);
    setTimeout(() => setCopiedBanner(false), 2200);
  };

  const renderScaleRows = (rows: EnrichedObservation[]) => {
    if (rows.length === 0) return null;
    const maxMetric = Math.max(
      ...rows.map((r) =>
        state.sortMode === 'unit' ? r.unitPricePeso : r.observation.shelfPricePeso
      )
    );

    return (
      <div className="divide-y divide-slate-200/80">
        {rows.map((row) => {
          const metric =
            state.sortMode === 'unit' ? row.unitPricePeso : row.observation.shelfPricePeso;
          const pctWidth = maxMetric > 0 ? Math.max(24, Math.round((metric / maxMetric) * 100)) : 100;
          const savingsPct =
            maxMetric > 0 ? Math.round(((maxMetric - metric) / maxMetric) * 100) : 0;
          const isLocked = row.isMemberOnly && !row.isEligible;

          return (
            <div key={row.observation.id} className="group py-3 transition hover:bg-slate-50/80">
              <div className="flex items-start justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setInspectedObs(row);
                    setFlagDraftPeso('');
                  }}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[13px] font-bold text-slate-900">
                      {row.chain.shortName}
                    </span>
                    <span className="text-xs text-slate-500">· {row.product.name}</span>
                    <span className="text-[11px] font-medium text-slate-400">
                      ({row.product.packLabel})
                    </span>
                  </div>
                </button>

                <div className="flex shrink-0 items-center gap-1.5">
                  {isLocked && (
                    <button
                      type="button"
                      onClick={() =>
                        actions.toggleClub(row.chain.id as 'landers' | 'snr')
                      }
                      className="flex items-center gap-1 rounded-full border border-[#5B3A8C]/40 bg-[#5B3A8C]/5 px-2 py-0.5 text-[10px] font-semibold text-[#5B3A8C] hover:bg-[#5B3A8C]/15"
                    >
                      <Lock className="h-2.5 w-2.5" />
                      <span>Unlock</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => actions.addProductToList(row.product)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-[#0B6E69] hover:bg-[#0B6E69] hover:text-white"
                    aria-label={`Add ${row.product.name} to Shopping List`}
                    title="Add to Shopping List"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Proportional Scale Bar (Full-width readable text over proportional tint fill) */}
              <button
                type="button"
                onClick={() => {
                  setInspectedObs(row);
                  setFlagDraftPeso('');
                }}
                className="mt-1.5 block w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-7 flex-1 items-center overflow-hidden rounded-md bg-slate-100">
                    <div
                      style={{ width: `${pctWidth}%` }}
                      className={`absolute inset-y-0 left-0 rounded-md transition-all duration-300 ${
                        isLocked
                          ? 'border-[1.5px] border-dashed border-[#5B3A8C] bg-[#5B3A8C]/5'
                          : row.isBestUnitPrice
                          ? 'border-l-4 border-[#0B6E69] bg-[#0B6E69]/18'
                          : row.isLowestUpfrontPrice
                          ? 'border-l-4 border-[#C27803] bg-[#C27803]/18'
                          : 'bg-slate-800/12'
                      }`}
                    />
                    <div className="relative z-10 flex w-full items-center justify-between px-2.5 text-xs font-semibold tabular-nums">
                      <span
                        className={`font-bold ${
                          isLocked
                            ? 'text-[#5B3A8C]'
                            : row.isBestUnitPrice
                            ? 'text-[#08524E]'
                            : row.isLowestUpfrontPrice
                            ? 'text-[#8B5300]'
                            : 'text-slate-800'
                        }`}
                      >
                        {state.sortMode === 'unit'
                          ? row.unitPriceFormatted
                          : formatPeso(row.observation.shelfPricePeso)}
                      </span>
                      {savingsPct > 0 && !isLocked && (
                        <span
                          className={`ml-2 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            row.isBestUnitPrice
                              ? 'bg-[#0B6E69] text-white'
                              : 'bg-white/80 text-slate-700'
                          }`}
                        >
                          -{savingsPct}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Secondary Price Readout */}
                  <div className="w-[74px] shrink-0 text-right tabular-nums">
                    <div className="text-sm font-bold text-slate-900">
                      {formatPeso(row.observation.shelfPricePeso)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {state.sortMode === 'unit'
                        ? 'Shelf'
                        : row.unitPriceFormatted}
                    </div>
                  </div>
                </div>

                {/* Ultra-quiet signal row */}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px]">
                  {row.isBestUnitPrice && (
                    <span className="font-bold text-[#0B6E69]">● Best Unit Price</span>
                  )}
                  {row.isLowestUpfrontPrice && !row.isBestUnitPrice && (
                    <span className="font-bold text-[#C27803]">● Lowest Upfront</span>
                  )}
                  {row.isMemberOnly && (
                    <span className="font-semibold text-[#5B3A8C]">
                      Member Only ({row.isEligible ? 'Opted In' : 'Excluded'})
                    </span>
                  )}
                  {row.isStale && (
                    <span className="font-semibold text-[#E05A2B]">
                      ⚠ {formatVerifiedAge(row.observation.verifiedDaysAgo)} (May be outdated)
                    </span>
                  )}
                  {row.isFlagged && (
                    <span className="font-bold text-[#E05A2B]">⚑ Flagged</span>
                  )}
                  {!row.isStale && (
                    <span className="text-slate-400">
                      {row.observation.storeBranch} · {formatVerifiedAge(row.observation.verifiedDaysAgo)}
                    </span>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPricesPane = () => {
    const { searchResult } = state;
    return (
      <div className="space-y-4">
        {/* Search + Sort Bar */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-xs">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              value={state.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
              placeholder="Compare exact brand or generic need (e.g. Nutella, oil)..."
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {state.searchQuery && (
              <button
                type="button"
                onClick={() => actions.setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="no-scrollbar flex flex-1 items-center gap-1.5 overflow-x-auto">
              {SUBSTITUTE_GROUPS.map((g) => {
                const active =
                  searchResult.matchedGroup?.id === g.id && state.searchQuery.trim() === '';
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => actions.selectGroup(g.id)}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g.shortLabel}
                  </button>
                );
              })}
            </div>

            <div className="flex shrink-0 rounded-lg bg-slate-200/70 p-0.5 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => actions.setSortMode('unit')}
                className={`rounded-md px-2 py-1 transition ${
                  state.sortMode === 'unit'
                    ? 'bg-white text-[#0B6E69] shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Unit ₱
              </button>
              <button
                type="button"
                onClick={() => actions.setSortMode('shelf')}
                className={`rounded-md px-2 py-1 transition ${
                  state.sortMode === 'shelf'
                    ? 'bg-white text-[#0B6E69] shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Shelf ₱
              </button>
            </div>
          </div>
        </div>

        {/* Scale Surface */}
        {searchResult.kind === 'empty' ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Outside v1 Hero SKUs
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              "{state.searchQuery}" isn&apos;t tracked yet
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Pick one of our tracked Substitute Groups to compare Unit Prices across chains:
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUBSTITUTE_GROUPS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => actions.selectGroup(g.id)}
                  className="rounded-full bg-[#0B6E69]/10 px-3 py-1.5 text-xs font-semibold text-[#0B6E69] hover:bg-[#0B6E69]/20"
                >
                  {g.shortLabel}
                </button>
              ))}
            </div>
          </div>
        ) : searchResult.kind === 'product' && searchResult.matchedProduct ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#0B6E69]">
                    Exact Pack Scale
                  </div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    {searchResult.matchedProduct.name} ({searchResult.matchedProduct.packLabel})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => actions.selectProduct(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  Show all
                </button>
              </div>
              {renderScaleRows(searchResult.exactRows)}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div className="border-b border-slate-100 pb-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Cheaper Substitutes &amp; House Brands
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  {searchResult.matchedGroup?.label}
                </h3>
              </div>
              {renderScaleRows(searchResult.substituteRows)}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Proportional {state.sortMode === 'unit' ? 'Unit Price' : 'Shelf Price'} Scale
                </div>
                <h2 className="text-base font-extrabold text-slate-900">
                  {searchResult.matchedGroup?.label}
                </h2>
              </div>
              {searchResult.matchedGroup && (
                <button
                  type="button"
                  onClick={() => actions.addGroupToList(searchResult.matchedGroup!)}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
                >
                  + Generic Need
                </button>
              )}
            </div>
            {renderScaleRows(searchResult.substituteRows)}
          </div>
        )}
      </div>
    );
  };

  const renderBasketPane = () => {
    const { basketAnalysis } = state;
    const best = basketAnalysis.bestOneStop;
    const split = basketAnalysis.recommendedTwoStoreSplit;
    const maxOneStop = Math.max(
      1,
      ...basketAnalysis.oneStopRankings.map((r) => r.totalShelfPricePeso)
    );

    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 rounded-lg bg-slate-100 p-0.5 text-[11px] font-semibold sm:flex-initial">
              <button
                type="button"
                onClick={() => actions.setBasketMode('exact')}
                className={`flex-1 whitespace-nowrap rounded-md px-2.5 py-1 transition sm:flex-initial ${
                  state.basketMode === 'exact'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Exact Brands
              </button>
              <button
                type="button"
                onClick={() => actions.setBasketMode('substitutes')}
                className={`flex-1 whitespace-nowrap rounded-md px-2.5 py-1 transition sm:flex-initial ${
                  state.basketMode === 'substitutes'
                    ? 'bg-white text-[#0B6E69] shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                Best Value (Dupes)
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </button>
          </div>

          {copiedBanner && (
            <div className="mt-2 rounded-lg bg-[#0B6E69]/10 px-3 py-1.5 text-xs font-semibold text-[#0B6E69]">
              Shopping List copied as plain text.
            </div>
          )}

          {/* 1-Stop vs 2-Store Visual Comparison Bars */}
          <div className="mt-4 space-y-2.5">
            {split && (
              <div className="rounded-xl bg-[#0B6E69]/8 p-3 ring-1 ring-[#0B6E69]/25">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0B6E69]">
                    Recommended 2-Store Split: {split.chains.map((c) => c.shortName).join(' + ')}
                  </span>
                  {split.savingsVsBestOneStop > 0 && (
                    <span className="rounded-full bg-[#0B6E69] px-2 py-0.5 text-[10px] font-bold text-white">
                      Save {formatPeso(split.savingsVsBestOneStop)} vs 1-stop
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="text-xs text-slate-600">
                    {split.carriedCount}/{split.totalCount} items carried
                  </span>
                  <span className="text-lg font-extrabold tabular-nums text-slate-900">
                    {formatPeso(split.totalShelfPricePeso)}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                1-Stop Retail Chain Totals (Coverage-Ranked)
              </div>
              {basketAnalysis.oneStopRankings.map((r, idx) => {
                const isBest = idx === 0;
                const incomplete = r.carriedCount < r.totalCount;
                const widthPct = Math.max(
                  20,
                  Math.round((r.totalShelfPricePeso / maxOneStop) * 100)
                );
                return (
                  <div key={r.chain.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{r.chain.shortName}</span>
                        <span
                          className={`text-[11px] font-medium tabular-nums ${
                            incomplete ? 'text-[#E05A2B]' : 'text-[#0B6E69]'
                          }`}
                        >
                          {r.carriedCount}/{r.totalCount} items
                        </span>
                      </div>
                      <span className="font-bold tabular-nums text-slate-900">
                        {formatPeso(r.totalShelfPricePeso)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        style={{ width: `${widthPct}%` }}
                        className={`h-full rounded-full ${
                          incomplete
                            ? 'bg-[#E05A2B]/55'
                            : isBest
                            ? 'bg-[#0B6E69]'
                            : 'bg-slate-400'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {best && best.uncarriedItems.length > 0 && (
              <div className="rounded-lg bg-[#E05A2B]/10 px-3 py-2 text-xs text-[#B63D14]">
                Uncarried at {best.chain.shortName}:{' '}
                {best.uncarriedItems.map((u) => u.label).join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Swap-to-Save Chips */}
        {basketAnalysis.swapSuggestions.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B6E69]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>1-Tap Swap to Save</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {basketAnalysis.swapSuggestions.map((sw) => (
                <button
                  key={sw.itemId}
                  type="button"
                  onClick={() => actions.swapListItem(sw.itemId, sw.suggestedProduct)}
                  className="rounded-lg bg-[#0B6E69]/10 px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#0B6E69] hover:bg-[#0B6E69]/20"
                >
                  {sw.currentProductLabel.split(' ')[0]} → {sw.suggestedChain.shortName}{' '}
                  {sw.suggestedProduct.brand} (Save {formatPeso(sw.savingsPeso)})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clean List with Toggleable In-Aisle Check-Off Mode */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Shopping List ({state.shoppingList.length})
            </span>
            <button
              type="button"
              onClick={() => setInAisleMode((v) => !v)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                inAisleMode
                  ? 'bg-[#0B6E69] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {inAisleMode ? '✓ In-Aisle Check-Off ON' : 'In-Aisle Check-Off'}
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {state.shoppingList.map((item) => {
              const checked = state.checkedOffIds.has(item.id);
              const activePlan = split ?? best;
              const resolved = activePlan?.lines.find((l) => l.item.id === item.id);

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 py-2.5 ${checked ? 'opacity-50' : ''}`}
                >
                  {inAisleMode && (
                    <button
                      type="button"
                      onClick={() => actions.toggleCheckOff(item.id)}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                        checked
                          ? 'border-[#0B6E69] bg-[#0B6E69] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                      aria-label={`Check off ${item.label}`}
                    >
                      {checked && <Check className="h-3.5 w-3.5" />}
                    </button>
                  )}

                  <div className="min-w-0 flex-1">
                    <div
                      className={`truncate text-sm font-semibold text-slate-900 ${
                        checked ? 'line-through' : ''
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {resolved ? (
                        <>
                          {resolved.chainId.toUpperCase()} ·{' '}
                          {resolved.isSubstitute
                            ? `Sub: ${resolved.chosenProduct.brand}`
                            : 'Exact'}{' '}
                          · {formatPeso(resolved.lineTotalPeso)}
                        </>
                      ) : (
                        <span className="font-semibold text-[#E05A2B]">Uncarried</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 rounded-lg bg-slate-100 px-1 py-0.5">
                    <button
                      type="button"
                      onClick={() => actions.updateListQuantity(item.id, -1)}
                      className="rounded p-1 text-slate-600 hover:bg-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-[18px] text-center text-xs font-bold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => actions.updateListQuantity(item.id, 1)}
                      className="rounded p-1 text-slate-600 hover:bg-white"
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
      </div>
    );
  };

  return (
    <div className="font-jakarta min-h-screen bg-[#F7F8FA] text-[#0F172A]">
      {/* Top 2-Mode Header (Zero Bottom Tab Bar!) */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-3 py-2.5 backdrop-blur">
        <div
          className={`mx-auto flex max-w-6xl justify-between gap-2 ${
            isPhonePreview ? 'flex-col' : 'flex-col md:flex-row md:items-center'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="shrink-0 text-base font-extrabold tracking-tight text-slate-900">
              Presyo<span className="text-[#0B6E69]">Check</span>
            </span>

            {isPhonePreview ? (
              <button
                type="button"
                onClick={() => setContextSheetOpen(true)}
                className="flex min-w-0 items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
              >
                <MapPin className="h-3 w-3 shrink-0 text-[#0B6E69]" />
                <span className="truncate">
                  {state.city.name} · {activeClubCount} Club{activeClubCount === 1 ? '' : 's'}
                </span>
                <SlidersHorizontal className="h-3 w-3 shrink-0 text-slate-400" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setContextSheetOpen(true)}
                className="flex md:hidden min-w-0 items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
              >
                <MapPin className="h-3 w-3 shrink-0 text-[#0B6E69]" />
                <span className="truncate">
                  {state.city.name} · {activeClubCount} Club{activeClubCount === 1 ? '' : 's'}
                </span>
                <SlidersHorizontal className="h-3 w-3 shrink-0 text-slate-400" />
              </button>
            )}
          </div>

          {/* Mobile 2-Pill Mode Switcher */}
          {isPhonePreview ? (
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMobileView('prices')}
                className={`rounded-[10px] py-1.5 transition ${
                  mobileView === 'prices'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Prices
              </button>
              <button
                type="button"
                onClick={() => setMobileView('basket')}
                className={`rounded-[10px] py-1.5 transition ${
                  mobileView === 'basket'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Basket ({totalQty})
              </button>
            </div>
          ) : (
            <>
              <div className="grid md:hidden grid-cols-2 rounded-xl bg-slate-100 p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setMobileView('prices')}
                  className={`rounded-[10px] py-1.5 transition ${
                    mobileView === 'prices'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  Prices
                </button>
                <button
                  type="button"
                  onClick={() => setMobileView('basket')}
                  className={`rounded-[10px] py-1.5 transition ${
                    mobileView === 'basket'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  Basket ({totalQty})
                </button>
              </div>
              <button
                type="button"
                onClick={() => setContextSheetOpen(true)}
                className="hidden md:flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <MapPin className="h-3.5 w-3.5 text-[#0B6E69]" />
                <span>
                  {state.city.name} · {activeClubCount} Club{activeClubCount === 1 ? '' : 's'}
                </span>
                <SlidersHorizontal className="h-3 w-3 text-slate-400" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Banners */}
      {state.city.pricingZone === 'Out of Zone' && (
        <div className="border-b border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs font-medium text-amber-900">
          Showing Mega Manila reference prices for {state.city.name} — local prices coming soon.
        </div>
      )}
      {state.isOfflineSimulated && (
        <div className="flex items-center justify-center gap-2 border-b border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-[#E05A2B]">
          <WifiOff className="h-3.5 w-3.5" />
          <span>Offline cached mode · Price Flags will queue locally</span>
        </div>
      )}

      {/* Main Content: Single view on mobile, Live 2-Column Workbench on Desktop */}
      <main className="mx-auto max-w-6xl px-3 py-4 pb-24">
        {isPhonePreview ? (
          mobileView === 'prices' ? (
            renderPricesPane()
          ) : (
            renderBasketPane()
          )
        ) : (
          <>
            <div className="md:hidden">
              {mobileView === 'prices' ? renderPricesPane() : renderBasketPane()}
            </div>
            <div className="hidden md:grid md:grid-cols-12 md:gap-6">
              <section className="md:col-span-7">{renderPricesPane()}</section>
              <aside className="md:col-span-5">{renderBasketPane()}</aside>
            </div>
          </>
        )}
      </main>

      {/* Observation Detail Sheet (Progressive Disclosure) */}
      {inspectedObs && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/45 sm:items-center sm:p-4"
          onClick={() => setInspectedObs(null)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B6E69]">
                  {inspectedObs.chain.name}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {inspectedObs.product.name}
                </h3>
                <p className="text-xs text-slate-500">{inspectedObs.product.packLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspectedObs(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 tabular-nums">
              <div>
                <div className="text-[11px] text-slate-500">Normalized Unit Price</div>
                <div className="text-xl font-extrabold text-[#0B6E69]">
                  {inspectedObs.unitPriceFormatted}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">Walk-in Shelf Price</div>
                <div className="text-xl font-extrabold text-slate-900">
                  {formatPeso(inspectedObs.observation.shelfPricePeso)}
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-800">Store Branch:</span>{' '}
                {inspectedObs.observation.storeBranch} ({inspectedObs.observation.pricingZone})
              </div>
              <div>
                <span className="font-semibold text-slate-800">Verified:</span>{' '}
                {formatVerifiedAge(inspectedObs.observation.verifiedDaysAgo)}
                {inspectedObs.isStale && (
                  <span className="ml-1.5 font-bold text-[#E05A2B]">
                    (May be outdated &gt;14d)
                  </span>
                )}
              </div>
              {inspectedObs.product.dtiSrpPeso && (
                <div className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                  <AlertCircle className="h-3 w-3" />
                  <span>DTI SRP Reference: {formatPeso(inspectedObs.product.dtiSrpPeso)}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  actions.addProductToList(inspectedObs.product);
                  setInspectedObs(null);
                }}
                className="flex-1 rounded-xl bg-[#0B6E69] py-2.5 text-xs font-bold text-white hover:bg-[#095955]"
              >
                + Add to Shopping List
              </button>
              {state.searchResult.kind === 'group' && (
                <button
                  type="button"
                  onClick={() => {
                    actions.selectProduct(inspectedObs.product.id);
                    setInspectedObs(null);
                  }}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Exact Pack
                </button>
              )}
            </div>

            {/* 1-Tap Price Flag */}
            <div className="mt-4 border-t border-slate-100 pt-3">
              {state.flaggedIds.has(inspectedObs.observation.id) ? (
                <div className="text-xs font-semibold text-[#E05A2B]">
                  ✓ Price Flag logged ({state.isOfflineSimulated ? 'queued offline' : 'Curator queue'})
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Observed ₱ (optional)"
                    value={flagDraftPeso}
                    onChange={(e) => setFlagDraftPeso(e.target.value)}
                    className="w-36 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-[#0B6E69] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const num = flagDraftPeso ? Number(flagDraftPeso) : undefined;
                      actions.flagObservation(
                        inspectedObs.observation.id,
                        inspectedObs.product.name,
                        inspectedObs.chain.shortName,
                        Number.isFinite(num) ? num : undefined
                      );
                    }}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#E05A2B]/40 bg-[#E05A2B]/10 py-1.5 text-xs font-bold text-[#E05A2B] hover:bg-[#E05A2B]/20"
                  >
                    <Flag className="h-3.5 w-3.5" />
                    <span>Flag outdated price</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Slide-Up Context & Preferences Sheet (Replaces 3rd Settings Tab) */}
      {contextSheetOpen && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/45 sm:items-center sm:p-4"
          onClick={() => setContextSheetOpen(false)}
        >
          <div
            className="max-h-[82vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900">
                City, Clubs &amp; Preferences
              </h2>
              <button
                type="button"
                onClick={() => setContextSheetOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Search City / Municipality
                </label>
                <input
                  type="text"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  placeholder="Type city (Imus, Makati, Cebu...)"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-[#0B6E69] focus:outline-none"
                />
                <div className="mt-2 grid max-h-36 grid-cols-2 gap-1.5 overflow-y-auto">
                  {filteredCities.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => actions.setCityId(c.id)}
                      className={`rounded-lg px-2.5 py-1.5 text-left text-xs ${
                        c.id === state.city.id
                          ? 'bg-[#0B6E69] font-bold text-white'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Membership Gate
                </div>
                <div className="mt-2 flex gap-2">
                  {(['landers', 'snr'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => actions.toggleClub(c)}
                      className={`flex-1 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                        state.optedInClubs[c]
                          ? 'border-[#5B3A8C] bg-[#5B3A8C] text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      {c === 'landers' ? 'Landers' : 'S&R'}:{' '}
                      {state.optedInClubs[c] ? 'Opted In' : 'Off'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={actions.toggleOfflineMode}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    state.isOfflineSimulated
                      ? 'bg-[#E05A2B] text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {state.isOfflineSimulated ? 'Offline Sim: ON' : 'Simulate Offline'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setContextSheetOpen(false);
                    setTourStep(0);
                    actions.openOnboarding();
                  }}
                  className="flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Replay Walkthrough</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Spotlight Bottom-Sheet Onboarding */}
      {state.onboardingOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#0B6E69]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#0B6E69]">
                Walkthrough {tourStep + 1}/3
              </span>
              <button
                type="button"
                onClick={actions.closeOnboarding}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Skip
              </button>
            </div>

            {tourStep === 0 && (
              <div className="mt-3">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Shortest bar = lowest cost per gram
                </h2>
                <p className="mt-1.5 text-sm text-slate-600">
                  Every pack scales visually by normalized <strong>Unit Price</strong> so you spot
                  overpriced small jars instantly — or flip to <strong>Shelf ₱</strong> for tight
                  cash budgets.
                </p>
              </div>
            )}

            {tourStep === 1 && (
              <div className="mt-3">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Ghost bars keep Member Clubs honest
                </h2>
                <p className="mt-1.5 text-sm text-slate-600">
                  Landers &amp; S&amp;R appear as dashed ghost bars with a 1-tap{' '}
                  <strong>Unlock</strong> button so club prices stay visible without distorting
                  non-member winners.
                </p>
              </div>
            )}

            {tourStep === 2 && (
              <div className="mt-3 space-y-2.5">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Set your City &amp; Clubs
                </h2>
                <select
                  value={state.city.id}
                  onChange={(e) => actions.setCityId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
                >
                  {CITIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}, {c.province}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  {(['landers', 'snr'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => actions.toggleClub(c)}
                      className={`flex-1 rounded-xl border py-2 text-xs font-bold ${
                        state.optedInClubs[c]
                          ? 'border-[#5B3A8C] bg-[#5B3A8C] text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      {c === 'landers' ? 'Landers' : 'S&R'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                disabled={tourStep === 0}
                onClick={() => setTourStep((s) => Math.max(0, s - 1))}
                className="text-xs font-semibold text-slate-500 disabled:opacity-30"
              >
                Back
              </button>
              {tourStep < 2 ? (
                <button
                  type="button"
                  onClick={() => setTourStep((s) => s + 1)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={actions.closeOnboarding}
                  className="rounded-xl bg-[#0B6E69] px-4 py-2 text-xs font-bold text-white"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
