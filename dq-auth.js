
/** @version 2
 * DQ Tools — Auth System (dq-auth.js)
 * Uses Firebase Auth (email/password + Google) + Supabase for data storage.
 */

// ─── CONFIG ─────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDhcxCdbRSVmr8fyE2yhm7PGS0oXuFF5Mo",
  authDomain: "dq-tools-2026.firebaseapp.com",
  projectId: "dq-tools-2026",
  storageBucket: "dq-tools-2026.firebasestorage.app",
  messagingSenderId: "710062944668",
  appId: "1:710062944668:web:139eb2867512380ae6d859"
};

const SUPABASE_URL = "https://awpxwnfvbxtitmcxreep.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cHh3bmZ2Ynh0aXRtY3hyZWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDgyNzIsImV4cCI6MjA4OTA4NDI3Mn0.BeWCPJjexVbs_fd3FGU2SWRndrZHhj8cT1RT8_Dq3q4";

// ─── PRESET AVATARS ──────────────────────────────────────────────────
const PRESET_AVATARS = ['🧪','🎓','📐','🧮','⚗️','🔬','📊','🌟','🦊','🐺','🦁','🐉','🚀','⚡','🌙','🔥'];

// ─── STATE ───────────────────────────────────────────────────────────
let _auth = null;
let _sb = null;
let _user = null;
let _profile = null;

