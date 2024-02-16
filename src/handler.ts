import cargarProductosSalcobrandEnDynamo from './retailers/htmlRetailer.js';
import cargarProductosCruzVerdeEnDynamo from './retailers/apiRetailer.js';
import cargarProductosFarmaciasAhumadaEnDynamo from './retailers/htmlRetailer.js';

export const handler = async (event: any, _context: any, callback: any) => {
  try {
    await Promise.all([
      cargarProductosCruzVerdeEnDynamo(),
      cargarProductosFarmaciasAhumadaEnDynamo(),
      cargarProductosSalcobrandEnDynamo(),
    ]);
    callback(null, 'Productos cargados exitosamente');
  } catch (error) {
    callback(error);
  }
};
