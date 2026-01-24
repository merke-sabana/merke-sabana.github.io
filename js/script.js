// ===== FUNCIÓN isMobile ÚNICA (ELIMINA LA DUPLICADA) =====
const isMobileDevice = () => {
  return window.innerWidth <= 768 || 
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// ===== CONFIGURACIÓN ADAPTATIVA (USAR LA FUNCIÓN ÚNICA) =====
const config = {
  // Activar efectos siempre, pero con diferente intensidad
  effects: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  smoothScroll: true,
  
  // Intensidad basada en dispositivo
  parallaxIntensity: isMobileDevice() ? 0.15 : 0.3,
  scrollIntensity: isMobileDevice() ? 0.8 : 1.0,
  
  // Umbrales para móvil (más sensibles)
  scrollThreshold: isMobileDevice() ? 0.05 : 0.1,
  scrollMargin: isMobileDevice() ? '100px' : '50px',
  
  // Parallax config
  maxParallax: isMobileDevice() ? 80 : 150,
  minScrollDelta: 1
};

// ===== ELEMENTOS =====
const parallaxElements = document.querySelectorAll('[data-speed]:not([data-disable-parallax="true"])');
const scrollElements = document.querySelectorAll('[data-scroll-effect]');
const parallaxLayers = document.querySelectorAll('.parallax-layer');
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// ===== VARIABLES DE ESTADO =====
let lastScrollY = window.scrollY;
let ticking = false;
let currentIsMobile = isMobileDevice(); // Usar variable con nombre diferente

// ===== NUEVAS FUNCIONALIDADES =====

// Sistema de sonidos (muy sutiles)
class SoundSystem {
  constructor() {
    this.enabled = false;
    this.audioContext = null;
    this.init();
  }
  
  init() {
    // Solo habilitar si el usuario no tiene reduced-motion
    this.enabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (this.enabled) {
      document.body.classList.add('sound-enabled');
      this.setupAudioContext();
      this.setupInteractionSounds();
    }
  }
  
  setupAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('AudioContext no soportado:', e);
      this.enabled = false;
    }
  }
  
  setupInteractionSounds() {
    // Crear sonidos para diferentes interacciones
    this.sounds = {
      click: this.createClickSound(),
      hover: this.createHoverSound(),
      success: this.createSuccessSound()
    };
  }
  
  createClickSound() {
    if (!this.audioContext) return null;
    
    return () => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    };
  }
  
  createHoverSound() {
    if (!this.audioContext) return null;
    
    return () => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = 600;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    };
  }
  
  createSuccessSound() {
    if (!this.audioContext) return null;
    
    return () => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // Do
      oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // Mi
      oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // Sol
      
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    };
  }
  
  play(soundName) {
    if (!this.enabled || !this.sounds[soundName]) return;
    
    try {
      // Reanudar AudioContext si está suspendido (requerido por Chrome)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      this.sounds[soundName]();
    } catch (e) {
      console.log('Error reproduciendo sonido:', e);
    }
  }
}

// Sistema de Scroll Storytelling
class StoryTellingSystem {
  constructor() {
    this.steps = document.querySelectorAll('.story-step');
    this.storySection = document.getElementById('scroll-story');
    this.currentStep = 0;
    this.isActive = false;
    this.storyPositions = [];
    this.init();
  }
  
  init() {
    if (!this.steps.length) return;
    
    this.calculateStoryPositions();
    this.setupScrollListener();
  }
  
  calculateStoryPositions() {
    // Calcular posiciones en el scroll para cada paso
    const sections = document.querySelectorAll('.parallax-section');
    this.storyPositions = [
      window.innerHeight * 1.5, // Después del hero
      window.innerHeight * 3,   // Después de nosotros
      window.innerHeight * 4.5, // Después de productos
      window.innerHeight * 6    // Después de ofertas
    ];
  }
  
