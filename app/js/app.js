const app = () => {
  return {
    nav: false,
    bioTab: "exp",
    popup: null,

    toggleNav() {
      const burgerIcon = document.querySelector(".header-burger");
      const closeIcon = document.querySelector(".header-close");

      burgerIcon.classList.toggle("hidden");

      if (burgerIcon.classList.contains("hidden")) {
        this.nav = true;

        setTimeout(() => {
          closeIcon.classList.add("active");
        }, 200);
      } else {
        closeIcon.classList.remove("active");
        this.nav = false;
      }
    },

    selectTab(id) {
      this.bioTab = id;
    },

    openPopup(id) {
      this.popup = id;
    },

    closePopup() {
      this.popup = null;
    },

    handleReviewTranslator(elem) {
      if (elem.closest(".translator-select")) return;

      const translator = elem.closest(".translator");
      if (translator) return translator.classList.toggle("translator--active");

      const translators = document.querySelectorAll(".translator");
      translators.forEach((item) => {
        item.classList.remove("translator--active");
      });
    },

    selectLanguage(lang) {
      const langSelect = document.querySelector(".goog-te-combo");
      if (!langSelect) return;
      langSelect.value = lang;
      langSelect.dispatchEvent(new Event("change"));
      langSelect.dispatchEvent(new Event("change"));
    },

    handleReviewMore(elem) {
      const moreBtn = elem.closest(".reviews__more");

      if (!moreBtn) return;

      const showMoreBtn = moreBtn.querySelector(".show");
      const hideMoreBtn = moreBtn.querySelector(".hide");

      if (moreBtn.classList.contains("reviews__more--active")) {
        moreBtn.classList.remove("reviews__more--active");
        showMoreBtn.style.display = "block";
        hideMoreBtn.style.display = "none";
      } else {
        moreBtn.classList.add("reviews__more--active");
        showMoreBtn.style.display = "none";
        hideMoreBtn.style.display = "block";
      }
    },

    preloader() {
      const preloader = document.querySelector(".preloader");
      if (!preloader) return;

      const preloaderWaves = preloader.querySelector(".preloader__anim");
      const logo = preloader.querySelector("video");

      if (preloader) {
        logo.addEventListener("ended", () => {
          preloader.classList.add("active");
          preloaderWaves.classList.add("active");
          logo.remove();

          setTimeout(() => {
            preloader.remove();
          }, 1200);
        });
      }
    },

    playVideo(elem) {
      const item = elem.closest(".specs__item");
      const video = item.querySelector("video");
      if (video.hasAttribute("autoplay")) return;
      video.play();
    },

    stopVideo(elem) {
      const item = elem.closest(".specs__item");
      const video = item.querySelector("video");
      if (video.hasAttribute("autoplay")) return;
      video.pause();
    },

    checkContactForm() {
      const inputs = document.querySelectorAll(".popup-contacts input.popup__input");
      const button = document.querySelector(".popup-contacts .popup__submit");
      let filledFlag = true;

      inputs.forEach((input) => {
        const label = input.closest('.popup__label');

        if (input.value.trim() === "") {
          filledFlag = false;
          label?.classList.remove('is-valid');
        } else if (input.checkValidity()) {
          label?.classList.add('is-valid');
        } else {
          label?.classList.remove('is-valid');
        }
      });

      if (filledFlag) {
        button.classList.add("filled");
      } else {
        button.classList.remove("filled");
      }
    },

    clearFieldError(input) {
      const label = input.closest('.popup__label');
      if (label) {
        label.classList.remove('has-error');
      }
    },

    validateField(input) {
      const label = input.closest('.popup__label');
      if (!label) return;

      const isValid = input.value.trim() !== '' && input.checkValidity();

      if (isValid) {
        label.classList.add('is-valid');
        label.classList.remove('has-error');
      } else {
        label.classList.remove('is-valid');
      }
    },

    clearInput(event) {
      const target = event.target || event.srcElement;
      const button = target.closest('.popup__input-action');
      const label = button.closest('.popup__label');
      const input = label.querySelector('.popup__input');

      input.value = '';
      input.focus();
      label.classList.remove('is-valid', 'has-error');

      if (input.tagName === 'TEXTAREA') {
        this.updateCharCount(input);
      }

      this.checkContactForm();
    },

    updateCharCount(textarea) {
      const label = textarea.closest('.popup__label');
      const counter = label.querySelector('.popup__char-count .current');
      if (counter) {
        counter.textContent = textarea.value.length;
      }
    },

    handleContactSubmit(event) {      
      event.preventDefault();
      const form = event.target;
      const inputs = form.querySelectorAll('.popup__input[required]');
      let isValid = true;

      inputs.forEach((input) => {
        const label = input.closest('.popup__label');
        const isEmpty = input.value.trim() === '';
        const isInputValid = input.checkValidity();

        if (isEmpty || !isInputValid) {
          isValid = false;
          label.classList.add('has-error');
          label.classList.remove('is-valid');
        } else {
          label.classList.remove('has-error');
          label.classList.add('is-valid');
        }
      });

      if (isValid) {
        this.formHandler(form);
      }
    },

    hideNotification(elem) {
      if (!elem.classList.contains("notifications__item")) return;
      elem.classList.remove("active");
    },

    formHandler(form) {
      grecaptcha.ready(() => {
        grecaptcha
          .execute("6LcLO7oqAAAAADupdmTgDFkb71zfqdidCk4SL4pW", {
            action: "submit",
          })
          .then((token) => {
            const request = new XMLHttpRequest();

            request.onload = () => {
              if (request.status === 200) {
                this.popup = null;
                form.reset();

                const notifications = document.querySelectorAll(".notifications__item");
                for (let i = 0; i < notifications.length; i++) {
                  setTimeout(() => {
                    notifications[i].classList.add("active");
                  }, i * 1000);
                }
              }
            };

            request.open("POST", "/form-handler.php", true);

            const data = new FormData(form);
            data.append("recaptcha_response", token);
            request.send(data);
          });
      });
    },
  };
};

