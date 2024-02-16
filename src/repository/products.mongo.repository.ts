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
        console.log(`Product insert/update succesfull: ${result}`);
        if (result !== null) {
          updatedProducts.push(result.toObject() as ProductScrapingEntity);
        }
      }
      return updatedProducts;
    } catch (error) {
      console.error('Error on insert/updating product:', error);
      throw error;
    }
  };
}
