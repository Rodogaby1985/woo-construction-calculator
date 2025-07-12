import React from 'react';

const WallCalculatorForm = ({ walls, setWalls }) => {

  // Maneja cambios en los inputs de alto y ancho de la pared
  const handleWallChange = (wallIndex, field, value) => {
    // Permite solo números y un punto decimal. Previene entradas como 'e', '--', etc.
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
      return; // No actualiza el estado si la entrada no es válida
    }

    const newWalls = [...walls];
    newWalls[wallIndex][field] = value;
    setWalls(newWalls);
  };

  // Maneja cambios en los inputs de las aberturas
  const handleOpeningChange = (wallIndex, openingIndex, field, value) => {
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    const newWalls = [...walls];
    newWalls[wallIndex].openings[openingIndex][field] = value;
    setWalls(newWalls);
  };

  // Añade una nueva abertura con un ID único para la 'key' de React
  const addOpening = (wallIndex) => {
    const newWalls = [...walls];
    newWalls[wallIndex].openings.push({
      id: Date.now(), // ID único basado en el timestamp
      height: '',
      width: '',
    });
    setWalls(newWalls);
  };

  // Remueve una abertura por su índice
  const removeOpening = (wallIndex, openingIndex) => {
    const newWalls = [...walls];
    newWalls[wallIndex].openings.splice(openingIndex, 1);
    setWalls(newWalls);
  };

  return (
    <div className="mt-8">
      {walls.map((wall, wallIndex) => (
        <div key={wallIndex} className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
          <h4 className="font-bold text-gray-800 text-lg mb-4">Pared {wallIndex + 1}</h4>

          {/* Inputs para Alto y Ancho de la Pared */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Alto (m)</label>
              <input
                type="text" // Se usa 'text' para controlar el valor con la validación
                inputMode="decimal" // Muestra un teclado numérico en móviles
                placeholder="Ej: 2.5"
                value={wall.height || ''}
                onChange={(e) => handleWallChange(wallIndex, 'height', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Ancho (m)</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Ej: 4"
                value={wall.width || ''}
                onChange={(e) => handleWallChange(wallIndex, 'width', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Sección de Aberturas */}
          <h5 className="font-semibold text-gray-700 mb-2">Aberturas (Puertas/Ventanas)</h5>
          {wall.openings.map((opening, openingIndex) => (
            // Se usa el ID único como 'key' para un renderizado estable
            <div key={opening.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2 items-end">
              <input
                type="text"
                inputMode="decimal"
                placeholder="Alto"
                value={opening.height || ''}
                onChange={(e) => handleOpeningChange(wallIndex, openingIndex, 'height', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                inputMode="decimal"
                placeholder="Ancho"
                value={opening.width || ''}
                onChange={(e) => handleOpeningChange(wallIndex, openingIndex, 'width', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={() => removeOpening(wallIndex, openingIndex)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                aria-label="Eliminar abertura"
              >
                {/* Icono de basura para eliminar */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          ))}

          <button
            onClick={() => addOpening(wallIndex)}
            className="mt-2 w-full text-sm font-semibold text-blue-600 bg-blue-100 p-2 rounded-md hover:bg-blue-200 transition-colors"
          >
            + Añadir Abertura
          </button>
        </div>
      ))}
    </div>
  );
};

export default WallCalculatorForm;
