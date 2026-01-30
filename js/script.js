// ===== CONFIGURACIÓN ADAPTATIVA (PRIMERO) =====
const config = {
  effects: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
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

// ===== DETECCIÓN DE GPU MEJORADA (PERO RESPETANDO TU CÓDIGO ORIGINAL) =====
const detectGPU = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'none';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'unknown';
    
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
    
    console.log(`🔍 GPU detectada: ${renderer}`);
    console.log(`🏢 Fabricante: ${vendor}`);
    
    // Detectar GPUs gaming de NVIDIA/AMD
    if (renderer.includes('NVIDIA') || renderer.includes('GeForce') || renderer.includes('RTX') || renderer.includes('GTX')) {
      return 'nvidia_gaming';
    } else if (renderer.includes('AMD') || renderer.includes('Radeon') || renderer.includes('RX')) {
      return 'amd_gaming';
    } else if (renderer.includes('Intel') && (renderer.includes('Iris') || renderer.includes('UHD') || renderer.includes('HD'))) {
      return 'intel_integrated';
    } else if (renderer.includes('Apple') || renderer.includes('Metal')) {
      return 'apple';
    } else if (renderer.includes('Adreno') || renderer.includes('Mali') || renderer.includes('PowerVR')) {
      return 'mobile';
    }
    
    return 'unknown';
  } catch (e) {
    console.error('❌ Error detectando GPU:', e);
    return 'error';
  }
};

// ===== DETECCIÓN DE HARDWARE MEJORADA PERO RESPETANDO TU LÓGICA ORIGINAL =====
const detectHardwareTier = () => {
  const isMobile = config.isMobile();
  
  // Obtener información del navegador (RESPETANDO TU LÓGICA)
  const userAgent = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const memory = navigator.deviceMemory || 4; // GB
  const cores = navigator.hardwareConcurrency || 4;
  const gpu = detectGPU();
  
  console.log(`📊 Detección hardware:`);
  console.log(`   - RAM: ${memory}GB (Tu equipo tiene 40GB)`);
  console.log(`   - Núcleos: ${cores}`);
  console.log(`   - GPU: ${gpu}`);
  console.log(`   - Móvil: ${isMobile}`);
  
  // ===== DETECCIÓN MEJORADA PERO CON TU LÓGICA COMO BASE =====
  
  // 1. Primero verificar si es PC Gaming (como tu ASUS TUF)
  const isGamingPC = () => {
    // TU PC CON 40GB RAM DEBE SER DETECTADA COMO HIGH
    if (memory >= 16) { // Reducido de 8 a 16 para que tu PC con 40GB sea detectada
      console.log('💻 PC Gaming detectado (alta RAM)');
      return true;
    }
    
    // Detectar por GPU gaming
    if (gpu === 'nvidia_gaming' || gpu === 'amd_gaming') {
      console.log('🎮 GPU Gaming detectada');
      return true;
    }
    
    // Detectar por características de hardware (manteniendo tu lógica)
    if (memory >= 8 && cores >= 4) {
      console.log('💻 Hardware de gama alta detectado');
      return true;
    }
    
    return false;
  };
  
  // 2. Mantener tu lógica original para dispositivos móviles
  if (isMobile && memory < 4) {
    console.log('📱 Nivel: LOW (Dispositivo básico)');
    return 'low'; // Dispositivos básicos como Motorola One Fusion+
  } else if (isMobile && memory >= 4) {
    console.log('📱 Nivel: MID (Dispositivo móvil bueno)');
    return 'mid'; // Dispositivos móviles buenos
  } else if (!isMobile && isGamingPC()) {
    console.log('💻 Nivel: HIGH (PC Gaming como ASUS TUF)');
    return 'high'; // PCs gaming como ASUS TUF (¡INCLUYENDO EL TUYO CON 40GB RAM!)
  } else {
    console.log('💻 Nivel: MID (PC estándar)');
    return 'mid';
  }
};

// Variables globales de optimización
let hardwareTier = detectHardwareTier();

