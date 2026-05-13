import React from 'react';
import { BarChart3, Brain, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export function DashboardMock({ variant = 'hero' }: { variant?: 'hero' | 'performance' | 'chart' | 'journal' | 'feedback' }) {
  return (
    <div className="aspect-[4/3] sm:aspect-video w-full bg-white dark:bg-[#18181b] relative overflow-hidden group border border-slate-200 dark:border-slate-800 rounded-xl max-w-full">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full h-8 bg-[#1f1f23] border-b border-black/50 flex items-center px-4 gap-2 z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
      </div>
      
      <div className="absolute inset-0 top-8 flex">
        {/* Sidebar */}
        <div className="hidden sm:block w-48 border-r border-[#26262a] bg-[#111113] p-4 space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-[#5b32f6]" strokeWidth={2.5} />
            <span className="text-[#5b32f6] font-bold text-sm tracking-tight">TradeEdge</span>
          </div>
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-6 flex items-center gap-3 rounded w-full">
              <div className="w-4 h-4 rounded-full bg-slate-800"></div>
              <div className="h-2.5 bg-slate-800/80 rounded w-2/3"></div>
            </div>
          ))}
        </div>
        
        {/* Main Content Areas based on variant */}
        <div className="flex-1 bg-slate-50 dark:bg-[#09090b] p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-hidden relative">
          
          {(variant === 'hero' || variant === 'performance') && (
            <>
              <div>
                <div className="text-slate-600 dark:text-slate-400 text-xs font-medium mb-1">Hello, Alex 👋</div>
                <div className="text-slate-900 dark:text-white font-bold text-lg mb-1">Your P&L</div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-[#00FC9E] mb-2">$26,496.30</div>
                <div className="inline-flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400 bg-white dark:bg-[#18181b] px-2 py-0.5 rounded">{'< February 2025 >'}</div>
              </div>
              
              <div className="text-slate-900 dark:text-white font-medium text-sm">Performance</div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#18181b] border border-[#26262a] rounded-lg p-4 h-24 flex flex-col justify-end">
                   <div className="h-2 w-1/3 bg-slate-700/50 rounded mb-2"></div>
                   <div className="h-4 w-1/2 bg-slate-300/80 rounded"></div>
                </div>
                <div className="bg-white dark:bg-[#18181b] border border-[#26262a] rounded-lg p-4 h-24 md:col-span-2 relative overflow-hidden flex items-center px-4 sm:px-6 gap-4 sm:gap-8">
                  <motion.div 
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-[4px] sm:border-[6px] border-[#00FC9E] opacity-80 border-r-slate-800 flex items-center justify-center shrink-0"
                  ></motion.div>
                  <div className="flex-1 space-y-2">
                     <div className="h-2 w-1/3 bg-slate-700/50 rounded"></div>
                     <div className="h-2 w-full bg-slate-800 rounded"></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[120px] sm:h-[160px]">
                <div className="bg-white dark:bg-[#18181b] border border-[#26262a] rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 text-xs text-slate-500 font-medium z-10">Total Cumulative P&L</div>
                  <div className="absolute bottom-0 left-0 right-0 h-2/3 flex items-end overflow-hidden origin-left">
                    <motion.div 
                      initial={{ opacity: 0, x: '-100%' }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      viewport={{ once: true }}
                      className="w-full h-full bg-gradient-to-t from-[#00FC9E]/20 to-transparent border-t-2 border-[#00FC9E]" 
                      style={{clipPath: 'polygon(0 100%, 0 60%, 20% 50%, 40% 50%, 60% 30%, 80% 40%, 100% 0, 100% 100%)'}}
                    ></motion.div>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#18181b] border border-[#26262a] rounded-lg p-4 flex items-end justify-between px-2 sm:px-6 pb-4 gap-1 relative pt-8">
                  <div className="absolute top-0 left-0 p-3 text-xs text-slate-500 font-medium">Daily P&L</div>
                  {[20, 60, 30, 80, 50, 90, 70, 40].map((h, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                      viewport={{ once: true }}
                      className={`flex-1 rounded-sm ${i === 2 || i === 4 ? 'bg-[#FF5F56]' : 'bg-[#00FC9E]'}`} 
                    ></motion.div>
                  ))}
                </div>
              </div>
            </>
          )}

          {variant === 'chart' && (
            <div className="h-full w-full flex flex-col pt-2">
              <div className="flex justify-between items-center mb-4 bg-white dark:bg-[#18181b] p-3 border border-[#26262a] rounded-lg">
                 <div className="flex gap-4">
                   <div className="h-6 w-16 bg-[#26262a] rounded flex items-center justify-center text-xs text-slate-700 dark:text-slate-300 font-bold">15m</div>
                   <div className="h-6 w-20 bg-[#26262a] rounded flex items-center justify-center text-xs text-emerald-600 dark:text-[#00FC9E] font-bold">Long</div>
                 </div>
                 <div className="h-6 w-24 bg-gradient-to-r from-[#00FC9E]/20 to-[#00FC9E]/10 border border-[#00FC9E]/30 rounded flex items-center justify-center text-xs text-emerald-600 dark:text-[#00FC9E] font-bold">+$450.00</div>
              </div>
              <div className="flex-1 bg-white dark:bg-[#18181b] border border-[#26262a] rounded-lg relative overflow-hidden flex items-center justify-center p-4">
                 {/* Candlestick chart mock */}
                 <div className="w-full h-[80%] flex items-end justify-between gap-1 sm:gap-2 px-2 relative">
                   {/* Entry Exit markers */}
                   <div className="absolute left-[30%] top-[45%] w-8 border-t border-dashed border-[#00FC9E] z-20">
                      <div className="absolute -left-8 -top-3 text-[10px] text-emerald-600 dark:text-[#00FC9E] bg-white dark:bg-[#000000] px-1 rounded">Buy Limit</div>
                   </div>
                   <div className="absolute left-[80%] top-[15%] w-8 border-t border-dashed border-[#00FC9E] z-20">
                      <div className="absolute -right-8 -top-3 text-[10px] text-emerald-600 dark:text-[#00FC9E] bg-white dark:bg-[#000000] px-1 rounded">Take Profit</div>
                   </div>

                   {[35,38,32,45,40,48,55,50,60,65,60,75,80,72,85].map((h, i) => {
                     const prevH = i === 0 ? 30 : [35,38,32,45,40,48,55,50,60,65,60,75,80,72,85][i-1];
                     const isGreen = h > prevH;
                     return (
                       <motion.div 
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.4, delay: i * 0.05 }}
                         viewport={{ once: true }}
                         key={i} className="flex-1 flex flex-col items-center justify-end" style={{ height: `${Math.max(h, prevH)}%` }}
                       >
                         <div className={`w-[1px] h-full ${isGreen ? 'bg-[#00FC9E]' : 'bg-[#FF5F56]'}`}></div>
                         <div className={`w-full sm:w-2 ${isGreen ? 'bg-[#00FC9E]' : 'bg-[#FF5F56]'} rounded-sm z-10 absolute`} style={{ height: `${Math.abs(h - prevH) + 5}%`, bottom: `${Math.min(h, prevH)}%` }}></div>
                       </motion.div>
                     );
                   })}
                 </div>
              </div>
            </div>
          )}

          {variant === 'journal' && (
            <div className="h-full w-full flex flex-col gap-4">
               <div className="flex gap-4 border-b border-[#26262a] pb-2 pt-2">
                  <div className="text-slate-900 dark:text-white font-medium border-b-2 border-[#5b32f6] pb-2">Calendar</div>
                  <div className="text-slate-500 pb-2">Daily Journal</div>
                  <div className="text-slate-500 pb-2">Trades</div>
               </div>
               
               {/* Calendar Grid */}
               <div className="flex-1 grid grid-cols-7 gap-1 sm:gap-2 content-start mt-2">
                  {['S','M','T','W','T','F','S'].map((d, i) => <div key={`${d}-${i}`} className="text-center text-[10px] sm:text-xs text-slate-500 py-1 font-medium">{d}</div>)}
                  {Array.from({length: 28}).map((_, i) => {
                    const isWin = i % 4 === 0 || i % 6 === 0;
                    const isLoss = i % 7 === 0;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.02 }}
                        viewport={{ once: true }}
                        key={i} className={`aspect-square rounded-md p-1 sm:p-2 border ${isWin ? 'bg-[#00FC9E]/10 border-[#00FC9E]/30' : isLoss ? 'bg-[#FF5F56]/10 border-[#FF5F56]/30' : 'bg-white dark:bg-[#18181b] border-[#26262a]'}`}
                      >
                        <div className="text-[10px] text-slate-600 dark:text-slate-400">{i + 1}</div>
                        {(isWin || isLoss) && <div className={`text-[10px] font-bold mt-0.5 sm:mt-1 ${isWin ? 'text-emerald-600 dark:text-[#00FC9E]' : 'text-[#FF5F56]'}`}>{isWin ? '+' : '-'}${Math.floor(Math.random() * 500) + 100}</div>}
                      </motion.div>
                    )
                  })}
               </div>
            </div>
          )}

          {variant === 'feedback' && (
            <div className="h-full w-full flex flex-col p-2 overflow-y-auto scrollbar-none gap-4">
               <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                 className="flex flex-col gap-1.5"
               >
                 <div className="text-slate-900 dark:text-white font-semibold text-sm flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-[#00FC9E] rounded-full"></div>
                   Successes this month
                 </div>
                 <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-3.5">
                   You exhibited exceptional skill in riding established trends, notably during the breakout on May 6th. Your ability to methodically pyramid into profitable setups (Positions 5-8) and extract maximum value from a unidirectional push is a major asset. This specific session accounted for the majority of your net profit.
                 </div>
               </motion.div>

               <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                 className="flex flex-col gap-1.5"
               >
                 <div className="text-slate-900 dark:text-white font-semibold text-sm flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-[#FFBD2E] rounded-full"></div>
                   Key challenges & weaknesses
                 </div>
                 <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-3.5 space-y-2">
                   <p><strong className="text-slate-900 dark:text-slate-100 font-semibold">Struggling with Directional Bias on Drawdowns:</strong> You faced substantial headwinds holding short positions, particularly during counter-trend setups on the 5th and 7th. This indicates a potential issue with reading higher-timeframe momentum and attempting to catch falling knives.</p>
                   <p><strong className="text-slate-900 dark:text-slate-100 font-semibold">Missing Log Entries:</strong> The lack of context and metadata attached to your executions is a major issue. Failing to record emotional state and technical setup criteria prevents meaningful pattern recognition over time.</p>
                   <p><strong className="text-slate-900 dark:text-slate-100 font-semibold">Erratic Stop Losses:</strong> While some drawdowns were aggressively capped, others ballooned to outsized figures. This points to a failure to adhere to hard stops once your original thesis was invalidated.</p>
                 </div>
               </motion.div>

               <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                 className="flex flex-col gap-1.5"
               >
                 <div className="text-slate-900 dark:text-white font-semibold text-sm flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-[#5b32f6] rounded-full"></div>
                   Actionable improvement steps
                 </div>
                 <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-3.5">
                   <strong className="text-slate-900 dark:text-slate-100 font-semibold">Enforce a Strict Preparation Protocol:</strong> Prior to any entry, explicitly outline your setup conditions, take-profit levels, and <em className="text-[#FF5F56] not-italic font-semibold">hard out</em> before firing. Directly afterwards, compile thorough notes detailing...
                 </div>
               </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
