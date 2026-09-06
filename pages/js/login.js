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

    const pacEncontrado = listaPacientes.find(paciente => 
        paciente.correo.toLowerCase() === email && paciente.contrasena === password
    );

    if (pacEncontrado) {
        alert("Inicio de session correcto")
        sessionStorage.setItem("usuarioActivo", JSON.stringify(pacEncontrado));
        
    } else {
        alert("Correo/Clave invalidos")
    }

};