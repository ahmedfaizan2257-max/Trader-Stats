import { useState } from 'react';
import { useTrades } from '../../context/TradeContext';
import { formatCurrency, cn } from '../../lib/utils';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isAfter, subMonths, addMonths, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

const EMOTIONS = [
  { emoji: '😊', label: 'Confident' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '🎯', label: 'Focused' },
];

export function Calendar() {
  const { trades, journalEntries, addJournalEntry } = useTrades();
  const { user } = useAuth();
  
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedJournalDate, setSelectedJournalDate] = useState<Date | null>(null);

  // Calendar Logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

  const monthTrades = trades.filter(t => {
    const tDate = new Date(t.date);
    return tDate >= monthStart && tDate <= monthEnd;
  });
  const monthPnl = monthTrades.reduce((sum, t) => sum + t.pnl, 0);

  // Build daily data for the current month charts (using actual days in the month, ignoring the padding from startOfWeek)
  const actualDaysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  let cumulativeMonth = 0;
  const chartData = actualDaysInMonth.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayTrades = monthTrades.filter(t => t.date.startsWith(dateStr));
    const dailyPnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
    cumulativeMonth += dailyPnl;
    
    return {
      date: format(day, 'M/d/yy'),
      fullDate: dateStr,
      dailyPnl,
      cumulative: cumulativeMonth
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-xl">
          <p className="text-slate-400 text-xs mb-1">{label}</p>
          <p className={cn("font-mono font-bold text-lg", payload[0].value >= 0 ? "text-emerald-500" : "text-rose-500")}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Summary stats
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const winningTrades = trades.filter(t => t.pnl > 0);
  const losingTrades = trades.filter(t => t.pnl <= 0);
  const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
  const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
  const avgWin = winningTrades.length > 0 ? grossProfit / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? grossLoss / losingTrades.length : 0;
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss) : (grossProfit > 0 ? 999 : 0);

  let currentStreak = 0;
  let streakType: 'win' | 'loss' | null = null;
  for (let i = trades.length - 1; i >= 0; i--) {
    const isWin = trades[i].pnl > 0;
    if (streakType === null) {
      streakType = isWin ? 'win' : 'loss';
      currentStreak = 1;
    } else if ((isWin && streakType === 'win') || (!isWin && streakType === 'loss')) {
      currentStreak++;
    } else {
      break;
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          {user && <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">HELLO, {user.displayName || user.email?.split('@')[0]} 👋</span>}
          <h2 className="text-3xl font-bold tracking-tight mt-1">Calendar</h2>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Month P&L</p>
            <p className={cn("text-4xl font-mono tracking-tight", monthPnl >= 0 ? "text-emerald-500" : "text-rose-500")}>
              {formatCurrency(monthPnl)}
            </p>
          </div>
        </div>
      </header>

      {/* Calendar */}
      <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm">
        <div className="flex justify-center items-center mb-6">
          <div className="flex items-center gap-4 bg-slate-100 dark:bg-[#18181b] rounded-xl p-1 border border-slate-200 dark:border-slate-800">
            <button onClick={() => setCurrentMonth(prev => subMonths(prev, 1))} className="p-2 lg:px-4 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-bold min-w-[120px] text-center">{format(currentMonth, 'MMMM yyyy')}</span>
            <button onClick={() => setCurrentMonth(prev => addMonths(prev, 1))} className="p-2 lg:px-4 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest py-3 bg-white dark:bg-[#111113]">
              {d}
            </div>
          ))}
          
          {daysInMonth.map((day, idx) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayTrades = trades.filter(t => t.date.startsWith(dateStr));
            const dayJournal = journalEntries.find(j => j.date === dateStr);
            const dayPnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
            
            let bgClass = "bg-white dark:bg-[#131316] hover:bg-slate-50 dark:hover:bg-[#18181b]"; 
            if (dayTrades.length > 0) {
              bgClass = dayPnl >= 0 ? "bg-emerald-500/5 hover:bg-emerald-500/10" : "bg-rose-500/5 hover:bg-rose-500/10";
            }

            const isFuture = isAfter(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <div 
                key={day.toISOString()} 
                onClick={() => setSelectedJournalDate(day)}
                className={cn(
                  "min-h-[100px] sm:min-h-[140px] p-2 sm:p-3 relative flex flex-col transition-all cursor-pointer group border-t border-slate-200 dark:border-slate-800",
                  bgClass,
                  idx % 7 !== 0 && "border-l border-slate-200 dark:border-slate-800",
                  isFuture && "pointer-events-none",
                  !isCurrentMonth ? "opacity-40" : "opacity-100" // Dim out-of-month dates
                )}
              >
                <div className="flex justify-between items-start">
                  <span className={cn(
                    "text-sm font-semibold",
                    isSameDay(day, new Date()) ? "text-cyan-500 font-bold" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayJournal && (
                    <div 
                      className="bg-[#5b32f6] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-sm absolute top-2 right-2 shadow-sm"
                      title={dayJournal.notes || "Journal Entry"}
                    >
                      N
                    </div>
                  )}
                </div>
                {dayTrades.length > 0 && (
                  <div className="mt-auto text-[11px] sm:text-sm font-mono font-medium truncate text-left">
                    <span className={dayPnl >= 0 ? "text-emerald-500" : "text-rose-500"}>
                      {formatCurrency(dayPnl)}
                    </span>
                    <div className="hidden sm:block text-[10px] text-slate-500 font-sans mt-0.5">{dayTrades.length} trade{dayTrades.length > 1 ? 's' : ''}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Total Cumulative P&L */}
        <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-sm font-bold tracking-wide flex items-center">Total Cumulative P&L</h3>
            <Info className="w-4 h-4 text-slate-500" />
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="splitColorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset={
                      (() => {
                        if(chartData.length === 0) return 0;
                        const max = Math.max(...chartData.map(d => d.cumulative));
                        const min = Math.min(...chartData.map(d => d.cumulative));
                        if (max <= 0) return 0;
                        if (min >= 0) return 1;
                        return max / (max - min);
                      })()
                    } stopColor="#10b981" stopOpacity={1} />
                    <stop offset={
                      (() => {
                        if(chartData.length === 0) return 0;
                        const max = Math.max(...chartData.map(d => d.cumulative));
                        const min = Math.min(...chartData.map(d => d.cumulative));
                        if (max <= 0) return 0;
                        if (min >= 0) return 1;
                        return max / (max - min);
                      })()
                    } stopColor="#ef4444" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="#888888" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10} 
                  minTickGap={20}
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value}`}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#333" strokeDasharray="3 3" />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="url(#splitColorCal)" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#10b981", stroke: "#000", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily P&L */}
        <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-sm font-bold tracking-wide flex items-center">Daily P&L</h3>
            <Info className="w-4 h-4 text-slate-500" />
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="date" 
                  stroke="#888888" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10} 
                  minTickGap={20}
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value}`}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                <ReferenceLine y={0} stroke="#333" strokeDasharray="3 3" />
                <Bar 
                  dataKey="dailyPnl" 
                  radius={[2, 2, 2, 2]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.dailyPnl > 0 ? '#10b981' : entry.dailyPnl < 0 ? '#ef4444' : '#5b32f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold tracking-tight mb-4">Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <StatCard label="Win Rate" value={`${winRate.toFixed(1)}%`} highlight={winRate > 50 ? 'good' : 'bad'} />
          <StatCard label="Avg Win" value={formatCurrency(avgWin)} highlight="good" />
          <StatCard label="Avg Loss" value={formatCurrency(-avgLoss)} highlight="bad" />
          <StatCard label="Profit Factor" value={profitFactor.toFixed(2)} highlight={profitFactor > 1.5 ? 'good' : 'neutral'} />
          <StatCard label="Total Trades" value={trades.length.toString()} highlight="neutral" />
          <StatCard label="Total P&L" value={formatCurrency(totalPnl)} highlight={totalPnl > 0 ? 'good' : totalPnl < 0 ? 'bad' : 'neutral'} />
          <StatCard label="Current Streak" value={`${currentStreak} ${streakType === 'win' ? 'W' : 'L'}`} highlight={streakType === 'win' ? 'good' : streakType === 'loss' ? 'bad' : 'neutral'} />
        </div>
      </div>

      {selectedJournalDate && (
        <JournalModal 
          date={selectedJournalDate} 
          onClose={() => setSelectedJournalDate(null)} 
        />
      )}
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string, value: string, highlight: 'good'|'bad'|'neutral' }) {
  const colorClass = highlight === 'good' ? 'text-green-500' : highlight === 'bad' ? 'text-red-500' : 'text-slate-100';
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col items-start shadow-sm">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">{label}</span>
      <span className={cn("text-2xl font-bold mt-1 font-mono tracking-tight", colorClass)}>{value}</span>
    </div>
  );
}

