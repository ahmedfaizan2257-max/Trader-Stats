import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export function PaymentPage({ onPay }: { onPay: () => void }) {
  const [loading, setLoading] = useState(false);
  
  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onPay();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#5b32f6]/10 text-[#5b32f6] rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Trial Expired</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Your 14-day free trial has expired. Upgrade to Pro to continue using TradeEdge.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Pro Plan</h3>
              <p className="text-sm text-slate-500">Unlimited access</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">$29</span>
              <span className="text-slate-500">/mo</span>
            </div>
          </div>
          <ul className="space-y-3">
             <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
               <CheckCircle2 className="w-5 h-5 text-emerald-500" />
               Advanced analytics & reports
             </li>
             <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
               <CheckCircle2 className="w-5 h-5 text-emerald-500" />
               Custom trade sharing cards
             </li>
             <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
               <CheckCircle2 className="w-5 h-5 text-emerald-500" />
               AI-powered feedback
             </li>
          </ul>
        </div>

        <form onSubmit={handlePay} className="space-y-6">
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mock Payment Details</label>
             <input type="text" placeholder="Card number (Mock)" readOnly value="**** **** **** 4242" className="w-full bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-900 dark:text-white" />
           </div>
           
           <button 
             type="submit" 
             disabled={loading}
             className="w-full bg-[#5b32f6] hover:bg-[#4a26d7] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
           >
             {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : 'Subscribe Now'}
           </button>
           
           <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
             <ShieldCheck className="w-4 h-4" />
             Secured by mock payment gateway
           </div>
        </form>
      </div>
    </div>
  );
}
