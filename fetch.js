const puppeteer = require('puppeteer');

async function fetchPageData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the specified URL to retrieve the CSRF token
    await page.goto('https://www.willhaben.at/iad/kaufen-und-verkaufen/marktplatz/antiquitaeten-kunst-6941?isNavigation=true&isISRL=true&srcType=vertical-browse&srcAdd=6941', { waitUntil: 'networkidle0' });

    // Extract the CSRF token from cookies
    const cookies = await page.cookies();
    const csrfTokenCookie = cookies.find(cookie => cookie.name === 'x-bbx-csrf-token');
    const csrfToken = csrfTokenCookie ? csrfTokenCookie.value : null;

    if (!csrfToken) {
        console.error('CSRF token not found');
        await browser.close();
        return;
    }

    console.log('CSRF Token:', csrfToken);

    // Set user agent and headers with the CSRF token for the API request
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
        'Accept': 'application/json',
        'X-Bbx-Csrf-Token': csrfToken,
        'X-Wh-Client': 'api@willhaben.at;responsive_web;server;1.0.0;desktop',
        'Referer': 'https://www.willhaben.at/iad/kaufen-und-verkaufen/marktplatz/antiquitaeten-kunst-6941?isNavigation=true&isISRL=true&srcType=vertical-browse&srcAdd=6941'
    });

    // Perform the API request
    const response = await page.evaluate(() => {
        return fetch('https://www.willhaben.at/webapi/iad/search/atz/5/301/atverz?rows=3&TOP_AD=topad_result&sort=11&b_ATTRIBUTE_TREE=6941', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        }).then(response => response.json());
    });

    console.log('Response:', JSON.stringify(response, null, 2));

    await browser.close();
}

fetchPageData();