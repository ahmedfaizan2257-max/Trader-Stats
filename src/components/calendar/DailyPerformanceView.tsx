import { useState, useMemo } from 'react';
import { useTrades } from '../../context/TradeContext';
import { formatCurrency, cn } from '../../lib/utils';
import { format } from 'date-fns';
import { ArrowLeft, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { TradingViewWidget } from '../shared/TradingViewWidget';

const EMOTIONS = [
  { emoji: '😊', label: 'Confident' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '🎯', label: 'Focused' },
];

export function DailyPerformanceView({ date, onBack }: { date: Date, onBack: () => void }) {
  const { trades, journalEntries, addJournalEntry, deleteTrade } = useTrades();
  const dateStr = format(date, 'yyyy-MM-dd');

  const dayTrades = trades.filter(t => t.date.startsWith(dateStr));
  const winningTrades = dayTrades.filter(t => t.pnl > 0);
  const losingTrades = dayTrades.filter(t => t.pnl <= 0);

  const netPnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
  const commissions = dayTrades.reduce((sum, t) => sum + (t.contracts * 2), 0); // Assuming $2 round trip
  const grossPnl = netPnl + commissions;

  const winRate = dayTrades.length > 0 ? (winningTrades.length / dayTrades.length) * 100 : 0;
  const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss) : (grossProfit > 0 ? 999 : 0);

  const avgWin = winningTrades.length > 0 ? grossProfit / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? grossLoss / losingTrades.length : 0;
  const avgWinLossRatio = avgLoss > 0 ? (avgWin / avgLoss) : (avgWin > 0 ? 999 : 0);
  
  const avgTimePerTrade = '0.00 min'; // Mock

  // Journal State
  const currentEntry = useMemo(() => journalEntries.find(e => e.date === dateStr) || {
    id: crypto.randomUUID(),
    date: dateStr,
    notes: '',
    emotion: '😐',
    followedPlan: 'Partial' as const
  }, [journalEntries, dateStr]);

  const [notes, setNotes] = useState(currentEntry.notes);
  const [emotion, setEmotion] = useState(currentEntry.emotion);
  const [followedPlan, setFollowedPlan] = useState<'Yes'|'No'|'Partial'>(currentEntry.followedPlan);

  const handleSaveJournal = async () => {
    try {
      await addJournalEntry({
        id: currentEntry.id,
        date: dateStr,
        notes,
        emotion,
        followedPlan
      });
      toast.success('Journal saved successfully');
    } catch (error) {
      toast.error('Failed to save journal');
    }
  };

  // AI Feedback State
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const getAIFeedback = async () => {
    if (dayTrades.length === 0) {
      toast.error("Add some trades for this day first to get feedback.");
      return;
    }
    
    setIsLoadingFeedback(true);
    setFeedback(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing Gemini API Key");
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Analyze this day's trades to provide short, bulleted feedback.
      Trades:
      ${JSON.stringify(dayTrades, null, 2)}
      
      Respond with 2 short sections in markdown (no emojis):
      ### Analysis
      ### Advice`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { temperature: 0.4 }
      });

      setFeedback(response.text || "No feedback generated.");
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to generate analysis. Check API Key.');
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const [selectedTradesIds, setSelectedTradesIds] = useState<Set<string>>(new Set());

  const toggleSelectAll = () => {
    if (selectedTradesIds.size === dayTrades.length) {
      setSelectedTradesIds(new Set());
    } else {
      setSelectedTradesIds(new Set(dayTrades.map(t => t.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedTradesIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedTradesIds(newSet);
  };

  const handleDeleteSelected = () => {
    if (selectedTradesIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedTradesIds.size} trade(s)?`)) {
       Array.from(selectedTradesIds).forEach(id => deleteTrade(id));
       setSelectedTradesIds(new Set());
       toast.success(`Deleted ${selectedTradesIds.size} trade(s)`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Calendar
      </button>

      <header>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Daily Performance</h2>
        <div className="flex items-center gap-2 mt-2 mb-6">
           <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
             {format(date, 'MMM d, yyyy')}
           </span>
        </div>
      </header>

      {/* Stats row */}
      <div>
         <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Stats</h3>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Gross P&L" value={formatCurrency(grossPnl)} highlight={grossPnl >= 0 ? "good" : "bad"} />
            <StatCard label="Commissions Paid" value={formatCurrency(commissions)} highlight="neutral" />
            <StatCard label="Net P&L" value={formatCurrency(netPnl)} highlight={netPnl >= 0 ? "good" : "bad"} />
            <StatCard label="Total Trades" value={dayTrades.length.toString()} highlight="neutral" />
            
            <StatCard label="Win Rate" value={`${winRate.toFixed(1)}%`} highlight={winRate > 50 ? "good" : "bad"} />
            <StatCard label="Profit Factor" value={profitFactor.toFixed(2)} highlight={profitFactor > 1 ? "good" : "bad"} />
            <StatCard label="Avg Win / Avg Loss Ratio" value={avgWinLossRatio.toFixed(2) + '+'} highlight={avgWinLossRatio > 1 ? "good" : "bad"} />
            <StatCard label="Avg Time per Trade" value={avgTimePerTrade} highlight="neutral" />
         </div>
      </div>

      {/* Habits & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Trading Feedback */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm text-white flex flex-col">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#5b32f6]" />
                AI Trading Feedback
             </h3>
             <button onClick={getAIFeedback} disabled={isLoadingFeedback} className="bg-[#5b32f6] hover:bg-[#4a26d7] px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(91,50,246,0.3)]">
               {isLoadingFeedback ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
             </button>
           </div>
           {feedback && (
             <div className="prose prose-invert max-w-none text-sm bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-y-auto max-h-[200px]">
               <Markdown>{feedback}</Markdown>
             </div>
           )}
           {!feedback && !isLoadingFeedback && (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl bg-slate-950/50">
               <p className="text-sm text-slate-400 mb-2">Generate deep insights on your trading behavior for today.</p>
             </div>
           )}
        </div>

        {/* Habits */}
        <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
           <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-900 dark:text-white">
             Habits
           </h3>
           <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Rate your emotions</label>
                <div className="flex flex-wrap gap-2">
                  {EMOTIONS.map(emo => (
                    <button
                      key={emo.label}
                      onClick={() => setEmotion(emo.emoji)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl border transition-all flex-1 min-w-[60px]",
                        emotion === emo.emoji 
                          ? "bg-slate-100 dark:bg-slate-800 border-[#5b32f6]/50 shadow-sm" 
                          : "bg-slate-50 dark:bg-[#0a0f18] border-slate-200 dark:border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100"
                      )}
                    >
                      <span className="text-2xl">{emo.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Did you keep your trading rules?</label>
                <div className="flex gap-3">
                  {(['Yes', 'No'] as const).map(opt => {
                    let colorClass = "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400";
                    if (opt === 'Yes' && followedPlan === 'Yes') colorClass = "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-500 font-bold shadow-[0_0_10px_rgba(34,197,94,0.1)]";
                    if (opt === 'No' && followedPlan === 'No') colorClass = "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-500 font-bold shadow-[0_0_10px_rgba(239,68,68,0.1)]";
                    
                    return (
                      <button
                        key={opt}
                        onClick={() => setFollowedPlan(opt)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-all flex-1",
                          colorClass,
                          followedPlan !== opt && "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                      >
                        <div className={cn("w-4 h-4 rounded-full border", followedPlan === opt ? "border-current flex items-center justify-center bg-current" : "border-slate-400 dark:border-slate-600")}>
                           {followedPlan === opt && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900" />}
                        </div>
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Trade Review Section */}
      <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
         <div className="p-5 border-b border-slate-200 dark:border-slate-800">
           <h3 className="text-xl font-bold text-slate-900 dark:text-white">Trade Review on {format(date, 'MMM d, yyyy')}</h3>
         </div>
         
         <div className="p-1 border-b border-slate-200 dark:border-slate-800 bg-[#09090b]">
           <TradingViewWidget symbol={dayTrades.length > 0 ? dayTrades[0].symbol : 'NASDAQ:AAPL'} height={500} interval="5" />
         </div>

         <div className="p-5">
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
             <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">All</span>
             </div>
             <div className="flex items-center gap-2 w-full sm:w-auto">
               <button onClick={() => toast.info('To add trades manually, please navigate to the Trade Log tab.')} className="flex-1 sm:flex-none px-4 py-2 bg-[#5b32f6] hover:bg-[#4a26d7] text-white text-sm font-bold rounded-lg transition-colors">
                 Manual Trade
               </button>
               <button onClick={() => toast.info('Edit functionality is available from the Trade Log.')} disabled={selectedTradesIds.size === 0} className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 disabled:opacity-50">
                 Edit {selectedTradesIds.size > 0 ? selectedTradesIds.size : ''}
               </button>
               <button onClick={handleDeleteSelected} disabled={selectedTradesIds.size === 0} className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 text-red-500 text-sm font-bold rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20 disabled:opacity-50">
                 Delete {selectedTradesIds.size > 0 ? selectedTradesIds.size : ''}
               </button>
             </div>
           </div>

           <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">
                       <input 
                         type="checkbox" 
                         className="rounded" 
                         checked={selectedTradesIds.size === dayTrades.length && dayTrades.length > 0} 
                         onChange={toggleSelectAll} 
                       />
                    </th>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Instrument</th>
                    <th className="px-4 py-3 text-right">Gross PnL</th>
                    <th className="px-4 py-3 text-right">Net PnL</th>
                    <th className="px-4 py-3 text-right">Fees</th>
                    <th className="px-4 py-3 text-right">Qty</th>
                    <th className="px-4 py-3 text-right">Points</th>
                    <th className="px-4 py-3 text-right">Entry & Exit Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {dayTrades.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-slate-500">No trades recorded for this day.</td>
                    </tr>
                  ) : (
                    dayTrades.map((trade, i) => (
                      <tr key={trade.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-4 py-3">
                           <input 
                             type="checkbox" 
                             className="rounded" 
                             checked={selectedTradesIds.has(trade.id)} 
                             onChange={() => toggleSelect(trade.id)} 
                           />
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-500">#{i + 1}</td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                           {trade.direction === 'Long' ? (
                             <div className="w-2 h-2 rounded bg-green-500" />
                           ) : (
                             <div className="w-2 h-2 rounded bg-red-500" />
                           )}
                           {trade.symbol}
                        </td>
                        <td className={cn(
                          "px-4 py-3 text-right font-mono font-bold",
                          trade.pnl > 0 ? "text-green-500" : trade.pnl < 0 ? "text-red-500" : "text-slate-500"
                        )}>
                          {formatCurrency(trade.pnl)}
                        </td>
                        <td className={cn(
                          "px-4 py-3 text-right font-mono font-bold",
                          trade.pnl - (trade.contracts * 2) > 0 ? "text-green-500" : trade.pnl - (trade.contracts * 2) < 0 ? "text-red-500" : "text-slate-500"
                        )}>
                          {formatCurrency(trade.pnl - (trade.contracts * 2))}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500 text-right">{formatCurrency(trade.contracts * 2)}</td>
                        <td className="px-4 py-3 font-mono text-slate-900 dark:text-white text-right">{trade.contracts}</td>
                        <td className="px-4 py-3 font-mono text-slate-500 text-right">
                          {Math.abs(trade.exitPrice - trade.entryPrice).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-500 text-right">
                          {trade.entryPrice.toFixed(2)} → {trade.exitPrice.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
           </div>
         </div>
      </div>

      {/* Journal */}
      <div className="bg-[#1a1c23] dark:bg-[#111113] border border-slate-800 rounded-2xl shadow-sm overflow-hidden text-white mt-8">
         <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xl font-bold">Journal</h3>
         </div>
         <div className="p-2 border-b border-slate-800 bg-[#252830] dark:bg-[#1a1a1f] flex flex-wrap gap-2 items-center text-sm text-slate-300">
            <button className="px-3 py-1 hover:bg-slate-700 rounded transition-colors flex items-center gap-1">Templates <span className="text-[10px]">▼</span></button>
            <div className="w-px h-4 bg-slate-700 mx-1"></div>
            <button className="px-2 py-1 hover:bg-slate-700 rounded transition-colors text-lg" title="Undo">↶</button>
            <button className="px-2 py-1 hover:bg-slate-700 rounded transition-colors text-lg" title="Redo">↷</button>
            <div className="w-px h-4 bg-slate-700 mx-1"></div>
            <button className="px-3 py-1 hover:bg-slate-700 rounded transition-colors flex items-center gap-1">Normal <span className="text-[10px]">▼</span></button>
            <button className="px-3 py-1 hover:bg-slate-700 rounded transition-colors flex items-center gap-1 font-sans">Arial <span className="text-[10px]">▼</span></button>
         </div>
         <div className="p-0">
           <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you see in the market today? How did you execute? What could be improved?"
              rows={12}
              className="w-full bg-[#1a1c23] dark:bg-[#0a0f18] p-6 text-[15px] focus:outline-none resize-none leading-relaxed"
           />
         </div>
         <div className="p-4 border-t border-slate-800 flex justify-between items-center bg-[#252830] dark:bg-[#1a1a1f]">
            <div className="flex items-center gap-2 text-sm text-slate-400">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               Save often while editing.
            </div>
            <div className="flex items-center gap-3">
              <button className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition-colors">Cancel</button>
              <button onClick={handleSaveJournal} className="bg-[#5b32f6] hover:bg-[#4a26d7] text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg">Save</button>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string, value: string, highlight: 'good'|'bad'|'neutral' }) {
  const colorClass = highlight === 'good' ? 'text-green-500' : highlight === 'bad' ? 'text-red-500' : 'text-slate-900 dark:text-slate-100';
  return (
    <div className="bg-slate-50 dark:bg-[#1a1c23] border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-sm flex-1 min-w-[150px]">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
      <span className={cn("text-2xl font-bold mt-2 font-mono tracking-tight", colorClass)}>{value}</span>
    </div>
  );
}

