import '@testing-library/jest-dom';

// Create a safe reference to the window/global object
const root = typeof window !== 'undefined' ? window : global;

// Mock the Electron IPC bridge safely
root.careconnect = {
    onNavigate: jest.fn(),
    onLogout: jest.fn(),
    onLayoutChanged: jest.fn(),
    setLayoutMode: jest.fn().mockResolvedValue('right'),
};

// Only mock browser-specific APIs if window actually exists
if (typeof window !== 'undefined') {
    delete window.location;
    window.location = { hash: '', assign: jest.fn() };
    window.history.replaceState = jest.fn();
}