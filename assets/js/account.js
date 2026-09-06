document.addEventListener("DOMContentLoaded", () => {
    const sesionActiva = sessionStorage.getItem("usuarioActivo");

    if (!sesionActiva) {
        alert("Debes iniciar sesión para acceder a tu cuenta.");
        window.location.href = "login.html";
        return;
    }

    const paciente = JSON.parse(sesionActiva);

    const correo = document.getElementById("perfilCorreo");
    const fechaNac = document.getElementById("perfilAnos");
    const direccion = document.getElementById("perfilDireccion");

    if (correo) correo.textContent = paciente.correo;
    if (fechaNac) fechaNac.textContent = paciente.fechaNac;
    if (direccion) direccion.textContent = paciente.direccion;

    const btnCerrar = document.getElementById("btnCerrarSesion");

    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            sessionStorage.removeItem("usuarioActivo");
            window.location.href = "login.html";
        });
    }

    const camposNombre = document.querySelectorAll(".paciente-nombre");
    camposNombre.forEach(elemento => {
    elemento.textContent = paciente.nombre;
    });

});