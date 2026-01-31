// ===== CONFIGURACIÓN FIJA DE ALTA CALIDAD =====
const config = {
  effects: true, // TODOS LOS EFECTOS SIEMPRE ACTIVOS
  smoothScroll: true,
  soundEnabled: false,
  parallaxEnabled: true,
  
  isMobile: () => {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  
  scrollThreshold: 0.1,
  scrollMargin: '50px'
};

// ===== VARIABLES GLOBALES FIJAS =====
// ¡CONFIGURACIÓN DE ALTA CALIDAD PARA TODOS!
window.particleCount = 120; // MÁXIMO DE PARTÍCULAS
window.noiseIntensity = 0.25; // NOISE AL MÁXIMO
window.animationQuality = 'high'; // CALIDAD MÁXIMA

// ===== ELEMENTOS DEL DOM =====
const scrollElements = document.querySelectorAll('[data-scroll-effect]');
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const sections = document.querySelectorAll('section');

// ===== VARIABLES DE ESTADO =====
let lastScrollY = window.scrollY;
let ticking = false;

console.log('🎯 CONFIGURACIÓN FIJA DE ALTA CALIDAD');
console.log('✨ TODOS los efectos activados para todos los dispositivos');
console.log(`🎯 Partículas: ${window.particleCount}`);
console.log(`🎨 Intensidad noise: ${window.noiseIntensity}`);
console.log(`📱 Dispositivo: ${config.isMobile() ? 'Mobile' : 'Desktop'}`);

// ===== NOISE PRO - CALIDAD MÁXIMA =====
const setupNoisePro = () => {
  const canvas = document.getElementById('noiseCanvas');
  if (!canvas) return;

  // VERIFICAR SI EL DISPOSITIVO PUEDE MANEJARLO
  const isLowPerformanceDevice = () => {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // DESACTIVAR COMPLETAMENTE EN DISPOSITIVOS DE BAJO RENDIMIENTO
  if (isLowPerformanceDevice()) {
    canvas.style.display = 'none';
    console.log('🎨 Noise desactivado en dispositivo móvil/limitado');
    return;
  }

  const ctx = canvas.getContext('2d');
  
  // OPTIMIZACIONES:
  const scale = 0.5; // Reducir resolución a la mitad
  const frameRate = 10; // Reducir FPS (de 20 a 10)
  const density = 0.03; // Reducir densidad (de 0.05 a 0.03)
  const opacity = 0.15; // Reducir opacidad (de 0.25 a 0.15)

  let isVisible = true;
  let isAnimating = false;
  let lastFrameTime = 0;
  const frameInterval = 1000 / frameRate;

  const resize = () => {
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  };

  resize();
  
  // Usar debounce para resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 500);
  }, { passive: true });

  const generateNoise = (currentTime) => {
    if (!isVisible || currentTime - lastFrameTime < frameInterval || !isAnimating) {
      requestAnimationFrame(generateNoise);
      return;
    }
    
    lastFrameTime = currentTime;
    canvas.style.opacity = opacity;
    
    // Crear un buffer más pequeño
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const buffer32 = new Uint32Array(imageData.data.buffer);
    const len = buffer32.length;

    // Usar un patrón más simple
    for (let i = 0; i < len; i += 2) { // Saltar píxeles
      if (Math.random() < density) {
        const shade = 220 + (Math.random() * 35);
        buffer32[i] = (255 << 24) | (shade << 16) | (shade << 8) | shade;
      } else {
        buffer32[i] = 0xff000000;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(generateNoise);
  };

  // PAUSAR CUANDO NO ES VISIBLE
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    isAnimating = isVisible;
    
    if (isVisible) {
      requestAnimationFrame(generateNoise);
    }
  });

  // SOLO ANIMAR CUANDO HAY INTERACCIÓN
  let interactionTimeout;
  const startAnimation = () => {
    isAnimating = true;
    clearTimeout(interactionTimeout);
    interactionTimeout = setTimeout(() => {
      isAnimating = false;
    }, 2000); // Parar después de 2 segundos sin interacción
  };

  ['mousemove', 'scroll', 'click', 'touchstart'].forEach(event => {
    window.addEventListener(event, startAnimation, { passive: true });
  });

  // Iniciar
  isAnimating = true;
  generateNoise(0);
  console.log('🎨 Noise optimizado: 10 FPS, 50% resolución');
};