function JournalModal({ date, onClose }: { date: Date, onClose: () => void }) {
  const { journalEntries, addJournalEntry } = useTrades();
  const dateStr = format(date, 'yyyy-MM-dd');
  
  const currentEntry = journalEntries.find(e => e.date === dateStr) || {
    id: crypto.randomUUID(),
    date: dateStr,
    notes: '',
    emotion: '😐',
    followedPlan: 'Partial' as const
  };

  const [notes, setNotes] = useState(currentEntry.notes);
  const [emotion, setEmotion] = useState(currentEntry.emotion);
  const [followedPlan, setFollowedPlan] = useState<'Yes'|'No'|'Partial'>(currentEntry.followedPlan);

  const handleSave = () => {
    addJournalEntry({
      id: currentEntry.id,
      date: dateStr,
      notes,
      emotion,
      followedPlan
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <h3 className="text-xl font-semibold">Journal for {format(date, 'MMMM do, yyyy')}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3">Dominant Emotion</label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map(emo => (
                <button
                  key={emo.label}
                  onClick={() => setEmotion(emo.emoji)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl border transition-all flex-1 min-w-[70px]",
                    emotion === emo.emoji 
                      ? "bg-slate-100 dark:bg-slate-800 border-[#5b32f6]/50 shadow-sm" 
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100"
                  )}
                >
                  <span className="text-xl sm:text-2xl">{emo.emoji}</span>
                  <span className={cn("text-[9px] sm:text-[10px] font-medium uppercase tracking-wider", emotion === emo.emoji ? "text-[#5b32f6]" : "text-slate-500")}>
                    {emo.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Did you follow your trading plan?</label>
            <div className="flex gap-3">
              {(['Yes', 'Partial', 'No'] as const).map(opt => {
                let colorClass = "border-slate-200 dark:border-slate-800";
                if (followedPlan === opt) {
                  if (opt === 'Yes') colorClass = "border-green-500/50 bg-green-500/10 text-green-500";
                  if (opt === 'Partial') colorClass = "border-yellow-500/50 bg-yellow-500/10 text-yellow-500";
                  if (opt === 'No') colorClass = "border-red-500/50 bg-red-500/10 text-red-500";
                }
                
                return (
                  <button
                    key={opt}
                    onClick={() => setFollowedPlan(opt)}
                    className={cn(
                      "flex-1 py-3 rounded-xl border font-bold text-sm transition-all",
                      followedPlan === opt ? colorClass : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-600"
                    )}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Reflections & Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you see in the market today? How did you execute? What could be improved?"
              rows={6}
              className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:border-[#5b32f6] resize-none"
            />
          </div>
        </div>

        <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-950/50">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2.5 bg-[#5b32f6] hover:bg-[#4a26d7] text-white rounded-xl font-bold shadow-md transition-colors">Save Journal</button>
        </div>
      </div>
    </div>
  );
}
