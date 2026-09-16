import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  await new Promise(r => setTimeout(r, 2000));
  
  // Dump all React keys or somehow get the IDs?
  // We can just dump the window.__REACT_DEVTOOLS_GLOBAL_HOOK__ or similar,
  // or we can execute a script in the page to find the store.
  
  const content = await page.evaluate(() => {
    // If we can't access React state, let's just get the DOM elements that might have IDs.
    // The Ledger checkboxes have IDs?
    // Let's go to Ledger
    const btns = Array.from(document.querySelectorAll('a, button, span, div')).filter(el => el.innerText && el.innerText.includes('Credit Ledger'));
    if(btns.length > 0) btns[0].click();
    return true;
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  const ids = await page.evaluate(() => {
    // There are no explicit IDs in the DOM, but let's see.
    // We can't access React state easily.
    return Array.from(document.querySelectorAll('tr')).map(tr => tr.innerHTML);
  });
  
  console.log('Rows:', ids.length);
  
  await browser.close();
})();
