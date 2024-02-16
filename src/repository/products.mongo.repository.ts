import { ProductScrapingEntity } from 'src/core/modules/scrapingProducts/domain/productScraping.entity';
import { ProductScrapingRepository } from 'src/core/modules/scrapingProducts/domain/productScraping.repository';
import ProductScrapingModel from 'src/models/products.model';

export class ProductScrapingMongoRepository implements ProductScrapingRepository {
  insertProducts = async (productos: ProductScrapingEntity[]): Promise<ProductScrapingEntity[]> => {
    const updatedProducts: ProductScrapingEntity[] = [];
    try {
      for (const producto of productos) {
        const result = await ProductScrapingModel.findOneAndUpdate({ sku: producto.sku }, producto, {
          new: true,
          upsert: true,
        });
        console.log('Producto CRUZ VERDE actualizado/insertado con éxito:', result);
        if (result !== null) {
          updatedProducts.push(result.toObject() as ProductScrapingEntity);
        }
      }
      return updatedProducts;
    } catch (error) {
      console.error('Error al actualizar/insertar productos CRUZ VERDE en MongoDB:', error);
      throw error;
    }
  };
}