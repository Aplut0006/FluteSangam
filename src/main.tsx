import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

// Global error recovery for unhandled promise rejections (e.g., dynamic import failures)
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason?.toString() || '';
  if (reason.includes('Failed to fetch dynamically imported module') || reason.includes('Importing a module script failed')) {
    console.warn('[FluteSangam] Dynamic import failed, auto-reloading page...');
    const pageHasBeenRefreshed = sessionStorage.getItem('flutesangam_chunk_refreshed');
    if (!pageHasBeenRefreshed) {
      sessionStorage.setItem('flutesangam_chunk_refreshed', 'true');
      window.location.reload();
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
