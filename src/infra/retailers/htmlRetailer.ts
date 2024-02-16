import axios from 'axios';
import cheerio from 'cheerio';
import { ProductScrapingEntity } from '../../core/modules/scrapingProducts/domain/productScraping.entity';
import { ProductScrapingMongoRepository } from 'src/infra/repository/products.mongo.repository';
import { delay } from 'src/infra/utils/delay';
import { getSitemapData } from 'src/infra/utils/getSitemapData';
import { splitArray } from 'src/infra/utils/splitArray';
import { currentTime } from '../utils/currentTime';

const getProductData = async (url: string) => {
  const MAX_RETRIES = 3; // Configure many retries if needed
  const RETRY_DELAY = 5000; // Time in miliseconds to retry
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url,
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',

      // Add cookies as needed
    },
  };
  let attempts = 0;
  while (attempts <= MAX_RETRIES) {
    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      attempts++;
      console.log(`Attempt ${attempts} failed in: ${url}`);
      if (attempts >= MAX_RETRIES) {
        return '';
      }
      await delay(RETRY_DELAY);
    }
  }
};

const processBatchOfProducts = async (batch: string[], retailer: string) => {
  const products: ProductScrapingEntity[] = [];
  await Promise.all(
    batch.map(async (productSiteUrl) => {
      const data = await getProductData(productSiteUrl);
      if (data) {
        const $ = cheerio.load(data);

        const productData = $('script[type="application/ld+json"]').length
          ? JSON.parse($('script[type="application/ld+json"]').text())
          : 'Not match found';

        if (productData !== 'Not match found') {
          const breadcrumbs =
            $('ol[class="breadcrumb d-flex align-items-center"] li').length > 1
              ? $('ol[class="breadcrumb d-flex align-items-center"] li').slice(0, -1)
              : 'NO BREADCRUMBS';

          const breadcrumbText =
            breadcrumbs !== 'NO BREADCRUMBS' && breadcrumbs.length > 1
              ? breadcrumbs
                  .map(function () {
                    return $(this).text().trim();
                  })
                  .get()
                  .join(' > ')
              : 'NO BREADCRUMBS';

          const oldPrice = Number(
            $("div[class='col-lg-4 col-sm-12'] del span[class='value']").length
              ? $("div[class='col-lg-4 col-sm-12'] del span[class='value']").attr('content')
              : $("div[class='col-lg-4 col-sm-12'] span[class*='value']").attr('content')
          );

          // Edit this part as you need
          const product = {
            batchs: [
              {
                active: Number($("div[class='col-lg-4 col-sm-12'] span[class*='value']").attr('content')),
                expireDate: 0,
                id: productData.sku,
                normalPrice: oldPrice,
                settlementPrice: Number($("div[class='col-lg-4 col-sm-12'] span[class*='value']").attr('content')),
                stock: Number(''),
              },
            ],
            ean: '',
            fullName: productData.name,
            metadata: {
              title: $('title').text().trim() ?? '',
              description: $('meta[name="description"]').attr('content') ?? '',
              keywords: $('meta[name="keywords"]').attr('content') ?? '',
            },
            photosURL: [productData.image[0]?.split('?')[0] ?? ''],
            presentation: '',
            priority: 1,
            productBreadcrumbs: breadcrumbText,
            quantityPerContainer: 1,
            recommendations: '',
            requiresPrescription: $("svg[id='ico_doc']").length ? 1 : 0,
            restrictions: '',
            retailer,
            sku: `${String(productData.sku)}-${retailer}`,
          };
          products.push(product);
        }
      }
    })
  );
  return products;
};

async function processProductUrls(allSitesFromSiteMap: string[], retailer: string) {
  const ProductRepository = new ProductScrapingMongoRepository();
  const batches = splitArray(allSitesFromSiteMap, 10);
  for (const batch of batches) {
    const products = await processBatchOfProducts(batch, retailer);
    await ProductRepository.insertProducts(products);
  }
}

export const scrapHTMLProductsFromRetailer = async (retailer: string) => {
  const startTime = currentTime();
  console.log(`Task for ${retailer} started at: ${startTime}`);

  const firstResponseAxiosSitemap = await getSitemapData(''); // Enter URL of the sitemap

  if (firstResponseAxiosSitemap) {
    const sitemaps = firstResponseAxiosSitemap
      .filter((sitemap) => sitemap.loc.includes('product')) // You need to debug this in the case this filter doesn't actually work
      .map((sitemap) => sitemap.loc);
    const allSitesFromSiteMap = [];
    const sitePromises = sitemaps.map(async (site) => {
      const sitemap = await getSitemapData(site);
      if (sitemap) {
        const productSitemaps = sitemap.map((sitemap) => sitemap.loc);
        return productSitemaps;
      } else return '';
    });
    const allProductSitemaps = await Promise.all(sitePromises);
    allSitesFromSiteMap.push(...allProductSitemaps.flat());
    await processProductUrls(allSitesFromSiteMap, retailer);
    console.log('TASK COMPLETED SUCCESFULLY');
  }

  const finishTime = currentTime();
  console.log(`Task for ${retailer} finished at: ${finishTime}`);
};

export default scrapHTMLProductsFromRetailer;
