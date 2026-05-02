(function () {
  const PAGES = [
    { label: 'My Account',     href: 'account.html',          icon: '👤' },
    { label: 'Home',           href: 'index.html',            icon: '🏠' },
    { label: 'DQTasks',        href: 'dqtasks.html',          icon: '✅' },
    { label: 'DQtable',        href: 'dqtable.html',          icon: '⚗️' },
    { label: 'Course Planner', href: 'courseplanner.html',    icon: '📅' },
    { label: 'GPA Review',     href: 'gpareview.html',        icon: '🎓' },
    { label: 'DQ Study',       href: 'dqstudy.html',          icon: '📚' },
    { label: 'MathCalc',       href: 'mathcalc.html',         icon: '🧮' },
    { label: 'DQtrivia',        href: 'trivia/index.html',          icon: '🎮' },
    { label: 'Terms & Policies', href: 'termsandpolicies.html', icon: '📋' },
  ];

  const CSS = `
    .fab2-wrap{position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;align-items:flex-end;gap:8px;z-index:999;}
    .fab2-toggle{width:34px;height:34px;border-radius:50%;background:#28a45a;border:none;color:#fff;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(40,164,90,0.4);transition:transform .18s,background .18s;font-family:'Outfit',sans-serif;flex-shrink:0;}
    .fab2-toggle:hover{background:#2ea85a;transform:scale(1.08);}
    .fab2-toggle.open{transform:rotate(45deg) scale(1.08);background:#1f8a48;}
    .fab2-items{display:flex;flex-direction:column;align-items:flex-end;gap:7px;overflow:hidden;max-height:0;opacity:0;transition:max-height .4s ease,opacity .25s ease;}
    .fab2-items.open{max-height:500px;opacity:1;}
    .fab2-item{display:flex;align-items:center;position:relative;}
    .fab2-label{background:#18181f;color:#c8f0d8;font-size:.62rem;font-weight:700;letter-spacing:.06em;padding:4px 8px;border-radius:6px;white-space:nowrap;border:1px solid #2e2e42;opacity:0;transform:translateX(6px);transition:opacity .15s,transform .15s;pointer-events:none;margin-right:7px;}
    .fab2-item:hover .fab2-label{opacity:1;transform:translateX(0);}
    .fab2-icon{width:30px;height:30px;border-radius:50%;background:#28a45a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:.78rem;text-decoration:none;box-shadow:0 2px 8px rgba(40,164,90,0.3);transition:background .15s,transform .15s;flex-shrink:0;}
    .fab2-icon:hover{background:#1f8a48;transform:scale(1.12);}
  `;

  function init() {
    // Don't double-inject
    if (document.getElementById('dq-fab-wrap')) return;

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const cur = location.pathname.split('/').pop() || 'index.html';

    // Build items
    const itemsEl = document.createElement('div');
    itemsEl.className = 'fab2-items';
    itemsEl.id = 'fab2menu';

    PAGES
      .filter(p => p.href !== cur)
      .forEach(p => {
        const item = document.createElement('div');
        item.className = 'fab2-item';
        item.innerHTML = `<span class="fab2-label">${p.label}</span><a class="fab2-icon" href="${p.href}">${p.icon}</a>`;
        itemsEl.appendChild(item);
      });

    // Build toggle button
    const btn = document.createElement('button');
    btn.className = 'fab2-toggle';
    btn.id = 'fab2btn';
    btn.textContent = '☰';
    btn.addEventListener('click', function () {
      itemsEl.classList.toggle('open');
      btn.classList.toggle('open');
      btn.textContent = btn.classList.contains('open') ? '✕' : '☰';
    });

    // Build wrapper
    const wrap = document.createElement('div');
    wrap.className = 'fab2-wrap';
    wrap.id = 'dq-fab-wrap';
    wrap.appendChild(itemsEl);
    wrap.appendChild(btn);
    document.body.appendChild(wrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