// Configurar según nivel de hardware (RESPETANDO TU CONFIGURACIÓN ORIGINAL)
const setupHardwareOptimizations = () => {
  console.log(`🖥️ Nivel de hardware detectado: ${hardwareTier}`);
  
  if (hardwareTier === 'low') {
    window.particleCount = 30; // Manteniendo tu valor original
    window.noiseIntensity = 0.1; // Manteniendo tu valor original
    window.animationQuality = 'low';
    // Mantener efectos pero optimizados (TU CONFIGURACIÓN)
    config.effects = true;
    config.parallaxEnabled = true;
    config.smoothScroll = true;
  } else if (hardwareTier === 'mid') {
    window.particleCount = 60; // Manteniendo tu valor original
    window.noiseIntensity = 0.2; // Manteniendo tu valor original
    window.animationQuality = 'medium';
  } else { // high
    window.particleCount = 120; // Manteniendo tu valor original
    window.noiseIntensity = 0.25; // Manteniendo tu valor original
    window.animationQuality = 'high';
  }
  
  console.log(`🎯 Partículas: ${window.particleCount}`);
  console.log(`🎨 Intensidad noise: ${window.noiseIntensity}`);
};

// ===== ELEMENTOS DEL DOM =====
const scrollElements = document.querySelectorAll('[data-scroll-effect]');
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const sections = document.querySelectorAll('section');

// ===== VARIABLES DE ESTADO =====
let lastScrollY = window.scrollY;
let ticking = false;

// ===== NOISE PRO CANVAS OPTIMIZADO (TU VERSIÓN RESTAURADA) =====
const setupNoisePro = () => {
  const canvas = document.getElementById('noiseCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const scale = hardwareTier === 'low' ? 0.5 : 1.0; // Reducir calidad en hardware bajo
  
  let isVisible = true;
  let lastFrameTime = 0;
  const frameInterval = hardwareTier === 'low' ? 1000 / 10 : 1000 / 20; // 10-20 FPS

  const resize = () => {
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  };

  resize();
  
  // Throttle de resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 250);
  }, { passive: true });

  const generateNoise = (currentTime) => {
    if (!isVisible || currentTime - lastFrameTime < frameInterval) {
      requestAnimationFrame(generateNoise);
      return;
    }
    
    lastFrameTime = currentTime;
    
    // Reducir densidad en hardware bajo
    const density = hardwareTier === 'low' ? 0.02 : 0.05;
    const opacity = hardwareTier === 'low' ? 0.15 : 0.25;
    canvas.style.opacity = opacity;
    
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const buffer32 = new Uint32Array(imageData.data.buffer);
    const len = buffer32.length;

    for (let i = 0; i < len; i++) {
      if (Math.random() < density) {
        const shade = 200 + (Math.random() * 55);
        buffer32[i] = (255 << 24) | (shade << 16) | (shade << 8) | shade;
      } else {
        buffer32[i] = 0xff000000;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(generateNoise);
  };

  // Pausar cuando la página no es visible
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible) {
      requestAnimationFrame(generateNoise);
    }
  });

  generateNoise(0);
  console.log(`🎨 Noise optimizado: ${hardwareTier === 'low' ? '10 FPS' : '20 FPS'}`);
};

// ===== TSPARTICLES CONFIGURATION OPTIMIZADA (TU VERSIÓN RESTAURADA) =====
const initTsParticles = () => {
  if (typeof tsParticles === 'undefined') {
    console.error('tsParticles no cargado');
    return;
  }

  const isMobile = config.isMobile();
  const particleCount = window.particleCount || (isMobile ? 30 : 80);
  
  const particlesConfig = {
    autoPlay: true,
    background: { color: { value: "transparent" }, opacity: 0 },
    fullScreen: { enable: false, zIndex: -2 },
    fpsLimit: hardwareTier === 'low' ? 30 : 60, // FPS según hardware
    interactivity: {
      detectsOn: "window",
      events: {
        onClick: { enable: hardwareTier !== 'low', mode: "push" },
        onHover: { 
          enable: hardwareTier !== 'low',
          mode: "repulse",
          parallax: { enable: false }
        }
      }
    },
    particles: {
      color: { value: ["#FFD600", "#2ECC71", "#E74C3C", "#0B2C4D"] },
      move: {
        enable: true,
        speed: hardwareTier === 'low' ? 0.5 : 2,
        direction: "none",
        outModes: { default: "out" }
      },
      number: {
        value: particleCount,
        density: { enable: true, width: 1920, height: 1080 }
      },
      opacity: {
        value: hardwareTier === 'low' ? 0.4 : 0.7,
        animation: { enable: hardwareTier !== 'low', speed: 2, sync: false }
      },
      size: {
        value: { min: 1, max: hardwareTier === 'low' ? 15 : 30 },
        animation: { enable: hardwareTier !== 'low', speed: 5 }
      },
      shape: {
        close: true,
        fill: true,
        options: {},
        type: "circle"
      },
      links: {
        enable: hardwareTier !== 'low',
        distance: 150,
        opacity: 0.4,
        width: 1
      }
    },
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    smooth: false,
    detectRetina: hardwareTier === 'high'
  };

  tsParticles.load("tsparticles", particlesConfig).then(container => {
    console.log(`✨ tsParticles: ${particleCount} partículas (${hardwareTier})`);
    
    // Pausar cuando no es visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        container.pause();
      } else {
        container.play();
      }
    });
  });
};

