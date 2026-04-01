var CONFIG = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  loadConfig();
  setupFormHandler();
  setupCaptchaOverlay();
});

// Load configuration
function loadConfig() {
  fetch('config/login.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      CONFIG = data;
    })
    .catch(function () {
      console.error('Failed to load login config');
    });
}

// Setup form submission handler
function setupFormHandler() {
  var form = document.getElementById('signin_form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();

    if (!CONFIG) {
      showError('System error. Please refresh the page.');
      return;
    }

    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value;

    if (!email || !password) {
      showError('Please enter both email and password.');
      return;
    }

    // Check reCAPTCHA
    if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length === 0) {
      showError('Please complete the CAPTCHA verification.');
      return;
    }

    // Validate and redirect
    if (validateLogin(email, password)) {
      sessionStorage.setItem('isLoggedIn', 'true');
      window.location.href = CONFIG.dashboardURL;
    } else {
      showError('The email or password is incorrect, please try again.');
    }
  });
}

// Validate login credentials
function validateLogin(email, password) {
  for (var i = 0; i < CONFIG.users.length; i++) {
    var user = CONFIG.users[i];
    if (user.email.toLowerCase() === email.toLowerCase() && user.password === password) {
      return true;
    }
  }
  return false;
}

// Show error message
function showError(message) {
  var errorContainer = document.querySelector('.msg-error');
  errorContainer.innerHTML = '<div class="alert alert-danger" style="color: darkred; margin-top: 4rem; margin-bottom: -40px;">' + message + '</div>';
}

// Clear error message
function clearError() {
  document.querySelector('.msg-error').innerHTML = '';
}

// Mock Captcha Overlay
function setupCaptchaOverlay() {
  function positionOverlays() {
    var recaptchaDiv = document.querySelector('.g-recaptcha');
    var iframe = recaptchaDiv ? recaptchaDiv.querySelector('iframe') : null;

    if (!iframe) return;

    var iframeRect = iframe.getBoundingClientRect();
    var parentRect = recaptchaDiv.getBoundingClientRect();
    var iframeLeft = iframeRect.left - parentRect.left;
    var iframeWidth = iframeRect.width;

    // Remove existing overlays
    document.querySelectorAll('.captcha-overlay').forEach(function (el) {
      el.remove();
    });

    // Create first overlay
    var overlay1 = document.createElement('div');
    overlay1.className = 'captcha-overlay';
    overlay1.style.left = iframeLeft + 2 + 'px';
    overlay1.style.top = '1px';
    overlay1.style.width = iframeWidth - 5 + 'px';
    overlay1.style.height = '12px';
    recaptchaDiv.appendChild(overlay1);

    // Create second overlay
    var overlay2 = document.createElement('div');
    overlay2.className = 'captcha-overlay';
    overlay2.style.left = iframeLeft + 2 + 'px';
    overlay2.style.top = '10px';
    overlay2.style.width = iframeWidth / 3 + 'px';
    overlay2.style.height = '15px';
    recaptchaDiv.appendChild(overlay2);

    // Show overlays
    setTimeout(function () {
      overlay1.classList.add('visible');
      overlay2.classList.add('visible');
    }, 100);
  }

  function waitForCaptcha() {
    var checkInterval = setInterval(function () {
      var iframe = document.querySelector('.g-recaptcha iframe');
      if (iframe) {
        clearInterval(checkInterval);
        setTimeout(positionOverlays, 0);
      }
    }, 50);

    setTimeout(function () {
      clearInterval(checkInterval);
    }, 5000);
  }

  waitForCaptcha();

  window.addEventListener('resize', function () {
    setTimeout(positionOverlays, 100);
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest('.g-recaptcha')) {
      setTimeout(positionOverlays, 300);
    }
  });
}
