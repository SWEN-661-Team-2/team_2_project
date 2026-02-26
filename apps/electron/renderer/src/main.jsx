import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/main.css';


(async function init() {
  const layoutMode = window.careconnect
    ? await window.careconnect.getLayoutMode()
    : 'right';
  const version = window.careconnect
    ? await window.careconnect.getAppVersion()
    : '0.0.0';

  document.title = `CareConnect v${version}`;

  ReactDOM.createRoot(document.getElementById('root')).render(
    <App initialLayout={layoutMode} />
  );
})();
