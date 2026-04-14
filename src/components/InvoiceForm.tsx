import { Language, t } from '@/lib/translations';
import { InvoiceItem } from './InvoicePreview';
import { Plus, Trash2 } from 'lucide-react';

interface InvoiceFormProps {
  language: Language;
  customerName: string;
  setCustomerName: (v: string) => void;
  customerAddress: string;
  setCustomerAddress: (v: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  billDate: string;
  setBillDate: (v: string) => void;
  billNo: number;
  setBillNo: (v: number) => void;
  items: InvoiceItem[];
  setItems: (items: InvoiceItem[]) => void;
  gstEnabled: boolean;
  setGstEnabled: (v: boolean) => void;
  gstPercent: number;
  setGstPercent: (v: number) => void;
  notes: string;
  setNotes: (v: string) => void;
}

const InvoiceForm = ({
  language, customerName, setCustomerName, customerAddress, setCustomerAddress,
  customerPhone, setCustomerPhone, billDate, setBillDate, billNo, setBillNo,
  items, setItems, gstEnabled, setGstEnabled, gstPercent, setGstPercent,
  notes, setNotes,
}: InvoiceFormProps) => {

  const addRow = () => {
    setItems([...items, { id: crypto.randomUUID(), particulars: '', qty: 0, rate: 0 }]);
  };

  const removeRow = (id: string) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const inputClass = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="space-y-5">
      {/* Customer Info */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">{t('customerName', language)} *</label>
          <input className={inputClass} value={customerName} onChange={e => setCustomerName(e.target.value)}
            placeholder={t('customerName', language)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t('customerAddress', language)}</label>
            <input className={inputClass} value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t('customerPhone', language)}</label>
            <input className={inputClass} value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t('date', language)}</label>
            <input type="date" className={inputClass} value={billDate} onChange={e => setBillDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t('billNo', language)}</label>
            <input type="number" className={inputClass} value={billNo} onChange={e => setBillNo(Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2">{t('particulars', language)}</h3>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={item.id} className="flex flex-col lg:flex-row gap-3 lg:gap-2 lg:items-start bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 w-full lg:w-auto lg:flex-1">
                <span className="text-xs text-muted-foreground w-6 shrink-0 lg:mt-2">{idx + 1}.</span>
                <input
                  className="flex-1 min-w-0 rounded-md border border-input bg-card px-2 py-1.5 text-sm"
                  placeholder={t('particulars', language)}
                  value={item.particulars}
                  onChange={e => updateItem(item.id, 'particulars', e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap items-center justify-between gap-3 pl-8 lg:pl-0 w-full lg:w-auto lg:justify-end">
                <div className="flex items-center gap-2 flex-1 lg:flex-none min-w-[140px] lg:min-w-0">
                  <input
                    type="number"
                    className="w-16 sm:w-20 lg:w-16 rounded-md border border-input bg-card px-2 py-1.5 text-sm text-right"
                    placeholder={t('qty', language)}
                    value={item.qty || ''}
                    onChange={e => updateItem(item.id, 'qty', Number(e.target.value))}
                  />
                  <span className="text-muted-foreground text-xs font-medium px-1 lg:hidden">×</span>
                  <input
                    type="number"
                    className="w-20 sm:w-24 lg:w-24 flex-1 lg:flex-none rounded-md border border-input bg-card px-2 py-1.5 text-sm text-right"
                    placeholder={t('rate', language)}
                    value={item.rate || ''}
                    onChange={e => updateItem(item.id, 'rate', Number(e.target.value))}
                  />
                </div>
                
                <div className="flex items-center gap-3 lg:gap-2">
                  <div className="min-w-[80px] lg:w-24 text-right text-sm font-bold lg:font-medium lg:mt-2 text-foreground">
                    ₹{(item.qty * item.rate).toLocaleString('en-IN')}
                  </div>
                  <button
                    onClick={() => removeRow(item.id)}
                    className="p-1.5 lg:p-1 lg:mt-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                    disabled={items.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addRow} className="mt-2 flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
          <Plus className="w-4 h-4" /> {t('addRow', language)}
        </button>
      </div>

      {/* GST */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={gstEnabled} onChange={e => setGstEnabled(e.target.checked)}
            className="rounded border-input accent-accent h-4 w-4" />
          {t('gstApplicable', language)}
        </label>
        {gstEnabled ? (
          <div className="flex items-center gap-2 ml-6 sm:ml-0">
            <label className="text-sm text-muted-foreground">{t('gstPercent', language)}:</label>
            <input type="number" className="w-20 rounded-md border border-input bg-card px-2 py-1.5 text-sm"
              value={gstPercent} onChange={e => setGstPercent(Number(e.target.value))} />
          </div>
        ) : (
          <span className="text-xs text-muted-foreground ml-6 sm:ml-0">{t('gstNotApplicable', language)}</span>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">{t('notes', language)}</label>
        <textarea className={inputClass + " h-20 resize-none"} value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Payment received. Thank you for your business." />
      </div>
    </div>
  );
};

export default InvoiceForm;
