import { useTrades } from '../../context/TradeContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '../../lib/utils';
import { getDay } from 'date-fns';

export function Analytics() {
  const { trades } = useTrades();

  if (trades.length === 0) {
    return <div className="text-slate-400">Not enough data to run analytics. Add some trades first.</div>;
  }

  // Equity Curve Data
  // Sort trades by date
  const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let cumulative = 0;
  const equityData = sortedTrades.map((t, idx) => {
    cumulative += t.pnl;
    return {
      index: idx + 1,
      date: t.date,
      pnl: t.pnl,
      equity: cumulative
    };
  });

  // Win/Loss Distribution
  const wins = trades.filter(t => t.pnl > 0).length;
  const losses = trades.filter(t => t.pnl <= 0).length;
  const wlData = [
    { name: 'Wins', count: wins, fill: '#10b981' }, // emerald-500
    { name: 'Losses', count: losses, fill: '#ef4444' } // red-500
  ];

  // P&L by Day of Week
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayPnl = Array(7).fill(0);
  trades.forEach(t => {
    const dayIdx = getDay(new Date(t.date));
    // Important: JS Date interprets "YYYY-MM-DD" as UTC. To get local day accurately, adding time helps but let's stick to standard behavior.
    dayPnl[dayIdx] += t.pnl;
  });
  const dayData = days.map((d, i) => ({ day: d, pnl: dayPnl[i] })).slice(1, 6); // Just week days

  // Long vs Short
  let longPnl = 0; let shortPnl = 0;
  trades.forEach(t => {
    if (t.direction === 'Long') longPnl += t.pnl;
    else shortPnl += t.pnl;
  });
  const dirData = [
    { name: 'Long', pnl: longPnl },
    { name: 'Short', pnl: shortPnl }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-sm">
          <p className="font-semibold text-slate-200">{label}</p>
          {payload.map((p: any, i: number) => (
             <p key={i} className="text-slate-400">
               {p.name === 'equity' || p.name === 'pnl' ? formatCurrency(p.value) : p.value}
             </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-light tracking-tight">Analytics</h2>
        <p className="text-slate-400 mt-1 text-sm">Deep dive into your performance metrics.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Equity Curve */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6 text-slate-200">Equity Curve</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={equityData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickMargin={10} minTickGap={30} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `$${val}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="equity" stroke="#00d4ff" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#00d4ff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Win / Loss Dist */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-slate-200">Win / Loss Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wlData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#1e293b' }} content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {wlData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PnL by Day */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-slate-200">P&L by Day of Week</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `$${val}`} />
                <Tooltip cursor={{ fill: '#1e293b' }} content={<CustomTooltip />} />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {dayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.pnl > 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Long vs Short */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6 text-slate-200">Long vs Short Performance</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dirData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `$${val}`} />
                <Tooltip cursor={{ fill: '#1e293b' }} content={<CustomTooltip />} />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {dirData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.pnl > 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
