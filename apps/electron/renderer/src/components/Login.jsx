import React, { useState, useEffect, useRef } from 'react';

function Login({ onLogin }) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [remember, setRemember] = useState(false);
const [error, setError] = useState('');
const emailRef = useRef(null);

useEffect(() => { emailRef.current?.focus(); }, []);

function handleSubmit(e) {
e.preventDefault();
if (!email.includes('@') || password.length < 4) {
setError('Invalid credentials. (Demo: any email + 4+ char password)');
return;
}
setError('');
onLogin();
}

return (
<div className="login-wrapper" role="main">
<div className="login-card">
<div className="login-brand">
<img src="/logo.png" alt="CareConnect" className="login-shield" />
<h1 className="login-title">CareConnect</h1>
<p className="login-subtitle">Supporting Care, Connecting Hearts</p>
</div>
<form onSubmit={handleSubmit} aria-label="Login form" noValidate>
<div className="field">
<label className="label" htmlFor="email">Email Address</label>
<input
ref={emailRef}
className="input"
id="email"
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
autoComplete="email"
required
aria-required="true"
/>
</div>
<div className="field">
<label className="label" htmlFor="password">Password</label>
<input
className="input"
id="password"
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
autoComplete="current-password"
required
aria-required="true"
/>
</div>
<label className="checkbox-label">
<input
type="checkbox"
checked={remember}
onChange={(e) => setRemember(e.target.checked)}
/>
Remember me
</label>
{error && (
<div className="error" role="alert" aria-live="assertive">{error}</div>
)}
<button className="btn primary full-width" type="submit">Sign In</button>
</form>
<div className="login-footer">
<a
href="#"
onClick={(e) => {
e.preventDefault();
setError('Password reset not implemented in demo.');
}}
>
Forgot your password?
</a>
<p>Don't have an account? Contact your administrator</p>
</div>
</div>
</div>
);
}

export default Login;