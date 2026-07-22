/**
 * 主题切换功能
 * 支持亮色/暗色主题切换，自动保存用户偏好
 */

(function() {
  const THEME_KEY = 'workflow-theme';

  // 初始化主题
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // 设置主题
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // 更新主题图标
  function updateThemeIcon(theme) {
    const sunIcon = document.querySelector('.icon-sun');
    const moonIcon = document.querySelector('.icon-moon');

    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  }

  // 切换主题
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }

  // DOM 加载完成后绑定事件
  document.addEventListener('DOMContentLoaded', function() {
    initTheme();

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
  });

  // 导出全局函数
  window.toggleTheme = toggleTheme;
  window.setTheme = setTheme;
  window.initTheme = initTheme;
})();