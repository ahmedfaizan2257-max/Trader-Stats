import React from 'react';

export function PlatformsPage() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-[80vh] flex flex-col items-center">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">Supported <span className="text-[#5b32f6]">Platforms</span>.</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Seamlessly connect your trading accounts. TraderStats supports a wide range of platforms to automatically sync and analyze your executions.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {[
          'MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView', 
          'NinjaTrader', 'TradeLocker', 'Match-Trader', 'DXtrade'
        ].map((platform) => (
          <div key={platform} className="bg-[#09090b] border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-[#5b32f6]/50 transition-all hover:-translate-y-1 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-[#18181b] flex items-center justify-center text-2xl font-black text-[#5b32f6]">
              {platform.charAt(0)}
            </div>
            <h3 className="text-lg font-bold text-slate-200">{platform}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
