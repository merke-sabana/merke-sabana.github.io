// ===== MERKE+ ULTRA-OPTIMIZADO CON TODAS LAS FUNCIONALIDADES =====
// Sistema de detección automática de rendimiento y adaptación inteligente

// ===== CONFIGURACIÓN BASE =====
const config = {
  effects: true,
  smoothScroll: true,
  parallaxEnabled: true,
  
  isMobile: () => {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
};

// ===== DETECCIÓN AUTOMÁTICA DE CAPACIDADES DEL DISPOSITIVO =====
const deviceCapabilities = (() => {
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const isMobile = config.isMobile();
  
  // Calcular score de rendimiento (0-100)
  let score = 0;
  if (!isMobile) score += 40; // Desktop base
  if (memory >= 8) score += 30;
  else if (memory >= 4) score += 20;
  else score += 10;
  if (cores >= 8) score += 30;
  else if (cores >= 4) score += 20;
  else score += 10;
  
  const tier = score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low';
  
  console.log(`📊 Dispositivo: ${tier} (${score}/100) | RAM: ${memory}GB | Cores: ${cores}`);
  
  return { tier, memory, cores, isMobile, score };
})();

// ===== CONFIGURACIÓN ADAPTATIVA POR TIER =====
const performanceConfig = {
  high: {
    particles: 80,
    particleFPS: 60,
    parallaxIntensity: 1.0,
    splineFPS: 60,
    splineQuality: 'high'
  },
  medium: {
    particles: 50,
    particleFPS: 30,
    parallaxIntensity: 0.7,
    splineFPS: 30,
    splineQuality: 'medium'
  },
  low: {
    particles: 25,
    particleFPS: 20,
    parallaxIntensity: 0.5,
    splineFPS: 20,
    splineQuality: 'low'
  }
};

const perfCfg = performanceConfig[deviceCapabilities.tier];
window.particleCount = perfCfg.particles;

console.log(`⚙️ Configuración: ${perfCfg.particles} partículas @ ${perfCfg.particleFPS}FPS`);

// ===== CACHE DE ELEMENTOS DOM (UNA SOLA VEZ) =====
const DOM = {
  scrollElements: document.querySelectorAll('[data-scroll-effect]'),
  header: document.querySelector('header'),
  menuToggle: document.querySelector('.menu-toggle'),
  navMenu: document.querySelector('.nav-menu'),
  sections: document.querySelectorAll('section'),
  tsparticles: document.getElementById('tsparticles'),
  splineViewer: document.querySelector('spline-viewer'),
  splineContainer: document.querySelector('.spline-container')
};

// ===== UTILIDADES DE RENDIMIENTO =====
const perfUtils = {
  // Throttle para funciones frecuentes
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Debounce para resize, etc
  debounce: (func, wait) => {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },
  
  // RequestAnimationFrame con limpieza
  raf: {
    active: new Map(),
    
    start(id, callback) {
      if (this.active.has(id)) return;
      
      const animate = (time) => {
        if (!this.active.has(id)) return;
        callback(time);
        this.active.set(id, requestAnimationFrame(animate));
      };
      
      this.active.set(id, requestAnimationFrame(animate));
    },
    
    stop(id) {
      const rafId = this.active.get(id);
      if (rafId) {
        cancelAnimationFrame(rafId);
        this.active.delete(id);
      }
    }
  }
};



// ===== TSPARTICLES - CONFIGURACIÓN ÓPTIMA =====
const initTsParticles = () => {
  if (typeof tsParticles === 'undefined' || !DOM.tsparticles) {
    console.warn('⚠️ tsParticles no disponible');
    return;
  }
  
  const config = {
    autoPlay: true,
    background: { color: { value: "transparent" }, opacity: 0 },
    fullScreen: { enable: false, zIndex: -2 },
    fpsLimit: perfCfg.particleFPS,
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    smooth: false,
    detectRetina: deviceCapabilities.tier === 'high',
    
    particles: {
      color: { value: ["#FFD600", "#2ECC71", "#E74C3C"] },
      move: {
        enable: true,
        speed: deviceCapabilities.tier === 'low' ? 0.3 : 0.8,
        direction: "none",
        outModes: { default: "out" },
        straight: false
      },
      number: {
        value: perfCfg.particles,
        density: { enable: true, width: 800, height: 600 }
      },
      opacity: {
        value: deviceCapabilities.tier === 'low' ? 0.2 : 0.4,
        animation: { enable: false }
      },
      size: {
        value: { min: 1, max: deviceCapabilities.tier === 'low' ? 6 : 10 },
        animation: { enable: false }
      },
      shape: { type: "circle" },
      links: {
        enable: deviceCapabilities.tier === 'high',
        distance: 80,
        opacity: 0.1,
        width: 1
      }
    },
    
    interactivity: deviceCapabilities.tier === 'high' ? {
      events: {
        onHover: { enable: true, mode: "grab" },
        onClick: { enable: false }
      },
      modes: {
        grab: { distance: 100, links: { opacity: 0.3 } }
      }
    } : {
      events: { onHover: { enable: false }, onClick: { enable: false } }
    }
  };
  
  tsParticles.load("tsparticles", config)
    .then(container => {
      console.log(`✅ Partículas: ${perfCfg.particles} @ ${perfCfg.particleFPS}FPS`);
      
      document.addEventListener('visibilitychange', () => {
        document.hidden ? container.pause() : container.play();
      });
    })
    .catch(err => console.error('❌ Error partículas:', err));
};

// ===== SPLINE - CONFIGURACIÓN ADAPTATIVA CON SCROLL LOCK =====
const optimizeSpline = () => {
  if (!DOM.splineViewer || !DOM.splineContainer) return;
  
  const config = {
    high: { mode: 'quality', quality: 'high', fps: '60', shadows: 'true' },
    medium: { mode: 'performance', quality: 'medium', fps: '30', shadows: 'false' },
    low: { mode: 'performance', quality: 'low', fps: '20', shadows: 'false' }
  };
  
  const cfg = config[deviceCapabilities.tier];
  
  DOM.splineViewer.setAttribute('render-mode', cfg.mode);
  DOM.splineViewer.setAttribute('quality', cfg.quality);
  DOM.splineViewer.setAttribute('fps-cap', cfg.fps);
  DOM.splineViewer.setAttribute('shadow-enabled', cfg.shadows);
  DOM.splineViewer.setAttribute('reflections-enabled', cfg.shadows);
  DOM.splineViewer.setAttribute('post-processing-enabled', cfg.shadows);
  
  // ===== SISTEMA DE BLOQUEO DE SCROLL MEJORADO =====
  let isInteracting = false;
  let interactionTimeout = null;
  
  // Bloquear scroll completamente
  const lockScroll = () => {
    if (isInteracting) return;
    
    isInteracting = true;
    
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Guardar posición del scroll
    window.lastScrollPosition = window.pageYOffset;
    
    DOM.splineContainer.classList.add('interacting');
  };
  
  // Desbloquear scroll
  const unlockScroll = () => {
    if (!isInteracting) return;
    
    isInteracting = false;
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    
    // Restaurar posición del scroll
    if (window.lastScrollPosition !== undefined) {
      window.scrollTo(0, window.lastScrollPosition);
    }
    
    DOM.splineContainer.classList.remove('interacting');
  };
  
  // EVENTOS PARA DESKTOP
  if (!deviceCapabilities.isMobile) {
    // Comenzar interacción
    DOM.splineViewer.addEventListener('mousedown', () => {
      lockScroll();
      if (interactionTimeout) clearTimeout(interactionTimeout);
    });
    
    // Terminar interacción con mouse up
    DOM.splineViewer.addEventListener('mouseup', () => {
      if (interactionTimeout) clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        if (!isInteracting) return;
        unlockScroll();
      }, 300);
    });
    
    // Bloquear con rueda del mouse
    DOM.splineViewer.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!isInteracting) {
        lockScroll();
      }
      
      if (interactionTimeout) clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        unlockScroll();
      }, 500);
    }, { passive: false });
    
    // Mouse leave - desbloquear si sale
    DOM.splineViewer.addEventListener('mouseleave', () => {
      if (interactionTimeout) clearTimeout(interactionTimeout);
      unlockScroll();
    });
  }
  
  // EVENTOS PARA MÓVIL
  if (deviceCapabilities.isMobile) {
    DOM.splineViewer.style.touchAction = 'none';
    
    DOM.splineViewer.addEventListener('touchstart', (e) => {
      // Si hay dos dedos (zoom) o ya estamos interactuando
      if (e.touches.length >= 2 || isInteracting) {
        lockScroll();
        e.preventDefault();
      }
    }, { passive: false });
    
    DOM.splineViewer.addEventListener('touchmove', (e) => {
      // Si estamos interactuando, prevenir scroll
      if (isInteracting) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // Si detectamos dos dedos, bloquear definitivamente
      if (e.touches.length >= 2 && !isInteracting) {
        lockScroll();
        e.preventDefault();
      }
    }, { passive: false });
    
    DOM.splineViewer.addEventListener('touchend', () => {
      if (interactionTimeout) clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        unlockScroll();
      }, 500);
    });
  }
  
  // ESC para desbloquear manualmente
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isInteracting) {
      unlockScroll();
    }
  });
  
  // Pausar cuando no es visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      DOM.splineViewer[entry.isIntersecting ? 'removeAttribute' : 'setAttribute']('paused', 'true');
    });
  }, { threshold: 0.1 });
  
  observer.observe(DOM.splineViewer);
  
  console.log(`🎮 Spline: ${cfg.quality} @ ${cfg.fps}FPS + Scroll Lock`);
};
// ===== PARALLAX - BATCHING OPTIMIZADO =====
const initComponentParallax = () => {
  if (!config.effects) return;
  
  const groups = {
    high: Array.from(document.querySelectorAll('.hero-img, .hero-text h1, .section-title h2')),
    medium: Array.from(document.querySelectorAll('.card, .offer-card')),
    low: Array.from(document.querySelectorAll('[data-scroll-effect]'))
  };
  
  let frame = 0;
  const intensity = perfCfg.parallaxIntensity;
  
  const update = perfUtils.throttle(() => {
    const scrollY = window.scrollY;
    const winH = window.innerHeight;
    const center = scrollY + winH / 2;
    
    const processGroup = (elements, mult) => {
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + scrollY + rect.height / 2;
        const dist = (elCenter - center) / winH;
        const offset = dist * 50 * intensity * mult;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };
    
    if (frame % 1 === 0) processGroup(groups.high, 1.0);
    if (frame % 2 === 0) processGroup(groups.medium, 0.7);
    if (frame % 3 === 0) processGroup(groups.low, 0.5);
    
    frame++;
  }, 16);
  
  window.addEventListener('scroll', update, { passive: true });
  console.log('✅ Parallax optimizado');
};

