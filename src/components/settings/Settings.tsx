import { useState } from 'react';
import { useTrades } from '../../context/TradeContext';
import { Plus, Trash2, Edit } from 'lucide-react';
import { TradingAccount } from '../../types';

export function Settings() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useTrades();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    size: 50000,
    cost: 0,
    status: 'Active' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    addAccount({
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    });
    
    setShowAdd(false);
    setFormData({ name: '', size: 50000, cost: 0, status: 'Active' });
  };

  return (
    <div className="space-y-6 pb-20 text-slate-900 dark:text-white max-w-4xl">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your accounts and preferences</p>
      </header>

      <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Trading Accounts</h3>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2 bg-[#5b32f6] hover:bg-[#4a26d7] text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-[#5b32f6]/20"
          >
            <Plus className="w-4 h-4" /> Add Account
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="text-xs font-semibold text-slate-500 mb-1 block uppercase tracking-wider">Account Name</label>
                 <input 
                   required
                   type="text" 
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   placeholder="e.g. Apex 50k" 
                   className="w-full bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b32f6] transition-colors" 
                 />
              </div>
              <div>
                 <label className="text-xs font-semibold text-slate-500 mb-1 block uppercase tracking-wider">Account Size ($)</label>
                 <input 
                   required
                   type="number" 
                   value={formData.size}
                   onChange={e => setFormData({...formData, size: Number(e.target.value)})}
                   className="w-full bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b32f6] transition-colors" 
                 />
              </div>
              <div>
                 <label className="text-xs font-semibold text-slate-500 mb-1 block uppercase tracking-wider">Evaluation Cost ($)</label>
                 <input 
                   required
                   type="number" 
                   value={formData.cost}
                   onChange={e => setFormData({...formData, cost: Number(e.target.value)})}
                   className="w-full bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b32f6] transition-colors" 
                 />
              </div>
              <div>
                 <label className="text-xs font-semibold text-slate-500 mb-1 block uppercase tracking-wider">Status</label>
                 <select 
                   value={formData.status}
                   onChange={e => setFormData({...formData, status: e.target.value as any})}
                   className="w-full bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b32f6] transition-colors appearance-none"
                 >
                    <option>Active</option>
                    <option>Funded</option>
                    <option>Blown</option>
                    <option>Payout</option>
                 </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-[#5b32f6] hover:bg-[#4a26d7] text-white rounded-xl font-bold transition-colors shadow-md shadow-[#5b32f6]/20 text-sm"
              >
                Save Account
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {accounts.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
               No accounts configured yet.
            </div>
          ) : (
            accounts.map(acc => (
               <div key={acc.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="font-bold">{acc.name}</div>
                    <div className="text-sm text-slate-500 flex gap-3 mt-1">
                      <span>Size: ${acc.size.toLocaleString()}</span>
                      <span>Cost: ${acc.cost.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`px-2 py-1 text-xs font-bold rounded-lg ${
                       acc.status === 'Active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                       acc.status === 'Funded' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                       acc.status === 'Blown' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                       'bg-[#5b32f6]/10 text-[#5b32f6] dark:bg-[#5b32f6]/20'
                     }`}>
                       {acc.status}
                     </span>
                     <button onClick={() => deleteAccount(acc.id)} className="p-2 text-slate-400 hover:text-rose-500 bg-white dark:bg-[#111113] rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
                       <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
