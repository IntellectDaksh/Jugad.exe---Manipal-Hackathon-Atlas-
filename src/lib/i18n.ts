export const DICTIONARY: Record<string, Record<string, string>> = {
  hi: {
    'Dashboard': 'डैशबोर्ड',
    'Origination Hub': 'उत्पत्ति केंद्र',
    'Credit Ledger': 'क्रेडिट लेजर',
    'Macro Analytics': 'मैक्रो एनालिटिक्स',
    'Stress Sandbox': 'स्ट्रेस सैंडबॉक्स',
    'Seasonal Heatmap': 'मौसमी हीटमैप',
    'Compliance & Reports': 'अनुपालन और रिपोर्ट',
    'Audit Log': 'ऑडिट लॉग',
    'Settings': 'सेटिंग्स',
    'Portfolio Dashboard': 'पोर्टफोलियो डैशबोर्ड',
    'Total Exposure': 'कुल जोखिम',
    'Underwrite Borrower': 'उधारकर्ता को अंडरराइट करें',
    'New Credit Pool': 'नया क्रेडिट पूल',
    'Risk Platform': 'जोखिम मंच',
    'Light Mode': 'लाइट मोड',
    'Dark Mode': 'डार्क मोड'
  }
};

export function t(key: string): string {
  try {
    const prefsRaw = localStorage.getItem('cashpulse_prefs');
    const prefs = prefsRaw ? JSON.parse(prefsRaw) : { lang: 'en' };
    const lang = prefs.lang || 'en';
    if (lang === 'en') return key;
    return DICTIONARY[lang]?.[key] || key;
  } catch (e) {
    return key;
  }
}
