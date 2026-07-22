(function() {
  function exportToPDF() {
    showExportDialog();

    setTimeout(() => {
      window.print();
    }, 500);
  }

  function showExportDialog() {
    const overlay = document.createElement('div');
    overlay.id = 'export-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(3, 7, 18, 0.68);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 4000;
      padding: 1rem;
      backdrop-filter: blur(8px);
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      width: min(100%, 420px);
      background: var(--bg-card-solid);
      border: 1px solid var(--border-primary);
      border-radius: 22px;
      padding: 2rem;
      text-align: center;
      box-shadow: var(--shadow-lg);
    `;

    dialog.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-light)" stroke-width="2" style="margin: 0 auto 1rem;">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
      </svg>
      <h3 style="font-size: 1.25rem; font-weight: 750; margin-bottom: 0.5rem; color: var(--text-primary);">准备导出 PDF</h3>
      <p style="color: var(--text-tertiary); margin-bottom: 1.5rem;">
        即将打开打印对话框，请在目标打印机中选择“另存为 PDF”。
      </p>
      <button class="btn btn-primary" onclick="document.getElementById('export-overlay').remove()">
        知道了
      </button>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    setTimeout(() => {
      if (document.getElementById('export-overlay')) {
        overlay.remove();
      }
    }, 3000);
  }

  document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.getElementById('exportPdf');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportToPDF);
    }
  });

  window.exportToPDF = exportToPDF;
})();
