import '@testing-library/jest-dom';

// Create a safe reference to the window/global object
const root = globalThis.window === undefined ? globalThis : globalThis.window;

// Mock the Electron IPC bridge safely
root.careconnect = {
  onNavigate: jest.fn(),
  onLogout: jest.fn(),
  onLayoutChanged: jest.fn(),
  setLayoutMode: jest.fn().mockResolvedValue('right'),
};

// Only mock browser-specific APIs if window actually exists
if (globalThis.window !== undefined) {
  delete globalThis.window.location;
  globalThis.window.location = { hash: '', assign: jest.fn() };
  globalThis.window.history.replaceState = jest.fn();
}
