import { Briefcase, LayoutDashboard, LineChart, MessageSquare, BookOpen, ChevronDown, ChevronRight, Clock, ArrowLeft, Link2, TrendingUp, Calendar as CalendarIcon, Target, Wallet, DollarSign, Paintbrush, Share2, List, GraduationCap, Settings, BarChart3, SquarePen, Zap, ClipboardList, Share, Sparkles, Shield, Sun, Moon, Bot } from 'lucide-react';
import { Tab } from '../../types';
import { cn } from '../../lib/utils';
import { useTheme } from '../ThemeProvider';

import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

export function Sidebar({ currentTab, onTabSelect, onBack }: { currentTab: Tab, onTabSelect: (val: Tab) => void, onBack?: () => void }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'trade-with-us', label: 'Trade With Us', icon: Bot },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'accounts', label: 'Accounts', icon: Wallet },
    { id: 'journal', label: 'Journal', icon: SquarePen },
    { id: 'payouts', label: 'Payouts', icon: DollarSign },
    { id: 'log', label: 'Trade Log', icon: ClipboardList },
    { id: 'feedback', label: 'AI Feedback', icon: Sparkles },
    { id: 'customizer', label: 'Customizer', icon: Zap },
    { id: 'sharing', label: 'Sharing', icon: Share },
    { id: 'student-dashboard', label: 'Student Dashboard', icon: GraduationCap },
    ...(user?.email === 'ahmedfaizan2257@gmail.com' ? [{ id: 'admin', label: 'Admin Dashboard', icon: Shield }] : []),
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
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center justify-center gap-2 w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
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
