const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const app = express();
const port = 3888;

app.use(express.json());

app.post('/extractlist', async (req, res) => {
    const { apiWill, categoryWill } = req.body;

    if (!apiWill || !categoryWill) {
        res.status(400).send('apiWill and categoryWill parameters are required.');
        return;
    }

    try {
        const response = await fetchPageData(apiWill, categoryWill);
        res.json(response);
    } catch (error) {
        console.error('Error during fetching data:', error);
        res.status(500).send('Failed to fetch data.');
    }
});

async function fetchPageData(apiWill, categoryWill) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(categoryWill, { waitUntil: 'networkidle0' });
    const cookies = await page.cookies();
    const csrfTokenCookie = cookies.find(cookie => cookie.name === 'x-bbx-csrf-token');
    const csrfToken = csrfTokenCookie ? csrfTokenCookie.value : null;

    if (!csrfToken) {
        console.error('CSRF token not found');
        await browser.close();
        throw new Error('CSRF token not found');
    }

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
        'Accept': 'application/json',
        'X-Bbx-Csrf-Token': csrfToken,
        'X-Wh-Client': 'api@willhaben.at;responsive_web;server;1.0.0;desktop',
        'Referer': categoryWill
    });

    const response = await page.evaluate((apiUrl) => {
        return fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        }).then(response => response.json());
    }, apiWill);

    await browser.close();
    return response;
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});