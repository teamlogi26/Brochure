/**
 * LOGI - Narrative Commercial Experience (Storytelling Edition)
 * Progress Bar, Scroll Reveal, Number Counters, 3D GoGoCard Tilt, and GIF Showcase Tabs
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // Preloader Sutil (Opción 2: Línea de Velocidad Logística)
  // --------------------------------------------------------------------------
  const preloader = document.getElementById('logi-preloader');
  const speedBeam = document.getElementById('preloader-speed-beam');

  if (preloader && speedBeam) {
    const startTime = performance.now();
    const duration = 850; // 0.85s: ultra rápido y dinámico

    const stepBeam = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Curva dinámica de aceleración easeOutCubic
      const easeVal = 1 - Math.pow(1 - progress, 3);
      const currentPercent = Math.min(100, easeVal * 100);

      speedBeam.style.width = `${currentPercent}%`;

      if (progress < 1) {
        requestAnimationFrame(stepBeam);
      } else {
        speedBeam.style.width = '100%';
        setTimeout(() => {
          preloader.classList.add('preloader-speed-exit');
          setTimeout(() => {
            if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
          }, 450);
        }, 120);
      }
    };

    requestAnimationFrame(stepBeam);

    // Fallback de seguridad
    setTimeout(() => {
      if (document.body.contains(preloader) && !preloader.classList.contains('preloader-speed-exit')) {
        preloader.classList.add('preloader-speed-exit');
        setTimeout(() => {
          if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 450);
      }
    }, 1400);
  }

  const progressBar = document.querySelector('.story-progress-indicator');
  const gogocard = document.querySelector('.gogocard-widget');
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  // WhatsApp constant URL
  const WHATSAPP_URL = 'https://wa.me/573105420351?text=Hola%20Logi,%20quiero%20agendar%20mi%20cita%20de%20introducci%C3%B3n';

  // Attach WhatsApp URL to all .js-wpp-link elements
  document.querySelectorAll('.js-wpp-link').forEach(link => {
    link.setAttribute('href', WHATSAPP_URL);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  // Reading progress bar
  const updateProgress = () => {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTotal > 0 && progressBar) {
      const scrollProgress = (window.scrollY / scrollTotal) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, scrollProgress))}%`;
    }
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Scroll Reveal Observer
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
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // Animated Number Counters
  const counterElements = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window && counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter'));
          const duration = 1600;
          const startTime = performance.now();

          const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
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



  // --------------------------------------------------------------------------
  // Formulario Sencillo de Captura / Lead (Última Página)
  // --------------------------------------------------------------------------
  const leadForm = document.getElementById('lead-story-form');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('lead-nombre')?.value.trim() || '';
      const apellido = document.getElementById('lead-apellido')?.value.trim() || '';
      const correo = document.getElementById('lead-correo')?.value.trim() || '';
      const celular = document.getElementById('lead-celular')?.value.trim() || '';
      const vendes = document.getElementById('lead-vendes')?.value.trim() || '';

      const feedback = document.getElementById('form-lead-feedback');
      if (feedback) {
        feedback.textContent = '¡Listo! Abriendo WhatsApp con tus datos para agendar tu cita...';
        feedback.style.display = 'block';
        feedback.className = 'form-feedback-msg is-success';
      }

      const msg = `Hola Logi, quiero agendar mi cita de introducción.\n\n*Mis datos:*\n- *Nombre:* ${nombre} ${apellido}\n- *Correo:* ${correo}\n- *Celular:* ${celular}\n- *Qué vendo:* ${vendes}`;
      const waUrl = `https://wa.me/573105420351?text=${encodeURIComponent(msg)}`;

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 600);
    });
  }

  // Smooth scroll helper
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