// ===== SCROLL STORYTELLING PRO (TU VERSIÓN COMPLETA RESTAURADA) =====
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

  // Configurar Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px -100px 0px',
    threshold: 0.1
  };

  const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const section = entry.target;
      
      if (entry.isIntersecting) {
        // Animar caracteres del texto
        const chars = section.querySelectorAll('.char');
        chars.forEach((char, index) => {
          setTimeout(() => {
            char.style.opacity = '1';
            char.style.transform = 'translateX(0) rotateX(0)';
          }, index * 50);
        });

        // Animar íconos si es la sección 3
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
        // Resetear animaciones
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

  // Control del scroll hint
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
  
  // Mostrar hint después de la intro
  setTimeout(() => {
    scrollHint.style.opacity = '1';
    scrollHint.style.transform = 'translateX(-50%) translateY(0)';
  }, 3000);

  // Ocultar automáticamente después de 10 segundos
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
  console.log('🎬 Scroll Storytelling Pro inicializado');
};

// ===== COUNTDOWN TIMER (TU VERSIÓN RESTAURADA) =====
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
  console.log('⏰ Countdown inicializado');
};

// ===== MICRO-INTERACCIONES (TU VERSIÓN RESTAURADA) =====
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

// ===== MENÚ MÓVIL (TU VERSIÓN RESTAURADA) =====
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

// ===== SCROLL SMOOTH MEJORADO (TU VERSIÓN RESTAURADA) =====
const initSmoothScroll = () => {
  console.log('🔄 Inicializando SmoothScroll...');
  
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

  console.log('✅ SmoothScroll inicializado');
};

// ===== SCROLL EFFECTS (TU VERSIÓN RESTAURADA) =====
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
  
  console.log(`✅ Scroll effects optimizados: ${scrollElements.length} elementos`);
};

// ===== HEADER EFFECT (TU VERSIÓN RESTAURADA) =====
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

// ===== WHATSAPP BUTTON (TU VERSIÓN RESTAURADA) =====
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

// ===== INTRO REMOVAL (TU VERSIÓN RESTAURADA) =====
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

// ===== PARALLAX OPTIMIZADO (TU VERSIÓN COMPLETA RESTAURADA) =====
const initComponentParallax = () => {
  if (!config.effects) {
    console.log('⚠️ Efectos desactivados (reduced-motion)');
    return;
  }
  
  console.log('🌀 Inicializando Parallax Optimizado...');
  
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
      const mobileMultiplier = hardwareTier === 'low' ? 0.3 : 0.7;
      
      if (element.hasAttribute('data-speed')) {
        const translateY = normalizedDistance * 100 * speed * mobileMultiplier;
        const opacity = 1 - Math.abs(normalizedDistance) * 0.3;
        
        element.style.transform = `translate3d(0, ${translateY}px, 0)`;
        element.style.opacity = opacity;
      }
    });
  };
  
  // Mouse parallax solo en desktop y hardware bueno
  if (!config.isMobile() && hardwareTier !== 'low') {
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
  
  console.log(`✅ Parallax optimizado para nivel: ${hardwareTier}`);
};