// ===== SCROLL STORYTELLING PRO - COMPLETO CON SECCIÓN 3 =====
const initScrollStorytellingPro = () => {
  const storySections = document.querySelectorAll('.story-section');
  const animatedTexts = document.querySelectorAll('.story-text-animated');
  const storyWithIcons = document.querySelector('.story-with-icons');
  const storyIconsGrid = document.querySelector('.story-icons-grid');
  const iconItems = document.querySelectorAll('.story-icon-item');
  const scrollHint = document.querySelector('.scroll-hint');
  
  if (!storySections.length) return;
  
  // Preparar textos (una sola vez)
  animatedTexts.forEach(textEl => {
    const text = textEl.dataset.text || textEl.textContent;
    const fragment = document.createDocumentFragment();
    
    text.split('').forEach((char, idx) => {
      const span = document.createElement('span');
      span.className = char === ' ' ? 'char space' : 'char';
      span.textContent = char === ' ' ? ' ' : char;
      span.style.setProperty('--distance', idx - text.length / 2);
      span.style.setProperty('--index', idx);
      fragment.appendChild(span);
    });
    
    textEl.innerHTML = '';
    textEl.appendChild(fragment);
  });
  
  // Observer con requestIdleCallback
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const section = entry.target;
      const chars = section.querySelectorAll('.char');
      
      if (entry.isIntersecting) {
        const animate = () => {
          chars.forEach((char, i) => {
            setTimeout(() => {
              char.style.opacity = '1';
              char.style.transform = 'translateX(0) rotateX(0)';
            }, i * 25);
          });
          
          // ANIMACIÓN PARA SECCIÓN 3 (ICONOS)
          if (section.id === 'story-section-3') {
            setTimeout(() => {
              if (storyWithIcons) storyWithIcons.classList.add('active');
              if (storyIconsGrid) storyIconsGrid.classList.add('active');
              
              iconItems.forEach((item, index) => {
                setTimeout(() => {
                  item.classList.add('active');
                }, index * 100);
              });
            }, 500);
          }
        };
        
        'requestIdleCallback' in window 
          ? requestIdleCallback(animate) 
          : animate();
      } else {
        chars.forEach(char => {
          char.style.opacity = '0';
          char.style.transform = 'translateX(calc(var(--distance) * 60px)) rotateX(calc(var(--distance) * 30deg))';
        });
        
        // RESET PARA SECCIÓN 3
        if (section.id === 'story-section-3') {
          if (storyWithIcons) storyWithIcons.classList.remove('active');
          if (storyIconsGrid) storyIconsGrid.classList.remove('active');
          iconItems.forEach(item => item.classList.remove('active'));
        }
      }
    });
  }, { rootMargin: '-100px', threshold: 0.1 });
  
  storySections.forEach(s => observer.observe(s));
  
  // Scroll hint optimizado
  if (scrollHint) {
    scrollHint.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
      scrollHint.style.opacity = '1';
      scrollHint.style.transform = 'translateX(-50%) translateY(0)';
    }, 3000);
    
    let hideTimeout = setTimeout(() => {
      if (window.scrollY < 50) {
        scrollHint.style.opacity = '0';
        scrollHint.style.transform = 'translateX(-50%) translateY(20px)';
      }
    }, 10000);
    
    const resetHideTimeout = () => {
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        if (window.scrollY < 50) {
          scrollHint.style.opacity = '0';
          scrollHint.style.transform = 'translateX(-50%) translateY(20px)';
        }
      }, 10000);
    };
    
    ['scroll', 'mousemove', 'touchstart', 'click', 'keydown'].forEach(event => {
      window.addEventListener(event, resetHideTimeout, { passive: true });
    });
    
    const updateHint = perfUtils.throttle(() => {
      const hero = document.getElementById('hero');
      if (!hero) return;
      
      const rect = hero.getBoundingClientRect();
      const visible = rect.bottom > 100 && rect.top < window.innerHeight - 100;
      
      scrollHint.style.opacity = visible ? '1' : '0';
      scrollHint.style.transform = `translateX(-50%) translateY(${visible ? 0 : 20}px)`;
      scrollHint.style.pointerEvents = visible ? 'auto' : 'none';
    }, 100);
    
    window.addEventListener('scroll', updateHint, { passive: true });
    updateHint();
  }
  
  console.log('🎬 Storytelling completo (con sección 3)');
};

