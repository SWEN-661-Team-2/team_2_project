const { app, BrowserWindow, Menu, ipcMain, session } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();
const isDev = process.env.NODE_ENV !== 'production';

function getWindowBounds() {
  return store.get('windowBounds') || { width: 1280, height: 800 };
}

function saveWindowBounds(win) {
  store.set('windowBounds', win.getBounds());
}

function createWindow() {
  const bounds = getWindowBounds();

  const win = new BrowserWindow({
    ...bounds,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    titleBarStyle: 'default',
    show: false,
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, 'renderer-dist', 'index.html'));
  }

  win.once('ready-to-show', () => win.show());
  win.on('close', () => saveWindowBounds(win));

  if (!ipcMain.listenerCount('app:getVersion')) ipcMain.handle('app:getVersion', () => app.getVersion());
  if (!ipcMain.listenerCount('layout:getMode')) ipcMain.handle('layout:getMode', () => store.get('layoutMode', 'right'));
  if (!ipcMain.listenerCount('layout:setMode')) ipcMain.handle('layout:setMode', (event, mode) => {
    if (mode !== 'left' && mode !== 'right') return store.get('layoutMode', 'right');
    store.set('layoutMode', mode);
    win.webContents.send('layout:changed', mode);
    return mode;
  });

  const { buildMainMenu } = require('./menus/mainMenu');
  const menu = buildMainMenu({
    onNavigate: (route) => win.webContents.send('nav:go', route),
    onLogout: () => win.webContents.send('auth:logout'),
    onToggleLayout: () => {
      const current = store.get('layoutMode', 'right');
      const next = current === 'left' ? 'right' : 'left';
      store.set('layoutMode', next);
      win.webContents.send('layout:changed', next);
    },
    onSetLayout: (mode) => {
      store.set('layoutMode', mode);
      win.webContents.send('layout:changed', mode);
    },
  });
  Menu.setApplicationMenu(menu);
}

// Load axe DevTools extension in development mode.
// this is very specific to my local setup, 
app.whenReady().then(async () => {
  if (isDev) {
    // Replace '4.10.1_0' with the actual folder name inside your lhdoppojpmngadmnindnejefpokejbdd directory
    const axePath = '/Users/eduardoestrada/Library/Application Support/Google/Chrome/Default/Extensions/lhdoppojpmngadmnindnejefpokejbdd/4.122.1_0';
    
    try {
      await session.defaultSession.loadExtension(axePath, { allowFileAccess: true });
      console.log('✅ axe DevTools loaded');
    } catch (e) {
      console.error('❌ Failed to load axe DevTools:', e);
    }
  }


// 1. Grant permissions to the extension ID manually in the session

// 2. Bypass CSP and Security for the extension only
session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': [
        "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob:; frame-src *; style-src * 'unsafe-inline';"
      ]
    }
  });
});





  createWindow();
});



app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