// ===== TSPARTICLES - EFECTOS COMPLETOS =====
const initTsParticles = () => {
  if (typeof tsParticles === 'undefined') {
    console.error('tsParticles no cargado');
    return;
  }

  // CONFIGURACIÓN DE ALTA CALIDAD
  const particlesConfig = {
    autoPlay: true,
    background: { color: { value: "transparent" }, opacity: 0 },
    fullScreen: { enable: false, zIndex: -2 },
    fpsLimit: 60, // FPS MÁXIMO
    interactivity: {
      detectsOn: "window",
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { 
          enable: true,
          mode: "repulse",
          parallax: { enable: false }
        }
      }
    },
    particles: {
      color: { value: ["#FFD600", "#2ECC71", "#E74C3C", "#0B2C4D"] },
      move: {
        enable: true,
        speed: 2, // VELOCIDAD ALTA
        direction: "none",
        outModes: { default: "out" }
      },
      number: {
        value: window.particleCount,
        density: { enable: true, width: 1920, height: 1080 }
      },
      opacity: {
        value: 0.7,
        animation: { enable: true, speed: 2, sync: false }
      },
      size: {
        value: { min: 1, max: 30 },
        animation: { enable: true, speed: 5 }
      },
      shape: {
        close: true,
        fill: true,
        options: {},
        type: "circle"
      },
      links: {
        enable: true,
        distance: 150,
        opacity: 0.4,
        width: 1
      }
    },
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    smooth: false,
    detectRetina: true
  };

  tsParticles.load("tsparticles", particlesConfig).then(container => {
    console.log(`✨ tsParticles activado: ${window.particleCount} partículas - 60 FPS`);
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        container.pause();
      } else {
        container.play();
      }
    });
  });
};

// ===== SCROLL STORYTELLING PRO - COMPLETO =====
const initScrollStorytellingPro = () => {
  const storySections = document.querySelectorAll('.story-section');
  const animatedTexts = document.querySelectorAll('.story-text-animated');
  const storyWithIcons = document.querySelector('.story-with-icons');
  const storyIconsGrid = document.querySelector('.story-icons-grid');
  const iconItems = document.querySelectorAll('.story-icon-item');
  const scrollHint = document.querySelector('.scroll-hint');

  if (!storySections.length || !scrollHint) return;

  // Preparar textos animados
  animatedTexts.forEach(textElement => {
    const text = textElement.dataset.text || textElement.textContent;
    const chars = text.split('');
    
    const charElements = chars.map((char, index) => {
      const span = document.createElement('span');
      span.className = char === ' ' ? 'char space' : 'char';
      span.textContent = char === ' ' ? ' ' : char;
      span.style.setProperty('--distance', index - (chars.length / 2));
      span.style.setProperty('--index', index);
      return span;
    });

    textElement.innerHTML = '';
    charElements.forEach(span => textElement.appendChild(span));
  });

  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px -100px 0px',
    threshold: 0.1
  };

  const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const section = entry.target;
      
      if (entry.isIntersecting) {
        const chars = section.querySelectorAll('.char');
        chars.forEach((char, index) => {
          setTimeout(() => {
            char.style.opacity = '1';
            char.style.transform = 'translateX(0) rotateX(0)';
          }, index * 50);
        });

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
      } else {
        const chars = section.querySelectorAll('.char');
        chars.forEach(char => {
          char.style.opacity = '0';
          char.style.transform = 'translateX(calc(var(--distance) * 60px)) rotateX(calc(var(--distance) * 30deg))';
        });

        if (section.id === 'story-section-3') {
          if (storyWithIcons) storyWithIcons.classList.remove('active');
          if (storyIconsGrid) storyIconsGrid.classList.remove('active');
          iconItems.forEach(item => item.classList.remove('active'));
        }
      }
    });
  }, observerOptions);

  storySections.forEach(section => storyObserver.observe(section));

  const updateScrollHint = () => {
    const heroSection = document.getElementById('hero');
    if (!heroSection || !scrollHint) return;
    
    const heroRect = heroSection.getBoundingClientRect();
    const heroBottom = heroRect.bottom;
    const heroTop = heroRect.top;
    
    if (heroBottom > 100 && heroTop < window.innerHeight - 100) {
      scrollHint.style.opacity = '1';
      scrollHint.style.transform = 'translateX(-50%) translateY(0)';
      scrollHint.style.pointerEvents = 'auto';
    } else {
      scrollHint.style.opacity = '0';
      scrollHint.style.transform = 'translateX(-50%) translateY(20px)';
      scrollHint.style.pointerEvents = 'none';
    }
  };

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

  let scrollHintTimeout;
  window.addEventListener('scroll', () => {
    if (!scrollHintTimeout) {
      scrollHintTimeout = setTimeout(() => {
        updateScrollHint();
        scrollHintTimeout = null;
      }, 100);
    }
  }, { passive: true });

  updateScrollHint();
  console.log('🎬 Scroll Storytelling activado');
};

