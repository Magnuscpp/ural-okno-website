/**
 * Arbuz Project - Doors & Windows Showcase
 * Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Remove preload class to enable transitions after initial layout
  setTimeout(() => {
    document.body.classList.remove('preload');
  }, 100);

  initFilters();
  initTiltEffects();
  initMobileMenu();
  initNavbarDropdown();
  initSmoothScroll();
  initScrollSpy();
  initScrollTop();
});

// Category filtering
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Navbar Dropdown for Catalog
function initNavbarDropdown() {
  const dropdown = document.getElementById('catalogDropdown');
  const toggleBtn = document.getElementById('catalogDropdownBtn');
  if (!dropdown || !toggleBtn) return;

  let closeTimer = null;

  function openDropdown() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    dropdown.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function scheduleClose() {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      dropdown.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }, 280);
  }

  // Toggle on click
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (dropdown.classList.contains('open')) {
      if (closeTimer) clearTimeout(closeTimer);
      dropdown.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      openDropdown();
    }
  });

  // Open on mouseenter, close with generous buffer on mouseleave
  dropdown.addEventListener('mouseenter', openDropdown);
  dropdown.addEventListener('mouseleave', scheduleClose);

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      if (closeTimer) clearTimeout(closeTimer);
      dropdown.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (closeTimer) clearTimeout(closeTimer);
      dropdown.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// Select category from dropdown menu and smooth scroll
window.selectCatalogCategory = function(catKey) {
  const dropdown = document.getElementById('catalogDropdown');
  const toggleBtn = document.getElementById('catalogDropdownBtn');
  if (dropdown) {
    dropdown.classList.remove('open');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
  }

  filterCategory(catKey);
};

// Global filter helper from navbar
window.filterCategory = function(catKey) {
  const catalogSection = document.getElementById('products');
  if (catalogSection) {
    catalogSection.scrollIntoView({ behavior: 'smooth' });
  }

  let targetFilter = 'all';
  if (catKey === 'entrance' || catKey === 'doors') targetFilter = 'entrance';
  else if (catKey === 'interior') targetFilter = 'interior';
  else if (catKey === 'windows') targetFilter = 'windows';
  else if (catKey === 'patio') targetFilter = 'patio';
  else if (catKey === 'ceilings') targetFilter = 'ceilings';
  else if (catKey === 'gates') targetFilter = 'gates';
  else if (catKey === 'fences') targetFilter = 'fences';
  else if (catKey === 'all') targetFilter = 'all';

  const btn = document.querySelector(`.filter-btn[data-filter="${targetFilter}"]`);
  if (btn) {
    btn.click();
  }

  // Clear sticky hash so reload doesn't snap back
  if (history.replaceState) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  sessionStorage.setItem('uralokno_active_nav', 'products');
};

// Mobile Hamburger Menu
function initMobileMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }
}

window.closeMobileMenu = function() {
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
  }
};

// 3D Tilt Effect on cards and buttons (Original Arbuz Project feature)
function initTiltEffects() {
  const tiltElements = document.querySelectorAll('.product-card, .btn-primary, .btn-secondary');

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// Modal open & close
window.openOrderModal = function(productName = '') {
  const modal = document.getElementById('orderModal');
  const productSelect = document.getElementById('productInterest');

  if (productSelect && productName) {
    // If exact match or close match
    for (let i = 0; i < productSelect.options.length; i++) {
      if (productName.toLowerCase().includes('окно') && productSelect.options[i].value.includes('окна')) {
        productSelect.selectedIndex = i;
        break;
      }
      if (productName.toLowerCase().includes('межкомнат') && productSelect.options[i].value.includes('Межкомнатные')) {
        productSelect.selectedIndex = i;
        break;
      }
      if ((productName.toLowerCase().includes('портал') || productName.toLowerCase().includes('балкон')) && productSelect.options[i].value.includes('балконов')) {
        productSelect.selectedIndex = i;
        break;
      }
      if (productName.toLowerCase().includes('входная') && productSelect.options[i].value.includes('Входные')) {
        productSelect.selectedIndex = i;
        break;
      }
      if (productName.toLowerCase().includes('потолок') && productSelect.options[i].value.includes('потолки')) {
        productSelect.selectedIndex = i;
        break;
      }
      if (productName.toLowerCase().includes('ворот') && productSelect.options[i].value.includes('Ворота')) {
        productSelect.selectedIndex = i;
        break;
      }
      if (productName.toLowerCase().includes('забор') && productSelect.options[i].value.includes('Заборы')) {
        productSelect.selectedIndex = i;
        break;
      }
    }
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeOrderModal = function() {
  const modal = document.getElementById('orderModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
};

// Close modal on click outside box or pressing Esc
window.addEventListener('click', (e) => {
  const modal = document.getElementById('orderModal');
  if (e.target === modal) {
    closeOrderModal();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeOrderModal();
    closeMobileMenu();
  }
});

// Order Form Submit Handler
window.handleOrderSubmit = function(event) {
  event.preventDefault();

  const nameInput = document.getElementById('clientName');
  const phoneInput = document.getElementById('clientPhone');
  const productSelect = document.getElementById('productInterest');

  const leadData = {
    name: nameInput ? nameInput.value.trim() : '',
    phone: phoneInput ? phoneInput.value.trim() : '',
    product: productSelect ? productSelect.value : '',
    date: new Date().toISOString()
  };

  console.log('Новая заявка:', leadData);

  // Close modal and show notification
  closeOrderModal();
  showToast(`Спасибо, ${leadData.name || 'клиент'}! Мы свяжемся с вами в течение 10 минут.`);

  // Reset form
  event.target.reset();
};

// Toast notification helper
function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');

  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}

// Smooth scroll for anchor links & clear URL hash to enable native scroll restoration
function initSmoothScroll() {
  // Let the browser handle scroll restoration naturally (no hash interference)
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto';
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId) return;

      // Home link
      if (targetId === '#' || targetId === '#home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (history.replaceState) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        sessionStorage.setItem('uralokno_active_nav', 'home');
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
        // Clear hash from URL so reload doesn't force-jump to anchor
        if (history.replaceState) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        sessionStorage.setItem('uralokno_active_nav', targetId.replace('#', ''));
      }
    });
  });

  // If page loaded with a hash (e.g. from external link), clear it after scroll completes
  if (window.location.hash) {
    setTimeout(() => {
      if (history.replaceState) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }, 400);
  }
}

// Scrollspy for navbar links
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-menu .mobile-link');

  function updateActive() {
    let current = '';
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Check if at the bottom of the page (where offices section is located)
    if ((window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 80)) {
      current = 'offices';
    }

    if (!current) {
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 140;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
    }

    if (!current && scrollY < 220) {
      current = 'home';
    }

    if (!current && window.location.hash) {
      current = window.location.hash.replace('#', '');
    }

    if (current) {
      sessionStorage.setItem('uralokno_active_nav', current);
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isMatch = href === `#${current}` || (current === 'home' && (href === '#' || href === '#home'));
      if (isMatch) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isMatch = href === `#${current}` || (current === 'home' && (href === '#' || href === '#home'));
      if (isMatch) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Initial update
  updateActive();

  // Listeners
  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('hashchange', updateActive);
  setTimeout(updateActive, 50);
  setTimeout(updateActive, 150);
}

// Scroll to top floating button
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  function toggleBtn() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollY > 350) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', toggleBtn, { passive: true });
  toggleBtn();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (history.replaceState) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  });
}

