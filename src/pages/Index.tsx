import { useState, useEffect, useCallback, useRef } from 'react';
import { Language, t } from '@/lib/translations';
import LanguageToggle from '@/components/LanguageToggle';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview, { InvoiceItem } from '@/components/InvoicePreview';
import BillHistory, { SavedInvoice, saveToHistory } from '@/components/BillHistory';
import { Download, Printer, FilePlus, History } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const BILL_NO_KEY = 'royal_marbles_bill_no';

const getInitialBillNo = (): number => {
  const stored = localStorage.getItem(BILL_NO_KEY);
  return stored ? Number(stored) : 1;
};

const todayStr = () => new Date().toISOString().split('T')[0];

const Index = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [billDate, setBillDate] = useState(todayStr());
  const [billNo, setBillNo] = useState(getInitialBillNo);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: crypto.randomUUID(), particulars: '', qty: 0, rate: 0 },
  ]);
  const [gstEnabled, setGstEnabled] = useState(false);
  const [gstPercent, setGstPercent] = useState(18);
  const [notes, setNotes] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [previewScale, setPreviewScale] = useState(1);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(BILL_NO_KEY, String(billNo));
  }, [billNo]);

  useEffect(() => {
    const handler = () => setHistoryRefresh(p => p + 1);
    window.addEventListener('history-updated', handler);
    return () => window.removeEventListener('history-updated', handler);
  }, []);

  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const width = previewContainerRef.current.clientWidth;
        // 210mm is approximately 794px
        if (width < 794) {
          setPreviewScale(width / 794);
        } else {
          setPreviewScale(1);
        }
      }
    };
    
    // Initial scale and listener
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const computeGrandTotal = useCallback(() => {
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
    const halfGst = gstPercent / 2;
    const tax = gstEnabled ? subtotal * (halfGst / 100) * 2 : 0;
    return subtotal + tax;
  }, [items, gstEnabled, gstPercent]);

  const validate = (): boolean => {
    if (!customerName.trim()) {
      toast.error(t('validationName', language));
      return false;
    }
    const hasItem = items.some(i => i.particulars.trim() && i.qty > 0 && i.rate > 0);
    if (!hasItem) {
      toast.error(t('validationItem', language));
      return false;
    }
    return true;
  };

  const saveCurrentBill = () => {
    saveToHistory({
      billNo, billDate, customerName, customerAddress, customerPhone,
      items, gstEnabled, gstPercent, notes, grandTotal: computeGrandTotal(),
    });
    setHistoryRefresh(p => p + 1);
  };

  const handleDownloadPdf = async () => {
    if (!validate()) return;
    saveCurrentBill();
    const element = document.getElementById('invoice-preview');
    if (!element) return;
    
    toast.info('Generating PDF...');
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`RoyalMarbles_Invoice_${billNo}_${billDate}.pdf`);
    toast.success('PDF downloaded!');
  };

  const handlePrint = () => {
    if (!validate()) return;
    saveCurrentBill();
    window.print();
  };

  const handleNewBill = () => {
    if (customerName.trim() && items.some(i => i.particulars.trim())) {
      saveCurrentBill();
    }
    setCustomerName('');
    setCustomerAddress('');
    setCustomerPhone('');
    setBillDate(todayStr());
    setBillNo(prev => prev + 1);
    setItems([{ id: crypto.randomUUID(), particulars: '', qty: 0, rate: 0 }]);
    setGstEnabled(false);
    setGstPercent(18);
    setNotes('');
    toast.success(t('newBill', language) + ' #' + (billNo + 1));
  };

  const handleLoadInvoice = (inv: SavedInvoice) => {
    setCustomerName(inv.customerName);
    setCustomerAddress(inv.customerAddress);
    setCustomerPhone(inv.customerPhone);
    setBillDate(inv.billDate);
    setBillNo(inv.billNo);
    setItems(inv.items);
    setGstEnabled(inv.gstEnabled);
    setGstPercent(inv.gstPercent);
    setNotes(inv.notes);
    setShowHistory(false);
    toast.success(`Loaded Bill #${inv.billNo}`);
  };

  const historyLabel = language === 'ta' ? 'வரலாறு' : language === 'hi' ? 'इतिहास' : 'History';

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-lg font-bold text-primary">Royal Marbles</h1>
            <span className="text-xs text-muted-foreground hidden sm:inline">Invoice Generator</span>
          </div>
          <LanguageToggle language={language} setLanguage={setLanguage} />
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t('invoiceForm', language)}</h2>
              <InvoiceForm
                language={language}
                customerName={customerName} setCustomerName={setCustomerName}
                customerAddress={customerAddress} setCustomerAddress={setCustomerAddress}
                customerPhone={customerPhone} setCustomerPhone={setCustomerPhone}
                billDate={billDate} setBillDate={setBillDate}
                billNo={billNo} setBillNo={setBillNo}
                items={items} setItems={setItems}
                gstEnabled={gstEnabled} setGstEnabled={setGstEnabled}
                gstPercent={gstPercent} setGstPercent={setGstPercent}
                notes={notes} setNotes={setNotes}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <button onClick={handleDownloadPdf}
                className="flex flex-1 items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity shadow-md">
                <Download className="w-4 h-4" /> {t('downloadPdf', language)}
              </button>
              <button onClick={handlePrint}
                className="flex flex-1 items-center justify-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
                <Printer className="w-4 h-4" /> {t('printInvoice', language)}
              </button>
              <button onClick={handleNewBill}
                className="flex items-center justify-center w-full sm:w-auto gap-2 border border-accent text-accent px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-accent/10 transition-colors sm:ml-auto">
                <FilePlus className="w-4 h-4" /> {t('newBill', language)}
              </button>
            </div>

            {/* Bill History */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <History className="w-4 h-4" /> {historyLabel}
                </span>
                <span className="text-xs text-muted-foreground">{showHistory ? '▲' : '▼'}</span>
              </button>
              {showHistory && (
                <div className="px-5 pb-4">
                  <BillHistory language={language} onLoad={handleLoadInvoice} refreshKey={historyRefresh} />
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">{t('livePreview', language)}</h2>
            <div 
              ref={previewContainerRef}
              className="rounded-xl border border-border shadow-lg bg-muted/30 p-2 sm:p-4 overflow-hidden flex justify-center print:overflow-visible print:border-none print:shadow-none print:bg-transparent print:p-0"
            >
              <div 
                className="print:!transform-none print:!m-0"
                style={{ 
                  transform: `scale(${previewScale})`, 
                  transformOrigin: 'top center',
                  // The original A4 height is 297mm (approx 1122px)
                  // We collapse the container height based on scale to avoid whitespace at the bottom
                  marginBottom: previewScale < 1 ? `calc(-297mm * ${1 - previewScale})` : 0 
                }}
              >
                <InvoicePreview
                  language={language}
                  customerName={customerName}
                  customerAddress={customerAddress}
                  customerPhone={customerPhone}
                  billDate={billDate}
                  billNo={billNo}
                  items={items}
                  gstEnabled={gstEnabled}
                  gstPercent={gstPercent}
                  notes={notes}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
