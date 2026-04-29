/**
 * DQ Tools — Shared Module
 * Drop this ONE file into your repo, then paste the snippet below into every page's <head>.
 *
 * USAGE — replace the three lines at the top of every page's <head> with:
 *
 *   <meta charset="UTF-8">
 *   <meta name="viewport" content="width=device-width, initial-scale=1.0">
 *   <link rel="icon" type="image/png" href="favicon.png">           ← use your own favicon file
 *   <!-- Google Analytics -->
 *   <script async src="https://www.googletagmanager.com/gtag/js?id=G-TNYF9DN593"></script>
 *   <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-TNYF9DN593');</script>
 *   <!-- DQ Shared (nav + login) -->
 *   <script src="dq-shared.js" defer></script>
 *
 * Then REMOVE the old FAB menu HTML + the old watermark div from every page.
 * This file injects them automatically.
 */

/* ─── CONFIG ───────────────────────────────────────────────────────── */
const DQ_PAGES = [
  { label: 'Home',           href: 'index.html',           icon: '🏠' },
  { label: 'DQTasks',        href: 'dqtasks.html',         icon: '✅' },
  { label: 'DQTable',        href: 'dqtable.html',         icon: '⚗️' },
  { label: 'Course Planner', href: 'courseplanner.html',   icon: '📅' },
  { label: 'GPA Review',     href: 'gpareview.html',       icon: '🎓' },
  { label: 'DQ Study',       href: 'dqstudy.html',         icon: '📚' },
  { label: 'MathCalc',       href: 'mathcalc.html',        icon: '🧮' },
  { label: 'GeoCalc',        href: 'geocalc.html',         icon: '📐' },
  { label: 'AlgCalc',        href: 'algicalc.html',        icon: '📊' },
  { label: 'My Account',     href: 'account.html',         icon: '👤' },
  { label: 'Terms',          href: 'termsandpolicies.html',icon: '📋' },
];

/* ─── CANONICAL DATA KEY LABELS ────────────────────────────────────── */
/* Single source of truth used by dq-auth.js showDataControl AND account.html */
const DQ_DATA_LABELS = {
  gpa:              { icon: '🎓', label: 'GPA Review',      desc: 'Course grades and GPA data' },
  courseplanner:    { icon: '📅', label: 'Course Planner',  desc: '4-year academic schedule' },
  dqtasks:          { icon: '✅', label: 'DQTasks',          desc: 'Tasks, assignments and events' },
  dqtasks_prefs:    { icon: '✅', label: 'DQTasks — Color Theme & Settings', desc: 'Color theme, display preferences' },
  dqstudy:          { icon: '📚', label: 'DQ Study',         desc: 'Flashcards and study progress' },
  'dqstudy-settings':{ icon:'📚', label: 'DQ Study — Settings', desc: 'Study mode preferences' },
  'dqstudy-gam':    { icon: '📚', label: 'DQ Study — Streaks & XP', desc: 'Gamification progress' },
  geocalc_prefs:    { icon: '📐', label: 'GeoCalc — Settings', desc: 'Decimal and display preferences' },
  algicalc_prefs:   { icon: '📊', label: 'AlgCalc — Settings', desc: 'Settings and preferences' },
  mathcalc_prefs:   { icon: '🧮', label: 'MathCalc — Settings', desc: 'Settings and preferences' },
  dqtable_prefs:    { icon: '⚗️', label: 'DQTable — Settings',  desc: 'Settings and preferences' },
};

/* ─── FIREBASE CONFIG ───────────────────────────────────────────────
   Sign up free at https://console.firebase.google.com
   Create a project → Add Web App → copy the config object here.
   Then enable:  Authentication → Email/Password
                 Firestore Database (start in test mode, lock it later)
──────────────────────────────────────────────────────────────────── */
const FIREBASE_CONFIG = {
  apiKey:            "PASTE_YOUR_API_KEY",
  authDomain:        "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId:         "PASTE_YOUR_PROJECT_ID",
  storageBucket:     "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId:             "PASTE_YOUR_APP_ID"
};

