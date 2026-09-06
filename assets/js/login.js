const clave_pacientes = "nutrivida_pacientes";
const formLogin = document.querySelector(".formulario");
const inputEmail = document.getElementById("loginEmail");
const inputPass = document.getElementById("loginPassword");
const mensaje = document.getElementById("mensajeLogin")

formLogin.addEventListener("submit", (event) => {
    event.preventDefault();
    iniciarSesion();

});

function iniciarSesion() {
    const email = inputEmail.value.trim().toLowerCase();
    const password = inputPass.value.trim();

    const datos = localStorage.getItem(clave_pacientes);

    if (datos === null) {
        alert("Sin usuarios en el sistema")
        return;
    }

    const listaPacientes = JSON.parse(datos);

    const paciente = listaPacientes.find(p => p.correo.toLowerCase() === email);

    if (!paciente) {
        alert("correo no registrado");
        return;
    }

    if (paciente.bloqueado) {
        alert("Esta cuenta ha sido bloqueada temporalmente");
        return;
    }

    if (typeof paciente.contrasena === password) {
        paciente.intentos = 0;
        localStorage.setItem(clave_pacientes, JSON.stringify(paciente));

        alert("inicio de session correcto");
        sessionStorage.setItem("usuarioActivo", JSON.stringify(paciente));
        window.location.href = "account.html"
    } else {
        paciente.intentos += 1;

        if (paciente.intentos >= 3) {
            paciente.bloqueado = true;
            alert("Cuenta bloqueada, intenta de nuevo mas tarde.");
        } else {
            const restante = 3 - paciente.intentos;
            alert("Contraseña/Correo incorrectos");
        }

        localStorage.setItem(clave_pacientes, JSON.stringify(listaPacientes));
    }


};