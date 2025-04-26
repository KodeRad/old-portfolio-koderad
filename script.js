"use strict";

// Selectors:
// Setions:
const section1 = document.querySelector("#section--1");
const allSections = document.querySelectorAll(".section");

// Navbars:
const nav = document.querySelector(".nav");
const navLinks = document.querySelector(".nav__links");
const footerLinks = document.querySelector(".footer__nav__list");
const menus = document.querySelectorAll(".menu");

// Others selectors:
const scrollDownImg = document.querySelector(".scroll__img");
const dotContainer = document.querySelector(".dots");

// Navbars

const navbarBehaviour = function () {
  // Smooth Scrolling:
  const smoothScrollHandler = function (e, target) {
    e.preventDefault();
    if (e.target.classList.contains(`${target}`)) {
      const id = e.target.getAttribute("href");
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
  };

  // Top navbar
  navLinks.addEventListener("click", (e) => {
    smoothScrollHandler(e, "nav__link");
  });

  // Bottom navbar
  footerLinks.addEventListener("click", (e) => {
    smoothScrollHandler(e, "footer__link");
  });

  // Menu fade out animation:

  const fadeOutHandler = function (e, opacity) {
    if (
      e.target.classList.contains("nav__link") ||
      e.target.classList.contains("footer__link")
    ) {
      // select (logo, siblings)
      const others = document.querySelectorAll(".fade__out");

      others.forEach((other) => {
        if (other !== e.target) {
          other.style.opacity = opacity;
        }
      });
    }
  };

  menus.forEach((menu) => {
    menu.addEventListener("mouseover", function (e) {
      fadeOutHandler(e, 0.5);
    });
    menu.addEventListener("mouseout", function (e) {
      fadeOutHandler(e, 1);
    });
  });
};

///////////////////////////////////
// Sticky Navigation:

const stickyNavFunction = function () {
  const stickyNav = function (entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        nav.classList.add("sticky");
        scrollDownImg.style.opacity = 0;
      }
      if (entry.isIntersecting) {
        nav.classList.remove("sticky");
        scrollDownImg.style.opacity = 1;
      }
    });
  };

  const section1Observer = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0.2,
    // TODO: Calculate rootMargin dynamically using .getBoundClientRect()
    rootMargin: "30px",
  });
  section1Observer.observe(section1);
};

///////////////////////////////////
// Sections reveal
// 0. hide sections
// 1. section observer
// 2. for each section reveal current section

const sectionsReveal = function () {
  allSections.forEach((section) => {
    section.classList.add("section--hidden");
  });
  const revealSection = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove("section--hidden");

    observer.unobserve(entry.target);
  };

  const sectionAllObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0,
    rootMargin: "0px",
  });
  allSections.forEach((section) => {
    sectionAllObserver.observe(section);
  });
};

///////////////////////////////////
// Project slider

const slider = function () {
  const slides = document.querySelectorAll(".project");
  const bttnLeft = document.querySelector(".slider__btn--left");
  const bttnRight = document.querySelector(".slider__btn--right");
  let curSlide = 0;
  const maxSlide = slides.length - 1;

  // Dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  createDots();

  const activeDot = function () {
    slides.forEach((slide) => {
      if (slide.style.transform === "translateX(0%)") {
        const slideNumber = slide.classList.value.slice(-1);

        document.querySelectorAll(".dots__dot").forEach((dot) => {
          if (dot.dataset.slide === `${slideNumber - 1}`) {
            dot.classList.add("dot__active");
          } else dot.classList.remove("dot__active");
        });
      }
    });
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      // slide 0: 0%, 100%, 200%
      s.style.transform = `translateX(${100 * (slide + i)}%)`;
      activeDot();
    });
  };

  goToSlide(curSlide);

  const nextSlide = function () {
    if (curSlide === maxSlide * -1) {
      curSlide = 0;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide * -1;
    } else curSlide++;
    goToSlide(curSlide);
  };

  bttnLeft.addEventListener("click", prevSlide);
  bttnRight.addEventListener("click", nextSlide);

  document.addEventListener("keydown", function (e) {
    e.preventDefault();
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    e.preventDefault();
    // matching strategy
    if (!e.target.classList.contains("dots__dot")) return;

    curSlide = e.target.dataset.slide * -1;

    goToSlide(curSlide);
  });
};

///////////////////

// Toggl API hours spent programming
const getTime = function () {
  const url = "https://koderad-api.onrender.com/toggl";

  async function getTimeLearning() {
    try {
      const response = await fetch(url, {
        method: "GET",
      });
      const hours = await response.json();

      // DOM Manipulation
      document.getElementById(
        "skills_description"
      ).textContent = `I have spent ${hours} hours (current time form API!) learning mainly JavaScript along with
      HTML and CSS. Thanks to that commitment I believe I will bring a lot
      to the table if we ever met business-wise.`;
    } catch (error) {
      console.error(error);
    }
  }
  getTimeLearning();
};

///////////////////////////////////

// Chuck Norris
const chuckAPI = async function () {
  const url = "https://api.chucknorris.io/jokes/random";

  // Helper function for banned words
  function checkForBan(array, words) {
    const result = array.some((el) => words.includes(el));
    return result;
  }

  try {
    const response = await fetch(url);
    const result = await response.json();
    const joke = result.value;
    const jokeArr = joke.split(" ");
    const bannedWords = [
      "black",  "sperm",  "rectum",  "dick",  "urine",  "semen",  "penis",  "whore",  "whores",  "pussy",  "racism",  "mother", 'bitch', 'woman', 'cock', 'women', 'cum']; // prettier-ignore

    // guard clauses for banned words/length
    if (checkForBan(jokeArr, bannedWords) && jokeArr.length > 37) chuckAPI();

    document.querySelector(".joke").textContent = `"${joke}"`;
    return result.value;
  } catch (error) {
    console.error(error);
  }
};

document.querySelector(".btn__joke").addEventListener("click", function (e) {
  e.preventDefault();
  chuckAPI();
});

function handleLargeScreen() {
  navbarBehaviour();
  stickyNavFunction();
  sectionsReveal();
  slider();
  chuckAPI();
}

function handleSmallScreen() {
  sectionsReveal();
  slider();
  chuckAPI();
}

// Check screen size on page load and resize
function checkScreenSize() {
  if (window.innerWidth <= 901) {
    handleSmallScreen();
  } else {
    handleLargeScreen();
  }
}

// Call checkScreenSize on page load
window.addEventListener("load", checkScreenSize);

// Call checkScreenSize on window resize DEBOUNCING

function debounce(callback, delay) {
  let timeoutId;
  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
}

window.addEventListener("resize", function () {
  debounce(checkScreenSize, 500);
});
