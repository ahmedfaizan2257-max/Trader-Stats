import { ArrowRight, BarChart3, Brain, Calendar, CheckCircle2, ChevronRight, LineChart, Shield, Zap, Star, Menu, Twitter, BookOpen, Hexagon } from 'lucide-react';
import { useState } from 'react';
import { PlatformsPage } from './PlatformsPage';
import { LeaderboardPage } from './LeaderboardPage';
import { BlogPage } from './BlogPage';
import { LoginPage } from './LoginPage';

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState<'home' | 'platforms' | 'leaderboard' | 'blog' | 'login'>('home');

  const handleNav = (page: 'home' | 'platforms' | 'leaderboard' | 'blog' | 'login', sectionId?: string) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    if (sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-200 font-sans selection:bg-[#5b32f6]/30 overflow-x-hidden flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#000000] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav('home')}>
            <Hexagon className="w-7 h-7 text-[#5b32f6]" strokeWidth={2.5} />
            <span className="text-2xl font-bold tracking-tight text-[#5b32f6]">
              TradeEdge
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNav('home', 'features')} className="text-sm font-bold text-white uppercase tracking-widest hover:text-[#5b32f6] transition-colors">BENEFITS</button>
            <button onClick={() => handleNav('home', 'pricing')} className="text-sm font-bold text-white uppercase tracking-widest hover:text-[#5b32f6] transition-colors">PRICING</button>
            <button onClick={() => handleNav('platforms')} className="text-sm font-bold text-white uppercase tracking-widest hover:text-[#5b32f6] transition-colors">PLATFORMS</button>
            <button onClick={() => handleNav('leaderboard')} className="text-sm font-bold text-white uppercase tracking-widest hover:text-[#5b32f6] transition-colors">LEADERBOARD</button>
            <button onClick={() => handleNav('blog')} className="text-sm font-bold text-white uppercase tracking-widest hover:text-[#5b32f6] transition-colors">BLOG</button>
            <button onClick={() => handleNav('login')} className="text-sm font-bold text-white uppercase tracking-widest hover:text-[#5b32f6] transition-colors">LOGIN</button>
            <button onClick={onEnter} className="bg-[#4D33FF] hover:bg-[#3E25EA] text-white px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-colors ml-2">
              START IMPROVING
            </button>
          </div>

          <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#09090b] border-b border-white/5 py-4 px-6 flex flex-col gap-4">
            <button onClick={() => handleNav('home', 'features')} className="text-left text-sm font-bold text-white uppercase tracking-widest">BENEFITS</button>
            <button onClick={() => handleNav('home', 'pricing')} className="text-left text-sm font-bold text-white uppercase tracking-widest">PRICING</button>
            <button onClick={() => handleNav('platforms')} className="text-left text-sm font-bold text-white uppercase tracking-widest">PLATFORMS</button>
            <button onClick={() => handleNav('leaderboard')} className="text-left text-sm font-bold text-white uppercase tracking-widest">LEADERBOARD</button>
            <button onClick={() => handleNav('blog')} className="text-left text-sm font-bold text-white uppercase tracking-widest">BLOG</button>
            <button onClick={() => handleNav('login')} className="text-left text-sm font-bold text-white uppercase tracking-widest">LOGIN</button>
          </div>
        )}
      </nav>

      {/* Pages Router component */}
      <div className="flex-1">
        {activePage === 'home' && <HomeContent onEnter={onEnter} />}
        {activePage === 'platforms' && <PlatformsPage />}
        {activePage === 'leaderboard' && <LeaderboardPage />}
        {activePage === 'blog' && <BlogPage />}
        {activePage === 'login' && <LoginPage onEnter={onEnter} />}
      </div>

      {/* Footer */}
      <footer className="bg-[#000000] border-t border-slate-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Hexagon className="w-6 h-6 text-[#5b32f6]" strokeWidth={2.5} />
              <span className="text-xl font-bold tracking-tight text-[#5b32f6]">
                TradeEdge
              </span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6">
              The ultimate trading journal and analytics platform. Built by traders, for traders. Use our AI to find your edge and stop bleeding money.
            </p>
            <div className="flex gap-4 text-slate-500">
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => handleNav('home', 'features')} className="hover:text-[#5b32f6] transition-colors">Features</button></li>
              <li><button onClick={() => handleNav('home', 'pricing')} className="hover:text-[#5b32f6] transition-colors">Pricing</button></li>
              <li><button onClick={() => handleNav('platforms')} className="hover:text-[#5b32f6] transition-colors">Supported Brokers</button></li>
              <li><button onClick={() => handleNav('leaderboard')} className="hover:text-[#5b32f6] transition-colors">Leaderboard</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => handleNav('blog')} className="hover:text-[#5b32f6] transition-colors">Blog</button></li>
              <li><a href="#" className="hover:text-[#5b32f6] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#5b32f6] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#5b32f6] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-900 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>
            © 2026 TradeEdge. All rights reserved. 
            <span className="mx-2">|</span> 
            Developed by <a href="https://godesign.pk" target="_blank" rel="noreferrer" className="hover:text-[#5b32f6] transition-colors">GoDesign Technologies LLP</a>
          </p>
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#5b32f6]"></div> System Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// -------------------------------------------------------------------------------------------------
// HomeContent: The main landing page blocks
// -------------------------------------------------------------------------------------------------
function HomeContent({ onEnter }: { onEnter: () => void }) {
  return (
    <>
      <section className="pt-32 lg:pt-48 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5b32f6]/10 border border-[#5b32f6]/30 text-[#5b32f6] text-sm font-semibold tracking-wide">
            <Zap className="w-4 h-4" /> 
            <span>Now with AI Trade Feedback</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Find Your <span className="text-[#5b32f6]">Edge</span>.<br />
            Stop <span className="text-slate-500 line-through">Losing</span>.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Automatically track your trades, view performance heatmaps, and get 
            personalized AI coaching to eliminate your emotional mistakes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button 
              onClick={onEnter}
              className="w-full sm:w-auto px-8 py-4 bg-[#5b32f6] hover:bg-[#4a26d7] text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(91,50,246,0.3)] transition-all flex items-center justify-center gap-2"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
              View Demo
            </button>
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 pt-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#000000] bg-slate-800"></div>
              ))}
            </div>
            <p>Join <strong className="text-white">10,000+</strong> funded traders</p>
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <div className="absolute inset-0 bg-[#5b32f6]/10 blur-3xl rounded-full"></div>
          <div className="relative border border-slate-800 rounded-2xl bg-[#09090b] shadow-2xl p-2 lg:p-4 overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-all duration-500">
            {/* Mock Dashboard Image */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <LineChart className="w-64 h-64 text-[#5b32f6]" />
            </div>
            <div className="border border-slate-800 bg-[#18181b] rounded-xl p-4 md:p-6 space-y-6 relative z-10">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div>
                  <p className="text-slate-400 text-sm">Total Net PNL</p>
                  <p className="text-3xl font-bold text-emerald-400">+$12,450.00</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm">Win Rate</p>
                  <p className="text-2xl font-bold text-white">68.4%</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#09090b] rounded-lg p-4 border border-slate-800">
                  <p className="text-slate-500 text-xs mb-1">Profit Factor</p>
                  <p className="text-xl font-bold text-white">2.4</p>
                </div>
                <div className="bg-[#09090b] rounded-lg p-4 border border-slate-800">
                  <p className="text-slate-500 text-xs mb-1">Avg Win / Loss</p>
                  <p className="text-xl font-bold text-emerald-400">1.8R</p>
                </div>
              </div>
              <div className="h-40 bg-[#09090b] rounded-lg border border-slate-800 flex items-end p-4 gap-2">
                 {/* Fake bars */}
                 {[40, 60, 20, 80, 50, 90, 70].map((h, i) => (
                   <div key={i} className={`flex-1 rounded-t-sm ${i === 2 ? 'bg-red-500/50' : 'bg-[#5b32f6]/50'}`} style={{ height: `${h}%` }}></div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-[#09090b] border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-[#5b32f6] font-bold tracking-wide uppercase text-sm mb-3">Core Features</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Built for consistency.</h3>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Stop guessing what you're doing wrong. We automatically identify your bad habits so you can fix them.</p>
          </div>

          <div className="space-y-32">
            <FeatureSection 
              title="Get AI Feedback"
              description="Our advanced AI model analyzes your trading patterns, highlights your mistakes, and provides actionable advice to stop the bleeding and maximize your winners."
              icon={<Brain className="w-6 h-6 text-[#5b32f6]" />}
              imageUrl="https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              reverse={false}
            />

            <FeatureSection 
              title="Track Your Performance"
              description="Visualize your progress with interactive equity curves, heatmaps, and detailed metrics breaking down your win rate, risk-reward ratio, and P&L by day of the week."
              icon={<BarChart3 className="w-6 h-6 text-[#5b32f6]" />}
              imageUrl="https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              reverse={true}
            />

            <FeatureSection 
              title="Review your trades with TradingView"
              description="We embed rich TradingView charts directly into your trade log. No more switching tabs. See exactly where you entered and exited on the chart."
              icon={<LineChart className="w-6 h-6 text-[#5b32f6]" />}
              imageUrl="https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              reverse={false}
            />

            <FeatureSection 
              title="Write in your journal"
              description="Keep yourself accountable. Track your emotional state, log your setups, and make sure you are sticking to your rules."
              icon={<BookOpen className="w-6 h-6 text-[#5b32f6]" />}
              imageUrl="https://images.pexels.com/photos/187041/pexels-photo-187041.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              reverse={true}
            />
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 border-t border-slate-900 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-[#5b32f6] font-bold tracking-wide uppercase text-sm mb-3">Pricing</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple, transparent pricing.</h3>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Start for free. Upgrade when you need more power.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-[#09090b] border border-slate-800 rounded-3xl p-8 lg:p-12 hover:border-[#5b32f6]/30 transition-colors">
              <h4 className="text-2xl font-bold text-white mb-2">Basic</h4>
              <p className="text-slate-400 mb-6">For beginners just starting out.</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">$0</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> Up to 50 trades / month</li>
                <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> Basic Dashboard Stats</li>
                <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> CSV Imports</li>
              </ul>
              <button onClick={onEnter} className="w-full py-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors">
                Start Free
              </button>
            </div>

            <div className="bg-[#18181b] border-2 border-[#5b32f6] rounded-3xl p-8 lg:p-12 relative shadow-[0_0_40px_rgba(91,50,246,0.1)]">
              <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <span className="bg-[#5b32f6] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Pro</h4>
              <p className="text-slate-400 mb-6">For serious funded and retail traders.</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">$24</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> Unlimited Trading Logs</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> AI Trading Coach & Insights</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> TradingView Chart Integration</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> Advanced Analytics & Heatmaps</li>
                <li className="flex items-center gap-3 text-white"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> Auto-sync with 15+ Brokers</li>
              </ul>
              <button onClick={onEnter} className="w-full py-4 rounded-xl bg-[#5b32f6] hover:bg-[#4a26d7] text-white font-bold transition-all shadow-[0_0_20px_rgba(91,50,246,0.3)]">
                Start 14-Day Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-[#09090b] to-[#000000] border-t border-slate-900 border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-[#5b32f6]/5 blur-[100px] rounded-full transform translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Stop guessing. Start tracking.</h3>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join thousands of traders who have found their consistency with TradeEdge. 
            No credit card required for the 14-day trial.
          </p>
          <button onClick={onEnter} className="px-10 py-5 bg-[#5b32f6] hover:bg-[#4a26d7] text-white rounded-2xl font-bold text-xl shadow-[0_0_30px_rgba(91,50,246,0.4)] transition-all flex items-center justify-center gap-3 mx-auto">
            Create Your Account <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>
    </>
  );
}

// -------------------------------------------------------------------------------------------------
// Helper components
// -------------------------------------------------------------------------------------------------
function FeatureSection({ title, description, icon, imageUrl, reverse }: { title: string, description: string, icon: React.ReactNode, imageUrl?: string, reverse: boolean }) {
  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-24`}>
      <div className="flex-1 space-y-6">
        <div className="w-12 h-12 bg-[#18181b] border border-slate-800 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <h4 className="text-3xl font-bold text-white">{title}</h4>
        <p className="text-lg text-slate-400 leading-relaxed">{description}</p>
        <ul className="space-y-3 pt-4">
          {[1,2,3].map(i => (
             <li key={i} className="flex items-center gap-3 text-slate-300">
               <CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> 
               {i === 1 && "Seamless integration"}
               {i === 2 && "Automated reports"}
               {i === 3 && "Real-time updates"}
             </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 w-full">
        <div className="aspect-square md:aspect-video bg-[#09090b] rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden group">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#5b32f6]/5 to-transparent transition-opacity group-hover:opacity-100 opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-105 transition-transform duration-700">
                 {title.includes('AI') && <Brain className="w-32 h-32 text-[#5b32f6]" />}
                 {title.includes('Track') && <BarChart3 className="w-32 h-32 text-[#5b32f6]" />}
                 {title.includes('TradingView') && <LineChart className="w-32 h-32 text-[#5b32f6]" />}
                 {title.includes('journal') && <Calendar className="w-32 h-32 text-[#5b32f6]" />}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
