/**
 * Markdown 加载和渲染
 * 动态加载 Markdown 文件并渲染为 HTML
 */

/**
 * 加载并渲染 Markdown 内容
 * @param {string} path - Markdown 文件路径
 */
async function loadMarkdownContent(path) {
  const contentEl = document.getElementById('markdown-content');

  if (!contentEl) return;

  try {
    // 获取 Markdown 内容
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const markdown = await response.text();

    // 配置 marked
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: true,
      highlight: function(code, lang) {
        if (Prism && Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      }
    });

    // 渲染 Markdown
    contentEl.innerHTML = marked.parse(markdown);

    // 生成目录
    generateTOC(contentEl);

    // 处理代码块
    processCodeBlocks(contentEl);

    // 处理链接
    processLinks(contentEl);

  } catch (error) {
    console.error('加载 Markdown 失败:', error);
    contentEl.innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--error)" stroke-width="1.5" style="margin: 0 auto 1rem;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">内容加载失败</h3>
        <p style="color: var(--text-muted);">请检查文件路径是否正确，或刷新页面重试</p>
      </div>
    `;
  }
}

/**
 * 生成目录
 * @param {HTMLElement} contentEl - 内容容器
 */
function generateTOC(contentEl) {
  const tocNav = document.getElementById('tocNav');
  if (!tocNav) return;

  const headings = contentEl.querySelectorAll('h2, h3');
  if (headings.length === 0) return;

  // 清空现有目录
  tocNav.innerHTML = '';

  headings.forEach((heading, index) => {
    // 确保 ID 存在
    if (!heading.id) {
      heading.id = 'section-' + index;
    }

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + heading.id;
    a.className = 'sidebar-link';
    a.textContent = heading.textContent;

    // 如果是 h3，添加缩进
    if (heading.tagName === 'H3') {
      a.style.paddingLeft = '1.5rem';
      a.style.fontSize = '0.875rem';
    }

    // 点击事件
    a.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToElement(heading.id);
    });

    li.appendChild(a);
    tocNav.appendChild(li);
  });
}

/**
 * 处理代码块
 * @param {HTMLElement} contentEl - 内容容器
 */
function processCodeBlocks(contentEl) {
  const codeBlocks = contentEl.querySelectorAll('pre');

  codeBlocks.forEach(pre => {
    // 添加复制按钮
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    wrapper.style.cssText = 'position: relative;';

    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    // 创建复制按钮
    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `;
    copyBtn.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 6px;
      background: var(--bg-tertiary);
      border: none;
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
    `;

    wrapper.addEventListener('mouseenter', () => copyBtn.style.opacity = '1');
    wrapper.addEventListener('mouseleave', () => copyBtn.style.opacity = '0');

    copyBtn.addEventListener('click', async function() {
      const code = pre.textContent;
      try {
        await navigator.clipboard.writeText(code);
        copyBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          `;
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    });

    wrapper.appendChild(copyBtn);
  });
}

/**
 * 处理链接
 * @param {HTMLElement} contentEl - 内容容器
 */
function processLinks(contentEl) {
  const links = contentEl.querySelectorAll('a');

  links.forEach(link => {
    // 外部链接在新窗口打开
    if (link.hostname !== window.location.hostname) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });
}

/**
 * 加载版本历史
 * @param {string} pageId - 页面ID
 */
async function loadVersionHistory(pageId) {
  const timelineEl = document.getElementById('versionTimeline');
  if (!timelineEl) return;

  try {
    const response = await fetch('/data/history.json');
    const history = await response.json();

    const versions = history[pageId] || [];

    if (versions.length === 0) {
      timelineEl.innerHTML = '<p style="color: var(--text-muted);">暂无版本历史</p>';
      return;
    }

    timelineEl.innerHTML = versions.map(v => `
      <div class="version-item">
        <div class="version-date">${v.date} · v${v.version}</div>
        <div class="version-changes">${v.changes}</div>
      </div>
    `).join('');

  } catch (error) {
    console.error('加载版本历史失败:', error);
    timelineEl.innerHTML = '<p style="color: var(--text-muted);">版本历史加载失败</p>';
  }
}

// 导出全局函数
window.loadMarkdownContent = loadMarkdownContent;
window.loadVersionHistory = loadVersionHistory;
window.scrollToElement = scrollToElement;