// ===== COUNTDOWN TIMER =====
const initCountdown = () => {
  const countdownElement = document.getElementById('countdown');
  if (!countdownElement) return;
  
  let endTime = new Date();
  endTime.setHours(endTime.getHours() + 24);
  
  const updateCountdown = () => {
    const now = new Date();
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) {
      countdownElement.textContent = '00:00:00';
      endTime.setHours(endTime.getHours() + 24);
      return;
    }
    
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    countdownElement.textContent = 
      `${hours.toString().padStart(2, '0')}:` +
      `${minutes.toString().padStart(2, '0')}:` +
      `${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft < 10 * 60 * 1000) {
      countdownElement.style.color = 'var(--red)';
      countdownElement.style.animation = 'pulseBadge 1s infinite';
    }
  };
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
  console.log('⏰ Countdown activado');
};

// ===== MICRO-INTERACCIONES =====
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

// ===== MENÚ MÓVIL =====
const initMobileMenu = () => {
  if (!menuToggle || !navMenu) return;
  
  if (config.isMobile()) {
    menuToggle.style.display = 'flex';
  }
  
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = !navMenu.classList.contains('active');
    
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive);
    
    if (isActive) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  });
  
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });
  
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });
};

const closeMobileMenu = () => {
  if (!navMenu || !menuToggle) return;
  
  navMenu.classList.remove('active');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
};

// ===== SCROLL SMOOTH =====
const initSmoothScroll = () => {
  console.log('🔄 SmoothScroll activado');
  
  const smoothConfig = {
    duration: 700,
    easing: (t) => {
      return t < 0.5 
        ? 8 * t * t * t * t
        : 1 - Math.pow(-2 * t + 2, 4) / 2;
    },
    offset: 80,
    minDistance: 50,
    maxDistance: 3000,
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
    
    if (absoluteDistance < 500) {
      duration = Math.max(400, absoluteDistance * 0.6);
    } else if (absoluteDistance > 2000) {
      duration = Math.min(1200, absoluteDistance * 0.4);
    } else {
      duration = absoluteDistance * 0.5;
    }

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
        
        requestAnimationFrame(() => {
          const currentPos = window.pageYOffset;
          if (Math.abs(currentPos - targetPosition) > 1) {
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          }
        });
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
      
      if (navMenu && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }

      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = targetPosition - headerHeight - 20;
      
      smoothScrollTo(offsetPosition);
      
      if (window.location.hash !== targetId) {
        history.pushState(null, null, targetId);
      }
    });
  });

  if ('scrollBehavior' in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  console.log('✅ SmoothScroll listo');
};

// ===== SCROLL EFFECTS =====
const initScrollEffects = () => {
  if (!config.effects || scrollElements.length === 0) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '100px 0px 100px 0px',
    threshold: 0.01
  };
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = parseInt(element.getAttribute('data-delay')) || 0;
          
          requestAnimationFrame(() => {
            setTimeout(() => {
              element.classList.add('active');
            }, delay);
          });
        }
      });
    },
    observerOptions
  );
  
  const batchSize = 10;
  for (let i = 0; i < scrollElements.length; i += batchSize) {
    const batch = Array.from(scrollElements).slice(i, i + batchSize);
    
    requestIdleCallback(() => {
      batch.forEach(el => observer.observe(el));
    }, { timeout: 1000 });
  }
  
  console.log(`✅ Scroll effects: ${scrollElements.length} elementos`);
};

// ===== HEADER EFFECT =====
const updateHeader = () => {
  if (!header) return;
  
  const scrollY = window.scrollY;
  
  if (scrollY > 100) {
    header.classList.add('scrolled');
    header.style.backgroundColor = 'rgba(5, 27, 56, 0.98)';
    header.style.backdropFilter = 'blur(15px)';
  } else {
    header.classList.remove('scrolled');
    header.style.backgroundColor = 'rgba(11, 44, 77, 0.95)';
    header.style.backdropFilter = 'blur(10px)';
  }
};

// ===== SCROLL HANDLER =====
const handleScroll = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      updateHeader();
      ticking = false;
    });
  }
};

// ===== WHATSAPP BUTTON =====
const initWhatsAppButton = () => {
  const whatsappBtn = document.querySelector('.whatsapp-float');
  if (!whatsappBtn) return;
  
  setTimeout(() => {
    whatsappBtn.style.opacity = '1';
    whatsappBtn.style.transform = 'translateY(0) scale(1)';
    whatsappBtn.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }, 2000);
  
  if (config.effects) {
    setInterval(() => {
      if (!document.hidden) {
        whatsappBtn.classList.toggle('pulse');
      }
    }, 3000);
  }
};

// ===== INTRO REMOVAL =====
const initIntro = () => {
  const intro = document.getElementById('intro');
  if (!intro) return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      intro.style.opacity = '0';
      setTimeout(() => {
        intro.style.display = 'none';
      }, 500);
    }, 3000);
  });
};

// ===== PARALLAX - EFECTOS COMPLETOS =====
const initComponentParallax = () => {
  if (!config.effects) {
    console.log('⚠️ Efectos desactivados (reduced-motion)');
    return;
  }
  
  console.log('🌀 Parallax activado');
  
  const mouseParallaxElements = document.querySelectorAll(`
    .card, .offer-card, .contact-card,
    .brand-item, .feature, .info-card,
    .story-icon-item, .hero-btn
  `);
  
  const updateScrollParallax = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const windowCenter = scrollY + (windowHeight / 2);
    
    const allParallaxElements = document.querySelectorAll(`
      .reveal[data-speed],
      [data-scroll-effect],
      .hero-img, .about-image, .section-title,
      .card, .offer-card, .contact-card,
      .brand-item, .feature, .info-card,
      .hero-text h1, .hero-text p,
      .section-subtitle, .about-content,
      .about-content p, .hero-text,
      .hero-buttons, .about-features,
      .story-icon-item, .story-text-animated
    `);
    
    allParallaxElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementCenter = elementTop + (rect.height / 2);
      
      const distanceFromCenter = elementCenter - windowCenter;
      const normalizedDistance = distanceFromCenter / windowHeight;
      
      const speed = parseFloat(element.getAttribute('data-speed')) || 0.1;
      
      if (element.hasAttribute('data-speed')) {
        const translateY = normalizedDistance * 100 * speed * 0.7;
        const opacity = 1 - Math.abs(normalizedDistance) * 0.3;
        
        element.style.transform = `translate3d(0, ${translateY}px, 0)`;
        element.style.opacity = opacity;
      }
    });
  };
  
  // Mouse parallax siempre activo en desktop
  if (!config.isMobile()) {
    mouseParallaxElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / centerX;
        const moveY = (y - centerY) / centerY;
        
        const intensity = 0.15;
        const rotateY = moveX * 8;
        const rotateX = -moveY * 5;
        const translateZ = 25;
        const translateX = moveX * intensity * 20;
        const translateY = moveY * intensity * 20;
        
        element.style.transform = `
          translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
          rotateY(${rotateY}deg)
          rotateX(${rotateX}deg)
        `;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = '';
        element.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        setTimeout(() => {
          element.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        }, 500);
      });
    });
  }
  
  let scrollTicking = false;
  const handleScrollParallax = () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateScrollParallax();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  };
  
  updateScrollParallax();
  window.addEventListener('scroll', handleScrollParallax, { passive: true });
  window.addEventListener('resize', handleScrollParallax, { passive: true });
  
  console.log('✅ Parallax listo');
};

// ===== FONDOS DINÁMICOS - EFECTOS COMPLETOS =====
const initDynamicBackgrounds = () => {
  const sections = document.querySelectorAll('.parallax-section');
  
  sections.forEach((section) => {
    const background = section.querySelector('.section-background');
    
    if (!background) return;
    
    // Añadir capas extras
    const layer3 = document.createElement('div');
    layer3.className = 'gradient-layer-3';
    background.appendChild(layer3);
    
    const layer4 = document.createElement('div');
    layer4.className = 'gradient-layer-4';
    background.appendChild(layer4);
    
    // Efecto de interacción en desktop
    if (!config.isMobile()) {
      section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const layers = background.querySelectorAll('.gradient-layer, .gradient-layer-2');
        layers.forEach(layer => {
          layer.style.transform = `translate(${(x - 50) * 0.1}%, ${(y - 50) * 0.1}%)`;
        });
      });
      
      section.addEventListener('mouseleave', () => {
        const layers = background.querySelectorAll('.gradient-layer, .gradient-layer-2');
        layers.forEach(layer => {
          layer.style.transform = '';
        });
      });
    }
  });
  
  console.log('🎨 Fondos dinámicos activados');
};

// ===== SISTEMA DE NOTIFICACIONES INTELIGENTE COMPLETO =====
const initSmartNotifications = () => {
  console.log('🔔 Inicializando sistema de notificaciones...');
  
  // Verificar si ya existe un contenedor
  let notificationContainer = document.querySelector('.notification-container');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = `notification-container ${config.isMobile() ? 'mobile' : 'desktop'}`;
    document.body.appendChild(notificationContainer);
    console.log('✅ Contenedor de notificaciones creado');
  }
  
  let activeNotifications = new Set();
  let notificationTimeouts = new Map();

  // Función para mostrar notificación
  const showNotification = (message, type = 'info', options = {}) => {
    // Si no hay mensaje, no mostrar
    if (!message || message.trim() === '') return null;
    
    console.log(`🔔 Mostrando: "${message.substring(0, 30)}${message.length > 30 ? '...' : ''}"`);
    
    // Remover notificación existente con el mismo ID
    if (options.id) {
      const existing = document.getElementById(options.id);
      if (existing) {
        existing.remove();
        activeNotifications.delete(options.id);
      }
    }

    const notificationId = options.id || `notification-${Date.now()}`;
    const duration = options.duration || (config.isMobile() ? 8000 : 10000);
    
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type} ${config.isMobile() ? 'mobile-notification' : 'desktop-notification'}`;
    notification.id = notificationId;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.style.zIndex = '10002';

    // Icono según tipo
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      interaction: '🎮'
    };
    
    const icon = icons[type] || icons.info;

    // Contenido HTML
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

    // Añadir al DOM
    notificationContainer.appendChild(notification);
    activeNotifications.add(notificationId);

    // Animación de entrada (con setTimeout para asegurar que el DOM esté listo)
    setTimeout(() => {
      notification.classList.add('show');
      console.log(`✅ Notificación ${notificationId} visible`);
    }, 10);

    // Configurar barra de progreso
    const progressBar = notification.querySelector('.notification-progress');
    if (progressBar) {
      progressBar.style.animationDuration = `${duration}ms`;
      progressBar.style.animationPlayState = 'running';
    }

    // Timeout para auto-eliminar
    const timeout = setTimeout(() => {
      console.log(`⏰ Auto-dismiss: ${notificationId}`);
      removeNotification(notificationId);
    }, duration);

    notificationTimeouts.set(notificationId, timeout);

    // Botón de cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log(`❌ Cerrada manualmente: ${notificationId}`);
      removeNotification(notificationId);
    });

    // Clic en la notificación para cerrar
    notification.addEventListener('click', (e) => {
      if (e.target === notification) {
        console.log(`👆 Clic en notificación: ${notificationId}`);
        removeNotification(notificationId);
      }
    });

    return notificationId;
  };

  // Función para remover notificación
  const removeNotification = (id) => {
    console.log(`🗑️ Eliminando: ${id}`);
    
    const notification = document.getElementById(id);
    if (!notification) {
      console.warn(`⚠️ Notificación ${id} no encontrada`);
      return;
    }

    // Limpiar timeout
    if (notificationTimeouts.has(id)) {
      clearTimeout(notificationTimeouts.get(id));
      notificationTimeouts.delete(id);
    }

    // Animación de salida
    notification.classList.remove('show');
    notification.classList.add('hide');

    // Eliminar después de la animación
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      activeNotifications.delete(id);
      console.log(`✅ Completamente eliminada: ${id}`);
    }, 300);
  };

  const NOTIFICATION_SETTINGS = {
    welcome: {
      type: 'always', // 'always', 'once-per-session', 'once-per-day', 'once-per-hour'
      delay: 3500,
      duration: 10000
    },
    spline: {
      type: 'once-per-session',
      delay: 0,
      duration: 6000
    }
  };
  
  // Verificar si debe mostrarse según el tipo
  const shouldShowNotification = (notificationType) => {
    const settings = NOTIFICATION_SETTINGS[notificationType];
    if (!settings) return true;
    
    const storageKey = `merke_${notificationType}_shown`;
    
    switch(settings.type) {
      case 'always':
        return true;
        
      case 'once-per-session':
        return !sessionStorage.getItem(storageKey);
        
      case 'once-per-day':
        const lastShown = localStorage.getItem(storageKey);
        if (!lastShown) return true;
        
        const lastDate = new Date(parseInt(lastShown));
        const now = new Date();
        return lastDate.getDate() !== now.getDate() || 
               lastDate.getMonth() !== now.getMonth() || 
               lastDate.getFullYear() !== now.getFullYear();
        
      case 'once-per-hour':
        const lastShownHour = localStorage.getItem(storageKey);
        if (!lastShownHour) return true;
        
        const lastHour = new Date(parseInt(lastShownHour));
        const nowHour = new Date();
        return (nowHour.getTime() - lastHour.getTime()) > (60 * 60 * 1000);
        
      default:
        return true;
    }
  };
  
  // Marcar como mostrada
  const markAsShown = (notificationType) => {
    const settings = NOTIFICATION_SETTINGS[notificationType];
    if (!settings) return;
    
    const storageKey = `merke_${notificationType}_shown`;
    
    if (settings.type === 'once-per-session') {
      sessionStorage.setItem(storageKey, 'true');
    } else if (settings.type === 'once-per-day' || settings.type === 'once-per-hour') {
      localStorage.setItem(storageKey, Date.now().toString());
    }
  };
  
  // ===== NOTIFICACIÓN DE BIENVENIDA AUTOMÁTICA =====
  const showWelcomeNotification = () => {
    if (!shouldShowNotification('welcome')) {
      console.log('⚠️ Bienvenida ya mostrada según configuración');
      return;
    }
    
    console.log('👋 Mostrando notificación de bienvenida automática');
    
    setTimeout(() => {
      showNotification(
        '¡Bienvenido a Merke+ de la sabana!',
        'info',
        {
          id: 'welcome-notification',
          duration: NOTIFICATION_SETTINGS.welcome.duration
        }
      );
      
      markAsShown('welcome');
    }, NOTIFICATION_SETTINGS.welcome.delay);
  };

  // ===== NOTIFICACIONES PARA SPLINE =====
  const setupSplineNotifications = () => {
    const splineViewer = document.querySelector('spline-viewer');
    if (!splineViewer) {
      console.error('❌ Spline viewer no encontrado');
      return;
    }

    let lastInteractionTime = 0;
    const INTERACTION_COOLDOWN = 10000; // 10 segundos

    const showSplineNotification = () => {
      const now = Date.now();
      
      // Cooldown para evitar notificaciones repetitivas
      if (now - lastInteractionTime < INTERACTION_COOLDOWN) {
        console.log('⏳ Cooldown activo, omitiendo notificación Spline');
        return;
      }

      const message = config.isMobile() 
        ? 'Modo interacción: Dos dedos para zoom, un dedo para rotar'
        : 'Modo interacción: Usa la rueda del mouse para zoom';

      console.log('🎮 Mostrando notificación de interacción Spline');
      
      showNotification(message, 'interaction', {
        id: 'spline-interaction',
        duration: 6000 // 6 segundos
      });

      lastInteractionTime = now;
    };

    // Añadir listeners con delay para asegurar que Spline esté listo
    setTimeout(() => {
      console.log('🎯 Añadiendo listeners a Spline');
      
      // Desktop
      splineViewer.addEventListener('mousedown', showSplineNotification);
      splineViewer.addEventListener('wheel', showSplineNotification);
      
      // Móvil
      splineViewer.addEventListener('touchstart', showSplineNotification);
      
      console.log('✅ Listeners para Spline configurados');
    }, 1500);
  };

  // ===== INICIALIZACIÓN =====
  
  // 1. Mostrar bienvenida automáticamente
  showWelcomeNotification();
  
  // 2. Configurar notificaciones para Spline
  setTimeout(() => {
    setupSplineNotifications();
  }, 2000);
  
  // 3. Exponer funciones para debugging
  window.debugNotifications = {
    show: (message, type = 'info', duration = 10000) => {
      return showNotification(message, type, { 
        id: `debug-${Date.now()}`,
        duration: duration 
      });
    },
    remove: (id) => removeNotification(id),
    list: () => Array.from(activeNotifications),
    testWelcome: () => {
      showNotification(
        '[TEST] ¡Bienvenido a Merke+! Esta es una prueba',
        'info',
        { id: 'test-welcome', duration: 5000 }
      );
    },
    testSpline: () => {
      const message = config.isMobile() 
        ? '[TEST] Interacción Spline: Dos dedos zoom'
        : '[TEST] Interacción Spline: Rueda mouse zoom';
      showNotification(message, 'interaction', { 
        id: 'test-spline', 
        duration: 5000 
      });
    },
    clearAll: () => {
      activeNotifications.forEach(id => removeNotification(id));
    }
  };

  console.log('✅ Sistema de notificaciones inicializado correctamente');
  console.log('📱 Dispositivo:', config.isMobile() ? 'Móvil' : 'Desktop');
  console.log('💾 Sesión:', sessionStorage.getItem('merke_welcome_shown') ? 'Bienvenida mostrada' : 'Bienvenida pendiente');
};

