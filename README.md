# scrapping-products
## Overview
The `scrapping-products` project is designed to automate the process of scraping product information from various retailer websites. Utilizing a combination of Axios for HTTP requests, Cheerio for parsing HTML, and Mongoose for data persistence, this tool navigates through retailer sitemaps to extract and store data about products efficiently.

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

## Contributing
Contributions to the scrapping-productos project are welcome. Please ensure to follow the project's coding standards and submit pull requests for any enhancements, bug fixes, or feature additions.

## License
This project is licensed under the ISC License. See the LICENSE file for more details.