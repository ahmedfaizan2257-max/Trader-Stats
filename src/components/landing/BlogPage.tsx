import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export function BlogPage() {
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);

  const posts = [
    { 
      title: 'Overcoming the Urge to Overtrade After a Loss', 
      date: 'May 5, 2026', 
      category: 'Psychology',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      content: `Falling into a cycle of rapid-fire orders after a painful loss is perhaps the greatest destroyer of capital. It typically occurs when an unexpected drawdown pushes you into a state of panic, prompting you to "win it back" immediately. This reaction effectively discards all rational risk management.

### Spotting the Triggers
The initial phase of controlling this habit is recognizing your internal alarm bells. Heart palpitations, intense screen staring, and switching to sub-minute timeframes are prime indicators. You lose sight of the macro structure and become hyper-fixated on micro fluctuations.

### Creating Interventions
To disrupt this destructive loop, introduce mechanical barriers. 
1. **Physical Distance:** Stepping completely away from your workstation is incredibly effective. Force a 20-minute reset block following any violation of your daily threshold.
2. **System Safeguards:** Leverage broker-side daily loss limits. When human willpower fails, let the platform's hard stops protect your equity.
3. **Reflective Logging:** Require yourself to type out your emotional state *prior* to authorizing a new order. Our logging interface deliberately demands this to instill mindfulness.

Ultimately, the charts will open again tomorrow, but your funding might not if you refuse to pause.`
    },
    { 
      title: 'Evaluating Edge: Why Accuracy is Overrated', 
      date: 'April 28, 2026', 
      category: 'Strategy',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      content: `Many market participants fixate entirely on their strike rate, chasing an impossible 80%+ accuracy model. However, an exceptionally high hit rate frequently disguises an inverted risk/reward profile. Achieving sustainable growth is perfectly viable at a 40% accuracy level if your average gain heavily outweighs your average drawdown.

### The True Metrics of Growth
Let's compare two approaches:
- **Participant X** maintains a 75% hit rate, taking $100 gains and swallowing $400 drawdowns.
- **Participant Y** holds a 35% hit rate, letting winners run to $500 while capping losses at $100.

Participant Y creates significantly more wealth with substantially less emotional baggage. Seeking the false security of a high hit rate is what often causes participants to prematurely exit winning positions.

### Prioritizing Maximum Expectancy
Rather than obsessing over percentage of wins, shift focus to your R-ratio. A setup that returns three times the risked capital is classified as a 3R opportunity. Averaging 2R per win means you solely need a 34% accuracy to hold your ground. Anything beyond that becomes pure upside.

Utilize the performance analytics in your dashboard to view your mathematical expectancy properly, not just your win percentage.`
    },
    { 
      title: 'Meet Your Automated Coaching Companion', 
      date: 'April 15, 2026', 
      category: 'Product Update',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      content: `We're excited to pull back the curtain on our newest tool: Machine Learning Mentorship. Designed utilizing top-tier language models fed with thousands of market case studies, this companion functions as your objective analytical review team.

### Operational Overview
When you document an execution—inputting your core thesis, screen captures, and psychological state—you can request an automated audit. The algorithms grade your execution against your historical baseline and proven market mechanics.

It specifically highlights:
- **Impatience:** Did you jump the gun prior to structural confirmation?
- **Exposure Mismanagement:** Was your margin usage disproportionate to your bankroll?
- **Emotional Bleed:** Identifying aggressive phrases in your notes that statistically correlate with tilting.

### The Driving Motivation
Retail participants typically flounder due to an absence of immediate, unbiased critique. Hiring professional mentorship is incredibly costly and unavailable on demand. Our digital companion remains active indefinitely, dispensing the raw objectivity needed to foster genuine discipline.`
    },
    { 
      title: 'The Danger of Constant Model Tweaking', 
      date: 'April 2, 2026', 
      category: 'Analysis',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      content: `Maintaining model continuity is the absolute pinnacle of execution. The pitfall arises when individuals alter their parameters immediately after a minor losing streak, inadvertently jumping on an endless hamster wheel of strategy hopping.

### The Flaw of the Universal Setup
You are not required to hold six separate models for disparate economic climates. You require merely ONE model that you operate without hesitation. Attempting to seamlessly juggle momentum bursts, value accumulation fades, and macroeconomic plays concurrently simply degrades your optical recognition.

### Concrete Variable Tracking
A functional model extends far beyond simple candlestick formations. It strictly mandates:
- Temporal considerations (e.g., exclusively operating during the New York open)
- Liquidity and volume depth
- Macro-trend synchronization

Disregarding a single variable means you are operating entirely outside your model. By deploying categorical filters in our app, you can pinpoint the exact permutations of your model that yield undeniable statistical advantages.`
    },
    { 
      title: 'Structuring Your Pre-Market Preparation', 
      date: 'March 18, 2026', 
      category: 'Habits',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      content: `Market speculation is an extreme cognitive sport. You must structure your operational readiness identically to an elite athlete. Passively watching charts for entirely too long simply erodes your edge.

### The Opening Bell Sequence
- **Macro Alignment:** Always inventory the daily economic releases (inflation metrics, rate decisions) first.
- **Top-Down Mapping:** Block out major institutional order blocks and liquidity sweeps well before the market opens.
- **Psychological Review:** Check your internal dashboard: Did you sleep well? Are you stressed? If your mental state is compromised, sit the session out or mandate half-sizing.

### The Closing Bell Audit
Becoming profitable happens away from the live feed. Spend an hour recording setups, transcribing your emotional journey during the hold, and watching back any recorded clips. 

Operational discipline off the desk naturally breeds financial growth on the desk.`
    },
    { 
      title: 'Automated Platform Linking Now Available', 
      date: 'March 5, 2026', 
      category: 'Product Update',
      readTime: '3 min read',
      image: 'https://images.unsplash.com/photo-1642543348781-edbce29b6348?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      content: `The development team is proud to announce native compatibility with your favorite third-party charting platforms.

### Real-Time Flow
We understand that managing manual spreadsheet uploads is a nightmare. Our enhanced API architecture allows you to bind your live or simulated accounts directly, routing your transaction history to your dashboard without lifting a finger.

### Enhanced Visual Overlays
Concurrently, we have overhauled the visualization suite. You can now overlay your localized order entries securely over higher timeframe contextual structures. Visit the connections portal inside your settings drawer to hook up your systems.`
    }
  ];

  if (selectedPostIndex !== null) {
    const post = posts[selectedPostIndex];
    return (
      <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto min-h-[80vh] flex flex-col">
        <button 
          onClick={() => setSelectedPostIndex(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-[#5b32f6] transition-colors mb-8 w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Blog</span>
        </button>
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5b32f6] px-3 py-1 bg-[#5b32f6]/10 rounded-full">{post.category}</span>
            <span className="text-sm font-medium text-slate-500">{post.date}</span>
            <span className="text-sm font-medium text-slate-500">{post.readTime}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-8">
            {post.title}
          </h1>
          <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-xl">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
          <div className="prose prose-lg dark:prose-invert prose-indigo max-w-none text-slate-700 dark:text-slate-300">
            {post.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('### ')) {
                return <h3 key={i} className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
              }
              if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
                return (
                  <ul key={i} className="list-disc pl-6 mb-6 space-y-2">
                    {paragraph.split('\n').map((item, j) => {
                      const cleanItem = item.replace(/^(-\s|\d+\.\s)/, '');
                      // basic bold replacement
                      const parts = cleanItem.split(/(\*\*.*?\*\*)/g);
                      return (
                        <li key={j}>
                          {parts.map((part, k) => 
                            part.startsWith('**') && part.endsWith('**') 
                              ? <strong key={k} className="text-slate-900 dark:text-white">{part.replace(/\*\*/g, '')}</strong>
                              : <span key={k}>{part}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                );
              }
              return <p key={i} className="mb-6 leading-relaxed">{paragraph}</p>;
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-[80vh] flex flex-col items-center">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">TradeEdge <span className="text-[#5b32f6]">Blog</span>.</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Insights, strategies, and updates to help you find your edge and improve your execution.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {posts.map((post, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedPostIndex(i)}
            className="bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-[#5b32f6]/50 transition-colors flex flex-col group cursor-pointer"
          >
            <div className="h-48 relative overflow-hidden flex items-center justify-center">
              <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent mix-blend-multiply"></div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5b32f6]">{post.category}</span>
                <span className="text-xs text-slate-500">{post.date}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 line-clamp-2">{post.title}</h3>
              <div className="mt-auto flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">{post.readTime}</span>
                <span className="text-[#5b32f6] font-medium group-hover:translate-x-1 transition-transform">Read →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
