/**
 * PDF 导出功能
 * 使用浏览器打印功能导出 PDF
 */

(function() {
  /**
   * 导出当前页面为 PDF
   */
  function exportToPDF() {
    // 显示导出提示
    showExportDialog();

    // 延迟执行打印，给用户准备时间
    setTimeout(() => {
      window.print();
    }, 500);
  }

  /**
   * 显示导出对话框
   */
  function showExportDialog() {
    // 创建遮罩
    const overlay = document.createElement('div');
    overlay.id = 'export-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 4000;
    `;

    // 创建对话框
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: 2rem;
      max-width: 400px;
      text-align: center;
      box-shadow: var(--shadow-lg);
    `;

    dialog.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="margin: 0 auto 1rem;">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
      </svg>
      <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">准备导出 PDF</h3>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
        即将打开打印对话框，请选择"另存为 PDF"进行导出
      </p>
      <button class="btn btn-primary" onclick="document.getElementById('export-overlay').remove()">
        知道了
      </button>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // 点击遮罩关闭
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    // 3秒后自动关闭
    setTimeout(() => {
      if (document.getElementById('export-overlay')) {
        overlay.remove();
      }
    }, 3000);
  }

  /**
   * 使用 html2pdf.js 导出（备用方案）
   */
  async function exportWithHtml2Pdf() {
    // 检查是否加载了 html2pdf.js
    if (typeof html2pdf === 'undefined') {
      // 动态加载
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js';
      script.onload = doExport;
      document.head.appendChild(script);
    } else {
      doExport();
    }

    async function doExport() {
      const content = document.querySelector('.markdown-content');
      if (!content) return;

      const options = {
        margin: 10,
        filename: document.title + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      try {
        await html2pdf().set(options).from(content).save();
      } catch (error) {
        console.error('PDF 导出失败:', error);
        // 回退到打印方案
        window.print();
      }
    }
  }

  // DOM 加载完成后绑定事件
  document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.getElementById('exportPdf');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportToPDF);
    }
  });

  // 导出全局函数
  window.exportToPDF = exportToPDF;
})();