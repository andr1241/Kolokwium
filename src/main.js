import './scss/style.scss'

// Обработка мобильного меню
document.querySelector('.header__menu-button').addEventListener('click', () => {
  document.querySelector('.header__nav').classList.toggle('header__nav--active');
});
