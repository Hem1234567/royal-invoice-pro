import { useState, useEffect } from 'react';
import { Language, t } from '@/lib/translations';
import LanguageToggle from '@/components/LanguageToggle';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview, { InvoiceItem } from '@/components/InvoicePreview';
import { Download, Printer, FilePlus } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const BILL_NO_KEY = 'royal_marbles_bill_no';

const getInitialBillNo = (): number => {
  const stored = localStorage.getItem(BILL_NO_KEY);
  return stored ? Number(stored) : 399;
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

  useEffect(() => {
    localStorage.setItem(BILL_NO_KEY, String(billNo));
  }, [billNo]);

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

  const handleDownloadPdf = async () => {
    if (!validate()) return;
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
    window.print();
  };

  const handleNewBill = () => {
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
            <div className="flex flex-wrap gap-3">
              <button onClick={handleDownloadPdf}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity shadow-md">
                <Download className="w-4 h-4" /> {t('downloadPdf', language)}
              </button>
              <button onClick={handlePrint}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
                <Printer className="w-4 h-4" /> {t('printInvoice', language)}
              </button>
              <button onClick={handleNewBill}
                className="flex items-center gap-2 border border-accent text-accent px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-accent/10 transition-colors ml-auto">
                <FilePlus className="w-4 h-4" /> {t('newBill', language)}
              </button>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">{t('livePreview', language)}</h2>
            <div className="overflow-auto rounded-xl border border-border shadow-lg bg-muted/30 p-4">
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
      </main>
    </div>
  );
};

export default Index;
