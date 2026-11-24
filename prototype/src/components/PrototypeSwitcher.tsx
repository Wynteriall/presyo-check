import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Code2, Monitor, Play, Smartphone, X } from 'lucide-react';
import type { VariantKey } from '../data/types';
import type { PrototypeState } from '../state/usePrototypeState';

export const VARIANT_META: Record<VariantKey, { name: string; subtitle: string }> = {
  A: { name: 'Shelf Strip', subtitle: 'Carton & shelf-edge price rails' },
  B: { name: 'Scale Rail', subtitle: 'Proportional cost bars & 2-tab workbench' },
  C: { name: 'Basement Board', subtitle: 'Backlit aisle directory & stop planner' },
};

const VARIANT_ORDER: VariantKey[] = ['A', 'B', 'C'];

interface PrototypeSwitcherProps {
  current: VariantKey;
  onChange: (next: VariantKey) => void;
  onOpenOnboarding: () => void;
  viewportMode: 'full' | 'mobile';
  onToggleViewportMode: () => void;
  stateSnapshot: PrototypeState;
}

export function PrototypeSwitcher({
  current,
  onChange,
  onOpenOnboarding,
  viewportMode,
  onToggleViewportMode,
  stateSnapshot,
}: PrototypeSwitcherProps) {
  const [stateOpen, setStateOpen] = useState(false);

  const enabled =
    import.meta.env.MODE !== 'production' || import.meta.env.VITE_SHOW_SWITCHER === 'true';

  const cycle = (dir: -1 | 1) => {
    const idx = VARIANT_ORDER.indexOf(current);
    const nextIdx = (idx + dir + VARIANT_ORDER.length) % VARIANT_ORDER.length;
    onChange(VARIANT_ORDER[nextIdx]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        cycle(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        cycle(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!enabled) return null;

  return (
    <>
      {stateOpen && (
        <div
          className="fixed bottom-16 left-1/2 z-50 w-[min(94vw,480px)] -translate-x-1/2 rounded-xl border border-zinc-700 bg-zinc-950/95 p-4 text-xs text-zinc-200 shadow-2xl backdrop-blur"
          role="dialog"
          aria-label="Prototype State Inspector"
        >
          <div className="mb-2 flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Live Prototype State (In-Memory)
            </span>
            <button
              type="button"
              onClick={() => setStateOpen(false)}
              className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              aria-label="Close state panel"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono-code text-[11px]">
            <div>
              <span className="text-zinc-500">Variant:</span>{' '}
              <span className="text-white">{current} ({VARIANT_META[current].name})</span>
            </div>
            <div>
              <span className="text-zinc-500">Sort:</span>{' '}
              <span className="text-white">{stateSnapshot.sortMode}</span>
            </div>
            <div>
              <span className="text-zinc-500">City:</span>{' '}
              <span className="text-white">{stateSnapshot.city.name} ({stateSnapshot.city.pricingZone})</span>
            </div>
            <div>
              <span className="text-zinc-500">Clubs:</span>{' '}
              <span className="text-white">
                {Object.entries(stateSnapshot.optedInClubs)
                  .filter(([, v]) => v)
                  .map(([k]) => k)
                  .join(', ') || 'none'}
              </span>
            </div>
            <div>
              <span className="text-zinc-500">Basket Mode:</span>{' '}
              <span className="text-white">{stateSnapshot.basketMode}</span>
            </div>
            <div>
              <span className="text-zinc-500">List Items:</span>{' '}
              <span className="text-white">
                {stateSnapshot.shoppingList.length} ({stateSnapshot.checkedOffIds.size} checked)
              </span>
            </div>
            <div>
              <span className="text-zinc-500">Price Flags:</span>{' '}
              <span className="text-white">{stateSnapshot.flagHistory.length}</span>
            </div>
            <div>
              <span className="text-zinc-500">Offline Sim:</span>{' '}
              <span className={stateSnapshot.isOfflineSimulated ? 'text-amber-400' : 'text-emerald-400'}>
                {stateSnapshot.isOfflineSimulated ? 'OFFLINE' : 'ONLINE'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-3 left-1/2 z-50 flex max-w-[96vw] -translate-x-1/2 items-center gap-1 rounded-full border border-zinc-700/80 bg-zinc-950/95 px-2 py-1.5 text-white shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <span className="hidden rounded-full bg-amber-400/15 px-2 py-0.5 font-mono-code text-[10px] font-bold uppercase tracking-wider text-amber-300 sm:inline-block">
          Proto
        </span>

        <button
          type="button"
          onClick={() => cycle(-1)}
          className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          aria-label="Previous variant"
          title="Previous variant (←)"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5 px-1.5 text-xs">
          <span className="font-mono-code font-bold text-amber-300">{current}</span>
          <span className="font-medium text-zinc-100 whitespace-nowrap">
            ({VARIANT_META[current].name})
          </span>
        </div>

        <button
          type="button"
          onClick={() => cycle(1)}
          className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          aria-label="Next variant"
          title="Next variant (→)"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="mx-1 h-4 w-px bg-zinc-700" />

        <button
          type="button"
          onClick={onOpenOnboarding}
          className="flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] font-medium text-zinc-200 transition hover:bg-zinc-700"
          title="Preview onboarding walkthrough for this variant"
        >
          <Play className="h-3 w-3" />
          <span>Tour</span>
        </button>

        <button
          type="button"
          onClick={() => setStateOpen((v) => !v)}
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
            stateOpen
              ? 'bg-amber-400 text-zinc-950'
              : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
          }`}
          title="Inspect live prototype state"
        >
          <Code2 className="h-3 w-3" />
          <span className="hidden sm:inline">State</span>
        </button>

        <button
          type="button"
          onClick={onToggleViewportMode}
          className={`hidden md:flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
            viewportMode === 'mobile'
              ? 'bg-sky-400 text-zinc-950'
              : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
          }`}
          title="Toggle 390px phone preview frame vs full desktop width"
        >
          {viewportMode === 'mobile' ? (
            <>
              <Smartphone className="h-3 w-3" />
              <span>390px</span>
            </>
          ) : (
            <>
              <Monitor className="h-3 w-3" />
              <span>Full</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