// ===== SCROLL EFFECTS - INTERSECTION OBSERVER =====
const initScrollEffects = () => {
  if (!config.effects || !DOM.scrollElements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-delay')) || 0;
        
        requestAnimationFrame(() => {
          setTimeout(() => el.classList.add('active'), delay);
        });
      }
    });
  }, { rootMargin: '100px', threshold: 0.01 });
  
  DOM.scrollElements.forEach(el => observer.observe(el));
  console.log(`✅ Scroll effects: ${DOM.scrollElements.length} elementos`);
};

// ===== HEADER - THROTTLED =====
const updateHeader = perfUtils.throttle(() => {
  if (!DOM.header) return;
  
  const scrollY = window.scrollY;
  if (scrollY > 100) {
    DOM.header.classList.add('scrolled');
    DOM.header.style.backgroundColor = 'rgba(5, 27, 56, 0.98)';
    DOM.header.style.backdropFilter = 'blur(15px)';
  } else {
    DOM.header.classList.remove('scrolled');
    DOM.header.style.backgroundColor = 'rgba(11, 44, 77, 0.95)';
    DOM.header.style.backdropFilter = 'blur(10px)';
  }
}, 100);

// ===== MENÚ MÓVIL COMPLETO =====
const initMobileMenu = () => {
  if (!DOM.menuToggle || !DOM.navMenu) return;
  
  if (config.isMobile()) DOM.menuToggle.style.display = 'flex';
  
  DOM.menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = !DOM.navMenu.classList.contains('active');
    
    DOM.navMenu.classList.toggle('active');
    DOM.menuToggle.classList.toggle('active');
    DOM.menuToggle.setAttribute('aria-expanded', isActive);
    
    if (isActive) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  });
  
  const closeMobileMenu = () => {
    DOM.navMenu.classList.remove('active');
    DOM.menuToggle.classList.remove('active');
    DOM.menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };
  
  DOM.navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  document.addEventListener('click', (e) => {
    if (!DOM.navMenu.contains(e.target) && !DOM.menuToggle.contains(e.target) && DOM.navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });
};