// ─── STYLES ──────────────────────────────────────────────────────────
const CSS = `
/* ── USER DROPDOWN ───────────────────────────────────── */
#dq-user-dropdown {
  position: fixed; top: 58px; right: 16px; z-index: 9001;
  background: #0e1320; border: 1px solid #2a4468; border-radius: 14px;
  padding: 6px; width: 220px; font-family: 'Outfit', sans-serif;
  box-shadow: 0 8px 32px rgba(0,0,0,.6);
  display: none; flex-direction: column; gap: 2px;
}
#dq-user-dropdown.open { display: flex; }
.dq-dd-header { padding: 10px 12px 8px; border-bottom: 1px solid #1e3048; margin-bottom: 4px; }
.dq-dd-name { font-size: .85rem; font-weight: 800; color: #e8eef8; }
.dq-dd-email { font-size: .66rem; color: #7a9abf; margin-top: 2px; word-break: break-all; }
.dq-dd-verified { font-size: .6rem; color: #4de888; margin-top: 3px; }
.dq-dd-unverified { font-size: .6rem; color: #e89020; margin-top: 3px; cursor: pointer; text-decoration: underline; }
.dq-dd-btn {
  display: flex; align-items: center; gap: 9px; padding: 8px 10px;
  border-radius: 8px; background: none; border: none; width: 100%;
  font-family: inherit; font-size: .78rem; font-weight: 700;
  color: #7a9abf; cursor: pointer; transition: background .12s, color .12s; text-align: left;
}
.dq-dd-btn:hover { background: rgba(255,255,255,.06); color: #e8eef8; }
.dq-dd-btn.danger { color: #ff6060; }
.dq-dd-btn.danger:hover { background: rgba(255,96,96,.08); }
.dq-dd-sep { height: 1px; background: #1e3048; margin: 3px 0; }

/* ── SAVE TOAST ──────────────────────────────────────── */
#dq-save-badge {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(16px);
  background: #0e1320; border: 1px solid #2a4468; border-radius: 10px;
  padding: 7px 16px; font-family: 'Outfit', sans-serif; font-size: .72rem;
  font-weight: 700; color: #4de888; z-index: 8000;
  opacity: 0; transition: opacity .2s, transform .2s; pointer-events: none;
}
#dq-save-badge.show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ── AUTH MODAL ──────────────────────────────────────── */
#dq-auth-modal {
  position: fixed; inset: 0; background: rgba(4,7,14,.9);
  backdrop-filter: blur(22px); z-index: 10000;
  display: flex; align-items: center; justify-content: center; padding: 16px;
  opacity: 0; pointer-events: none; transition: opacity .2s;
}
#dq-auth-modal.open { opacity: 1; pointer-events: all; }
#dq-auth-box {
  background: #0d1221; border: 1px solid #1e3048; border-radius: 22px;
  padding: 32px 28px; width: 100%; max-width: 400px; position: relative;
  transform: translateY(20px) scale(.97);
  transition: transform .25s cubic-bezier(.4,0,.2,1);
  font-family: 'Outfit', sans-serif;
}
#dq-auth-modal.open #dq-auth-box { transform: none; }
#dq-auth-box::before {
  content: ''; position: absolute; top: 0; left: 12%; right: 12%; height: 1px;
  background: linear-gradient(90deg,transparent,#3a7fff,#2dcc6f,transparent);
}
#dq-auth-close {
  position: absolute; top: 12px; right: 12px; width: 28px; height: 28px;
  border-radius: 7px; background: #192233; border: 1px solid #1e3048;
  color: #7a9abf; font-size: .9rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all .15s;
}
#dq-auth-close:hover { color: #e8eef8; }
.dq-auth-logo { font-size: 1.5rem; font-weight: 900; color: #e8eef8; margin-bottom: 3px; letter-spacing: -.03em; }
.dq-auth-logo span { color: #4de888; }
.dq-auth-sub { font-size: .78rem; color: #7a9abf; margin-bottom: 22px; line-height: 1.55; }
.dq-tab-row { display: flex; gap: 5px; margin-bottom: 20px; }
.dq-tab { flex: 1; padding: 8px; border-radius: 9px; font-family: inherit; font-size: .75rem; font-weight: 700; cursor: pointer; background: #192233; border: 1.5px solid #1e3048; color: #7a9abf; transition: all .15s; }
.dq-tab.on { background: rgba(58,127,255,.15); border-color: #3a7fff; color: #60a0ff; }
.dq-auth-label { font-size: .68rem; font-weight: 700; color: #7a9abf; margin-bottom: 5px; display: block; }
.dq-auth-inp { width: 100%; background: #192233; border: 1.5px solid #1e3048; border-radius: 9px; padding: 10px 13px; color: #e8eef8; font-family: inherit; font-size: .88rem; outline: none; transition: border-color .15s; margin-bottom: 11px; }
.dq-auth-inp:focus { border-color: #3a7fff; }
.dq-auth-inp::placeholder { color: #3d5878; }
.dq-pw-wrap { position: relative; margin-bottom: 11px; }
.dq-pw-wrap .dq-auth-inp { margin-bottom: 0; padding-right: 40px; }
.dq-pw-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #3d5878; cursor: pointer; font-size: .8rem; padding: 0; }
.dq-pw-strength { height: 3px; border-radius: 2px; margin-bottom: 11px; transition: all .2s; background: #1e3048; }
.dq-pw-strength.weak { background: #e03030; width: 30%; }
.dq-pw-strength.medium { background: #e89020; width: 65%; }
.dq-pw-strength.strong { background: #4de888; width: 100%; }
#dq-auth-name-row { display: none; }
#dq-auth-name-row.show { display: block; }
#dq-auth-submit { width: 100%; padding: 12px; border-radius: 10px; border: none; background: linear-gradient(135deg,#3a7fff,#1a7a40); color: #fff; font-family: inherit; font-size: .9rem; font-weight: 800; cursor: pointer; transition: all .15s; margin-top: 2px; box-shadow: 0 3px 18px rgba(58,127,255,.3); }
#dq-auth-submit:hover { filter: brightness(1.12); transform: translateY(-1px); }
#dq-auth-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }
.dq-auth-divider { display: flex; align-items: center; gap: 10px; margin: 14px 0; }
.dq-auth-divider::before, .dq-auth-divider::after { content: ''; flex: 1; height: 1px; background: #1e3048; }
.dq-auth-divider span { font-size: .65rem; color: #3d5878; font-weight: 700; }
#dq-google-btn { width: 100%; padding: 10px; border-radius: 10px; background: #192233; border: 1.5px solid #1e3048; color: #e8eef8; font-family: inherit; font-size: .82rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all .15s; }
#dq-google-btn:hover { border-color: #3a7fff; background: rgba(58,127,255,.08); }
#dq-auth-err { font-size: .72rem; color: #ff6060; margin-top: 8px; min-height: 14px; text-align: center; }
.dq-auth-footer { margin-top: 14px; text-align: center; }
.dq-auth-link { background: none; border: none; color: #7a9abf; font-family: inherit; font-size: .7rem; cursor: pointer; text-decoration: underline; }
.dq-auth-link:hover { color: #e8eef8; }
#dq-forgot-row { text-align: right; margin-top: -6px; margin-bottom: 10px; }

/* ── VERIFY BANNER ───────────────────────────────────── */
#dq-verify-banner {
  position: fixed; top: 0; left: 0; right: 0; z-index: 8999;
  background: linear-gradient(90deg,#1a2800,#0d1a30);
  border-bottom: 1px solid #2a4468; padding: 8px 16px;
  font-family: 'Outfit', sans-serif; display: none; align-items: center;
  gap: 10px; justify-content: center; font-size: .72rem; color: #e89020; font-weight: 600;
}
#dq-verify-banner.show { display: flex; }
#dq-resend-btn { background: none; border: 1px solid #e89020; color: #e89020; border-radius: 6px; padding: 3px 10px; font-family: inherit; font-size: .68rem; font-weight: 700; cursor: pointer; transition: all .15s; }
#dq-resend-btn:hover { background: rgba(232,144,32,.15); }
`;

