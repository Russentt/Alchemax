const formulario = document.querySelector(".formulario");
const nombre = document.getElementById("regNombre");
const fechaNacimiento = document.getElementById("regFechaNac");
const genero = document.getElementById("regGenero");
const direccion = document.getElementById("regDireccion");
const region = document.getElementById("regRegion");
const correo = document.getElementById("regEmail");
const contrasena = document.getElementById("regPassword");
const confirmarContrasena = document.getElementById("regConfirmPassword");
const modal = document.getElementById("myModal");
const btnCerrar = document.querySelector(".close");

const alertas = document.querySelectorAll(".invalid");
const alertaClave = document.querySelector("#coincidenciaClave");

const clave_pacientes = "nutrivida_pacientes";

const regexSegura = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

window.addEventListener("DOMContentLoaded", () => {
  const navigation = performance.getEntriesByType("navigation")[0];

  if (navigation && navigation.type === "reload") {
    nombre.value = "";
    direccion.value = "";
    correo.value = "";
  }
});

function obtenerPaciente() {
  const datos = localStorage.getItem(clave_pacientes);
  if (datos === null) return [];
  return JSON.parse(datos);
}

function guardarPacientes(pacientes) {
  const pacienteJSON = JSON.stringify(pacientes)
  localStorage.setItem(clave_pacientes, pacienteJSON);
}

function agregarPaciente(paciente) {
  const pacientes = obtenerPaciente();
  pacientes.push(paciente);
  guardarPacientes(pacientes);
}

function displayAlerta() {
  const campos = [nombre, direccion, correo, contrasena, confirmarContrasena];
  for (let index = 0; index < campos.length; index++) {
    const element = campos[index];
    if (element.value != "") alertas[index].style.display = "none";
  }
}

function displayClave() {
  if (contrasena.value === confirmarContrasena.value) {
    alertaClave.style.display = "none";
  } else {
    alertaClave.style.display = "block";
  }
}

function displays() {
  setInterval(displayAlerta, 10);
  setInterval(displayClave, 10);
}

function edadUsuario() {
  if (fechaNacimiento.value === undefined) return;
  const fechaNac = new Date(fechaNacimiento.value);
  const fechaActual = new Date();

  let edad = fechaActual.getFullYear() - fechaNac.getFullYear();
  const mesesDiff = fechaActual.getMonth() - fechaNac.getMonth();

  if (
    mesesDiff < 0 ||
    (mesesDiff === 0 && fechaActual.getDate() < fechaNac.getDate())
  ) {
    edad--;
  }

  return edad;
}

displays();

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  let flag = true;
  let dominioValido = /[@]duocuc.cl$/i;
  const campos = [nombre, direccion, correo, contrasena, confirmarContrasena];
  for (let index = 0; index < campos.length; index++) {
    const element = campos[index];
    if (element.value === "" || element === undefined) {
      flag = false;
      mostrarError("REGISTRO FALLIDO.");
      return;
    }

    if (nombre.value.trim() === "") {
      mostrarError("REGISTRO FALLIDO. Nombre invalido");
      return;
    }

  }

  if (!correo.value.match(dominioValido)) {
    flag = false;
    mostrarError("REGISTRO FALLIDO. Correo invalido");
    return;
  }

  const pacientesExist = obtenerPaciente();
  const correoIngresado = correo.value.trim().toLowerCase();
  const registrado = pacientesExist.some(
    (p) => p.correo && p.correo.trim().toLowerCase() === correoIngresado
  );

  if (registrado) {
    flag = false;
    mostrarError("Registro fallido. este correo ta se encuentra registrado.")
    return;
  }

  if (!regexSegura.test(contrasena.value)) {
    flag = false;
    mostrarError("La contraseña requiere minimo 6 caracteres, 1 mayuscula, 1 minuscula y 1 numero");
    return;
  }

  if (edadUsuario() < 14) {
    flag = false;
    mostrarError("REGISTRO FALLIDO, Edad insuficiente");
    return;
  }
  const nuevoPaciente = {
      id: crypto.randomUUID(),
      nombre: nombre.value,
      fechaNac: fechaNacimiento.value,
      genero: genero.value,
      direccion: direccion.value,
      region: region.value,
      correo: correo.value,
      contrasena: contrasena.value,
      confContra: confirmarContrasena.value
  }
  agregarPaciente(nuevoPaciente);
  formulario.reset();
  modal.style.display = "block";
});

btnCerrar.addEventListener("click", ()=>{
    modal.style.display = "none";
    document.body.classList.remove("modal-active");
}
);


function mostrarError(mensaje) {
  let contenedor = document.getElementById("AlertaFlotanteError");

  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.id = "AlertaFlotanteError";
    contenedor.className = "position-fixed top-0 start-50 translate-middle-x p-3";
    contenedor.style.zIndex = "9999"; 
    contenedor.style.width = "90%";
    contenedor.style.maxWidth = "500px";
    document.body.appendChild(contenedor);
  }

  contenedor.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show shadow-lg border-2 border-danger-subtle rounded-3 d-flex align-items-center gap-2 mb-0" role="alert">
      <span class="fs-4">⚠️</span>
      <div class="fw-semibold small flex-grow-1">
        ${mensaje}
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;

  clearTimeout(window.timerAlertaError);
  window.timerAlertaError = setTimeout(() => {
    const alertEl = contenedor.querySelector(".alert");
    if (alertEl) {
      alertEl.classList.remove("show");
      setTimeout(() => alertEl.remove(), 200);
    }
  }, 4000);

}