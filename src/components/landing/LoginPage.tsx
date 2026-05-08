import React from 'react';
import { ArrowRight, Hexagon } from 'lucide-react';

export function LoginPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="pt-32 pb-20 px-6 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-[#09090b] border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5b32f6] to-cyan-400"></div>
        
        <div className="flex items-center justify-center gap-2 mb-8">
          <Hexagon className="w-7 h-7 text-[#5b32f6]" strokeWidth={2.5} />
          <span className="text-2xl font-bold tracking-tight text-[#5b32f6]">
            TradeEdge
          </span>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-slate-400 text-sm">Enter your details to access your dashboard.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onEnter(); }} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
            <input 
              type="email" 
              defaultValue="demo@tradeedge.app"
              required 
              className="w-full bg-[#18181b] border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-[#5b32f6] transition-colors focus:ring-1 focus:ring-[#5b32f6]" 
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <a href="#" className="text-xs text-[#5b32f6] hover:underline">Forgot password?</a>
            </div>
            <input 
              type="password" 
              defaultValue="password123"
              required 
              className="w-full bg-[#18181b] border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-[#5b32f6] transition-colors focus:ring-1 focus:ring-[#5b32f6]" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#5b32f6] hover:bg-[#4a26d7] text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(91,50,246,0.2)] flex items-center justify-center gap-2 mt-4"
          >
            Sign In to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <button className="text-[#5b32f6] font-medium hover:underline" onClick={(e) => { e.preventDefault(); onEnter(); }}>Start 14-day free trial</button>
        </div>
      </div>
    </div>
  );
}
