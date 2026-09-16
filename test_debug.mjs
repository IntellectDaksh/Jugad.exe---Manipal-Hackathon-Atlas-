import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  
  // Expose a function to run React state changes
  await page.evaluate(() => {
    // Look for the Amani Trading row
    const row = Array.from(document.querySelectorAll('tr')).find(r => r.innerText.includes('Amani Trading Co.'));
    if (!row) { console.log('Row not found'); return; }
    
    console.log('Row text before:', row.innerText);
    row.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    const editBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Edit Details'));
    if (editBtn) editBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeSetter.call(inputs[0], 'Amani Trading Edited');
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
    
    const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Save Changes'));
    saveBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    // See if the dossier updated
    const h1 = document.querySelector('h1');
    console.log('Dossier H1:', h1 ? h1.innerText : 'none');
  });
  
  await browser.close();
})();
