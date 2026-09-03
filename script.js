const formulario = document.querySelector(".formulario");
const modal = document.querySelector(".modal");
const span = document.querySelector(".close");

formulario.addEventListener("click", (event) => {
  event.preventDefault();
  modal.style.display = "block";
});

span.onclick = function () {
  modal.style.display = "none";
};
