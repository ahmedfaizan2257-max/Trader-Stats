import { useTrades } from '../../context/TradeContext';
import { formatCurrency, cn } from '../../lib/utils';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, getDay, isAfter } from 'date-fns';

export function Dashboard() {
  const { trades } = useTrades();

  // Summary stats
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const winningTrades = trades.filter(t => t.pnl > 0);
  const losingTrades = trades.filter(t => t.pnl <= 0); // Include breakeven in loss or keep separate
  
  const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
  
  const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
  
  const avgWin = winningTrades.length > 0 ? grossProfit / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? grossLoss / losingTrades.length : 0;
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss) : (grossProfit > 0 ? 999 : 0);

  // Streak Calculation
  let currentStreak = 0;
  let streakType = null; // 'win' | 'loss'
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

  // Calendar Logic (Current Month)
  // Get latest trade date or use today. Just use May 2026 for the demo if trades are static, but let's be dynamic:
  const latestDate = trades.length > 0 ? new Date([...trades].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date) : new Date();
  
  const monthStart = startOfMonth(latestDate);
  const monthEnd = endOfMonth(latestDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startingDayOfWeek = getDay(monthStart); // 0 (Sun) to 6 (Sat)
  const emptyDaysStart = Array.from({ length: startingDayOfWeek }).fill(null);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-light tracking-tight">Dashboard</h2>
        <p className="text-slate-400 mt-1 text-sm">Welcome back. Here's your recent trading performance.</p>
      </header>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total P&L" value={formatCurrency(totalPnl)} highlight={totalPnl > 0 ? 'good' : totalPnl < 0 ? 'bad' : 'neutral'} />
        <StatCard label="Win Rate" value={`${winRate.toFixed(1)}%`} highlight={winRate > 50 ? 'good' : 'bad'} />
        <StatCard label="Avg Win" value={formatCurrency(avgWin)} highlight="good" />
        <StatCard label="Avg Loss" value={formatCurrency(-avgLoss)} highlight="bad" />
        <StatCard label="Profit Factor" value={profitFactor.toFixed(2)} highlight={profitFactor > 1.5 ? 'good' : 'neutral'} />
        <StatCard label="Current Streak" value={`${currentStreak} ${streakType === 'win' ? 'W' : 'L'}`} highlight={streakType === 'win' ? 'good' : 'bad'} />
      </div>

      {/* Calendar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold tracking-tight">Monthly P&L - {format(latestDate, 'MMMM yyyy')}</h3>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest pb-2">
              {d}
            </div>
          ))}
          {emptyDaysStart.map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[64px] sm:h-24 rounded-xl border border-slate-800/50 bg-slate-900/20" />
          ))}
          
          {daysInMonth.map(day => {
            // Find trades for this day
            const dayTrades = trades.filter(t => isSameDay(new Date(t.date), day));
            const dayPnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
            
            let bgClass = "bg-slate-800/40 border-slate-800/40"; // No trades (grey)
            if (dayTrades.length > 0) {
              bgClass = dayPnl > 0 ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400";
            }

            const isFuture = isAfter(day, new Date());

            return (
              <div key={day.toISOString()} className={cn(
                "min-h-[64px] sm:h-24 rounded-xl border p-1.5 sm:p-2 flex flex-col justify-between transition-colors",
                bgClass,
                isFuture && "opacity-30"
              )}>
                <span className="text-[10px] sm:text-xs font-mono opacity-60 self-end">{format(day, 'd')}</span>
                {dayTrades.length > 0 && (
                  <div className="text-[10px] sm:text-sm font-mono font-medium truncate">
                    {formatCurrency(dayPnl)}
                    <div className="hidden sm:block text-[10px] opacity-70 font-sans mt-0.5">{dayTrades.length} trade{dayTrades.length > 1 ? 's' : ''}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string, value: string, highlight: 'good'|'bad'|'neutral' }) {
  const colorClass = highlight === 'good' ? 'text-green-400' : highlight === 'bad' ? 'text-red-400' : 'text-slate-100';
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-start shadow-sm">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">{label}</span>
      <span className={cn("text-2xl font-semibold mt-1 font-mono tracking-tight", colorClass)}>{value}</span>
    </div>
  );
}
