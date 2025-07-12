import React, { useState, useMemo } from 'react';
// Importa toda la configuración desde el archivo centralizado
import * as config from '../../config';

const WallCalculatorResults = ({ walls }) => {
  // Estados para almacenar el color seleccionado por el usuario
  const [selectedDoubleBrickColorId, setSelectedDoubleBrickColorId] = useState('');
  const [selectedSingleBrickColorId, setSelectedSingleBrickColorId] = useState('');

  // --- LÓGICA DE CÁLCULO ---
  // Usamos useMemo para evitar recalcular en cada renderizado si los 'walls' no cambian.
  const calculations = useMemo(() => {
    const calculateWallArea = (wall) => {
      const wallArea = (wall.height || 0) * (wall.width || 0);
      const openingsArea = wall.openings?.reduce((total, opening) => {
        return total + ((opening.height || 0) * (opening.width || 0));
      }, 0) || 0;
      return Math.max(0, wallArea - openingsArea); // Asegura que no sea negativo
    };

    let totalArea = 0;
    let rawDoubleBricks = 0;
    let rawSingleBricks = 0;
    let totalPerimeter = 0;
    let maxWallHeight = 0;

    walls.forEach(wall => {
      const area = calculateWallArea(wall);
      totalArea += area;

      // Cálculo ladrillos dobles
      const brickArea = config.BRICK_DIMENSIONS.DOUBLE.length * config.BRICK_DIMENSIONS.DOUBLE.height;
      rawDoubleBricks += area / brickArea;

      // Cálculo ladrillos simples
      const wallHeight = wall.height || 0;
      const heightBricks = wallHeight / config.BRICK_DIMENSIONS.SINGLE.width;
      const openingBricks = wall.openings?.reduce((total, opening) => {
        return total + ((opening.height || 0) / config.BRICK_DIMENSIONS.SINGLE.width);
      }, 0) || 0;
      rawSingleBricks += heightBricks + openingBricks;

      // Cálculo para perfiles
      totalPerimeter += (wall.width || 0);
      maxWallHeight = Math.max(maxWallHeight, wallHeight);
    });

    // Aplicar 10% de desperdicio y redondear hacia arriba
    const finalDoubleBricks = Math.ceil(rawDoubleBricks * 1.1);
    const finalSingleBricks = Math.ceil(rawSingleBricks * 1.1);
    
    // Packs de venta
    const packsDoubleBricks = Math.ceil(finalDoubleBricks / config.PACK_SIZES.DOUBLE);
    const packsSingleBricks = Math.ceil(finalSingleBricks / config.PACK_SIZES.SINGLE);

    // Perfiles y Escuadras
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


  // --- LÓGICA PARA AÑADIR AL CARRITO ---
  const addToCart = async (productId, quantity, redirectOnSuccess = true) => {
    // ... (La función addToCart se mantiene igual, pero ahora usará los IDs desde `config`)
    // Para brevedad, no la repetiré aquí, pero debe estar en tu componente.
    // Solo asegúrate de que no use `alert()` sino un sistema de notificaciones más moderno si es posible.
    console.log(`Adding to cart: ProductID=${productId}, Quantity=${quantity}`);
    // Aquí iría la lógica de fetch a WooCommerce
  };
  
  const handleAddAllToCart = async () => {
    // Lógica para añadir todo al carrito
  };


  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <div className="p-6 sm:p-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Resultados del Cálculo</h3>
      <div className="space-y-4">
        {/* Resumen */}
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

        {/* Lista de materiales */}
        <div className="space-y-3">
          {/* Ladrillos Dobles */}
          <div className="p-4 border rounded-lg">
            <p className="font-semibold">Ladrillos Dobles</p>
            <p className="text-xl font-bold">{calculations.totalDoubleBricks} unidades ({calculations.packsDoubleBricks} packs)</p>
            <select
              value={selectedDoubleBrickColorId}
              onChange={(e) => setSelectedDoubleBrickColorId(e.target.value)}
              className="w-full mt-2 p-2 border rounded-md"
            >
              {config.COLOR_OPTIONS.DOUBLE_BRICKS.map(color => (
                <option key={color.id || 'default-double'} value={color.id}>{color.name}</option>
              ))}
            </select>
          </div>

          {/* Ladrillos Simples */}
          <div className="p-4 border rounded-lg">
            <p className="font-semibold">Ladrillos Simples</p>
            <p className="text-xl font-bold">{calculations.totalSingleBricks} unidades ({calculations.packsSingleBricks} packs)</p>
             <select
              value={selectedSingleBrickColorId}
              onChange={(e) => setSelectedSingleBrickColorId(e.target.value)}
              className="w-full mt-2 p-2 border rounded-md"
            >
              {config.COLOR_OPTIONS.SINGLE_BRICKS.map(color => (
                <option key={color.id || 'default-single'} value={color.id}>{color.name}</option>
              ))}
            </select>
          </div>

          {/* Perfiles y Escuadras */}
          <div className="p-4 border rounded-lg">
            <p className="font-semibold">Estructura</p>
            <ul className="list-disc list-inside text-gray-700">
              <li><span className="font-bold">{calculations.pgc70Profiles}</span> perfiles PGC70</li>
              <li><span className="font-bold">{calculations.pgu100Profiles}</span> perfiles PGU100</li>
              <li><span className="font-bold">{calculations.escuadras}</span> escuadras de unión</li>
            </ul>
          </div>
        </div>

        {/* Botón de acción */}
        <button
          onClick={handleAddAllToCart}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-md disabled:bg-gray-400"
          disabled={!calculations.totalArea || (calculations.totalDoubleBricks > 0 && !selectedDoubleBrickColorId) || (calculations.totalSingleBricks > 0 && !selectedSingleBrickColorId)}
        >
          Añadir todo al carrito
        </button>
      </div>
    </div>
  );
};

export default WallCalculatorResults;