// ===== SISTEMA DE FONDOS DINÁMICOS (TU VERSIÓN RESTAURADA) =====
const initDynamicBackgrounds = () => {
  const sections = document.querySelectorAll('.parallax-section');
  
  sections.forEach((section) => {
    const background = section.querySelector('.section-background');
    
    if (!background) return;
    
    // Solo añadir capas extras en hardware bueno
    if (hardwareTier !== 'low') {
      const layer3 = document.createElement('div');
      layer3.className = 'gradient-layer-3';
      background.appendChild(layer3);
      
      const layer4 = document.createElement('div');
      layer4.className = 'gradient-layer-4';
      background.appendChild(layer4);
    }
    
    // Efecto de interacción solo en desktop
    if (!config.isMobile() && hardwareTier !== 'low') {
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
  
  console.log('🎨 Fondos dinámicos inicializados');
};

// ===== SISTEMA DE NOTIFICACIONES INTELIGENTE (TU VERSIÓN RESTAURADA) =====
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
      type: 'always',
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
        duration: 6000
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
};

// ===== SISTEMA DE BLOQUEO DE SCROLL PARA SPLINE (TU VERSIÓN RESTAURADA) =====
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

// ===== OPTIMIZACIÓN SPLINE (ACTUALIZADA CON SCROLL LOCK - TU VERSIÓN) =====
const optimizeSpline = () => {
  const splineViewer = document.querySelector('spline-viewer');
  if (!splineViewer) return;
  
  const isMobile = config.isMobile();
  
  // Configurar atributos dinámicamente
  splineViewer.setAttribute('render-mode', hardwareTier === 'low' ? 'performance' : 'quality');
  splineViewer.setAttribute('interaction-enabled', 'true');
  splineViewer.setAttribute('quality', hardwareTier === 'low' ? 'low' : 'high');
  
  // Añadir atributos para mejor control táctil
  if (isMobile) {
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
  
  // Inicializar sistema de bloqueo de scroll
  initSplineScrollLock();
  
  console.log(`🎮 Spline optimizado: modo ${hardwareTier === 'low' ? 'performance' : 'calidad'} + scroll lock`);
};

// ===== THROTTLING INTELIGENTE (TU VERSIÓN RESTAURADA) =====
const createThrottledListener = (event, callback, interval = 100) => {
  let lastCall = 0;
  let timeout;
  
  return function(...args) {
    const now = Date.now();
    const remaining = interval - (now - lastCall);
    
    if (remaining <= 0) {
      lastCall = now;
      callback.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastCall = Date.now();
        timeout = null;
        callback.apply(this, args);
      }, remaining);
    }
  };
};

// ===== LAZY LOADING INTELIGENTE (TU VERSIÓN RESTAURADA) =====
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
    rootMargin: hardwareTier === 'low' ? '100px 0px' : '200px 0px',
    threshold: 0.01
  });
  
  lazyElements.forEach(el => lazyObserver.observe(el));
  console.log(`🔄 Lazy loading: ${lazyElements.length} elementos`);
};

// ===== AJUSTES DINÁMICOS DE PERFORMANCE (TU VERSIÓN RESTAURADA) =====
const adjustEffectsForPerformance = () => {
  const particlesContainer = tsParticles.domItem(0);
  if (particlesContainer) {
    particlesContainer.options.particles.number.value = Math.floor(
      particlesContainer.options.particles.number.value * 0.7
    );
    particlesContainer.refresh();
    console.log(`🔄 Partículas reducidas a: ${particlesContainer.options.particles.number.value}`);
  }
  
  const noiseCanvas = document.getElementById('noiseCanvas');
  if (noiseCanvas) {
    const currentOpacity = parseFloat(noiseCanvas.style.opacity || 0.25);
    noiseCanvas.style.opacity = Math.max(0.05, currentOpacity * 0.7);
  }
};

