'use strict'

const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows());
	}
};

// прокрутка при кліку на посилання

const menuLinks = document.querySelectorAll('.menu__link--simple');
const menuSubLinks = document.querySelectorAll('.menu__sub-link');

if (menuSubLinks.length > 0) {
  menuSubLinks.forEach(menuSubLink => {
    menuSubLink.addEventListener("click", onMenuSubLinkClick);
  })

  function onMenuSubLinkClick(e) {
      if (iconMenu.classList.contains('_active')) {
        menuBody.classList.remove('_active');
        iconMenu.classList.remove('_active');
        document.body.classList.remove('_lock');
      }
    }
  }

if (menuLinks.length > 0) {
  menuLinks.forEach(menuLink => {
    menuLink.addEventListener("click", onMenuLinkClick);
  });

  function onMenuLinkClick(e) {
    console.log('click on menu item');
    if (iconMenu.classList.contains('_active')) {
      menuBody.classList.remove('_active');
      iconMenu.classList.remove('_active');
      document.body.classList.remove('_lock');
    }

    

    // if(menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
    //   e.preventDefault();
    //   const gotoBlock = document.querySelector(menuLink.dataset.goto);

    //   const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;


    //   window.scrollTo({
    //     top: gotoBlockValue,
    //     behavior: "smooth"
    //   });
    // }

  }
  }

// прокрутка при кліку на посилання end

const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');

if(iconMenu) {
  iconMenu.addEventListener('click', function() {
    menuBody.classList.toggle('_active');
    iconMenu.classList.toggle('_active');
    document.body.classList.toggle('_lock');
  })
}



if (isMobile.any()) {
  document.body.classList.add('_touch');

  let menuArrows = document.querySelectorAll('.menu__arrow');
  let categoriesLink = document.querySelector('.menu__link--categories')

  if (menuArrows.length > 0 ) {
    for (let i = 0; i < menuArrows.length; i++) {
      const menuArrow = menuArrows[i];

      menuArrow.addEventListener("click", function(e) {
        menuArrow.parentElement.classList.toggle('_active');
      })

      categoriesLink.addEventListener('click', function (e) {
        menuArrow.parentElement.classList.toggle('_active');
      })
    }

  }
} else {
  document.body.classList.add('_pc');
}


// підключення footer

fetch('footer.html')
  .then(response => response.text())
  .then(data => {
      document.getElementById('footer').innerHTML = data;
  });

// функціонал навігації по контенту


document.addEventListener('DOMContentLoaded', function() {
      // Початкове налаштування обробників подій для посилань
      
      
      setLinkEventHandlers();

      // Обробка події popstate для кнопок "Назад" і "Вперед" браузера
      window.addEventListener('popstate', function(event) {
          if (event.state && event.state.page) {
              loadPage(event.state.page);
          } else {
              loadPage('home'); // Завантаження сторінки за замовчуванням, якщо state відсутній
          }
      });

      // Завантажуємо сторінку на основі хешу в URL або "home" за замовчуванням
      const currentPage = window.location.hash ? window.location.hash.substring(1) : 'home';
      loadPage(currentPage);
});

function setLinkEventHandlers() {
   // Використовуємо делегування подій для обробки кліків на посилання з класом 'link-to-page'
    document.body.addEventListener('click', function(event) {
    const link = event.target.closest('.link-to-page'); // Перевірка, чи клік був по посиланню

    if (link) {
      event.preventDefault(); // Запобігаємо переходу по посиланню

      const page = link.getAttribute('data-page'); // Отримуємо значення атрибуту data-page

      // Завантажуємо потрібну сторінку
      if (link.dataset.goto) {
        loadPage(page, link.dataset.goto);
      } else {
        loadPage(page);
      }

      // Оновлюємо URL без перезавантаження сторінки
      history.pushState({page: page}, '', `#${page}`);
    }
});
}

function loadPage(page, goto) {
  const mainContent = document.getElementById('main-content');
    const filePath = `${page}.html`; // Визначаємо шлях до файлу
    

    fetch(filePath)
        .then(response => response.text())
        .then(html => {
            mainContent.innerHTML = html; // Вставляємо HTML-контент в main
            // setLinkEventHandlers(); // Після оновлення контенту, оновлюємо обробники подій
            initializeSwiper(); // Ініціалізуємо Swiper для новозавантаженого контенту
            productsLoad(page);

            if (goto) {
              const gotoBlock = document.querySelector(goto);
              const gotoBlockV = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

              window.scrollTo({
                top: gotoBlockV,
                behavior: "smooth"
              });
            } else {
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
            }
        })
        .catch(error => {
            console.error('Помилка завантаження сторінки:', error);
            mainContent.innerHTML = '<p>Помилка завантаження сторінки. Спробуйте ще раз пізніше.</p>';
        });
}

