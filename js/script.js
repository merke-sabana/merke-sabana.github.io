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

// ===== DETECCIÓN DE GPU MEJORADA =====
const detectGPU = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'none';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'unknown';
    
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
    
    console.log(`🔍 GPU detectada: ${renderer}`);
    
    // Clasificación detallada de GPUs
    if (renderer.includes('Adreno (TM) 618')) {
      return 'adreno_618'; // Motorola One Fusion+
    } else if (renderer.includes('Adreno')) {
      // Adreno series más específica
      if (renderer.includes('Adreno 7')) return 'adreno_high';
      if (renderer.includes('Adreno 6')) return 'adreno_mid';
      if (renderer.includes('Adreno 5')) return 'adreno_low';
      return 'adreno_mid';
    } else if (renderer.includes('Mali')) {
      if (renderer.includes('Mali-G7') || renderer.includes('Mali-G7')) return 'mali_high';
      if (renderer.includes('Mali-G5')) return 'mali_mid';
      return 'mali_low';
    } else if (renderer.includes('PowerVR')) {
      return 'powervr_low';
    } else if (renderer.includes('NVIDIA') || renderer.includes('GeForce') || renderer.includes('RTX')) {
      return 'nvidia_gaming';
    } else if (renderer.includes('AMD') || renderer.includes('Radeon')) {
      return 'amd_gaming';
    } else if (renderer.includes('Intel')) {
      if (renderer.includes('Iris') || renderer.includes('UHD')) return 'intel_high';
      return 'intel_integrated';
    } else if (renderer.includes('Apple')) {
      if (renderer.includes('Apple M')) return 'apple_silicon';
      return 'apple';
    }
    
    return 'unknown';
  } catch (e) {
    return 'unknown';
  }
};

// ===== DETECCIÓN DE RAM REAL (NO SOLO deviceMemory) =====
const detectRealMemory = () => {
  const userAgent = navigator.userAgent;
  const isMobile = config.isMobile();
  
  // 1. Intentar con deviceMemory primero (si está disponible)
  if (navigator.deviceMemory && navigator.deviceMemory !== 4) {
    console.log(`📊 RAM detectada (deviceMemory): ${navigator.deviceMemory}GB`);
    return navigator.deviceMemory;
  }
  
  // 2. Detección por User Agent específico
  if (isMobile) {
    // Android
    if (/Android/.test(userAgent)) {
      // Motorola One Fusion+ específico
      if (userAgent.includes('XT2067') || userAgent.includes('motorola one fusion+')) {
        console.log('📱 Motorola One Fusion+ detectado: 4GB RAM');
        return 4;
      }
      
      // Samsung Galaxy S/Note series (gama alta)
      if (userAgent.includes('SM-G9') || userAgent.includes('SM-N9') || userAgent.includes('SM-F7')) {
        console.log('📱 Samsung flagship detectado: 8GB+ RAM');
        return 8;
      }
      
      // Samsung Galaxy A series (gama media)
      if (userAgent.includes('SM-A')) {
        if (userAgent.includes('SM-A5') || userAgent.includes('SM-A7')) {
          console.log('📱 Samsung A series gama media: 4-6GB RAM');
          return 6;
        }
        return 4;
      }
      
      // Google Pixel
      if (userAgent.includes('Pixel')) {
        const pixelMatch = userAgent.match(/Pixel (\d+)/);
        if (pixelMatch) {
          const pixelNum = parseInt(pixelMatch[1]);
          if (pixelNum >= 6) return 8;
          if (pixelNum >= 4) return 6;
          return 4;
        }
        return 6;
      }
      
      // OnePlus
      if (userAgent.includes('OnePlus') || userAgent.includes('ONEPLUS')) {
        if (userAgent.includes('10') || userAgent.includes('11') || userAgent.includes('12')) return 12;
        if (userAgent.includes('8') || userAgent.includes('9')) return 8;
        if (userAgent.includes('6') || userAgent.includes('7')) return 6;
        return 4;
      }
      
      // Xiaomi/Redmi/Poco
      if (userAgent.includes('Redmi') || userAgent.includes('Xiaomi') || userAgent.includes('POCO')) {
        if (userAgent.includes('Note 1') || userAgent.includes('12') || userAgent.includes('13')) return 8;
        if (userAgent.includes('Note 1') || userAgent.includes('11')) return 6;
        return 4;
      }
      
      // Por defecto para Android
      console.log('📱 Android estándar: asumiendo 4GB RAM');
      return 4;
    }
    
    // iOS/iPadOS
    if (/iPhone|iPad|iPod/.test(userAgent)) {
      // iPhone 15/14/13 Pro
      if (userAgent.includes('iPhone15,') || userAgent.includes('iPhone14,') || userAgent.includes('iPhone13,')) {
        if (userAgent.includes('Pro')) return 6;
        return 4;
      }
      
      // iPhone 12/11 Pro
      if (userAgent.includes('iPhone12,') || userAgent.includes('iPhone11,')) {
        if (userAgent.includes('Pro')) return 6;
        return 4;
      }
      
      // iPhone X/XS/XR
      if (userAgent.includes('iPhone10,') || userAgent.includes('iPhone11,')) {
        return 4;
      }
      
      // iPhone 8 y anteriores
      if (userAgent.includes('iPhone9,') || userAgent.includes('iPhone8,')) {
        return 3;
      }
      
      // iPad
      if (/iPad/.test(userAgent)) {
        if (userAgent.includes('iPad13,') || userAgent.includes('iPad14,')) return 8; // iPad Pro M1/M2
        if (userAgent.includes('iPad12,')) return 6; // iPad Air
        return 4;
      }
      
      // Por defecto para iOS
      console.log('📱 iOS estándar: asumiendo 4GB RAM');
      return 4;
    }
  } else {
    // PC/Desktop
    // Detectar por sistema operativo y user agent
    if (/Windows NT/.test(userAgent)) {
      // Windows - asumir mejor hardware
      console.log('💻 Windows detectado: asumiendo 8GB+ RAM');
      return 8;
    }
    
    if (/Mac OS X/.test(userAgent)) {
      // Mac - asumir buen hardware
      console.log('🍎 macOS detectado: asumiendo 8GB+ RAM');
      return 8;
    }
    
    if (/Linux/.test(userAgent)) {
      // Linux - asumir buen hardware (usuarios técnicos)
      console.log('🐧 Linux detectado: asumiendo 8GB+ RAM');
      return 8;
    }
  }
  
  // Por defecto conservador
  console.log('⚠️ No se pudo detectar RAM específica, usando valor por defecto: 4GB');
  return 4;
};

