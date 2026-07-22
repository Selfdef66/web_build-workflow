(function() {
  let searchIndex = [];
  let searchModal;
  let searchInput;
  let searchResults;

  function initSearch() {
    searchModal = document.getElementById('searchModal');
    searchInput = document.getElementById('searchInput');
    searchResults = document.getElementById('searchResults');

    if (!searchModal || !searchInput || !searchResults) return;

    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
      searchBtn.addEventListener('click', openSearch);
    }

    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }

      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        closeSearch();
      }
    });

    searchModal.addEventListener('click', function(e) {
      if (e.target === searchModal) {
        closeSearch();
      }
    });

    searchInput.addEventListener('input', debounce(performSearch, 200));
    buildSearchIndex();
  }

  async function buildSearchIndex() {
    try {
      const response = await fetch('/config/pages.json');
      const pages = await response.json();

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
             item.keywords.some(keyword => keyword.toLowerCase().includes(query));
    });

    renderResults(results, query);
  }

  function renderResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-no-results">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin: 0 auto 1rem;">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <p>未找到与 “${query}” 相关的结果</p>
        </div>
      `;
      return;
    }

    searchResults.innerHTML = results.map(item => {
      const preview = extractPreview(item.content, query);

      return `
        <a href="${item.url}" class="search-result-item" onclick="closeSearch()">
          <div class="search-result-title">${highlightMatch(item.title, query)}</div>
          <div class="search-result-preview">${preview}</div>
        </a>
      `;
    }).join('');
  }

  function extractPreview(content, query) {
    const index = content.indexOf(query);
    if (index === -1) {
      return `${content.substring(0, 100)}...`;
    }

    const start = Math.max(0, index - 30);
    const end = Math.min(content.length, index + query.length + 70);
    let preview = content.substring(start, end);

    if (start > 0) preview = `...${preview}`;
    if (end < content.length) preview = `${preview}...`;

    return highlightMatch(preview, query);
  }

  function highlightMatch(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark style="background: rgba(124, 92, 255, 0.25); color: var(--text-primary); padding: 0 3px; border-radius: 4px;">$1</mark>');
  }

  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function openSearch() {
    searchModal.classList.add('active');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    searchModal.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '<div class="search-no-results">输入关键词开始搜索</div>';
    document.body.style.overflow = '';
  }

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  document.addEventListener('DOMContentLoaded', initSearch);

  window.openSearch = openSearch;
  window.closeSearch = closeSearch;
})();
