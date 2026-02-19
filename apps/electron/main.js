// path: /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/electron/main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { buildMainMenu } = require("./menus/mainMenu");

let mainWindow = null;
let layoutMode = "left"; // "left" | "right"

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1280,
    minHeight: 800,
    show: true,
    title: "CareConnect Desktop - Electron",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

  const menu = buildMainMenu({
    onNavigate: (route) => mainWindow?.webContents.send("nav:go", route),
    onLogout: () => mainWindow?.webContents.send("auth:logout"),
    onToggleLayout: () => {
      layoutMode = layoutMode === "right" ? "left" : "right";
      mainWindow?.webContents.send("layout:changed", layoutMode);
    },
    onSetLayout: (mode) => {
      layoutMode = mode;
      mainWindow?.webContents.send("layout:changed", layoutMode);
    }
  });

  mainWindow.setMenu(menu);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("app:getVersion", () => app.getVersion());
ipcMain.handle("layout:getMode", () => layoutMode);
ipcMain.handle("layout:setMode", (_evt, mode) => {
  if (mode !== "left" && mode !== "right") return layoutMode;
  layoutMode = mode;
  mainWindow?.webContents.send("layout:changed", layoutMode);
  return layoutMode;
});
