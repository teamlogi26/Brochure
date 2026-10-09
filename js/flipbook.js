/**
 * LOGIGHO - Editorial Flipbook Controller (iPaper Style)
 * Handles Spreads (1/5, 2-3/5, 4-5/5), touch swipe, and navigation
 */

(function () {
  'use strict';

  // State
  let currentSpreadIndex = 0; // 0 = Cover (1/5), 1 = Spread 1 (2-3/5), 2 = Spread 2 (4-5/5)
  const totalSpreads = 3;
  const spreadIndicators = ['1 / 5', '2-3 / 5', '4-5 / 5'];
  let isSoundEnabled = true;
  let audioCtx = null;

  // DOM Elements
  const spreads = document.querySelectorAll('.magazine-spread');
  const pageIndicator = document.getElementById('pageIndicatorText');
  const btnFirst = document.getElementById('btnNavFirst');
  const btnPrev = document.getElementById('btnNavPrev');
  const btnNext = document.getElementById('btnNavNext');
  const btnLast = document.getElementById('btnNavLast');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const viewport = document.getElementById('magazineViewport');

  /**
   * Synthesize gentle paper rustle sound
   */
  function playPaperTurnSound() {
    if (!isSoundEnabled) return;
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const bufferSize = audioCtx.sampleRate * 0.12;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
      filter.Q.setValueAtTime(1.1, audioCtx.currentTime);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch (e) {}
  }

  /**
   * Switch to a specific spread
   */
  function goToSpread(index, playSound = true) {
    if (index < 0) index = 0;
    if (index >= totalSpreads) index = totalSpreads - 1;

    const prevIndex = currentSpreadIndex;
    currentSpreadIndex = index;

    // Toggle active spread
    spreads.forEach((spread, idx) => {
      if (idx === currentSpreadIndex) {
        spread.classList.add('active');
      } else {
        spread.classList.remove('active');
      }
    });

    // Update Page Indicator
    if (pageIndicator) {
      pageIndicator.textContent = spreadIndicators[currentSpreadIndex];
    }

    // Update Nav Buttons
    if (btnFirst) btnFirst.disabled = currentSpreadIndex === 0;
    if (btnPrev) btnPrev.disabled = currentSpreadIndex === 0;
    if (btnNext) btnNext.disabled = currentSpreadIndex === totalSpreads - 1;
    if (btnLast) btnLast.disabled = currentSpreadIndex === totalSpreads - 1;

    if (playSound && prevIndex !== currentSpreadIndex) {
      playPaperTurnSound();
    }
  }

  function nextSpread() {
    if (currentSpreadIndex < totalSpreads - 1) {
      goToSpread(currentSpreadIndex + 1);
    }
  }

  function prevSpread() {
    if (currentSpreadIndex > 0) {
      goToSpread(currentSpreadIndex - 1);
    }
  }

  function firstSpread() {
    goToSpread(0);
  }

  function lastSpread() {
    goToSpread(totalSpreads - 1);
  }

  // Bind Buttons
  if (btnNext) btnNext.addEventListener('click', nextSpread);
  if (btnPrev) btnPrev.addEventListener('click', prevSpread);
  if (btnFirst) btnFirst.addEventListener('click', firstSpread);
  if (btnLast) btnLast.addEventListener('click', lastSpread);

  // Jump from inside page triggers
  document.querySelectorAll('[data-jump-spread]').forEach(el => {
    el.addEventListener('click', function () {
      const target = parseInt(this.getAttribute('data-jump-spread'), 10);
      if (!isNaN(target)) goToSpread(target);
    });
  });

  // Touch Swipe for Mobile
  let startX = 0;
  let startY = 0;
  let startTime = 0;

  if (viewport) {
    viewport.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      const deltaX = e.changedTouches[0].clientX - startX;
      const deltaY = e.changedTouches[0].clientY - startY;
      const time = Date.now() - startTime;

      if (time <= 600 && Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
        if (deltaX < 0) nextSpread();
        else prevSpread();
      }
    }, { passive: true });
  }

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('modalTC');
    if (modal && modal.classList.contains('active')) return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      nextSpread();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      prevSpread();
    } else if (e.key === 'Home') {
      firstSpread();
    } else if (e.key === 'End') {
      lastSpread();
    }
  });

  // Fullscreen
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.() || document.documentElement.webkitRequestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    });
  }

  // Expose API
  window.MagazineApp = {
    goToSpread,
    nextSpread,
    prevSpread
  };

  // Init
  goToSpread(0, false);

})();