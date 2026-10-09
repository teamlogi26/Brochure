/**
 * LOGI - Interactive Digital Commercial Brochure
 * Scroll-Reveal, Counter Animations, 3D GoGoCard, and WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  const gogocard = document.querySelector('.gogocard-widget');
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const counterElements = document.querySelectorAll('[data-counter]');

  // WhatsApp constant URL
  const WHATSAPP_URL = 'https://wa.me/573105420351?text=Hola%20Logi,%20quiero%20agendar%20mi%20cita%20de%20introducci%C3%B3n';

  // Attach WhatsApp URL to all .js-wpp-link elements
  document.querySelectorAll('.js-wpp-link').forEach(link => {
    link.setAttribute('href', WHATSAPP_URL);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  // Scroll Reveal Animations (Option 2 style)
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // Animated Number Counters (like Hoko360 / Skydropx benchmarks)
  if ('IntersectionObserver' in window && counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter'));
          const duration = 1600;
          const start = 0;
          const startTime = performance.now();

          const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeProgress * target);

            el.textContent = current.toLocaleString('es-CO');

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = target.toLocaleString('es-CO');
            }
          };

          requestAnimationFrame(updateCount);
          obs.unobserve(el);
        }
      });
    }, {
      root: null,
      threshold: 0.2
    });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // Interactive 3D tilt on GoGoCard
  if (gogocard) {
    gogocard.addEventListener('mousemove', (e) => {
      const rect = gogocard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      gogocard.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    gogocard.addEventListener('mouseleave', () => {
      gogocard.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  // Platform Showcase Tabs Switcher
  const showcaseTabs = document.querySelectorAll('.showcase-tab');
  const showcasePanels = document.querySelectorAll('.showcase-panel');

  if (showcaseTabs.length > 0 && showcasePanels.length > 0) {
    showcaseTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab');
        
        showcaseTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        showcasePanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        
        const activePanel = document.getElementById(targetId);
        if (activePanel) {
          activePanel.classList.add('active');
        }
      });
    });
  }

  // Smooth scroll helper for any anchor
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - 20,
            behavior: 'smooth'
          });
        }
      }
    });
  });
});
