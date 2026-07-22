/**
 * 搜索功能
 * 全文搜索所有 Markdown 文档
 */

(function() {
  let searchIndex = [];
  let searchModal, searchInput, searchResults;

  // 初始化搜索
  function initSearch() {
    searchModal = document.getElementById('searchModal');
    searchInput = document.getElementById('searchInput');
    searchResults = document.getElementById('searchResults');

    if (!searchModal || !searchInput || !searchResults) return;

    // 绑定事件
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
      searchBtn.addEventListener('click', openSearch);
    }

    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
      // Ctrl/Cmd + K 打开搜索
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      // ESC 关闭搜索
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        closeSearch();
      }
    });

    // 点击背景关闭
    searchModal.addEventListener('click', function(e) {
      if (e.target === searchModal) {
        closeSearch();
      }
    });

    // 输入事件
    searchInput.addEventListener('input', debounce(performSearch, 200));

    // 加载搜索索引
    buildSearchIndex();
  }

  // 构建搜索索引
  async function buildSearchIndex() {
    try {
      // 获取页面配置
      const response = await fetch('/config/pages.json');
      const pages = await response.json();

      // 遍历所有页面，加载内容
      for (const [id, page] of Object.entries(pages)) {
        try {
          const contentResponse = await fetch(page.content);
          if (contentResponse.ok) {
            const content = await contentResponse.text();
            searchIndex.push({
              id: id,
              title: page.title,
              description: page.description,
              url: `/pages/${id}.html`,
              content: content.toLowerCase(),
              keywords: page.keywords || []
            });
          }
        } catch (err) {
          console.warn(`加载 ${id} 内容失败:`, err);
        }
      }
    } catch (error) {
      console.error('构建搜索索引失败:', error);
    }
  }

  // 执行搜索
  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      searchResults.innerHTML = '<div class="search-no-results">输入关键词开始搜索</div>';
      return;
    }

    const results = searchIndex.filter(item => {
      return item.title.toLowerCase().includes(query) ||
             item.description.toLowerCase().includes(query) ||
             item.content.includes(query) ||
             item.keywords.some(k => k.toLowerCase().includes(query));
    });

    renderResults(results, query);
  }

  // 渲染搜索结果
  function renderResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-no-results">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin: 0 auto 1rem;">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <p>未找到 "${query}" 相关结果</p>
        </div>
      `;
      return;
    }

    searchResults.innerHTML = results.map(item => {
      // 提取摘要
      const preview = extractPreview(item.content, query);

      return `
        <a href="${item.url}" class="search-result-item" onclick="closeSearch()">
          <div class="search-result-title">${highlightMatch(item.title, query)}</div>
          <div class="search-result-preview">${preview}</div>
        </a>
      `;
    }).join('');
  }

  // 提取预览文本
  function extractPreview(content, query) {
    const index = content.indexOf(query);
    if (index === -1) {
      return content.substring(0, 100) + '...';
    }

    const start = Math.max(0, index - 30);
    const end = Math.min(content.length, index + query.length + 70);
    let preview = content.substring(start, end);

    if (start > 0) preview = '...' + preview;
    if (end < content.length) preview = preview + '...';

    return highlightMatch(preview, query);
  }

  // 高亮匹配文本
  function highlightMatch(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark style="background: var(--primary-light); color: var(--primary); padding: 0 2px; border-radius: 2px;">$1</mark>');
  }

  // 转义正则特殊字符
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 打开搜索
  function openSearch() {
    searchModal.classList.add('active');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
  }

  // 关闭搜索
  function closeSearch() {
    searchModal.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '<div class="search-no-results">输入关键词开始搜索</div>';
    document.body.style.overflow = '';
  }

  // 防抖函数
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // DOM 加载完成后初始化
  document.addEventListener('DOMContentLoaded', initSearch);

  // 导出全局函数
  window.openSearch = openSearch;
  window.closeSearch = closeSearch;
})();