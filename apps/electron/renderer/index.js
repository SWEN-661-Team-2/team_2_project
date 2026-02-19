// path: /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/electron/renderer/index.js
const mainEl = document.getElementById("main");
const statusLeft = document.getElementById("statusLeft");
const layoutPill = document.getElementById("layoutPill");
const openSettingsBtn = document.getElementById("openSettingsBtn");

const Login = require("./components/Login");
const Dashboard = require("./components/Dashboard");
const Settings = require("./components/Settings");

let route = "login";
let layoutMode = "right";
let isAuthed = false;

function setRoute(nextRoute) {
  route = nextRoute;
  render();
}

function setLayout(nextMode) {
  layoutMode = nextMode;
  document.documentElement.dataset.layout = layoutMode;
  layoutPill.textContent = `Layout: ${layoutMode === "left" ? "Left-Handed" : "Right-Handed"}`;
}

function setAuth(nextAuthed) {
  isAuthed = nextAuthed;
  statusLeft.textContent = isAuthed ? "Logged in" : "Logged out";
}

function focusMain() {
  mainEl.focus();
}

function render() {
  mainEl.innerHTML = "";
  if (!isAuthed && route !== "login") route = "login";

  if (route === "login") {
    mainEl.appendChild(
      Login({
        onLogin: () => {
          setAuth(true);
          setRoute("dashboard");
          focusMain();
        }
      })
    );
    return;
  }

  if (route.startsWith("dashboard")) {
    const dashboard = Dashboard({
      layoutMode,
      onOpenSettings: () => setRoute("settings"),
      onLogout: () => {
        setAuth(false);
        setRoute("login");
        focusMain();
      }
    });

    mainEl.appendChild(dashboard);

    if (route === "dashboard:focusSidebar") dashboard.querySelector('[data-focus="sidebar"]')?.focus();
    if (route === "dashboard:focusMessages") dashboard.querySelector('[data-focus="messages"]')?.focus();
    return;
  }

  if (route === "settings") {
    mainEl.appendChild(
      Settings({
        layoutMode,
        onSave: (mode) => setLayout(mode),
        onBack: () => setRoute("dashboard")
      })
    );
    return;
  }

  if (route === "shortcuts") {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h1>Keyboard Shortcuts</h1>
      <ul class="list">
        <li><kbd>Ctrl/Cmd + S</kbd> Save Changes</li>
        <li><kbd>Ctrl/Cmd + N</kbd> New Client Note</li>
        <li><kbd>Ctrl/Cmd + Shift + P</kbd> New Care Plan</li>
        <li><kbd>Ctrl/Cmd + ,</kbd> Open Settings</li>
        <li><kbd>Ctrl/Cmd + Shift + L</kbd> Switch to Left-Handed Layout</li>
        <li><kbd>Ctrl/Cmd + Shift + R</kbd> Switch to Right-Handed Layout</li>
        <li><kbd>Ctrl/Cmd + M</kbd> Focus Messages Panel</li>
        <li><kbd>Ctrl/Cmd + Shift + S</kbd> Focus Sidebar</li>
      </ul>
      <button class="btn" id="backBtn" type="button">Back</button>
    `;
    div.querySelector("#backBtn").addEventListener("click", () => setRoute("dashboard"));
    mainEl.appendChild(div);
    return;
  }

  if (route === "about") {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<h1>About</h1><p>CareConnect Desktop - Electron</p>`;
    mainEl.appendChild(div);
  }
}

openSettingsBtn.addEventListener("click", () => setRoute(isAuthed ? "settings" : "login"));

window.careconnect.onNavigate((r) => setRoute(r));
window.careconnect.onLogout(() => {
  setAuth(false);
  setRoute("login");
});
window.careconnect.onLayoutChanged((mode) => setLayout(mode));

(async function init() {
  const mode = await window.careconnect.getLayoutMode();
  setLayout(mode);

  const version = await window.careconnect.getAppVersion();
  document.title = `CareConnect Desktop - Electron v${version}`;

  render();
})();