  setupScrollListener() {
    let ticking = false;
    
    const updateStory = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Mostrar/ocultar sección de storytelling
      const shouldShow = scrollY > viewportHeight && scrollY < viewportHeight * 7;
      
      if (shouldShow !== this.isActive) {
        this.isActive = shouldShow;
        this.storySection.style.opacity = shouldShow ? '1' : '0';
      }
      
      if (!this.isActive) return;
      
      // Determinar qué paso mostrar
      let activeStep = 0;
      
      for (let i = 0; i < this.storyPositions.length; i++) {
        if (scrollY > this.storyPositions[i]) {
          activeStep = i + 1;
        }
      }
      
      if (activeStep !== this.currentStep) {
        this.currentStep = activeStep;
        this.updateSteps();
      }
      
      // Efecto de parallax en los textos
      const parallaxOffset = scrollY * -0.1;
      this.storySection.style.transform = `translateY(${parallaxOffset}px)`;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateStory();
          ticking = false;
        });
      }
    });
  }
  
  updateSteps() {
    this.steps.forEach((step, index) => {
      if (index === this.currentStep) {
        step.classList.add('active');
        step.classList.remove('inactive');
      } else if (index < this.currentStep) {
        step.classList.remove('active');
        step.classList.add('inactive');
      } else {
        step.classList.remove('active', 'inactive');
        step.style.opacity = '0';
      }
    });
  }
}

// Sistema de partículas sutiles
class SubtleParticlesSystem {
  constructor() {
    this.container = null;
    this.particles = [];
    this.maxParticles = 20;
    this.init();
  }
  
  init() {
    // Crear contenedor de partículas
    this.container = document.createElement('div');
    this.container.id = 'subtle-particles';
    document.body.appendChild(this.container);
    
    // Crear partículas
    this.createParticles();
    
    // Iniciar animación
    this.animate();
  }
  
  createParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle-dot';
      
      // Tamaño aleatorio muy pequeño
      const size = Math.random() * 2 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Posición inicial aleatoria
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Color aleatorio (muy sutiles)
      const colors = [
        'rgba(255, 214, 0, 0.1)',
        'rgba(46, 204, 113, 0.1)',
        'rgba(231, 76, 60, 0.1)'
      ];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      // Animación personalizada
      const duration = Math.random() * 30 + 20;
      const delay = Math.random() * 5;
      particle.style.animation = `floatSubtle ${duration}s linear ${delay}s infinite`;
      
      this.container.appendChild(particle);
      this.particles.push({
        element: particle,
        speed: Math.random() * 0.5 + 0.5
      });
    }
  }
  
  animate() {
    // Las partículas ya están animadas con CSS
    // Este método es para actualizaciones futuras si se necesitan
  }
}

// Countdown para ofertas
class CountdownTimer {
  constructor() {
    this.element = document.getElementById('countdown');
    if (!this.element) return;
    
    this.endTime = new Date();
    this.endTime.setHours(this.endTime.getHours() + 24); // 24 horas desde ahora
    
    this.init();
  }
  
  init() {
    this.update();
    setInterval(() => this.update(), 1000);
  }
  
  update() {
    const now = new Date();
    const timeLeft = this.endTime - now;
    
    if (timeLeft <= 0) {
      this.element.textContent = '00:00:00';
      this.onTimerEnd();
      return;
    }
    
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    this.element.textContent = 
      `${hours.toString().padStart(2, '0')}:` +
      `${minutes.toString().padStart(2, '0')}:` +
      `${seconds.toString().padStart(2, '0')}`;
    
    // Efecto visual cuando quedan menos de 10 minutos
    if (timeLeft < 10 * 60 * 1000) {
      this.element.style.color = 'var(--red)';
      this.element.style.animation = 'pulseBadge 1s infinite';
    }
  }
  
  onTimerEnd() {
    // Resetear el timer para otro día
    this.endTime.setHours(this.endTime.getHours() + 24);
    
    // Efecto visual
    this.element.style.color = 'var(--green)';
    this.element.style.animation = 'none';
    
    // Notificar al usuario (sutilmente)
    setTimeout(() => {
      this.element.textContent = '¡Renovado!';
      setTimeout(() => this.update(), 3000);
    }, 1000);
  }
}

// Sistema de vibración para móviles
class VibrationSystem {
  constructor() {
    this.enabled = 'vibrate' in navigator;
  }
  
  vibrate(pattern = 10) {
    if (!this.enabled) return;
    
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      console.log('Vibration no disponible:', e);
    }
  }
  
  // Vibración para diferentes acciones
  click() {
    this.vibrate(10);
  }
  
  success() {
    this.vibrate([50, 30, 50]);
  }
  
  error() {
    this.vibrate([100, 50, 100]);
  }
}

// ===== INTEGRACIÓN CON TU CÓDIGO EXISTENTE =====

