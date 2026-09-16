import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  
  // Go to Ledger
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('a, button, span, div')).find(el => el.innerText && el.innerText.includes('Credit Ledger'))?.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Click first row (Amani Trading Co.)
  await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr')).filter(el => el.innerText && el.innerText.includes('Amani Trading Co.'));
    if (rows.length > 0) rows[0].click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Click Edit Details
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(el => el.innerText && el.innerText.includes('Edit Details'))?.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Type using native setter
  await page.evaluate(() => {
    const input = document.querySelectorAll('input')[0];
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(input, 'Amani Trading Edited');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  
  // Click Save
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(el => el.innerText && el.innerText.includes('Save Changes'))?.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  const content = await page.content();
  console.log("Found edited?", content.includes("Amani Trading Edited"));
  
  await browser.close();
})();
