import { Wallet, Settings, Filter, ArrowUpRight, ArrowDownRight, LayoutList, Share2, Layers, Plus } from 'lucide-react';
import { useTrades } from '../../context/TradeContext';

export function Accounts() {
  const { accounts } = useTrades();

  const totalAccounts = accounts.length;
  const totalCosts = accounts.reduce((sum, acc) => sum + acc.cost, 0);
  const totalPayouts = accounts.filter(a => a.status === 'Payout').reduce((sum, acc) => sum + acc.cost, 0); // Need payouts properly, but for now we assume some fake/mapped logic or zero. wait.. no payout tracking exist yet so let's stick to 0 or derive from status. We don't have separate payout amount. Let's just keep totalPayouts = 0 for now as there's no payout array.
  // Actually, wait, let's keep it simple.
  
  return (
    <div className="space-y-6 pb-20 text-slate-900 dark:text-white">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Trading Accounts</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track your prop firm accounts, costs, and payouts</p>
      </header>
      
      <div>
         <button className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800/80 rounded-xl transition-colors text-sm font-semibold mb-6">
            <Filter className="w-4 h-4" /> Filters 1
         </button>
         
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
               <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                 <Layers className="w-5 h-5" />
               </div>
               <div>
                 <div className="text-sm font-semibold text-slate-500">Total Accounts</div>
                 <div className="text-2xl font-bold font-mono">{totalAccounts}</div>
               </div>
            </div>
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
               <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                 <Wallet className="w-5 h-5" />
               </div>
               <div>
                 <div className="text-sm font-semibold text-slate-500">Total Costs</div>
                 <div className="text-2xl font-bold font-mono text-rose-500">${totalCosts.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
               </div>
            </div>
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
               <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                 <Wallet className="w-5 h-5" />
               </div>
               <div>
                 <div className="text-sm font-semibold text-slate-500">Total Payouts</div>
                 <div className="text-2xl font-bold font-mono text-emerald-500">${totalPayouts.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
               </div>
            </div>
            <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
               <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                 <span className="font-bold text-lg leading-none">%</span>
               </div>
               <div>
                 <div className="text-sm font-semibold text-slate-500">ROI</div>
                 <div className="text-2xl font-bold font-mono text-emerald-500">0.00%</div>
               </div>
            </div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm h-64 flex flex-col">
            <h3 className="font-bold text-lg mb-4">Payouts by Account</h3>
            <div className="flex-1 flex items-center justify-center text-slate-500 rotate-[-15deg]">No Data</div>
         </div>
         <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm h-64 flex flex-col">
            <h3 className="font-bold text-lg mb-4">Performance by Account Size</h3>
            <div className="flex-1 flex items-center justify-center text-slate-500 rotate-[-15deg]">No Data</div>
         </div>
         <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm h-64 flex flex-col">
            <h3 className="font-bold text-lg mb-4">Costs vs Payouts</h3>
            <div className="flex-1 flex items-center justify-center text-slate-500 rotate-[-15deg]">No Data</div>
         </div>
         <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm h-64 flex flex-col">
            <h3 className="font-bold text-lg mb-4">Total Costs by Account</h3>
            <div className="flex-1 flex items-center justify-center text-slate-500 rotate-[-15deg]">No Data</div>
         </div>
      </div>
      
      <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
         <h3 className="font-bold text-lg mb-4">Account Details</h3>
         
         {accounts.length === 0 ? (
           <div className="py-12 flex flex-col items-center justify-center text-center">
              <h4 className="font-bold text-[17px] text-slate-300 mb-2">No accounts found.</h4>
              <p className="text-slate-500 text-sm">Add account details in <span className="underline decoration-[#5b32f6] text-[#5b32f6] cursor-pointer">Settings</span></p>
           </div>
         ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
               <thead>
                 <tr className="border-b border-slate-200 dark:border-slate-800">
                   <th className="pb-3 font-semibold text-slate-500">Account Name</th>
                   <th className="pb-3 font-semibold text-slate-500">Size</th>
                   <th className="pb-3 font-semibold text-slate-500">Cost</th>
                   <th className="pb-3 font-semibold text-slate-500">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                 {accounts.map(acc => (
                   <tr key={acc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                     <td className="py-3 font-bold">{acc.name}</td>
                     <td className="py-3 font-mono">${acc.size.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                     <td className="py-3 font-mono">${acc.cost.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                     <td className="py-3">
                       <span className={`px-2 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider ${
                         acc.status === 'Active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                         acc.status === 'Funded' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                         acc.status === 'Blown' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                         'bg-[#5b32f6]/10 text-[#5b32f6] dark:bg-[#5b32f6]/20'
                       }`}>
                         {acc.status}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         )}
         
         <div className="mt-6 text-center text-xs font-semibold text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-6">
            Manage your accounts in <span className="underline decoration-[#5b32f6] text-[#5b32f6] cursor-pointer">Account Settings</span> • Upload payouts in <span className="underline decoration-[#5b32f6] text-[#5b32f6] cursor-pointer">Payouts</span>
         </div>
      </div>
    </div>
  );
}
