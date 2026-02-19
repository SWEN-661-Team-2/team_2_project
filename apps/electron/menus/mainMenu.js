// path: /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/electron/menus/mainMenu.js
const { Menu, app } = require("electron");

function accel(key) {
  return process.platform === "darwin" ? `Command+${key}` : `Ctrl+${key}`;
}

function buildMainMenu({ onNavigate, onLogout, onToggleLayout, onSetLayout }) {
  const template = [
    {
      label: "File",
      submenu: [
        { label: "New Client Note", accelerator: accel("N"), click: () => onNavigate("dashboard") },
        {
          label: "New Care Plan",
          accelerator: process.platform === "darwin" ? "Command+Shift+P" : "Ctrl+Shift+P",
          click: () => onNavigate("dashboard")
        },
        { type: "separator" },
        { label: "Save Changes", accelerator: accel("S"), click: () => onNavigate("dashboard") },
        { type: "separator" },
        {
          label: "Settings",
          accelerator: process.platform === "darwin" ? "Command+," : "Ctrl+,",
          click: () => onNavigate("settings")
        },
        { type: "separator" },
        { label: "Logout", accelerator: accel("L"), click: () => onLogout() },
        {
          label: process.platform === "darwin" ? "Quit" : "Exit",
          accelerator: accel("Q"),
          click: () => app.quit()
        }
      ]
    },
    {
      label: "View",
      submenu: [
        { label: "Go to Dashboard", accelerator: accel("D"), click: () => onNavigate("dashboard") },
        {
          label: "Focus Sidebar",
          accelerator: process.platform === "darwin" ? "Command+Shift+S" : "Ctrl+Shift+S",
          click: () => onNavigate("dashboard:focusSidebar")
        },
        {
          label: "Focus Messages Panel",
          accelerator: accel("M"),
          click: () => onNavigate("dashboard:focusMessages")
        },
        { type: "separator" },
        {
          label: "Switch to Left-Handed Layout",
          accelerator: process.platform === "darwin" ? "Command+Shift+L" : "Ctrl+Shift+L",
          click: () => onSetLayout("left")
        },
        {
          label: "Switch to Right-Handed Layout",
          accelerator: process.platform === "darwin" ? "Command+Shift+R" : "Ctrl+Shift+R",
          click: () => onSetLayout("right")
        },
        {
          label: "Toggle Layout Mode",
          accelerator: process.platform === "darwin" ? "Command+Alt+L" : "Ctrl+Alt+L",
          click: () => onToggleLayout()
        },
        { type: "separator" },
        { role: "reload" },
        { role: "toggledevtools" }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Keyboard Shortcuts",
          accelerator: process.platform === "darwin" ? "Command+/" : "Ctrl+/",
          click: () => onNavigate("shortcuts")
        },
        { label: "About CareConnect Desktop - Electron", click: () => onNavigate("about") }
      ]
    }
  ];

  return Menu.buildFromTemplate(template);
}

module.exports = { buildMainMenu };
