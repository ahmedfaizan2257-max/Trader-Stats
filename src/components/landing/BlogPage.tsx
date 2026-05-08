import React from 'react';

export function BlogPage() {
  const posts = [
    { 
      title: 'The Psychology of Revenge Trading and How to Stop It', 
      date: 'May 5, 2026', 
      category: 'Psychology',
      readTime: '6 min read' 
    },
    { 
      title: 'Analyzing Your Win Rate: Quality vs. Quantity', 
      date: 'April 28, 2026', 
      category: 'Strategy',
      readTime: '8 min read' 
    },
    { 
      title: 'Introducing AI Trade Feedback: Your Personal Coach', 
      date: 'April 15, 2026', 
      category: 'Product Update',
      readTime: '4 min read'
    },
    { 
      title: 'Why Most Traders Fail Setup Consistency', 
      date: 'April 2, 2026', 
      category: 'Analysis',
      readTime: '7 min read'
    },
    { 
      title: 'Optimizing Your Daily Routine for Peak Performance', 
      date: 'March 18, 2026', 
      category: 'Habits',
      readTime: '5 min read'
    },
    { 
      title: 'TradingView Integration is Now Live', 
      date: 'March 5, 2026', 
      category: 'Product Update',
      readTime: '3 min read'
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-[80vh] flex flex-col items-center">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">TradeEdge <span className="text-[#5b32f6]">Blog</span>.</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Insights, strategies, and updates to help you find your edge and improve your execution.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {posts.map((post, i) => (
          <div key={i} className="bg-[#09090b] border border-slate-800 rounded-2xl overflow-hidden hover:border-[#5b32f6]/50 transition-colors flex flex-col group cursor-pointer">
            <div className="h-48 bg-[#18181b] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5b32f6]/10 to-transparent"></div>
              <span className="text-3xl font-black text-slate-800 group-hover:scale-110 transition-transform duration-500 text-center px-4 leading-tight">{post.category}</span>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5b32f6]">{post.category}</span>
                <span className="text-xs text-slate-500">{post.date}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-6 line-clamp-2">{post.title}</h3>
              <div className="mt-auto flex items-center justify-between text-sm">
                <span className="text-slate-400">{post.readTime}</span>
                <span className="text-[#5b32f6] font-medium group-hover:translate-x-1 transition-transform">Read →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
