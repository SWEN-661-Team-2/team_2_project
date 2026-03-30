import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './app/context/AppContext'

// Mount the React application into the #root element.
// The non-null assertion (!) is safe here because index.html guarantees #root exists.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*
      BrowserRouter — provides client-side routing via the History API.
      future flags opt into React Router v7 behaviour ahead of the upgrade:
        v7_startTransition: wraps navigation state updates in React.startTransition
        v7_relativeSplatPath: fixes relative path resolution inside splat routes
    */}
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* AppProvider — supplies global auth, settings, and sidebar state via context */}
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)

// ─── PWA Service Worker Registration ─────────────────────────────────────────
// Registers the service worker only if the browser supports it.
// Registration is deferred to the 'load' event so it doesn't compete
// with critical page resources during the initial render.
// Uses globalThis instead of window for cross-environment compatibility.
if ('serviceWorker' in navigator) {
  globalThis.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.error('Service worker registration failed:', err);
    });
  });
}
