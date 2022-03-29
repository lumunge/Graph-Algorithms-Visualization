const hamburger = document.querySelector(".hamburger") as HTMLElement;
const navMenu = document.querySelector(".nav-links") as HTMLElement;

const mobileNav = () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
};

hamburger.addEventListener("click", mobileNav);
