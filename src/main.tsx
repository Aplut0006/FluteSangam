import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Global error handling for unhandled promise rejections and third-party/iframe environment quirks
window.addEventListener('unhandledrejection', (event) => {
  const reasonStr = event.reason?.message || event.reason?.toString() || '';
  const reasonName = event.reason?.name || '';

  // Suppress harmless abort signals (triggered by page navigation, component unmount, or cancelled requests)
  if (
    reasonName === 'AbortError' ||
    reasonStr.includes('signal is aborted') ||
    reasonStr.includes('The operation was aborted') ||
    reasonStr.includes('user aborted a request') ||
    reasonStr.includes('AbortError')
  ) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (reasonStr.includes('Failed to fetch dynamically imported module') || reasonStr.includes('Importing a module script failed')) {
    console.warn('[FluteSangam] Dynamic import failed, auto-reloading page...');
    try {
      const pageHasBeenRefreshed = sessionStorage.getItem('flutesangam_chunk_refreshed');
      if (!pageHasBeenRefreshed) {
        sessionStorage.setItem('flutesangam_chunk_refreshed', 'true');
        window.location.reload();
      }
    } catch {
      window.location.reload();
    }
  }
});

// Suppress harmless sandbox/iframe errors like getter-only fetch overrides and abort DOMExceptions
window.addEventListener('error', (event) => {
  const msg = event.message || event.error?.message || '';
  const errName = event.error?.name || '';

  if (
    msg.includes('Cannot set property fetch of #<Window>') ||
    msg.includes('signal is aborted') ||
    msg.includes('The operation was aborted') ||
    msg.includes('user aborted a request') ||
    msg.includes('AbortError') ||
    errName === 'AbortError'
  ) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
});

const container = document.getElementById('root')!;

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);

// Clean up hidden static SEO fallback content after React mounts to minimize mobile DOM size and memory
if (typeof window !== 'undefined') {
  const cleanupSeoFallback = () => {
    const el = document.getElementById('seo-fallback-content');
    if (el) el.remove();
  };
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(cleanupSeoFallback);
  } else {
    setTimeout(cleanupSeoFallback, 1500);
  }
}