// ===== SMOOTH SCROLL COMPLETO =====
const initSmoothScroll = () => {
  const smoothConfig = {
    duration: 700,
    easing: (t) => {
      return t < 0.5 
        ? 8 * t * t * t * t
        : 1 - Math.pow(-2 * t + 2, 4) / 2;
    },
    offset: 80,
    fps: 60,
  };

  let rafId = null;
  let lastTime = 0;
  const frameInterval = 1000 / smoothConfig.fps;

  const smoothScrollTo = (targetPosition, customDuration = null) => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const absoluteDistance = Math.abs(distance);
    
    let duration = customDuration || smoothConfig.duration;
    duration = Math.max(400, Math.min(1200, absoluteDistance * 0.5));

    let startTime = null;
    lastTime = 0;

    const animateScroll = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) {
        rafId = requestAnimationFrame(animateScroll);
        return;
      }
      lastTime = currentTime - (deltaTime % frameInterval);

      if (!startTime) startTime = currentTime;
      
      const elapsed = currentTime - startTime;
      let progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = smoothConfig.easing(progress);
      const newPosition = startPosition + (distance * easedProgress);
      
      window.scrollTo({ top: newPosition, behavior: 'instant' });

      if (progress < 1) {
        rafId = requestAnimationFrame(animateScroll);
      } else {
        window.scrollTo({ top: targetPosition, behavior: 'instant' });
        rafId = null;
      }
    };

    rafId = requestAnimationFrame(animateScroll);
  };

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      
      if (DOM.navMenu && DOM.navMenu.classList.contains('active')) {
        DOM.navMenu.classList.remove('active');
        DOM.menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      }

      const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = targetPosition - headerHeight - 20;
      
      smoothScrollTo(offsetPosition);
      
      if (window.location.hash !== targetId) {
        history.pushState(null, null, targetId);
      }
    });
  });

  console.log('✅ SmoothScroll completo');
};

