import React, { useState } from 'react';
import { WallCalculatorHeader, WallCalculatorForm, WallCalculatorResults, WallSelector } from './components/WallCalculator';

const App = () => {
  const [layoutType, setLayoutType] = useState('single');
  
  // El estado 'walls' ahora manejará todas las paredes.
  // Cada pared tendrá un ID único y un tipo ('perimeter' o 'divider').
  const [walls, setWalls] = useState([
    { id: 1, type: 'perimeter', height: '', width: '', openings: [] }
  ]);

  // Se ejecuta cuando el usuario elige una forma (1 pared, L, U, etc.)
  const handleLayoutSelect = (type) => {
    setLayoutType(type);

    const wallCountMap = { 'single': 1, 'L': 2, 'U': 3, 'square': 4 };
    const wallCount = wallCountMap[type] || 1;

    // Crea solo las paredes perimetrales
    const newPerimeterWalls = Array.from({ length: wallCount }, (_, i) => ({
      id: Date.now() + i, // ID único
      type: 'perimeter',
      height: '',
      width: '',
      openings: []
    }));

    // Mantiene las paredes divisorias que ya existían
    const existingDividers = walls.filter(wall => wall.type === 'divider');
    setWalls([...newPerimeterWalls, ...existingDividers]);
  };

  // Función para AÑADIR una nueva pared divisoria
  const addDividerWall = () => {
    const newDivider = {
      id: Date.now(),
      type: 'divider',
      height: '',
      width: '',
      openings: []
    };
    setWalls(prevWalls => [...prevWalls, newDivider]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <WallCalculatorHeader />
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <WallSelector
              selectedLayout={layoutType}
              onSelectLayout={handleLayoutSelect}
            />
            {/* El formulario ahora maneja todas las paredes y la función de añadir divisorias */}
            <WallCalculatorForm 
              walls={walls} 
              setWalls={setWalls}
              addDividerWall={addDividerWall}
            />
          </div>
          <div className="border-t border-gray-200">
            <WallCalculatorResults walls={walls} layoutType={layoutType} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