// ===== DETECCIÓN DE NÚCLEOS REALES =====
const detectRealCores = () => {
  // 1. Intentar con hardwareConcurrency primero
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency !== 4) {
    console.log(`🔢 Núcleos detectados (hardwareConcurrency): ${navigator.hardwareConcurrency}`);
    return navigator.hardwareConcurrency;
  }
  
  const userAgent = navigator.userAgent;
  const isMobile = config.isMobile();
  
  // 2. Detección por User Agent específico
  if (isMobile) {
    // Android
    if (/Android/.test(userAgent)) {
      // Procesadores de gama alta (Snapdragon 8 series, Dimensity 9000+)
      if (userAgent.includes('SM85') || userAgent.includes('SM84') || userAgent.includes('SM83')) {
        console.log('📱 Procesador Snapdragon 8 series: 8 núcleos');
        return 8;
      }
      
      // Motorola One Fusion+ (Snapdragon 730G)
      if (userAgent.includes('XT2067') || userAgent.includes('motorola one fusion+')) {
        console.log('📱 Motorola One Fusion+ (SD 730G): 8 núcleos');
        return 8;
      }
      
      // Procesadores de gama media (Snapdragon 7, 6 series)
      if (userAgent.includes('SM73') || userAgent.includes('SM63')) {
        console.log('📱 Procesador Snapdragon 7/6 series: 8 núcleos');
        return 8;
      }
      
      // MediaTek Dimensity
      if (userAgent.includes('MT') && (userAgent.includes('68') || userAgent.includes('81') || userAgent.includes('92'))) {
        console.log('📱 MediaTek Dimensity: 8 núcleos');
        return 8;
      }
      
      // Por defecto para Android moderno
      console.log('📱 Android moderno: asumiendo 8 núcleos');
      return 8;
    }
    
    // iOS
    if (/iPhone|iPad|iPod/.test(userAgent)) {
      // iPhone 15/14/13 (A16/A15 bionic)
      if (userAgent.includes('iPhone15,') || userAgent.includes('iPhone14,') || userAgent.includes('iPhone13,')) {
        console.log('📱 iPhone 13/14/15: 6 núcleos CPU');
        return 6;
      }
      
      // iPhone 12/11 (A14/A13 bionic)
      if (userAgent.includes('iPhone12,') || userAgent.includes('iPhone11,')) {
        console.log('📱 iPhone 11/12: 6 núcleos CPU');
        return 6;
      }
      
      // iPhone X/XS/XR (A12 bionic)
      if (userAgent.includes('iPhone10,')) {
        console.log('📱 iPhone X/XS/XR: 6 núcleos CPU');
        return 6;
      }
      
      // iPad con M1/M2
      if (/iPad/.test(userAgent) && (userAgent.includes('iPad13,') || userAgent.includes('iPad14,'))) {
        console.log('📱 iPad Pro M1/M2: 8+ núcleos CPU');
        return 8;
      }
      
      // Por defecto para iOS
      console.log('📱 iOS estándar: asumiendo 6 núcleos');
      return 6;
    }
  } else {
    // PC/Desktop
    if (/Windows NT/.test(userAgent)) {
      const winVersion = userAgent.match(/Windows NT (\d+\.\d+)/);
      if (winVersion) {
        const version = parseFloat(winVersion[1]);
        // Windows 10/11 - asumir hardware más moderno
        if (version >= 10) {
          console.log('💻 Windows 10/11: asumiendo 4+ núcleos');
          return 4;
        }
      }
    }
    
    // Por defecto para PC
    console.log('💻 PC estándar: asumiendo 4 núcleos');
    return 4;
  }
  
  // Por defecto conservador
  console.log('⚠️ No se pudo detectar núcleos específicos, usando valor por defecto: 4');
  return 4;
};

// ===== DETECCIÓN DE HARDWARE COMPLETA =====
const detectHardwareTier = () => {
  const isMobile = config.isMobile();
  const memory = detectRealMemory(); // ¡USANDO DETECCIÓN REAL!
  const cores = detectRealCores();   // ¡USANDO DETECCIÓN REAL!
  const gpu = detectGPU();
  const userAgent = navigator.userAgent;
  
  console.log(`📊 DETECCIÓN HARDWARE COMPLETA:`);
  console.log(`   - RAM REAL: ${memory}GB`);
  console.log(`   - NÚCLEOS REALES: ${cores}`);
  console.log(`   - GPU: ${gpu}`);
  console.log(`   - MÓVIL: ${isMobile}`);
  console.log(`   - USER AGENT: ${userAgent.substring(0, 80)}...`);
  
  // ===== DETECCIÓN ESPECÍFICA PARA TU MOTOROLA ONE FUSION+ =====
  if (isMobile) {
    // 1. Motorola One Fusion+ específico
    if (userAgent.includes('XT2067') || userAgent.includes('motorola one fusion+') || 
        (gpu === 'adreno_618' && memory === 4 && cores === 8)) {
      console.log('🎯 MOTOROLA ONE FUSION+ DETECTADO EXACTAMENTE');
      console.log('⚡ Configuración especial: 4GB RAM, 8 núcleos, Adreno 618');
      return 'mid_optimized';
    }
    
    // 2. Dispositivos de gama baja (basados en GPU y RAM)
    if (memory < 3 || gpu === 'powervr_low' || gpu === 'mali_low' || gpu === 'adreno_low') {
      console.log('📱 Nivel: LOW (Dispositivo básico)');
      return 'low';
    }
    
    // 3. Dispositivos de gama media
    if ((memory >= 3 && memory <= 6) || 
        gpu === 'adreno_mid' || gpu === 'mali_mid' || 
        (cores >= 4 && cores <= 6)) {
      console.log('📱 Nivel: MID (Dispositivo gama media)');
      return 'mid';
    }
    
    // 4. Dispositivos de gama alta
    if (memory > 6 || gpu === 'adreno_high' || gpu === 'mali_high' || 
        gpu === 'apple_silicon' || cores >= 8) {
      console.log('📱 Nivel: HIGH (Dispositivo gama alta)');
      return 'high';
    }
    
    // Por defecto para móviles
    console.log('📱 Nivel: MID (Móvil estándar)');
    return 'mid';
    
  } else {
    // ===== PC/DESKTOP =====
    
    // 1. PC Gaming de alta gama (como tu ASUS TUF con 40GB RAM)
    if (memory >= 16 || gpu === 'nvidia_gaming' || gpu === 'amd_gaming') {
      console.log('💻 Nivel: HIGH (PC Gaming/Gama alta)');
      return 'high';
    }
    
    // 2. PC estándar
    if (memory >= 8 && cores >= 4) {
      console.log('💻 Nivel: MID (PC estándar)');
      return 'mid';
    }
    
    // 3. PC básico/antiguo
    console.log('💻 Nivel: LOW (PC básico/antiguo)');
    return 'low';
  }
};

