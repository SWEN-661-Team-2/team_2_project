import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/main.css';
import axe from 'axe-core';

if (!globalThis.careconnect) {
  globalThis.careconnect = {
    getLayoutMode: async () => 'right',
    getAppVersion: async () => '0.1.0',
    onNavigate: () => {},
    onLogout: () => {},
    onLayoutChanged: () => {},
    removeAllListeners: () => {},
    setLayoutMode: async (mode) => mode,
  };
}

const layoutMode = await globalThis.careconnect.getLayoutMode();
const version = await globalThis.careconnect.getAppVersion();

document.title = `CareConnect v${version}`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <App initialLayout={layoutMode} />
);

if (import.meta.env.DEV) {
  setTimeout(() => {
    axe.run().then(results => {
      if (results.violations.length > 0) {
        console.group(`axe: ${results.violations.length} violations`);
        results.violations.forEach(v => {
          console.error(`[${v.impact}] ${v.description}`);
          v.nodes.forEach(n => console.warn(n.html));
        });
        console.groupEnd();
      } else {
        console.log('axe: 0 violations ✓');
      }
    });
  }, 1000);
}
