import { InvoiceItem } from './InvoicePreview';
import { Language, t } from '@/lib/translations';
import { Eye, Trash2 } from 'lucide-react';

export interface SavedInvoice {
  id: string;
  billNo: number | string;
  billDate: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: InvoiceItem[];
  gstEnabled: boolean;
  gstPercent: number;
  hasCustomerGst?: boolean;
  customerGstNo?: string;
  notes: string;
  grandTotal: number;
  savedAt: string;
}

const HISTORY_KEY = 'royal_marbles_history';

export function loadHistory(): SavedInvoice[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function saveToHistory(invoice: Omit<SavedInvoice, 'id' | 'savedAt'>) {
  const history = loadHistory();
  const entry: SavedInvoice = {
    ...invoice,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  };
  history.unshift(entry);
  if (history.length > 100) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function deleteFromHistory(id: string) {
  const history = loadHistory().filter(h => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

interface BillHistoryProps {
  language: Language;
  onLoad: (invoice: SavedInvoice) => void;
  refreshKey: number;
}

const BillHistory = ({ language, onLoad, refreshKey }: BillHistoryProps) => {
  const history = loadHistory();
  // refreshKey used to trigger re-render

  if (history.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground">
        {language === 'ta' ? 'வரலாறு இல்லை' : language === 'hi' ? 'कोई इतिहास नहीं' : 'No saved invoices yet'}
      </div>
    );
  }

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
    // Force parent to re-render by calling onLoad with a dummy — we'll use a different approach
    window.dispatchEvent(new Event('history-updated'));
  };

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {history.map((inv) => (
        <div key={inv.id + refreshKey} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 text-sm">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground truncate">
              #{inv.billNo} — {inv.customerName}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(inv.billDate).toLocaleDateString('en-IN')} · ₹{inv.grandTotal.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="flex gap-1 ml-2 shrink-0">
            <button onClick={() => onLoad(inv)} className="p-1.5 rounded hover:bg-accent/20 text-accent" title="View">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={() => handleDelete(inv.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BillHistory;
