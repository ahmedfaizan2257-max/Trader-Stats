import { useState } from 'react';
import { useTrades } from '../../context/TradeContext';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import Markdown from 'react-markdown';
import { toast } from 'sonner';

export function AIFeedback() {
  const { trades } = useTrades();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFeedback = async () => {
    if (trades.length === 0) {
      setError("Add some trades first to get feedback.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setFeedback(null);

    try {
      // The AI Studio environment injects process.env.GEMINI_API_KEY through Vite
      // For external hosting (like Netlify), we use import.meta.env.VITE_GEMINI_API_KEY
      const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `You are an expert trading coach. Analyze the following trading log and provide a detailed, constructive feedback report.
      
Trade Data (JSON):
${JSON.stringify(trades, null, 2)}

Format your response exactly with these markdown sections:
### 🌟 Successes this month
[Analyze what went well]

### 🚧 Key challenges & weaknesses
[Identify patterns of losses or mistakes]

### 🎯 Actionable improvement steps
[Give 2-3 specific rules to implement]

### 📊 Overall assessment
[A brief summary of their performance and trajectory]

Keep it concise, professional, and actionable. Do not output anything outside of these sections.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.4
        }
      });

      setFeedback(response.text || "No feedback generated.");
      toast.success('Successfully analyzed trades');
    } catch (err: any) {
      console.error(err);
      let errorMessage = err.message || "An error occurred while generating feedback.";
      if (errorMessage.includes("API key not valid") || errorMessage.includes("API Key must be set")) {
        errorMessage = "Error: Gemini API key is missing. Since you are hosting outside AI Studio, please add VITE_GEMINI_API_KEY to your Netlify site Environment Variables and trigger a new deployment.";
      }
      setError(errorMessage);
      toast.error('Failed to generate analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h2 className="text-3xl font-light tracking-tight flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-cyan-400" />
          AI Trading Coach
        </h2>
        <p className="text-slate-400 mt-1 text-sm">Get personalized insights based on your actual execution data.</p>
      </header>

      {!feedback && !isLoading && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Analyzing {trades.length} trades</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">
            Our AI model will review your entries, exits, sizing, and P&L to uncover hidden patterns in your trading behavior.
          </p>
          <button 
            onClick={getFeedback}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
          >
            Generate Analysis
          </button>
          {error && (
             <div className="mt-4 text-red-400 text-sm flex items-center gap-2 bg-red-400/10 px-4 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
             </div>
          )}
        </div>
      )}

      {isLoading && (
         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center shadow-sm">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
            <h3 className="text-lg font-semibold animate-pulse">Running advanced pattern analysis...</h3>
            <p className="text-slate-500 text-sm mt-2">Correlating entries, evaluating sizing logic, and finding leaks.</p>
         </div>
      )}

      {feedback && !isLoading && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-start">
          <button 
            onClick={getFeedback}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Regenerate Analysis
          </button>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 prose prose-invert prose-p:text-slate-300 prose-headings:text-cyan-400 prose-headings:mt-6 prose-headings:mb-2 prose-headings:text-lg prose-headings:font-semibold max-w-none prose-li:text-slate-300 shadow-sm custom-markdown prose-strong:text-slate-100">
            <Markdown>{feedback}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
