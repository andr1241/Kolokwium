import './scss/main.scss'

// Mobile menu handling
document.querySelector('.header__menu-button').addEventListener('click', () => {
  document.querySelector('.header__nav').classList.toggle('header__nav--active');
});

// Оптимизация загрузки изображений
document.addEventListener('DOMContentLoaded', () => {
  // Ленивая загрузка изображений
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('loading' in HTMLImageElement.prototype) {
    lazyImages.forEach(img => {
      img.classList.add('lazy-image');
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    });
  } else {
    // Fallback для браузеров без поддержки loading="lazy"
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('lazy-image');
          img.src = img.dataset.src;
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => lazyImageObserver.observe(img));
  }

  // Оптимизация прокрутки навигации
  const nav = document.querySelector('.main-nav');
  let isScrolling;

  nav.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    
    isScrolling = setTimeout(() => {
      const items = nav.querySelectorAll('.nav-link');
      const center = nav.offsetWidth / 2;
      
      let closest = null;
      let minDistance = Infinity;
      
      items.forEach(item => {
        const box = item.getBoundingClientRect();
        const offset = box.x + (box.width / 2);
        const distance = Math.abs(offset - center);
        
        if (distance < minDistance) {
          minDistance = distance;
          closest = item;
        }
      });
      
      if (closest) {
        closest.scrollIntoView({
          behavior: 'smooth',
          inline: 'center'
        });
      }
    }, 150);
  }, { passive: true });

  // Предзагрузка изображений для следующих новостей
  const preloadNextImages = () => {
    const images = document.querySelectorAll('.news-card img:not([loaded])');
    const preloadImage = (img) => {
      const src = img.getAttribute('src');
      if (!src) return;
      
      const image = new Image();
      image.onload = () => {
        img.setAttribute('loaded', '');
      };
      image.src = src;
    };

    requestIdleCallback(() => {
      images.forEach(preloadImage);
    });
  };

  // Запускаем предзагрузку когда браузер не занят
  requestIdleCallback(preloadNextImages);
});
