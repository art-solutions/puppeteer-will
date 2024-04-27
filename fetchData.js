const puppeteer = require('puppeteer');
const fs = require('fs');

async function fetchPageData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set user agent and other headers as required by the website
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
        'Accept': 'application/json',
        'X-Bbx-Csrf-Token': 'eb13146e-98b7-4be4-939e-aa14e7920fd6',
        'X-Wh-Client': 'api@willhaben.at;responsive_web;server;1.0.0;desktop',
        'Referer': 'https://www.willhaben.at/iad/kaufen-und-verkaufen/marktplatz/antiquitaeten-kunst-6941?isNavigation=true&isISRL=true&srcType=vertical-browse&srcAdd=6941'
    });

    // Navigate to the initial page
    await page.goto('https://www.willhaben.at/iad/kaufen-und-verkaufen/marktplatz/antiquitaeten-kunst-6941?isNavigation=true&isISRL=true&srcType=vertical-browse&srcAdd=6941', { waitUntil: 'networkidle0' });

    // Perform the API request
    const response = await page.evaluate(() => {
        return fetch('https://www.willhaben.at/webapi/iad/search/atz/5/301/atverz?rows=3&TOP_AD=topad_result&sort=11&b_ATTRIBUTE_TREE=6941', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Bbx-Csrf-Token': 'eb13146e-98b7-4be4-939e-aa14e7920fd6',
                'X-Wh-Client': 'api@willhaben.at;responsive_web;server;1.0.0;desktop'
            }
        }).then(response => response.json());
    });

    // Save the response to a JSON file
    fs.writeFile('list.json', JSON.stringify(response, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Saved response to list.json');
        }
    });

    await browser.close();
}

fetchPageData();