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

type TabA = 'compare' | 'list' | 'setup';

export function VariantA({ state, actions, isPhonePreview }: VariantProps) {
  const [tab, setTab] = useState<TabA>('compare');
  const [expandedObsId, setExpandedObsId] = useState<string | null>(null);
  const [flagPesoDraft, setFlagPesoDraft] = useState<Record<string, string>>({});
  const [cityFilter, setCityFilter] = useState('');
  const [copyToast, setCopyToast] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const totalListQty = state.shoppingList.reduce((acc, i) => acc + i.quantity, 0);
  const filteredCities = CITIES.filter((c) =>
    `${c.name} ${c.province}`.toLowerCase().includes(cityFilter.trim().toLowerCase())
  );

  const handleCopyList = async () => {
    await actions.copyListToClipboard();
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2400);
  };

  const renderShelfStrip = (row: EnrichedObservation) => {
    const isExpanded = expandedObsId === row.observation.id;
    const isLockedMember = row.isMemberOnly && !row.isEligible;

    return (
      <div
        key={row.observation.id}
        className={`border-b-[1.5px] border-[#141413] transition-colors ${
          row.isBestUnitPrice
            ? 'bg-[#FFFDF3]'
            : isLockedMember
            ? 'bg-[#EAE4D8] bg-member-hatch'
            : 'bg-white'
        }`}
      >
        <button
          type="button"
          onClick={() => setExpandedObsId(isExpanded ? null : row.observation.id)}
          className="flex w-full items-stretch text-left"
        >
          {/* Left Shelf-Edge Price Tag Block */}
          <div
            className={`flex w-[112px] shrink-0 flex-col justify-center border-r-[1.5px] border-[#141413] px-2.5 py-3 ${
              row.isBestUnitPrice
                ? 'bg-[#F5C400] text-[#141413]'
                : isLockedMember
                ? 'bg-[#DCE6FA] text-[#1D4ED8]'
                : 'bg-[#F4EFE6] text-[#141413]'
            }`}
          >
            <span className="font-mono-code text-[10px] font-bold uppercase tracking-wider opacity-75">
              {state.sortMode === 'unit' ? 'Unit Price' : 'Shelf Price'}
            </span>
            <span className="font-condensed text-[28px] font-extrabold leading-none tracking-tight">
              {state.sortMode === 'unit'
                ? formatPeso(row.unitPricePeso)
                : formatPeso(row.observation.shelfPricePeso)}
            </span>
            <span className="font-mono-code mt-0.5 text-[10px] font-medium opacity-85">
              {state.sortMode === 'unit'
                ? `per ${row.group.unitDisplayLabel.replace('₱/', '')}`
                : row.unitPriceFormatted}
            </span>
          </div>

          {/* Center Product + Chain + Pack + Status Stamps */}
          <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono-code text-[11px] font-bold uppercase tracking-wide text-[#141413]">
                    {row.chain.shortName}
                  </span>
                  {row.product.isHouseBrand && (
                    <span className="border border-[#141413] px-1 py-0 text-[9px] font-bold uppercase tracking-wider text-[#141413]">
                      House Brand
                    </span>
                  )}
                  {row.isMemberOnly && (
                    <span
                      className={`px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider ${
                        row.isEligible
                          ? 'bg-[#1D4ED8] text-white'
                          : 'border border-[#1D4ED8] text-[#1D4ED8]'
                      }`}
                    >
                      Member Only
                    </span>
                  )}
                  {row.isStale && (
                    <span className="bg-[#D9381E] px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-white">
                      &gt;14D Old
                    </span>
                  )}
                  {row.isFlagged && (
                    <span className="border border-[#D9381E] bg-[#FFF0ED] px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-[#D9381E]">
                      Flagged
                    </span>
                  )}
                </div>

                <p className="mt-0.5 truncate text-[14px] font-bold leading-snug text-[#141413]">
                  {row.product.name}
                </p>
                <p className="font-mono-code text-[11px] text-[#57534E]">
                  {row.product.packLabel} · {formatVerifiedAge(row.observation.verifiedDaysAgo)}
                </p>
              </div>

              {/* Right Shelf Price */}
              <div className="shrink-0 text-right">
                <div className="font-condensed text-[24px] font-bold leading-none text-[#141413]">
                  {formatPeso(row.observation.shelfPricePeso)}
                </div>
                <div className="mt-1 flex items-center justify-end gap-1">
                  {row.isBestUnitPrice && (
                    <span className="bg-[#141413] px-1.5 py-0.5 font-mono-code text-[9px] font-bold uppercase text-[#F5C400]">
                      Best Unit
                    </span>
                  )}
                  {row.isLowestUpfrontPrice && !row.isBestUnitPrice && (
                    <span className="border border-[#141413] bg-[#F4EFE6] px-1.5 py-0.5 font-mono-code text-[9px] font-bold uppercase text-[#141413]">
                      Lowest Upfront
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5 text-[#57534E]" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-[#57534E]" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </button>

        {/* Inline Shelf-Ticket Drawer (Progressive Disclosure) */}
        {isExpanded && (
          <div className="border-t border-dashed border-[#141413]/40 bg-[#FAF7F0] px-3 py-3 text-xs text-[#141413]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-mono-code text-[11px] font-bold">
                  {row.observation.storeBranch} · {row.observation.pricingZone}
                </div>
                <div className="text-[11px] text-[#57534E]">
                  Verified {formatVerifiedAge(row.observation.verifiedDaysAgo)}
                  {row.isStale && ' — May be outdated (>14 days)'}
                </div>
                {row.product.dtiSrpPeso && (
                  <div className="font-mono-code mt-1 inline-block border border-[#141413]/30 bg-white px-1.5 py-0.5 text-[10px] font-semibold">
                    DTI SRP Benchmark: {formatPeso(row.product.dtiSrpPeso)}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {row.isMemberOnly && !row.isEligible && (
                  <button
                    type="button"
                    onClick={() =>
                      actions.toggleClub(row.chain.id as 'landers' | 'snr')
                    }
                    className="border-[1.5px] border-[#1D4ED8] bg-[#EFF6FF] px-2.5 py-1.5 font-mono-code text-[11px] font-bold uppercase text-[#1D4ED8]"
                  >
                    Opt into {row.chain.shortName}
                  </button>
                )}

                {state.searchResult.kind === 'group' && (
                  <button
                    type="button"
                    onClick={() => actions.selectProduct(row.product.id)}
                    className="border-[1.5px] border-[#141413] bg-white px-2.5 py-1.5 font-mono-code text-[11px] font-bold uppercase text-[#141413] hover:bg-[#F4EFE6]"
                  >
                    Exact Pack View
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => actions.addProductToList(row.product)}
                  className="flex items-center gap-1 border-[1.5px] border-[#141413] bg-[#141413] px-3 py-1.5 font-mono-code text-[11px] font-bold uppercase text-[#F5C400]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add to List</span>
                </button>
              </div>
            </div>

            {/* 1-tap Price Flag */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#141413]/15 pt-2.5">
              {row.isFlagged ? (
                <span className="font-mono-code text-[11px] font-bold text-[#D9381E]">
                  ✓ Price Flag recorded ({state.isOfflineSimulated ? 'queued offline' : 'sent to Curator queue'})
                </span>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code text-[11px] text-[#57534E]">
                      Shelf price changed?
                    </span>
                    <input
                      type="number"
                      placeholder="New ₱ (opt)"
                      value={flagPesoDraft[row.observation.id] ?? ''}
                      onChange={(e) =>
                        setFlagPesoDraft((prev) => ({
                          ...prev,
                          [row.observation.id]: e.target.value,
                        }))
                      }
                      className="w-24 border border-[#141413]/40 bg-white px-2 py-1 font-mono-code text-[11px] text-[#141413] focus:border-[#141413] focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const raw = flagPesoDraft[row.observation.id];
                      const parsed = raw ? Number(raw) : undefined;
                      actions.flagObservation(
                        row.observation.id,
                        row.product.name,
                        row.chain.shortName,
                        Number.isFinite(parsed) ? parsed : undefined
                      );
                    }}
                    className="flex items-center gap-1 border border-[#D9381E] bg-white px-2.5 py-1 font-mono-code text-[11px] font-bold uppercase text-[#D9381E] hover:bg-[#FFF0ED]"
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

    return (
      <div>
        {/* Category Quick-Rail & Sort Controls */}
        <div className="border-b-[1.5px] border-[#141413] bg-[#EAE4D8] px-3 py-2">
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-2">
            {SUBSTITUTE_GROUPS.map((grp) => {
              const active =
                searchResult.matchedGroup?.id === grp.id && state.searchQuery.trim() === '';
              return (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => actions.selectGroup(grp.id)}
                  className={`shrink-0 border-[1.5px] px-2.5 py-1 font-mono-code text-[11px] font-bold uppercase tracking-tight transition ${
                    active
                      ? 'border-[#141413] bg-[#141413] text-[#F5C400]'
                      : 'border-[#141413]/40 bg-white text-[#141413] hover:border-[#141413]'
                  }`}
                >
                  {grp.shortLabel}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1">
              <span className="font-mono-code text-[10px] font-bold uppercase text-[#57534E]">
                Sort:
              </span>
              <button
                type="button"
                onClick={() => actions.setSortMode('unit')}
                className={`border px-2 py-0.5 font-mono-code text-[11px] font-bold ${
                  state.sortMode === 'unit'
                    ? 'border-[#141413] bg-[#F5C400] text-[#141413]'
                    : 'border-[#141413]/30 bg-white text-[#57534E]'
                }`}
              >
                Unit Price
              </button>
              <button
                type="button"
                onClick={() => actions.setSortMode('shelf')}
                className={`border px-2 py-0.5 font-mono-code text-[11px] font-bold ${
                  state.sortMode === 'shelf'
                    ? 'border-[#141413] bg-[#F5C400] text-[#141413]'
                    : 'border-[#141413]/30 bg-white text-[#57534E]'
                }`}
              >
                Shelf Price
              </button>
            </div>

            {searchResult.matchedGroup && (
              <button
                type="button"
                onClick={() => actions.addGroupToList(searchResult.matchedGroup!)}
                className="font-mono-code text-[11px] font-bold uppercase underline decoration-2 underline-offset-2 text-[#141413]"
              >
                + Add generic "{searchResult.matchedGroup.shortLabel}"
              </button>
            )}
          </div>
        </div>

        {/* Empty State for out-of-catalog searches */}
        {searchResult.kind === 'empty' ? (
          <div className="m-4 border-[1.5px] border-[#141413] bg-white p-5">
            <div className="font-mono-code text-[11px] font-bold uppercase text-[#D9381E]">
              Not in v1 Hero SKU Catalog
            </div>
            <h2 className="font-condensed mt-1 text-2xl font-extrabold uppercase text-[#141413]">
              No matches for "{state.searchQuery}"
            </h2>
            <p className="mt-1 text-sm text-[#57534E]">
              v1 tracks ~80–120 everyday grocery staples across 5 chains. Jump straight to a
              tracked Substitute Group:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUBSTITUTE_GROUPS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => actions.selectGroup(g.id)}
                  className="border-[1.5px] border-[#141413] bg-[#F5C400] px-3 py-1.5 font-mono-code text-xs font-bold uppercase text-[#141413]"
                >
                  {g.shortLabel}
                </button>
              ))}
            </div>
          </div>
        ) : searchResult.kind === 'product' && searchResult.matchedProduct ? (
          <div>
            {/* Exact Pack Section */}
            <div className="flex items-center justify-between border-b-[1.5px] border-[#141413] bg-[#141413] px-3 py-2 text-white">
              <div>
                <div className="font-mono-code text-[10px] uppercase tracking-wider text-[#F5C400]">
                  Exact Pack across Retail Chains
                </div>
                <div className="font-condensed text-xl font-bold uppercase tracking-wide">
                  {searchResult.matchedProduct.name} ({searchResult.matchedProduct.packLabel})
                </div>
              </div>
              <button
                type="button"
                onClick={() => actions.selectProduct(null)}
                className="border border-white/40 px-2 py-1 font-mono-code text-[10px] uppercase text-white hover:bg-white/10"
              >
                All in group
              </button>
            </div>
            <div>{searchResult.exactRows.map(renderShelfStrip)}</div>

            {/* Inline Substitute Group Section */}
            <div className="border-b-[1.5px] border-[#141413] bg-[#292524] px-3 py-2 text-[#F5C400]">
              <span className="font-mono-code text-[11px] font-bold uppercase tracking-wider">
                Cheaper Substitutes &amp; House Brands ({searchResult.matchedGroup?.label})
              </span>
            </div>
            <div>{searchResult.substituteRows.map(renderShelfStrip)}</div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between border-b-[1.5px] border-[#141413] bg-[#141413] px-3 py-2 text-white">
              <div>
                <div className="font-mono-code text-[10px] uppercase tracking-wider text-[#F5C400]">
                  Substitute Group · {searchResult.matchedGroup?.unitDisplayLabel}
                </div>
                <div className="font-condensed text-xl font-bold uppercase tracking-wide">
                  {searchResult.matchedGroup?.label}
                </div>
              </div>
              <span className="font-mono-code text-[11px] text-zinc-300">
                {searchResult.substituteRows.length} prices
              </span>
            </div>
            <div>{searchResult.substituteRows.map(renderShelfStrip)}</div>
          </div>
        )}
      </div>
    );
  };

  const renderListTab = () => {
    const { basketAnalysis } = state;
    const split = basketAnalysis.recommendedTwoStoreSplit;
    const best = basketAnalysis.bestOneStop;

    return (
      <div>
        {/* Mode Toggle Bar */}
        <div className="border-b-[1.5px] border-[#141413] bg-[#EAE4D8] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex border-[1.5px] border-[#141413] bg-white">
              <button
                type="button"
                onClick={() => actions.setBasketMode('exact')}
                className={`px-3 py-1.5 font-mono-code text-[11px] font-bold uppercase ${
                  state.basketMode === 'exact'
                    ? 'bg-[#141413] text-[#F5C400]'
                    : 'text-[#141413]'
                }`}
              >
                Exact Brands
              </button>
              <button
                type="button"
                onClick={() => actions.setBasketMode('substitutes')}
                className={`border-l-[1.5px] border-[#141413] px-3 py-1.5 font-mono-code text-[11px] font-bold uppercase ${
                  state.basketMode === 'substitutes'
                    ? 'bg-[#141413] text-[#F5C400]'
                    : 'text-[#141413]'
                }`}
              >
                Allow Substitutes
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyList}
              className="flex items-center gap-1.5 border-[1.5px] border-[#141413] bg-white px-2.5 py-1.5 font-mono-code text-[11px] font-bold uppercase text-[#141413] hover:bg-[#F5C400]"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy List as Text</span>
            </button>
          </div>

          {copyToast && (
            <div className="mt-2 border border-[#141413] bg-[#F5C400] px-2.5 py-1 font-mono-code text-[11px] font-bold text-[#141413]">
              ✓ Shopping List copied to clipboard for Messenger / Viber
            </div>
          )}
        </div>

        {/* Basket Comparison Ticket Stub */}
        <div className="border-b-[1.5px] border-[#141413] bg-white p-3">
          <div className="font-mono-code text-[10px] font-bold uppercase tracking-wider text-[#57534E]">
            Basket Comparison ({state.basketMode === 'exact' ? 'Exact Brands' : 'Best Value'})
          </div>

          <div className={`mt-2 grid gap-2 ${isPhonePreview ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
            {best && (
              <div className="border-[1.5px] border-[#141413] bg-[#FAF7F0] p-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono-code text-[10px] font-bold uppercase text-[#57534E]">
                    Best 1-Stop Chain
                  </span>
                  <span className="border border-[#141413] bg-white px-1.5 py-0.5 font-mono-code text-[10px] font-bold">
                    {best.carriedCount}/{best.totalCount} carried
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-condensed text-2xl font-extrabold uppercase text-[#141413]">
                    {best.chain.name}
                  </span>
                  <span className="font-condensed text-2xl font-extrabold text-[#141413]">
                    {formatPeso(best.totalShelfPricePeso)}
                  </span>
                </div>
                {best.uncarriedItems.length > 0 && (
                  <div className="mt-1 font-mono-code text-[10px] text-[#D9381E]">
                    Missing: {best.uncarriedItems.map((i) => i.label.split(' ')[0]).join(', ')}
                  </div>
                )}
              </div>
            )}

            {split ? (
              <div className="border-[1.5px] border-[#141413] bg-[#F5C400] p-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono-code text-[10px] font-bold uppercase text-[#141413]">
                    Practical 2-Store Split
                  </span>
                  <span className="bg-[#141413] px-1.5 py-0.5 font-mono-code text-[10px] font-bold text-[#F5C400]">
                    {split.savingsVsBestOneStop > 0
                      ? `Save ${formatPeso(split.savingsVsBestOneStop)} vs 1-stop`
                      : `${split.carriedCount}/${split.totalCount} carried`}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-condensed text-2xl font-extrabold uppercase text-[#141413]">
                    {split.chains.map((c) => c.shortName).join(' + ')}
                  </span>
                  <span className="font-condensed text-2xl font-extrabold text-[#141413]">
                    {formatPeso(split.totalShelfPricePeso)}
                  </span>
                </div>
                <div className="mt-1 font-mono-code text-[10px] text-[#141413]">
                  {split.carriedCount}/{split.totalCount} items covered across 2 stops
                </div>
              </div>
            ) : (
              <div className="flex items-center border-[1.5px] border-dashed border-[#141413]/40 bg-[#FAF7F0] p-2.5 font-mono-code text-[11px] text-[#57534E]">
                1-stop at {best?.chain.shortName} already beats every 2-store split on total peso
                spend.
              </div>
            )}
          </div>

          {/* Chain Coverage Table */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {basketAnalysis.oneStopRankings.map((r) => (
              <div
                key={r.chain.id}
                className={`border px-2 py-1 font-mono-code text-[10px] ${
                  r.carriedCount < r.totalCount
                    ? 'border-dashed border-[#D9381E]/60 bg-[#FFF5F2] text-[#9A2713]'
                    : 'border-[#141413]/30 bg-white text-[#141413]'
                }`}
              >
                <span className="font-bold">{r.chain.shortName}:</span> {r.carriedCount}/
                {r.totalCount} · {formatPeso(r.totalShelfPricePeso)}
              </div>
            ))}
          </div>
        </div>

        {/* 1-Tap Swap-to-Save Chips */}
        {basketAnalysis.swapSuggestions.length > 0 && (
          <div className="border-b-[1.5px] border-[#141413] bg-[#FFFDF3] px-3 py-2.5">
            <div className="font-mono-code text-[10px] font-bold uppercase text-[#141413]">
              1-Tap Swap to Save
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {basketAnalysis.swapSuggestions.map((sw) => (
                <button
                  key={sw.itemId}
                  type="button"
                  onClick={() => actions.swapListItem(sw.itemId, sw.suggestedProduct)}
                  className="border-[1.5px] border-[#141413] bg-[#F5C400] px-2 py-1 font-mono-code text-[11px] font-bold text-[#141413] hover:bg-[#eab800]"
                >
                  Swap {sw.currentProductLabel.split(' ')[0]} → {sw.suggestedChain.shortName}{' '}
                  {sw.suggestedProduct.brand} · Save {formatPeso(sw.savingsPeso)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Shopping List Rows with Always-Visible In-Aisle Check-Offs */}
        <div className="bg-white">
          <div className="flex items-center justify-between border-b border-[#141413]/20 px-3 py-1.5 font-mono-code text-[10px] font-bold uppercase text-[#57534E]">
            <span>Active Shopping List ({state.shoppingList.length} items)</span>
            <span>In-aisle check-off</span>
          </div>
          {state.shoppingList.map((item) => {
            const checked = state.checkedOffIds.has(item.id);
            const activePlan = split ?? best;
            const resolved = activePlan?.lines.find((l) => l.item.id === item.id);
            return (
              <div
                key={item.id}
                className={`flex items-center gap-2.5 border-b border-[#141413]/20 px-3 py-2.5 ${
                  checked ? 'bg-[#F4EFE6] opacity-60' : 'bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => actions.toggleCheckOff(item.id)}
                  aria-label={`Check off ${item.label}`}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center border-[1.5px] border-[#141413] ${
                    checked ? 'bg-[#141413] text-[#F5C400]' : 'bg-white'
                  }`}
                >
                  {checked && <Check className="h-4 w-4" />}
                </button>

                <div className="min-w-0 flex-1">
                  <div
                    className={`truncate text-sm font-bold text-[#141413] ${
                      checked ? 'line-through' : ''
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="font-mono-code text-[10px] text-[#57534E]">
                    {resolved ? (
                      <>
                        {resolved.chainId.toUpperCase()} ·{' '}
                        {resolved.isSubstitute
                          ? `Sub: ${resolved.chosenProduct.brand}`
                          : 'Exact pack'}{' '}
                        · {formatPeso(resolved.lineTotalPeso)}
                      </>
                    ) : (
                      <span className="font-bold text-[#D9381E]">
                        Uncarried in selected 1-stop chain
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center border border-[#141413]/40 bg-[#FAF7F0]">
                  <button
                    type="button"
                    onClick={() => actions.updateListQuantity(item.id, -1)}
                    className="px-1.5 py-1 text-[#141413] hover:bg-[#EAE4D8]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="font-mono-code min-w-[22px] text-center text-xs font-bold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => actions.updateListQuantity(item.id, 1)}
                    className="px-1.5 py-1 text-[#141413] hover:bg-[#EAE4D8]"
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
  };

  const renderSetupTab = () => (
    <div className="space-y-4 p-4">
      <div className="border-[1.5px] border-[#141413] bg-white p-3">
        <div className="font-mono-code text-[10px] font-bold uppercase text-[#57534E]">
          City / Municipality Lookup (No GPS Prompt in v1)
        </div>
        <div className="mt-2 flex items-center gap-2 border-[1.5px] border-[#141413] bg-[#FAF7F0] px-2.5 py-1.5">
          <MapPin className="h-4 w-4 text-[#141413]" />
          <input
            type="text"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Filter city (e.g. Imus, Makati, Cebu)..."
            className="w-full bg-transparent text-sm text-[#141413] placeholder:text-[#78716C] focus:outline-none"
          />
        </div>
        <div className="mt-2 grid max-h-48 grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2">
          {filteredCities.map((c) => {
            const active = c.id === state.city.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => actions.setCityId(c.id)}
                className={`flex items-center justify-between border px-2.5 py-1.5 text-left text-xs ${
                  active
                    ? 'border-[#141413] bg-[#F5C400] font-bold text-[#141413]'
                    : 'border-[#141413]/25 bg-white text-[#141413] hover:bg-[#FAF7F0]'
                }`}
              >
                <span>
                  {c.name}, {c.province}
                </span>
                <span className="font-mono-code text-[10px] uppercase opacity-75">
                  {c.pricingZone === 'Out of Zone' ? 'Outside' : 'Mega Manila'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-[1.5px] border-[#141413] bg-white p-3">
        <div className="font-mono-code text-[10px] font-bold uppercase text-[#57534E]">
          Membership Gate Opt-In
        </div>
        <p className="mt-1 text-xs text-[#57534E]">
          Landers &amp; S&amp;R prices stay visible with a <span className="font-bold">Member Only</span>{' '}
          badge, but are excluded from Best Price winners and Basket totals unless you opt in.
        </p>
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          {(['landers', 'snr'] as const).map((clubId) => {
            const active = state.optedInClubs[clubId];
            return (
              <button
                key={clubId}
                type="button"
                onClick={() => actions.toggleClub(clubId)}
                className={`flex items-center justify-between border-[1.5px] p-2.5 text-left ${
                  active
                    ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]'
                    : 'border-[#141413] bg-[#FAF7F0] text-[#141413]'
                }`}
              >
                <div>
                  <div className="font-condensed text-lg font-bold uppercase">
                    {clubId === 'landers' ? 'Landers Superstore' : 'S&R Membership'}
                  </div>
                  <div className="font-mono-code text-[10px]">
                    {active ? 'Included in winners & baskets' : 'Opted out (browse only)'}
                  </div>
                </div>
                <span
                  className={`border px-2 py-0.5 font-mono-code text-[10px] font-bold uppercase ${
                    active
                      ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white'
                      : 'border-[#141413] bg-white text-[#141413]'
                  }`}
                >
                  {active ? 'Active' : 'Off'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-[1.5px] border-[#141413] bg-white p-3">
        <button
          type="button"
          onClick={actions.toggleOfflineMode}
          className={`flex items-center gap-1.5 border-[1.5px] px-3 py-1.5 font-mono-code text-xs font-bold uppercase ${
            state.isOfflineSimulated
              ? 'border-[#D9381E] bg-[#D9381E] text-white'
              : 'border-[#141413] bg-[#FAF7F0] text-[#141413]'
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
          className="flex items-center gap-1.5 border-[1.5px] border-[#141413] bg-[#F5C400] px-3 py-1.5 font-mono-code text-xs font-bold uppercase text-[#141413]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Replay Walkthrough</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#141413] selection:bg-[#F5C400]">
      <div className={isPhonePreview ? 'flex min-h-full flex-col' : 'mx-auto flex min-h-screen max-w-6xl flex-col md:flex-row'}>
        {/* Desktop Left Price-Rail Index */}
        {!isPhonePreview && (
          <aside className="hidden md:flex md:w-[270px] md:shrink-0 md:flex-col md:justify-between md:border-r-[1.5px] md:border-[#141413] md:bg-[#EAE4D8] md:p-4 md:pb-20">
            <div>
              <div className="border-b-[1.5px] border-[#141413] pb-3">
                <div className="font-condensed text-3xl font-extrabold uppercase tracking-tight leading-none">
                  PresyoCheck
                </div>
                <div className="font-mono-code mt-1 text-[10px] uppercase text-[#57534E]">
                  Shelf-Strip Price Ledger
                </div>
              </div>

              {/* Search */}
              <div className="mt-3 flex items-center gap-1.5 border-[1.5px] border-[#141413] bg-white px-2.5 py-2">
                <Search className="h-4 w-4 shrink-0 text-[#57534E]" />
                <input
                  type="text"
                  value={state.searchQuery}
                  onChange={(e) => {
                    actions.setSearchQuery(e.target.value);
                    setTab('compare');
                  }}
                  placeholder="Search Nutella, oil, milk..."
                  className="w-full bg-transparent text-xs font-medium focus:outline-none"
                />
                {state.searchQuery && (
                  <button
                    type="button"
                    onClick={() => actions.setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5 text-[#57534E]" />
                  </button>
                )}
              </div>

              {/* Nav Tabs */}
              <nav className="mt-4 space-y-1.5">
                {(
                  [
                    ['compare', 'Compare Prices'],
                    ['list', `Shopping List (${totalListQty})`],
                    ['setup', 'City & Clubs'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`flex w-full items-center justify-between border-[1.5px] px-3 py-2 text-left font-mono-code text-xs font-bold uppercase ${
                      tab === id
                        ? 'border-[#141413] bg-[#F5C400] text-[#141413]'
                        : 'border-[#141413]/30 bg-white text-[#141413] hover:border-[#141413]'
                    }`}
                  >
                    <span>{label}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Location & Clubs */}
              <div className="mt-5 border-t-[1.5px] border-[#141413] pt-3">
                <div className="font-mono-code text-[10px] font-bold uppercase text-[#57534E]">
                  Active Context
                </div>
                <div className="mt-1 text-xs font-bold">
                  {state.city.name}, {state.city.province}
                </div>
                <div className="mt-2 flex gap-1.5">
                  {(['landers', 'snr'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => actions.toggleClub(c)}
                      className={`flex-1 border py-1 font-mono-code text-[10px] font-bold uppercase ${
                        state.optedInClubs[c]
                          ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white'
                          : 'border-[#141413]/40 bg-white text-[#141413]'
                      }`}
                    >
                      {c === 'landers' ? 'Landers' : 'S&R'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="font-mono-code text-[10px] text-[#57534E]">
              {state.isOfflineSimulated ? 'OFFLINE CACHED MODE' : 'Mega Manila · Cached'}
            </div>
          </aside>
        )}

        {/* Main Content Column */}
        <main className={`flex-1 ${isPhonePreview ? 'pb-40' : 'pb-36 md:pb-24'}`}>
          {/* Mobile Top Location + Club Rail */}
          <div
            className={`${
              isPhonePreview ? 'flex' : 'flex md:hidden'
            } items-center justify-between gap-2 border-b-[1.5px] border-[#141413] bg-[#141413] px-3 py-2 text-white`}
          >
            <button
              type="button"
              onClick={() => setTab('setup')}
              className="flex min-w-0 items-center gap-1.5 text-left"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#F5C400]" />
              <span className="truncate font-mono-code text-[11px] font-bold">
                {state.city.name} · {state.city.pricingZone}
              </span>
            </button>

            <div className="flex shrink-0 items-center gap-1">
              {(['landers', 'snr'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => actions.toggleClub(c)}
                  className={`border px-1.5 py-0.5 font-mono-code text-[10px] font-bold uppercase ${
                    state.optedInClubs[c]
                      ? 'border-[#38BDF8] bg-[#1D4ED8] text-white'
                      : 'border-white/30 text-zinc-300'
                  }`}
                >
                  {c === 'landers' ? 'Landers' : 'S&R'}
                </button>
              ))}
            </div>
          </div>

          {/* Offline or Out-of-Zone Banners */}
          {state.isOfflineSimulated && (
            <div className="flex items-center justify-between border-b-[1.5px] border-[#141413] bg-[#FFF0ED] px-3 py-1.5 font-mono-code text-[11px] text-[#D9381E]">
              <span>Offline mode: viewing cached catalog · Price Flags queue locally</span>
              <button
                type="button"
                onClick={actions.toggleOfflineMode}
                className="font-bold underline"
              >
                Go Online
              </button>
            </div>
          )}

          {state.city.pricingZone === 'Out of Zone' && (
            <div className="flex items-center gap-2 border-b-[1.5px] border-[#141413] bg-[#F5C400]/35 px-3 py-1.5 font-mono-code text-[11px] font-semibold text-[#141413]">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>
                Showing Mega Manila reference prices for {state.city.name} — local prices coming
                soon.
              </span>
            </div>
          )}

          {tab === 'compare' && renderCompareTab()}
          {tab === 'list' && renderListTab()}
          {tab === 'setup' && renderSetupTab()}
        </main>

        {/* Mobile Bottom Thumb-Zone Dock */}
        <div
          className={`${
            isPhonePreview ? 'fixed bottom-0' : 'fixed bottom-14 md:hidden'
          } left-0 right-0 z-30 border-t-[1.5px] border-[#141413] bg-[#EAE4D8] px-2.5 pt-2 pb-2 shadow-[0_-6px_18px_rgba(0,0,0,0.12)]`}
        >
          <div className="mb-1.5 flex items-center gap-1.5 border-[1.5px] border-[#141413] bg-white px-2.5 py-1.5">
            <Search className="h-4 w-4 shrink-0 text-[#57534E]" />
            <input
              type="text"
              value={state.searchQuery}
              onChange={(e) => {
                actions.setSearchQuery(e.target.value);
                setTab('compare');
              }}
              placeholder="Search Nutella, cooking oil, milk..."
              className="w-full bg-transparent text-xs font-medium text-[#141413] focus:outline-none"
            />
            {state.searchQuery && (
              <button
                type="button"
                onClick={() => actions.setSearchQuery('')}
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5 text-[#57534E]" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {(
              [
                ['compare', 'Compare'],
                ['list', `List (${totalListQty})`],
                ['setup', 'Setup'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`border-[1.5px] py-1.5 font-mono-code text-[11px] font-bold uppercase ${
                  tab === id
                    ? 'border-[#141413] bg-[#F5C400] text-[#141413]'
                    : 'border-[#141413]/40 bg-white text-[#141413]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Onboarding Walkthrough: Notched Price-Tag Overlay */}
      {state.onboardingOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/65 p-4">
          <div className="w-full max-w-md border-2 border-[#141413] bg-[#F4EFE6] p-5 shadow-[8px_8px_0_#141413]">
            <div className="flex items-center justify-between border-b-[1.5px] border-[#141413] pb-2">
              <span className="bg-[#F5C400] px-2 py-0.5 font-mono-code text-[11px] font-bold uppercase text-[#141413]">
                Step {tourStep + 1} of 3
              </span>
              <button
                type="button"
                onClick={actions.closeOnboarding}
                className="font-mono-code text-xs font-bold uppercase underline text-[#141413]"
              >
                Skip
              </button>
            </div>

            {tourStep === 0 && (
              <div className="mt-4">
                <h2 className="font-condensed text-3xl font-extrabold uppercase leading-none">
                  Unit Price beats Pack Guesswork
                </h2>
                <p className="mt-2 text-sm text-[#44403C]">
                  Shelf-edge strips show normalized <strong>Unit Price</strong> (₱/100g, ₱/100mL,
                  ₱/pc) beside the checkout <strong>Shelf Price</strong> so bigger or smaller packs
                  are immediately comparable.
                </p>
              </div>
            )}

            {tourStep === 1 && (
              <div className="mt-4">
                <h2 className="font-condensed text-3xl font-extrabold uppercase leading-none">
                  Substitutes &amp; Club Transparency
                </h2>
                <p className="mt-2 text-sm text-[#44403C]">
                  Compare exact brands side-by-side with house-brand dupes (like Dali GoNutt).
                  Landers &amp; S&amp;R stay visible with a <strong>Member Only</strong> stamp,
                  excluded from winners unless opted in.
                </p>
              </div>
            )}

            {tourStep === 2 && (
              <div className="mt-4">
                <h2 className="font-condensed text-3xl font-extrabold uppercase leading-none">
                  Quick City &amp; Club Setup
                </h2>
                <div className="mt-3 space-y-2">
                  <select
                    value={state.city.id}
                    onChange={(e) => actions.setCityId(e.target.value)}
                    className="w-full border-[1.5px] border-[#141413] bg-white px-2.5 py-2 font-mono-code text-xs font-bold"
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
                        className={`flex-1 border-[1.5px] py-2 font-mono-code text-xs font-bold uppercase ${
                          state.optedInClubs[c]
                            ? 'border-[#1D4ED8] bg-[#1D4ED8] text-white'
                            : 'border-[#141413] bg-white text-[#141413]'
                        }`}
                      >
                        {state.optedInClubs[c] ? '✓ ' : ''}
                        {c === 'landers' ? 'Landers' : 'S&R'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t-[1.5px] border-[#141413] pt-3">
              <button
                type="button"
                disabled={tourStep === 0}
                onClick={() => setTourStep((s) => Math.max(0, s - 1))}
                className="font-mono-code text-xs font-bold uppercase disabled:opacity-30"
              >
                Back
              </button>
              {tourStep < 2 ? (
                <button
                  type="button"
                  onClick={() => setTourStep((s) => s + 1)}
                  className="border-[1.5px] border-[#141413] bg-[#141413] px-4 py-1.5 font-mono-code text-xs font-bold uppercase text-[#F5C400]"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={actions.closeOnboarding}
                  className="border-[1.5px] border-[#141413] bg-[#F5C400] px-4 py-1.5 font-mono-code text-xs font-bold uppercase text-[#141413]"
                >
                  Start Comparing
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
