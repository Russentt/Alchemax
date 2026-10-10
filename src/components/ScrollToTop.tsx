import { useEffect } from "react";
import { useLocation } from "react-router";

export default function ScrollToTop() {
  // Extraemos la ruta actual (pathname) y el ancla si existe (hash)
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Escenario 1: El usuario trae un "ticket" para una sección específica
    if (hash) {
      // Usamos un pequeño setTimeout porque React necesita una fracción de segundo
      // para "dibujar" la nueva página antes de que podamos buscar el ID.
      setTimeout(() => {
        // Le quitamos el '#' al string (ej: '#catalogo' -> 'catalogo')
        const id = hash.replace("#", "");
        const element = document.getElementById(id);

        // Si el elemento existe en la página, deslizamos suavemente hacia él
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
    // Escenario 2: Es una navegación normal sin secciones específicas
    else {
      // Teletransportamos al usuario al píxel 0 (arriba) y 0 (izquierda)
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [pathname, hash]); // Le decimos a React: "Ejecuta esto cada vez que cambie la ruta o el hash"

  return null; // Este componente es un "fantasma", no dibuja nada en pantalla.
}