// ===== SISTEMA DE BLOQUEO DE SCROLL PARA SPLINE COMPLETO =====
const initSplineScrollLock = () => {
  const splineViewer = document.querySelector('spline-viewer');
  const splineContainer = document.querySelector('.spline-container');
  
  if (!splineViewer || !splineContainer) return;
  
  // Variables de estado
  let isInteracting = false;
  let interactionTimeout = null;
  let isMobile = config.isMobile();
  let touchStartY = 0;
  let isPinching = false;
  let initialTouchDistance = 0;
  
  // Función mejorada para bloquear scroll
  const lockScroll = () => {
    if (isInteracting) return;
    
    isInteracting = true;
    
    // Añadir clase al body
    document.body.classList.add('scroll-locked');
    
    // Guardar posición actual del scroll
    window.scrollLockPosition = window.pageYOffset;
    
    // Añadir clase al contenedor Spline
    splineContainer.classList.add('interacting');
    
    console.log('🔒 Scroll bloqueado para interacción');
  };
  
  // Función mejorada para desbloquear scroll
  const unlockScroll = () => {
    if (!isInteracting) return;
    
    isInteracting = false;
    
    // Remover clase del body
    document.body.classList.remove('scroll-locked');
    
    // Remover clase del contenedor Spline
    splineContainer.classList.remove('interacting');
    
    console.log('🔓 Scroll desbloqueado');
  };
  
  // Detectar interacción en desktop
  const handleDesktopInteraction = () => {
    // Mouse down - comenzar interacción
    splineViewer.addEventListener('mousedown', () => {
      lockScroll();
      
      // Resetear timeout si ya existe
      if (interactionTimeout) {
        clearTimeout(interactionTimeout);
      }
    });
    
    // Mouse up - terminar después de delay corto
    splineViewer.addEventListener('mouseup', () => {
      if (interactionTimeout) clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        if (!splineViewer.matches(':active')) {
          unlockScroll();
        }
      }, 300);
    });
    
    // Mouse leave - terminar inmediatamente
    splineViewer.addEventListener('mouseleave', () => {
      if (interactionTimeout) clearTimeout(interactionTimeout);
      unlockScroll();
    });
    
    // Wheel - mantener bloqueado durante
    splineViewer.addEventListener('wheel', (e) => {
      e.stopPropagation();
      
      if (!isInteracting) {
        lockScroll();
      }
      
      // Resetear timeout
      if (interactionTimeout) clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        unlockScroll();
      }, 500);
    }, { passive: false });
  };
  
  // Detectar interacción en móvil
  const handleMobileInteraction = () => {
    splineViewer.style.touchAction = 'none';
    
    splineViewer.addEventListener('touchstart', (e) => {
      // Guardar posición inicial
      touchStartY = e.touches[0].clientY;
      
      // Detectar pinch (zoom)
      if (e.touches.length === 2) {
        isPinching = true;
        initialTouchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        lockScroll();
      }
    }, { passive: true });
    
    splineViewer.addEventListener('touchmove', (e) => {
      // Prevenir scroll de página cuando hay dos dedos o cuando ya estamos interactuando
      if (isPinching || isInteracting) {
        e.preventDefault();
        
        // Si detectamos dos dedos, bloquear definitivamente
        if (e.touches.length === 2 && !isInteracting) {
          lockScroll();
        }
      }
    }, { passive: false });
    
    splineViewer.addEventListener('touchend', () => {
      isPinching = false;
      
      // Pequeño delay antes de desbloquear
      if (interactionTimeout) clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        if (!isPinching) {
          unlockScroll();
        }
      }, 500);
    }, { passive: true });
  };
  
  // Prevenir scroll accidental cuando el cursor está sobre Spline
  splineViewer.addEventListener('mouseenter', () => {
    splineViewer.style.pointerEvents = 'auto';
  });
  
  splineViewer.addEventListener('mouseleave', () => {
    if (interactionTimeout) clearTimeout(interactionTimeout);
    interactionTimeout = setTimeout(() => {
      if (!splineViewer.matches(':active')) {
        unlockScroll();
      }
    }, 200);
  });
  
  // Escape key para desbloquear manualmente
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isInteracting) {
      unlockScroll();
    }
  });
  
  // Inicializar según dispositivo
  if (isMobile) {
    handleMobileInteraction();
  } else {
    handleDesktopInteraction();
  }
  
  console.log(`🎮 Sistema de bloqueo de scroll mejorado: ${isMobile ? 'móvil' : 'desktop'}`);
};

