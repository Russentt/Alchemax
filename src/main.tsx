import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { StorageInit } from "./services/storage_init.ts";
import './index.css'
import { registerSW } from 'virtual:pwa-register';
registerSW({ immediate: true });

StorageInit.initDB();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
