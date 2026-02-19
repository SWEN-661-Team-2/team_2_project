// path: /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/electron/preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("careconnect", {
  getAppVersion: () => ipcRenderer.invoke("app:getVersion"),
  getLayoutMode: () => ipcRenderer.invoke("layout:getMode"),
  setLayoutMode: (mode) => ipcRenderer.invoke("layout:setMode", mode),

  onNavigate: (handler) => ipcRenderer.on("nav:go", (_e, route) => handler(route)),
  onLogout: (handler) => ipcRenderer.on("auth:logout", () => handler()),
  onLayoutChanged: (handler) =>
    ipcRenderer.on("layout:changed", (_e, mode) => handler(mode))
});
