/**
 * 主应用逻辑
 * 初始化和处理全局功能
 */

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initScrollHighlight();
});

/**
 * 初始化移动端菜单
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });

    // 点击侧边栏外部关闭
    document.addEventListener('click', function(e) {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
}

/**
 * 初始化滚动高亮
 */
function initScrollHighlight() {
  const tocLinks = document.querySelectorAll('#tocNav .sidebar-link');
  const headings = document.querySelectorAll('.markdown-content h2, .markdown-content h3');

  if (tocLinks.length === 0 || headings.length === 0) return;

  // 滚动时高亮当前章节
  window.addEventListener('scroll', function() {
    let current = '';
    const scrollPos = window.scrollY + 100;

    headings.forEach(heading => {
      const top = heading.offsetTop;
      if (scrollPos >= top) {
        current = heading.getAttribute('id');
      }
    });

    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * 平滑滚动到指定元素
 * @param {string} targetId - 目标元素ID
 */
function scrollToElement(targetId) {
  const element = document.getElementById(targetId);
  if (element) {
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = element.offsetTop - navbarHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

/**
 * 显示通知消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success|error|info)
 */
function showNotification(message, type = 'info') {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 12px 20px;
    background: var(--bg-card);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 3000;
    animation: slideIn 0.3s ease;
  `;

  if (type === 'success') {
    notification.style.borderColor = 'var(--success)';
  } else if (type === 'error') {
    notification.style.borderColor = 'var(--error)';
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  // 3秒后移除
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(style);