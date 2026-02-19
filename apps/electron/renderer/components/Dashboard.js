// path: /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/electron/renderer/components/Dashboard.js
module.exports = function Dashboard({ layoutMode, onOpenSettings, onLogout }) {
  const root = document.createElement("div");
  root.className = "dashboard";

  root.innerHTML = `
    <div class="toolbar" aria-label="Toolbar">
      <button class="btn" type="button" id="addNoteBtn">Add Note</button>
      <button class="btn" type="button" id="planBtn">Plan</button>
      <button class="btn" type="button" id="callBtn">Call</button>
      <button class="btn" type="button" id="msgBtn">Msg</button>
      <span style="flex:1;"></span>
      <button class="btn" type="button" id="settingsBtn">Settings</button>
      <button class="btn" type="button" id="logoutBtn">Logout</button>
    </div>

    <div class="dashboard-body" aria-label="Dashboard layout">
      <section class="sidebar" aria-label="Sidebar navigation">
        <h2 style="margin-top:0;">Clients</h2>
        <input class="input" type="search" placeholder="Search clients" aria-label="Search clients" />

        <div style="margin-top:12px;">
          <button class="btn" type="button" data-focus="sidebar">Focus anchor (Sidebar)</button>
        </div>

        <ul class="list">
          <li><button class="btn" type="button">Client: Jordan A.</button></li>
          <li><button class="btn" type="button">Client: Sam B.</button></li>
          <li><button class="btn" type="button">Client: Taylor C.</button></li>
        </ul>

        <h3>Alerts</h3>
        <ul class="list">
          <li>⚠️ Medication check overdue</li>
          <li>⚠️ Follow-up appointment</li>
        </ul>

        <h3>Messages</h3>
        <div class="list">
          <button class="btn" type="button">New message from clinic</button>
        </div>
      </section>

      <section class="content" aria-label="Client overview panel">
        <h2 style="margin-top:0;">Client Overview</h2>
        <p><strong>Status Indicators:</strong> Stable • Needs follow-up</p>
        <p><strong>Critical Issues:</strong> Medication check overdue</p>
        <p><strong>Care Plan Summary:</strong> Weekly check-ins, hydration tracking, appointment reminders.</p>

        <div style="margin-top:12px;">
          <button class="btn" type="button" data-focus="messages">Focus anchor (Messages Panel)</button>
        </div>

        <div class="card" style="margin-top:12px;">
          <h3 style="margin-top:0;">Care Log Note (Demo)</h3>
          <label class="label" for="note">Note</label>
          <textarea id="note" class="input" rows="4" placeholder="Type note here..."></textarea>
          <div style="margin-top:10px; display:flex; gap:8px;">
            <button class="btn primary" type="button" id="saveBtn">Save Changes</button>
            <button class="btn" type="button" id="resolvedBtn">Mark Issue Resolved</button>
          </div>
          <div id="toast" style="margin-top:10px; color: var(--muted);" aria-live="polite"></div>
        </div>
      </section>
    </div>
  `;

  const toast = root.querySelector("#toast");

  root.querySelector("#settingsBtn").addEventListener("click", () => onOpenSettings());
  root.querySelector("#logoutBtn").addEventListener("click", () => onLogout());

  root.querySelector("#saveBtn").addEventListener("click", () => {
    toast.textContent = "Saved (demo).";
  });

  root.querySelector("#resolvedBtn").addEventListener("click", () => {
    toast.textContent = "Issue marked resolved (demo).";
  });

  return root;
};
