import { ProductScrapingEntity } from './productScraping.entity';

export interface ProductScrapingRepository {
  insertProducts: (payload: ProductScrapingEntity[]) => Promise<ProductScrapingEntity[]>;
}