// ===== SISTEMA DE NOTIFICACIONES INTELIGENTE COMPLETO =====
const initSmartNotifications = () => {
  let container = document.querySelector('.notification-container');
  
  if (!container) {
    container = document.createElement('div');
    container.className = `notification-container ${config.isMobile() ? 'mobile' : 'desktop'}`;
    document.body.appendChild(container);
  }
  
  let activeNotifications = new Set();
  let notificationTimeouts = new Map();

  const showNotification = (message, type = 'info', options = {}) => {
    if (!message || message.trim() === '') return null;
    
    const notificationId = options.id || `notification-${Date.now()}`;
    const duration = options.duration || (config.isMobile() ? 8000 : 10000);
    
    // Remover notificación existente con el mismo ID
    if (options.id) {
      const existing = document.getElementById(options.id);
      if (existing) {
        existing.remove();
        activeNotifications.delete(options.id);
      }
    }

    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      interaction: '🎮'
    };
    
    const icon = icons[type] || icons.info;

    const notification = document.createElement('div');
    notification.className = `notification ${type} ${config.isMobile() ? 'mobile-notification' : 'desktop-notification'}`;
    notification.id = notificationId;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.style.zIndex = '10002';

    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${icon}</span>
        <div class="notification-text">
          <p>${message}</p>
        </div>
        <button class="notification-close" aria-label="Cerrar notificación">×</button>
      </div>
      <div class="notification-progress"></div>
    `;

    container.appendChild(notification);
    activeNotifications.add(notificationId);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    const progressBar = notification.querySelector('.notification-progress');
    if (progressBar) {
      progressBar.style.animationDuration = `${duration}ms`;
      progressBar.style.animationPlayState = 'running';
    }

    const timeout = setTimeout(() => {
      removeNotification(notificationId);
    }, duration);

    notificationTimeouts.set(notificationId, timeout);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeNotification(notificationId);
    });

    notification.addEventListener('click', (e) => {
      if (e.target === notification) {
        removeNotification(notificationId);
      }
    });

    return notificationId;
  };

  const removeNotification = (id) => {
    const notification = document.getElementById(id);
    if (!notification) return;

    if (notificationTimeouts.has(id)) {
      clearTimeout(notificationTimeouts.get(id));
      notificationTimeouts.delete(id);
    }

    notification.classList.remove('show');
    notification.classList.add('hide');

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      activeNotifications.delete(id);
    }, 300);
  };

  // ===== NOTIFICACIÓN DE BIENVENIDA AUTOMÁTICA =====
  setTimeout(() => {
    showNotification(
      '¡Bienvenido a Merke+ de la sabana!',
      'info',
      { id: 'welcome-notification', duration: 10000 }
    );
  }, 3500);

  // ===== NOTIFICACIONES PARA SPLINE =====
  setTimeout(() => {
    if (!DOM.splineViewer) return;
    
    let lastInteractionTime = 0;
    const INTERACTION_COOLDOWN = 10000;

    const showSplineNotification = () => {
      const now = Date.now();
      if (now - lastInteractionTime < INTERACTION_COOLDOWN) return;

      const message = config.isMobile() 
        ? 'Modo interacción: Dos dedos para zoom, un dedo para rotar'
        : 'Modo interacción: Usa la rueda del mouse para zoom';

      showNotification(message, 'interaction', {
        id: 'spline-interaction',
        duration: 6000
      });

      lastInteractionTime = now;
    };

    // Añadir listeners con delay para asegurar que Spline esté listo
    DOM.splineViewer.addEventListener('mousedown', showSplineNotification);
    DOM.splineViewer.addEventListener('wheel', showSplineNotification);
    DOM.splineViewer.addEventListener('touchstart', showSplineNotification);
    
    console.log('✅ Notificaciones Spline configuradas');
  }, 2000);

  console.log('✅ Sistema de notificaciones completo');
};

// ===== VENTANAS DE PRODUCTOS CON CARRUSEL COMPLETO =====
const initProductModals = () => {
  const products = {
    'abarrotes': {
      title: 'Abarrotes Esenciales',
      category: 'Abarrotes',
      description: 'Todo lo esencial para tu despensa diaria. Productos de alta calidad que garantizan sabor y durabilidad.',
      price: 'Desde $5.000',
      images: [
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop'
      ],
      features: [
        'Productos no perecederos',
        'Marcas reconocidas',
        'Precios competitivos',
        'Variedad en presentaciones',
        'Calidad garantizada',
        'Almacenamiento adecuado'
      ]
    },
    'frutas-y-verduras': {
      title: 'Frutas y Verduras Frescas',
      category: 'Frutas y Verduras',
      description: 'Productos frescos, locales y de temporada. Seleccionados cuidadosamente para garantizar máxima frescura y sabor.',
      price: 'Desde $3.000',
      images: [
        'https://images.unsplash.com/photo-1577046848358-82b4afcb21d0?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=800&auto=format&fit=crop'
      ],
      features: [
        'Productos locales',
        'Recogidos diariamente',
        'Sin pesticidas nocivos',
        'Variedad de temporada',
        'Precios por unidad o kilo',
        'Máxima frescura'
      ]
    },
    'lacteos': {
      title: 'Lácteos Frescos',
      category: 'Lácteos',
      description: 'Leche, yogurt y quesos de la más alta calidad. Productos frescos que mantienen todo su sabor y propiedades nutricionales.',
      price: 'Desde $4.500',
      images: [
        'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop'
      ],
      features: [
        'Productos refrigerados',
        'Fechas de vencimiento vigentes',
        'Marcas de confianza',
        'Variedad de presentaciones',
        'Alta calidad nutricional',
        'Precios especiales por cantidad'
      ]
    },
    'bebidas': {
      title: 'Bebidas Refrescantes',
      category: 'Bebidas',
      description: 'Variedad de bebidas para todos los gustos. Refrescos, jugos naturales, aguas y más.',
      price: 'Desde $2.500',
      images: [
        'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop'
      ],
      features: [
        'Bebidas frías y a temperatura ambiente',
        'Jugos naturales disponibles',
        'Variedad de marcas',
        'Precios por unidad o pack',
        'Promociones especiales',
        'Productos importados y nacionales'
      ]
    }
  };

  const modalOverlay = document.getElementById('productModalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalProductTitle');
  const modalCategory = document.getElementById('modalProductCategory');
  const modalDescription = document.getElementById('modalProductDescription');
  const modalPrice = document.getElementById('modalProductPrice');
  const modalFeaturesList = document.getElementById('modalFeaturesList');
  const gallery = document.querySelector('.product-gallery');
  const prevSlideBtn = document.getElementById('prevSlide');
  const nextSlideBtn = document.getElementById('nextSlide');
  const galleryIndicators = document.getElementById('galleryIndicators');

  if (!modalOverlay) return;

  let currentProduct = null;
  let currentSlideIndex = 0;
  let slides = [];
  let indicators = [];

  const createSlide = (imageUrl, index) => {
    const slide = document.createElement('div');
    slide.className = `gallery-slide ${index === 0 ? 'active' : ''}`;
    slide.dataset.index = index;
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = currentProduct.title;
    img.className = 'gallery-image';
    img.loading = 'lazy';
    
    slide.appendChild(img);
    return slide;
  };

  const createIndicator = (index) => {
    const indicator = document.createElement('div');
    indicator.className = `gallery-dot ${index === 0 ? 'active' : ''}`;
    indicator.dataset.index = index;
    
    indicator.addEventListener('click', () => {
      goToSlide(index);
    });
    
    return indicator;
  };

  const goToSlide = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    
    currentSlideIndex = index;
  };

  const showModal = (productKey) => {
    const product = products[productKey];
    if (!product) return;
    
    currentProduct = product;
    currentSlideIndex = 0;
    
    modalTitle.textContent = product.title;
    modalCategory.textContent = product.category;
    modalDescription.textContent = product.description;
    modalPrice.textContent = product.price;
    
    modalFeaturesList.innerHTML = '';
    product.features.forEach(feature => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="feature-icon">✓</span> ${feature}`;
      modalFeaturesList.appendChild(li);
    });
    
    gallery.innerHTML = '';
    slides = [];
    indicators = [];
    
    product.images.forEach((image, index) => {
      const slide = createSlide(image, index);
      gallery.appendChild(slide);
      slides.push(slide);
    });
    
    galleryIndicators.innerHTML = '';
    product.images.forEach((_, index) => {
      const indicator = createIndicator(index);
      galleryIndicators.appendChild(indicator);
      indicators.push(indicator);
    });
    
    if (!prevSlideBtn.parentElement) gallery.appendChild(prevSlideBtn);
    if (!nextSlideBtn.parentElement) gallery.appendChild(nextSlideBtn);
    
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
  };

  const hideModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    
    setTimeout(() => {
      slides = [];
      indicators = [];
    }, 300);
  };

  const prevSlide = () => {
    goToSlide(currentSlideIndex - 1);
  };

  const nextSlide = () => {
    goToSlide(currentSlideIndex + 1);
  };

  const keys = ['abarrotes', 'frutas-y-verduras', 'lacteos', 'bebidas'];
  document.querySelectorAll('.card-link').forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showModal(keys[index]);
    });
  });

  modalClose.addEventListener('click', hideModal);
  modalCloseBtn.addEventListener('click', hideModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      hideModal();
    }
  });

  prevSlideBtn.addEventListener('click', prevSlide);
  nextSlideBtn.addEventListener('click', nextSlide);

  document.addEventListener('keydown', (e) => {
    if (!modalOverlay.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape':
        hideModal();
        break;
      case 'ArrowLeft':
        prevSlide();
        break;
      case 'ArrowRight':
        nextSlide();
        break;
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  gallery.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  gallery.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    const swipeThreshold = 50;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }, { passive: true });

  console.log('✅ Modales de productos con carrusel listos');
};

