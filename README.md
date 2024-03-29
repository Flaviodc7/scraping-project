# scraping-products
## Overview
The `scraping-products` project is designed to automate the process of scraping product information from various retailer websites. Utilizing a combination of Axios for HTTP requests, Cheerio for parsing HTML, and Mongoose for data persistence, this tool navigates through retailer sitemaps to extract and store data about products efficiently.

## Features
- Automatically navigates sitemaps of retailer websites.
- Extracts detailed product information including prices, stock availability, and metadata.
- Stores the extracted data in a MongoDB database using a structured format.
- Robust error handling and retry logic for reliable data extraction.
- Configurable for different retailers by simply adjusting the sitemap URL and product detail endpoints.
## Getting Started
### Prerequisites
- Node.js installed on your system.
- A MongoDB database setup for storing the scraped product data.
- TypeScript and the TypeScript compiler installed globally or in your project.
### Installation
- Clone the repository to your local machine.
- Navigate to the project directory and install the dependencies:

```sh
npm install
```
Build the project to compile TypeScript files into JavaScript:
```sh
npm run build
```
- Configure your MongoDB connection string and any other environment-specific settings.
### Usage
To start scraping product data from configured retailers, run the following command:

```sh
npm start
```
This command executes the `handler.js` script, which begins the scraping process based on the configurations defined in your project.

## Main Components
- Handler (`handler.js`): The entry point of the application, coordinating the scraping of products from both API and HTML sources.

- Scraping Modules: Contains logic for extracting product data from retailers.

- `scrapApiProductsFromRetailer`: Scrapes product data from API endpoints.
- `scrapHTMLProductsFromRetailer`: Parses HTML pages to extract product information.
- Utilities: A collection of helper functions such as `delay`, `getSitemapData`, and `removeHTMLTags` to support the scraping process.

- Repositories: Interfaces with the MongoDB database to insert scraped product data.

- Entities: Defines the structure of product data for storage, including `ProductScrapingEntity`.

## Configuration Details Addition
### Overview of Configuration Steps:
The configuration process involves specifying the sitemap URL, configuring cookie retrieval for session management, and defining product data extraction logic. These steps are crucial for adapting the scraper to work with different retailer websites.

### Detailed Configuration Steps:

#### Sitemap URL Configuration:

In the `scrapApiProductsFromRetailer` and `scrapHTMLProductsFromRetailer` function, the sitemap URL is crucial for initiating the scraping process. You must replace the placeholder in the getSitemapData('') call with the actual sitemap URL of the retailer you intend to scrape.


#### Cookie Configuration:

The `getCookies` function is designed to automate the process of retrieving session cookies required for making subsequent requests to certain retailers that might require session persistence. Specify the URL where the retailer responds with the Cookie in the `config.url` field. Additionally, ensure the `headers` object is properly configured to mimic a real user agent if necessary.


#### Product Data Extraction Configuration:

The getProductData and getBreadcrumbsData functions are essential for extracting detailed product information and category breadcrumbs, respectively. For both functions, you need to:
Configure the final URL patterns (finalUrl) to match the retailer's API endpoint format for product details and breadcrumbs.
Ensure the cookie header is appropriately included in the request config if required by the retailer's website for access to the data.


#### Batch Processing of Products:

- The `processBatchOfProducts` function orchestrates the extraction of product data in batches. This function leverages `getProductData` and `getBreadcrumbsData` for detailed information and category navigation paths. When configuring this part:
- Adapt the product data mapping (`const product = { ... }`) to align with the specific fields and structure provided by the retailer's data source. This includes correctly mapping product attributes, handling stock availability, pricing, images, and metadata extraction.



## Final Note:
Ensure to respect the terms of service of the websites you are scraping and conduct scraping activities responsibly and ethically. Unauthorized scraping might violate the terms of service of some websites, so it's essential to obtain permission or ensure compliance with the website's scraping policies.

## Contributing
Contributions to the scraping-products project are welcome. Please ensure to follow the project's coding standards and submit pull requests for any enhancements, bug fixes, or feature additions.

## License
This project is licensed under the ISC License. See the LICENSE file for more details.