// ===== OPTIMIZACIÓN SPLINE COMPLETA CON SCROLL LOCK =====
const optimizeSpline = () => {
  const splineViewer = document.querySelector('spline-viewer');
  if (!splineViewer) return;
  
  console.log('🎮 Spline configurado en alta calidad + scroll lock');
  
  // CONFIGURACIÓN DE ALTA CALIDAD
  splineViewer.setAttribute('render-mode', 'quality');
  splineViewer.setAttribute('quality', 'high');
  splineViewer.setAttribute('interaction-enabled', 'true');
  
  // Añadir atributos para mejor control táctil
  if (config.isMobile()) {
    splineViewer.setAttribute('touch-action', 'none');
    splineViewer.style.touchAction = 'none';
  }
  
  // Pausar cuando no es visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        splineViewer.setAttribute('paused', 'true');
      } else {
        splineViewer.removeAttribute('paused');
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(splineViewer);
  
  // Inicializar sistema de bloqueo de scroll COMPLETO
  initSplineScrollLock();
  
  console.log('✅ Spline optimizado con scroll lock');
};

// ===== LAZY LOADING =====
const initSmartLazyLoad = () => {
  const lazyElements = document.querySelectorAll('[loading="lazy"], img[data-src], iframe[data-src]');
  
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        if (element.dataset.src) {
          element.src = element.dataset.src;
          element.removeAttribute('data-src');
        }
        lazyObserver.unobserve(element);
      }
    });
  }, {
    rootMargin: '200px 0px',
    threshold: 0.01
  });
  
  lazyElements.forEach(el => lazyObserver.observe(el));
  console.log(`🔄 Lazy loading: ${lazyElements.length} elementos`);
};

