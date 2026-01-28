// ===== CONFIGURACIÓN ADAPTATIVA =====
const config = {
  effects: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  smoothScroll: true,
  soundEnabled: true,
  
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
const storySteps = document.querySelectorAll('.story-step');
const storySection = document.getElementById('scroll-story');
const sections = document.querySelectorAll('section');

// ===== VARIABLES DE ESTADO =====
let lastScrollY = window.scrollY;
let ticking = false;
let currentStoryStep = 0;
let audioContext = null;

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

  // Generador de ruido estético (grano cinematográfico)
  const noise = () => {
    const idata = ctx.createImageData(wWidth, wHeight);
    const buffer32 = new Uint32Array(idata.data.buffer);
    const len = buffer32.length;

    // Patrón de grano más realista
    for (let i = 0; i < len; i++) {
      // Probabilidad de píxel blanco basada en posición para mayor realismo
      const x = i % wWidth;
      const y = Math.floor(i / wWidth);
      const intensity = 0.02 + (Math.sin(x * 0.01) * Math.sin(y * 0.01) * 0.01);
      
      if (Math.random() < intensity) {
        // Diferentes tonos de gris para más realismo
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

// ===== TSPARTICLES CONFIGURATION (TU JSON COMPLETO) =====
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
        "value": 120 // AUMENTADO para más visibilidad
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
    
    // Asegurar que las partículas estén siempre visibles
    container.options.particles.move.enable = true;
    container.options.particles.number.value = 120;
    container.refresh();
  });
};

// ===== INICIALIZACIÓN DE SONIDO =====
const initAudio = () => {
  if (!config.soundEnabled) return;
  
  try {
    const initAudioOnInteraction = () => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      document.removeEventListener('click', initAudioOnInteraction);
      document.removeEventListener('touchstart', initAudioOnInteraction);
      console.log('🔊 AudioContext inicializado');
    };
    
    document.addEventListener('click', initAudioOnInteraction, { once: true });
    document.addEventListener('touchstart', initAudioOnInteraction, { once: true });
    
    console.log('🔊 Sistema de audio listo');
  } catch (e) {
    console.log('Audio no soportado:', e);
    config.soundEnabled = false;
  }
};

const createClickSound = () => {
  if (!audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (e) {
    console.log('Error creando sonido:', e);
  }
};

const playClickSound = () => {
  if (!config.soundEnabled || !audioContext || audioContext.state === 'suspended') return;
  
  try {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    createClickSound();
  } catch (e) {
    console.log('Error reproduciendo sonido:', e);
  }
};

// ===== SCROLL STORYTELLING PRO - SISTEMA AVANZADO =====
const initScrollStorytellingPro = () => {
  const storySections = document.querySelectorAll('.story-section');
  const animatedTexts = document.querySelectorAll('.story-text-animated');
  const storyWithIcons = document.querySelector('.story-with-icons');
  const storyIconsGrid = document.querySelector('.story-icons-grid');
  const iconItems = document.querySelectorAll('.story-icon-item');
  const scrollHint = document.querySelector('.scroll-hint');

  if (!storySections.length) return;

  // Preparar textos animados
  animatedTexts.forEach(textElement => {
    const text = textElement.dataset.text || textElement.textContent;
    const chars = text.split('');
    
    // Crear elementos span para cada carácter
    const charElements = chars.map((char, index) => {
      const span = document.createElement('span');
      span.className = char === ' ' ? 'char space' : 'char';
      span.textContent = char === ' ' ? ' ' : char;
      span.style.setProperty('--distance', index - (chars.length / 2));
      span.style.setProperty('--index', index);
      return span;
    });

    // Reemplazar contenido
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

  // Controlar visibilidad del hint de scroll
  const updateScrollHint = () => {
    if (!scrollHint) return;
    
    const scrollY = window.scrollY;
    const heroHeight = document.getElementById('hero')?.offsetHeight || 0;
    
    if (scrollY > heroHeight * 0.7 && scrollY < heroHeight * 3) {
      scrollHint.style.opacity = '1';
    } else {
      scrollHint.style.opacity = '0';
    }
  };

  // Actualizar hint en scroll
  window.addEventListener('scroll', updateScrollHint);
  updateScrollHint();

  console.log('🎬 Scroll Storytelling Pro inicializado');
};

// ===== SMOOTH SCROLL CON LENIS (OPCIONAL MEJORA) =====
const initSmoothScrollPro = () => {
  // Si prefieres un scroll más suave como en el ejemplo React
  if (typeof Lenis !== 'undefined' && config.smoothScroll) {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    console.log('🔄 Smooth Scroll Pro (Lenis) inicializado');
  }
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

// ===== MICRO-INTERACCIONES =====
const initMicroInteractions = () => {
  // Botones con sonido
  document.querySelectorAll('.hero-btn, .offer-btn, .contact-link, .card-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playClickSound();
      
      // Efecto visual de ripple
      createRippleEffect(e, btn);
      
      btn.classList.add('vibrate');
      setTimeout(() => btn.classList.remove('vibrate'), 300);
    });
  });
  
  // Efecto de hover en cards (solo desktop)
  if (!config.isMobile()) {
    document.querySelectorAll('.card, .feature, .contact-card, .offer-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (config.soundEnabled && audioContext) {
          try {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 600;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
          } catch (e) {}
        }
      });
    });
  }
  
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

// ===== INICIALIZACIÓN PRINCIPAL =====
const init = () => {
  console.log('🚀 Iniciando Merke+ de la Sabana...');
  
  // Configurar header inicial
  updateHeader();
  
  // Inicializar sistemas
  setupNoisePro();
  initTsParticles();
  initAudio();
  initMobileMenu();
  initSmoothScroll();
  initScrollEffects();
  initScrollStorytellingPro();
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
  toggleSound: () => {
    config.soundEnabled = !config.soundEnabled;
    console.log('🔊 Sonido:', config.soundEnabled ? 'Activado' : 'Desactivado');
  },
  showStoryStep: (step) => {
    if (step >= 0 && step <= 3) {
      currentStoryStep = step;
      storySteps.forEach((s, i) => {
        s.classList.remove('active', 'inactive');
        if (i === step) s.classList.add('active');
        if (i < step) s.classList.add('inactive');
      });
    }
  },
  adjustNoiseIntensity: (intensity) => {
    const canvas = document.getElementById('noiseCanvas');
    if (canvas) {
      canvas.style.opacity = intensity;
      console.log('🎨 Intensidad del noise ajustada a:', intensity);
    }
  }
};


const story = document.querySelector(".story-text");
const text = story.dataset.text;
const chars = text.split("");

story.innerHTML = chars
  .map(char => `<span>${char === " " ? "&nbsp;" : char}</span>`)
  .join("");

const spans = story.querySelectorAll("span");

window.addEventListener("scroll", () => {
  const rect = story.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // progreso de 0 a 1
  const progress = 1 - Math.min(Math.max(rect.top / windowHeight, 0), 1);

  const center = spans.length / 2;

  spans.forEach((span, i) => {
    const distance = i - center;
    const translateX = distance * 60 * (1 - progress);
    const rotate = distance * 8 * (1 - progress);
    const opacity = Math.min(progress + 0.2, 1);

    span.style.transform = `
      translateX(${translateX}px)
      rotate(${rotate}deg)
    `;
    span.style.opacity = opacity;
  });
});
