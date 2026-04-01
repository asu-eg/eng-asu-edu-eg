var COLORS = {
  red: '#fe0000',
  green: '#009900',
  yellow: '#fea500',
};

document.addEventListener('DOMContentLoaded', function () {
  checkAuth();
  loadDashboardData();
  setupEventListeners();
});

function checkAuth() {
  if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    var isArabic = document.documentElement.lang === 'ar';
    window.location.href = isArabic ? 'login-ar.html' : 'login.html';
  }
}

// Load dashboard data from JSON
function loadDashboardData() {
  fetch('config/dashboard.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      updateStats(data.stats);
      // Reveal page after data is loaded
      revealPage();
    })
    .catch(function (error) {
      console.error('Failed to load dashboard config:', error);
      // Still reveal page even if config fails
      revealPage();
    });
}

// Update stats widgets
function updateStats(stats) {
  // Cumulative GPA
  updateWidget('gpaWidget', 'gpaCurrent', 'gpaRequired', stats.cumulativeGPA);

  // Training Weeks
  updateWidget('trainingWidget', 'trainingCurrent', 'trainingRequired', stats.trainingWeeks);

  // Credit Hours
  updateWidget('creditsWidget', 'creditsCurrent', 'creditsRequired', stats.creditHours);
}

// Update individual widget
function updateWidget(widgetId, currentId, requiredId, data) {
  var widget = document.getElementById(widgetId);
  var currentEl = document.getElementById(currentId);
  var requiredEl = document.getElementById(requiredId);

  if (widget && currentEl && requiredEl) {
    currentEl.textContent = data.current;
    requiredEl.textContent = data.required;
    widget.style.backgroundColor = COLORS[data.color] || data.color;
  }
}

// Reveal page with animation
function revealPage() {
  var overlay = document.getElementById('pageLoadingOverlay');
  var appWrap = document.querySelector('.app-wrap');

  // Small delay for smoother effect
  setTimeout(function () {
    // Show main content
    if (appWrap) {
      appWrap.classList.add('visible');
    }

    // Hide overlay
    if (overlay) {
      overlay.classList.add('hidden');

      // Remove overlay from DOM after animation completes
      setTimeout(function () {
        overlay.style.display = 'none';
      }, 500);
    }
  }, 300);
}

// Setup event listeners
function setupEventListeners() {
  // User dropdown toggle
  var userSettings = document.getElementById('userSettings');
  var userDropdown = document.getElementById('userDropdown');

  if (userSettings && userDropdown) {
    // Apply appropriate dropdown class based on text direction
    var isArabic = document.documentElement.lang === 'ar';
    if (isArabic) {
      userDropdown.classList.remove('dropdown-menu-right');
      userDropdown.classList.add('dropdown-menu-left');
    } else {
      userDropdown.classList.remove('dropdown-menu-left');
      userDropdown.classList.add('dropdown-menu-right');
    }

    userSettings.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      userDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
      if (!userSettings.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('show');
      }
    });
  }

  // Logout button
  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      logout();
    });
  }

  // Alert dismiss buttons
  var closeButtons = document.querySelectorAll('.alert .close');
  closeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var alert = this.closest('.alert');
      if (alert) {
        alert.style.display = 'none';
      }
    });
  });

  // Sidebar toggler
  var sidebarToggler = document.getElementById('sidebar-toggler');
  var sidebar = document.getElementById('app-side');

  if (sidebarToggler && sidebar) {
    sidebarToggler.addEventListener('click', function (e) {
      e.preventDefault();
      sidebar.classList.toggle('is-open');
    });
  }

  // Mini nav toggler
  var miniToggler = document.getElementById('app-side-mini-toggler');
  if (miniToggler) {
    miniToggler.addEventListener('click', function (e) {
      e.preventDefault();
      document.body.classList.toggle('mini-sidebar');
    });
  }
}

// Logout function
function logout() {
  sessionStorage.clear();
  var isArabic = document.documentElement.lang === 'ar';
  window.location.href = 'login.html';
}
