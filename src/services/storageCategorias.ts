import type { Categoria } from "../types/index"; 


export const StorageCategorias = {
    getCategorias: (): Categoria[] => {
        return JSON.parse(localStorage.getItem("db_categorias")|| "[]");
    },

    crearCategoria: (
        categoria: Omit<Categoria, "id">
    ): {success: boolean; mensaje: string} => {
        const categorias = StorageCategorias.getCategorias();

    const existe = categorias.some(
        (c) => c.nombre.trim().toLowerCase() === categoria.nombre.trim().toLowerCase()
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
        categoriaActualizada: Categoria
    ): { success: boolean; mensaje: string } => {
        const categorias = StorageCategorias.getCategorias();

        const existeNombre = categorias.some(
            (c) => c.nombre.trim().toLowerCase() === categoriaActualizada.nombre.trim().toLowerCase()
        );

        if (existeNombre) {
            return { success: false, mensaje: "Ese nombre ya esta en uso" }
        }

        const nuevasCategorias = categorias.map(
            (c) => c.id === categoriaActualizada.id ? { ...c, ...categoriaActualizada }: c
        );

        localStorage.setItem("db_categorias", JSON.stringify(nuevasCategorias));
        return { success: true, mensaje: "Categoria actualizada con exito" };
    },

    deleteCategoria: (id: string): void => {
        const categoria = StorageCategorias.getCategorias();
        const filtro = categoria.filter(
            (c) => c.id !== id
        );
        localStorage.setItem("db_categorias", JSON.stringify(filtro))
    },
};