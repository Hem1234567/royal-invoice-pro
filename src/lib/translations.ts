export type Language = 'en' | 'ta' | 'hi';

export const translations: Record<string, Record<Language, string>> = {
  billTo: { en: 'Bill To', ta: 'பெறுநர்', hi: 'प्राप्तकर्ता' },
  date: { en: 'Date', ta: 'தேதி', hi: 'तारीख' },
  billNo: { en: 'Bill No.', ta: 'பில் எண்', hi: 'बिल नंबर' },
  particulars: { en: 'Particulars', ta: 'விவரங்கள்', hi: 'विवरण' },
  qty: { en: 'Qty', ta: 'அளவு', hi: 'मात्रा' },
  sqft: { en: 'Sq.Ft', ta: 'ச.அடி', hi: 'वर्ग फुट' },
  rate: { en: 'Rate (₹)', ta: 'விலை (₹)', hi: 'दर (₹)' },
  amount: { en: 'Amount (₹)', ta: 'தொகை (₹)', hi: 'राशि (₹)' },
  subtotal: { en: 'Subtotal', ta: 'மொத்தம்', hi: 'उप-कुल' },
  grandTotal: { en: 'Grand Total', ta: 'மொத்த தொகை', hi: 'कुल राशि' },
  addRow: { en: 'Add Item', ta: 'பொருள் சேர்', hi: 'आइटम जोड़ें' },
  downloadPdf: { en: 'Download PDF', ta: 'PDF பதிவிறக்கு', hi: 'PDF डाउनलोड करें' },
  printInvoice: { en: 'Print', ta: 'அச்சிடு', hi: 'प्रिंट करें' },
  newBill: { en: 'New Bill', ta: 'புதிய பில்', hi: 'नया बिल' },
  amountInWords: { en: 'Amount in Words', ta: 'தொகை எழுத்தில்', hi: 'राशि शब्दों में' },
  customerName: { en: 'Customer Name', ta: 'வாடிக்கையாளர் பெயர்', hi: 'ग्राहक का नाम' },
  customerAddress: { en: 'Address (optional)', ta: 'முகவரி (விரும்பினால்)', hi: 'पता (वैकल्पिक)' },
  customerPhone: { en: 'Phone (optional)', ta: 'தொலைபேசி (விரும்பினால்)', hi: 'फ़ोन (वैकल्पिक)' },
  cashBill: { en: 'CASH BILL', ta: 'ரொக்க பில்', hi: 'नकद बिल' },
  gstApplicable: { en: 'Apply GST', ta: 'GST பொருந்தும்', hi: 'GST लागू करें' },
  gstNotApplicable: { en: 'GST Not Applicable', ta: 'GST பொருந்தாது', hi: 'GST लागू नहीं' },
  cgst: { en: 'CGST', ta: 'CGST', hi: 'CGST' },
  sgst: { en: 'SGST', ta: 'SGST', hi: 'SGST' },
  notes: { en: 'Notes / Terms', ta: 'குறிப்புகள்', hi: 'नोट्स / शर्तें' },
  forRoyal: { en: 'For ROYAL MARBLES & GRANITES', ta: 'ROYAL MARBLES & GRANITES க்காக', hi: 'ROYAL MARBLES & GRANITES के लिए' },
  signature: { en: 'Authorized Signatory', ta: 'அங்கீகரிக்கப்பட்ட கையொப்பம்', hi: 'अधिकृत हस्ताक्षरकर्ता' },
  serialNo: { en: 'S.No', ta: 'வ.எண்', hi: 'क्र.सं.' },
  invoiceForm: { en: 'Invoice Form', ta: 'விலைப்பட்டி படிவம்', hi: 'चालान फॉर्म' },
  livePreview: { en: 'Live Preview', ta: 'நேரடி முன்னோட்டம்', hi: 'लाइव पूर्वावलोकन' },
  validationName: { en: 'Customer name is required', ta: 'வாடிக்கையாளர் பெயர் தேவை', hi: 'ग्राहक का नाम आवश्यक है' },
  validationItem: { en: 'At least one item is required', ta: 'குறைந்தது ஒரு பொருள் தேவை', hi: 'कम से कम एक आइटम आवश्यक है' },
  gstPercent: { en: 'GST %', ta: 'GST %', hi: 'GST %' },
  hasCustomerGst: { en: 'I have Customer GST No', ta: 'என்னிடம் வாடிக்கையாளர் ஜிஎஸ்டி எண் உள்ளது', hi: 'मेरे पास ग्राहक का जीएसटी नंबर है' },
  customerGstNo: { en: 'Customer GST No.', ta: 'வாடிக்கையாளர் ஜிஎஸ்டி எண்', hi: 'ग्राहक का जीएसटी नंबर' },
  customerGstNoForm: { en: 'Customer GST No. (optional)', ta: 'வாடிக்கையாளர் ஜிஎஸ்டி எண் (விரும்பினால்)', hi: 'ग्राहक का जीएसटी नंबर (वैकल्पिक)' },
};

export const t = (key: string, lang: Language): string => {
  return translations[key]?.[lang] || translations[key]?.en || key;
};
