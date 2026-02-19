// path: /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/electron/renderer/components/Settings.js
module.exports = function Settings({ layoutMode, onSave, onBack }) {
  const root = document.createElement("div");
  root.className = "card";

  root.innerHTML = `
    <h1>Settings</h1>

    <div class="grid" style="max-width: 720px;">
      <fieldset style="border:1px solid var(--border); border-radius:12px; padding:12px;">
        <legend><strong>Layout Mode</strong></legend>

        <label style="display:flex; gap:10px; align-items:center; margin:8px 0;">
          <input type="radio" name="layout" value="left" ${layoutMode === "left" ? "checked" : ""} />
          Left-Handed
        </label>

        <label style="display:flex; gap:10px; align-items:center; margin:8px 0;">
          <input type="radio" name="layout" value="right" ${layoutMode === "right" ? "checked" : ""} />
          Right-Handed
        </label>

        <p style="color: var(--muted); margin: 6px 0 0 0;">
          Shortcuts: Ctrl/Cmd+Shift+L (Left), Ctrl/Cmd+Shift+R (Right)
        </p>
      </fieldset>

      <div>
        <label class="label" for="zoom">Zoom Level</label>
        <select id="zoom" class="input">
          <option>100%</option>
          <option>110%</option>
          <option>125%</option>
          <option>150%</option>
        </select>
      </div>

      <div style="display:flex; gap:10px; align-items:center;">
        <label style="display:flex; gap:10px; align-items:center;">
          <input type="checkbox" id="contrast" />
          High Contrast Mode (placeholder)
        </label>
      </div>

      <div style="display:flex; gap:10px;">
        <button class="btn primary" type="button" id="saveBtn">Save Settings</button>
        <button class="btn" type="button" id="backBtn">Back</button>
      </div>

      <div id="savedMsg" style="color: var(--muted);" aria-live="polite"></div>
    </div>
  `;

  const saveBtn = root.querySelector("#saveBtn");
  const backBtn = root.querySelector("#backBtn");
  const savedMsg = root.querySelector("#savedMsg");

  saveBtn.addEventListener("click", async () => {
    const selected = root.querySelector('input[name="layout"]:checked')?.value || "right";
    const mode = await window.careconnect.setLayoutMode(selected);

    onSave(mode);
    savedMsg.textContent = "Saved.";
  });

  backBtn.addEventListener("click", () => onBack());

  return root;
};
