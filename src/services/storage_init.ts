// La inicialización de datos base ahora se ejecuta directamente en el backend
// mediante DataInitializer (Spring Boot + MySQL), sin usar localStorage.
export const StorageInit = {
  initDB: async (): Promise<void> => {
    // No-op mantenido por compatibilidad
  },
};
