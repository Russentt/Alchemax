const clave_pacientes = "nutrivida_pacientes";
const formLogin = document.querySelector(".formulario");
const inputEmail = document.getElementById("loginEmail");
const inputPass = document.getElementById("loginPassword");
const mensaje = document.getElementById("mensajeLogin")

formLogin.addEventListener("submit", (event) => {
    event.preventDefault();
    iniciarSesion();

});

function mostrarMensaje(texto, tipo) {
    if (!mensaje) return;

    mensaje.textContent = texto;

    if (tipo === "success") {
        mensaje.className = "alert alert-success text-center py-2 mt-3";
    } else {
        mensaje.className = "alert alert-danger text-center py-2 mt-3"
    }
}

function iniciarSesion() {
    const email = inputEmail.value.trim().toLowerCase();
    const password = inputPass.value.trim();

    const datos = localStorage.getItem(clave_pacientes);

    if (datos === null) {
        mostrarMensaje("Sin usuarios en el sistema")
        return;
    }

    const listaPacientes = JSON.parse(datos);

    const paciente = listaPacientes.find(p => p.correo.toLowerCase() === email);

    if (!paciente) {
        mostrarMensaje("correo no registrado");
        return;
    }

    if (paciente.bloqueado) {
        mostrarMensaje("Esta cuenta ha sido bloqueada temporalmente");
        return;
    }

    if (typeof paciente.intentos === "undefined") {
        paciente.intentos = 0;
    };

    if (paciente.contrasena === password) {
        paciente.intentos = 0;
        localStorage.setItem(clave_pacientes, JSON.stringify(listaPacientes));

        mostrarMensaje("Inicio de sesión correcto");
        sessionStorage.setItem("usuarioActivo", JSON.stringify(paciente));
        window.location.href = "account.html";
    } else {
        paciente.intentos += 1;

        if (paciente.intentos >= 3) {
            paciente.bloqueado = true;
            mostrarMensaje("Cuenta bloqueada, intenta de nuevo más tarde.");
        } else {
            const restante = 3 - paciente.intentos;
            mostrarMensaje(`Contraseña incorrecta. Te quedan ${restante} intento(s).`);
        }

        localStorage.setItem(clave_pacientes, JSON.stringify(listaPacientes));
    }
console.log(paciente)

};