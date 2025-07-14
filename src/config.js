// src/config.js

/**
 * Este archivo centraliza toda la configuración de la calculadora
 * para facilitar el mantenimiento. Si un ID o SKU cambia,
 * solo necesitas modificarlo aquí.
 */

// Dimensiones de los ladrillos en metros
export const BRICK_DIMENSIONS = {
  DOUBLE: { length: 0.20, height: 0.10, width: 0.08 },
  SINGLE: { length: 0.10, height: 0.10, width: 0.08 },
};

// Cantidad de ladrillos por pack de venta
export const PACK_SIZES = {
  DOUBLE: 60, // 60 ladrillos dobles por m²
  SINGLE: 30,
};

// IDs de las VARIACIONES de producto en WooCommerce
export const WOOCOMMERCE_IDS = {
  DOUBLE_BRICK_BCO: 2186,
  DOUBLE_BRICK_MRO: 2187,
  DOUBLE_BRICK_NGO: 2188,
  SINGLE_BRICK_BCO: 2244, // <-- AÑADIDO
  SINGLE_BRICK_NGO: 2243,
  SINGLE_BRICK_MRO: 2242,
  PGC70: 2656,
  PGU100: 2657,
  ESCUADRA: 2859,
};

// SKUs de las VARIACIONES de producto en WooCommerce
export const WOOCOMMERCE_SKUS = {
  DOUBLE_BRICK_BCO: 'BLOCKPLAS-10-BCO',
  DOUBLE_BRICK_MRO: 'BLOCKPLAS-10-MRO',
  DOUBLE_BRICK_NGO: 'BLOCKPLAS-10-NGO',
  SINGLE_BRICK_BCO: 'BLOCKPLAS-10-SIMPLE-BCO', // <-- AÑADIDO
  SINGLE_BRICK_NGO: 'BLOCKPLAS-10-SIMPLE-NGO',
  SINGLE_BRICK_MRO: 'BLOCKPLAS-10-SIMPLE-MRO',
  PGC70: 'PERFIL-PGC70',
  PGU100: 'PERFIL-PGU100',
  ESCUADRA: 'ESCUADRA-UNION',
};

// Opciones de color para los menús desplegables
export const COLOR_OPTIONS = {
  DOUBLE_BRICKS: [
    { id: '', name: 'Selecciona un color' },
    { id: WOOCOMMERCE_IDS.DOUBLE_BRICK_BCO, name: 'Blanco' },
    { id: WOOCOMMERCE_IDS.DOUBLE_BRICK_MRO, name: 'Marrón' },
    { id: WOOCOMMERCE_IDS.DOUBLE_BRICK_NGO, name: 'Negro' },
  ],
  SINGLE_BRICKS: [
    { id: '', name: 'Selecciona un color' },
    { id: WOOCOMMERCE_IDS.SINGLE_BRICK_BCO, name: 'Blanco' }, // <-- AÑADIDO
    { id: WOOCOMMERCE_IDS.SINGLE_BRICK_NGO, name: 'Negro' },
    { id: WOOCOMMERCE_IDS.SINGLE_BRICK_MRO, name: 'Marrón' },
  ],
};
