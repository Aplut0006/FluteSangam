import React from 'react';

export type PreloadableComponent<T extends React.ComponentType<any>> = React.LazyExoticComponent<T> & {
  preload: () => Promise<any>;
};

/**
 * Smart lazy loader with automatic retry mechanism and instant preloading support.
 * Catches chunk loading failures caused by network blips or updated deployments
 * and retries loading up to 2 times before triggering a single auto-reload.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T } | any>
): PreloadableComponent<T> {
  let modulePromise: Promise<{ default: T }> | null = null;

  const preload = (): Promise<{ default: T }> => {
    if (!modulePromise) {
      modulePromise = (async () => {
        const pageHasBeenRefreshed = sessionStorage.getItem('flutesangam_chunk_refreshed');

        for (let i = 0; i < 3; i++) {
          try {
            const rawModule = await componentImport();
            const module = rawModule && rawModule.default ? rawModule : { default: rawModule };
            
            if (pageHasBeenRefreshed) {
              sessionStorage.removeItem('flutesangam_chunk_refreshed');
            }
            return module;
          } catch (error: any) {
            console.warn(`[FluteSangam] Dynamic module import attempt ${i + 1} failed:`, error);
            
            if (i < 2) {
              await new Promise((resolve) => setTimeout(resolve, 300 * (i + 1)));
            } else {
              if (!pageHasBeenRefreshed) {
                sessionStorage.setItem('flutesangam_chunk_refreshed', 'true');
                window.location.reload();
                return new Promise<{ default: T }>(() => {});
              }
              throw error;
            }
          }
        }
        const finalRaw = await componentImport();
        return finalRaw && finalRaw.default ? finalRaw : { default: finalRaw };
      })();
    }
    return modulePromise;
  };

  const Component = React.lazy(() => preload());
  (Component as any).preload = preload;

  return Component as PreloadableComponent<T>;
}