const header = document.querySelector(".header");
if (!header.classList.contains("header-center")) {
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > (window.innerWidth > 968 ? window.innerHeight - header.offsetHeight : 50)) {
        header.classList.add("scrolled");
        if (window.innerWidth > 968) header.classList.add("header-center");
      } else {
        header.classList.remove("scrolled");
        if (window.innerWidth > 968) header.classList.remove("header-center");
      }
    },
    { passive: true }
  );
}

const pageTitle = document.querySelector(".title-wrapper");
if (pageTitle && window.innerWidth <= 768) {
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 15) {
        pageTitle.classList.add("scrolled");
      } else {
        pageTitle.classList.remove("scrolled");
      }
    },
    { passive: true }
  );
}

new Swiper(".hero-container", {
  resistanceRatio: 0,
  navigation: {
    nextEl: ".swiper-arrow-next",
    prevEl: ".swiper-arrow-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: "auto",
      spaceBetween: 8,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    1048: {
      slidesPerView: 1,
    },
  },
  on: {
    init: updateSwiperPagination,
    slideChange: updateSwiperPagination,
  },
});

new Swiper(".comps-container", {
  slidesPerView: "auto",
  loop: true,
  loopAdditionalSlides: 1,
  maxBackfaceHiddenSlides: 0,
  navigation: {
    nextEl: ".comps__nav_arrow--next",
    prevEl: ".comps__nav_arrow--prev",
  },
  breakpoints: {
    0: {
      spaceBetween: 30,
      centeredSlides: true,
      initialSlide: 3,
    },
    768: {
      centeredSlides: false,
      spaceBetween: 60,
    },
  },
});

new Swiper(".reviews-container", {
  slidesPerView: "auto",
  loop: true,
  maxBackfaceHiddenSlides: 0,
  navigation: {
    nextEl: ".reviews__nav_arrow--next",
    prevEl: ".reviews__nav_arrow--prev",
  },
  breakpoints: {
    0: {
      spaceBetween: 15,
      slidesOffsetBefore: 15,
      slidesOffsetAfter: 15,
    },
    768: {
      spaceBetween: 300,
      centeredSlides: true,
    },
  },
});

if (window.innerWidth <= 1200) {
  new Swiper(".specs-container", {
    resistanceRatio: 0,
    breakpoints: {
      0: {
        slidesPerView: "auto",
        spaceBetween: 15,
        slidesOffsetBefore: 15,
        slidesOffsetAfter: 15,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    },
    on: {
      init: function () {
        this.slides.forEach((slide) => {
          const video = slide.querySelector("video");
          video.setAttribute("autoplay", true);
        });
      },
    },
  });
}

const bioSliders = document.querySelectorAll(".bio__meta.swiper");
for (slider of bioSliders) {
  new Swiper(slider, {
    slidesPerView: "auto",
    spaceBetween: 8,
    breakpoints: {
      0: {
        slidesOffsetBefore: 16,
        slidesOffsetAfter: 16
      },
      768: {
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
      }
    }
  });
}

function updateSwiperPagination() {
  this.el.querySelector(".hero__slider_pagination--counter").innerHTML =
    '<span class="current-slide">' +
    (this.realIndex + 1) +
    '</span> / <span class="total-slides">' +
    this.el.querySelectorAll(".swiper-slide").length +
    "</span>";
}
