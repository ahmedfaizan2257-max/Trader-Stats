import { useState, useEffect } from 'react';
import { TradeProvider } from './context/TradeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { Calendar } from './components/calendar/Calendar';
import { TradeLog } from './components/tradelog/TradeLog';
import { AIFeedback } from './components/feedback/AIFeedback';
import { Journal } from './components/journal/Journal';
import { Analytics } from './components/analytics/Analytics';
import { Integrations } from './components/integrations/Integrations';
import { Goals } from './components/goals/Goals';
import { Accounts } from './components/accounts/Accounts';
import { Payouts } from './components/payouts/Payouts';
import { Customizer } from './components/customizer/Customizer';
import { Sharing } from './components/sharing/Sharing';
import { StudentDashboard } from './components/studentDashboard/StudentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Settings } from './components/settings/Settings';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { PaymentPage } from './components/auth/PaymentPage';
import { MockOAuthPage } from './components/integrations/MockOAuthPage';
import { Tab } from './types';
import { Menu, X, TrendingUp, EyeOff } from 'lucide-react';
import { ThemeProvider } from './components/ThemeProvider';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';

export default function App() {
  const { user, loading, viewingUserId, setViewingUserId } = useAuth();
  const [appMode, setAppMode] = useState<'landing' | 'app' | 'login'>('landing');
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mockOAuthPlatform, setMockOAuthPlatform] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const platform = urlParams.get('mock_oauth');
    if (platform) {
      setMockOAuthPlatform(platform);
    }
    if (urlParams.get('oauth_callback')) {
      setCurrentTab('integrations');
    }
  }, []);

  useEffect(() => {
    if (user) {
      const paidStr = localStorage.getItem(`hasPaid_${user.uid}`);
      if (paidStr === 'true') {
        setHasPaid(true);
      } else {
        setHasPaid(false);
      }
    }
  }, [user]);

  const handleOAuthComplete = (code: string) => {
    // Redirect back to app with code
    window.location.href = `/?oauth_callback=${mockOAuthPlatform}&code=${code}`;
  };

  const handleOAuthCancel = () => {
    window.location.href = `/`;
  };

  useEffect(() => {
    if (loading) return;
    if (user) {
      // Check trial
      const creationTime = user.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date();
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - creationTime.getTime()) / (1000 * 60 * 60 * 24));
      
      // If we are currently handling a signup, we don't automatically go into app
      if (appMode === 'login' && sessionStorage.getItem('isSigningUp') === 'true') {
          return; // Stay on login screen to show "successfully signed up"
      }
      
      setAppMode('app');
      
      if (diffDays > 14 && !hasPaid) {
         setShowPayment(true);
      } else {
         setShowPayment(false);
      }
    }
  }, [user, loading, appMode, hasPaid]);

  if (mockOAuthPlatform) {
    return (
      <ThemeProvider defaultTheme="dark">
        <Toaster theme="dark" position="top-right" />
        <MockOAuthPage platform={mockOAuthPlatform} onComplete={handleOAuthComplete} onCancel={handleOAuthCancel} />
      </ThemeProvider>
    );
  }

  if (loading) {
     return <div className="min-h-screen bg-[#000000] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-[#5b32f6] border-t-transparent animate-spin"></div></div>;
  }

  if (appMode === 'login' && !user) {
    return (
      <ThemeProvider defaultTheme="dark">
        <Toaster theme="dark" position="top-right" />
        <LoginPage onBack={() => setAppMode('landing')} />
      </ThemeProvider>
    );
  }

  if (appMode === 'landing' || !user) {
    return (
      <ThemeProvider defaultTheme="dark">
        <LandingPage onEnter={() => { if (user) setAppMode('app'); else setAppMode('login'); }} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark">
      <TradeProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-[#5b32f6]/30 selection:text-[#5b32f6]">
        <Toaster theme="dark" position="top-right" />
        
        <div className="hidden md:flex">
          <Sidebar currentTab={currentTab} onTabSelect={setCurrentTab} onBack={() => setAppMode('landing')} />
        </div>
        
        {mobileMenuOpen && (
           <div className="md:hidden absolute inset-0 z-50 flex">
             <div className="flex-1 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
             <div className="absolute left-0 top-0 bottom-0 max-w-[280px] w-full flex bg-white dark:bg-[#09090b]">
               <Sidebar currentTab={currentTab} onTabSelect={(t: Tab) => { setCurrentTab(t); setMobileMenuOpen(false); }} onBack={() => setAppMode('landing')} />
             </div>
             <button onClick={() => setMobileMenuOpen(false)} className="absolute top-4 right-4 p-2 text-slate-600 dark:text-slate-400 bg-white dark:bg-transparent rounded-full shadow-md dark:shadow-none">
               <X />
             </button>
           </div>
        )}

        <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-[#0a0f18] p-4 md:p-8 relative">
          {viewingUserId && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in duration-300">
               <div className="flex items-center gap-2">
                 <EyeOff className="w-5 h-5" />
                 <span className="font-semibold text-sm">Viewing as User ID: <span className="font-mono text-rose-400">{viewingUserId}</span></span>
               </div>
               <button 
                 onClick={() => {
                   setViewingUserId(null);
                   setCurrentTab('admin');
                 }}
                 className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
               >
                 Stop Viewing
               </button>
            </div>
          )}

          <div className="md:hidden flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAppMode('landing')}>
              <TrendingUp className="w-6 h-6 text-[#5b32f6]" strokeWidth={2.5} />
              <h1 className="text-xl font-bold tracking-tight text-[#5b32f6]">
                TradeEdge
              </h1>
            </div>
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-400 hover:text-slate-100">
               <Menu />
            </button>
          </div>
          
          <div className="max-w-7xl mx-auto pb-24">
            {!hasPaid && user && (
              <div className="w-full flex items-center justify-center gap-2 mb-8 text-sm text-slate-600 dark:text-slate-300">
                 <span className="text-lg">🏳️</span> 
                 You have {Math.max(0, 14 - Math.floor((new Date().getTime() - new Date(user.metadata.creationTime || new Date()).getTime()) / (1000 * 60 * 60 * 24)))} days left of your free trial
                 <button onClick={() => setShowPayment(true)} className="text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-wide transition-colors">Subscribe Now</button>
              </div>
            )}
            
            {showPayment && (
              <PaymentPage onPay={() => {
                localStorage.setItem(`hasPaid_${user?.uid}`, 'true');
                setHasPaid(true);
                setShowPayment(false);
              }} />
            )}

            {currentTab === 'dashboard' && <Dashboard />}
            {currentTab === 'log' && <TradeLog />}
            {currentTab === 'goals' && <Goals />}
            {currentTab === 'calendar' && <Calendar />}
            {currentTab === 'feedback' && <AIFeedback />}
            {currentTab === 'journal' && <Journal />}
            {currentTab === 'analytics' && <Analytics />}
            {currentTab === 'integrations' && <Integrations />}
            {currentTab === 'accounts' && <Accounts />}
            {currentTab === 'payouts' && <Payouts />}
            {currentTab === 'customizer' && <Customizer />}
            {currentTab === 'sharing' && <Sharing />}
            {currentTab === 'student-dashboard' && <StudentDashboard />}
            {currentTab === 'admin' && <AdminDashboard onTabSelect={setCurrentTab} />}
            {currentTab === 'settings' && <Settings />}
          </div>
        </main>
      </div>
    </TradeProvider>
    </ThemeProvider>
  );
}
