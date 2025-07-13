import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

/**
 * SOLUCIÓN DEFINITIVA:
 * En lugar de renderizar la app inmediatamente, esperamos al evento 'load' de la ventana.
 * Este evento se dispara DESPUÉS de que toda la página, incluyendo imágenes,
 * hojas de estilo y scripts (incluso los que fallan), ha terminado de cargarse.
 * Esto "blinda" nuestra app de los errores del tema Flatsome.
 */
window.addEventListener('load', () => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