// Variables globales de optimización
let hardwareTier = detectHardwareTier();

// ===== CONFIGURACIÓN OPTIMIZADA =====
const setupHardwareOptimizations = () => {
  console.log(`🖥️ Nivel de hardware detectado: ${hardwareTier}`);
  console.log(`🎯 Configurando optimizaciones específicas...`);
  
  if (hardwareTier === 'low') {
    window.particleCount = 20;
    window.noiseIntensity = 0.08;
    window.animationQuality = 'low';
    config.effects = true;
    config.parallaxEnabled = true;
    config.smoothScroll = true;
    
    console.log('⚙️ Configurado para dispositivos básicos');
    
  } else if (hardwareTier === 'mid_optimized') {
    window.particleCount = 35;
    window.noiseIntensity = 0.15;
    window.animationQuality = 'medium_optimized';
    config.effects = true;
    config.parallaxEnabled = true;
    config.smoothScroll = true;
    
    console.log('⚙️ Configuración ESPECIAL para Motorola One Fusion+');
    console.log('✨ Efectos optimizados para fluidez máxima');
    
  } else if (hardwareTier === 'mid') {
    window.particleCount = 50;
    window.noiseIntensity = 0.18;
    window.animationQuality = 'medium';
    
    console.log('⚙️ Configurado para gama media');
    
  } else { // high
    window.particleCount = 120;
    window.noiseIntensity = 0.25;
    window.animationQuality = 'high';
    
    console.log('⚙️ Configurado para gama alta');
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

// ===== NOISE PRO OPTIMIZADO PARA FLUIDEZ =====
const setupNoisePro = () => {
  const canvas = document.getElementById('noiseCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // AJUSTES ESPECÍFICOS PARA FLUIDEZ
  let scale, frameRate, density, opacity;
  
  if (hardwareTier === 'low') {
    scale = 0.3; // Más reducido
    frameRate = 8; // Más FPS bajo
    density = 0.015;
    opacity = 0.08;
  } else if (hardwareTier === 'mid_optimized') {
    scale = 0.4; // Optimizado para Motorola
    frameRate = 12; // Balanceado
    density = 0.025;
    opacity = 0.12;
  } else if (hardwareTier === 'mid') {
    scale = 0.5;
    frameRate = 15;
    density = 0.035;
    opacity = 0.15;
  } else { // high
    scale = 1.0;
    frameRate = 20;
    density = 0.05;
    opacity = 0.25;
  }

  let isVisible = true;
  let lastFrameTime = 0;
  const frameInterval = 1000 / frameRate;

  const resize = () => {
    canvas.width = Math.floor(window.innerWidth * scale);
    canvas.height = Math.floor(window.innerHeight * scale);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  };

  resize();
  
  // Throttle de resize optimizado
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 300);
  }, { passive: true });

  // PRE-GENERAR PATRONES PARA MÁS FLUIDEZ
  let noisePatterns = [];
  if (hardwareTier === 'low' || hardwareTier === 'mid_optimized') {
    // Pre-generar 4 patrones para rotar (más fluido que generar en tiempo real)
    for (let p = 0; p < 4; p++) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 200;
      tempCanvas.height = 200;
      const tempCtx = tempCanvas.getContext('2d');
      const imageData = tempCtx.createImageData(200, 200);
      const buffer32 = new Uint32Array(imageData.data.buffer);
      
      for (let i = 0; i < buffer32.length; i++) {
        if (Math.random() < density) {
          const shade = 200 + (Math.random() * 55);
          buffer32[i] = (255 << 24) | (shade << 16) | (shade << 8) | shade;
        } else {
          buffer32[i] = 0xff000000;
        }
      }
      tempCtx.putImageData(imageData, 0, 0);
      noisePatterns.push(tempCanvas);
    }
  }

  const generateNoise = (currentTime) => {
    if (!isVisible || currentTime - lastFrameTime < frameInterval) {
      requestAnimationFrame(generateNoise);
      return;
    }
    
    lastFrameTime = currentTime;
    canvas.style.opacity = opacity;
    
    // USAR PATRONES PRE-GENERADOS PARA MÁS FLUIDEZ
    if ((hardwareTier === 'low' || hardwareTier === 'mid_optimized') && noisePatterns.length > 0) {
      const patternIndex = Math.floor((currentTime / 500) % noisePatterns.length); // Cambiar cada 500ms
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(noisePatterns[patternIndex], 0, 0, canvas.width, canvas.height);
    } else {
      // Método original para hardware mejor
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
    }
    
    requestAnimationFrame(generateNoise);
  };

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible) {
      requestAnimationFrame(generateNoise);
    }
  });

  generateNoise(0);
  console.log(`🎨 Noise optimizado: ${frameRate} FPS (${hardwareTier})`);
};

