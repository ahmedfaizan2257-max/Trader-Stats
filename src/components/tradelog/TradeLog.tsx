import { useState, useRef, useEffect } from 'react';
import { useTrades } from '../../context/TradeContext';
import { Trade, Direction } from '../../types';
import { parseNumericString, formatCurrency, cn } from '../../lib/utils';
import { Trash2, Plus, Upload, LineChart } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner';
import { TradingViewModal } from './TradingViewModal';

export function TradeLog() {
  const { trades, addTrade, deleteTrade, clearAllTrades } = useTrades();
  const [isAdding, setIsAdding] = useState(false);
  const [activeChartSymbol, setActiveChartSymbol] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [confirmClear, setConfirmClear] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedTrades: Trade[] = results.data.map((row: any) => {
          let direction: Direction = (row.Direction || row.direction || 'Long') as Direction;
          let dateStr = row.Date || row.date || new Date().toISOString().split('T')[0];
          
          if (row.boughtTimestamp && row.soldTimestamp) {
            const boughtDate = new Date(row.boughtTimestamp);
            const soldDate = new Date(row.soldTimestamp);
            if (!isNaN(boughtDate.getTime()) && !isNaN(soldDate.getTime())) {
               if (boughtDate <= soldDate) {
                 direction = 'Long';
                 dateStr = boughtDate.toISOString().split('T')[0];
               } else {
                 direction = 'Short';
                 dateStr = soldDate.toISOString().split('T')[0];
               }
            }
          }

          let entryPrice = parseNumericString(row.EntryPrice || row.Entry || row.entryPrice);
          let exitPrice = parseNumericString(row.ExitPrice || row.Exit || row.exitPrice);

          if (row.buyPrice && row.sellPrice) {
            if (direction === 'Long') {
              entryPrice = parseNumericString(row.buyPrice);
              exitPrice = parseNumericString(row.sellPrice);
            } else {
              entryPrice = parseNumericString(row.sellPrice);
              exitPrice = parseNumericString(row.buyPrice);
            }
          }

          return {
            id: crypto.randomUUID(),
            date: dateStr,
            account: row.Account || row.account || 'Imported CSV',
            symbol: (row.Symbol || row.symbol || 'UNKNOWN').toUpperCase(),
            direction,
            entryPrice,
            exitPrice,
            contracts: Math.max(1, Math.floor(parseNumericString(row.Contracts || row.Size || row.contracts || row.qty || 1))),
            pnl: parseNumericString(row.PnL || row.Pnl || row.pnl || row.NetPnL || row['Net P&L'] || row.pnl),
            notes: row.Notes || row.notes || ''
          };
        });

        parsedTrades.forEach(addTrade);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        toast.success(`Successfully imported ${parsedTrades.length} trades`);
      },
      error: (error) => {
        toast.error(`Failed to parse CSV: ${error.message}`);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-light tracking-tight">Trade Log</h2>
          <p className="text-slate-400 mt-1 text-sm">Track and manage your individual executions.</p>
        </div>
        <div className="flex items-center gap-3">
          {trades.length > 0 && (
            <button 
              onClick={() => {
                if (confirmClear) {
                  clearAllTrades();
                  setConfirmClear(false);
                  toast.success('All trades have been cleared');
                } else {
                  setConfirmClear(true);
                  setTimeout(() => setConfirmClear(false), 3000); // reset after 3s
                }
              }}
              className={cn(
                "font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors text-sm",
                confirmClear ? "bg-red-500 text-white" : "text-slate-400 hover:text-red-400"
              )}
            >
              <Trash2 className="w-4 h-4" />
              {confirmClear ? "Click to Confirm" : "Clear All"}
            </button>
          )}
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors text-sm"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Trade
          </button>
        </div>
      </div>

      {isAdding && (
        <AddTradeForm onClose={() => setIsAdding(false)} onAdd={(t) => { addTrade(t); setIsAdding(false); toast.success('Trade added successfully'); }} />
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Account</th>
                <th className="px-6 py-4 font-medium">Symbol</th>
                <th className="px-6 py-4 font-medium">Dir</th>
                <th className="px-6 py-4 font-medium">Entry</th>
                <th className="px-6 py-4 font-medium">Exit</th>
                <th className="px-6 py-4 font-medium">Size</th>
                <th className="px-6 py-4 font-medium">P&L</th>
                <th className="px-6 py-4 font-medium w-full">Notes</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-slate-500">No trades logged yet.</td>
                </tr>
              ) : (
                [...trades].reverse().map(trade => (
                  <tr key={trade.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 font-mono text-slate-300">{trade.date}</td>
                    <td className="px-6 py-4 font-semibold text-slate-400">{trade.account || 'Manual'}</td>
                    <td className="px-6 py-4 font-semibold">{trade.symbol}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-xs font-bold",
                        trade.direction === 'Long' ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                      )}>
                        {trade.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">{trade.entryPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 font-mono">{trade.exitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 font-mono">{trade.contracts}</td>
                    <td className={cn(
                      "px-6 py-4 font-mono font-semibold",
                      trade.pnl > 0 ? "text-green-400" : trade.pnl < 0 ? "text-red-400" : "text-slate-300"
                    )}>
                      {formatCurrency(trade.pnl)}
                    </td>
                    <td className="px-6 py-4 text-slate-400 truncate max-w-xs">{trade.notes}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setActiveChartSymbol(trade.symbol)}
                          className="text-slate-500 hover:text-cyan-400 transition-colors"
                          title="View TradingView Chart"
                        >
                          <LineChart className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { deleteTrade(trade.id); toast.success('Trade deleted'); }}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete trade"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeChartSymbol && (
        <TradingViewModal 
          symbol={activeChartSymbol} 
          onClose={() => setActiveChartSymbol(null)} 
        />
      )}
    </div>
  );
}