// ===== VENTANAS DE PRODUCTOS =====
const initProductModals = () => {
  console.log('🛒 Ventanas de productos activadas');
  
  const productDatabase = {
    'abarrotes': {
      title: 'Abarrotes Esenciales',
      category: 'Abarrotes',
      description: 'Todo lo esencial para tu despensa diaria. Productos de alta calidad que garantizan sabor y durabilidad.',
      price: 'Desde $5.000',
      images: [
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w-800&auto=format&fit=crop',
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

  // Elementos DOM
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

  // Variables de estado
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
    const product = productDatabase[productKey];
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
    
    console.log(`🛒 Mostrando producto: ${product.title}`);
  };

  const hideModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    
    setTimeout(() => {
      slides = [];
      indicators = [];
    }, 300);
    
    console.log('🛒 Modal cerrada');
  };

  const prevSlide = () => {
    goToSlide(currentSlideIndex - 1);
  };

  const nextSlide = () => {
    goToSlide(currentSlideIndex + 1);
  };

  document.querySelectorAll('.card-link').forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      let productKey = '';
      switch(index) {
        case 0: productKey = 'abarrotes'; break;
        case 1: productKey = 'frutas-y-verduras'; break;
        case 2: productKey = 'lacteos'; break;
        case 3: productKey = 'bebidas'; break;
        default: productKey = 'abarrotes';
      }
      
      showModal(productKey);
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
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  console.log('✅ Sistema de productos listo');
};

// ===== INICIALIZACIÓN PRINCIPAL =====
const init = () => {
  console.log('🚀 Iniciando Merke+ con TODOS los efectos activados');
  
  // Inicializar todo inmediatamente
  initMobileMenu();
  initSmartLazyLoad();
  initSmartNotifications();
  initProductModals();
  
  // Inicializar efectos visuales
  window.addEventListener('load', () => {
    setTimeout(() => {
      setupNoisePro();
      initTsParticles();
      initSmoothScroll();
      initScrollEffects();
      initScrollStorytellingPro();
      initComponentParallax();
      optimizeSpline();
      initDynamicBackgrounds();
      initCountdown();
      initMicroInteractions();
      initWhatsAppButton();
      initIntro();
      
      document.body.classList.add('loaded');
      console.log('✅ Sistema completamente cargado');
    }, 500);
  });
  
  // Event listeners
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', updateHeader, { passive: true });
  
  updateHeader();
};

// ===== EJECUCIÓN =====
init();

// Fallback
setTimeout(() => {
  if (!document.body.classList.contains('loaded')) {
    console.log('⚠️ Reintentando carga...');
    init();
  }
}, 2000);

// ===== DEBUG HELPER =====
window.debugMerke = {
  reloadEffects: () => {
    document.location.reload();
  },
  getConfig: () => {
    return {
      particleCount: window.particleCount,
      noiseIntensity: window.noiseIntensity,
      isMobile: config.isMobile(),
      allEffects: true
    };
  }
};