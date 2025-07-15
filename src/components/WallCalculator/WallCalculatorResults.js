import React, { useState, useMemo } from 'react';
import * as config from '../../config';

const WallCalculatorResults = ({ walls, numTerminations }) => {
  const [selectedDoubleBrickColorId, setSelectedDoubleBrickColorId] = useState('');
  const [selectedSingleBrickColorId, setSelectedSingleBrickColorId] = useState('');

  const calculations = useMemo(() => {
    const calculateWallArea = (wall) => {
      const wallArea = (parseFloat(wall.height) || 0) * (parseFloat(wall.width) || 0);
      const openingsArea = wall.openings?.reduce((total, opening) => {
        return total + ((parseFloat(opening.height) || 0) * (parseFloat(opening.width) || 0));
      }, 0) || 0;
      return Math.max(0, wallArea - openingsArea);
    };

    let totalNetArea = 0;
    let totalPerimeter = 0;
    let maxWallHeight = 0;

    walls.forEach(wall => {
      totalNetArea += calculateWallArea(wall);
      totalPerimeter += (parseFloat(wall.width) || 0);
      maxWallHeight = Math.max(maxWallHeight, (parseFloat(wall.height) || 0));
    });

    // --- LÓGICA DE CÁLCULO FINAL Y CORREGIDA PARA LADRILLOS SIMPLES ---
    
    // 1. Calcular la altura total de los bordes verticales de las aberturas.
    //    Cada abertura tiene 2 bordes verticales.
    let totalOpeningVerticalJambsHeight = 0;
    walls.forEach(wall => {
      wall.openings?.forEach(opening => {
        totalOpeningVerticalJambsHeight += (parseFloat(opening.height) || 0) * 2;
      });
    });

    // 2. Calcular la altura total de las terminaciones de pared.
    //    Si el usuario ingresa 0 terminaciones, este valor será 0.
    const totalTerminationHeight = numTerminations * maxWallHeight;

    // 3. Sumar AMBAS longitudes verticales. Esta es la longitud total que necesita ladrillos simples.
    const totalVerticalLengthForSimpleBricks = totalTerminationHeight + totalOpeningVerticalJambsHeight;

    // 4. Aplicar la fórmula (longitud / alto del ladrillo) para obtener el total de ladrillos.
    //    Si la longitud total es 0, el resultado será 0.
    const rawSingleBricks = totalVerticalLengthForSimpleBricks / config.BRICK_DIMENSIONS.SINGLE.height;

    // --- CÁLCULOS FINALES CON DESPERDICIO Y REDONDEO INTELIGENTE ---
    const areaWithWaste = totalNetArea * 1.1;
    const roundedM2 = Math.round(areaWithWaste);
    const doubleBricksM2_to_sell = Math.max(roundedM2, Math.ceil(totalNetArea));
    const totalDoubleBricks_for_display = doubleBricksM2_to_sell * config.PACK_SIZES.DOUBLE;

    const singleBricksWithWaste = rawSingleBricks * 1.1;
    const packsWithWaste = singleBricksWithWaste / config.PACK_SIZES.SINGLE;
    const roundedPacks = Math.round(packsWithWaste);
    const minPacksNeeded = Math.ceil(rawSingleBricks / config.PACK_SIZES.SINGLE);
    const singleBricksPacks_to_sell = Math.max(roundedPacks, minPacksNeeded);
    const totalSingleBricks_for_display = singleBricksPacks_to_sell * config.PACK_SIZES.SINGLE;

    const pgc70Needed = (totalPerimeter / 0.6) * maxWallHeight;
    const pgc70Profiles = Math.ceil(pgc70Needed / 6);
    const pgu100Profiles = Math.ceil((totalPerimeter * 2) / 6);
    const escuadras = Math.ceil(totalPerimeter / 0.6) * 2;

    return {
      totalArea: totalNetArea,
      doubleBricksM2: doubleBricksM2_to_sell,
      singleBricksPacks: singleBricksPacks_to_sell,
      totalDoubleBricks: totalDoubleBricks_for_display,
      totalSingleBricks: totalSingleBricks_for_display,
      pgc70Profiles,
      pgu100Profiles,
      escuadras,
    };
  }, [walls, numTerminations]);

  // --- RENDERIZADO DEL COMPONENTE ---
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
          {calculations.doubleBricksM2 > 0 && (
            <div className="p-4 border rounded-lg">
              <p className="font-semibold">Ladrillos Dobles</p>
              <p className="text-xl font-bold">{calculations.doubleBricksM2} m²</p>
              <p className="text-sm text-gray-500">({calculations.totalDoubleBricks} ladrillos aprox.)</p>
              
              <select value={selectedDoubleBrickColorId} onChange={(e) => setSelectedDoubleBrickColorId(e.target.value)} className="w-full mt-2 p-2 border rounded-md">
                {config.COLOR_OPTIONS.DOUBLE_BRICKS.map(color => (
                  <option key={color.id || 'default-double'} value={color.id}>{color.name}</option>
                ))}
              </select>
              <button
                 data-quantity={calculations.doubleBricksM2}
                 data-product_id={selectedDoubleBrickColorId}
                 className={`w-full mt-3 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm add_to_cart_button ajax_add_to_cart ${selectedDoubleBrickColorId ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-gray-300 text-gray-500'}`}
                 disabled={!selectedDoubleBrickColorId}
              >
                Añadir Ladrillos Dobles
              </button>
            </div>
          )}

          {/* Ladrillos Simples */}
          {calculations.singleBricksPacks > 0 && (
            <div className="p-4 border rounded-lg">
              <p className="font-semibold">Ladrillos Simples (de terminación)</p>
              <p className="text-xl font-bold">{calculations.singleBricksPacks} pack(s)</p>
              <p className="text-sm text-gray-500">({calculations.totalSingleBricks} ladrillos aprox.)</p>

              <select value={selectedSingleBrickColorId} onChange={(e) => setSelectedSingleBrickColorId(e.target.value)} className="w-full mt-2 p-2 border rounded-md">
                {config.COLOR_OPTIONS.SINGLE_BRICKS.map(color => (
                  <option key={color.id || 'default-single'} value={color.id}>{color.name}</option>
                ))}
              </select>
              <button
                 data-quantity={calculations.singleBricksPacks}
                 data-product_id={selectedSingleBrickColorId}
                 className={`w-full mt-3 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm add_to_cart_button ajax_add_to_cart ${selectedSingleBrickColorId ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-gray-300 text-gray-500'}`}
                 disabled={!selectedSingleBrickColorId}
              >
                Añadir Ladrillos Simples
              </button>
            </div>
          )}

          {/* Perfiles y Escuadras */}
          {calculations.pgc70Profiles > 0 && (
            <div className="p-4 border rounded-lg">
                <p className="font-semibold">Perfiles PGC70</p>
                <p><span className="font-bold">{calculations.pgc70Profiles}</span> unidades</p>
                <button
                   data-quantity={calculations.pgc70Profiles}
                   data-product_id={config.WOOCOMMERCE_IDS.PGC70}
                   className="w-full mt-3 py-2 rounded-lg text-sm font-semibold bg-purple-700 text-white hover:bg-purple-800 transition-colors shadow-sm add_to_cart_button ajax_add_to_cart"
                >
                  Añadir PGC70
                </button>
            </div>
          )}
          {calculations.pgu100Profiles > 0 && (
            <div className="p-4 border rounded-lg">
                <p className="font-semibold">Perfiles PGU100</p>
                <p><span className="font-bold">{calculations.pgu100Profiles}</span> unidades</p>
                <button
                   data-quantity={calculations.pgu100Profiles}
                   data-product_id={config.WOOCOMMERCE_IDS.PGU100}
                   className="w-full mt-3 py-2 rounded-lg text-sm font-semibold bg-orange-700 text-white hover:bg-orange-800 transition-colors shadow-sm add_to_cart_button ajax_add_to_cart"
                >
                  Añadir PGU100
                </button>
            </div>
          )}
          {calculations.escuadras > 0 && (
            <div className="p-4 border rounded-lg">
                <p className="font-semibold">Escuadras de Unión</p>
                <p><span className="font-bold">{calculations.escuadras}</span> unidades</p>
                <button
                   data-quantity={calculations.escuadras}
                   data-product_id={config.WOOCOMMERCE_IDS.ESCUADRA}
                   className="w-full mt-3 py-2 rounded-lg text-sm font-semibold bg-red-700 text-white hover:bg-red-800 transition-colors shadow-sm add_to_cart_button ajax_add_to_cart"
                >
                  Añadir Escuadras
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WallCalculatorResults;
