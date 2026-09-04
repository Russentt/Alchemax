const formulario = document.querySelector(".formulario");
const modal = document.querySelector(".modal");
const span = document.querySelector(".close");

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  modal.style.display = "block";
});

span.onclick = function () {
  modal.style.display = "none";
};

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");

  document.addEventListener("mousemove", (e) => {
    if (e.clientY <= 80 || header.contains(e.target)) {
      header.classList.add("nav-visible");
    } else {
      header.classList.remove("nav-visible");
    }
  });

  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    if (window.matchMedia("(hover: none)").matches) {
      if (window.scrollY < lastScrollY) {
        header.classList.add("nav-visible");
      } else if (window.scrollY > 80) {
        header.classList.remove("nav-visible");
      }
    }
    lastScrollY = window.scrollY;
  });
});
