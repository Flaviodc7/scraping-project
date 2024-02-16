import axios from 'axios';
import xml2js from 'xml2js';
import { SitemapEntity } from '@modules/scrapingProducts/domain/entities';

export const getSitemapData = async (url: string): Promise<SitemapEntity[] | null> => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url,
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',

      // Add cookies as needed
    },
  };
  try {
    const response = await axios.request(config);
    const parser = new xml2js.Parser();
    return await new Promise((resolve, reject) => {
      parser.parseString(response.data, (err, result) => {
        if (err) {
          console.log('Error in URL:', url);
          reject(err);
        } else {
          const sitemaps: SitemapEntity[] = result.sitemapindex?.sitemap ?? result.urlset.url;
          const sitemapData = sitemaps.map((sitemap) => ({
            loc: sitemap.loc[0],
            lastmod: sitemap.lastmod[0],
          }));
          resolve(sitemapData);
        }
      });
    });
  } catch (error) {
    console.log('Error in URL:', url);
    throw error;
  }
};
