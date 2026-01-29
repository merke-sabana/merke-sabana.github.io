// ===== CONFIGURACIÓN ADAPTATIVA =====
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

// ===== ELEMENTOS =====
const scrollElements = document.querySelectorAll('[data-scroll-effect]');
const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const sections = document.querySelectorAll('section');

// ===== VARIABLES DE ESTADO =====
let lastScrollY = window.scrollY;
let ticking = false;

// ===== NOISE PRO CANVAS =====
const setupNoisePro = () => {
  const canvas = document.getElementById('noiseCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let wWidth, wHeight;
  
  const resize = () => {
    wWidth = window.innerWidth;
    wHeight = window.innerHeight;
    canvas.width = wWidth;
    canvas.height = wHeight;
  };

  window.addEventListener('resize', resize);
  resize();

  const noise = () => {
    const idata = ctx.createImageData(wWidth, wHeight);
    const buffer32 = new Uint32Array(idata.data.buffer);
    const len = buffer32.length;

    for (let i = 0; i < len; i++) {
      const x = i % wWidth;
      const y = Math.floor(i / wWidth);
      const intensity = 0.02 + (Math.sin(x * 0.01) * Math.sin(y * 0.01) * 0.01);
      
      if (Math.random() < intensity) {
        const shade = Math.floor(Math.random() * 100) + 155;
        buffer32[i] = (255 << 24) | (shade << 16) | (shade << 8) | shade;
      } else {
        buffer32[i] = 0xff000000;
      }
    }

    ctx.putImageData(idata, 0, 0);
    requestAnimationFrame(noise);
  };

  noise();
  console.log('🎨 Noise Pro Canvas inicializado');
};

// ===== TSPARTICLES CONFIGURATION =====
const initTsParticles = () => {
  if (typeof tsParticles === 'undefined') {
    console.error('tsParticles no cargado');
    return;
  }

  const particlesConfig = {
    "autoPlay": true,
    "background": {
      "color": {
        "value": "transparent"
      },
      "opacity": 0
    },
    "backgroundMask": {
      "composite": "destination-out",
      "cover": {
        "opacity": 1,
        "color": {
          "value": {
            "r": 255,
            "g": 255,
            "b": 255
          }
        }
      },
      "enable": true
    },
    "clear": true,
    "fullScreen": {
      "enable": false,
      "zIndex": -2
    },
    "detectRetina": true,
    "duration": 0,
    "fpsLimit": 120,
    "interactivity": {
      "detectsOn": "window",
      "events": {
        "onClick": {
          "enable": true,
          "mode": "push"
        },
        "onHover": {
          "enable": true,
          "mode": "bubble",
          "parallax": {
            "enable": false,
            "force": 2,
            "smooth": 10
          }
        },
        "resize": {
          "delay": 0.5,
          "enable": true
        }
      },
      "modes": {
        "bubble": {
          "distance": 400,
          "duration": 2,
          "mix": false,
          "opacity": 1,
          "size": 100
        },
        "push": {
          "default": true,
          "groups": [],
          "quantity": 4
        }
      }
    },
    "particles": {
      "color": {
        "value": ["#FFD600", "#2ECC71", "#E74C3C", "#0B2C4D"]
      },
      "move": {
        "angle": {
          "offset": 0,
          "value": 90
        },
        "enable": true,
        "speed": 2,
        "direction": "none",
        "outModes": {
          "default": "out"
        }
      },
      "number": {
        "density": {
          "enable": true,
          "width": 1920,
          "height": 1080
        },
        "value": 120
      },
      "opacity": {
        "value": 0.7,
        "animation": {
          "enable": true,
          "speed": 2,
          "minimumValue": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": {
          "min": 1,
          "max": 30
        },
        "animation": {
          "enable": true,
          "speed": 5
        }
      },
      "shape": {
        "close": true,
        "fill": true,
        "options": {},
        "type": "circle"
      },
      "links": {
        "blink": false,
        "color": {
          "value": "#ffffff"
        },
        "consent": false,
        "distance": 150,
        "enable": true,
        "frequency": 1,
        "opacity": 0.4,
        "width": 1
      }
    },
    "pauseOnBlur": true,
    "pauseOnOutsideViewport": true,
    "responsive": [],
    "smooth": false,
    "style": {},
    "themes": [],
    "zLayers": 100
  };

  tsParticles.load("tsparticles", particlesConfig).then(container => {
    console.log('✨ tsParticles inicializadas con éxito');
    
    container.options.particles.move.enable = true;
    container.options.particles.number.value = 120;
    container.refresh();
  });
};

// ===== SCROLL STORYTELLING PRO - SISTEMA AVANZADO =====
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

  // Configurar Intersection Observer para animaciones
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
            if (storyWithIcons) {
              storyWithIcons.classList.add('active');
            }
            if (storyIconsGrid) {
              storyIconsGrid.classList.add('active');
            }
            
            iconItems.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('active');
              }, index * 100);
            });
          }, 500);
        }
      } else {
        // Resetear animaciones al salir
        const chars = section.querySelectorAll('.char');
        chars.forEach(char => {
          char.style.opacity = '0';
          char.style.transform = 'translateX(calc(var(--distance) * 60px)) rotateX(calc(var(--distance) * 30deg))';
        });

        // Resetear íconos
        if (section.id === 'story-section-3') {
          if (storyWithIcons) storyWithIcons.classList.remove('active');
          if (storyIconsGrid) storyIconsGrid.classList.remove('active');
          iconItems.forEach(item => item.classList.remove('active'));
        }
      }
    });
  }, observerOptions);

  // Observar cada sección
  storySections.forEach(section => {
    storyObserver.observe(section);
  });

  // ===== CONTROL MEJORADO DEL SCROLL HINT (FIXED) =====
  const updateScrollHint = () => {
    const scrollY = window.scrollY;
    const heroHeight = document.getElementById('hero')?.offsetHeight || 0;
    const heroSection = document.getElementById('hero');
    
    if (!heroSection) return;
    
    const heroRect = heroSection.getBoundingClientRect();
    const heroBottom = heroRect.bottom;
    const heroTop = heroRect.top;
    
    // Mostrar solo cuando el hero está visible en pantalla
    if (heroBottom > 100 && heroTop < window.innerHeight - 100) {
      // Hero visible - mostrar hint con animación
      scrollHint.style.opacity = '1';
      scrollHint.style.transform = 'translateX(-50%) translateY(0)';
      scrollHint.style.pointerEvents = 'auto';
    } else {
      // Hero no visible - ocultar hint con animación
      scrollHint.style.opacity = '0';
      scrollHint.style.transform = 'translateX(-50%) translateY(20px)';
      scrollHint.style.pointerEvents = 'none';
    }
  };

  // Configurar transiciones iniciales
  scrollHint.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
  
  // Mostrar hint inicialmente
  setTimeout(() => {
    scrollHint.style.opacity = '1';
    scrollHint.style.transform = 'translateX(-50%) translateY(0)';
  }, 3000); // Después de la intro

  // Ocultar automáticamente después de 10 segundos si el usuario no ha hecho scroll
  let hideTimeout = setTimeout(() => {
    const scrollY = window.scrollY;
    if (scrollY < 50) { // Solo si no ha hecho scroll
      scrollHint.style.opacity = '0';
      scrollHint.style.transform = 'translateX(-50%) translateY(20px)';
    }
  }, 10000);

  // Resetear timeout cuando hay interacción
  const resetHideTimeout = () => {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      const scrollY = window.scrollY;
      if (scrollY < 50) {
        scrollHint.style.opacity = '0';
        scrollHint.style.transform = 'translateX(-50%) translateY(20px)';
      }
    }, 10000);
  };

  // Event listeners para interacción
  ['scroll', 'mousemove', 'touchstart', 'click', 'keydown'].forEach(event => {
    window.addEventListener(event, resetHideTimeout, { passive: true });
  });

  // Actualizar visibilidad del hint en scroll (con throttling)
  let scrollHintTimeout;
  window.addEventListener('scroll', () => {
    if (!scrollHintTimeout) {
      scrollHintTimeout = setTimeout(() => {
        updateScrollHint();
        scrollHintTimeout = null;
      }, 100); // Throttle a 100ms
    }
  }, { passive: true });

  // Inicializar
  updateScrollHint();
  console.log('🎬 Scroll Storytelling Pro inicializado con hint mejorado');
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
  console.log('⏰ Countdown inicializado');
};