// ===== TSPARTICLES OPTIMIZADO PARA FLUIDEZ =====
const initTsParticles = () => {
  if (typeof tsParticles === 'undefined') {
    console.error('tsParticles no cargado');
    return;
  }

  const isMobile = config.isMobile();
  let particleCount = window.particleCount || (isMobile ? 30 : 80);
  
  // AJUSTES ESPECÍFICOS PARA FLUIDEZ
  let fpsLimit, speed, opacityValue, maxSize, linksEnabled;
  
  if (hardwareTier === 'low') {
    fpsLimit = 20;
    speed = 0.3;
    opacityValue = 0.3;
    maxSize = 10;
    linksEnabled = false;
  } else if (hardwareTier === 'mid_optimized') {
    fpsLimit = 25; // Más bajo para fluidez
    speed = 0.8; // Más lento
    opacityValue = 0.5;
    maxSize = 15;
    linksEnabled = true; // Pero mantener links
    particleCount = Math.min(particleCount, 35); // Limitar partículas
  } else if (hardwareTier === 'mid') {
    fpsLimit = 30;
    speed = 1.2;
    opacityValue = 0.6;
    maxSize = 20;
    linksEnabled = true;
  } else { // high
    fpsLimit = 60;
    speed = 2;
    opacityValue = 0.7;
    maxSize = 30;
    linksEnabled = true;
  }
  
  const particlesConfig = {
    autoPlay: true,
    background: { color: { value: "transparent" }, opacity: 0 },
    fullScreen: { enable: false, zIndex: -2 },
    fpsLimit: fpsLimit, // FPS ajustado para fluidez
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
        speed: speed, // Velocidad ajustada
        direction: "none",
        outModes: { default: "out" }
      },
      number: {
        value: particleCount,
        density: { enable: true, width: 1920, height: 1080 }
      },
      opacity: {
        value: opacityValue,
        animation: { 
          enable: hardwareTier !== 'low' && hardwareTier !== 'mid_optimized', // Desactivar animación de opacidad en optimizado
          speed: 2, 
          sync: false 
        }
      },
      size: {
        value: { min: 1, max: maxSize },
        animation: { enable: hardwareTier === 'high', speed: 5 } // Solo animación en high
      },
      shape: {
        close: true,
        fill: true,
        options: {},
        type: "circle"
      },
      links: {
        enable: linksEnabled,
        distance: 120, // Reducido para mejor performance
        opacity: hardwareTier === 'mid_optimized' ? 0.2 : 0.4, // Más transparente en optimizado
        width: hardwareTier === 'mid_optimized' ? 0.5 : 1
      }
    },
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    smooth: false,
    detectRetina: hardwareTier === 'high'
  };

  tsParticles.load("tsparticles", particlesConfig).then(container => {
    console.log(`✨ tsParticles: ${particleCount} partículas (${hardwareTier}) - ${fpsLimit} FPS`);
    
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

// ===== SCROLL STORYTELLING PRO OPTIMIZADO =====
const initScrollStorytellingPro = () => {
  const storySections = document.querySelectorAll('.story-section');
  const animatedTexts = document.querySelectorAll('.story-text-animated');
  const storyWithIcons = document.querySelector('.story-with-icons');
  const storyIconsGrid = document.querySelector('.story-icons-grid');
  const iconItems = document.querySelectorAll('.story-icon-item');
  const scrollHint = document.querySelector('.scroll-hint');

  if (!storySections.length || !scrollHint) return;

  // PREPARAR TEXTOS ANIMADOS CON OPTIMIZACIÓN
  animatedTexts.forEach(textElement => {
    const text = textElement.dataset.text || textElement.textContent;
    
    // OPTIMIZACIÓN: Usar palabras en lugar de caracteres para dispositivos móviles
    if (hardwareTier === 'low' || hardwareTier === 'mid_optimized') {
      const words = text.split(' ');
      
      textElement.innerHTML = '';
      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word-animated';
        wordSpan.style.display = 'inline-block';
        wordSpan.style.marginRight = '0.3em';
        wordSpan.style.opacity = '0';
        wordSpan.style.transform = 'translateY(20px)';
        wordSpan.textContent = word + (wordIndex < words.length - 1 ? ' ' : '');
        wordSpan.style.setProperty('--index', wordIndex);
        textElement.appendChild(wordSpan);
      });
    } else {
      // Método original para dispositivos buenos
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
    }
  });

  // CONFIGURAR OBSERVER CON MÁRGENES AJUSTADOS
  const observerOptions = {
    root: null,
    rootMargin: hardwareTier === 'mid_optimized' ? '-80px 0px -80px 0px' : '-100px 0px -100px 0px',
    threshold: hardwareTier === 'mid_optimized' ? 0.15 : 0.1
  };

  const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const section = entry.target;
      
      if (entry.isIntersecting) {
        // ANIMAR CON RETARDOS OPTIMIZADOS
        if (hardwareTier === 'low' || hardwareTier === 'mid_optimized') {
          const words = section.querySelectorAll('.word-animated');
          words.forEach((word, index) => {
            setTimeout(() => {
              word.style.opacity = '1';
              word.style.transform = 'translateY(0)';
              word.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }, index * 120); // Retardo mayor para más fluidez
          });
        } else {
          const chars = section.querySelectorAll('.char');
          chars.forEach((char, index) => {
            setTimeout(() => {
              char.style.opacity = '1';
              char.style.transform = 'translateX(0) rotateX(0)';
            }, index * 50);
          });
        }

        // Animar íconos si es la sección 3
        if (section.id === 'story-section-3') {
          setTimeout(() => {
            if (storyWithIcons) storyWithIcons.classList.add('active');
            if (storyIconsGrid) storyIconsGrid.classList.add('active');
            
            iconItems.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('active');
              }, index * 150); // Retardo mayor
            });
          }, 500);
        }
      } else {
        // Resetear animaciones (solo opacidad para mejor performance)
        if (hardwareTier === 'low' || hardwareTier === 'mid_optimized') {
          const words = section.querySelectorAll('.word-animated');
          words.forEach(word => {
            word.style.opacity = '0';
            word.style.transform = 'translateY(20px)';
          });
        } else {
          const chars = section.querySelectorAll('.char');
          chars.forEach(char => {
            char.style.opacity = '0';
            char.style.transform = 'translateX(calc(var(--distance) * 60px)) rotateX(calc(var(--distance) * 30deg))';
          });
        }

        if (section.id === 'story-section-3') {
          if (storyWithIcons) storyWithIcons.classList.remove('active');
          if (storyIconsGrid) storyIconsGrid.classList.remove('active');
          iconItems.forEach(item => item.classList.remove('active'));
        }
      }
    });
  }, observerOptions);

  storySections.forEach(section => storyObserver.observe(section));

  // CONTROL DEL SCROLL HINT OPTIMIZADO
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

  // THROTTLE DEL SCROLL PARA MEJOR PERFORMANCE
  let scrollHintTimeout;
  let lastScrollTime = 0;
  const scrollThrottle = hardwareTier === 'mid_optimized' ? 150 : 100;
  
  window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime > scrollThrottle) {
      lastScrollTime = now;
      if (!scrollHintTimeout) {
        scrollHintTimeout = setTimeout(() => {
          updateScrollHint();
          scrollHintTimeout = null;
        }, 50);
      }
    }
  }, { passive: true });

  updateScrollHint();
  console.log(`🎬 Scroll Storytelling optimizado para: ${hardwareTier}`);
};

