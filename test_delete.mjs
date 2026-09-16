import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  
  // Go to Settings
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('a, button, span, div')).find(el => el.innerText && el.innerText.includes('Settings'))?.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Click Data Management tab
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(el => el.innerText && el.innerText.includes('Data Management'))?.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Click first trash icon (should be pool_001)
  await page.evaluate(() => {
    const trashBtn = document.querySelector('.text-danger-500');
    if (trashBtn) trashBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  
  // Click Confirm
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(el => el.innerText && el.innerText.includes('Confirm'))?.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  // Check if it's gone
  const content = await page.content();
  console.log("Still has Coastal Trade Finance Pool?", content.includes("Coastal Trade Finance Pool"));
  
  await browser.close();
})();
