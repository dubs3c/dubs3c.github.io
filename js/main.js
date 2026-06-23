(function () {
  // ── Theme toggle ──────────────────────────────────────────────────────
  const STORAGE_KEY = 'dubell-theme';
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀' : '☽';
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
  }

  // Apply theme immediately (before DOM ready) to avoid flash
  initTheme();

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggleTheme);

    // ── Live clock ──────────────────────────────────────────────────────
    const dateEl = document.getElementById('top-bar-date');
    if (dateEl) {
      function updateClock() {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
      updateClock();
      setInterval(updateClock, 60000);
    }

    // ── ToC active section highlighting ────────────────────────────────
    const tocLinks = document.querySelectorAll('.toc-nav a');
    if (tocLinks.length > 0) {
      const headings = Array.from(document.querySelectorAll('.prose h2[id], .prose h3[id]'));

      function onScroll() {
        let current = '';
        headings.forEach(function (h) {
          if (h.getBoundingClientRect().top <= 60) current = h.id;
        });
        tocLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  });

  // Listen for OS-level theme change when no preference saved
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? 'dark' : 'light');
  });
})();
