import { useState } from 'react';
import { PrototypeSwitcher } from './components/PrototypeSwitcher';
import type { VariantKey } from './data/types';
import { usePrototypeState } from './state/usePrototypeState';
import { VariantA } from './variants/VariantA/VariantA';
import { VariantB } from './variants/VariantB/VariantB';
import { VariantC } from './variants/VariantC/VariantC';

function readInitialVariant(): VariantKey {
  if (typeof window === 'undefined') return 'A';
  const param = new URLSearchParams(window.location.search).get('variant')?.toUpperCase();
  if (param === 'A' || param === 'B' || param === 'C') return param;
  return 'A';
}

export function App() {
  const [variant, setVariant] = useState<VariantKey>(readInitialVariant);
  const [viewportMode, setViewportMode] = useState<'full' | 'mobile'>('full');
  const [state, actions] = usePrototypeState();

  const handleVariantChange = (next: VariantKey) => {
    setVariant(next);
    const url = new URL(window.location.href);
    url.searchParams.set('variant', next);
    window.history.replaceState({}, '', url.toString());
  };

  const isPhonePreview = viewportMode === 'mobile';

  const activeScreen = (
    <>
      {variant === 'A' && (
        <VariantA state={state} actions={actions} isPhonePreview={isPhonePreview} />
      )}
      {variant === 'B' && (
        <VariantB state={state} actions={actions} isPhonePreview={isPhonePreview} />
      )}
      {variant === 'C' && (
        <VariantC state={state} actions={actions} isPhonePreview={isPhonePreview} />
      )}
    </>
  );

  return (
    <>
      {isPhonePreview ? (
        <div className="flex min-h-screen flex-col items-center justify-start bg-zinc-900 px-4 pt-5 pb-20">
          <div className="mb-2 flex items-center gap-2 font-mono-code text-[11px] text-zinc-400">
            <span>Simulated Phone Viewport · 390px</span>
          </div>
          {/* transform-gpu creates a containing block so fixed bottom docks inside variants stay inside the 390px phone frame */}
          <div className="relative h-[min(812px,calc(100vh-110px))] w-[390px] max-w-full overflow-y-auto overflow-x-hidden rounded-[32px] border-[6px] border-zinc-700 bg-black shadow-2xl transform-gpu">
            {activeScreen}
          </div>
        </div>
      ) : (
        activeScreen
      )}

      <PrototypeSwitcher
        current={variant}
        onChange={handleVariantChange}
        onOpenOnboarding={actions.openOnboarding}
        viewportMode={viewportMode}
        onToggleViewportMode={() =>
          setViewportMode((m) => (m === 'full' ? 'mobile' : 'full'))
        }
        stateSnapshot={state}
      />
    </>
  );
}

export default App;
