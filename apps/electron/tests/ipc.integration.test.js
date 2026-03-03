// path: apps/electron/tests/ipc.integration.test.js
/** @jest-environment node */

jest.mock("electron", () => {
  const handlers = new Map();

  return {
    app: {
      getVersion: () => "0.1.0",
      whenReady: () => Promise.resolve(),
      on: jest.fn(),
      quit: jest.fn(),
    },
    BrowserWindow: jest.fn().mockImplementation(() => ({
      loadURL: jest.fn(),
      loadFile: jest.fn(),
      once: jest.fn((event, cb) => event === "ready-to-show" && cb()),
      show: jest.fn(),
      on: jest.fn(),
      getBounds: jest.fn(() => ({ width: 1200, height: 800, x: 20, y: 30 })),
      webContents: { send: jest.fn(), openDevTools: jest.fn() },
    })),
    Menu: { setApplicationMenu: jest.fn() },
    ipcMain: {
      handle: jest.fn((channel, fn) => handlers.set(channel, fn)),
      __handlers: handlers,
    },
  };
});

jest.mock("electron-store", () => {
  return jest.fn().mockImplementation(() => {
    const store = new Map();
    return {
      get: (k, d) => (store.has(k) ? store.get(k) : d),
      set: (k, v) => store.set(k, v),
    };
  });
});

jest.mock("../menus/mainMenu", () => ({
  buildMainMenu: () => ({}),
}));

describe("IPC integration (main process)", () => {
  test("registers IPC handlers for app/version and layout mode", async () => {
    process.env.NODE_ENV = "test";

    // Import main.js (this triggers app.whenReady().then(createWindow))
    require("../main.js");

    // Let the whenReady promise resolve
    await Promise.resolve();

    const { ipcMain } = require("electron");
    const channels = Array.from(ipcMain.__handlers.keys());

    expect(channels).toEqual(
      expect.arrayContaining(["app:getVersion", "layout:getMode", "layout:setMode"])
    );
  });
});