/* ─── STYLES ────────────────────────────────────────────────────────── */
const CSS = `
/* ── DQ NAV BAR ─────────────────────────────────────── */
#dq-nav {
  position: fixed; top: 0; left: 0; right: 0; height: 46px;
  background: rgba(9,12,18,0.95); backdrop-filter: blur(14px);
  border-bottom: 1px solid #1e3048;
  display: flex; align-items: center; padding: 0 16px; gap: 6px;
  z-index: 10000; font-family: 'Outfit', sans-serif;
}
#dq-nav-logo {
  font-size: .85rem; font-weight: 800; color: #e8eef8;
  text-decoration: none; display: flex; align-items: center; gap: 5px;
  flex-shrink: 0; margin-right: 4px;
}
#dq-nav-logo .dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: linear-gradient(135deg,#2dcc6f,#3a7fff);
  box-shadow: 0 0 7px #2dcc6f;
}
.dq-nav-link {
  font-size: .68rem; font-weight: 700; color: #7a9abf;
  text-decoration: none; padding: 4px 8px; border-radius: 6px;
  transition: background .15s, color .15s; white-space: nowrap;
  border: 1px solid transparent;
}
.dq-nav-link:hover { color: #e8eef8; background: rgba(255,255,255,.06); }
.dq-nav-link.active { color: #4de888; border-color: rgba(77,232,136,.25); background: rgba(77,232,136,.07); }
#dq-nav-overflow { display: none; } /* shown on narrow screens */
#dq-nav-more-btn {
  margin-left: auto; font-size: .68rem; font-weight: 700; color: #7a9abf;
  background: none; border: 1px solid #1e3048; border-radius: 6px;
  padding: 4px 10px; cursor: pointer; font-family: inherit;
  transition: all .15s; white-space: nowrap;
}
#dq-nav-more-btn:hover { color: #e8eef8; border-color: #3a7fff; }

/* login button */
#dq-login-btn {
  margin-left: auto; display: flex; align-items: center; gap: 6px;
  background: none; border: 1px solid #2a4468; border-radius: 8px;
  color: #7a9abf; font-family: inherit; font-size: .68rem; font-weight: 700;
  padding: 5px 11px; cursor: pointer; transition: all .15s; flex-shrink: 0;
}
#dq-login-btn:hover { border-color: #3a7fff; color: #4de888; }
#dq-login-btn.logged-in { border-color: rgba(77,232,136,.35); color: #4de888; }
#dq-user-dot {
  width: 22px; height: 22px; border-radius: 50%;
  background: linear-gradient(135deg,#2dcc6f,#3a7fff);
  display: flex; align-items: center; justify-content: center;
  font-size: .65rem; font-weight: 800; color: #090c12; flex-shrink: 0;
}

/* ── DROPDOWN NAV (overflow) ─────────────────────────── */
#dq-nav-drawer {
  position: fixed; top: 46px; right: 12px;
  background: #0e1320; border: 1px solid #1e3048; border-radius: 12px;
  padding: 8px; width: 210px; z-index: 10001;
  display: none; flex-direction: column; gap: 2px;
  box-shadow: 0 8px 32px rgba(0,0,0,.5);
}
#dq-nav-drawer.open { display: flex; }
.dq-drawer-link {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 10px; border-radius: 8px; text-decoration: none;
  font-family: 'Outfit', sans-serif; font-size: .78rem; font-weight: 700;
  color: #7a9abf; transition: background .12s, color .12s;
}
.dq-drawer-link:hover { background: rgba(255,255,255,.06); color: #e8eef8; }
.dq-drawer-link.active { color: #4de888; background: rgba(77,232,136,.07); }
.dq-drawer-sep { height: 1px; background: #1e3048; margin: 4px 0; }

/* ── LOGIN MODAL ─────────────────────────────────────── */
#dq-auth-modal {
  position: fixed; inset: 0; background: rgba(5,8,14,.88);
  backdrop-filter: blur(20px); z-index: 20000;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none; transition: opacity .2s;
}
#dq-auth-modal.open { opacity: 1; pointer-events: all; }
#dq-auth-box {
  background: #0e1320; border: 1px solid #2a4468; border-radius: 20px;
  padding: 32px 28px; width: 100%; max-width: 380px; position: relative;
  transform: translateY(16px) scale(.97);
  transition: transform .22s cubic-bezier(.4,0,.2,1);
  font-family: 'Outfit', sans-serif;
}
#dq-auth-modal.open #dq-auth-box { transform: none; }
#dq-auth-box::before {
  content: ''; position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
  background: linear-gradient(90deg,transparent,#3a7fff,#2dcc6f,transparent);
}
#dq-auth-close {
  position: absolute; top: 12px; right: 12px; width: 28px; height: 28px;
  border-radius: 7px; background: #192233; border: 1px solid #1e3048;
  color: #7a9abf; font-size: .9rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .15s;
}
#dq-auth-close:hover { color: #e8eef8; }
#dq-auth-title { font-size: 1.35rem; font-weight: 900; letter-spacing: -.03em; color: #e8eef8; margin-bottom: 4px; }
#dq-auth-sub { font-size: .78rem; color: #7a9abf; margin-bottom: 22px; line-height: 1.5; }
.dq-auth-tab-row { display: flex; gap: 6px; margin-bottom: 18px; }
.dq-auth-tab {
  flex: 1; padding: 7px; border-radius: 8px; font-family: inherit;
  font-size: .75rem; font-weight: 700; cursor: pointer;
  background: #192233; border: 1.5px solid #1e3048; color: #7a9abf;
  transition: all .15s;
}
.dq-auth-tab.on { background: rgba(58,127,255,.15); border-color: #3a7fff; color: #60a0ff; }
.dq-auth-label { font-size: .7rem; font-weight: 700; color: #7a9abf; margin-bottom: 5px; display: block; }
.dq-auth-inp {
  width: 100%; background: #192233; border: 1.5px solid #1e3048;
  border-radius: 9px; padding: 10px 13px; color: #e8eef8;
  font-family: inherit; font-size: .88rem; outline: none;
  transition: border-color .15s; margin-bottom: 12px;
}
.dq-auth-inp:focus { border-color: #3a7fff; }
.dq-auth-inp::placeholder { color: #3d5878; }
#dq-auth-submit {
  width: 100%; padding: 11px; border-radius: 10px; border: none;
  background: linear-gradient(135deg,#3a7fff,#1a7a40); color: #fff;
  font-family: inherit; font-size: .9rem; font-weight: 800;
  cursor: pointer; transition: all .15s; margin-top: 4px;
  box-shadow: 0 3px 16px rgba(58,127,255,.3);
}
#dq-auth-submit:hover { filter: brightness(1.12); transform: translateY(-1px); }
#dq-auth-err { font-size: .72rem; color: #ff6060; margin-top: 8px; min-height: 16px; text-align: center; }
#dq-auth-optional {
  margin-top: 18px; padding-top: 14px; border-top: 1px solid #1e3048;
  font-size: .68rem; color: #3d5878; text-align: center; line-height: 1.6;
}
#dq-auth-skip {
  color: #7a9abf; cursor: pointer; text-decoration: underline;
  background: none; border: none; font-family: inherit; font-size: .68rem;
}
#dq-auth-skip:hover { color: #e8eef8; }

/* ── USER MENU (logged in dropdown) ─────────────────── */
#dq-user-menu {
  position: fixed; top: 52px; right: 12px;
  background: #0e1320; border: 1px solid #1e3048; border-radius: 12px;
  padding: 8px; width: 210px; z-index: 10001;
  display: none; flex-direction: column; gap: 4px;
  box-shadow: 0 8px 32px rgba(0,0,0,.5);
  font-family: 'Outfit', sans-serif;
}
#dq-user-menu.open { display: flex; }
.dq-user-info { padding: 8px 10px; }
.dq-user-email { font-size: .7rem; color: #4de888; font-weight: 700; word-break: break-all; }
.dq-user-label { font-size: .6rem; color: #3d5878; margin-top: 2px; }
#dq-signout-btn {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  border-radius: 8px; background: none; border: none; width: 100%;
  font-family: inherit; font-size: .75rem; font-weight: 700;
  color: #ff6060; cursor: pointer; transition: background .12s; text-align: left;
}
#dq-signout-btn:hover { background: rgba(255,96,96,.08); }

/* ── SAVE INDICATOR ─────────────────────────────────── */
#dq-save-toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(20px);
  background: #0e1320; border: 1px solid #2a4468; border-radius: 10px;
  padding: 8px 18px; font-family: 'Outfit', sans-serif; font-size: .75rem;
  font-weight: 700; color: #4de888; z-index: 20000;
  opacity: 0; transition: opacity .2s, transform .2s; pointer-events: none;
  display: flex; align-items: center; gap: 7px;
}
#dq-save-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ── FAB MENU ────────────────────────────────────────── */
#dq-fab-wrap {
  position: fixed; bottom: 24px; right: 24px;
  display: flex; flex-direction: column; align-items: flex-end; gap: 8px; z-index: 999;
}
#dq-fab-toggle {
  width: 34px; height: 34px; border-radius: 50%; background: #28a45a;
  border: none; color: #fff; font-size: 1rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 10px rgba(40,164,90,0.4);
  transition: transform .18s, background .18s;
  font-family: 'Outfit', sans-serif; flex-shrink: 0;
}
#dq-fab-toggle:hover { background: #2ea85a; transform: scale(1.08); }
#dq-fab-toggle.open { transform: rotate(45deg) scale(1.08); background: #1f8a48; }
#dq-fab-items {
  display: flex; flex-direction: column; align-items: flex-end; gap: 7px;
  overflow: hidden; max-height: 0; opacity: 0;
  transition: max-height .4s ease, opacity .25s ease;
}
#dq-fab-items.open { max-height: 600px; opacity: 1; }
.dq-fab-item { display: flex; align-items: center; position: relative; }
.dq-fab-label {
  background: #18181f; color: #c8f0d8; font-size: .62rem; font-weight: 700;
  letter-spacing: .06em; padding: 4px 8px; border-radius: 6px; white-space: nowrap;
  border: 1px solid #2e2e42; opacity: 0; transform: translateX(6px);
  transition: opacity .15s, transform .15s; pointer-events: none; margin-right: 7px;
}
.dq-fab-item:hover .dq-fab-label { opacity: 1; transform: translateX(0); }
.dq-fab-icon {
  width: 30px; height: 30px; border-radius: 50%; background: #28a45a; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: .78rem;
  text-decoration: none; box-shadow: 0 2px 8px rgba(40,164,90,0.3);
  transition: background .15s, transform .15s; flex-shrink: 0;
}
.dq-fab-icon:hover { background: #1f8a48; transform: scale(1.12); }

/* ── WATERMARK ───────────────────────────────────────── */
#dq-watermark {
  position: fixed; bottom: 8px; left: 12px;
  font-family: 'Outfit', sans-serif; font-size: .56rem; font-weight: 600;
  letter-spacing: .1em; color: #1a5c36; text-transform: uppercase;
  pointer-events: none; z-index: 998; white-space: nowrap;
}
`;

