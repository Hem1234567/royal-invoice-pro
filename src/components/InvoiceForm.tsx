import { useState, useEffect, useRef } from 'react';
import { Language, t } from '@/lib/translations';
import { InvoiceItem } from './InvoicePreview';
import { Plus, Trash2 } from 'lucide-react';

const GRANITE_OPTIONS = [
  "Asian top granite",
  "asan green granite",
  "black galaxy granite",
  "Safari blue granite",
  "Black pearl granite",
  "Lakshmi Red granite",
  "Sagar Ali granite",
  "red lapathoro granite",
  "blue lapathoro granite",
  "red granite",
  "red parpari granite",
  "block per Pari granite",
  "Steel grey granite",
  "white granite",
  "black granite",
  "plumbing granite",
  "aasan green granite",
  "Kadapha",
  "Araldite paste"
];

function AutocompleteInput({ value, onChange, options, placeholder, className }: { value: string, onChange: (val: string) => void, options: string[], placeholder: string, className: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    if (val.trim()) {
      const filtered = options.filter(opt => opt.toLowerCase().includes(val.toLowerCase()));
      setFilteredOptions(filtered);
      setIsOpen(true);
    } else {
      setFilteredOptions(options);
      setIsOpen(true);
    }
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative flex-1 min-w-0" ref={wrapperRef}>
      <input
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
           setFilteredOptions(value.trim() ? options.filter(opt => opt.toLowerCase().includes(value.toLowerCase())) : options);
           setIsOpen(true);
        }}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 w-full bg-card border border-border rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.map((opt, i) => (
            <li 
              key={i} 
              className="px-3 py-2 text-sm hover:bg-muted cursor-pointer text-foreground"
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
  hasCustomerGst: boolean;
  setHasCustomerGst: (v: boolean) => void;
  customerGstNo: string;
  setCustomerGstNo: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
}

const InvoiceForm = ({
  language, customerName, setCustomerName, customerAddress, setCustomerAddress,
  customerPhone, setCustomerPhone, billDate, setBillDate, billNo, setBillNo,
  items, setItems, gstEnabled, setGstEnabled, gstPercent, setGstPercent,
  hasCustomerGst, setHasCustomerGst, customerGstNo, setCustomerGstNo,
  notes, setNotes,
}: InvoiceFormProps) => {

  const addRow = () => {
    setItems([...items, { id: crypto.randomUUID(), particulars: '', size: '', length: '', width: '', no: 0, sqft: 0, rate: 0 }]);
  };

  const removeRow = (id: string) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-calculate sqft if length, width, size or no changes
        if (field === 'length' || field === 'width' || field === 'no' || field === 'size') {
          const no = updatedItem.no && updatedItem.no > 0 ? updatedItem.no : 1;
          
          if (updatedItem.length || updatedItem.width) {
            const l = parseFloat(updatedItem.length || '0');
            const w = parseFloat(updatedItem.width || '0');
            if (!isNaN(l) && !isNaN(w)) {
              updatedItem.sqft = Number((l * w * no).toFixed(2));
            }
          } else {
            const sizeStr = String(updatedItem.size || '').trim();
            const match = sizeStr.toLowerCase().match(/^([\d.]+)\s*[x*]\s*([\d.]+)$/);
            if (match) {
              const l = parseFloat(match[1]);
              const w = parseFloat(match[2]);
              if (!isNaN(l) && !isNaN(w)) {
                updatedItem.sqft = Number((l * w * no).toFixed(2));
              }
            }
          }
        }
        
        return updatedItem;
      }
      return item;
    }));
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
        
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">{t('customerGstNoForm', language)}</label>
          <input 
            className={inputClass} 
            value={customerGstNo} 
            onChange={e => setCustomerGstNo(e.target.value.toUpperCase())}
            placeholder={t('customerGstNoForm', language)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t('date', language)}</label>
            <input type="date" className={inputClass} value={billDate} onChange={e => setBillDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t('billNo', language)}</label>
            <input type="number" min="1" className={inputClass} value={billNo} onChange={e => setBillNo(Math.max(1, Number(e.target.value)))} />
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
                <AutocompleteInput
                  options={GRANITE_OPTIONS}
                  className="w-full rounded-md border border-input bg-card px-2 py-1.5 text-sm"
                  placeholder={t('particulars', language)}
                  value={item.particulars}
                  onChange={val => updateItem(item.id, 'particulars', val)}
                />
              </div>
              
              <div className="flex flex-col lg:flex-row items-end lg:items-center justify-between gap-3 pl-8 lg:pl-0 w-full lg:w-auto lg:justify-end">
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:flex items-center gap-2 w-full lg:w-auto">
                  <div className="flex items-center gap-1 col-span-2 sm:col-span-2 lg:w-auto">
                    <input
                      type="text"
                      className="w-full lg:w-16 rounded-md border border-input bg-card px-2 py-1.5 text-sm text-center"
                      placeholder="L"
                      value={item.length || ''}
                      onChange={e => updateItem(item.id, 'length', e.target.value)}
                    />
                    <span className="text-muted-foreground text-xs font-bold">*</span>
                    <input
                      type="text"
                      className="w-full lg:w-16 rounded-md border border-input bg-card px-2 py-1.5 text-sm text-center"
                      placeholder="W"
                      value={item.width || ''}
                      onChange={e => updateItem(item.id, 'width', e.target.value)}
                    />
                  </div>
                  <input
                    type="number"
                    min="0"
                    className="w-full lg:w-16 rounded-md border border-input bg-card px-2 py-1.5 text-sm text-right sm:col-span-1"
                    placeholder={t('no', language)}
                    value={item.no || ''}
                    onChange={e => updateItem(item.id, 'no', Math.max(0, Number(e.target.value)))}
                  />
                  <input
                    type="number"
                    min="0"
                    className="w-full lg:w-16 rounded-md border border-input bg-card px-2 py-1.5 text-sm text-right sm:col-span-1"
                    placeholder={t('sqft', language)}
                    value={item.sqft || ''}
                    onChange={e => updateItem(item.id, 'sqft', Math.max(0, Number(e.target.value)))}
                  />
                  <input
                    type="number"
                    min="0"
                    className="w-full lg:w-24 rounded-md border border-input bg-card px-2 py-1.5 text-sm text-right col-span-2 sm:col-span-1"
                    placeholder={t('rate', language)}
                    value={item.rate || ''}
                    onChange={e => updateItem(item.id, 'rate', Math.max(0, Number(e.target.value)))}
                  />
                </div>
                
                <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto mt-2 lg:mt-0 pt-2 lg:pt-0 border-t border-border lg:border-t-0">
                  <div className="text-sm font-bold lg:font-medium lg:mt-2 text-foreground text-right flex-1 lg:flex-none lg:w-24">
                    ₹{((item.sqft && item.sqft > 0 ? item.sqft : (item.no && item.no > 0 ? item.no : 0)) * (item.rate || 0)).toLocaleString('en-IN')}
                  </div>
                  <button
                    onClick={() => removeRow(item.id)}
                    className="p-1.5 lg:p-1 lg:mt-1 text-destructive hover:bg-destructive/10 rounded transition-colors shrink-0"
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
            <input type="number" min="0" className="w-20 rounded-md border border-input bg-card px-2 py-1.5 text-sm"
              value={gstPercent} onChange={e => setGstPercent(Math.max(0, Number(e.target.value)))} />
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