// En tu función init(), agrega esto:
const initEnhancedFeatures = () => {
  console.log('🎮 Inicializando características mejoradas...');
  
  // Inicializar sistemas
  const soundSystem = new SoundSystem();
  const storySystem = new StoryTellingSystem();
  const particlesSystem = new SubtleParticlesSystem();
  const countdownTimer = new CountdownTimer();
  const vibrationSystem = new VibrationSystem();
  
  // Configurar micro-interacciones
  setupMicroInteractions(soundSystem, vibrationSystem);
  
  // Guardar referencias para debugging
  window.enhancedFeatures = {
    sound: soundSystem,
    story: storySystem,
    particles: particlesSystem,
    timer: countdownTimer,
    vibration: vibrationSystem
  };
  
  console.log('✅ Características mejoradas listas');
};

const setupMicroInteractions = (soundSystem, vibrationSystem) => {
  // Botones con sonido y vibración
  document.querySelectorAll('.hero-btn, .offer-btn, .contact-link, .card-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (soundSystem.enabled && btn.hasAttribute('data-sound')) {
        soundSystem.play('click');
      }
      
      if (vibrationSystem.enabled) {
        vibrationSystem.click();
      }
      
      // Efecto visual de ripple
      createRippleEffect(e, btn);
      
      // Efecto de click visual
      btn.classList.add('vibrate');
      setTimeout(() => btn.classList.remove('vibrate'), 300);
    });
    
    // Sonido de hover (solo desktop)
    if (!currentIsMobile) {
      btn.addEventListener('mouseenter', () => {
        if (soundSystem.enabled) {
          soundSystem.play('hover');
        }
      });
    }
  });
  
  // Efecto de hover en cards
  document.querySelectorAll('.card, .feature, .contact-card, .offer-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (soundSystem.enabled && !currentIsMobile) {
        soundSystem.play('hover');
      }
    });
    
    // Feedback táctil en móvil
    if (currentIsMobile) {
      card.addEventListener('touchstart', () => {
        card.style.transform = 'scale(0.98)';
      }, { passive: true });
      
      card.addEventListener('touchend', () => {
        card.style.transform = '';
      }, { passive: true });
    }
  });
};

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
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
};

// ===== INICIALIZACIÓN ORIGINAL =====
const init = () => {
  console.log('🚀 Iniciando sistema de animaciones...');
  console.log('📱 Dispositivo:', currentIsMobile ? 'Móvil' : 'Desktop');
  console.log('⚡ Efectos activados:', config.effects);
  
  // Configurar header inicial
  updateHeader();
  
  // Configurar menú móvil
  initMobileMenu();
  
  // Inicializar scroll suave
  if (config.smoothScroll) initSmoothScroll();
  
  // Configurar efectos de scroll
  initScrollEffects();
  
  // Inicializar parallax si no es móvil
  if (!currentIsMobile && config.effects) {
    initParallax();
  }
  
  // Configurar scroll handler
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Configurar resize handler
  window.addEventListener('resize', handleResize);
  
  // Forzar primera actualización
  requestAnimationFrame(() => {
    updateHeader();
    if (!currentIsMobile) updateParallax();
  });
  
  // Inicializar características mejoradas (NUEVO)
  setTimeout(() => {
    initEnhancedFeatures();
  }, 1000);
  
  // Marcar como cargado
  setTimeout(() => {
    document.body.classList.add('loaded');
    console.log('✅ Sistema cargado correctamente');
  }, 500);
};

// ===== FUNCIONES ORIGINALES (ACTUALIZADAS) =====

const initMobileMenu = () => {
  console.log('🍔 Inicializando menú móvil...');
  
  if (!menuToggle || !navMenu) {
    console.error('❌ No se encontraron elementos del menú');
    return;
  }

  // Mostrar el toggle en móvil
  if (currentIsMobile) {
    menuToggle.style.display = 'flex';
  }

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = !navMenu.classList.contains('active');
    
    // Alternar clases
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive);
    
    // Bloquear scroll cuando el menú está abierto
    if (isActive) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    console.log('🍔 Menú:', isActive ? 'Abierto' : 'Cerrado');
  });

  // Cerrar menú al hacer clic en enlace
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });
};

const closeMobileMenu = () => {
  navMenu.classList.remove('active');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
};

const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      
      // Cerrar menú si está abierto
      if (navMenu && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }

      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = targetPosition - headerHeight - 20;

      smoothScrollTo(offsetPosition, 800);
    });
  });
};