/* ─── HELPERS ───────────────────────────────────────────────────────── */
function currentPage() {
  const f = location.pathname.split('/').pop() || 'index.html';
  return f === '' ? 'index.html' : f;
}

function injectStyles() {
  const s = document.createElement('style');
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ─── NAV BAR ───────────────────────────────────────────────────────── */
function buildNav() {
  const cur = currentPage();
  const nav = document.createElement('nav');
  nav.id = 'dq-nav';

  // Logo
  nav.innerHTML = `<a id="dq-nav-logo" href="index.html"><div class="dot"></div>DQ Tools</a>`;

  // Page links (will be hidden on small screens via JS below)
  const linkWrap = document.createElement('div');
  linkWrap.id = 'dq-nav-links';
  linkWrap.style.cssText = 'display:flex;align-items:center;gap:2px;overflow:hidden;';

  DQ_PAGES.forEach(p => {
    const a = document.createElement('a');
    a.className = 'dq-nav-link' + (p.href === cur ? ' active' : '');
    a.href = p.href;
    a.textContent = p.icon + ' ' + p.label;
    linkWrap.appendChild(a);
  });
  nav.appendChild(linkWrap);

  // "More" button (appears when viewport is too narrow)
  const moreBtn = document.createElement('button');
  moreBtn.id = 'dq-nav-more-btn';
  moreBtn.textContent = '☰ Menu';
  moreBtn.style.display = 'none';
  nav.appendChild(moreBtn);

  // Login button (right side)
  const loginBtn = document.createElement('button');
  loginBtn.id = 'dq-login-btn';
  loginBtn.innerHTML = '👤 Sign In';
  nav.appendChild(loginBtn);

  document.body.prepend(nav);

  // Drawer (overflow menu)
  const drawer = document.createElement('div');
  drawer.id = 'dq-nav-drawer';
  DQ_PAGES.forEach((p, i) => {
    if (i > 0) {
      const sep = document.createElement('div');
      sep.className = 'dq-drawer-sep';
      drawer.appendChild(sep);
    }
    const a = document.createElement('a');
    a.className = 'dq-drawer-link' + (p.href === cur ? ' active' : '');
    a.href = p.href;
    a.innerHTML = `<span style="font-size:1rem">${p.icon}</span>${p.label}`;
    drawer.appendChild(a);
  });
  document.body.appendChild(drawer);

  // Toggle drawer
  moreBtn.addEventListener('click', e => {
    e.stopPropagation();
    drawer.classList.toggle('open');
    closeUserMenu();
  });
  document.addEventListener('click', () => { drawer.classList.remove('open'); });

  // Responsive: hide links that overflow
  function fitLinks() {
    const links = [...linkWrap.querySelectorAll('.dq-nav-link')];
    // Reset visibility
    links.forEach(l => l.style.display = '');
    linkWrap.style.display = 'flex';

    // Check if there's a login button taking space
    const loginW = loginBtn.offsetWidth;
    const logoW = nav.querySelector('#dq-nav-logo').offsetWidth;
    const available = nav.offsetWidth - logoW - loginW - 60;

    let used = 0;
    let overflowed = false;
    links.forEach(l => {
      used += l.offsetWidth + 2;
      if (used > available) { l.style.display = 'none'; overflowed = true; }
    });
    moreBtn.style.display = overflowed ? 'block' : 'none';
  }

  window.addEventListener('resize', fitLinks);
  setTimeout(fitLinks, 100); // after fonts load
}

/* ─── AUTH UI ───────────────────────────────────────────────────────── */
let _firebase = null;
let _auth = null;
let _db = null;
let _user = null;

function buildAuthModal() {
  const modal = document.createElement('div');
  modal.id = 'dq-auth-modal';
  modal.innerHTML = `
    <div id="dq-auth-box">
      <button id="dq-auth-close">✕</button>
      <div id="dq-auth-title">DQ Tools Account</div>
      <div id="dq-auth-sub">Save your GPA, courses, and settings across devices. Free, optional, and private.</div>
      <div class="dq-auth-tab-row">
        <button class="dq-auth-tab on" id="dq-tab-signin">Sign In</button>
        <button class="dq-auth-tab" id="dq-tab-signup">Create Account</button>
      </div>
      <label class="dq-auth-label">Email</label>
      <input class="dq-auth-inp" id="dq-auth-email" type="email" placeholder="you@example.com" autocomplete="email">
      <label class="dq-auth-label">Password</label>
      <input class="dq-auth-inp" id="dq-auth-pass" type="password" placeholder="••••••••" autocomplete="current-password">
      <div id="dq-auth-err"></div>
      <button id="dq-auth-submit">Sign In</button>
      <div id="dq-auth-optional">
        No account? No problem —<br>
        <button id="dq-auth-skip">Continue without signing in</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  let mode = 'signin';
  const submitBtn = document.getElementById('dq-auth-submit');

  document.getElementById('dq-tab-signin').addEventListener('click', () => {
    mode = 'signin';
    document.getElementById('dq-tab-signin').classList.add('on');
    document.getElementById('dq-tab-signup').classList.remove('on');
    submitBtn.textContent = 'Sign In';
    document.getElementById('dq-auth-err').textContent = '';
  });
  document.getElementById('dq-tab-signup').addEventListener('click', () => {
    mode = 'signup';
    document.getElementById('dq-tab-signup').classList.add('on');
    document.getElementById('dq-tab-signin').classList.remove('on');
    submitBtn.textContent = 'Create Account';
    document.getElementById('dq-auth-err').textContent = '';
  });

  document.getElementById('dq-auth-close').addEventListener('click', closeAuthModal);
  document.getElementById('dq-auth-skip').addEventListener('click', closeAuthModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeAuthModal(); });

  document.getElementById('dq-auth-submit').addEventListener('click', async () => {
    if (!_auth) { showAuthError('Firebase not set up yet. See dq-shared.js config.'); return; }
    const email = document.getElementById('dq-auth-email').value.trim();
    const pass  = document.getElementById('dq-auth-pass').value;
    showAuthError('');
    submitBtn.textContent = '…';
    try {
      const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
      if (mode === 'signin') {
        await signInWithEmailAndPassword(_auth, email, pass);
      } else {
        await createUserWithEmailAndPassword(_auth, email, pass);
      }
      closeAuthModal();
    } catch (e) {
      const msg = e.code === 'auth/invalid-credential' ? 'Wrong email or password.'
                : e.code === 'auth/email-already-in-use' ? 'Account already exists. Try signing in.'
                : e.code === 'auth/weak-password' ? 'Password must be at least 6 characters.'
                : e.code === 'auth/invalid-email' ? 'Please enter a valid email address.'
                : 'Something went wrong. Try again.';
      showAuthError(msg);
      submitBtn.textContent = mode === 'signin' ? 'Sign In' : 'Create Account';
    }
  });

  // Allow Enter key
  ['dq-auth-email','dq-auth-pass'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('dq-auth-submit').click();
    });
  });
}

function showAuthError(msg) {
  document.getElementById('dq-auth-err').textContent = msg;
}
function openAuthModal() {
  document.getElementById('dq-auth-modal').classList.add('open');
}
function closeAuthModal() {
  document.getElementById('dq-auth-modal').classList.remove('open');
}

/* ─── USER MENU (when logged in) ───────────────────────────────────── */
function buildUserMenu() {
  const menu = document.createElement('div');
  menu.id = 'dq-user-menu';
  menu.innerHTML = `
    <div class="dq-user-info">
      <div class="dq-user-email" id="dq-user-email-display">—</div>
      <div class="dq-user-label">Signed in · Data synced</div>
    </div>
    <div class="dq-drawer-sep"></div>
    <button id="dq-signout-btn">🚪 Sign Out</button>`;
  document.body.appendChild(menu);

  document.getElementById('dq-signout-btn').addEventListener('click', async () => {
    if (_auth) {
      const { signOut } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
      await signOut(_auth);
    }
    closeUserMenu();
  });
  document.addEventListener('click', closeUserMenu);
}

function closeUserMenu() {
  document.getElementById('dq-user-menu')?.classList.remove('open');
}

function updateLoginBtn(user) {
  const btn = document.getElementById('dq-login-btn');
  if (!btn) return;
  if (user) {
    const initial = (user.email || '?')[0].toUpperCase();
    btn.innerHTML = `<div id="dq-user-dot">${initial}</div> ${user.email.split('@')[0]}`;
    btn.classList.add('logged-in');
    document.getElementById('dq-user-email-display').textContent = user.email;
    btn.onclick = (e) => {
      e.stopPropagation();
      document.getElementById('dq-nav-drawer')?.classList.remove('open');
      document.getElementById('dq-user-menu').classList.toggle('open');
    };
  } else {
    btn.innerHTML = '👤 Sign In';
    btn.classList.remove('logged-in');
    btn.onclick = (e) => {
      e.stopPropagation();
      openAuthModal();
    };
  }
}

/* ─── FIREBASE INIT ─────────────────────────────────────────────────── */
async function initFirebase() {
  // Skip if placeholder config
  if (FIREBASE_CONFIG.apiKey === 'PASTE_YOUR_API_KEY') {
    console.info('[DQ] Firebase not configured — login disabled. Edit FIREBASE_CONFIG in dq-shared.js');
    return;
  }
  try {
    const [{ initializeApp }, { getAuth, onAuthStateChanged }, { getFirestore }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'),
    ]);

    _firebase = initializeApp(FIREBASE_CONFIG);
    _auth = getAuth(_firebase);
    _db = getFirestore(_firebase);

    onAuthStateChanged(_auth, user => {
      _user = user;
      updateLoginBtn(user);
      window.dispatchEvent(new CustomEvent('dq:authchange', { detail: { user } }));
    });
  } catch (e) {
    console.warn('[DQ] Firebase init failed:', e);
  }
}

/* ─── PUBLIC API — call these from your tool pages ──────────────────── */

/**
 * Save data for the current user.
 * key: e.g. 'gpa', 'courseplanner'
 * data: any JSON-serialisable object
 */
window.DQ = {
  saveData: async function(key, data) {
    if (!_user || !_db) {
      // Fall back to localStorage for guests
      try { localStorage.setItem('dq_' + key, JSON.stringify(data)); } catch (_) {}
      return false;
    }
    try {
      const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      await setDoc(doc(_db, 'users', _user.uid, 'data', key), { payload: JSON.stringify(data), ts: Date.now() });
      showSaveToast('✓ Saved to your account');
      return true;
    } catch (e) {
      console.warn('[DQ] save failed', e);
      return false;
    }
  },

  loadData: async function(key) {
    if (!_user || !_db) {
      // Guest: load from localStorage
      try { const v = localStorage.getItem('dq_' + key); return v ? JSON.parse(v) : null; }
      catch (_) { return null; }
    }
    try {
      const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      const snap = await getDoc(doc(_db, 'users', _user.uid, 'data', key));
      if (snap.exists()) return JSON.parse(snap.data().payload);
      return null;
    } catch (e) {
      console.warn('[DQ] load failed', e); return null;
    }
  },

  /** Returns the current Firebase user, or null if guest */
  getUser: () => _user,

  /** Open the sign-in modal from any tool (e.g. on Save click) */
  promptLogin: () => openAuthModal(),

  /** Show a short toast notification */
  toast: (msg) => showSaveToast(msg),
};

/* ─── TOAST ─────────────────────────────────────────────────────────── */
let _toastTimer;
function showSaveToast(msg) {
  const t = document.getElementById('dq-save-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ─── FAB MENU ──────────────────────────────────────────────────────── */
function buildFAB() {
  const cur = currentPage();
  const wrap = document.createElement('div');
  wrap.id = 'dq-fab-wrap';

  const items = document.createElement('div');
  items.id = 'dq-fab-items';

  DQ_PAGES
    .filter(p => p.href !== cur)
    .forEach(p => {
      const item = document.createElement('div');
      item.className = 'dq-fab-item';
      item.innerHTML = `<span class="dq-fab-label">${p.label}</span><a class="dq-fab-icon" href="${p.href}">${p.icon}</a>`;
      items.appendChild(item);
    });

  const toggle = document.createElement('button');
  toggle.id = 'dq-fab-toggle';
  toggle.setAttribute('aria-label', 'Open navigation menu');
  toggle.textContent = '＋';
  toggle.addEventListener('click', e => {
    e.stopPropagation();
    toggle.classList.toggle('open');
    items.classList.toggle('open');
  });
  document.addEventListener('click', () => {
    toggle.classList.remove('open');
    items.classList.remove('open');
  });

  wrap.appendChild(items);
  wrap.appendChild(toggle);
  document.body.appendChild(wrap);
}

/* ─── WATERMARK ─────────────────────────────────────────────────────── */
function buildWatermark() {
  const w = document.createElement('div');
  w.id = 'dq-watermark';
  w.textContent = '© 2026 DQtools by E. S.';
  document.body.appendChild(w);
}

/* ─── TOAST ELEMENT ─────────────────────────────────────────────────── */
function buildToast() {
  const t = document.createElement('div');
  t.id = 'dq-save-toast';
  document.body.appendChild(t);
}

/* ─── BODY PADDING (so nav doesn't cover content) ──────────────────── */
function padBody() {
  // Add top padding equal to nav height if body doesn't already have it
  const existing = parseInt(getComputedStyle(document.body).paddingTop) || 0;
  if (existing < 46) {
    document.body.style.paddingTop = Math.max(existing, 46) + 'px';
  }
}

/* ─── BOOT ──────────────────────────────────────────────────────────── */
function boot() {
  // Remove old watermark divs (the static ones in each page)
  document.querySelectorAll('.dq-watermark').forEach(el => el.remove());
  // Remove old FAB menus
  document.querySelectorAll('.fab2-wrap, .fab-wrap').forEach(el => el.remove());

  injectStyles();
  buildNav();
  buildFAB();
  buildAuthModal();
  buildUserMenu();
  buildWatermark();
  buildToast();
  padBody();
  initFirebase();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
