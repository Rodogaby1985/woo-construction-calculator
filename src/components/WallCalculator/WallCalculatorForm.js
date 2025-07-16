import React from 'react';

// El formulario ahora recibe la función 'addDividerWall'
const WallCalculatorForm = ({ walls, setWalls, addDividerWall }) => {

  // Las funciones para manejar cambios ahora usan el ID de la pared
  const handleWallChange = (wallId, field, value) => {
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;
    
    setWalls(prevWalls => prevWalls.map(wall => 
      wall.id === wallId ? { ...wall, [field]: value } : wall
    ));
  };

  const handleOpeningChange = (wallId, openingId, field, value) => {
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;

    setWalls(prevWalls => prevWalls.map(wall => {
      if (wall.id === wallId) {
        const updatedOpenings = wall.openings.map(op => 
          op.id === openingId ? { ...op, [field]: value } : op
        );
        return { ...wall, openings: updatedOpenings };
      }
      return wall;
    }));
  };

  const addOpening = (wallId) => {
    setWalls(prevWalls => prevWalls.map(wall => {
      if (wall.id === wallId) {
        const newOpening = { id: Date.now(), height: '', width: '' };
        return { ...wall, openings: [...wall.openings, newOpening] };
      }
      return wall;
    }));
  };
  
  const removeOpening = (wallId, openingId) => {
    setWalls(prevWalls => prevWalls.map(wall => {
      if (wall.id === wallId) {
        const filteredOpenings = wall.openings.filter(op => op.id !== openingId);
        return { ...wall, openings: filteredOpenings };
      }
      return wall;
    }));
  };

  // Función para eliminar una pared (solo las divisorias)
  const removeWall = (wallId) => {
    setWalls(prevWalls => prevWalls.filter(wall => wall.id !== wallId));
  };

  // Filtramos las paredes por tipo para renderizarlas en secciones
  const perimeterWalls = walls.filter(w => w.type === 'perimeter');
  const dividerWalls = walls.filter(w => w.type === 'divider');

  const renderWallInputs = (wall, index, isDivider = false) => (
    <div key={wall.id} className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 relative">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-gray-800 text-lg">
          {isDivider ? `Pared Divisoria ${index + 1}` : `Pared Perimetral ${index + 1}`}
        </h4>
        {/* Solo las paredes divisorias se pueden eliminar */}
        {isDivider && (
          <button onClick={() => removeWall(wall.id)} className="text-red-500 hover:text-red-700 font-bold text-xl absolute top-2 right-3" aria-label="Eliminar pared divisoria">&times;</button>
        )}
      </div>
      
      {/* **SECCIÓN CORREGIDA: CAMPOS DE ALTO Y ANCHO AÑADIDOS** */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">Alto (m)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="Ej: 2.5"
            value={wall.height || ''}
            onChange={(e) => handleWallChange(wall.id, 'height', e.target.value)}
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
            onChange={(e) => handleWallChange(wall.id, 'width', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <h5 className="font-semibold text-gray-700 mb-2">Aberturas</h5>
      {wall.openings.map((opening) => (
        <div key={opening.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2 items-end">
          <input type="text" inputMode="decimal" placeholder="Alto" value={opening.height || ''} onChange={(e) => handleOpeningChange(wall.id, opening.id, 'height', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
          <input type="text" inputMode="decimal" placeholder="Ancho" value={opening.width || ''} onChange={(e) => handleOpeningChange(wall.id, opening.id, 'width', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
          <button onClick={() => removeOpening(wall.id, opening.id)} className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200" aria-label="Eliminar abertura">&times;</button>
        </div>
      ))}
      <button onClick={() => addOpening(wall.id)} className="mt-2 w-full text-sm font-semibold text-blue-600 bg-blue-100 p-2 rounded-md hover:bg-blue-200">+ Añadir Abertura</button>
    </div>
  );

  return (
    <div className="mt-8">
      {/* Sección para Paredes Perimetrales */}
      {perimeterWalls.map((wall, index) => renderWallInputs(wall, index, false))}

      {/* Sección para Paredes Divisorias */}
      {dividerWalls.length > 0 && <hr className="my-8 border-gray-300" />}
      {dividerWalls.map((wall, index) => renderWallInputs(wall, index, true))}
      
      {/* Botón para añadir nuevas paredes divisorias */}
      <button onClick={addDividerWall} className="mt-4 w-full py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
        + Añadir Pared Divisoria
      </button>
    </div>
  );
};

export default WallCalculatorForm;
