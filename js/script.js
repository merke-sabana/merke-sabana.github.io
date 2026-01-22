document.addEventListener('DOMContentLoaded', () => {
  // ===== ELEMENTOS PRINCIPALES =====
  const parallaxElements = document.querySelectorAll('[data-speed]');
  const revealElements = document.querySelectorAll('.reveal');
  const header = document.querySelector('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  // ===== CONFIGURACIÓN DE EFECTOS =====
  const effectsConfig = {
    // Parallax más pronunciado en desktop
    parallaxMultiplier: window.innerWidth > 768 ? 0.25 : 0.1,
    parallaxLimit: 150, // Aumentado para más movimiento
    
    // Reveal más visible
    revealThreshold: 0.2,
    revealOffset: 100,
    
    // Efectos suaves
    smoothScrollDuration: 800,
    
    // Spline interaction
    splineBlockScroll: true
  };

  // ===== DETECCIÓN DE PERFORMANCE =====
  const isHighPerformance = () => {
    // Detectar si el dispositivo tiene buena performance
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const hasGoodGPU = checkGPUPerformance();
    
    return !isMobile || hasGoodGPU;
  };

  const checkGPUPerformance = () => {
    // Simple check para GPU
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl && gl.getParameter(gl.MAX_TEXTURE_SIZE) > 4096;
  };

  // ===== MENÚ MÓVIL =====
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Cerrar menú al hacer clic en enlace
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ===== REVEAL ANIMATIONS MEJORADAS =====
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = effectsConfig.revealOffset;

    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      const elementHeight = element.offsetHeight;
      
      // Calcular qué porcentaje del elemento es visible
      const visibleHeight = Math.min(elementBottom, windowHeight) - Math.max(elementTop, 0);
      const visiblePercent = (visibleHeight / elementHeight) * 100;
      
      // Activar reveal cuando al menos el 20% del elemento es visible
      if (visiblePercent >= effectsConfig.revealThreshold * 100) {
        element.classList.add('active');
        
        // Añadir efecto de profundidad según scroll
        if (element.hasAttribute('data-depth')) {
          const depth = parseFloat(element.getAttribute('data-depth')) || 1;
          const scrollPercent = (windowHeight - elementTop) / (windowHeight + elementHeight);
          const translateZ = scrollPercent * depth * 20;
          element.style.transform = `translateY(0) translateZ(${translateZ}px)`;
        }
      }
    });
  };

  // ===== PARALLAX EFFECT MEJORADO =====
  let lastScrollY = window.scrollY;
  let ticking = false;
  let isScrolling = false;
  let scrollTimeout;

  const updateParallax = () => {
    const scrollY = window.scrollY;
    const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
    const scrollDelta = Math.abs(scrollY - lastScrollY);
    
    // Solo aplicar parallax si hay scroll significativo
    if (scrollDelta > 1 && window.innerWidth > 768) {
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0;
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          // Calcular posición basada en scroll
          const viewportCenter = window.innerHeight / 2;
          const elementCenter = rect.top + (rect.height / 2);
          const distanceFromCenter = (elementCenter - viewportCenter) / viewportCenter;
          
          // Efecto parallax mejorado
          const baseOffset = -(scrollY * speed * effectsConfig.parallaxMultiplier);
          const depthOffset = distanceFromCenter * 50; // Efecto de profundidad
          const totalOffset = baseOffset + depthOffset;
          
          // Limitar movimiento pero permitir más
          if (Math.abs(totalOffset) < effectsConfig.parallaxLimit) {
            // Añadir easing para movimiento más natural
            const easedOffset = easeInOutQuad(Math.min(Math.abs(totalOffset) / effectsConfig.parallaxLimit, 1)) * totalOffset;
            
            // Aplicar transform con perspectiva para efecto 3D
            el.style.transform = `translateY(${easedOffset}px)`;
            el.style.transition = isScrolling ? 'transform 0.1s ease-out' : 'transform 0.3s ease';
            
            // Añadir blur sutil en movimiento rápido
            if (scrollDelta > 5) {
              el.style.filter = `blur(${Math.min(scrollDelta * 0.01, 0.5)}px)`;
            } else {
              el.style.filter = 'blur(0)';
            }
          }
        }
      });
      
      // Marcar que estamos haciendo scroll
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        // Resetear efectos cuando se detiene el scroll
        parallaxElements.forEach(el => {
          el.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.3s ease';
          el.style.filter = 'blur(0)';
        });
      }, 100);
    }

    lastScrollY = scrollY;
    
    // Header effect
    if (scrollY > 100) {
      header.classList.add('scrolled');
      header.style.backdropFilter = 'blur(15px)';
      header.style.backgroundColor = 'rgba(5, 27, 56, 0.95)';
    } else {
      header.classList.remove('scrolled');
      header.style.backdropFilter = 'blur(10px)';
      header.style.backgroundColor = 'rgba(11, 44, 77, 0.95)';
    }
    
    // Trigger reveal
    revealOnScroll();
    
    ticking = false;
  };

  // Función easing para movimiento suave
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // ===== SCROLL EVENT OPTIMIZADO =====
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
      });
      ticking = true;
    }
  });

  // ===== SMOOTH SCROLL MEJORADO =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Desactivar parallax temporalmente
        parallaxElements.forEach(el => {
          el.style.transition = 'transform 0.3s ease';
          el.style.transform = 'translateY(0)';
        });
        
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20; // Offset adicional
        
        // Scroll suave con easing
        smoothScrollTo(targetPosition, effectsConfig.smoothScrollDuration);
        
        // Reactivar efectos después del scroll
        setTimeout(() => {
          parallaxElements.forEach(el => {
            el.style.transition = '';
          });
          updateParallax();
        }, effectsConfig.smoothScrollDuration + 100);
      }
    });
  });

  // Función de scroll suave mejorada
  function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutCubic(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
    }
    
    requestAnimationFrame(animation);
  }

  // ===== INTERSECTION OBSERVER PARA REVEAL =====
  const observerOptions = {
    root: null,
    rootMargin: '100px',
    threshold: Array.from({length: 101}, (_, i) => i * 0.01)
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const intersectionRatio = entry.intersectionRatio;
      
      if (intersectionRatio > effectsConfig.revealThreshold) {
        entry.target.classList.add('active');
        
        // Efecto de aparición progresiva
        const progress = (intersectionRatio - effectsConfig.revealThreshold) / (1 - effectsConfig.revealThreshold);
        entry.target.style.opacity = progress;
        entry.target.style.transform = `translateY(${(1 - progress) * 20}px)`;
      }
      
      // Efecto de scroll parallax dentro del elemento
      if (entry.target.hasAttribute('data-scroll-effect')) {
        const rect = entry.target.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const progress = 1 - Math.abs(viewportHeight / 2 - elementCenter) / (viewportHeight / 2);
        
        entry.target.style.transform = `translateY(${(1 - progress) * 30}px) scale(${0.95 + progress * 0.1})`;
      }
    });
  }, observerOptions);

  // Observar elementos con efectos
  document.querySelectorAll('.reveal[data-scroll-effect]').forEach(el => {
    observer.observe(el);
  });

  // ===== CONTROL DE SCROLL PARA SPLINE =====
  const splineContainer = document.querySelector('.spline-container');
  let isOverSpline = false;

  if (splineContainer && effectsConfig.splineBlockScroll) {
    // Detectar cuando el mouse está sobre el Spline
    splineContainer.addEventListener('mouseenter', () => {
      isOverSpline = true;
      document.body.style.overflow = 'hidden';
    });

    splineContainer.addEventListener('mouseleave', () => {
      isOverSpline = false;
      document.body.style.overflow = '';
    });

    // Prevenir scroll con rueda sobre Spline
    splineContainer.addEventListener('wheel', (e) => {
      if (isOverSpline) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, { passive: false });

    // Prevenir scroll táctil sobre Spline en móviles
    splineContainer.addEventListener('touchstart', (e) => {
      isOverSpline = true;
    }, { passive: true });

    splineContainer.addEventListener('touchend', () => {
      setTimeout(() => {
        isOverSpline = false;
      }, 100);
    }, { passive: true });

    splineContainer.addEventListener('touchmove', (e) => {
      if (isOverSpline) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  // ===== EFECTOS DE HOVER MEJORADOS =====
  const cards = document.querySelectorAll('.card, .contact-card, .feature');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768) {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        this.style.boxShadow = '0 20px 40px rgba(46, 204, 113, 0.3)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768) {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '';
      }
    });
    
    // Touch feedback para móviles
    card.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
      this.style.transform = 'scale(0.98)';
    }, { passive: true });
    
    card.addEventListener('touchend', function() {
      this.classList.remove('touch-active');
      this.style.transform = 'scale(1)';
    }, { passive: true });
  });

  // ===== INICIALIZACIÓN =====
  const initEffects = () => {
    // Ajustar configuración basada en performance
    if (!isHighPerformance()) {
      effectsConfig.parallaxMultiplier *= 0.5;
      effectsConfig.parallaxLimit = 80;
    }
    
    // Inicializar efectos
    revealOnScroll();
    updateParallax();
    
    // Agregar clase loaded para transiciones
    document.body.classList.add('loaded');
    
    // Precargar imágenes
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });
      }
    });
  };

  // ===== RESIZE HANDLER =====
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Ajustar configuración en resize
      effectsConfig.parallaxMultiplier = window.innerWidth > 768 ? 0.25 : 0.1;
      initEffects();
    }, 250);
  });

  // ===== WHATSAPP BUTTON ANIMATION =====
  const whatsappBtn = document.querySelector('.whatsapp-float');
  if (whatsappBtn) {
    // Animación de entrada con delay
    setTimeout(() => {
      whatsappBtn.style.opacity = '1';
      whatsappBtn.style.transform = 'translateY(0) scale(1)';
      whatsappBtn.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }, 2000);
    
    // Efecto de pulso intermitente
    setInterval(() => {
      whatsappBtn.classList.toggle('pulse');
    }, 3000);
  }

  // ===== ACCESIBILIDAD =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (navMenu.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        menuToggle.focus();
      }
      
      // Salir de Spline si está en foco
      if (isOverSpline) {
        isOverSpline = false;
        document.body.style.overflow = '';
      }
    }
  });

  // ===== INICIALIZAR TODO =====
  window.addEventListener('load', initEffects);
  
  // Fallback si load tarda mucho
  setTimeout(initEffects, 1000);
});