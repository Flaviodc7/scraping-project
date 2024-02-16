export interface ProductScrapingEntity {
  batchs: Batch[];
  ean: string;
  fullName: string;
  metadata: Metadata;
  photosURL: string[];
  presentation: string;
  productBreadcrumbs: string;
  quantityPerContainer: number;
  recommendations: string;
  requiresPrescription: number;
  restrictions: string;
  retailer: string;
  sku: string;
}

export interface Batch {
  active: number;
  expireDate: number;
  id: string;
  normalPrice: number;
  settlementPrice: number;
  stock: number;
}

export interface Metadata {
  title: string;
  description: string;
  keywords: string;
}
