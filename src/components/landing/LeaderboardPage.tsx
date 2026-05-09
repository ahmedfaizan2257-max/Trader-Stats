import React from 'react';

export function LeaderboardPage() {
  const leaders = [
    { rank: 1, name: 'Alex M.', winRate: '72.4%', profitFactor: '2.8', pnl: '+$42,500' },
    { rank: 2, name: 'Sarah T.', winRate: '68.1%', profitFactor: '2.4', pnl: '+$31,200' },
    { rank: 3, name: 'John D.', winRate: '65.8%', profitFactor: '2.1', pnl: '+$28,950' },
    { rank: 4, name: 'Mike R.', winRate: '63.2%', profitFactor: '1.9', pnl: '+$18,400' },
    { rank: 5, name: 'Emma W.', winRate: '60.5%', profitFactor: '1.7', pnl: '+$14,200' },
    { rank: 6, name: 'David L.', winRate: '59.8%', profitFactor: '1.6', pnl: '+$11,800' },
    { rank: 7, name: 'Chris B.', winRate: '58.2%', profitFactor: '1.5', pnl: '+$9,500' },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-[80vh] flex flex-col items-center">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">Global <span className="text-[#5b32f6]">Leaderboard</span>.</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          See how you stack up against the best. Top performers based on verified trade executions and consistent risk management.
        </p>
      </div>

      <div className="w-full bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white dark:bg-[#18181b] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Trader</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Win Rate</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Profit Factor</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Monthly P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {leaders.map((leader) => (
                <tr key={leader.rank} className="hover:bg-white dark:bg-[#18181b]/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${leader.rank <= 3 ? 'bg-[#5b32f6]/20 text-[#5b32f6]' : 'bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}>
                      #{leader.rank}
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-800 dark:text-slate-200">{leader.name}</td>
                  <td className="px-6 py-5 text-slate-700 dark:text-slate-300 font-mono">{leader.winRate}</td>
                  <td className="px-6 py-5 text-slate-700 dark:text-slate-300 font-mono">{leader.profitFactor}</td>
                  <td className="px-6 py-5 text-[#5b32f6] font-bold font-mono text-right">{leader.pnl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
