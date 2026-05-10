import { Plus } from 'lucide-react';

export function Payouts() {
  return (
    <div className="max-w-5xl space-y-8 pb-20 text-slate-900 dark:text-white">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Track Your Payouts</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-[15px] leading-relaxed">
          Upload your prop firm payouts to track your earnings. Public payouts will be listed on the <span className="font-semibold text-slate-900 dark:text-white">Leaderboard</span>. <span className="text-emerald-600 dark:text-emerald-400 font-semibold">(A premium subscription required to appear on leaderboard)</span>.
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Note: Please be honest with what you post. If you post a payout that you didn't receive, you will be banned from the leaderboard.
        </p>
      </header>
      
      <button className="flex items-center gap-2 px-5 py-2.5 bg-[#5b32f6] hover:bg-[#4a26d7] text-white rounded-xl font-bold transition-colors shadow-md shadow-[#5b32f6]/20">
        <Plus className="w-5 h-5" /> Add Payout
      </button>

      <div className="pt-4">
        <h3 className="text-xl font-bold mb-1">Your Payouts</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">View and manage all your payout records</p>
        
        <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
           <p className="text-slate-400 dark:text-slate-500 mb-6 font-semibold">No payouts found. Upload your first payout to get started.</p>
           <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#111113] hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl font-bold mx-auto transition-colors">
              <Plus className="w-5 h-5" /> Add Your First Payout
           </button>
        </div>
      </div>
    </div>
  );
}