const smoothScrollTo = (to, duration) => {
  const start = window.pageYOffset;
  const change = to - start;
  let startTime = null;

  const animateScroll = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // Easing function mejorada
    const ease = easeOutCubic(progress);
    
    window.scrollTo(0, start + (change * ease));
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

const easeOutCubic = (t) => {
  return 1 - Math.pow(1 - t, 3);
};

const initScrollEffects = () => {
  if (!config.effects || scrollElements.length === 0) {
    console.log('⚠️ Efectos desactivados o no hay elementos');
    return;
  }

  console.log('🎯 Inicializando efectos de scroll para', scrollElements.length, 'elementos');
  
  // Configurar Intersection Observer con ajustes para móvil
  const observerOptions = {
    root: null,
    rootMargin: config.scrollMargin,
    threshold: buildThresholdList()
  };

  // Crear múltiples thresholds para detección más sensible
  function buildThresholdList() {
    const thresholds = [];
    const numSteps = currentIsMobile ? 40 : 20; // Más steps en móvil para mayor sensibilidad
    
    for (let i = 0; i <= numSteps; i++) {
      thresholds.push(i / numSteps);
    }
    
    return thresholds;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const element = entry.target;
        const isIntersecting = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;
        
        // En móvil, usar un threshold más bajo
        const shouldShow = currentIsMobile 
          ? intersectionRatio > config.scrollThreshold
          : isIntersecting;
        
        if (shouldShow) {
          // Aplicar efecto con delay si existe
          const delay = parseInt(element.getAttribute('data-delay')) || 0;
          
          setTimeout(() => {
            element.classList.add('active');
            
            // Efecto de profundidad basado en scroll position
            applyScrollDepth(element, entry);
            
            // Manejar stagger effects
            if (element.getAttribute('data-scroll-effect') === 'stagger') {
              element.querySelectorAll('[data-scroll-effect]').forEach((child, index) => {
                const childDelay = parseInt(child.getAttribute('data-delay')) || (index * 150);
                setTimeout(() => {
                  child.classList.add('active');
                }, childDelay);
              });
            }
          }, delay);
        }
      });
    },
    observerOptions
  );

  // Observar todos los elementos con efectos
  scrollElements.forEach(el => {
    observer.observe(el);
  });

  // También observar elementos con data-speed para parallax en móvil
  if (currentIsMobile && config.effects) {
    parallaxElements.forEach(el => {
      observer.observe(el);
    });
  }
};

// Aplicar efecto de profundidad basado en posición de scroll
const applyScrollDepth = (element, entry) => {
  if (!element.hasAttribute('data-depth')) return;
  
  const depth = parseFloat(element.getAttribute('data-depth')) || 1;
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const elementCenter = rect.top + rect.height / 2;
  const viewportCenter = viewportHeight / 2;
  
  // Calcular distancia del centro
  const distanceFromCenter = Math.abs(elementCenter - viewportCenter) / viewportCenter;
  const depthFactor = 1 - Math.min(distanceFromCenter, 1);
  
  // Aplicar transformación 3D
  const translateZ = depthFactor * depth * 20;
  element.style.transform = `translateY(0) translateZ(${translateZ}px)`;
  element.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
};

// ===== PARALLAX SYSTEM (SOLO DESKTOP) =====
const initParallax = () => {
  console.log('🌊 Inicializando sistema parallax para desktop');
  
  // Iniciar loop de animación
  requestAnimationFrame(updateParallax);
};

const updateParallax = () => {
  if (currentIsMobile || !config.effects || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const scrollY = window.scrollY;
  const scrollDelta = Math.abs(scrollY - lastScrollY);
  
  if (scrollDelta < config.minScrollDelta) {
    requestAnimationFrame(updateParallax);
    return;
  }

  // Capas de fondo
  parallaxLayers.forEach((layer) => {
    const depth = parseFloat(layer.getAttribute('data-depth')) || 0.1;
    const speed = depth * config.parallaxIntensity;
    const yOffset = scrollY * speed;
    
    layer.style.transform = `translate3d(0, ${yOffset}px, 0)`;
    layer.style.transition = 'transform 0.1s linear';
  });

  // Elementos individuales
  parallaxElements.forEach(element => {
    if (element.closest('[data-disable-parallax="true"]')) return;

    const rect = element.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
      const speed = parseFloat(element.getAttribute('data-speed')) || 0;
      const yOffset = -(scrollY * speed * config.parallaxIntensity);
      
      // Limitar movimiento
      if (Math.abs(yOffset) < config.maxParallax) {
        element.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        element.style.transition = 'transform 0.1s ease-out';
      }
    }
  });

  lastScrollY = scrollY;
  requestAnimationFrame(updateParallax);
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

// ===== SCROLL HANDLER PARA EFECTOS EN MÓVIL =====
const handleScroll = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      updateHeader();
      
      // En móvil, actualizar efectos basados en scroll position
      if (currentIsMobile && config.effects) {
        updateMobileScrollEffects();
      }
      
      ticking = false;
    });
  }
};

