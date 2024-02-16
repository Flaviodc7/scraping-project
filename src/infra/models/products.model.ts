import { Schema, model } from 'mongoose';

const BatchSchema = new Schema({
  active: Number,
  expireDate: Number,
  id: String,
  normalPrice: Number,
  settlementPrice: Number,
  stock: Number,
});

const MetadataSchema = new Schema({
  title: String,
  description: String,
  keywords: String,
});

const ProductSchema = new Schema(
  {
    batchs: [BatchSchema],
    ean: String,
    fullName: String,
    metadata: MetadataSchema,
    photosURL: [String],
    prescriptionType: String,
    presentation: String,
    priority: Number,
    productBreadcrumbs: String,
    quantityPerContainer: Number,
    recommendations: String,
    requiresPrescription: Number,
    restrictions: String,
    retailer: String,
    sku: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const ProductScrapingModel = model(
  'ProductScraping',
  ProductSchema,
  process.env.PRODUCT_SCRAPING ?? 'productos_scraping_cruzverde'
);

export default ProductScrapingModel;
