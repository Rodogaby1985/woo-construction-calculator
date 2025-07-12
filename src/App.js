import React, { useState } from 'react';
import { WallCalculatorHeader, WallCalculatorForm, WallCalculatorResults, WallSelector } from './components/WallCalculator';

const App = () => {
  // Estado para el tipo de layout seleccionado, inicializado en 'single'
  const [layoutType, setLayoutType] = useState('single');

  // Estado para los muros, inicializado con un solo muro por defecto
  const [walls, setWalls] = useState([{
    height: '',
    width: '',
    openings: []
  }]);

  const handleLayoutSelect = (type) => {
    // Actualiza el tipo de layout seleccionado
    setLayoutType(type);

    // Mapeo para crear el número correcto de muros
    const wallCount = {
      'single': 1,
      'L': 2,
      'U': 3,
      'square': 4
    }[type] || 1; // Por defecto 1 muro

    // Crea un nuevo array de muros basado en la selección
    const newWalls = Array.from({ length: wallCount }, () => ({
      height: '', // Usar string vacío para un input controlado
      width: '',
      openings: []
    }));

    setWalls(newWalls);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <WallCalculatorHeader />
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <WallSelector
              selectedLayout={layoutType} // Pasa el layout seleccionado
              onSelectLayout={handleLayoutSelect}
            />
            <WallCalculatorForm walls={walls} setWalls={setWalls} />
          </div>
          <div className="border-t border-gray-200">
             {/* El componente de resultados se renderiza aquí */}
            <WallCalculatorResults walls={walls} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
