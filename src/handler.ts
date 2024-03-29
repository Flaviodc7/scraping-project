import { scrapHTMLProductsFromRetailer } from '@retailers/htmlRetailer.js';
import { scrapApiProductsFromRetailer } from '@retailers/apiRetailer.js';

export const handler = async (event: any, _context: any, callback: any) => {
  try {
    await Promise.all([scrapApiProductsFromRetailer(''), scrapHTMLProductsFromRetailer('')]);
    callback(null, 'Products uploaded successfully');
  } catch (error) {
    callback(error);
  }
};