// ─── SUPABASE HELPERS ────────────────────────────────────────────────
async function sbSave(userId, key, payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_data`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({
      user_id: userId,
      data_key: key,
      payload: typeof payload === 'string' ? payload : JSON.stringify(payload),
      saved_at: Date.now()
    })
  });
  return res.ok;
}

async function sbLoad(userId, key) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/user_data?user_id=eq.${userId}&data_key=eq.${encodeURIComponent(key)}&select=payload`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  if (!rows.length) return null;
  try { return JSON.parse(rows[0].payload); } catch (_) { return null; }
}

async function sbDelete(userId, key) {
  await fetch(
    `${SUPABASE_URL}/rest/v1/user_data?user_id=eq.${userId}&data_key=eq.${encodeURIComponent(key)}`,
    {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    }
  );
}

async function sbGetAllKeys(userId) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/user_data?user_id=eq.${userId}&select=data_key,saved_at`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    }
  );
  if (!res.ok) return [];
  const rows = await res.json();
  return rows.map(r => ({ key: r.data_key, savedAt: r.saved_at }));
}

// Profile stored in Supabase for cross-device sync
// Falls back to localStorage if Supabase fails
async function dqSaveProfile(uid, data) {
  // Always save to localStorage as instant cache
  try { localStorage.setItem(`dq_profile_${uid}`, JSON.stringify(data)); } catch (_) {}
  // Also save to Supabase for cross-device sync
  try {
    await sbSave(uid, 'profile', data);
  } catch (_) {}
}
async function dqLoadProfile(uid) {
  // Try Supabase first for freshest data
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/user_data?user_id=eq.${uid}&data_key=eq.profile&select=payload`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    if (res.ok) {
      const rows = await res.json();
      if (rows.length) {
        const data = JSON.parse(rows[0].payload);
        // Update local cache
        try { localStorage.setItem(`dq_profile_${uid}`, JSON.stringify(data)); } catch (_) {}
        return data;
      }
    }
  } catch (_) {}
  // Fall back to localStorage cache
  try { const v = localStorage.getItem(`dq_profile_${uid}`); return v ? JSON.parse(v) : null; } catch (_) { return null; }
}

// ─── BUILD UI ────────────────────────────────────────────────────────
function buildUI() {
  const s = document.createElement('style');
  s.textContent = CSS;
  document.head.appendChild(s);

  // User dropdown
  const dd = document.createElement('div');
  dd.id = 'dq-user-dropdown';
  dd.innerHTML = `
    <div class="dq-dd-header">
      <div class="dq-dd-name" id="dq-dd-name">—</div>
      <div class="dq-dd-email" id="dq-dd-email">—</div>
      <div id="dq-dd-verify-status"></div>
    </div>
    <button class="dq-dd-btn" onclick="window.location.href='account.html'">⚙️ My DQ Account</button>
    <button class="dq-dd-btn" onclick="DQAuth.showDataControl()">🗂️ Control My Data</button>
    <div class="dq-dd-sep"></div>
    <button class="dq-dd-btn danger" onclick="DQAuth.signOut()">🚪 Sign Out</button>`;
  document.body.appendChild(dd);

  // Save toast
  const badge = document.createElement('div');
  badge.id = 'dq-save-badge';
  document.body.appendChild(badge);

  // Verify banner
  const banner = document.createElement('div');
  banner.id = 'dq-verify-banner';
  banner.innerHTML = `⚠️ Please verify your email to unlock all features. <button id="dq-resend-btn" onclick="DQAuth.resendVerification()">Resend Email</button>`;
  document.body.appendChild(banner);

  // Auth modal
  buildAuthModal();

  document.addEventListener('click', () => {
    document.getElementById('dq-user-dropdown')?.classList.remove('open');
  });
}

