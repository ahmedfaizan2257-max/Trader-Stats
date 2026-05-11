import { Briefcase, LayoutDashboard, LineChart, MessageSquare, BookOpen, ChevronDown, ChevronRight, Clock, ArrowLeft, Link2, TrendingUp, Calendar as CalendarIcon, Target, Wallet, DollarSign, Paintbrush, Share2, List, GraduationCap, Settings, BarChart3, SquarePen, Zap, ClipboardList, Share, Sparkles } from 'lucide-react';
import { Tab } from '../../types';
import { cn } from '../../lib/utils';

import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

export function Sidebar({ currentTab, onTabSelect, onBack }: { currentTab: Tab, onTabSelect: (val: Tab) => void, onBack?: () => void }) {
  const { logout } = useAuth();
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'accounts', label: 'Accounts', icon: Wallet },
    { id: 'journal', label: 'Journal', icon: SquarePen },
    { id: 'payouts', label: 'Payouts', icon: DollarSign },
    { id: 'customizer', label: 'Customizer', icon: Zap },
    { id: 'sharing', label: 'Sharing', icon: Share },
    { id: 'log', label: 'Trade Log', icon: ClipboardList },
    { id: 'feedback', label: 'AI Feedback', icon: Sparkles },
    { id: 'student-dashboard', label: 'Student Dashboard', icon: GraduationCap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

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
          <div className="flex flex-col items-start gap-0.5">
             <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Trading Account</span>
             <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Main Futures (NQ)</span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabSelect(item.id)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
              currentTab === item.id 
                ? "bg-slate-100 dark:bg-slate-800 text-[#5b32f6] shadow-xs border border-slate-300 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-800 dark:text-slate-200 border border-transparent"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn("w-5 h-5", currentTab === item.id ? "text-[#5b32f6]" : "text-slate-500")} />
              {item.label}
            </div>
            {item.id === 'settings' && <ChevronRight className="w-4 h-4" />}
          </button>
        ))}
      </nav>
      
      {/* 14 Day Free Trial Banner */}
      <div className="p-4 mx-4 mb-4 bg-gradient-to-br from-[#5b32f6]/20 to-slate-900 border border-[#5b32f6]/30 rounded-xl relative overflow-hidden group cursor-pointer hover:border-[#5b32f6]/50 transition-colors">
         <div className="absolute top-0 right-0 w-24 h-24 bg-[#5b32f6]/20 blur-xl rounded-full"></div>
         <div className="relative z-10">
            <div className="flex items-center gap-2 text-[#5b32f6] mb-1">
               <Clock className="w-4 h-4" />
               <span className="text-xs font-bold uppercase tracking-wider">Free Trial</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">14 days remaining</p>
            <div className="w-full bg-slate-50 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden mb-3">
               <div className="bg-[#5b32f6] w-1/12 h-full rounded-full"></div>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Upgrade to Pro for unlimited gigabytes of cloud storage & unlimited accounts.
            </p>
            <button className="w-full bg-[#5b32f6] hover:bg-[#4a26d7] text-white font-bold py-2 rounded-lg text-xs transition-colors">
               Upgrade Plan
            </button>
         </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
        <button 
          onClick={async () => {
             try {
               await logout();
               if (onBack) onBack();
             } catch (error) {
               console.error("Logout error", error);
             }
          }}
          className="flex items-center justify-center gap-2 w-full py-2 bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-900/40 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg text-sm font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
        <div className="flex justify-between items-center px-1">
          <p className="text-[10px] text-slate-500 font-mono">v1.0.0-beta</p>
          {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Home
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
