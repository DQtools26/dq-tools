/**
 * DQ Tools — Shared Module (FAB + labels only)
 * This file is dormant unless explicitly loaded. It provides:
 *   - buildFAB(): injects the floating nav menu
 *   - DQ_DATA_LABELS: canonical friendly names for saved data keys
 */

/* ─── PAGE LIST ─────────────────────────────────────────────────────── */
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

/* ─── CANONICAL DATA KEY LABELS ─────────────────────────────────────── */
const DQ_DATA_LABELS = {
  gpa:               { icon: '🎓', label: 'GPA Review',                    desc: 'Course grades and GPA data' },
  courseplanner:     { icon: '📅', label: 'Course Planner',                desc: '4-year academic schedule' },
  dqtasks:           { icon: '✅', label: 'DQTasks',                       desc: 'Tasks, assignments and events' },
  dqtasks_prefs:     { icon: '✅', label: 'DQTasks — Color Theme & Settings', desc: 'Color theme, display preferences' },
  dqstudy:           { icon: '📚', label: 'DQ Study',                      desc: 'Flashcards and study progress' },
  'dqstudy-settings':{ icon: '📚', label: 'DQ Study — Settings',           desc: 'Study mode preferences' },
  'dqstudy-gam':     { icon: '📚', label: 'DQ Study — Streaks & XP',       desc: 'Gamification progress' },
  geocalc_prefs:     { icon: '📐', label: 'GeoCalc — Settings',            desc: 'Decimal and display preferences' },
  algicalc_prefs:    { icon: '📊', label: 'AlgCalc — Settings',            desc: 'Settings and preferences' },
  mathcalc_prefs:    { icon: '🧮', label: 'MathCalc — Settings',           desc: 'Settings and preferences' },
  dqtable_prefs:     { icon: '⚗️', label: 'DQTable — Settings',            desc: 'Settings and preferences' },
};

/* ─── FAB CSS ────────────────────────────────────────────────────────── */
const FAB_CSS = `
#dq-fab-wrap{position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;align-items:flex-end;gap:8px;z-index:999;}
#dq-fab-toggle{width:34px;height:34px;border-radius:50%;background:#28a45a;border:none;color:#fff;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(40,164,90,0.4);transition:transform .18s,background .18s;font-family:'Outfit',sans-serif;flex-shrink:0;}
#dq-fab-toggle:hover{background:#2ea85a;transform:scale(1.08);}
#dq-fab-toggle.open{transform:rotate(45deg) scale(1.08);background:#1f8a48;}
#dq-fab-items{display:flex;flex-direction:column;align-items:flex-end;gap:7px;overflow:hidden;max-height:0;opacity:0;transition:max-height .4s ease,opacity .25s ease;}
#dq-fab-items.open{max-height:600px;opacity:1;}
.dq-fab-item{display:flex;align-items:center;}
.dq-fab-label{background:#18181f;color:#c8f0d8;font-size:.62rem;font-weight:700;letter-spacing:.06em;padding:4px 8px;border-radius:6px;white-space:nowrap;border:1px solid #2e2e42;opacity:0;transform:translateX(6px);transition:opacity .15s,transform .15s;pointer-events:none;margin-right:7px;}
.dq-fab-item:hover .dq-fab-label{opacity:1;transform:translateX(0);}
.dq-fab-icon{width:30px;height:30px;border-radius:50%;background:#28a45a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.78rem;text-decoration:none;box-shadow:0 2px 8px rgba(40,164,90,0.3);transition:background .15s,transform .15s;flex-shrink:0;}
.dq-fab-icon:hover{background:#1f8a48;transform:scale(1.12);}
`;

/* ─── BUILD FAB ──────────────────────────────────────────────────────── */
function buildFAB() {
  const style = document.createElement('style');
  style.textContent = FAB_CSS;
  document.head.appendChild(style);

  const cur = location.pathname.split('/').pop() || 'index.html';

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
  toggle.textContent = '☰';
  toggle.addEventListener('click', e => {
    e.stopPropagation();
    const open = items.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.textContent = open ? '✕' : '☰';
  });
  document.addEventListener('click', () => {
    items.classList.remove('open');
    toggle.classList.remove('open');
    toggle.textContent = '☰';
  });

  wrap.appendChild(items);
  wrap.appendChild(toggle);
  document.body.appendChild(wrap);
}

/* ─── BOOT ───────────────────────────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildFAB);
} else {
  buildFAB();
}
