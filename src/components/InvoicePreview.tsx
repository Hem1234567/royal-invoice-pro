import { Language, t } from '@/lib/translations';
import { amountToWords } from '@/lib/amountToWords';
import royalLogo from '@/assets/royal-marbles-logo.png';

export interface InvoiceItem {
  id: string;
  particulars: string;
  qty: number;
  rate: number;
}

interface InvoicePreviewProps {
  language: Language;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  billDate: string;
  billNo: number;
  items: InvoiceItem[];
  gstEnabled: boolean;
  gstPercent: number;
  hasCustomerGst: boolean;
  customerGstNo: string;
  notes: string;
}

const InvoicePreview = ({
  language, customerName, customerAddress, customerPhone,
  billDate, billNo, items, gstEnabled, gstPercent, hasCustomerGst, customerGstNo, notes,
}: InvoicePreviewProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const halfGst = gstPercent / 2;
  const cgst = gstEnabled ? subtotal * (halfGst / 100) : 0;
  const sgst = gstEnabled ? subtotal * (halfGst / 100) : 0;
  const grandTotal = subtotal + cgst + sgst;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div
      id="invoice-preview"
      className="bg-invoice mx-auto shadow-xl border border-invoice-border flex flex-col"
      style={{
        fontFamily: "'Inter', sans-serif",
        width: '210mm',
        minHeight: '297mm',
        padding: '12mm 15mm',
        boxSizing: 'border-box',
        justifyContent: 'center',
      }}
    >
      {/* Devotional Header */}
      <p className="text-center text-xs text-muted-foreground mb-2 italic">
        ஸ்ரீ மஹா கணபதி துணை
      </p>

      {/* Business Header with Logo */}
      <div className="text-center border-b-2 border-primary pb-4 mb-4">
        <img src={royalLogo} alt="Royal Marbles & Granites" className="mx-auto mb-2" style={{ height: '64px' }} />
        <h1 className="font-display text-2xl font-bold text-primary tracking-wide">
          ROYAL MARBLES & GRANITES
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Tiles, Marbles &amp; Granite Dealers
        </p>
        <p className="text-xs text-muted-foreground">
          No. 1943, TNHB, Kakkalur Bypass Road, Kakkalur Village, Thiruvallur – 602 001
        </p>
        <p className="text-xs text-muted-foreground">
          Ph: 9894297412 / 8939430036
        </p>
        <p className="text-xs text-muted-foreground font-semibold">
          GSTIN: 33FJJPS5599K1Z8
        </p>
      </div>

      {/* Cash Bill Header */}
      <div className="text-center mb-4">
        <span className="inline-block border-2 border-primary px-6 py-1 text-sm font-bold text-primary tracking-widest">
          {t('cashBill', language)}
        </span>
      </div>

      {/* Customer & Bill Info */}
      <div className="flex justify-between text-sm mb-4">
        <div className="space-y-1">
          <p><span className="font-semibold">{t('billTo', language)}:</span> {customerName || '—'}</p>
          {customerAddress && <p className="text-muted-foreground text-xs">{customerAddress}</p>}
          {customerPhone && <p className="text-muted-foreground text-xs">Ph: {customerPhone}</p>}
          {customerGstNo && <p className="text-muted-foreground text-xs"><span className="font-semibold">{t('customerGstNo', language)}:</span> {customerGstNo}</p>}
        </div>
        <div className="text-right space-y-1">
          <p><span className="font-semibold">{t('billNo', language)}:</span> {billNo}</p>
          <p><span className="font-semibold">{t('date', language)}:</span> {formatDate(billDate)}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-sm border-collapse mb-4">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            <th className="border border-primary p-2 text-left w-10">{t('serialNo', language)}</th>
            <th className="border border-primary p-2 text-left">{t('particulars', language)}</th>
            <th className="border border-primary p-2 text-right w-16">{t('qty', language)}</th>
            <th className="border border-primary p-2 text-right w-24">{t('rate', language)}</th>
            <th className="border border-primary p-2 text-right w-28">{t('amount', language)}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id} className="border-b border-invoice-border">
              <td className="border border-invoice-border p-2">{idx + 1}</td>
              <td className="border border-invoice-border p-2">{item.particulars || '—'}</td>
              <td className="border border-invoice-border p-2 text-right">{item.qty || ''}</td>
              <td className="border border-invoice-border p-2 text-right">{item.rate ? `₹${item.rate.toLocaleString('en-IN')}` : ''}</td>
              <td className="border border-invoice-border p-2 text-right font-medium">
                {item.qty && item.rate ? `₹${(item.qty * item.rate).toLocaleString('en-IN')}` : ''}
              </td>
            </tr>
          ))}
          {items.length < 5 && Array.from({ length: 5 - items.length }).map((_, i) => (
            <tr key={`empty-${i}`} className="border-b border-invoice-border">
              <td className="border border-invoice-border p-2">&nbsp;</td>
              <td className="border border-invoice-border p-2">&nbsp;</td>
              <td className="border border-invoice-border p-2">&nbsp;</td>
              <td className="border border-invoice-border p-2">&nbsp;</td>
              <td className="border border-invoice-border p-2">&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-4">
        <div className="w-64 space-y-1 text-sm">
          <div className="flex justify-between border-b border-invoice-border pb-1">
            <span>{t('subtotal', language)}:</span>
            <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          {gstEnabled && (
            <>
              <div className="flex justify-between text-muted-foreground">
                <span>{t('cgst', language)} ({halfGst}%):</span>
                <span>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-muted-foreground border-b border-invoice-border pb-1">
                <span>{t('sgst', language)} ({halfGst}%):</span>
                <span>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </>
          )}
          <div className="flex justify-between text-lg font-bold text-primary pt-1">
            <span>{t('grandTotal', language)}:</span>
            <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Amount in Words */}
      {grandTotal > 0 && (
        <div className="bg-gold-light border border-gold rounded p-3 mb-6 text-sm">
          <span className="font-semibold">{t('amountInWords', language)}: </span>
          <span className="italic">{amountToWords(grandTotal, language)}</span>
        </div>
      )}

      {/* Notes */}
      {notes && (
        <p className="text-xs text-muted-foreground mb-6 italic">{notes}</p>
      )}

      {/* Signature */}
      <div className="flex justify-end mt-12">
        <div className="text-center">
          <p className="text-sm font-semibold text-primary">{t('forRoyal', language)}</p>
          <div className="mt-10 border-t border-foreground pt-1">
            <p className="text-xs text-muted-foreground">{t('signature', language)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
