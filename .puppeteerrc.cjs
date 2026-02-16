const path = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
    // Changes the cache location for Puppeteer to be inside the project folder.
    // This helps with Render caching mechanism and permissions.
    cacheDirectory: path.join(__dirname, '.cache', 'puppeteer'),
};
