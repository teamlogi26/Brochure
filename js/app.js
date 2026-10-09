/**
 * LOGIGHO - App Logic, Modals & WhatsApp Handlers
 */

(function () {
  'use strict';

  // Configuration (Update this phone number when official campaign line is assigned)
  const LOGI_CONFIG = {
    whatsappNumber: '573000000000', // Format: Country code + Number without '+' or spaces
    defaultMessage: 'Hola LogiGHO, escaneé el código QR. Quiero solicitar la asesoría en mi local y activar mis 3 primeros fletes gratis.'
  };

  // DOM Elements
  const modalTC = document.getElementById('modalTC');
  const openTcTriggers = document.querySelectorAll('.js-open-tc');
  const closeTcTriggers = document.querySelectorAll('.js-close-tc');
  const btnShare = document.getElementById('btnShare');
  const wppLinks = document.querySelectorAll('.js-wpp-link');

  /**
   * Open Modal
   */
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close Modal
   */
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind Open T&C Triggers
  openTcTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(modalTC);
    });
  });

  // Bind Close T&C Triggers
  closeTcTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(modalTC);
    });
  });

  // Close when clicking modal backdrop
  if (modalTC) {
    modalTC.addEventListener('click', (e) => {
      if (e.target === modalTC) {
        closeModal(modalTC);
      }
    });
  }

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalTC && modalTC.classList.contains('active')) {
      closeModal(modalTC);
    }
  });

  /**
   * WhatsApp Link Setup
   */
  function setupWhatsAppLinks() {
    const encodedText = encodeURIComponent(LOGI_CONFIG.defaultMessage);
    const targetUrl = `https://wa.me/${LOGI_CONFIG.whatsappNumber}?text=${encodedText}`;

    wppLinks.forEach(link => {
      link.setAttribute('href', targetUrl);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  /**
   * Share Handler (Web Share API or Copy to Clipboard)
   */
  if (btnShare) {
    btnShare.addEventListener('click', async () => {
      const shareData = {
        title: 'LogiGHO | E-commerce & Fulfillment',
        text: 'Tus envíos más baratos, tu dinero el mismo día. Conoce los beneficios de LogiGHO para comerciantes.',
        url: window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // Share was cancelled by user
        }
      } else {
        // Fallback: Copy link
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast('¡Enlace del brochure copiado al portapapeles!');
        } catch (e) {
          showToast('Brochure: ' + window.location.href);
        }
      }
    });
  }

  /**
   * Lightweight toast notification
   */
  function showToast(message) {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.style.position = 'fixed';
      toast.style.bottom = '80px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      toast.style.background = '#181A63';
      toast.style.color = '#FFFFFF';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '30px';
      toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
      toast.style.fontSize = '0.82rem';
      toast.style.fontWeight = '700';
      toast.style.zIndex = '500';
      toast.style.opacity = '0';
      toast.style.transition = 'all 0.3s ease';
      toast.style.pointerEvents = 'none';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2800);
  }

  // Initialize
  setupWhatsAppLinks();

})();