function buildAuthModal() {
  const modal = document.createElement('div');
  modal.id = 'dq-auth-modal';
  modal.innerHTML = `
    <div id="dq-auth-box">
      <button id="dq-auth-close" onclick="DQAuth.closeModal()">✕</button>
      <div class="dq-auth-logo">DQ<span>Tools</span></div>
      <div class="dq-auth-sub">Save your progress across all tools. Free and optional.</div>
      <div class="dq-tab-row">
        <button class="dq-tab on" id="dq-tab-in" onclick="DQAuth.setMode('signin')">Sign In</button>
        <button class="dq-tab" id="dq-tab-up" onclick="DQAuth.setMode('signup')">Create Account</button>
      </div>
      <div id="dq-auth-name-row">
        <label class="dq-auth-label">Your Name</label>
        <input class="dq-auth-inp" id="dq-auth-name" type="text" placeholder="First Last" autocomplete="name">
      </div>
      <label class="dq-auth-label">Email</label>
      <input class="dq-auth-inp" id="dq-auth-email" type="email" placeholder="you@example.com" autocomplete="email">
      <div id="dq-forgot-row">
        <button class="dq-auth-link" onclick="DQAuth.forgotPassword()">Forgot password?</button>
      </div>
      <label class="dq-auth-label">Password</label>
      <div class="dq-pw-wrap">
        <input class="dq-auth-inp" id="dq-auth-pass" type="password" placeholder="••••••••" autocomplete="current-password">
        <button class="dq-pw-toggle" onclick="DQAuth.togglePw()" type="button">👁</button>
      </div>
      <div class="dq-pw-strength" id="dq-pw-strength"></div>
      <div id="dq-auth-err"></div>
      <button id="dq-auth-submit" onclick="DQAuth.submit()">Sign In</button>
      <div class="dq-auth-footer">
        <button class="dq-auth-link" onclick="DQAuth.closeModal()">Continue without account</button>
      </div>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) DQAuth.closeModal(); });
  document.body.appendChild(modal);

  document.getElementById('dq-auth-pass').addEventListener('input', e => {
    const pw = e.target.value;
    const bar = document.getElementById('dq-pw-strength');
    if (!pw) { bar.className = 'dq-pw-strength'; return; }
    const strong = pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);
    const medium = pw.length >= 6 && (/[A-Z]/.test(pw) || /[0-9]/.test(pw));
    bar.className = 'dq-pw-strength ' + (strong ? 'strong' : medium ? 'medium' : 'weak');
  });
}

// ─── UPDATE NAVBAR BUTTON ────────────────────────────────────────────
function updateNavBtn(user) {
  const btn = document.getElementById('dq-auth-btn');
  const label = document.getElementById('dq-auth-label');
  const avatar = document.getElementById('dq-auth-avatar');
  const banner = document.getElementById('dq-verify-banner');
  if (!btn) return;

  if (user) {
    const name = _profile?.displayName || user.displayName || user.email.split('@')[0];
    label.textContent = name.split(' ')[0];
    btn.classList.add('logged-in');

    if (_profile?.photoType === 'upload' && _profile?.photoURL) {
      avatar.innerHTML = `<img src="${_profile.photoURL}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else if (_profile?.photoType === 'emoji' && _profile?.photoURL) {
      avatar.textContent = _profile.photoURL;
    } else if (user.photoURL) {
      avatar.innerHTML = `<img src="${user.photoURL}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
      avatar.textContent = name[0].toUpperCase();
      avatar.style.cssText = 'background:linear-gradient(135deg,#2dcc6f,#3a7fff);color:#090c12;font-weight:900;font-size:.75rem;';
    }

    document.getElementById('dq-dd-name').textContent = name;
    document.getElementById('dq-dd-email').textContent = user.email;
    const vs = document.getElementById('dq-dd-verify-status');
    if (user.emailVerified) {
      vs.innerHTML = '<span class="dq-dd-verified">✓ Email verified</span>';
      banner?.classList.remove('show');
    } else {
      vs.innerHTML = '<span class="dq-dd-unverified" onclick="DQAuth.resendVerification()">⚠ Email not verified — click to resend</span>';
      banner?.classList.add('show');
    }

    updateFabAuth(true, name);
  } else {
    btn.classList.remove('logged-in');
    label.textContent = 'Sign In';
    avatar.textContent = '👤';
    avatar.style.cssText = '';
    banner?.classList.remove('show');
    updateFabAuth(false, null);
  }
}

function updateFabAuth(loggedIn, name) {
  const fabMenu = document.getElementById('fab2menu');
  if (!fabMenu) return;
  let item = document.getElementById('dq-fab-auth-item');
  if (!item) {
    item = document.createElement('div');
    item.className = 'fab2-item';
    item.id = 'dq-fab-auth-item';
    fabMenu.insertBefore(item, fabMenu.firstChild);
  }
  item.innerHTML = loggedIn
    ? `<span class="fab2-label">My Account</span><a class="fab2-icon" href="account.html">👤</a>`
    : `<span class="fab2-label">Sign In</span><a class="fab2-icon" href="#" onclick="event.preventDefault();DQAuth.openModal()">🔑</a>`;
}

// ─── FIREBASE INIT ───────────────────────────────────────────────────
async function initFirebase() {
  try {
    const [
      { initializeApp },
      { getAuth, onAuthStateChanged, signInWithEmailAndPassword,
        createUserWithEmailAndPassword, signOut, sendEmailVerification,
        sendPasswordResetEmail, updateProfile }
    ] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'),
    ]);

    const app = initializeApp(FIREBASE_CONFIG);
    _auth = getAuth(app);

    window._DQFire = { signInWithEmailAndPassword, createUserWithEmailAndPassword,
      signOut, sendEmailVerification, sendPasswordResetEmail,
      updateProfile };

    onAuthStateChanged(_auth, async user => {
      _user = user;
      if (user) {
        _profile = await dqLoadProfile(user.uid);
        if (!_profile) {
          _profile = {
            displayName: user.displayName || user.email.split('@')[0],
            email: user.email,
            photoType: 'emoji',
            photoURL: '🎓',
            createdAt: Date.now()
          };
          dqSaveProfile(user.uid, _profile);
        }
      } else {
        _profile = null;
      }
      updateNavBtn(user);
      window.dispatchEvent(new CustomEvent('dq:authready', { detail: { user } }));
    });

  } catch (e) {
    console.warn('[DQAuth] Firebase init failed:', e);
    window.dispatchEvent(new CustomEvent('dq:authready', { detail: { user: null } }));
  }
}

// ─── PUBLIC API ──────────────────────────────────────────────────────
window.DQAuth = {

  openModal() {
    DQAuth.setMode('signin');
    document.getElementById('dq-auth-modal').classList.add('open');
  },
  closeModal() {
    document.getElementById('dq-auth-modal').classList.remove('open');
    document.getElementById('dq-auth-err').textContent = '';
  },
  setMode(mode) {
    const up = mode === 'signup';
    document.getElementById('dq-tab-in').classList.toggle('on', !up);
    document.getElementById('dq-tab-up').classList.toggle('on', up);
    document.getElementById('dq-auth-name-row').classList.toggle('show', up);
    document.getElementById('dq-auth-submit').textContent = up ? 'Create Account' : 'Sign In';
    document.getElementById('dq-forgot-row').style.display = up ? 'none' : 'block';
    document.getElementById('dq-auth-err').textContent = '';
    document.getElementById('dq-pw-strength').className = 'dq-pw-strength';
    document.getElementById('dq-auth-pass').value = '';
  },
  togglePw() {
    const inp = document.getElementById('dq-auth-pass');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  },
  _toggleDropdown() {
    if (!_user) { DQAuth.openModal(); return; }
    document.getElementById('dq-user-dropdown').classList.toggle('open');
  },

  async submit() {
    if (!_auth) return;
    const btn = document.getElementById('dq-auth-submit');
    const isUp = document.getElementById('dq-tab-up').classList.contains('on');
    const email = document.getElementById('dq-auth-email').value.trim();
    const pass = document.getElementById('dq-auth-pass').value;
    const name = document.getElementById('dq-auth-name')?.value.trim() || '';

    if (!email) { showErr('Please enter your email.'); return; }
    if (!pass) { showErr('Please enter your password.'); return; }
    if (isUp) {
      if (!name) { showErr('Please enter your name.'); return; }
      if (pass.length < 8) { showErr('Password must be at least 8 characters.'); return; }
      if (!/[A-Z]/.test(pass)) { showErr('Password needs at least one uppercase letter.'); return; }
      if (!/[0-9]/.test(pass)) { showErr('Password needs at least one number.'); return; }
    }

    btn.disabled = true; btn.textContent = '…'; showErr('');

    try {
      const { signInWithEmailAndPassword, createUserWithEmailAndPassword,
              sendEmailVerification, updateProfile } = window._DQFire;
      if (isUp) {
        const cred = await createUserWithEmailAndPassword(_auth, email, pass);
        await updateProfile(cred.user, { displayName: name });
        await sendEmailVerification(cred.user);
        const profile = { displayName: name, email, photoType: 'emoji', photoURL: '🎓', createdAt: Date.now() };
        dqSaveProfile(cred.user.uid, profile);
        DQAuth.closeModal();
        DQAuth.toast('✓ Account created! Check your email to verify.');
      } else {
        await signInWithEmailAndPassword(_auth, email, pass);
        DQAuth.closeModal();
      }
    } catch (e) {
      const msg = {
        'auth/invalid-credential': 'Wrong email or password.',
        'auth/user-not-found': 'No account with that email.',
        'auth/wrong-password': 'Wrong password.',
        'auth/email-already-in-use': 'An account with that email already exists.',
        'auth/invalid-email': 'Please enter a valid email.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
      }[e.code] || 'Something went wrong. Try again.';
      showErr(msg);
      btn.disabled = false;
      btn.textContent = isUp ? 'Create Account' : 'Sign In';
    }
  },

  async signOut() {
    if (!_auth) return;
    await window._DQFire.signOut(_auth);
    document.getElementById('dq-user-dropdown').classList.remove('open');
  },

  async forgotPassword() {
    const email = document.getElementById('dq-auth-email').value.trim();
    if (!email) { showErr('Enter your email above first.'); return; }
    try {
      await window._DQFire.sendPasswordResetEmail(_auth, email);
      DQAuth.toast('✓ Password reset email sent!');
      DQAuth.closeModal();
    } catch (_) { showErr('Could not send reset email. Check the address.'); }
  },

  async resendVerification() {
    if (!_user) return;
    try {
      await window._DQFire.sendEmailVerification(_user);
      DQAuth.toast('✓ Verification email resent!');
    } catch (_) { DQAuth.toast('Could not resend. Try again shortly.'); }
  },

  // ── DATA API ─────────────────────────────────────────────────────
  async saveData(key, data) {
    if (_user) {
      const ok = await sbSave(_user.uid, key, data);
      if (ok) { DQAuth.toast('✓ Saved to your DQ Account'); return true; }
    }
    try { localStorage.setItem('dq_' + key, JSON.stringify(data)); } catch (_) {}
    return false;
  },

  async loadData(key) {
    if (_user) {
      const d = await sbLoad(_user.uid, key);
      if (d !== null) return d;
    }
    try { const v = localStorage.getItem('dq_' + key); return v ? JSON.parse(v) : null; }
    catch (_) { return null; }
  },

  async deleteData(key) {
    if (_user) await sbDelete(_user.uid, key);
    try { localStorage.removeItem('dq_' + key); } catch (_) {}
    DQAuth.toast('✓ Data deleted.');
  },

  async getAllDataKeys() {
    if (_user) return await sbGetAllKeys(_user.uid);
    return [];
  },

  async showDataControl() {
    document.getElementById('dq-user-dropdown').classList.remove('open');
    const keys = await DQAuth.getAllDataKeys();
    const LABELS = {
      gpa: { icon: '🎓', label: 'GPA Review', desc: 'Saved GPA data and course grades' },
      courseplanner: { icon: '📅', label: 'Course Planner', desc: '4-year course schedule' },
      geocalc_prefs: { icon: '📐', label: 'GeoCalc', desc: 'Decimal preference' },
      algicalc_prefs: { icon: '📊', label: 'AlgCalc', desc: 'Settings and preferences' },
      mathcalc_prefs: { icon: '🧮', label: 'MathCalc', desc: 'Settings and preferences' },
      dqtable_prefs:  { icon: '⚗️', label: 'DQtable', desc: 'Settings and preferences' },
    };
    document.getElementById('dq-data-modal')?.remove();
    const modal = document.createElement('div');
    modal.id = 'dq-data-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(4,7,14,.9);backdrop-filter:blur(22px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;font-family:Outfit,sans-serif;';
    const items = keys.length ? keys.map(({ key, savedAt }) => {
      const m = LABELS[key] || { icon: '📁', label: key, desc: 'Saved data' };
      const date = savedAt ? new Date(savedAt).toLocaleDateString() : '—';
      return `<div style="display:flex;align-items:center;gap:12px;padding:12px;background:#192233;border:1px solid #1e3048;border-radius:10px;margin-bottom:8px;">
        <span style="font-size:1.4rem">${m.icon}</span>
        <div style="flex:1"><div style="font-size:.82rem;font-weight:800;color:#e8eef8">${m.label}</div>
        <div style="font-size:.68rem;color:#7a9abf">${m.desc}</div>
        <div style="font-size:.6rem;color:#3d5878;margin-top:2px">Last saved: ${date}</div></div>
        <button onclick="DQAuth.deleteData('${key}').then(()=>DQAuth.showDataControl())" style="background:rgba(255,96,96,.1);border:1px solid rgba(255,96,96,.3);color:#ff6060;border-radius:7px;padding:5px 10px;font-family:inherit;font-size:.68rem;font-weight:700;cursor:pointer;">Delete</button>
      </div>`;
    }).join('') : '<div style="text-align:center;color:#3d5878;padding:24px;font-size:.82rem;">No saved data yet.</div>';
    modal.innerHTML = `<div style="background:#0d1221;border:1px solid #1e3048;border-radius:22px;padding:28px;width:100%;max-width:460px;max-height:85vh;overflow-y:auto;">
      <div style="font-size:1.1rem;font-weight:900;color:#e8eef8;margin-bottom:4px;">🗂️ Your Data</div>
      <div style="font-size:.75rem;color:#7a9abf;margin-bottom:20px;line-height:1.5;">At DQTools, you're in control. Here's everything saved to your account.</div>
      <div>${items}</div>
      ${keys.length ? `<button onclick="window._dqDeleteAll()" style="width:100%;padding:10px;border-radius:9px;background:rgba(255,96,96,.1);border:1px solid rgba(255,96,96,.3);color:#ff6060;font-family:inherit;font-size:.82rem;font-weight:700;cursor:pointer;margin-bottom:10px;margin-top:4px;">🗑️ Delete All My Data</button>` : ''}
      <button onclick="document.getElementById('dq-data-modal').remove()" style="width:100%;padding:10px;border-radius:9px;background:#192233;border:1px solid #1e3048;color:#7a9abf;font-family:inherit;font-size:.82rem;font-weight:700;cursor:pointer;">Close</button>
    </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
    window._dqDeleteAll = async () => {
      if (!confirm('Delete ALL saved data? Cannot be undone.')) return;
      if (!confirm('Are you sure?')) return;
      for (const { key } of keys) await DQAuth.deleteData(key);
      modal.remove();
    };
  },

  updateProfile(updates) {
    if (!_user) return;
    _profile = { ..._profile, ...updates };
    dqSaveProfile(_user.uid, _profile); // async, fire and forget
    updateNavBtn(_user);
  },

  getUser: () => _user,
  getProfile: () => _profile,

  toast(msg) {
    const b = document.getElementById('dq-save-badge');
    if (!b) return;
    b.textContent = msg;
    b.classList.add('show');
    clearTimeout(b._t);
    b._t = setTimeout(() => b.classList.remove('show'), 2800);
  },
};

function showErr(msg) {
  const el = document.getElementById('dq-auth-err');
  if (el) el.textContent = msg;
}

// ─── BOOT ────────────────────────────────────────────────────────────
function boot() {
  buildUI();
  initFirebase();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
