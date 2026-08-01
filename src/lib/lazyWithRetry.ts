import React from 'react';

/**
 * Smart lazy loader with automatic retry mechanism for dynamic imports.
 * Catches chunk loading failures caused by network blips or updated deployments
 * and retries loading up to 2 times before triggering a single auto-reload.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T } | any>
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    const pageHasBeenRefreshed = sessionStorage.getItem('flutesangam_chunk_refreshed');

    // Attempt up to 3 tries with backoff
    for (let i = 0; i < 3; i++) {
      try {
        const module = await componentImport();
        // Clear refresh flag on successful load
        if (pageHasBeenRefreshed) {
          sessionStorage.removeItem('flutesangam_chunk_refreshed');
        }
        return module;
      } catch (error: any) {
        console.warn(`[FluteSangam] Dynamic module import attempt ${i + 1} failed:`, error);
        
        // Wait before retrying (400ms, 800ms)
        if (i < 2) {
          await new Promise((resolve) => setTimeout(resolve, 400 * (i + 1)));
        } else {
          // If all retries failed and page hasn't auto-refreshed yet, reload once to grab fresh assets
          if (!pageHasBeenRefreshed) {
            sessionStorage.setItem('flutesangam_chunk_refreshed', 'true');
            window.location.reload();
            return new Promise<{ default: T }>(() => {});
          }
          throw error;
        }
      }
    }
    return componentImport();
  });
}
