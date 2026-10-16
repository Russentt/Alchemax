import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import * as pwaPlugin from 'vite-plugin-pwa';
const VitePWA = pwaPlugin.VitePWA;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate', // Actualiza el caché silenciosamente cuando subes nueva versión
      workbox: {
        // Define qué archivos se guardarán en la Cache Storage API
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        globIgnores: [
          '**/Account-*.js',
          '**/Admin-*.js',
          '**/Article-*.js',
          '**/Blog-*.js',
          '**/Carrito-*.js',
          '**/Faq-*.js',
          '**/Login-*.js',
          '**/ModalCategoria-*.js',
          '**/Metodologia-*.js',
          '**/NotFound-*.js',
          '**/Nutricionista-*.js',
          '**/articles-*.js',
          '**/planService-*.js',
          '**/Register-*.js',
          '**/Telemedicina-*.js',
          '**/Testimonios-*.js',
        ],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/[^/]+\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'app-scripts-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [200]
              }
            }
          },
          {
            // Opcional: Cachear fuentes externas de Google si las usas
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })],
  base: "/Alchemax/",
});