function AddTradeForm({ onClose, onAdd }: { onClose: () => void, onAdd: (t: Trade) => void }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState('Manual');
  const [symbol, setSymbol] = useState('');
  const [direction, setDirection] = useState<Direction>('Long');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [contracts, setContracts] = useState('1');
  const [instrumentMultiplier, setInstrumentMultiplier] = useState('20'); // defaulting to NQ points
  const [pnl, setPnl] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const entry = parseFloat(entryPrice) || 0;
    const exit = parseFloat(exitPrice) || 0;
    const size = parseFloat(contracts) || 1;
    const mult = parseFloat(instrumentMultiplier) || 1;
    let computed = 0;
    if (direction === 'Long') {
      computed = (exit - entry) * size * mult;
    } else {
      computed = (entry - exit) * size * mult;
    }
    setPnl(Number(computed.toFixed(2)));
  }, [entryPrice, exitPrice, contracts, instrumentMultiplier, direction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !entryPrice || !exitPrice) return;
    
    onAdd({
      id: crypto.randomUUID(),
      date,
      account,
      symbol: symbol.toUpperCase(),
      direction,
      entryPrice: parseFloat(entryPrice),
      exitPrice: parseFloat(exitPrice),
      contracts: parseInt(contracts, 10) || 1,
      pnl,
      notes
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm mb-6 animate-in slide-in-from-top-4 fade-in duration-200">
      <h3 className="text-lg font-semibold mb-4">Add New Trade</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Date</label>
          <input type="date" required value={date} onChange={e => setDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 font-mono" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Account</label>
          <input type="text" placeholder="e.g. Robinhood, NinjaTrader" value={account} onChange={e => setAccount(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Symbol</label>
          <input type="text" required placeholder="e.g. NQ" value={symbol} onChange={e => setSymbol(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Direction</label>
          <select value={direction} onChange={e => setDirection(e.target.value as Direction)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500">
            <option>Long</option>
            <option>Short</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Multiplier ($/pt)</label>
          <input type="number" step="any" required value={instrumentMultiplier} onChange={e => setInstrumentMultiplier(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 font-mono" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Entry Price</label>
          <input type="number" step="any" required value={entryPrice} onChange={e => setEntryPrice(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 font-mono" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Exit Price</label>
          <input type="number" step="any" required value={exitPrice} onChange={e => setExitPrice(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 font-mono" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Contracts/Shares</label>
          <input type="number" required min="1" value={contracts} onChange={e => setContracts(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 font-mono" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Calculated P&L</label>
          <div className={cn(
            "bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono font-semibold flex items-center h-full",
            pnl > 0 ? "text-green-400" : pnl < 0 ? "text-red-400" : "text-slate-400"
          )}>
            {pnl > 0 ? '+' : ''}{pnl}
          </div>
        </div>

        <div className="flex flex-col gap-1 lg:col-span-3">
          <label className="text-xs uppercase tracking-widest text-slate-500 font-medium">Notes</label>
          <input type="text" placeholder="Why did you take this trade?" value={notes} onChange={e => setNotes(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" />
        </div>

        <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-3 mt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200">
            Cancel
          </button>
          <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
            Save Trade
          </button>
        </div>
      </form>
    </div>
  );
}
