import type { Categoria } from "../types/index";

const normalizarNombre = (nombre: string): string => nombre.trim().toLowerCase();

export const StorageCategorias = {
    getCategorias: (): Categoria[] =>
        JSON.parse(localStorage.getItem("db_categorias") || "[]"),

    crearCategoria: (
        categoria: Omit<Categoria, "id">,
    ): { success: boolean; mensaje: string } => {
        const categorias = StorageCategorias.getCategorias();
        const nombreNormalizado = normalizarNombre(categoria.nombre);
        const existe = categorias.some(
            (actual) => normalizarNombre(actual.nombre) === nombreNormalizado,
        );

        if (existe) {
            return { success: false, mensaje: "Ya existe esta categoria" };
        }

        const nuevaCategoria: Categoria = {
            ...categoria,
            id: `cat-${Date.now()}`,
            serviciosAsociados: 0,
        };

        categorias.push(nuevaCategoria);
        localStorage.setItem("db_categorias", JSON.stringify(categorias));
        return { success: true, mensaje: "Categoria creada con exito" };
    },

    updateCategoria: (
        categoriaActualizada: Categoria,
    ): { success: boolean; mensaje: string } => {
        const categorias = StorageCategorias.getCategorias();
        const nombreNormalizado = normalizarNombre(categoriaActualizada.nombre);
        const existeNombre = categorias.some(
            (actual) =>
                actual.id !== categoriaActualizada.id &&
                normalizarNombre(actual.nombre) === nombreNormalizado,
        );

        if (existeNombre) {
            return { success: false, mensaje: "Ese nombre ya esta en uso" };
        }

        const nuevasCategorias = categorias.map((actual) =>
            actual.id === categoriaActualizada.id
                ? { ...actual, ...categoriaActualizada }
                : actual,
        );

        localStorage.setItem("db_categorias", JSON.stringify(nuevasCategorias));
        return { success: true, mensaje: "Categoria actualizada con exito" };
    },

    deleteCategoria: (id: string): void => {
        const categorias = StorageCategorias.getCategorias();
        const nuevasCategorias = categorias.filter((categoria) => categoria.id !== id);
        localStorage.setItem("db_categorias", JSON.stringify(nuevasCategorias));
    },
};