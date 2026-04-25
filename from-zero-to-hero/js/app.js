/* ============================================================
   DinoooKompjuteruuuuu — app.js
   Dark mode toggle + sidebar navigation + scroll behaviour
============================================================ */

(function () {
  'use strict';

  // ---- Theme Management ----
  const THEME_KEY = 'fzth-theme';

  function getStoredTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    const icon = document.getElementById('themeIcon');
    if (!icon) return;
    if (theme === 'dark') {
      icon.className = 'bi bi-sun-fill';
    } else {
      icon.className = 'bi bi-moon-stars-fill';
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-bs-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Apply on load
  applyTheme(getStoredTheme());

  // Wire toggle button
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', toggleTheme);

    initSidebar();
    initNavbar();
    initScrollProgress();
  });

  // ---- Sidebar Navigation ----
  function initSidebar() {
    const navItems = document.querySelectorAll('.sidebar-nav-item[data-section]');
    const sections = document.querySelectorAll('.content-section');

    if (!navItems.length) return;

    navItems.forEach(function (item) {
      item.addEventListener('click', function () {
        const targetId = this.getAttribute('data-section');
        showSection(targetId);
      });
    });

    // Mobile sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('open');
      });

      // Close sidebar when clicking outside on mobile
      document.addEventListener('click', function (e) {
        if (
          window.innerWidth < 769 &&
          sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          e.target !== sidebarToggle
        ) {
          sidebar.classList.remove('open');
        }
      });
    }

    // Restore active section from URL hash
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
      showSection(hash);
    }
  }

  // Exposed globally so HTML onclick attributes can call it
  window.showSection = function (sectionId) {
    const sections = document.querySelectorAll('.content-section');
    const navItems = document.querySelectorAll('.sidebar-nav-item[data-section]');
    const sidebar = document.getElementById('sidebar');

    sections.forEach(function (s) {
      s.classList.remove('active');
    });

    navItems.forEach(function (n) {
      n.classList.remove('active');
    });

    const target = document.getElementById(sectionId);
    if (target) {
      target.classList.add('active');
      target.classList.remove('page-fade-in');
      // Trigger reflow for animation restart
      void target.offsetWidth;
      target.classList.add('page-fade-in');

      // Scroll to top of content
      const main = document.querySelector('.course-main');
      if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const activeNav = document.querySelector(`.sidebar-nav-item[data-section="${sectionId}"]`);
    if (activeNav) {
      activeNav.classList.add('active');
      activeNav.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    // Close mobile sidebar after navigation
    if (sidebar && window.innerWidth < 769) {
      sidebar.classList.remove('open');
    }

    // Update URL hash without scrolling
    history.replaceState(null, '', '#' + sectionId);
  };

  // ---- Navbar scroll effect ----
  function initNavbar() {
    const navbar = document.querySelector('.glass-nav');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 4px 30px rgba(13,110,253,0.12)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  // ---- Scroll progress bar (only on course/project pages) ----
  function initScrollProgress() {
    const main = document.querySelector('.course-main');
    if (!main) return;

    // Create progress bar element
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    Object.assign(bar.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      height: '3px',
      width: '0%',
      background: 'linear-gradient(90deg, #0d6efd, #6610f2)',
      zIndex: '9999',
      transition: 'width 0.1s linear',
      pointerEvents: 'none'
    });
    document.body.appendChild(bar);

    main.addEventListener('scroll', function () {
      const scrollTop = main.scrollTop;
      const scrollHeight = main.scrollHeight - main.clientHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ---- Smooth scroll for anchor links on index ----
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').slice(1);
        const el = document.getElementById(targetId);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  });

  // ---- Card hover 3D tilt (landing page) ----
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.card-hero').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -4;
        const rotateY = ((x - cx) / cx) * 4;
        card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  });

})();
