import React from 'react';

const TerminationSelector = ({ numTerminations, setNumTerminations }) => {
  return (
    <div className="mb-6">
      <label htmlFor="terminations" className="block text-lg font-medium text-gray-800 mb-2">
        Número de Terminaciones
      </label>
      <p className="text-sm text-gray-500 mb-3">
        Indica cuántos extremos de pared necesitan un acabado (no se unen a otra pared). Por ejemplo: una pared recta tiene 2, una forma en 'L' tiene 2, una habitación cerrada tiene 0.
      </p>
      <input
        type="number"
        id="terminations"
        name="terminations"
        min="0"
        value={numTerminations}
        onChange={(e) => setNumTerminations(parseInt(e.target.value, 10) || 0)}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        placeholder="Ej: 2"
      />
    </div>
  );
};

export default TerminationSelector;
