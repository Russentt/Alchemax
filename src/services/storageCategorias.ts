import { api } from "../api/axiosConfig";
import type { Categoria } from "../types/index";

const normalizarNombre = (nombre: string): string => nombre.trim().toLowerCase();

export const StorageCategorias = {
    getCategorias: async (): Promise<Categoria[]> => {
        try {
            const response = await api.get<Categoria[]>("/api/categorias");
            return response.data;
            } catch (error) {
            console.error("Error al obtener categorías:", error);
            return [];
            }
        },

    crearCategoria: async (
    categoria: Omit<Categoria, "id">,
        ): Promise<{ success: boolean; mensaje: string }> => {
        try {
            const categorias = await StorageCategorias.getCategorias();
            const nombreNormalizado = normalizarNombre(categoria.nombre);

            for (const actual of categorias) {
                if (normalizarNombre(actual.nombre) === nombreNormalizado) {
                return { success: false, mensaje: "Ya existe esta categoria" };
                }
            }

            const nuevaCategoria = {
                ...categoria,
                serviciosAsociados: 0,
            };

            const response = await api.post<Categoria>("/api/categorias", nuevaCategoria);
            if (response.status === 201 || response.status === 200) {
                return { success: true, mensaje: "Categoria creada con exito" };
            }

            return { success: false, mensaje: "No se pudo crear la categoria" };
            } catch (error) {
            console.error("Error al crear categoría:", error);
            return { success: false, mensaje: "Error al conectar con el servidor" };
            }
        },

    updateCategoria: async (
        categoriaActualizada: Categoria,
    ): Promise<{ success: boolean; mensaje: string }> => {
        try {
            const categorias = await StorageCategorias.getCategorias();
            const nombreNormalizado = normalizarNombre(categoriaActualizada.nombre);

            for (const actual of categorias) {
                if (
                Number(actual.id) !== Number(categoriaActualizada.id) &&
                normalizarNombre(actual.nombre) === nombreNormalizado
                ) {
                return { success: false, mensaje: "Ese nombre ya esta en uso" };
                }
            }

            await api.put<Categoria>(
                `/api/categorias/${categoriaActualizada.id}`,
                categoriaActualizada,
            );

            return { success: true, mensaje: "Categoria actualizada con exito" };
            } catch (error) {
            console.error("Error al actualizar categoría:", error);
            return { success: false, mensaje: "Error al actualizar en el servidor" };
        }
    },

    deleteCategoria: async (id: number): Promise<void> => {
    try {
        
        await api.delete(`/api/categorias/${id}`);
        } catch (error) {
        console.error("Error al eliminar categoría:", error);
        }
    },
};