import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Activity, ShieldCheck, Search, MoreVertical, CreditCard, Clock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { Tab } from '../../types';

export function AdminDashboard({ onTabSelect }: { onTabSelect: (tab: Tab) => void }) {
  const { user, viewingUserId, setViewingUserId } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'revenue'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [usersInfo, setUsersInfo] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email !== 'ahmedfaizan2257@gmail.com') return;
    
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(query(usersRef, limit(100)));
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsersInfo(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  // Protect route
  if (user?.email !== 'ahmedfaizan2257@gmail.com') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
        <ShieldCheck className="w-16 h-16 text-rose-500 mb-4 opacity-80" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-slate-500">You don't have permission to view the admin dashboard.</p>
      </div>
    );
  }

  const filteredUsers = usersInfo.filter(u => 
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h2>
        <p className="text-slate-500 mt-2">Manage users, view platform analytics, and monitor revenue.</p>
      </div>

      <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-white dark:bg-slate-900 text-[#5b32f6] shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-white dark:bg-slate-900 text-[#5b32f6] shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('revenue')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'revenue' ? 'bg-white dark:bg-slate-900 text-[#5b32f6] shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
        >
          Revenue
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-sm font-medium">Total Users</h3>
                <div className="p-2 bg-[#5b32f6]/10 text-[#5b32f6] rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <p className="text-3xl font-bold text-slate-900 dark:text-white">
                   {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : usersInfo.length.toLocaleString()}
                 </p>
              </div>
              <div className="flex items-center gap-1 mt-2 text-emerald-500 text-sm">
                <Activity className="w-4 h-4" />
                <span>+12% from last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-sm font-medium">MRR</h3>
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">$14,500</p>
              <div className="flex items-center gap-1 mt-2 text-emerald-500 text-sm">
                <Activity className="w-4 h-4" />
                <span>+5.2% from last month</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-sm font-medium">Active Subscriptions</h3>
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">482</p>
              <div className="flex items-center gap-1 mt-2 text-slate-500 text-sm">
                <Activity className="w-4 h-4" />
                <span>42 trials active</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-sm font-medium">Total Trades Synced</h3>
                <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">142.5k</p>
              <div className="flex items-center gap-1 mt-2 text-emerald-500 text-sm">
                <Activity className="w-4 h-4" />
                <span>+8% from last week</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">System Status</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">NinjaTrader API Integration</span>
                   </div>
                   <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full">Operational</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">Chrome Extension Backend</span>
                   </div>
                   <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full">Operational</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                   <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-500" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">Trade Sync Engine</span>
                   </div>
                   <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full">Minor Delay (~2s)</span>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Management</h3>
             <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..." 
                  className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border fill-transparent border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5b32f6]/50 transition-all dark:text-white"
                />
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                   <tr>
                      <th className="p-4 font-medium">User</th>
                      <th className="p-4 font-medium">Plan</th>
                      <th className="p-4 font-medium">Trades Logged</th>
                      <th className="p-4 font-medium">Joined</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                   {filteredUsers.map(u => (
                     <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="p-4">
                           <div className="flex flex-col">
                              <span className="font-medium text-slate-800 dark:text-slate-200">{u.name}</span>
                              <span className="text-slate-500 text-xs">{u.email}</span>
                           </div>
                        </td>
                        <td className="p-4">
                           <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                             (u.plan || 'free') === 'pro' ? 'bg-[#5b32f6]/10 text-[#5b32f6]' : 
                             (u.plan || 'free') === 'lifetime' ? 'bg-amber-500/10 text-amber-500' : 
                             'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                           }`}>
                             {u.plan || 'free'}
                           </span>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-300 font-mono">
                           {u.trades !== undefined ? u.trades.toLocaleString() : 'N/A'}
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">
                           {u.joined ? new Date(u.joined).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                             <span className="text-slate-600 dark:text-slate-400 capitalize">{u.status || 'Active'}</span>
                           </div>
                        </td>
                        <td className="p-4 text-right flex justify-end">
                           {viewingUserId === u.id ? (
                             <button 
                               onClick={() => setViewingUserId(null)}
                               className="p-2 gap-2 flex items-center bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold rounded-lg transition-colors"
                             >
                                <EyeOff className="w-4 h-4" /> Stop Viewing
                             </button>
                           ) : (
                             <button 
                               onClick={() => {
                                 setViewingUserId(u.id);
                                 onTabSelect('dashboard');
                               }}
                               className="p-2 gap-2 flex items-center bg-[#5b32f6]/10 text-[#5b32f6] hover:bg-[#5b32f6]/20 text-xs font-bold rounded-lg transition-colors"
                             >
                                <Eye className="w-4 h-4" /> View Dashboard
                             </button>
                           )}
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
             {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                   No users found matching "{searchQuery}"
                </div>
             )}
          </div>
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center text-center h-64">
           <Activity className="w-12 h-12 text-[#5b32f6] mb-4 opacity-50" />
           <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Charts</h3>
           <p className="text-slate-500 mt-2 max-w-sm">
              Connect Stripe to view detailed revenue graphs, churn rate, and LTV.
           </p>
           <button className="mt-6 px-6 py-2 bg-[#5b32f6] text-white rounded-xl font-bold hover:bg-[#4a26d2] transition-colors">
              Connect Payment Gateway
           </button>
        </div>
      )}
    </div>
  );
}
