const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const PORT = 3888;

app.use(express.json());

app.post('/extractdata', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }

    try {
            const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
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

        await browser.close();

        if (jsonData) {
            // Return the JSON data in response
            res.status(200).send(jsonData);
        } else {
            res.status(404).send({ error: 'JSON data not found' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Failed to process the request' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});