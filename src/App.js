import React, { useState } from 'react';
// Añadimos el nuevo componente a la importación
import { WallCalculatorHeader, WallCalculatorForm, WallCalculatorResults, WallSelector, TerminationSelector } from './components/WallCalculator';

const App = () => {
  const [layoutType, setLayoutType] = useState('single');
  const [walls, setWalls] = useState([{ height: '', width: '', openings: [] }]);
  
  // Nuevo estado para manejar el número de terminaciones.
  // Por defecto, una pared simple tiene 2.
  const [numTerminations, setNumTerminations] = useState(2);

  const handleLayoutSelect = (type) => {
    setLayoutType(type);

    const wallCountMap = { 'single': 1, 'L': 2, 'U': 3, 'square': 4 };
    const terminationsMap = { 'single': 2, 'L': 2, 'U': 2, 'square': 0 };

    const wallCount = wallCountMap[type] || 1;
    // Establecemos un número de terminaciones por defecto según la forma.
    const defaultTerminations = terminationsMap[type] !== undefined ? terminationsMap[type] : 2;

    const newWalls = Array.from({ length: wallCount }, () => ({
      height: '',
      width: '',
      openings: []
    }));

    setWalls(newWalls);
    setNumTerminations(defaultTerminations);
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
            {/* Añadimos el nuevo selector de terminaciones */}
            <TerminationSelector 
              numTerminations={numTerminations}
              setNumTerminations={setNumTerminations}
            />
            <WallCalculatorForm walls={walls} setWalls={setWalls} />
          </div>
          <div className="border-t border-gray-200">
             {/* Pasamos el número de terminaciones al componente de resultados */}
            <WallCalculatorResults walls={walls} numTerminations={numTerminations} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

