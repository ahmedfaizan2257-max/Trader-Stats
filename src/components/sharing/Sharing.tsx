export function Sharing() {
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
                    <th className="p-4">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-semibold">No daily performance to share</td></tr>
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
                    <th className="p-4">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-semibold">No calendars to share</td></tr>
              </tbody>
           </table>
        </div>
      </section>
    </div>
  );
}