// ===== COUNTDOWN TIMER (SIN CAMBIOS - YA ES EFICIENTE) =====
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

// ===== MICRO-INTERACCIONES OPTIMIZADAS =====
const initMicroInteractions = () => {
  const createRippleEffect = (event, element) => {
    // OPTIMIZACIÓN: Limitar ripples en dispositivos móviles
    if (hardwareTier === 'low' && element.classList.contains('ripple-active')) {
      return;
    }
    
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
    
    // Marcar elemento como activo para evitar ripples múltiples
    if (hardwareTier === 'low') {
      element.classList.add('ripple-active');
      setTimeout(() => element.classList.remove('ripple-active'), 300);
    }
    
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
      // OPTIMIZACIÓN: Usar transform 2D en lugar de 3D para móviles
      card.addEventListener('touchstart', () => {
        card.style.transform = 'scale(0.98)';
        card.style.transition = 'transform 0.2s ease';
      }, { passive: true });
      
      card.addEventListener('touchend', () => {
        card.style.transform = '';
      }, { passive: true });
      
      // Evitar hover en móviles
      card.style.willChange = 'transform';
    });
  }
};

// ===== MENÚ MÓVIL (SIN CAMBIOS NECESARIOS) =====
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

// ===== SCROLL SMOOTH OPTIMIZADO =====
const initSmoothScroll = () => {
  console.log('🔄 Inicializando SmoothScroll optimizado...');
  
  // AJUSTAR CONFIGURACIÓN SEGÚN HARDWARE
  const smoothConfig = {
    duration: hardwareTier === 'mid_optimized' ? 800 : 700, // Más lento pero más suave
    easing: (t) => {
      // Easing más suave para dispositivos móviles
      if (hardwareTier === 'mid_optimized' || hardwareTier === 'low') {
        return t < 0.5 
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }
      return t < 0.5 
        ? 8 * t * t * t * t
        : 1 - Math.pow(-2 * t + 2, 4) / 2;
    },
    offset: 80,
    minDistance: 50,
    maxDistance: 3000,
    fps: hardwareTier === 'mid_optimized' ? 50 : 60, // FPS reducido para fluidez
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
    
    // OPTIMIZACIÓN: Scroll más rápido en distancias cortas
    if (absoluteDistance < 300) {
      duration = Math.max(300, absoluteDistance * 0.8);
    } else if (absoluteDistance > 2000) {
      duration = Math.min(1000, absoluteDistance * 0.3);
    } else {
      duration = absoluteDistance * 0.4;
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

  console.log(`✅ SmoothScroll optimizado para: ${hardwareTier}`);
};

// ===== SCROLL EFFECTS OPTIMIZADOS =====
const initScrollEffects = () => {
  if (!config.effects || scrollElements.length === 0) return;
  
  const observerOptions = {
    root: null,
    rootMargin: hardwareTier === 'mid_optimized' ? '80px 0px 80px 0px' : '100px 0px 100px 0px',
    threshold: hardwareTier === 'mid_optimized' ? 0.05 : 0.01
  };
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = parseInt(element.getAttribute('data-delay')) || 0;
          
          // USAR setTimeout EN LUGAR DE requestAnimationFrame PARA MÓVILES
          if (hardwareTier === 'mid_optimized' || hardwareTier === 'low') {
            setTimeout(() => {
              element.classList.add('active');
            }, delay);
          } else {
            requestAnimationFrame(() => {
              setTimeout(() => {
                element.classList.add('active');
              }, delay);
            });
          }
        }
      });
    },
    observerOptions
  );
  
  // OBSERVAR ELEMENTOS EN BATCHES PARA MEJOR PERFORMANCE
  const batchSize = hardwareTier === 'mid_optimized' ? 5 : 10;
  for (let i = 0; i < scrollElements.length; i += batchSize) {
    const batch = Array.from(scrollElements).slice(i, i + batchSize);
    
    setTimeout(() => {
      batch.forEach(el => observer.observe(el));
    }, i * 20); // Espaciar la observación
  }
  
  console.log(`✅ Scroll effects optimizados: ${scrollElements.length} elementos (${hardwareTier})`);
};

// ===== HEADER EFFECT OPTIMIZADO =====
const updateHeader = () => {
  if (!header) return;
  
  const scrollY = window.scrollY;
  
  if (scrollY > 100) {
    header.classList.add('scrolled');
    // OPTIMIZACIÓN: Usar backgroundColor en lugar de backdropFilter cuando sea posible
    if (hardwareTier === 'mid_optimized') {
      header.style.backgroundColor = 'rgba(5, 27, 56, 0.98)';
      header.style.backdropFilter = 'blur(8px)'; // Reducido
    } else {
      header.style.backgroundColor = 'rgba(5, 27, 56, 0.98)';
      header.style.backdropFilter = 'blur(15px)';
    }
  } else {
    header.classList.remove('scrolled');
    if (hardwareTier === 'mid_optimized') {
      header.style.backgroundColor = 'rgba(11, 44, 77, 0.95)';
      header.style.backdropFilter = 'blur(5px)'; // Reducido
    } else {
      header.style.backgroundColor = 'rgba(11, 44, 77, 0.95)';
      header.style.backdropFilter = 'blur(10px)';
    }
  }
};

