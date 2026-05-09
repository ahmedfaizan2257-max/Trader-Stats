import { Briefcase, LayoutDashboard, LineChart, MessageSquare, BookOpen, ChevronDown, Clock, ArrowLeft, Link2, TrendingUp, LogOut } from 'lucide-react';
import { Tab } from '../../types';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export function Sidebar({ currentTab, onTabSelect, onBack }: { currentTab: Tab, onTabSelect: (val: Tab) => void, onBack?: () => void }) {
  const { profile, logout } = useAuth();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'log', label: 'Trade Log', icon: Briefcase },
    { id: 'feedback', label: 'AI Feedback', icon: MessageSquare },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
  ] as const;

  const handleLogout = async () => {
    try {
      await logout();
      if (onBack) onBack(); // Go to landing page
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const calculateDaysLeft = () => {
    if (!profile) return 14;
    const end = new Date(profile.trialEndDate).getTime();
    const now = new Date().getTime();
    const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const daysLeft = calculateDaysLeft();
  const progressPercent = Math.max(0, Math.min(100, ((14 - daysLeft) / 14) * 100));

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen flex-shrink-0">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800/60">
        <div 
          className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onBack}
        >
          <TrendingUp className="w-7 h-7 text-[#5b32f6]" strokeWidth={2.5} />
          <h1 className="text-2xl font-bold tracking-tight text-[#5b32f6]">
            TradeEdge
          </h1>
        </div>
        
        {/* Account Selector */}
        <button className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:border-slate-700 px-3 py-2 rounded-lg transition-colors">
          <div className="flex flex-col items-start gap-0.5 max-w-[80%]">
             <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Trading Account</span>
             <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate w-full">{profile?.name || profile?.email || 'Logged Out'}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabSelect(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
              currentTab === item.id 
                ? "bg-slate-100 dark:bg-slate-800 text-[#5b32f6] shadow-xs border border-slate-300 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-800 dark:text-slate-200 border border-transparent"
            )}
          >
            <item.icon className={cn("w-5 h-5", currentTab === item.id ? "text-[#5b32f6]" : "text-slate-500")} />
            {item.label}
          </button>
        ))}
      </nav>
      
      {/* 14 Day Free Trial Banner */}
      <div className="p-4 mx-4 mb-4 bg-gradient-to-br from-[#5b32f6]/20 to-slate-900 border border-[#5b32f6]/30 rounded-xl relative overflow-hidden group hover:border-[#5b32f6]/50 transition-colors">
         <div className="absolute top-0 right-0 w-24 h-24 bg-[#5b32f6]/20 blur-xl rounded-full"></div>
         <div className="relative z-10">
            <div className="flex items-center gap-2 text-[#5b32f6] mb-1">
               <Clock className="w-4 h-4" />
               <span className="text-xs font-bold uppercase tracking-wider">{!profile?.isTrialActive && daysLeft === 0 ? 'Trial Expired' : 'Free Trial'}</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">{daysLeft} days remaining</p>
            <div className="w-full bg-slate-50 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden mb-3">
               <div className="bg-[#5b32f6] h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Upgrade to Pro for unlimited gigabytes of cloud storage & unlimited accounts.
            </p>
            <button className="w-full bg-[#5b32f6] hover:bg-[#4a26d7] text-white font-bold py-2 rounded-lg text-xs transition-colors">
               Upgrade Plan
            </button>
         </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center gap-2">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors py-1 px-2 hover:bg-red-500/10 rounded-md"
          title="Sign out"
        >
          <LogOut className="w-3 h-3" /> Logout
        </button>
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200 transition-colors py-1"
            title="Back to website"
          >
            <ArrowLeft className="w-3 h-3" /> Back
          </button>
        )}
      </div>
    </aside>
  );
}
