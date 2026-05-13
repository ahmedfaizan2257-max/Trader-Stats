import { useState } from 'react';
import { Bot, AlertTriangle, Send, Loader2, Target, BarChart2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { toast } from 'sonner';

export function TradeWithUs() {
  const [strategy, setStrategy] = useState('');
  const [instrument, setInstrument] = useState('');
  const [marketCondition, setMarketCondition] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeStrategy = async () => {
    if (!instrument.trim()) {
      toast.error('Please specify the instrument you want to trade.');
      return;
    }
    if (!strategy.trim()) {
      toast.error('Please describe your strategy.');
      return;
    }
    
    setIsLoading(true);
    setAnalysis(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        toast.error('AI is minimally configured. Please add an API key.');
        setIsLoading(false);
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert, heavily experienced quantitative and technical trading AI mentor helping a retail trader.

The user wants to trade using the following plan today:
Instrument/Market: ${instrument}
Market Condition/Context: ${marketCondition || 'Not specified'}
Strategy Details: ${strategy}

Evaluate this strategy for the current market session.
Please provide your response in the following strict markdown structure (make it actionable and easy to read):

### Strategy Evaluation
[Is this generally a Good or Bad idea? Start with a direct sentence (e.g., "This is a high-risk strategy in the current context." or "This is a solid approach but needs refinement.") Then provide 1-2 sentences summarizing why.]

### Potential Pitfalls & Risks (Why it might be flawed)
[Provide 2-3 concise bullet points on the weaknesses, risks, or potential pitfalls of their approach.]

### The Optimized Plan (How you should trade this instead)
[Provide a step-by-step or explicitly structured improved trading plan that works better than the user's approach. Focus on better entries, risk management, and execution.]
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { temperature: 0.7 }
      });
      
      setAnalysis(response.text || "No analysis generated.");
    } catch (e) {
      console.error(e);
      toast.error('Failed to analyze strategy. Make sure your API key is correctly configured.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-light tracking-tight flex items-center gap-3">
             <Bot className="w-8 h-8 text-[#5b32f6]" />
             Trade With Us
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">Validating your strategy with AI before you take the trade.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Form */}
        <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-slate-400" />
            Your Trading Plan
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Instrument (e.g., NQ, ES, AAPL, EURUSD)
              </label>
              <input
                type="text"
                placeholder="What are you trading today?"
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5b32f6]/50 transition-all font-mono"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Market Condition (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Choppy, Trending, Pre-market news..."
                value={marketCondition}
                onChange={(e) => setMarketCondition(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5b32f6]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Strategy Details
              </label>
              <textarea
                placeholder="Describe what you are looking for. E.g., 'I want to buy the breakout of the first 15min candle targeting a 2:1 RR.'"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5b32f6]/50 transition-all resize-none"
              />
            </div>

            <button
              onClick={analyzeStrategy}
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-[#5b32f6] hover:bg-[#4a26d7] text-white rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Strategy...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Evaluate Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Analysis / Output */}
        <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col h-[600px] lg:h-auto">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
             <BarChart2 className="w-5 h-5 text-[#5b32f6]" />
             AI Evaluation & Optimization
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border border-slate-100 dark:border-slate-800/50 rounded-xl bg-slate-50 dark:bg-[#141416] p-4 font-sans text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
            {!analysis && !isLoading ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 opacity-60">
                  <Bot className="w-16 h-16 mb-4" />
                  <p>Enter your trading plan to get an AI evaluation.</p>
               </div>
            ) : isLoading ? (
               <div className="h-full flex flex-col items-center justify-center text-[#5b32f6] animate-pulse">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <p className="font-semibold">Crunching market data...</p>
               </div>
            ) : (
               <div className="markdown-body prose dark:prose-invert max-w-none prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-h3:font-bold prose-h3:text-slate-900 dark:prose-h3:text-white prose-p:mb-4 prose-li:mb-1 prose-ul:mb-4 prose-ol:mb-4">
                 <Markdown>{analysis}</Markdown>
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
