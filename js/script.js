document.addEventListener('DOMContentLoaded', () => {
  // Elements for parallax effect (solo los que tienen data-speed)
  const parallaxElements = document.querySelectorAll('[data-speed]');
  const revealElements = document.querySelectorAll('.reveal');
  const header = document.querySelector('header');

  // Reveal on scroll function (optimizada)
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach(element => {
      const revealTop = element.getBoundingClientRect().top;
      
      if (revealTop < windowHeight - revealPoint) {
        element.classList.add('active');
      }
    });
  };

  // Parallax scroll effect (optimizado y controlado)
  let ticking = false;

  const updateEffects = () => {
    const scrollY = window.scrollY;
    
    // Parallax suave solo para elementos específicos
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0;
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        // Parallax mucho más suave y limitado
        const yPos = -(scrollY * speed * 0.15);
        
        // Solo aplicar si el elemento es visible
        if (Math.abs(yPos) < 100) { // Limitar el movimiento máximo
          el.style.transform = `translateY(${yPos}px)`;
        }
      } else {
        // Resetear transform cuando no es visible
        el.style.transform = 'translateY(0)';
      }
    });

    // Header background on scroll
    header.classList.toggle('scrolled', scrollY > 50);
    
    // Trigger reveal animations
    revealOnScroll();
    
    ticking = false;
  };

  // Scroll event optimizado
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateEffects();
      });
      ticking = true;
    }
  });

  // Initial reveal check
  revealOnScroll();

  // Smooth scroll for navigation links
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Desactivar parallax temporalmente
        parallaxElements.forEach(el => {
          el.style.transition = 'transform 0.3s ease';
          el.style.transform = 'translateY(0)';
        });
        
        // Calcular posición con offset para el header
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Reactivar efectos después del scroll
        setTimeout(() => {
          parallaxElements.forEach(el => {
            el.style.transition = '';
          });
          updateEffects();
        }, 800);
      }
    });
  });

  // Add hover effect to cards
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.4s ease';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transition = 'all 0.4s ease';
    });
  });

  // Add animation delay for staggered reveals
  document.querySelectorAll('.grid .card').forEach((card, index) => {
    card.style.setProperty('--index', index);
    card.style.transitionDelay = `${index * 0.1}s`;
  });

  // Intersection Observer para reveal (mejor performance)
  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  // Observar todos los elementos reveal
  revealElements.forEach(el => {
    observer.observe(el);
  });

  // Fix para el iframe del mapa
  const iframe = document.querySelector('iframe');
  if (iframe) {
    iframe.addEventListener('load', () => {
      // Asegurar que el iframe no cause problemas de layout
      iframe.style.opacity = '1';
      iframe.style.transition = 'opacity 0.5s ease';
    });
  }

  // Resetear efectos cuando se redimensiona
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      parallaxElements.forEach(el => {
        el.style.transform = '';
      });
      updateEffects();
    }, 250);
  });

  // Inicializar efectos al cargar
  setTimeout(() => {
    updateEffects();
  }, 100);
});


const splineWrapper = document.querySelector('.spline-wrapper');

if (splineWrapper) {
  splineWrapper.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );
}