// ===== SCROLL HANDLER OPTIMIZADO =====
const handleScroll = () => {
  if (!ticking) {
    ticking = true;
    
    // USAR setTimeout EN LUGAR DE requestAnimationFrame PARA MÓVILES
    if (hardwareTier === 'mid_optimized' || hardwareTier === 'low') {
      setTimeout(() => {
        updateHeader();
        ticking = false;
      }, 16); // ~60fps
    } else {
      requestAnimationFrame(() => {
        updateHeader();
        ticking = false;
      });
    }
  }
};

// ===== WHATSAPP BUTTON OPTIMIZADO =====
const initWhatsAppButton = () => {
  const whatsappBtn = document.querySelector('.whatsapp-float');
  if (!whatsappBtn) return;
  
  setTimeout(() => {
    whatsappBtn.style.opacity = '1';
    whatsappBtn.style.transform = 'translateY(0) scale(1)';
    whatsappBtn.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }, 2000);
  
  if (config.effects) {
    // OPTIMIZACIÓN: Pulso menos frecuente en móviles
    const pulseInterval = hardwareTier === 'mid_optimized' ? 5000 : 3000;
    
    setInterval(() => {
      if (!document.hidden) {
        whatsappBtn.classList.toggle('pulse');
      }
    }, pulseInterval);
  }
};

// ===== INTRO REMOVAL (SIN CAMBIOS) =====
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

// ===== PARALLAX OPTIMIZADO PARA FLUIDEZ =====
const initComponentParallax = () => {
  if (!config.effects) {
    console.log('⚠️ Efectos desactivados (reduced-motion)');
    return;
  }
  
  console.log(`🌀 Inicializando Parallax Optimizado para: ${hardwareTier}`);
  
  const mouseParallaxElements = document.querySelectorAll(`
    .card, .offer-card, .contact-card,
    .brand-item, .feature, .info-card,
    .story-icon-item, .hero-btn
  `);
  
  const updateScrollParallax = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const windowCenter = scrollY + (windowHeight / 2);
    
    // SELECCIONAR MENOS ELEMENTOS EN MÓVILES
    const parallaxSelector = hardwareTier === 'mid_optimized' ? 
      `.reveal[data-speed],
       [data-scroll-effect],
       .hero-img, .about-image,
       .card, .offer-card,
       .hero-text h1, .section-title` :
      `.reveal[data-speed],
       [data-scroll-effect],
       .hero-img, .about-image, .section-title,
       .card, .offer-card, .contact-card,
       .brand-item, .feature, .info-card,
       .hero-text h1, .hero-text p,
       .section-subtitle, .about-content,
       .about-content p, .hero-text,
       .hero-buttons, .about-features,
       .story-icon-item, .story-text-animated`;
    
    const allParallaxElements = document.querySelectorAll(parallaxSelector);
    
    allParallaxElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementCenter = elementTop + (rect.height / 2);
      
      const distanceFromCenter = elementCenter - windowCenter;
      const normalizedDistance = distanceFromCenter / windowHeight;
      
      const speed = parseFloat(element.getAttribute('data-speed')) || 0.1;
      
      // AJUSTAR MULTIPLICADOR SEGÚN HARDWARE
      let mobileMultiplier;
      if (hardwareTier === 'low') {
        mobileMultiplier = 0.2;
      } else if (hardwareTier === 'mid_optimized') {
        mobileMultiplier = 0.4; // Reducido para más fluidez
      } else if (hardwareTier === 'mid') {
        mobileMultiplier = 0.6;
      } else {
        mobileMultiplier = 0.7;
      }
      
      if (element.hasAttribute('data-speed')) {
        const translateY = normalizedDistance * 80 * speed * mobileMultiplier; // Reducido de 100
        const opacity = 1 - Math.abs(normalizedDistance) * 0.2; // Menos cambio de opacidad
        
        // USAR transform 2D EN LUGAR DE 3D PARA MÓVILES
        if (hardwareTier === 'mid_optimized' || hardwareTier === 'low') {
          element.style.transform = `translateY(${translateY}px)`;
        } else {
          element.style.transform = `translate3d(0, ${translateY}px, 0)`;
        }
        
        if (hardwareTier !== 'low') {
          element.style.opacity = opacity;
        }
      }
    });
  };
  
  // MOUSE PARALLAX SOLO EN DESKTOP Y HARDWARE BUENO
  if (!config.isMobile() && hardwareTier !== 'low' && hardwareTier !== 'mid_optimized') {
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
  
  // THROTTLE DEL SCROLL PARALLAX
  let scrollTicking = false;
  let lastParallaxUpdate = 0;
  const parallaxThrottle = hardwareTier === 'mid_optimized' ? 50 : 33; // ~20fps vs ~30fps
  
  const handleScrollParallax = () => {
    const now = Date.now();
    
    if (!scrollTicking && now - lastParallaxUpdate > parallaxThrottle) {
      scrollTicking = true;
      lastParallaxUpdate = now;
      
      if (hardwareTier === 'mid_optimized' || hardwareTier === 'low') {
        setTimeout(() => {
          updateScrollParallax();
          scrollTicking = false;
        }, 0);
      } else {
        requestAnimationFrame(() => {
          updateScrollParallax();
          scrollTicking = false;
        });
      }
    }
  };
  
  updateScrollParallax();
  window.addEventListener('scroll', handleScrollParallax, { passive: true });
  window.addEventListener('resize', handleScrollParallax, { passive: true });
  
  console.log(`✅ Parallax optimizado para: ${hardwareTier} (${Math.floor(1000/parallaxThrottle)} FPS)`);
};

