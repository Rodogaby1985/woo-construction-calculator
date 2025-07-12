import React from 'react';
// tailwind-merge es una utilidad que ya tienes instalada en package.json.
// Ayuda a combinar clases de Tailwind sin conflictos.
import { twMerge } from 'tailwind-merge';

const WallSelector = ({ selectedLayout, onSelectLayout }) => {
  const layouts = [
    {
      type: 'single',
      label: '1 Pared',
      // Sugerencia: Guarda las imágenes en tu carpeta /public para mejor rendimiento
      // Ejemplo: imageSrc: '/images/layout-single.png'
      imageSrc: 'https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0EJzamQpMAYtFLWSDrwdC6mPuQOqy8zGja9l3'
    },
    {
      type: 'L',
      label: '2 Paredes (L)',
      imageSrc: 'https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0l4DzYJXbcAaSYNqKr0LMw3z9nWTuy4eIjixU'
    },
    {
      type: 'U',
      label: '3 Paredes (U)',
      imageSrc: 'https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc008xZa8oPyS6Nz5GRraqmfKLZjOQCH78nhAgu'
    },
    {
      type: 'square',
      label: '4 Paredes (□)',
      imageSrc: 'https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0u6tS1MYvblOpQY7AJg0nTmsBhyINFZ6E3XCU'
    }
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Selecciona la forma de la construcción:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {layouts.map((layout) => (
          <button
            key={layout.type}
            onClick={() => onSelectLayout(layout.type)}
            // twMerge combina las clases de forma inteligente.
            // Si el layout está seleccionado, añade las clases de "activo".
            className={twMerge(
              // Clases base para todos los botones
              'flex flex-col items-center p-3 border-2 border-gray-200 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md',
              // Clases condicionales para el botón activo
              selectedLayout === layout.type
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400 shadow-lg'
                : 'bg-white hover:border-blue-300'
            )}
          >
            <div className="w-24 h-24 mb-2">
              <img
                src={layout.imageSrc}
                alt={layout.label}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <span className="text-sm font-medium text-gray-700">{layout.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WallSelector;
