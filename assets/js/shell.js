(function() {
  const themeKey = 'dartcool-theme';
  const pages = [
    { id: 'home', title: '工作台', href: '/', icon: 'grid' },
    { id: 'mdr', title: '市场 MDR', href: '/pages/mdr.html', icon: 'trend' },
    { id: 'pdr', title: '产品 PDR', href: '/pages/pdr.html', icon: 'clipboard' },
    { id: 'hdr', title: '硬件 HDR', href: '/pages/hdr.html', icon: 'chip' },
    { id: 'solution', title: '硬件方案生成', href: '/pages/solution.html', icon: 'spark' },
    { id: 'prompt', title: '硬件 Prompt', href: '/pages/prompt.html', icon: 'wand' },
    { id: 'schematic', title: '原理图识别', href: '/pages/schematic-recognition.html', icon: 'scan' },
    { id: 'analysis', title: '电路原理分析', href: '/pages/circuit-analysis.html', icon: 'circuit' },
    { id: 'datasheet', title: '芯片手册解析', href: '/pages/datasheet.html', icon: 'book' },
    { id: 'skills', title: 'Skills 技能库', href: '/pages/skills.html', icon: 'star' },
    { id: 'mcp', title: 'MCP 工具', href: '/pages/mcp-tools.html', icon: 'plug' }
  ];

  function iconSvg(name) {
    const icons = {
      grid: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>',
      trend: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 16l6-6 4 4 6-8"/><path d="M14 6h6v6"/></svg>',
      clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 4V2h6v2"/></svg>',
      chip: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4"/></svg>',
      spark: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 2l1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7z"/></svg>',
      wand: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M3 21l12-12"/><path d="M14 4l6 6"/><path d="M16 2l6 6"/></svg>',
      scan: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
      circuit: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 12h6m4 0h6"/><circle cx="10" cy="12" r="2"/><circle cx="14" cy="12" r="2"/><path d="M10 10V6m4 12v-4"/></svg>',
      book: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 4h11a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M18 6h2v14h-2"/></svg>',
      star: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 3l2.9 5.9 6.5.9-4.7 4.5 1.1 6.4L12 17.9 6.2 20.7l1.1-6.4L2.6 9.8l6.5-.9z"/></svg>',
      plug: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M7 7v4m10-4v4M9 11h6v4a3 3 0 0 1-3 3v0a3 3 0 0 1-3-3z"/><path d="M12 18v4"/></svg>'
    };
    return icons[name] || icons.grid;
  }

  function logoSvg() {
    return `
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="7" y="7" width="50" height="50" rx="14" fill="#1D75FF"/>
        <path d="M14 18L47 12L35 31L51 20L28 51L30 34L14 18Z" fill="#FFFFFF"/>
        <path d="M18 22L36 34" stroke="#D7ECFF" stroke-width="2.2" stroke-linecap="round" opacity="0.8"/>
      </svg>
    `;
  }

  function buildSidebar(activeId) {
    const groups = [
      { label: '工作台', items: pages }
    ];

    return `
      <aside class="sidebar${activeId === 'collapsed' ? ' collapsed' : ''}" id="sidebar">
        <a class="brand" href="/">
          <span class="brand-mark">${logoSvg()}</span>
          <span class="brand-copy">
            <span class="brand-title">DartCool</span>
            <span class="brand-subtitle">工作台</span>
          </span>
        </a>
        <nav class="sidebar-nav">
          ${groups.map(group => `
            <div class="nav-section">
              <div class="nav-label">${group.label}</div>
              ${group.items.map(item => `
                <a class="nav-item${item.id === activeId ? ' active' : ''}" href="${item.href}">
                  <span class="nav-icon">${iconSvg(item.icon)}</span>
                  <span class="nav-text">${item.title}</span>
                </a>
              `).join('')}
            </div>
          `).join('')}
        </nav>
        <div class="sidebar-footer">
          <button class="collapse-btn" id="collapseBtn" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M14 4l-6 8 6 8"/>
            </svg>
            <span>收起</span>
          </button>
        </div>
      </aside>
    `;
  }

  function buildTopbar() {
    return `
      <header class="topbar">
        <button class="topbar-icon" id="themeToggle" type="button" aria-label="切换主题">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.8A8.8 8.8 0 1 1 11.2 3a7.2 7.2 0 0 0 9.8 9.8z"/>
          </svg>
        </button>
        <div class="topbar-pill">1</div>
      </header>
    `;
  }

  function buildWorkspace() {
    return `
      <main class="main">
        ${buildTopbar()}
        <section class="workspace">
          <div class="empty-state">敬请期待！</div>
        </section>
      </main>
    `;
  }

  function mountApp() {
    const root = document.querySelector('[data-app-root]');
    if (!root) return;

    const pageId = document.body.dataset.page || 'home';
    const sidebarHtml = buildSidebar(pageId);
    const workspaceHtml = buildWorkspace();
    root.className = 'app-shell';
    root.innerHTML = sidebarHtml + workspaceHtml;

    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    const themeToggle = document.getElementById('themeToggle');

    if (collapseBtn && sidebar) {
      collapseBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }

    if (themeToggle) {
      const savedTheme = localStorage.getItem(themeKey);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', savedTheme);
      }

      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem(themeKey, next);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', mountApp);
  window.__shellPages = pages;
})();
