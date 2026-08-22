import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Global error handling for unhandled promise rejections and third-party/iframe environment quirks
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason?.toString() || '';
  if (reason.includes('Failed to fetch dynamically imported module') || reason.includes('Importing a module script failed')) {
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

// Suppress harmless sandbox/iframe errors like getter-only fetch overrides
window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('Cannot set property fetch of #<Window>')) {
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
