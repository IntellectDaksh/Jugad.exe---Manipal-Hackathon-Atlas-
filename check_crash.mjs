import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  
  await page.goto('http://127.0.0.1:5173');
  
  // Wait for the Dashboard to load and for borrower buttons to be visible
  await page.waitForSelector('button');
  
  // Click on the first borrower in the Early Warning Queue
  console.log('Clicking the first button...');
  const buttons = await page.$$('button');
  
  // Try to click one of the buttons that looks like a borrower
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('RSI')) {
      console.log('Clicking button with text:', text);
      await btn.click();
      break;
    }
  }

  // Wait a moment to let the modal try to render and catch any errors
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
