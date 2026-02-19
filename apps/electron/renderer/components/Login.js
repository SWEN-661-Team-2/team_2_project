// path: /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/electron/renderer/components/Login.js
export function Login({ onLogin }) {
  const wrap = document.createElement("div");
  wrap.className = "card login-card";
  wrap.style.maxWidth = "520px";

  wrap.innerHTML = `
    <div class="login-brand" aria-label="CareConnect Desktop - Electron branding">
      <img class="login-logo" src="../assets/logos/careconnect_logo.png" alt="CareConnect" />
      <div class="login-subtitle">
        <img class="login-shield" src="../assets/logos/shield.png" alt="" aria-hidden="true" />
        Secure caregiver access
      </div>
    </div>

    <h1 style="margin-top: 8px;">Login</h1>

    <form id="loginForm" class="grid" aria-label="Login form">
      <div>
        <label class="label" for="email">Email</label>
        <input class="input" id="email" name="email" type="email" autocomplete="email" required />
      </div>

      <div>
        <label class="label" for="password">Password</label>
        <input class="input" id="password" name="password" type="password" autocomplete="current-password" required />
      </div>

      <label style="display:flex; gap:8px; align-items:center;">
        <input id="remember" type="checkbox" />
        Remember Me
      </label>

      <button class="btn primary" type="submit">Login</button>

      <a href="#" id="forgotLink">Forgot Password?</a>

      <div id="error" class="error" role="alert" aria-live="assertive" style="display:none;"></div>
    </form>
  `;

  const email = wrap.querySelector("#email");
  const password = wrap.querySelector("#password");
  const error = wrap.querySelector("#error");
  const form = wrap.querySelector("#loginForm");

  setTimeout(() => email.focus(), 0);

  wrap.querySelector("#forgotLink").addEventListener("click", (e) => {
    e.preventDefault();
    error.style.display = "block";
    error.textContent = "Password reset is not implemented yet.";
    email.focus();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailVal = String(email.value || "").trim();
    const passVal = String(password.value || "");

    if (!emailVal.includes("@") || passVal.length < 4) {
      error.style.display = "block";
      error.textContent = "Invalid login. (Demo rule: password must be 4+ chars.)";
      password.focus();
      return;
    }

    error.style.display = "none";
    onLogin();
  });

  return wrap;
}