// ===== LAZY LOADING =====
const initSmartLazyLoad = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.src) {
          el.src = el.dataset.src;
          el.removeAttribute('data-src');
        }
        observer.unobserve(el);
      }
    });
  }, { rootMargin: '200px', threshold: 0.01 });
  
  document.querySelectorAll('[loading="lazy"], img[data-src]').forEach(el => observer.observe(el));
  console.log('✅ Lazy loading activado');
};

// ===== FUNCIONES SIMPLES =====
const initCountdown = () => {
  const el = document.getElementById('countdown');
  if (!el) return;
  
  let end = new Date();
  end.setHours(end.getHours() + 24);
  
  setInterval(() => {
    const diff = end - new Date();
    if (diff <= 0) {
      el.textContent = '00:00:00';
      end.setHours(end.getHours() + 24);
      return;
    }
    
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    
    el.textContent = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    
    if (diff < 10 * 60 * 1000) {
      el.style.color = 'var(--red)';
      el.style.animation = 'pulseBadge 1s infinite';
    }
  }, 1000);
};

const initMicroInteractions = () => {
  const createRippleEffect = (event, element) => {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  document.querySelectorAll('.hero-btn, .offer-btn, .contact-link, .card-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
      createRippleEffect(e, btn);
      btn.classList.add('vibrate');
      setTimeout(() => btn.classList.remove('vibrate'), 300);
    });
  });
  
  if (config.isMobile()) {
    document.querySelectorAll('.card, .offer-card, .contact-card').forEach(card => {
      card.addEventListener('touchstart', () => {
        card.style.transform = 'scale(0.98)';
      }, { passive: true });
      
      card.addEventListener('touchend', () => {
        card.style.transform = '';
      }, { passive: true });
    });
  }
};

