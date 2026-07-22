async function loadMarkdownContent(path) {
  const contentEl = document.getElementById('markdown-content');

  if (!contentEl) return;

  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const markdown = await response.text();

    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: true,
      highlight: function(code, lang) {
        if (window.Prism && lang && Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      }
    });

    contentEl.innerHTML = marked.parse(markdown);
    generateTOC(contentEl);
    processCodeBlocks(contentEl);
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
        <p style="color: var(--text-muted);">请检查文档路径是否正确，或刷新页面重试。</p>
      </div>
    `;
  }
}

function generateTOC(contentEl) {
  const tocNav = document.getElementById('tocNav');
  if (!tocNav) return;

  const headings = contentEl.querySelectorAll('h2, h3');
  if (headings.length === 0) return;

  tocNav.innerHTML = '';

  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `section-${index}`;
    }

    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.className = 'sidebar-link';
    link.textContent = heading.textContent;

    if (heading.tagName === 'H3') {
      link.style.paddingLeft = '1.5rem';
      link.style.fontSize = '0.86rem';
    }

    link.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToElement(heading.id);
    });

    listItem.appendChild(link);
    tocNav.appendChild(listItem);
  });
}

function processCodeBlocks(contentEl) {
  const codeBlocks = contentEl.querySelectorAll('pre');

  codeBlocks.forEach(pre => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    wrapper.style.cssText = 'position: relative;';

    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.setAttribute('aria-label', '复制代码');
    copyBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `;
    copyBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-sm);
      color: var(--text-tertiary);
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
    `;

    wrapper.addEventListener('mouseenter', () => copyBtn.style.opacity = '1');
    wrapper.addEventListener('mouseleave', () => copyBtn.style.opacity = '0');

    copyBtn.addEventListener('click', async function() {
      try {
        await navigator.clipboard.writeText(pre.textContent);
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
        }, 1800);
      } catch (err) {
        console.error('复制失败:', err);
      }
    });

    wrapper.appendChild(copyBtn);
  });
}

function processLinks(contentEl) {
  const links = contentEl.querySelectorAll('a');

  links.forEach(link => {
    if (link.hostname !== window.location.hostname) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });
}

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

    timelineEl.innerHTML = versions.map(version => `
      <div class="version-item">
        <div class="version-date">${version.date} · v${version.version}</div>
        <div class="version-changes">${version.changes}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('加载版本历史失败:', error);
    timelineEl.innerHTML = '<p style="color: var(--text-muted);">版本历史加载失败</p>';
  }
}

window.loadMarkdownContent = loadMarkdownContent;
window.loadVersionHistory = loadVersionHistory;
window.scrollToElement = scrollToElement;
