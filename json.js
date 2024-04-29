const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the desired URL
  await page.goto('https://www.willhaben.at/iad/kaufen-und-verkaufen/marktplatz/antiquitaeten-kunst-6941');

  // Extract the JSON data from the <script> tag
  const jsonData = await page.evaluate(() => {
    const scriptElement = document.querySelector('#__NEXT_DATA__');
    if (scriptElement) {
      return JSON.parse(scriptElement.textContent);
    }
    return null;
  });

  if (jsonData) {
    // Save the JSON data to a file
    fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2));
    console.log('JSON data saved to data.json');
  } else {
    console.log('JSON data not found');
  }

  await browser.close();
})();