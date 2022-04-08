import "../src/assets/ts/common";
import "../src/assets/ts/Grid/gridIndex";
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-links");
const mobileNav = () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
};
hamburger.addEventListener("click", mobileNav);
