
const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const { format } = require('date-fns');
const BASE_URL = "/"; // Set as needed, or "" for relative root
module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy('./private/assets');

    eleventyConfig.addPassthroughCopy('./private/admin');

    eleventyConfig.addPassthroughCopy('./private/api');

    eleventyConfig.addPassthroughCopy('./private/ads.txt');

    eleventyConfig.addPassthroughCopy('./private/robots.txt');

    eleventyConfig.addPassthroughCopy('./private/sitemap.xml');

    eleventyConfig.addPassthroughCopy('./private/payment');

    eleventyConfig.addGlobalData("baseUrl", BASE_URL);

    eleventyConfig.addCollection('discountedproduct', function(collectionApi) {
      return collectionApi.getFilteredByTag('products') // Get all items tagged with 'products'
        .filter(item => item.data.discounted === true) // Filter items where 'discounted' is true
        .reverse(); // Reverse the order to get from latest to oldest
    });

    eleventyConfig.addCollection('trendingproduct', function (collectionApi) {
      return collectionApi.getFilteredByTag('products') // Get all items tagged with 'products'
        .filter(item => item.data.trending === true) // Filter items where 'discounted' is true
        .reverse(); // Reverse the order to get from latest to oldest
    });

    eleventyConfig.addCollection('multicolorsaree', function (collectionApi) {
      return collectionApi.getFilteredByTag('products') // Get all items tagged with 'products'
        .filter(item => item.data.multicolor === true) // Filter items where 'discounted' is true
        .reverse(); // Reverse the order to get from latest to oldest
    });

    eleventyConfig.addCollection('blacksaree', function (collectionApi) {
      return collectionApi.getFilteredByTag('products') // Get all items tagged with 'products'
        .filter(item => item.data.black === true) // Filter items where 'discounted' is true
        .reverse(); // Reverse the order to get from latest to oldest
    });

    eleventyConfig.addCollection('bluesaree', function (collectionApi) {
      return collectionApi.getFilteredByTag('products') // Get all items tagged with 'products'
        .filter(item => item.data.blue === true) // Filter items where 'discounted' is true
        .reverse(); // Reverse the order to get from latest to oldest
    });

    eleventyConfig.addCollection('brownsaree', function (collectionApi) {
      return collectionApi.getFilteredByTag('products') // Get all items tagged with 'products'
        .filter(item => item.data.brown === true) // Filter items where 'discounted' is true
        .reverse(); // Reverse the order to get from latest to oldest
    });

    eleventyConfig.addCollection('greensaree', function (collectionApi) {
      return collectionApi.getFilteredByTag('products') // Get all items tagged with 'products'
        .filter(item => item.data.green === true) // Filter items where 'discounted' is true
        .reverse(); // Reverse the order to get from latest to oldest
    });

    eleventyConfig.addCollection('greysaree', function (collectionApi) {
      return collectionApi.getFilteredByTag('products') // Get all items tagged with 'products'
        .filter(item => item.data.grey === true) // Filter items where 'discounted' is true
        .reverse(); // Reverse the order to get from latest to oldest
    });

    eleventyConfig.addCollection('orangesaree', function (collectionApi) {
      return collectionApi.getFilteredByTag('products') // Get all items tagged with 'products'
        .filter(item => item.data.orange === true) // Filter items where 'discounted' is true
        .reverse(); // Reverse the order to get from latest to oldest
    });

    eleventyConfig.addCollection('pinksaree', function (collectionApi) {
      return collectionApi.getFilteredByTag('products') // Get all items tagged with 'products'
        .filter(item => item.data.pink === true) // Filter items where 'discounted' is true
        .reverse(); // Reverse the order to get from latest to oldest
    });

    eleventyConfig.addCollection('redsaree', function (collectionApi) {
      return collectionApi.getFilteredByTag('products') // Get all items tagged with 'products'
        .filter(item => item.data.red === true) // Filter items where 'discounted' is true
        .reverse(); // Reverse the order to get from latest to oldest
    });

    eleventyConfig.addCollection('violetsaree', function (collectionApi) {
      return collectionApi.getFilteredByTag('products') // Get all items tagged with 'products'
        .filter(item => item.data.violet === true) // Filter items where 'discounted' is true
        .reverse(); // Reverse the order to get from latest to oldest
    });

    eleventyConfig.addCollection('whitesaree', function (collectionApi) {
      return collectionApi.getFilteredByTag('products') // Get all items tagged with 'products'
        .filter(item => item.data.white === true) // Filter items where 'discounted' is true
        .reverse(); // Reverse the order to get from latest to oldest
    });

    eleventyConfig.addCollection('yellowsaree', function (collectionApi) {
      return collectionApi.getFilteredByTag('products') // Get all items tagged with 'products'
        .filter(item => item.data.yellow === true) // Filter items where 'discounted' is true
        .reverse(); // Reverse the order to get from latest to oldest
    });

    // Sort products by date (newest to oldest)
    eleventyConfig.addCollection("latestProducts", (collectionApi) => {
      return collectionApi.getFilteredByTag("products").reverse();
    });

// Sort products by price (lowest to highest)
    eleventyConfig.addCollection('productsByPrice', function (collectionApi) {
      return collectionApi.getAll()
          .filter(item => item.data.collection === 'products')
          .sort((a, b) => a.data.price - b.data.price);
    });

// Sort products by name (alphabetical)
    eleventyConfig.addCollection('productsByName', function (collectionApi) {
      return collectionApi.getAll()
          .filter(item => item.data.collection === 'products')
          .sort((a, b) => a.data.name.localeCompare(b.data.name));
    });
      
    // eleventyConfig.addCollection('pageFeaturedPosts', function (collectionApi) {
    //     return function(tag) {
    //         return collectionApi.getFilteredByTag(tag).filter(item => item.data.featured === true);      
    //     };
    // });  
    
    eleventyConfig.addFilter('formatDate', function (date, formatString) {
        return format(new Date(date), formatString);
      });
    
      eleventyConfig.addPlugin(sitemap, {
        sitemap: {
          hostname: "https://vairaoosi.com",
        },
      });
      
    return{
        dir: {
            input: "private",
            output: "public"
        }
    }
}