// Efectos de scroll dinámicos para móvil
const updateMobileScrollEffects = () => {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  
  scrollElements.forEach(element => {
    if (!element.classList.contains('active')) return;
    
    const rect = element.getBoundingClientRect();
    const elementTop = rect.top;
    const elementHeight = rect.height;
    const elementCenter = elementTop + elementHeight / 2;
    
    // Calcular qué tan centrado está el elemento
    const distanceFromCenter = Math.abs(viewportHeight / 2 - elementCenter);
    const visibility = 1 - (distanceFromCenter / (viewportHeight / 2));
    
    // Aplicar efectos basados en posición
    applyScrollEffect(element, visibility);
  });
};

const applyScrollEffect = (element, visibility) => {
  const effectType = element.getAttribute('data-scroll-effect');
  
  if (!effectType) return;
  
  switch(effectType) {
    case 'fade-up':
    case 'slide-up':
      element.style.opacity = Math.max(0.3, visibility);
      element.style.transform = `translateY(${(1 - visibility) * 30}px)`;
      break;
      
    case 'scale':
      const scale = 0.9 + (visibility * 0.1);
      element.style.transform = `scale(${scale})`;
      break;
      
    case 'pop':
      const popScale = 0.95 + (visibility * 0.05);
      element.style.transform = `scale(${popScale})`;
      break;
  }
};

// ===== RESIZE HANDLER =====
let resizeTimeout;
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const newIsMobile = isMobileDevice();
    
    if (newIsMobile !== currentIsMobile) {
      currentIsMobile = newIsMobile;
      console.log('📱 Cambio de dispositivo:', currentIsMobile ? 'Móvil' : 'Desktop');
      
      // Reiniciar efectos con nueva configuración
      config.parallaxIntensity = currentIsMobile ? 0.15 : 0.3;
      config.scrollThreshold = currentIsMobile ? 0.05 : 0.1;
      
      // Mostrar/ocultar menú toggle
      if (menuToggle) {
        menuToggle.style.display = currentIsMobile ? 'flex' : 'none';
      }
      
      // Resetear transforms
      parallaxElements.forEach(el => {
        el.style.transform = '';
        el.style.transition = '';
      });
      
      parallaxLayers.forEach(layer => {
        layer.style.transform = '';
        layer.style.transition = '';
      });
    }
  }, 250);
};

// ===== WHATSAPP BUTTON =====
const initWhatsAppButton = () => {
  const whatsappBtn = document.querySelector('.whatsapp-float');
  if (!whatsappBtn) return;

  // Animación de entrada
  setTimeout(() => {
    whatsappBtn.style.opacity = '1';
    whatsappBtn.style.transform = 'translateY(0) scale(1)';
    whatsappBtn.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }, 2000);

  // Efecto de pulso (solo si no hay reduced motion)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let pulseInterval = setInterval(() => {
      if (!document.hidden) {
        whatsappBtn.classList.toggle('pulse');
      }
    }, 3000);
    
    // Limpiar intervalo si se desactivan efectos
    if (!config.effects) {
      clearInterval(pulseInterval);
    }
  }
};

// ===== EVENT LISTENERS =====
window.addEventListener('load', () => {
  init();
  initWhatsAppButton();
  
  // Fallback para asegurar inicialización
  setTimeout(() => {
    if (!document.body.classList.contains('loaded')) {
      console.log('⚠️ Usando fallback de inicialización');
      init();
    }
  }, 2000);
});

// ===== DEBUG HELPER =====
window.debugEffects = {
  getConfig: () => config,
  getElements: () => ({
    scrollElements: scrollElements.length,
    parallaxElements: parallaxElements.length,
    isMobile: currentIsMobile,
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }),
  showVisibleElements: () => {
    const visible = Array.from(scrollElements).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    console.log('👀 Elementos visibles:', visible.length);
    return visible;
  },
  reinit: init
};