const initWhatsAppButton = () => {
  const btn = document.querySelector('.whatsapp-float');
  if (!btn) return;
  
  setTimeout(() => {
    btn.style.opacity = '1';
    btn.style.transform = 'translateY(0) scale(1)';
    btn.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }, 2000);
  
  if (config.effects) {
    setInterval(() => {
      if (!document.hidden) btn.classList.toggle('pulse');
    }, 3000);
  }
};

const initIntro = () => {
  const intro = document.getElementById('intro');
  if (!intro) return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      intro.style.opacity = '0';
      setTimeout(() => intro.style.display = 'none', 500);
    }, 3000);
  });
};

// ===== INICIALIZACIÓN =====
const init = () => {
  console.log(`🚀 Iniciando Merke+ OPTIMIZADO - ${deviceCapabilities.tier.toUpperCase()}`);
  
  // Inmediato
  initMobileMenu();
  initSmartLazyLoad();
  
  // Con delay mínimo
  setTimeout(() => {
    initSmartNotifications();
    initProductModals();
  }, 100);
  
  // Después del load
  window.addEventListener('load', () => {
    setTimeout(() => {
      initTsParticles();
      initSmoothScroll();
      initScrollEffects();
      initScrollStorytellingPro();
      initComponentParallax();
      optimizeSpline();
      initCountdown();
      initMicroInteractions();
      initWhatsAppButton();
      initIntro();
      
      document.body.classList.add('loaded');
      console.log(`✅ Carga completa: ${performance.now().toFixed(0)}ms`);
    }, 200);
  });
  
  // Event listeners
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader, { passive: true });
  
  updateHeader();
};

// EJECUTAR
init();

// Debug
window.debugMerke = {
  device: deviceCapabilities,
  config: perfCfg,
  reload: () => location.reload()
};