// ===== SISTEMA DE FONDOS DINÁMICOS OPTIMIZADO =====
const initDynamicBackgrounds = () => {
  const sections = document.querySelectorAll('.parallax-section');
  
  // SOLO APLICAR EN HARDWARE SUFICIENTE
  if (hardwareTier === 'low') {
    console.log('🎨 Fondos dinámicos desactivados para low tier');
    return;
  }
  
  sections.forEach((section) => {
    const background = section.querySelector('.section-background');
    
    if (!background) return;
    
    // Solo añadir capas extras en hardware bueno
    if (hardwareTier === 'high') {
      const layer3 = document.createElement('div');
      layer3.className = 'gradient-layer-3';
      background.appendChild(layer3);
      
      const layer4 = document.createElement('div');
      layer4.className = 'gradient-layer-4';
      background.appendChild(layer4);
    }
    
    // Efecto de interacción solo en desktop y hardware bueno
    if (!config.isMobile() && hardwareTier === 'high') {
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
  
  console.log('🎨 Fondos dinámicos inicializados (optimizados)');
};

// ===== SISTEMA DE NOTIFICACIONES INTELIGENTE OPTIMIZADO =====
const initSmartNotifications = () => {
  console.log('🔔 Inicializando sistema de notificaciones optimizado...');
  
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
    
    // DURACIÓN REDUCIDA EN MÓVILES PARA MEJOR EXPERIENCIA
    const baseDuration = config.isMobile() ? 6000 : 10000;
    const duration = hardwareTier === 'mid_optimized' ? 5000 : baseDuration;
    
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

    // Contenido HTML optimizado
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

    // Animación de entrada
    setTimeout(() => {
      notification.classList.add('show');
      console.log(`✅ Notificación ${notificationId} visible`);
    }, 10);

    // Configurar barra de progreso (solo en dispositivos buenos)
    if (hardwareTier !== 'low') {
      const progressBar = notification.querySelector('.notification-progress');
      if (progressBar) {
        progressBar.style.animationDuration = `${duration}ms`;
        progressBar.style.animationPlayState = 'running';
      }
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
      delay: hardwareTier === 'mid_optimized' ? 4000 : 3500, // Delay mayor para que cargue primero
      duration: hardwareTier === 'mid_optimized' ? 7000 : 10000
    },
    spline: {
      type: 'once-per-session',
      delay: 0,
      duration: 5000 // Reducido
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
    const INTERACTION_COOLDOWN = hardwareTier === 'mid_optimized' ? 15000 : 10000; // Mayor cooldown

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
        duration: 5000
      });

      lastInteractionTime = now;
    };

    // Añadir listeners con delay para asegurar que Spline esté listo
    setTimeout(() => {
      console.log('🎯 Añadiendo listeners a Spline');
      
      // Desktop
      splineViewer.addEventListener('mousedown', showSplineNotification);
      splineViewer.addEventListener('wheel', showSplineNotification);
      
      // Móvil - solo un listener para mejor performance
      if (config.isMobile()) {
        splineViewer.addEventListener('touchstart', (e) => {
          if (e.touches.length === 2) { // Solo para zoom con dos dedos
            showSplineNotification();
          }
        }, { passive: true });
      }
      
      console.log('✅ Listeners para Spline configurados');
    }, 2000); // Delay mayor
  };

  // ===== INICIALIZACIÓN =====
  
  // 1. Mostrar bienvenida automáticamente
  setTimeout(() => {
    showWelcomeNotification();
  }, 1000);
  
  // 2. Configurar notificaciones para Spline (con mayor delay)
  setTimeout(() => {
    setupSplineNotifications();
  }, 3000);
  
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

  console.log(`✅ Sistema de notificaciones optimizado para: ${hardwareTier}`);
};

// ===== SISTEMA DE BLOQUEO DE SCROLL PARA SPLINE OPTIMIZADO =====
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
  
  // Detectar interacción en móvil OPTIMIZADO
  const handleMobileInteraction = () => {
    splineViewer.style.touchAction = 'none';
    
    let lastTouchTime = 0;
    const TOUCH_THROTTLE = 100; // Throttle para touches
    
    splineViewer.addEventListener('touchstart', (e) => {
      const now = Date.now();
      if (now - lastTouchTime < TOUCH_THROTTLE) return;
      lastTouchTime = now;
      
      // Guardar posición inicial
      touchStartY = e.touches[0].clientY;
      
      // Detectar pinch (zoom) - solo bloquear para zoom
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
      // Prevenir scroll de página solo cuando hay dos dedos
      if (isPinching) {
        e.preventDefault();
      }
    }, { passive: false });
    
    splineViewer.addEventListener('touchend', () => {
      isPinching = false;
      
      // Desbloquear más rápido en móviles optimizados
      const unlockDelay = hardwareTier === 'mid_optimized' ? 300 : 500;
      
      if (interactionTimeout) clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        if (!isPinching) {
          unlockScroll();
        }
      }, unlockDelay);
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
  
  console.log(`🎮 Sistema de bloqueo de scroll optimizado: ${isMobile ? 'móvil' : 'desktop'}`);
};

// ===== OPTIMIZACIÓN SPLINE MEJORADA =====
const optimizeSpline = () => {
  const splineViewer = document.querySelector('spline-viewer');
  if (!splineViewer) return;
  
  const isMobile = config.isMobile();
  
  // CONFIGURACIÓN ESPECÍFICA SEGÚN HARDWARE
  let renderMode, quality;
  
  if (hardwareTier === 'low') {
    renderMode = 'performance';
    quality = 'low';
  } else if (hardwareTier === 'mid_optimized') {
    renderMode = 'balanced'; // Balance entre calidad y performance
    quality = 'medium';
  } else if (hardwareTier === 'mid') {
    renderMode = 'quality';
    quality = 'medium';
  } else { // high
    renderMode = 'quality';
    quality = 'high';
  }
  
  splineViewer.setAttribute('render-mode', renderMode);
  splineViewer.setAttribute('interaction-enabled', 'true');
  splineViewer.setAttribute('quality', quality);
  
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
  
  console.log(`🎮 Spline optimizado: modo ${renderMode}, calidad ${quality}`);
};

// ===== THROTTLING MEJORADO =====
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

// ===== LAZY LOADING INTELIGENTE OPTIMIZADO =====
const initSmartLazyLoad = () => {
  const lazyElements = document.querySelectorAll('[loading="lazy"], img[data-src], iframe[data-src]');
  
  // MÁRGENES AJUSTADOS SEGÚN HARDWARE
  const rootMargin = hardwareTier === 'mid_optimized' ? '150px 0px' : '200px 0px';
  
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        if (element.dataset.src) {
          // Cargar con un pequeño delay para no saturar
          setTimeout(() => {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
          }, hardwareTier === 'mid_optimized' ? 100 : 50);
        }
        
        lazyObserver.unobserve(element);
      }
    });
  }, {
    rootMargin: rootMargin,
    threshold: 0.01
  });
  
  lazyElements.forEach(el => lazyObserver.observe(el));
  console.log(`🔄 Lazy loading optimizado: ${lazyElements.length} elementos`);
};

