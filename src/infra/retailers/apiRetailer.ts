import axios from 'axios';
import { ProductScrapingEntity } from '@modules/scrapingProducts/domain/productScraping.entity';
import { ProductScrapingMongoRepository } from '@repositories/products.mongo.repository';
import { removeHTMLTags } from '@utils/accentMarkDictionary';
import { delay } from '@utils/delay';
import { getSitemapData } from '@utils/getSitemapData';
import { splitArray } from '@utils/splitArray';
import { currentTime } from '@utils/currentTime';

const getCookies = async () => {
  try {
    const data = JSON.stringify({});

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '', // url where the retailer responses the Cookie
      headers: {
        accept: 'application/json, text/plain, */*',
        // Add another cookies as needed
      },
      data,
    };

    const response = await axios.request(config);
    const cookies = response.headers['set-cookie']; // Change this property if it needed
    if (cookies) {
      const cookie = cookies[0].split(';')[0];
      return cookie;
    } else {
      console.log('No Set-Cookie header found');
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getProductData = async (url: string, cookie: string) => {
  const MAX_RETRIES = 3; // Configure many retries if needed
  const RETRY_DELAY = 5000; // Time in miliseconds to retry
  const regexSku = /(\d+)(?=.html$)/;
  const urlMatch = url.match(regexSku);

  if (urlMatch) {
    const extractedSku = urlMatch[1];
    const finalUrl = `https://api.retailer.com/product/detail/${extractedSku}`; // Use the actual url of the retailer
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: finalUrl,
      headers: {
        accept: 'application/json, text/plain, */*',
        cookie,

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
        console.log(error);
        if (attempts >= MAX_RETRIES) {
          return '';
        }
        await delay(RETRY_DELAY);
      }
    }
  }
};

const getBreadcrumbsData = async (category: string, cookie: string) => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 5000;
  const finalUrl = `https://api.retailer.com/product/breadcrumbs/${category}`;
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: finalUrl,
    headers: {
      cookie,

      // Add cookies as needed
    },
  };
  let attempts = 0;
  while (attempts <= MAX_RETRIES) {
    try {
      const response = await axios.request(config);
      return response.data.map((item: any) => item.categoryName);
    } catch (error) {
      attempts++;
      console.log(`Attempt ${attempts} failed for: ${category}`);
      if (attempts >= MAX_RETRIES) {
        return '';
      }
      await delay(RETRY_DELAY);
    }
  }
};

const processBatchOfProducts = async (batch: string[], cookie: string, retailer: string) => {
  const products: ProductScrapingEntity[] = [];
  await Promise.all(
    batch.map(
      async (productSiteUrl) => {
        const data = await getProductData(productSiteUrl, cookie);
        if (data) {
          const productData = data.productData;

          const breadcrumbs =
            productData.category !== undefined ? await getBreadcrumbsData(productData.category, cookie) : '';

          // Edit this part as the retailer needs
          const product = {
            batchs: [
              {
                active: productData.stock > 0 ? 1 : 0,
                expireDate: 0,
                id: productData.id,
                normalPrice: Number(productData.prices ? productData.prices['price-list'] : 0),
                settlementPrice: Number(productData.prices?.['price-sale'] ?? 0),
                stock: productData.stock,
              },
            ],
            ean: '',
            fullName: productData.name,
            metadata: {
              title: productData.pageTitle ?? '',
              description: productData.metaTags.description ?? '',
              keywords: productData.pageKeywords ?? '',
            },
            photosURL: [productData.imageGroups[0]?.images[0]?.link ?? ''],
            presentation: productData.format,
            productBreadcrumbs: breadcrumbs.length ? breadcrumbs.join(' > ') : 'NO BREADCRUMBS',
            quantityPerContainer: 1,
            recommendations: productData.tabs.find((tab: any) => tab.title === 'Recommendations')?.content
              ? removeHTMLTags(productData.tabs.find((tab: any) => tab.title === 'Recommendations')?.content)
              : 'NO RECOMMENDATIONS',
            requiresPrescription: productData.prescription ? 1 : 0,
            restrictions: '',
            retailer,
            sku: `${String(productData.id)}-${retailer}`,
            temporaryCategories: [],
          };
          products.push(product);
        }
      }
    )
  );
  return products;
};

async function processProductUrls(allSitesFromSiteMap: string[], retailer: string) {
  const ProductRepository = new ProductScrapingMongoRepository();
  const batches = splitArray(allSitesFromSiteMap, 20);
  const cookie = await getCookies();
  if (cookie) {
    for (const batch of batches) {
      const products = await processBatchOfProducts(batch, cookie, retailer);
      await ProductRepository.insertProducts(products);
    }
  }
}

export const scrapApiProductsFromRetailer = async (retailer: string) => {
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
    console.log('TASK COMPLETED SUCCESSFULLY');
  }

  const finishTime = currentTime();
  console.log(`Task for ${retailer} finished at: ${finishTime}`);
};

export default scrapApiProductsFromRetailer;
