document.addEventListener('DOMContentLoaded', () => {
  const tabSections = document.querySelectorAll('.tab-content');
  const allTabButtons = document.querySelectorAll('[data-tab]');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const menuIcon = document.getElementById('menuIcon');

  function setActiveTab(tabName) {
    tabSections.forEach((section) => {
      const isCurrent = section.id === `tab-${tabName}`;
      section.classList.toggle('hidden', !isCurrent);
    });

    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach((btn) => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('active-tab', isActive);
      btn.classList.toggle('text-brand-gold', isActive);
      btn.classList.toggle('text-slate-200', !isActive && btn.classList.contains('mobile-nav-btn'));
      btn.classList.toggle('text-slate-300', !isActive && btn.classList.contains('nav-btn'));
    });

    if (mobileMenu) {
      mobileMenu.classList.add('hidden');
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
    if (menuIcon) {
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
    }
  }

  allTabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;
      if (!targetTab) return;
      setActiveTab(targetTab);
    });
  });

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
      menuIcon.classList.toggle('fa-bars', isOpen);
      menuIcon.classList.toggle('fa-xmark', !isOpen);
    });
  }

  document.querySelectorAll('.request-service-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const service = button.dataset.service;
      const serviceField = document.getElementById('consultService');
      if (serviceField && service) {
        serviceField.value = service;
      }
      setActiveTab('consultation');
    });
  });

  const paymentModeButtons = document.querySelectorAll('.payment-mode-btn');
  const onlineContainer = document.getElementById('payment-online-container');
  const offlineContainer = document.getElementById('payment-offline-container');

  function setPaymentMode(mode) {
    const isOnline = mode === 'online';

    if (onlineContainer) {
      onlineContainer.classList.toggle('hidden', !isOnline);
    }
    if (offlineContainer) {
      offlineContainer.classList.toggle('hidden', isOnline);
    }

    paymentModeButtons.forEach((button) => {
      const selected = button.dataset.paymentMode === mode;
      button.classList.toggle('bg-brand-gold', selected);
      button.classList.toggle('text-slate-950', selected);
      button.classList.toggle('text-slate-400', !selected);
      button.classList.toggle('shadow', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  paymentModeButtons.forEach((button) => {
    button.addEventListener('click', () => setPaymentMode(button.dataset.paymentMode));
  });

  function setFormError(form, message) {
    const errorBox = form.querySelector('[data-form-error]');
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
  }

  function clearFormError(form) {
    const errorBox = form.querySelector('[data-form-error]');
    if (!errorBox) return;
    errorBox.textContent = '';
    errorBox.classList.add('hidden');
  }

  function showSuccess(form) {
    const successBox = form.parentElement.querySelector('[data-fs-success]');
    if (successBox) {
      successBox.classList.remove('hidden');
    }
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  const consultationForm = document.getElementById('consultationForm');
  if (consultationForm) {
    consultationForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearFormError(consultationForm);

      const honeypot = consultationForm.querySelector('input[name="website"]');
      if (honeypot && honeypot.value.trim() !== '') {
        return;
      }

      const requiredFields = [
        { name: 'fullName', label: 'Full Name' },
        { name: 'designation', label: 'Designation' },
        { name: 'email', label: 'Work Email' },
        { name: 'phone', label: 'Phone Number' },
        { name: 'organization', label: 'Organization Name' },
        { name: 'organizationSize', label: 'Organization Size' },
        { name: 'serviceNeeded', label: 'Service You Need' },
        { name: 'primaryChallenges', label: 'Primary Challenges' },
        { name: 'problemToFix', label: 'What are you trying to fix?' }
      ];

      for (const field of requiredFields) {
        const input = consultationForm.elements[field.name];
        if (!input) continue;
        const value = input.value.trim();
        if (!value) {
          setFormError(consultationForm, `${field.label} is required.`);
          input.focus();
          return;
        }
      }

      const emailInput = consultationForm.elements.email;
      if (emailInput && !validateEmail(emailInput.value)) {
        setFormError(consultationForm, 'Please enter a valid email address.');
        emailInput.focus();
        return;
      }

      showSuccess(consultationForm);
      consultationForm.reset();
    });
  }

  const paymentForm = document.getElementById('paymentForm');
  if (paymentForm) {
    const paymentError = paymentForm.querySelector('[data-payment-error]');

    paymentForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const invoiceNumber = paymentForm.elements.invoiceNumber.value.trim();
      const amount = Number(paymentForm.elements.amount.value);
      const currency = paymentForm.elements.currency.value;

      if (!invoiceNumber) {
        if (paymentError) {
          paymentError.textContent = 'Invoice number is required.';
          paymentError.classList.remove('hidden');
        }
        return;
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        if (paymentError) {
          paymentError.textContent = 'Please enter a valid amount greater than zero.';
          paymentError.classList.remove('hidden');
        }
        return;
      }

      if (paymentError) {
        paymentError.classList.add('hidden');
        paymentError.textContent = '';
      }

      const message = `Secure checkout is not yet connected to a backend. Connect a server-side Stripe flow to complete ${currency} ${amount.toFixed(2)} for invoice ${invoiceNumber}.`;
      if (paymentError) {
        paymentError.textContent = message;
        paymentError.classList.remove('hidden');
      }
    });
  }

  setActiveTab('home');
  setPaymentMode('online');
});
