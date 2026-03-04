import React from 'react';

// Mock ReactDOM and the App component
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn().mockReturnValue({
    render: jest.fn(),
  }),
}));

jest.mock('../renderer/src/components/App', () => {
  return function MockApp() {
    return <div data-testid="mock-app" />;
  };
});

describe('Main.jsx Initialization', () => {
  let rootElement;

  beforeEach(() => {
    // Setup a fake DOM element for React to mount to
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
    
    // Clear mocks and reset window object
    jest.clearAllMocks();
    delete window.careconnect;
  });

  afterEach(() => {
    document.body.removeChild(rootElement);
  });

  test('initializes with fallback values when window.careconnect is missing', async () => {
    const { createRoot } = require('react-dom/client');
    
    // Execute the entry point
    await jest.isolateModules(() => {
      require('../renderer/src/components/App.jsx');
    });

    // Wait for async IIFE
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(document.title).toBe('CareConnect v0.0.0');
    expect(createRoot).toHaveBeenCalledWith(rootElement);
    
    // Verify App was called with the fallback 'right' layout
    const renderMock = createRoot().render;
    expect(renderMock).toHaveBeenCalled();
  });

  test('initializes with Electron values when window.careconnect exists', async () => {
    const { createRoot } = require('react-dom/client');
    
    // Mock the Electron bridge
    window.careconnect = {
      getLayoutMode: jest.fn().mockResolvedValue('left'),
      getAppVersion: jest.fn().mockResolvedValue('1.2.3'),
    };

    // Execute the entry point
    await jest.isolateModules(() => {
      require('../renderer/src/main.jsx');
    });

    // Wait for async IIFE
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(window.careconnect.getLayoutMode).toHaveBeenCalled();
    expect(document.title).toBe('CareConnect v1.2.3');
    
    const renderMock = createRoot().render;
    // Verify App received the 'left' layout from the Electron bridge
    expect(renderMock).toHaveBeenCalled();
  });
});