const productsLoad = (category) => {
  const productContainer = document.querySelector(`.products--${category}`);
  const pagination = document.querySelector(`.pagination--${category}`);
  const nextPagination = document.querySelector('.next-button');
  const prevPagination = document.querySelector('.prev-button');


  let productsOnPage = products;

  let productsForCategory = [...productsOnPage].filter(item => item.category === category);
  let productCount = 8;
  let currentPage = 1;

  if (productContainer) {
    const renderProducts = (items, container, numberOfProducts, page) => {
      container.innerHTML = "";
  
      const firstProductIndex = numberOfProducts * page - numberOfProducts;
  
      const lastProductsIndex = firstProductIndex + numberOfProducts;
  
      productsOnPage = items.slice(firstProductIndex, lastProductsIndex);
  
      productsOnPage.forEach(({title, price, prevPrice, href, productDiscount, image}) => {
        const divItem = document.createElement('div');
        
        divItem.classList.add('products__product', 'product');
  
        divItem.innerHTML = `
              <div class="product__img">
                <img src="${image}" alt="${title}">
              </div>
              <div class="product__discount">-${productDiscount}%</div>
              <div class="product__title truncate">${title}</div>
              <div class="product__prices">
                <div class="product__prev-price">${prevPrice}</div>
                <div class="product__price">${price}</div>
              </div>
              <a href="${href}" class="product__read-more">Детальніше</a>
            `
        container.append(divItem);
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }

    const renderPagination = (products, numberOfProducts) => {

      const pageCount = Math.ceil(products.length / numberOfProducts);

      if (pageCount > 1) {
        const ul = document.querySelector('.pagination_list');

        for (let i = 1; i <= pageCount; i++) {
          const li = renderBtn(i);
          ul.append(li);
        }

        pagination.classList.remove('pagination__hidden');
      }

      
    }

    const renderBtn = (page) => {
      const li = document.createElement('li');
      
      li.classList.add('pagination_item');
      
      li.textContent =page;

      if(currentPage === page) {
        li.classList.add('pagination_item--active');
      };

      return li;
    }

    const updatePagination = () => {
      pagination.addEventListener('click', (e) => {
        if(!e.target.closest('.pagination_item')) {
          return;
        } else {
          currentPage = e.target.textContent;

          renderProducts(productsForCategory, productContainer, productCount, currentPage);

          let currentLi = document.querySelector('.pagination_item--active');
          currentLi.classList.remove('pagination_item--active');
          e.target.classList.add('pagination_item--active');
        }
      })
    }

    renderProducts(productsForCategory, productContainer, productCount, currentPage);
    renderPagination(productsForCategory, productCount);
    updatePagination();

    const liElements = document.querySelectorAll('.pagination_item');

    const handlePagination = (e) => {
      const currentActiveLi = document.querySelector('.pagination_item--active');
      let newActiveLi;

      if (e.target.closest('.next-button')) {
        newActiveLi = currentActiveLi.nextElementSibling;

        currentPage++;
      } else {
        newActiveLi = currentActiveLi.previousElementSibling;

        currentPage--;
      };

      if(!newActiveLi && e.target.closest('.next-button')) {
        newActiveLi = liElements[0];
      } else if (!newActiveLi) {
        newActiveLi = liElements[liElements.length - 1];
      };

      if (currentPage > liElements.length) {
        currentPage = 1;
      } else if (currentPage < 1) {
        currentPage = liElements.length
      }

      currentActiveLi.classList.remove('pagination_item--active');
      newActiveLi.classList.add('pagination_item--active');

      renderProducts(productsForCategory, productContainer, productCount, currentPage);
    }

    nextPagination.addEventListener('click', handlePagination);
    prevPagination.addEventListener('click', handlePagination);

  }
}

function initializeSwiper() {
  const swiper = new Swiper('.swiper', {
      slidesPerView: 1,
      spaceBetween: 10,

      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
      loop: true, // Приклад налаштування циклічного показу слайдів
  });
}