// ===== AJUSTES DINÁMICOS DE PERFORMANCE MEJORADOS =====
const adjustEffectsForPerformance = () => {
  const particlesContainer = tsParticles.domItem(0);
  if (particlesContainer) {
    // REDUCCIÓN GRADUAL EN LUGAR DE BRUSCA
    const currentCount = particlesContainer.options.particles.number.value;
    const newCount = Math.max(10, Math.floor(currentCount * 0.8));
    
    if (newCount < currentCount) {
      particlesContainer.options.particles.number.value = newCount;
      particlesContainer.refresh();
      console.log(`🔄 Partículas reducidas gradualmente a: ${newCount}`);
    }
  }
  
  const noiseCanvas = document.getElementById('noiseCanvas');
  if (noiseCanvas) {
    const currentOpacity = parseFloat(noiseCanvas.style.opacity || 0.25);
    noiseCanvas.style.opacity = Math.max(0.05, currentOpacity * 0.8);
  }
};

// ===== MEDICIÓN DE PERFORMANCE MEJORADA =====
const measurePerformance = () => {
  if ('PerformanceObserver' in window && hardwareTier !== 'high') {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`📊 Performance: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
        
        // AJUSTAR EFECTOS SI HAY PROBLEMAS DE PERFORMANCE
        if (entry.duration > (hardwareTier === 'mid_optimized' ? 40 : 50)) {
          console.log('⚠️ Performance baja detectada, ajustando efectos...');
          adjustEffectsForPerformance();
        }
      });
    });
    
    observer.observe({ entryTypes: ['longtask'] });
  }
};

// ===== VENTANAS DE PRODUCTOS OPTIMIZADAS =====
const initProductModals = () => {
  console.log('🛒 Inicializando ventanas de productos optimizadas...');
  
  // Base de datos simple de productos
  const productDatabase = {
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

  // Función para crear un slide OPTIMIZADA
  const createSlide = (imageUrl, index) => {
    const slide = document.createElement('div');
    slide.className = `gallery-slide ${index === 0 ? 'active' : ''}`;
    slide.dataset.index = index;
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = currentProduct.title;
    img.className = 'gallery-image';
    img.loading = 'lazy';
    
    // OPTIMIZACIÓN: Pre-cargar siguiente imagen
    if (index === 0 && currentProduct.images.length > 1) {
      const nextImg = new Image();
      nextImg.src = currentProduct.images[1];
    }
    
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
    
    // Pre-cargar siguiente imagen
    const nextIndex = (index + 1) % slides.length;
    if (slides[nextIndex]) {
      const nextImg = slides[nextIndex].querySelector('img');
      if (nextImg && nextImg.src.includes('data:image')) {
        nextImg.src = currentProduct.images[nextIndex];
      }
    }
  };

  // Función para mostrar la modal OPTIMIZADA
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
    
    // Crear slides (solo cargar primera imagen inmediatamente)
    product.images.forEach((image, index) => {
      const slide = createSlide(index === 0 ? image : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', index);
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
    
    // Cargar demás imágenes en background
    setTimeout(() => {
      for (let i = 1; i < product.images.length; i++) {
        const img = slides[i].querySelector('img');
        if (img) {
          img.src = product.images[i];
        }
      }
    }, 300);
    
    console.log(`🛒 Mostrando producto: ${product.title}`);
  };

  // Función para ocultar la modal
  const hideModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    
    // Limpiar slides para liberar memoria
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

  // Navegación táctil para móvil OPTIMIZADA
  let touchStartX = 0;
  let touchEndX = 0;
  let lastSwipeTime = 0;
  const SWIPE_THROTTLE = 300;

  gallery.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  gallery.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastSwipeTime < SWIPE_THROTTLE) return;
    lastSwipeTime = now;
    
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = hardwareTier === 'mid_optimized' ? 60 : 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  console.log('✅ Sistema de ventanas de productos optimizado');
};

// ===== INICIALIZACIÓN PRINCIPAL OPTIMIZADA =====
const init = () => {
  console.log(`🚀 Iniciando Merke+ optimizado - Hardware: ${hardwareTier}`);
  
  // Configurar optimizaciones de hardware
  setupHardwareOptimizations();
  
  // CARGAR POR ETAPAS PARA MEJOR FLUIDEZ
  if (hardwareTier === 'mid_optimized' || hardwareTier === 'low') {
    console.log('⚡ Carga por etapas para mejor fluidez');
    
    // Etapa 1: Inmediato (crítico)
    initMobileMenu();
    initSmartLazyLoad();
    
    // Etapa 2: Con pequeño delay
    setTimeout(() => {
      initProductModals();
      setupNoisePro();
    }, 300);
    
    // Etapa 3: Con mayor delay
    setTimeout(() => {
      initTsParticles();
      initSmoothScroll();
      initScrollEffects();
      initSmartNotifications();
    }, 800);
    
    // Etapa 4: Después de que todo esté listo
    window.addEventListener('load', () => {
      setTimeout(() => {
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
      }, 1000);
    });
    
  } else {
    // Carga normal para hardware bueno
    initMobileMenu();
    initSmartLazyLoad();
    initSmartNotifications();
    initProductModals();
    
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
  }
  
  // Event listeners optimizados
  const scrollThrottle = hardwareTier === 'mid_optimized' ? 120 : (hardwareTier === 'low' ? 150 : 50);
  window.addEventListener('scroll', createThrottledListener('scroll', handleScroll, scrollThrottle), { passive: true });
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
}, 3000);

// ===== DEBUG HELPER MEJORADO =====
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
      gpu: detectGPU(),
      userAgent: navigator.userAgent.substring(0, 80)
    };
  },
  togglePerformanceMode: () => {
    if (hardwareTier === 'mid_optimized') {
      hardwareTier = 'mid';
      console.log('🔧 Cambiado a modo MID normal');
    } else if (hardwareTier === 'mid') {
      hardwareTier = 'mid_optimized';
      console.log('🔧 Cambiado a modo MID optimizado');
    }
    window.debugMerke.reloadEffects();
  }
};