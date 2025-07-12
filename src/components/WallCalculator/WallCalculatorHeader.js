import React from 'react';

const WallCalculatorHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Asumiendo que guardaste el logo en la carpeta /public */}
      <img
        src="/logo.png" /* <-- Ruta local */
        alt="Logo Blockplas"
        className="mx-auto mb-4 w-[200px]" /* <-- Ancho con Tailwind */
      />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Calculadora Profesional de Ladrillos
      </h1>
      <p className="text-gray-600">
        Selecciona el tipo de construcción y completa las medidas
      </p>
    </div>
  );
};

export default WallCalculatorHeader;