// ===== MICRO-INTERACCIONES (SIN SONIDO) =====
const initMicroInteractions = () => {
  // Efecto visual de ripple
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

  // Botones con efecto visual
  document.querySelectorAll('.hero-btn, .offer-btn, .contact-link, .card-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
      createRippleEffect(e, btn);
      
      btn.classList.add('vibrate');
      setTimeout(() => btn.classList.remove('vibrate'), 300);
    });
  });
  
  // Feedback táctil en móvil
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

// ===== SCROLL EFFECTS =====
const initScrollEffects = () => {
  if (!config.effects || scrollElements.length === 0) return;
  
  const observerOptions = {
    root: null,
    rootMargin: config.scrollMargin,
    threshold: buildThresholdList()
  };
  
  function buildThresholdList() {
    const thresholds = [];
    const numSteps = 20;
    
    for (let i = 0; i <= numSteps; i++) {
      thresholds.push(i / numSteps);
    }
    
    return thresholds;
  }
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const element = entry.target;
        
        if (entry.isIntersecting) {
          const delay = parseInt(element.getAttribute('data-delay')) || 0;
          
          setTimeout(() => {
            element.classList.add('active');
            
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
  
  scrollElements.forEach(el => {
    observer.observe(el);
  });
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

// ===== PARALLAX MEJORADO PARA MÓVIL Y DESKTOP =====
const initComponentParallax = () => {
  if (!config.effects) {
    console.log('⚠️ Efectos desactivados (reduced-motion)');
    return;
  }
  
  console.log('🌀 Inicializando Parallax Optimizado...');
  
  // Elementos para diferentes tipos de parallax
  const scrollParallaxElements = document.querySelectorAll(`
    .hero-img, about-content, .about-image, .section-title,
    .card, .offer-card, .contact-card,
    .brand-item, .feature, .info-card,
    .hero-text h1, .hero-text p,
    .section-subtitle, .about-content p
  `);
  
  const mouseParallaxElements = document.querySelectorAll(`
    .card, .offer-card, .contact-card,
    .brand-item, .feature, .info-card,
    .story-icon-item, .hero-btn
  `);
  
  // ===== SISTEMA DE SCROLL PARALLAX (PARA TODOS) =====
const updateScrollParallax = () => {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const windowCenter = scrollY + (windowHeight / 2);
  
  // Seleccionar TODOS los elementos que necesitan parallax
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
    
    // Obtener la velocidad personalizada del data-speed
    const speed = parseFloat(element.getAttribute('data-speed')) || 0.1;
    
    // Diferentes intensidades según dispositivo
    const mobileMultiplier = config.isMobile() ? 0.5 : 1;
    
    // Aplicar parallax basado en el tipo de elemento
    if (element.hasAttribute('data-speed')) {
      // Elementos con data-speed específico
      const translateY = normalizedDistance * 100 * speed * mobileMultiplier;
      const opacity = 1 - Math.abs(normalizedDistance) * 0.3;
      
      element.style.transform = `translate3d(0, ${translateY}px, 0)`;
      element.style.opacity = opacity;
      
    } else if (element.classList.contains('hero-img')) {
      // Hero image: efecto pronunciado
      const translateY = normalizedDistance * 100 * mobileMultiplier;
      const opacity = 1 - Math.abs(normalizedDistance) * 0.3;
      
      element.style.transform = `translate3d(0, ${translateY}px, 0)`;
      element.style.opacity = opacity;
      
    } else if (element.classList.contains('section-title')) {
      // Títulos: rotación suave
      const rotateX = normalizedDistance * 10 * mobileMultiplier;
      const translateY = normalizedDistance * 50 * mobileMultiplier;
      
      element.style.transform = `
        translate3d(0, ${translateY}px, 0)
        rotateX(${rotateX}deg)
      `;
      
    } else if (element.classList.contains('card') || 
               element.classList.contains('offer-card') || 
               element.classList.contains('contact-card')) {
      // Tarjetas: elevación suave
      const translateY = normalizedDistance * 40 * mobileMultiplier;
      const scale = 1 - Math.abs(normalizedDistance) * 0.1;
      
      element.style.transform = `
        translate3d(0, ${translateY}px, 0)
        scale(${scale})
      `;
      
    } else if (element.classList.contains('about-content') || 
               element.classList.contains('hero-text')) {
      // Contenido principal: movimiento suave
      const speed = parseFloat(element.getAttribute('data-speed')) || 0.15;
      const translateY = normalizedDistance * 80 * speed * mobileMultiplier;
      
      element.style.transform = `translate3d(0, ${translateY}px, 0)`;
      
    } else if (element.classList.contains('feature')) {
      // Características: movimiento individual
      const speed = parseFloat(element.getAttribute('data-speed')) || 0.08;
      const translateY = normalizedDistance * 60 * speed * mobileMultiplier;
      const scale = 1 - Math.abs(normalizedDistance) * 0.05;
      
      element.style.transform = `
        translate3d(0, ${translateY}px, 0)
        scale(${scale})
      `;
      
    } else if (element.classList.contains('story-icon-item')) {
      // Íconos del storytelling
      const translateY = normalizedDistance * 30 * mobileMultiplier;
      const rotateY = normalizedDistance * 5;
      
      element.style.transform = `
        translate3d(0, ${translateY}px, 0)
        rotateY(${rotateY}deg)
      `;
    }
  });
};
  
  // ===== SISTEMA DE MOUSE PARALLAX (SOLO DESKTOP) =====
  if (!config.isMobile()) {
    mouseParallaxElements.forEach(element => {
      // Añadir brillo interno solo en desktop
      if (element.classList.contains('card') || 
          element.classList.contains('offer-card') || 
          element.classList.contains('contact-card')) {
        
        const shine = document.createElement('div');
        shine.className = 'card-shine';
        shine.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0) 70%
          );
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
        `;
        element.appendChild(shine);
        
        element.style.transformStyle = 'preserve-3d';
      }
      
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / centerX;
        const moveY = (y - centerY) / centerY;
        
        let intensity = 0.1;
        let rotateY = 0;
        let rotateX = 0;
        let translateZ = 0;
        
        if (element.classList.contains('card') || 
            element.classList.contains('offer-card') || 
            element.classList.contains('contact-card')) {
          intensity = 0.15;
          rotateY = moveX * 8;
          rotateX = -moveY * 5;
          translateZ = 25;
          
          const shine = element.querySelector('.card-shine');
          if (shine) {
            shine.style.opacity = '0.8';
            shine.style.background = `linear-gradient(
              ${45 + (moveX * 45)}deg,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(255, 255, 255, 0) 70%
            )`;
          }
          
        } else if (element.classList.contains('brand-item')) {
          intensity = 0.05;
          translateZ = 15;
        } else if (element.classList.contains('story-icon-item')) {
          intensity = 0.08;
          rotateY = moveX * 10;
          rotateX = -moveY * 8;
          translateZ = 20;
        } else if (element.classList.contains('hero-btn')) {
          intensity = 0.12;
          rotateY = moveX * 5;
          rotateX = -moveY * 3;
          translateZ = 10;
        }
        
        const translateX = moveX * intensity * 20;
        const translateY = moveY * intensity * 20;
        
        element.style.transform = `
          translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
          rotateY(${rotateY}deg)
          rotateX(${rotateX}deg)
        `;
        
        if (!element.classList.contains('hero-btn')) {
          element.style.boxShadow = `
            ${-moveX * 10}px ${-moveY * 10}px 30px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 214, 0, 0.1)
          `;
        }
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = '';
        element.style.boxShadow = '';
        
        const shine = element.querySelector('.card-shine');
        if (shine) {
          shine.style.opacity = '0';
        }
        
        element.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        setTimeout(() => {
          element.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        }, 500);
      });
    });
  }
  
  // ===== SISTEMA DE TOUCH PARALLAX (MEJORADO PARA MÓVIL) =====
  else {
    mouseParallaxElements.forEach(element => {
      let touchStartY = 0;
      let touchStartX = 0;
      let isDragging = false;
      
      element.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        isDragging = false;
        element.style.transition = 'transform 0.1s linear';
      }, { passive: true });
      
      element.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const touchX = e.touches[0].clientX;
        
        const deltaY = (touchY - touchStartY) * 0.5;
        const deltaX = (touchX - touchStartX) * 0.5;
        
        // Solo aplicar parallax si el movimiento es significativo
        if (Math.abs(deltaY) > 5 || Math.abs(deltaX) > 5) {
          isDragging = true;
          
          // Efecto más pronunciado en móvil (pero optimizado)
          const translateY = deltaY * 0.5;
          const translateX = deltaX * 0.3;
          
          element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
        }
      }, { passive: true });
      
      element.addEventListener('touchend', () => {
        // Volver a posición original con animación suave
        element.style.transform = '';
        element.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
        
        // Solo efecto de "tap" si no estaba arrastrando
        if (!isDragging) {
          element.classList.add('tapped');
          setTimeout(() => element.classList.remove('tapped'), 200);
        }
      }, { passive: true });
    });
    
    // ===== EFECTO ESPECIAL PARA TEXTO EN MÓVIL =====
    const textElements = document.querySelectorAll('.hero-text h1, .hero-text p, .section-title h2');
    textElements.forEach(text => {
      text.addEventListener('touchstart', () => {
        text.style.transform = 'scale(0.98)';
        text.style.transition = 'transform 0.2s ease';
      }, { passive: true });
      
      text.addEventListener('touchend', () => {
        text.style.transform = '';
      }, { passive: true });
    });
  }
  
  // ===== OPTIMIZACIÓN DEL SCROLL PARALLAX =====
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
  
  // Inicializar
  updateScrollParallax();
  
  // Event listeners optimizados
  window.addEventListener('scroll', handleScrollParallax, { passive: true });
  window.addEventListener('resize', handleScrollParallax, { passive: true });
  
  console.log(`✅ Parallax optimizado inicializado:
    - ${scrollParallaxElements.length} elementos con scroll parallax
    - ${mouseParallaxElements.length} elementos interactivos
    - ${config.isMobile() ? 'Modo móvil activado' : 'Modo desktop activado'}
    - Efectos ${config.isMobile() ? 'moderados' : 'completos'}
  `);
};


// ===== SISTEMA DE FONDOS DINÁMICOS =====
const initDynamicBackgrounds = () => {
  const sections = document.querySelectorAll('.parallax-section');
  
  sections.forEach((section, index) => {
    const background = section.querySelector('.section-background');
    
    if (!background) return;
    
    // Crear capas adicionales
    const layer3 = document.createElement('div');
    layer3.className = 'gradient-layer-3';
    background.appendChild(layer3);
    
    const layer4 = document.createElement('div');
    layer4.className = 'gradient-layer-4';
    background.appendChild(layer4);
    
    // Efecto de interacción con el mouse (solo desktop)
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
    
    // Cambiar animaciones basado en scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Acelerar animaciones cuando está visible
            const layers = background.querySelectorAll('[class*="gradient-layer"]');
            layers.forEach(layer => {
              if (layer.style.animationDuration) {
                const currentDuration = parseFloat(layer.style.animationDuration);
                layer.style.animationDuration = `${Math.max(10, currentDuration * 0.7)}s`;
              }
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    
    observer.observe(section);
  });
  
  console.log('🎨 Fondos dinámicos inicializados');
};

// ===== INICIALIZACIÓN PRINCIPAL =====
const init = () => {
  console.log('🚀 Iniciando Merke+ de la Sabana...');
  
  // Configurar header inicial
  updateHeader();
  
  // Inicializar sistemas
  setupNoisePro();
  initTsParticles();
  initMobileMenu();
  initSmoothScroll();
  initScrollEffects();
  initScrollStorytellingPro();
  initComponentParallax();       // Parallax por elemento (mouse/hover)
  //initScrollBasedParallax();     // Parallax con scroll (para elementos grandes)
  initDynamicBackgrounds();
  initCountdown();
  initMicroInteractions();
  initWhatsAppButton();
  initIntro();
  
  // Configurar event listeners
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Marcar como cargado
  setTimeout(() => {
    document.body.classList.add('loaded');
    console.log('✅ Sistema cargado correctamente');
  }, 500);
};

// ===== EJECUCIÓN =====
window.addEventListener('load', () => {
  init();
  
  setTimeout(() => {
    if (!document.body.classList.contains('loaded')) {
      console.log('⚠️ Usando fallback de inicialización');
      init();
    }
  }, 2000);
});

// ===== DEBUG HELPER =====
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
  }
};