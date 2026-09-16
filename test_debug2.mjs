import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(() => {
    const row = Array.from(document.querySelectorAll('tr')).find(r => r.innerText.includes('Amani Trading Co.'));
    if(row) row.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    const editBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Edit Details'));
    if (editBtn) editBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  const v1 = await page.evaluate(() => document.querySelectorAll('input')[0].value);
  console.log('Value before:', v1);
  
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeSetter.call(inputs[0], 'Amani Trading Edited');
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
  });
  
  const v2 = await page.evaluate(() => document.querySelectorAll('input')[0].value);
  console.log('Value after:', v2);
  
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Save Changes')).click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  const h1 = await page.evaluate(() => {
    const el = document.querySelector('h1');
    return el ? el.innerText : null;
  });
  console.log('Dossier H1 after save:', h1);
  
  await browser.close();
})();
