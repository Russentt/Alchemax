export interface Usuario {
    id?: string;
    nombre: string;
    email: string;
    genero: "masculino" | "femenino" | "otro" | string;
    password?: string;
    rol: "admin" | "usuario" | "nutricionista";
    fechaNacimiento: string;
    // Campos añadidos para personalización de perfil
    fotoPerfil?: string;
    pesoActual?: number;
    objetivoPrincipal?: string;
}