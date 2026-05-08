import { useState } from 'react';
import { TradeProvider } from './context/TradeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { TradeLog } from './components/tradelog/TradeLog';
import { AIFeedback } from './components/feedback/AIFeedback';
import { Journal } from './components/journal/Journal';
import { Analytics } from './components/analytics/Analytics';
import { Integrations } from './components/integrations/Integrations';
import { LandingPage } from './components/landing/LandingPage';
import { Tab } from './types';
import { Menu, X, Hexagon } from 'lucide-react';

export default function App() {
  const [appMode, setAppMode] = useState<'landing' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (appMode === 'landing') {
    return <LandingPage onEnter={() => setAppMode('app')} />;
  }

  return (
    <TradeProvider>
      <div className="flex h-screen overflow-hidden bg-slate-950 font-sans selection:bg-[#5b32f6]/30 selection:text-[#5b32f6]">
        
        <div className="hidden md:flex">
          <Sidebar currentTab={currentTab} onTabSelect={setCurrentTab} onBack={() => setAppMode('landing')} />
        </div>
        
        {mobileMenuOpen && (
           <div className="md:hidden absolute inset-0 z-50 flex">
             <div className="flex-1 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
             <div className="absolute left-0 top-0 bottom-0 max-w-[280px] w-full flex">
               <Sidebar currentTab={currentTab} onTabSelect={(t: Tab) => { setCurrentTab(t); setMobileMenuOpen(false); }} onBack={() => setAppMode('landing')} />
             </div>
             <button onClick={() => setMobileMenuOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400">
               <X />
             </button>
           </div>
        )}

        <main className="flex-1 overflow-y-auto bg-[#0a0f18] p-4 md:p-8 relative">
          <div className="md:hidden flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAppMode('landing')}>
              <Hexagon className="w-6 h-6 text-[#5b32f6]" strokeWidth={2.5} />
              <h1 className="text-xl font-bold tracking-tight text-[#5b32f6]">
                TradeEdge
              </h1>
            </div>
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-400 hover:text-slate-100">
               <Menu />
            </button>
          </div>
          
          <div className="max-w-7xl mx-auto pb-24">
            {currentTab === 'dashboard' && <Dashboard />}
            {currentTab === 'log' && <TradeLog />}
            {currentTab === 'feedback' && <AIFeedback />}
            {currentTab === 'journal' && <Journal />}
            {currentTab === 'analytics' && <Analytics />}
            {currentTab === 'integrations' && <Integrations />}
          </div>
        </main>
      </div>
    </TradeProvider>
  );
}