// ===== MEDICIÓN DE PERFORMANCE (TU VERSIÓN RESTAURADA) =====
const measurePerformance = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`📊 Performance: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
        
        if (entry.duration > 50 && hardwareTier === 'low') {
          console.log('⚠️ Performance baja, ajustando efectos...');
          adjustEffectsForPerformance();
        }
      });
    });
    
    observer.observe({ entryTypes: ['longtask'] });
  }
};

// ===== VENTANAS DE PRODUCTOS (TU VERSIÓN COMPLETA RESTAURADA) =====
const initProductModals = () => {
  console.log('🛒 Inicializando ventanas de productos...');
  
  // Base de datos simple de productos
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

  // Función para crear un slide
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

  // Función para crear indicador
  const createIndicator = (index) => {
    const indicator = document.createElement('div');
    indicator.className = `gallery-dot ${index === 0 ? 'active' : ''}`;
    indicator.dataset.index = index;
    
    indicator.addEventListener('click', () => {
      goToSlide(index);
    });
    
    return indicator;
  };

  // Función para mostrar un slide específico
  const goToSlide = (index) => {
    // Validar índice
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    // Ocultar slide actual
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Mostrar nuevo slide
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    
    currentSlideIndex = index;
  };

  // Función para mostrar la modal
  const showModal = (productKey) => {
    const product = productDatabase[productKey];
    if (!product) return;
    
    currentProduct = product;
    currentSlideIndex = 0;
    
    // Actualizar información del producto
    modalTitle.textContent = product.title;
    modalCategory.textContent = product.category;
    modalDescription.textContent = product.description;
    modalPrice.textContent = product.price;
    
    // Actualizar características
    modalFeaturesList.innerHTML = '';
    product.features.forEach(feature => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="feature-icon">✓</span> ${feature}`;
      modalFeaturesList.appendChild(li);
    });
    
    // Crear galería
    gallery.innerHTML = '';
    slides = [];
    indicators = [];
    
    // Crear slides
    product.images.forEach((image, index) => {
      const slide = createSlide(image, index);
      gallery.appendChild(slide);
      slides.push(slide);
    });
    
    // Crear indicadores
    galleryIndicators.innerHTML = '';
    product.images.forEach((_, index) => {
      const indicator = createIndicator(index);
      galleryIndicators.appendChild(indicator);
      indicators.push(indicator);
    });
    
    // Añadir botones de navegación
    if (!prevSlideBtn.parentElement) gallery.appendChild(prevSlideBtn);
    if (!nextSlideBtn.parentElement) gallery.appendChild(nextSlideBtn);
    
    // Mostrar modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    // Forzar reflow para animación
    modalOverlay.offsetHeight;
    
    console.log(`🛒 Mostrando producto: ${product.title}`);
    
    // Ajustar para móvil
    if (config.isMobile()) {
      setTimeout(() => {
        const infoContainer = document.querySelector('.product-info');
        if (infoContainer) {
          infoContainer.scrollTop = 0;
        }
      }, 100);
    }
  };

  // Función para ocultar la modal
  const hideModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    
    // Resetear galería
    setTimeout(() => {
      slides = [];
      indicators = [];
    }, 300);
    
    console.log('🛒 Modal cerrada');
  };

  // Función para navegar al slide anterior
  const prevSlide = () => {
    goToSlide(currentSlideIndex - 1);
  };

  // Función para navegar al siguiente slide
  const nextSlide = () => {
    goToSlide(currentSlideIndex + 1);
  };

  // Asignar eventos a los botones "Ver productos"
  document.querySelectorAll('.card-link').forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Determinar qué producto mostrar basado en la tarjeta
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

  // Eventos de la modal
  modalClose.addEventListener('click', hideModal);
  modalCloseBtn.addEventListener('click', hideModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      hideModal();
    }
  });

  // Eventos de navegación de galería
  prevSlideBtn.addEventListener('click', prevSlide);
  nextSlideBtn.addEventListener('click', nextSlide);

  // Navegación con teclado
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

  // Navegación táctil para móvil
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
        // Swipe izquierda - siguiente slide
        nextSlide();
      } else {
        // Swipe derecha - slide anterior
        prevSlide();
      }
    }
  };

  console.log('✅ Sistema de ventanas de productos inicializado');
};

// ===== INICIALIZACIÓN PRINCIPAL (TU VERSIÓN RESTAURADA) =====
const init = () => {
  console.log(`🚀 Iniciando Merke+ - Hardware: ${hardwareTier}`);
  
  // Configurar optimizaciones de hardware
  setupHardwareOptimizations();
  
  // Inicializar sistemas básicos inmediatamente
  initMobileMenu();
  initSmartLazyLoad();
  initSmartNotifications();
  initProductModals();
  
  // Inicializar efectos después de que todo cargue
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
      console.log('✅ Sistema optimizado cargado correctamente');
      
      measurePerformance();
    }, 500);
  });
  
  // Event listeners optimizados
  window.addEventListener('scroll', createThrottledListener('scroll', handleScroll, hardwareTier === 'low' ? 100 : 50), { passive: true });
  window.addEventListener('resize', createThrottledListener('resize', updateHeader, 250), { passive: true });
  
  updateHeader();
};

// ===== EJECUCIÓN =====
// Inicializar inmediatamente
init();

// Fallback en caso de que falle la carga
setTimeout(() => {
  if (!document.body.classList.contains('loaded')) {
    console.log('⚠️ Usando fallback de inicialización');
    init();
  }
}, 2000);

// ===== DEBUG HELPER (TU VERSIÓN RESTAURADA) =====
window.debugMerke = {
  reloadEffects: () => {
    document.body.classList.remove('loaded');
    setTimeout(init, 100);
  },
  adjustNoiseIntensity: (intensity) => {
    const canvas = document.getElementById('noiseCanvas');
    if (canvas) {
      canvas.style.opacity = intensity;
      console.log('🎨 Intensidad del noise ajustada a:', intensity);
    }
  },
  getHardwareInfo: () => {
    return {
      tier: hardwareTier,
      isMobile: config.isMobile(),
      memory: navigator.deviceMemory,
      cores: navigator.hardwareConcurrency,
      gpu: detectGPU()
    };
  }
};