import React, { useState, useMemo } from 'react';
// Importa toda la configuración desde el archivo centralizado
import * as config from '../../config';

const WallCalculatorResults = ({ walls }) => {
  // Estados para almacenar el color seleccionado por el usuario
  const [selectedDoubleBrickColorId, setSelectedDoubleBrickColorId] = useState('');
  const [selectedSingleBrickColorId, setSelectedSingleBrickColorId] = useState('');

  // --- LÓGICA DE CÁLCULO (sin cambios) ---
  const calculations = useMemo(() => {
    const calculateWallArea = (wall) => {
      const wallArea = (parseFloat(wall.height) || 0) * (parseFloat(wall.width) || 0);
      const openingsArea = wall.openings?.reduce((total, opening) => {
        return total + ((parseFloat(opening.height) || 0) * (parseFloat(opening.width) || 0));
      }, 0) || 0;
      return Math.max(0, wallArea - openingsArea);
    };

    let totalArea = 0;
    let rawDoubleBricks = 0;
    let rawSingleBricks = 0;
    let totalPerimeter = 0;
    let maxWallHeight = 0;

    walls.forEach(wall => {
      const area = calculateWallArea(wall);
      totalArea += area;
      const wallHeight = parseFloat(wall.height) || 0;
      
      const brickArea = config.BRICK_DIMENSIONS.DOUBLE.length * config.BRICK_DIMENSIONS.DOUBLE.height;
      if (brickArea > 0) rawDoubleBricks += area / brickArea;

      if (config.BRICK_DIMENSIONS.SINGLE.width > 0) {
          const heightBricks = wallHeight / config.BRICK_DIMENSIONS.SINGLE.width;
          const openingBricks = wall.openings?.reduce((total, opening) => {
            return total + ((parseFloat(opening.height) || 0) / config.BRICK_DIMENSIONS.SINGLE.width);
          }, 0) || 0;
          rawSingleBricks += heightBricks + openingBricks;
      }

      totalPerimeter += (parseFloat(wall.width) || 0);
      maxWallHeight = Math.max(maxWallHeight, wallHeight);
    });

    const finalDoubleBricks = Math.ceil(rawDoubleBricks * 1.1);
    const finalSingleBricks = Math.ceil(rawSingleBricks * 1.1);
    
    const packsDoubleBricks = Math.ceil(finalDoubleBricks / config.PACK_SIZES.DOUBLE);
    const packsSingleBricks = Math.ceil(finalSingleBricks / config.PACK_SIZES.SINGLE);

    const pgc70Needed = (totalPerimeter / 0.6) * maxWallHeight;
    const pgc70Profiles = Math.ceil(pgc70Needed / 6);
    const pgu100Profiles = Math.ceil((totalPerimeter * 2) / 6);
    const escuadras = Math.ceil(totalPerimeter / 0.6) * 2;

    return {
      totalArea,
      packsDoubleBricks,
      totalDoubleBricks: packsDoubleBricks * config.PACK_SIZES.DOUBLE,
      packsSingleBricks,
      totalSingleBricks: packsSingleBricks * config.PACK_SIZES.SINGLE,
      pgc70Profiles,
      pgu100Profiles,
      escuadras,
    };
  }, [walls]);

  // --- RENDERIZADO DEL COMPONENTE CON BOTONES INDIVIDUALES ---
  return (
    <div className="p-6 sm:p-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Resultados del Cálculo</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center bg-gray-100 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Área Neta a Cubrir</p>
            <p className="text-2xl font-bold text-blue-600">{calculations.totalArea.toFixed(2)} m²</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total de Paredes</p>
            <p className="text-2xl font-bold text-blue-600">{walls.length}</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Ladrillos Dobles */}
          {calculations.totalDoubleBricks > 0 && (
            <div className="p-4 border rounded-lg">
              <p className="font-semibold">Ladrillos Dobles</p>
              <p className="text-xl font-bold">{calculations.totalDoubleBricks} unidades</p>
              <select value={selectedDoubleBrickColorId} onChange={(e) => setSelectedDoubleBrickColorId(e.target.value)} className="w-full mt-2 p-2 border rounded-md">
                {config.COLOR_OPTIONS.DOUBLE_BRICKS.map(color => (
                  <option key={color.id || 'default-double'} value={color.id}>{color.name}</option>
                ))}
              </select>
              <a href={selectedDoubleBrickColorId ? `https://blockplas.com.ar/cart/?add-to-cart=${selectedDoubleBrickColorId}&quantity=${calculations.totalDoubleBricks}` : '#'}
                 onClick={(e) => !selectedDoubleBrickColorId && e.preventDefault()}
                 className={`block text-center w-full mt-3 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm ${selectedDoubleBrickColorId ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                Añadir Ladrillos Dobles
              </a>
            </div>
          )}

          {/* Ladrillos Simples */}
          {calculations.totalSingleBricks > 0 && (
            <div className="p-4 border rounded-lg">
              <p className="font-semibold">Ladrillos Simples</p>
              <p className="text-xl font-bold">{calculations.totalSingleBricks} unidades</p>
              <select value={selectedSingleBrickColorId} onChange={(e) => setSelectedSingleBrickColorId(e.target.value)} className="w-full mt-2 p-2 border rounded-md">
                {config.COLOR_OPTIONS.SINGLE_BRICKS.map(color => (
                  <option key={color.id || 'default-single'} value={color.id}>{color.name}</option>
                ))}
              </select>
              <a href={selectedSingleBrickColorId ? `https://blockplas.com.ar/cart/?add-to-cart=${selectedSingleBrickColorId}&quantity=${calculations.totalSingleBricks}` : '#'}
                 onClick={(e) => !selectedSingleBrickColorId && e.preventDefault()}
                 className={`block text-center w-full mt-3 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm ${selectedSingleBrickColorId ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                Añadir Ladrillos Simples
              </a>
            </div>
          )}

          {/* Perfiles y Escuadras (AHORA SEPARADOS) */}
          {calculations.pgc70Profiles > 0 && (
            <div className="p-4 border rounded-lg">
                <p className="font-semibold">Perfiles PGC70</p>
                <p><span className="font-bold">{calculations.pgc70Profiles}</span> unidades</p>
                <a href={`https://blockplas.com.ar/cart/?add-to-cart=${config.WOOCOMMERCE_IDS.PGC70}&quantity=${calculations.pgc70Profiles}`}
                   className="block text-center w-full mt-3 py-2 rounded-lg text-sm font-semibold bg-purple-700 text-white hover:bg-purple-800 transition-colors shadow-sm">
                  Añadir PGC70
                </a>
            </div>
          )}
          {calculations.pgu100Profiles > 0 && (
            <div className="p-4 border rounded-lg">
                <p className="font-semibold">Perfiles PGU100</p>
                <p><span className="font-bold">{calculations.pgu100Profiles}</span> unidades</p>
                <a href={`https://blockplas.com.ar/cart/?add-to-cart=${config.WOOCOMMERCE_IDS.PGU100}&quantity=${calculations.pgu100Profiles}`}
                   className="block text-center w-full mt-3 py-2 rounded-lg text-sm font-semibold bg-orange-700 text-white hover:bg-orange-800 transition-colors shadow-sm">
                  Añadir PGU100
                </a>
            </div>
          )}
          {calculations.escuadras > 0 && (
            <div className="p-4 border rounded-lg">
                <p className="font-semibold">Escuadras de Unión</p>
                <p><span className="font-bold">{calculations.escuadras}</span> unidades</p>
                <a href={`https://blockplas.com.ar/cart/?add-to-cart=${config.WOOCOMMERCE_IDS.ESCUADRA}&quantity=${calculations.escuadras}`}
                   className="block text-center w-full mt-3 py-2 rounded-lg text-sm font-semibold bg-red-700 text-white hover:bg-red-800 transition-colors shadow-sm">
                  Añadir Escuadras
                </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WallCalculatorResults;

