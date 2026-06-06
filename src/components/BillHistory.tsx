import { useEffect, useState } from 'react';
import { InvoiceItem } from './InvoicePreview';
import { Language, t } from '@/lib/translations';
import { Eye, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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

export async function loadHistoryFromDB(): Promise<SavedInvoice[]> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('saved_at', { ascending: false })
      .limit(100);
      
    if (error) {
      console.error('Error fetching history:', error);
      return [];
    }
    
    return (data || []).map(row => ({
      id: row.id,
      billNo: row.bill_no,
      billDate: row.bill_date,
      customerName: row.customer_name,
      customerAddress: row.customer_address,
      customerPhone: row.customer_phone,
      items: row.items,
      gstEnabled: row.gst_enabled,
      gstPercent: row.gst_percent,
      hasCustomerGst: row.has_customer_gst,
      customerGstNo: row.customer_gst_no,
      notes: row.notes,
      grandTotal: parseFloat(row.grand_total),
      savedAt: row.saved_at,
    }));
  } catch (err) {
    console.error('Error in loadHistory:', err);
    return [];
  }
}

export async function saveToHistoryDB(invoice: Omit<SavedInvoice, 'id' | 'savedAt'>) {
  try {
    const { error } = await supabase
      .from('invoices')
      .insert({
        bill_no: invoice.billNo,
        bill_date: invoice.billDate,
        customer_name: invoice.customerName,
        customer_address: invoice.customerAddress,
        customer_phone: invoice.customerPhone,
        items: invoice.items,
        gst_enabled: invoice.gstEnabled,
        gst_percent: invoice.gstPercent,
        has_customer_gst: invoice.hasCustomerGst,
        customer_gst_no: invoice.customerGstNo,
        notes: invoice.notes,
        grand_total: invoice.grandTotal,
      });
      
    if (error) throw error;
  } catch (err) {
    console.error('Error saving invoice:', err);
    toast.error('Failed to save bill to cloud.');
  }
}

export async function deleteFromHistoryDB(id: string) {
  try {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.error('Error deleting invoice:', err);
    toast.error('Failed to delete bill.');
    throw err;
  }
}

interface BillHistoryProps {
  language: Language;
  onLoad: (invoice: SavedInvoice) => void;
  refreshKey: number;
}

const BillHistory = ({ language, onLoad, refreshKey }: BillHistoryProps) => {
  const [history, setHistory] = useState<SavedInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    const data = await loadHistoryFromDB();
    setHistory(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground">
        {language === 'ta' ? 'வரலாறு இல்லை' : language === 'hi' ? 'कोई इतिहास नहीं' : 'No saved invoices yet'}
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteFromHistoryDB(id);
      window.dispatchEvent(new Event('history-updated'));
    } catch {
      // Error handled in deleteFromHistoryDB
    }
  };

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
      {history.map((inv) => (
        <div key={inv.id} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 text-sm">
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
