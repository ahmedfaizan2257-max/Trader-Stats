import { useState } from 'react';
import { useTrades } from '../../context/TradeContext';
import { formatCurrency, cn } from '../../lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, subMonths, addMonths } from 'date-fns';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { 
  Info, Percent, Activity, Divide, Clock, 
  ArrowUpRight, ArrowDownRight, DollarSign, 
  Hash, ArrowUp, ArrowDown, Zap, ShieldAlert,
  Layers, ChevronLeft, ChevronRight, Filter, Share
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Dashboard() {
  const { trades } = useTrades();
  const { user } = useAuth();
  
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const selectedTrades = trades.filter(t => {
    const tDate = new Date(t.date);
    return tDate >= monthStart && tDate <= monthEnd;
  });
  
  // Summary stats for selected month
  const totalPnl = selectedTrades.reduce((sum, t) => sum + t.pnl, 0);
  const winningTrades = selectedTrades.filter(t => t.pnl > 0);
  const losingTrades = selectedTrades.filter(t => t.pnl <= 0); 
  
  const winRate = selectedTrades.length > 0 ? (winningTrades.length / selectedTrades.length) * 100 : 0;
  
  const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
  
  const avgWin = winningTrades.length > 0 ? grossProfit / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? grossLoss / losingTrades.length : 0;
  
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss) : (grossProfit > 0 ? 999 : 0);
  const avgWinLossRatio = avgLoss > 0 ? (avgWin / avgLoss) : (avgWin > 0 ? 999 : 0);

  const largestWin = winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl)) : 0;
  const largestLoss = losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl)) : 0;

  const totalLongs = selectedTrades.filter(t => t.direction === 'Long').length;
  const totalShorts = selectedTrades.filter(t => t.direction === 'Short').length;

  const totalLots = selectedTrades.reduce((sum, t) => sum + (t.contracts || 0), 0);
  const totalCommissions = 0; // Placeholder

  // Streaks
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  const sortedTrades = selectedTrades.slice().sort((a,b) => a.date.localeCompare(b.date));
  
  sortedTrades.forEach(t => {
    if (t.pnl > 0) {
       currentWinStreak++;
       currentLossStreak = 0;
       if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
    } else if (t.pnl < 0) {
       currentLossStreak++;
       currentWinStreak = 0;
       if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak;
    } else {
       currentWinStreak = 0;
       currentLossStreak = 0;
    }
  });

  // Chart Data
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  let cumulativeMonth = 0;
  const chartData = daysInMonth.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayTrades = selectedTrades.filter(t => t.date.startsWith(dateStr));
    const dailyPnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
    cumulativeMonth += dailyPnl;
    
    return {
      date: format(day, 'M/d/yy'),
      fullDate: dateStr,
      dailyPnl,
      cumulative: cumulativeMonth
    };
  });

  // Year to Date Data
  const currentYear = currentMonth.getFullYear();
  const yearTrades = trades.filter(t => new Date(t.date).getFullYear() === currentYear);
  const monthsInYear = Array.from({ length: 12 }, (_, i) => new Date(currentYear, i, 1));
  const ytdData = monthsInYear.map(month => {
    const monthStr = format(month, 'yyyy-MM');
    const mTrades = yearTrades.filter(t => t.date.startsWith(monthStr));
    const pnl = mTrades.reduce((sum, t) => sum + t.pnl, 0);
    return {
      month: format(month, 'MMM'),
      fullMonth: monthStr,
      pnl
    };
  });

  const timeBreakdownData = [
    { name: '0 - 15 sec', count: 0, winRate: 0 },
    { name: '15 - 45 sec', count: 0, winRate: 0 },
    { name: '45 sec - 1 min', count: 0, winRate: 0 },
    { name: '1 - 2 min', count: 0, winRate: 0 },
    { name: '2 - 5 min', count: 0, winRate: 0 },
    { name: '5 - 10 min', count: 0, winRate: 0 },
    { name: '10 - 30 min', count: 0, winRate: 0 },
    { name: '30 min - 1 hour', count: 0, winRate: 0 },
    { name: '1 - 2 hours', count: 0, winRate: 0 },
    { name: '2 - 4 hours', count: 0, winRate: 0 },
    { name: '4h+', count: 0, winRate: 0 },
  ].reverse();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-xl">
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">{label}</p>
          <p className={cn("font-mono font-bold text-lg", payload[0].value >= 0 ? "text-emerald-500" : "text-rose-500")}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col gap-2">
        <div>
          {user && <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">HELLO, {user.displayName || user.email?.split('@')[0]} 👋</span>}
          <h2 className="text-3xl font-bold tracking-tight mt-1 text-slate-900 dark:text-white">Performance Dashboard</h2>
        </div>
        
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-4 mb-2">NET P&L</p>
          <p className={cn("text-5xl font-mono tracking-tight font-bold selection:bg-transparent", totalPnl >= 0 ? "text-emerald-500" : "text-rose-500")}>
            {formatCurrency(totalPnl)}
          </p>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center bg-slate-100 dark:bg-[#18181b] rounded-xl p-1 border border-slate-200 dark:border-slate-800/80">
            <button 
              onClick={() => setCurrentMonth(prev => subMonths(prev, 1))} 
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800/80 rounded-lg transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold min-w-[120px] text-center text-slate-900 dark:text-white">
               {isSameMonth(currentMonth, new Date()) ? "This Month" : format(currentMonth, 'MMMM yyyy')}
            </span>
            <button 
              onClick={() => setCurrentMonth(prev => addMonths(prev, 1))} 
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800/80 rounded-lg transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800/80 rounded-xl transition-colors text-sm font-semibold text-slate-700 dark:text-white">
                <Filter className="w-4 h-4" /> Filters
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800/80 rounded-xl transition-colors text-sm font-semibold text-slate-700 dark:text-white">
                <Share className="w-4 h-4" /> Share
             </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <BigStatCard icon={Percent} label="Win Rate" value={`${winRate.toFixed(2)}%`} />
        <BigStatCard icon={Activity} label="Profit Factor" value={profitFactor.toFixed(2)} />
        <BigStatCard icon={Divide} label="Avg Win / Avg Loss Ratio" value={`${avgWinLossRatio.toFixed(2)}+`} />
        <BigStatCard icon={Clock} label="Avg Time per Trade" value="0.00 min" />
      </div>

      <div className="flex flex-col gap-4 mt-8">
        {/* Total Cumulative P&L */}
        <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <h3 className="text-sm font-bold tracking-wide flex items-center text-slate-900 dark:text-white">Total Cumulative P&L</h3>
            <Info className="w-4 h-4 text-slate-500 cursor-help" />
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="date" 
                  stroke="#555" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10} 
                  minTickGap={20}
                />
                <YAxis 
                  stroke="#555" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#333" strokeDasharray="3 3" />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#5b32f6" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#5b32f6", stroke: "#000", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily P&L */}
        <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <h3 className="text-sm font-bold tracking-wide flex items-center text-slate-900 dark:text-white">Daily P&L</h3>
            <Info className="w-4 h-4 text-slate-500 cursor-help" />
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="date" 
                  stroke="#555" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10} 
                  minTickGap={20}
                />
                <YAxis 
                  stroke="#555" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                <ReferenceLine y={0} stroke="#333" strokeDasharray="3 3"/>
                <Bar 
                  dataKey="dailyPnl" 
                  radius={[2, 2, 2, 2]}
                  fill="#5b32f6"
                  barSize={maxWinStreak > 30 ? 6 : undefined}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">Trades</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <BigStatCard icon={ArrowUpRight} label="Largest Winning Trade" value={formatCurrency(largestWin)} iconColorClass="bg-emerald-500/10 text-emerald-500" valueColorClass="text-emerald-500" />
          <BigStatCard icon={ArrowDownRight} label="Largest Losing Trade" value={formatCurrency(largestLoss)} iconColorClass="bg-rose-500/10 text-rose-500" valueColorClass="text-rose-500" />
          <BigStatCard icon={ArrowUpRight} label="Avg Winning Trade" value={formatCurrency(avgWin)} iconColorClass="bg-emerald-500/10 text-emerald-500" valueColorClass="text-emerald-500" />
          <BigStatCard icon={ArrowDownRight} label="Avg Losing Trade" value={formatCurrency(avgLoss)} iconColorClass="bg-rose-500/10 text-rose-500" valueColorClass="text-rose-500" />
          
          <BigStatCard icon={DollarSign} label="Total Commissions Paid" value={formatCurrency(totalCommissions)} />
          <BigStatCard icon={Hash} label="Total Trades" value={selectedTrades.length.toString()} />
          
          <BigStatCard icon={ArrowUp} label="Total Long Trades" value={totalLongs.toString()} />
          <BigStatCard icon={ArrowDown} label="Total Short Trades" value={totalShorts.toString()} />
          
          <BigStatCard icon={Zap} label="Longest Winning Streak" value={`${maxWinStreak} days`} />
          <BigStatCard icon={ShieldAlert} label="Longest Losing Streak" value={`${maxLossStreak} days`} />
          
          <BigStatCard icon={Layers} label="Total Lots" value={totalLots.toString()} />
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <h3 className="text-sm font-bold tracking-wide flex items-center text-slate-900 dark:text-white">Time per Trade Breakdown</h3>
            <Info className="w-4 h-4 text-slate-500 cursor-help" />
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={timeBreakdownData} margin={{ top: 5, right: 10, left: 40, bottom: 5 }}>
                <XAxis 
                  type="number"
                  stroke="#555" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  dataKey="name"
                  type="category"
                  stroke="#555" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  width={100}
                />
                <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', borderRadius: '8px' }} />
                <Bar 
                  dataKey="count" 
                  fill="#5b32f6"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                  label={{ position: 'right', fill: '#888', fontSize: 11 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <h3 className="text-sm font-bold tracking-wide flex items-center text-slate-900 dark:text-white">Win Rate Breakdown</h3>
            <Info className="w-4 h-4 text-slate-500 cursor-help" />
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={timeBreakdownData} margin={{ top: 5, right: 10, left: 40, bottom: 5 }}>
                <XAxis 
                  type="number"
                  stroke="#555" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                  tickFormatter={(val) => `${val}%`}
                  domain={[0, 100]}
                />
                <YAxis 
                  dataKey="name"
                  type="category"
                  stroke="#555" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  width={100}
                />
                <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', borderRadius: '8px' }} />
                <Bar 
                  dataKey="winRate" 
                  fill="#5b32f6"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                  label={{ position: 'right', fill: '#888', fontSize: 11, formatter: (val: number) => `${val.toFixed(1)}%` }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">Year to Date Monthly P&L in {currentYear}</h3>
        <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ytdData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="month" 
                  stroke="#555" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10} 
                  minTickGap={10}
                />
                <YAxis 
                  stroke="#555" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value.toFixed(0)}`} // integer values are usually cleaner for YAxis on big numbers
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                <ReferenceLine y={0} stroke="#333" strokeDasharray="3 3"/>
                <Bar 
                  dataKey="pnl" 
                  radius={[4, 4, 4, 4]}
                  fill="#5b32f6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function BigStatCard({ 
  icon: Icon, 
  label, 
  value, 
  iconColorClass = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  valueColorClass = "text-slate-900 dark:text-white"
}: { 
  icon: any, 
  label: string, 
  value: string,
  iconColorClass?: string,
  valueColorClass?: string
}) {
  return (
    <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl flex items-start gap-4 hover:border-slate-300 dark:hover:border-slate-700/80 transition-colors shadow-sm">
      <div className={cn("p-2.5 rounded-xl border border-black/5 dark:border-white/5", iconColorClass)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold flex items-center justify-between gap-1">
          <span className="truncate">{label}</span>
          <Info className="w-4 h-4 opacity-30 hover:opacity-100 cursor-help shrink-0 text-slate-400" />
        </div>
        <div className={cn("text-xl sm:text-2xl font-bold font-mono mt-1.5", valueColorClass)}>
          {value}
        </div>
      </div>
    </div>
  );
}

