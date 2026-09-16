import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("Navigating to Ledger...");
  // Look for the Credit Ledger link
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('a, button, span, div')).find(el => el.innerText && el.innerText.includes('Credit Ledger'))?.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Try to find the Amani Trading row
  const rowId = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('div, tr, button')).filter(el => el.innerText && el.innerText.includes('Amani Trading Co.'));
    if (rows.length > 0) {
        rows[0].click();
        return true;
    }
    return false;
  });
  
  console.log("Clicked row:", rowId);
  await new Promise(r => setTimeout(r, 1000));
  
  // Click Edit Details
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(el => el.innerText && el.innerText.includes('Edit Details'))?.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Type something new
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    if (inputs.length > 0) {
        inputs[0].value = 'Amani Trading Co. Edited';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  
  // Click Save Changes
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(el => el.innerText && el.innerText.includes('Save Changes'))?.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Check if it updated
  const updatedText = await page.evaluate(() => document.body.innerText);
  console.log("Updated?", updatedText.includes('Amani Trading Co. Edited'));
  
  await browser.close();
})();
