import { useState } from 'react';
import { useTrades } from '../../context/TradeContext';
import { formatCurrency } from '../../lib/utils';
import { format, parseISO, startOfMonth } from 'date-fns';
import { toast } from 'sonner';
import { Link2 } from 'lucide-react';

export function Sharing() {
  const { trades } = useTrades();

  const dailyStats = trades.reduce((acc, trade) => {
    const key = trade.date;
    if (!acc[key]) {
      acc[key] = { date: key, pnl: 0, trades: 0 };
    }
    acc[key].pnl += trade.pnl;
    acc[key].trades += 1;
    return acc;
  }, {} as Record<string, { date: string, pnl: number, trades: number }>);

  const monthStats = trades.reduce((acc, trade) => {
    const month = format(startOfMonth(parseISO(trade.date)), 'MMMM yyyy');
    if (!acc[month]) {
      acc[month] = { month, pnl: 0 };
    }
    acc[month].pnl += trade.pnl;
    return acc;
  }, {} as Record<string, { month: string, pnl: number }>);

  const dailyList = Object.values(dailyStats).sort((a,b) => b.date.localeCompare(a.date));
  const monthList = Object.values(monthStats);

  const handleShare = (type: string, value: string) => {
    navigator.clipboard.writeText(`${window.location.host}/shared/${type}?id=${btoa(value)}`);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="max-w-6xl space-y-8 pb-20 text-slate-900 dark:text-white">
      <header>
        <h2 className="text-3xl font-bold tracking-tight mb-8">Sharing</h2>
      </header>

      <section>
        <h3 className="text-xl font-bold mb-4">Daily Performance</h3>
        <div className="w-full bg-slate-50 dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-sm">
           <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                 <tr>
                    <th className="p-4 w-1/4">Date</th>
                    <th className="p-4 w-1/4">Total PnL</th>
                    <th className="p-4 w-1/4"># of Trades</th>
                    <th className="p-4 w-1/4">Can Be Shared</th>
                    <th className="p-4 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {dailyList.length === 0 ? (
                   <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-semibold">No daily performance to share</td></tr>
                 ) : dailyList.map(item => (
                   <tr key={item.date} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/20">
                     <td className="p-4 font-mono">{item.date}</td>
                     <td className={`p-4 font-bold font-mono ${item.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{formatCurrency(item.pnl)}</td>
                     <td className="p-4">{item.trades}</td>
                     <td className="p-4 text-emerald-500 font-semibold">Yes</td>
                     <td className="p-4 text-right">
                       <button onClick={() => handleShare('daily', item.date)} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#5b32f6]/10 text-[#5b32f6] hover:bg-[#5b32f6] hover:text-white rounded-lg transition-colors font-semibold text-xs uppercase tracking-wider">
                         <Link2 className="w-3.5 h-3.5" /> Share
                       </button>
                     </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Calendars</h3>
        <div className="w-full bg-slate-50 dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-sm">
           <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                 <tr>
                    <th className="p-4 w-1/4">Month</th>
                    <th className="p-4 w-1/4">Total PnL</th>
                    <th className="p-4 w-1/4">Can Be Shared</th>
                    <th className="p-4 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {monthList.length === 0 ? (
                   <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-semibold">No calendars to share</td></tr>
                 ) : monthList.map(item => (
                   <tr key={item.month} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/20">
                     <td className="p-4 font-bold">{item.month}</td>
                     <td className={`p-4 font-bold font-mono ${item.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{formatCurrency(item.pnl)}</td>
                     <td className="p-4 text-emerald-500 font-semibold">Yes</td>
                     <td className="p-4 text-right">
                       <button onClick={() => handleShare('month', item.month)} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#5b32f6]/10 text-[#5b32f6] hover:bg-[#5b32f6] hover:text-white rounded-lg transition-colors font-semibold text-xs uppercase tracking-wider">
                         <Link2 className="w-3.5 h-3.5" /> Share
                       </button>
                     </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </section>
    </div>
  );
}
