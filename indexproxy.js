const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const PORT = 4555;

app.use(express.json());

// Array of proxy servers
const proxies = [
    'http://proxy1:port',
    'http://proxy2:port',
    'http://proxy3:port',
    'http://proxy4:port',
    'http://proxy5:port'
];

let proxyIndex = 0;

function getNextProxy() {
    const proxy = proxies[proxyIndex];
    proxyIndex = (proxyIndex + 1) % proxies.length;
    return proxy;
}

app.post('/extractdata', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }

    let browser;
    try {
        const proxy = getNextProxy(); // Get the next proxy in the list
        const launchOptions = {
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                `--proxy-server=${proxy}` // Add the proxy server
            ]
        };

        // Launch the browser with the launch options
        browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage();

        // Navigate to the desired URL
        await page.goto(url);

        // Extract the JSON data from the <script> tag
        const jsonData = await page.evaluate(() => {
            const scriptElement = document.querySelector('#__NEXT_DATA__');
            if (scriptElement) {
                return JSON.parse(scriptElement.textContent);
            }
            return null;
        });

        if (jsonData) {
            // Return the JSON data in response
            res.status(200).send(jsonData);
        } else {
            res.status(404).send({ error: 'JSON data not found' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Failed to process the request' });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});