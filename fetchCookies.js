const puppeteer = require('puppeteer');

async function fetchCookies() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the specified URL
    await page.goto('https://www.willhaben.at/iad/kaufen-und-verkaufen/marktplatz/antiquitaeten-kunst-6941?isNavigation=true&isISRL=true&srcType=vertical-browse&srcAdd=6941', { waitUntil: 'networkidle0' });

    // Extract all cookies
    const cookies = await page.cookies();

    // Output cookies in JSON format to the console
    console.log(JSON.stringify(cookies, null, 2));

    await browser.close();
}

fetchCookies();