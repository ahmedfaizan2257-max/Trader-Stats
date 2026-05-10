import { ArrowRight, BarChart3, Brain, Calendar, CheckCircle2, ChevronRight, LineChart, Shield, Zap, Star, Menu, Twitter, BookOpen, TrendingUp, Check, Play, ChevronDown, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { PlatformsPage } from './PlatformsPage';
import { LeaderboardPage } from './LeaderboardPage';
import { BlogPage } from './BlogPage';
import { LoginPage } from './LoginPage';
import { DashboardMock } from './DashboardMock';
import { useTheme } from '../ThemeProvider';
import { useAuth } from '../../context/AuthContext';

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState<'home' | 'platforms' | 'leaderboard' | 'blog' | 'login'>('home');
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

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

  const handleEnter = () => {
    if (user) {
      onEnter();
    } else {
      handleNav('login');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-slate-800 dark:text-slate-200 font-sans selection:bg-[#5b32f6]/30 overflow-x-hidden flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white dark:bg-[#000000] border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav('home')}>
            <TrendingUp className="w-7 h-7 text-[#5b32f6]" strokeWidth={2.5} />
            <span className="text-2xl font-bold tracking-tight text-[#5b32f6]">
              TradeEdge
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNav('home', 'features')} className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest hover:text-[#5b32f6] transition-colors">FEATURES</button>
            <button onClick={() => handleNav('home', 'reviews')} className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest hover:text-[#5b32f6] transition-colors">REVIEWS</button>
            <button onClick={() => handleNav('home', 'pricing')} className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest hover:text-[#5b32f6] transition-colors">PRICING</button>
            <button onClick={() => handleNav('platforms')} className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest hover:text-[#5b32f6] transition-colors">DIRECTORIES</button>
            <button onClick={() => handleNav('blog')} className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest hover:text-[#5b32f6] transition-colors">COMPANY</button>
            {user ? (
              <button onClick={onEnter} className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest hover:text-[#5b32f6] transition-colors">DASHBOARD</button>
            ) : (
              <button onClick={() => handleNav('login')} className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest hover:text-[#5b32f6] transition-colors">LOGIN</button>
            )}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden lg:block"></div>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => handleNav('login', 'signup')} className="bg-[#5b32f6] hover:bg-[#4a26d7] text-white px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-colors ml-2">
              START IMPROVING
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="text-slate-700 dark:text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-50 dark:bg-[#09090b] border-b border-black/5 dark:border-white/5 py-4 px-6 flex flex-col gap-4">
            <button onClick={() => handleNav('home', 'features')} className="text-left text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">FEATURES</button>
            <button onClick={() => handleNav('home', 'reviews')} className="text-left text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">REVIEWS</button>
            <button onClick={() => handleNav('home', 'pricing')} className="text-left text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">PRICING</button>
            <button onClick={() => handleNav('platforms')} className="text-left text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">DIRECTORIES</button>
            <button onClick={() => handleNav('blog')} className="text-left text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">COMPANY</button>
            <button onClick={() => handleNav('login')} className="text-left text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">LOGIN</button>
          </div>
        )}
      </nav>

      {/* Pages Router component */}
      <div className="flex-1">
        {activePage === 'home' && <HomeContent onEnter={handleEnter} />}
        {activePage === 'platforms' && <PlatformsPage />}
        {activePage === 'leaderboard' && <LeaderboardPage />}
        {activePage === 'blog' && <BlogPage />}
        {activePage === 'login' && <LoginPage onEnter={onEnter} />}
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#000000] border-t border-slate-300 dark:border-slate-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-[#5b32f6]" strokeWidth={2.5} />
              <span className="text-xl font-bold tracking-tight text-[#5b32f6]">
                TradeEdge
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-6">
              The ultimate trading journal and analytics platform. Built by traders, for traders. Use our AI to find your edge and stop bleeding money.
            </p>
            <div className="flex gap-4 text-slate-500">
              <a href="#" className="hover:text-slate-900 dark:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-slate-900 dark:text-white transition-colors">Discord</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li><button onClick={() => handleNav('home', 'features')} className="hover:text-[#5b32f6] transition-colors">Features</button></li>
              <li><button onClick={() => handleNav('home', 'pricing')} className="hover:text-[#5b32f6] transition-colors">Pricing</button></li>
              <li><button onClick={() => handleNav('platforms')} className="hover:text-[#5b32f6] transition-colors">Supported Brokers</button></li>
              <li><button onClick={() => handleNav('leaderboard')} className="hover:text-[#5b32f6] transition-colors">Leaderboard</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li><button onClick={() => handleNav('blog')} className="hover:text-[#5b32f6] transition-colors">Blog</button></li>
              <li><a href="#" className="hover:text-[#5b32f6] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#5b32f6] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#5b32f6] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-300 dark:border-slate-900 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
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

const fadeUpOpts = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" as const }
};

const staggerOpts = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "-100px" },
  variants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
};

const childFadeUpOpts = {
  variants: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }
};

function HomeContent({ onEnter }: { onEnter: () => void }) {
  return (
    <>
      <section className="pt-32 lg:pt-40 pb-20 px-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <motion.div 
          className="flex-1 w-full text-center lg:text-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-[4rem] lg:text-[5rem] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Take <span className="text-emerald-600 dark:text-[#00FC9E]">Control</span> of Your<br />
            Trading.
          </h1>
          <p className="text-xl md:text-2xl text-slate-800 dark:text-slate-200 max-w-[600px] mx-auto lg:mx-0 leading-normal mt-8">
            Traderstats helps you track, analyze, and improve your trading performance.
          </p>
          
          <ul className="mt-12 space-y-7 text-left max-w-[600px] mx-auto lg:mx-0">
            {[
              "Track trades from unlimited accounts",
              "Supports all major futures prop firm trading platforms",
              "See all your trades plotted in TradingView for easy review",
              "Easy trade journaling and detailed performance metrics",
              "Share your trades and performance calendar with your community and friends"
            ].map((text, i) => (
              <motion.li 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                className="flex items-start gap-4"
              >
                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded bg-[#00FC9E] flex items-center justify-center">
                  <Check className="w-5 h-5 text-slate-900 dark:text-white" strokeWidth={3} />
                </div>
                <span className="text-[1.15rem] leading-snug md:text-xl text-slate-900 dark:text-white font-medium">{text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div 
          className="flex-1 w-full mt-16 lg:mt-0 relative pl-0 lg:pl-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {/* Gradient Border Wrapping */}
          <div className="relative p-1.5 rounded-2xl bg-gradient-to-tr from-[#00FC9E] via-[#855DFF] to-[#60A5FA] transform lg:scale-[1.05] xl:scale-[1.1] origin-left shadow-[0_0_40px_rgba(91,50,246,0.5)]">
            <div className="relative rounded-xl overflow-hidden bg-white dark:bg-[#000000]">
              <DashboardMock variant="hero" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Supported Platforms Marquee */}
      <section className="py-12 border-t border-b border-black/5 dark:border-white/5 bg-slate-100 dark:bg-[#050505] overflow-hidden whitespace-nowrap">
        <div className="relative w-full flex items-center h-20">
          <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-[#000000] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-[#000000] to-transparent z-10 pointer-events-none"></div>
          
          <motion.div 
            className="flex items-center gap-32 shrink-0"
            animate={{ x: [0, -1920] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {/* Double the logos to ensure seamless looping */}
            {[...Array(2)].map((_, groupIdx) => (
              <div key={groupIdx} className="flex items-center gap-32 shrink-0 pr-32">
                <div className="flex items-center gap-2 transition-all hover:opacity-80 cursor-default">
                  <div className="text-[#3b82f6]"><TrendingUp className="fill-current w-8 h-8" /></div>
                  <span className="text-slate-900 dark:text-white font-bold text-2xl tracking-tight">tradovate</span>
                </div>
                <div className="flex items-center gap-2 transition-all hover:opacity-80 cursor-default">
                  <span className="text-[#FF4F00] font-bold text-3xl tracking-widest">NINJATRADER</span>
                </div>
                <div className="flex items-center justify-center transition-all hover:opacity-80 cursor-default">
                  <span className="relative text-slate-900 dark:text-white font-black italic text-3xl flex items-center justify-center w-12 h-12">
                    <span className="absolute w-full h-[2px] bg-[#F5DB31] rotate-45 transform -translate-y-0.5"></span>
                    <span className="absolute w-full h-[2px] bg-white -rotate-45 transform -translate-y-0.5"></span>
                  </span>
                </div>
                <div className="flex items-center gap-1 transition-all hover:opacity-80 cursor-default">
                  <span className="text-[#9EFF00] font-black text-3xl tracking-tight">TOPSTEP</span>
                  <span className="bg-[#9EFF00] text-black font-black text-xl px-2 py-1">X</span>
                </div>
                <div className="flex items-center gap-2 transition-all hover:opacity-80 cursor-default">
                  <div className="text-[#FF3366]"><Zap className="fill-current w-8 h-8" /></div>
                  <span className="text-slate-900 dark:text-white font-bold text-2xl tracking-tight">TradeLocker</span>
                </div>
                <div className="flex items-center gap-2 transition-all hover:opacity-80 cursor-default">
                  <span className="text-[#00E599] font-black text-3xl tracking-tight">RITHMIC</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-24 bg-slate-50 dark:bg-[#09090b] border-t border-slate-300 dark:border-slate-900">
        <motion.div {...fadeUpOpts} className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-[#5b32f6] font-bold tracking-wide uppercase text-sm mb-3">Powerful Features for Traders</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">All you need to improve.</h3>
          </div>

          <div className="space-y-32">
            <FeatureSection 
              title="Get AI Feedback"
              description="Learn from artificial intelligence exactly what you are doing right and what you are doing wrong. Our AI analyzes your trade history to highlight your weaknesses and find your edge."
              icon={<Brain className="w-6 h-6 text-[#5b32f6]" />}
              visual={<DashboardMock variant="feedback" />}
              reverse={false}
            />

            <FeatureSection 
              title="Track Your Performance"
              description="Get powerful insights on your trading strategy. With our advanced statistics, equity curves, calendar views, and heatmaps you will always know what is working."
              icon={<BarChart3 className="w-6 h-6 text-[#5b32f6]" />}
              visual={<DashboardMock variant="performance" />}
              reverse={true}
            />

            <FeatureSection 
              title="Review your trades with TradingView"
              description="Review your exact entry and exits visually on interactive charts right from your trading journal. Never switch contexts to see what the market was doing against your execution."
              icon={<LineChart className="w-6 h-6 text-[#5b32f6]" />}
              visual={<DashboardMock variant="chart" />}
              reverse={false}
            />

            <FeatureSection 
              title="Write in your journal"
              description="Consistency starts with accountability. Log your setups, emotional state, and rules out every single day."
              icon={<BookOpen className="w-6 h-6 text-[#5b32f6]" />}
              visual={<DashboardMock variant="journal" />}
              reverse={true}
            />
          </div>
        </motion.div>
      </section>

      <section id="reviews" className="py-24 bg-slate-50 dark:bg-[#010101] border-t border-slate-300 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUpOpts} className="text-center mb-20">
            <h2 className="text-[#5b32f6] font-bold tracking-wide uppercase text-sm mb-3">WHAT TRADERS ARE SAYING</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Don't just take our word for it.</h3>
          </motion.div>

          <motion.div {...staggerOpts} className="grid md:grid-cols-3 gap-6">
            <motion.div {...childFadeUpOpts}>
              <ReviewCard
                author="Alex Rodriguez"
                role="Funded Proprietary Trader"
                content="TradeEdge completely changed how I review my trading. Before, I was using messy spreadsheets. Now the AI points out exactly where I leak money. Highly recommend!"
                image="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                rating={5}
              />
            </motion.div>
            <motion.div {...childFadeUpOpts}>
              <ReviewCard
                author="Sarah Jenkins"
                role="Independent Day Trader"
                content="The TradingView integration is a game changer for my reviews. Being able to see my executions right on the chart without opening my broker saves me hours every weekend."
                image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                rating={5}
              />
            </motion.div>
            <motion.div {...childFadeUpOpts}>
              <ReviewCard
                author="Michael Chen"
                role="Swing Trader"
                content="Finally, a journal that isn't clunky. Fast, beautiful, and gives me exactly the metrics I need. I realized I was losing most of my profits on Thursdays and adjusted my plan."
                image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                rating={5}
              />
            </motion.div>
            <motion.div {...childFadeUpOpts}>
              <ReviewCard
                author="David Torres"
                role="Crypto Trader"
                content="I've tried almost every journaling tool out there, and TradeEdge is by far the cleanest. The setup tracking helped me figure out my most profitable edge."
                image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                rating={4}
              />
            </motion.div>
             <motion.div {...childFadeUpOpts}>
              <ReviewCard
                author="Jessica Wu"
                role="Options Trader"
                content="The risk/reward metrics and heatmaps are incredible. It visualizes my performance in a way that actually makes sense. Worth every penny."
                image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                rating={5}
              />
            </motion.div>
            <motion.div {...childFadeUpOpts}>
              <ReviewCard
                author="Kevin Patel"
                role="Forex Trader"
                content="Super clean UI. I log my trades immediately after closing them now because it's so quick. The AI insights alone have paid for my subscription ten times over."
                image="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                rating={5}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="pricing" className="py-24 border-t border-slate-300 dark:border-slate-900 bg-white dark:bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUpOpts} className="text-center mb-20">
            <h2 className="text-[#5b32f6] font-bold tracking-wide uppercase text-sm mb-3">Pricing</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Simple, transparent pricing.</h3>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Start for free. Upgrade when you need more power.</p>
          </motion.div>

          <motion.div {...staggerOpts} className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div {...childFadeUpOpts} className="bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 lg:p-12 hover:border-[#5b32f6]/30 transition-colors">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Basic</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-6">For beginners just starting out.</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">$0</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> Up to 50 trades / month</li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> Basic Dashboard Stats</li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> CSV Imports</li>
              </ul>
              <button onClick={onEnter} className="w-full py-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-900 dark:text-white font-bold transition-colors">
                Start Free
              </button>
            </motion.div>

            <motion.div {...childFadeUpOpts} className="bg-white dark:bg-[#18181b] border-2 border-[#5b32f6] rounded-3xl p-8 lg:p-12 relative shadow-[0_0_40px_rgba(91,50,246,0.1)]">
              <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <span className="bg-[#5b32f6] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pro</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-6">For serious funded and retail traders.</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">$24</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-900 dark:text-white"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> Unlimited Trading Logs</li>
                <li className="flex items-center gap-3 text-slate-900 dark:text-white"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> AI Trading Coach & Insights</li>
                <li className="flex items-center gap-3 text-slate-900 dark:text-white"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> TradingView Chart Integration</li>
                <li className="flex items-center gap-3 text-slate-900 dark:text-white"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> Advanced Analytics & Heatmaps</li>
                <li className="flex items-center gap-3 text-slate-900 dark:text-white"><CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> Auto-sync with 15+ Brokers</li>
              </ul>
              <button onClick={onEnter} className="w-full py-4 rounded-xl bg-[#5b32f6] hover:bg-[#4a26d7] text-white font-bold transition-all shadow-[0_0_20px_rgba(91,50,246,0.3)]">
                Start 14-Day Free Trial
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 dark:bg-[#09090b] border-t border-slate-300 dark:border-slate-900">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div {...fadeUpOpts} className="text-center mb-16">
            <h2 className="text-[#5b32f6] font-bold tracking-wide uppercase text-sm mb-3">FAQ</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
          </motion.div>
          <div className="space-y-4">
            <FaqItem 
              question="Does Traderstats support my prop firm?"
              answer="Yes! We seamlessly support trades exported or synced from Topstep, TradeDay, Apex Trader Funding, MyFundedFutures, and natively integrate with Tradovate, NinjaTrader, and Rithmic."
            />
            <FaqItem 
              question="Can I auto-sync my trades?"
              answer="Absolutely. You can link your supported brokerages via API or OAuth, and your trades will automatically sync to your dashboard in minutes."
            />
            <FaqItem 
              question="Is my data and broker account secure?"
              answer="Yes. We use read-only API connections. This mathematically prevents us (or anyone else) from withdrawing your funds or placing trades on your behalf. Additionally, we use bank-level encryption to store your tracking data."
            />
            <FaqItem 
              question="Do I need a credit card for the free trial?"
              answer="Nope! You can jump on our 14-day free trial of the Pro version without entering any payment info. If you choose not to upgrade, your account safely reverts to the free tier."
            />
            <FaqItem 
              question="Can I export my data later if I want to?"
              answer="Always. This is your data. You can easily export your entire trading history, analytics, and journal to a CSV file at any time."
            />
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-[#09090b] to-[#000000] border-t border-slate-300 dark:border-slate-900 border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-[#5b32f6]/5 blur-[100px] rounded-full transform translate-y-1/2"></div>
        <motion.div {...fadeUpOpts} className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">Stop guessing. Start tracking.</h3>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
            Take Control of Your Trading. Join thousands of traders tracking their edge. 
            No credit card required to start.
          </p>
          <button onClick={onEnter} className="px-10 py-5 bg-[#5b32f6] hover:bg-[#4a26d7] text-white rounded-2xl font-bold text-xl shadow-[0_0_30px_rgba(91,50,246,0.4)] transition-all flex items-center justify-center gap-3 mx-auto">
            Start improving for free <ArrowRight className="w-6 h-6" />
          </button>
        </motion.div>
      </section>
    </>
  );
}

// -------------------------------------------------------------------------------------------------
// Helper components
// -------------------------------------------------------------------------------------------------
function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={false}
      className={`border ${isOpen ? 'border-[#5b32f6]/50 bg-white dark:bg-[#18181b]' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#09090b] hover:border-slate-700'} rounded-2xl overflow-hidden transition-colors cursor-pointer`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between p-6">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white pr-4">{question}</h4>
        <ChevronDown className={`w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#5b32f6]' : ''}`} />
      </div>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-6 pb-6 text-slate-600 dark:text-slate-400">
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );
}

function FeatureSection({ title, description, icon, visual, imageUrl, reverse }: { title: string, description: string, icon: React.ReactNode, visual?: React.ReactNode, imageUrl?: string, reverse: boolean }) {
  return (
    <motion.div 
      {...fadeUpOpts}
      className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-24`}
    >
      <div className="flex-1 space-y-6">
        <div className="w-12 h-12 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <h4 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h4>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
        <ul className="space-y-3 pt-4">
          {[1,2,3].map(i => (
             <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
               <CheckCircle2 className="w-5 h-5 text-[#5b32f6]" /> 
               {i === 1 && "Seamless integration"}
               {i === 2 && "Automated reports"}
               {i === 3 && "Real-time updates"}
             </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 w-full">
        {visual ? (
           <div className="w-full relative shadow-2xl shadow-[#5b32f6]/10 transform transition-transform duration-700 hover:scale-105">
              {visual}
           </div>
        ) : (
          <div className="aspect-square md:aspect-video bg-slate-50 dark:bg-[#09090b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
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
        )}
      </div>
    </motion.div>
  );
}

function ReviewCard({ author, role, content, image, rating }: { author: string, role: string, content: string, image: string, rating: number }) {
  return (
    <div className="bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-[#5b32f6]/30 transition-colors flex flex-col justify-between">
      <div>
        <div className="flex gap-1 mb-6">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-[#5b32f6] text-[#5b32f6]" />
          ))}
        </div>
        <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-8">"{content}"</p>
      </div>
      <div className="flex items-center gap-4">
        <img src={image} alt={author} className="w-12 h-12 rounded-full object-cover border border-slate-700" referrerPolicy="no-referrer" />
        <div>
          <h5 className="font-bold text-slate-900 dark:text-white tracking-wide">{author}</h5>
          <p className="text-xs text-[#5b32f6] uppercase tracking-wider">{role}</p>
        </div>
      </div>
    </div>
  );
}
