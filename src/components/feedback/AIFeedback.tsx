import { useState, useRef, useEffect } from 'react';
import { useTrades } from '../../context/TradeContext';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Loader2, AlertCircle, Send, User, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';
import Markdown from 'react-markdown';
import { toast } from 'sonner';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export function AIFeedback() {
  const { trades } = useTrades();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatting]);

  const getFeedback = async () => {
    if (trades.length === 0) {
      setError("Add some trades first to get feedback.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setFeedback(null);
    setChatHistory([]);

    try {
      // The AI Studio environment injects process.env.GEMINI_API_KEY through Vite
      // For external hosting (like Netlify), we use import.meta.env.VITE_GEMINI_API_KEY
      const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAV7X2iRO3FGkg2CSAO_MWquMeWWceBGLs';
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `You are an expert trading coach. Analyze the following trading log and provide a detailed, constructive feedback report.

Trade Data (JSON):
${JSON.stringify(trades, null, 2)}

Format your response exactly with these markdown sections without any emojis:

### What was the trade

[Summarize the trades in a single line paragraph]

### What went wrong

[Identify what went wrong in a single line paragraph]

### How to improve it

[Give actionable improvement steps in a single line paragraph]

Keep it concise, professional, and actionable. Do not output anything outside of these sections, and do completely omit all emojis from your response.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.4
        }
      });

      const responseText = response.text || "No feedback generated.";

      setFeedback(responseText);
      
      setChatHistory([
        { role: 'user', content: prompt },
        { role: 'model', content: responseText }
      ]);
      
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setIsChatting(true);
    
    const newChatHistory: ChatMessage[] = [
      ...chatHistory,
      { role: 'user', content: userMessage }
    ];
    setChatHistory(newChatHistory);

    try {
      const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAV7X2iRO3FGkg2CSAO_MWquMeWWceBGLs';
      const ai = new GoogleGenAI({ apiKey });
      
      const contents = newChatHistory.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: { temperature: 0.5 }
      });

      setChatHistory([
        ...newChatHistory,
        { role: 'model', content: response.text || "" }
      ]);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to send message: ' + (err.message || 'Unknown error'));
      setChatHistory(newChatHistory); 
    } finally {
      setIsChatting(false);
    }
  };

  // Skip the first two messages (prompt and initial report) for the chat UI
  const displayChatHistory = chatHistory.length > 2 ? chatHistory.slice(2) : [];

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h2 className="text-3xl font-light tracking-tight flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-cyan-400" />
          AI Trading Coach
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">Get personalized insights based on your actual execution data.</p>
      </header>

      {!feedback && !isLoading && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Analyzing {trades.length} trades</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6 text-sm">
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
         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center shadow-sm">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
            <h3 className="text-lg font-semibold animate-pulse">Running advanced pattern analysis...</h3>
            <p className="text-slate-500 text-sm mt-2">Correlating entries, evaluating sizing logic, and finding leaks.</p>
         </div>
      )}

      {feedback && !isLoading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-start w-full">
          <button 
            onClick={getFeedback}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Regenerate Analysis
          </button>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 prose prose-slate dark:prose-invert prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-headings:text-cyan-400 prose-headings:mt-8 prose-headings:mb-4 prose-headings:text-xl prose-headings:font-bold max-w-none shadow-sm pb-8 w-full">
            <Markdown>{feedback}</Markdown>
          </div>

          {/* Interactive Chat Section */}
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden h-[500px]">
             
             {/* Chat Header */}
             <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
               <div className="p-2 bg-cyan-500/10 rounded-lg">
                 <Bot className="w-5 h-5 text-cyan-400" />
               </div>
               <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Ask Follow-up Questions</h3>
                  <p className="text-xs text-slate-500">Ask your AI Coach about any confusions regarding the trades or analysis.</p>
               </div>
             </div>

             {/* Chat Messages */}
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {displayChatHistory.map((msg, idx) => (
                  <div key={idx} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                     <div className={cn(
                       "max-w-[80%] rounded-2xl px-4 py-3 text-sm flex gap-3",
                       msg.role === 'user' ? "bg-[#5b32f6] text-white rounded-tr-sm" : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-700"
                     )}>
                        {msg.role === 'model' && (
                          <div className="flex-shrink-0 mt-0.5">
                             <Sparkles className="w-4 h-4 text-cyan-500" />
                          </div>
                        )}
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-white">
                           <Markdown>{msg.content}</Markdown>
                        </div>
                     </div>
                  </div>
                ))}
                
                {isChatting && (
                  <div className="flex w-full justify-start">
                     <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm flex gap-3 items-center">
                        <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
                        <span className="text-slate-500 animate-pulse">Coach is typing...</span>
                     </div>
                  </div>
                )}
                <div ref={chatEndRef} />
             </div>

             {/* Chat Input */}
             <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <form 
                  onSubmit={handleSendMessage}
                  className="relative flex items-center"
                >
                   <input
                     value={chatInput}
                     onChange={e => setChatInput(e.target.value)}
                     disabled={isChatting}
                     placeholder="Type your question here (e.g. Why was trade 2 a bad entry?)..."
                     className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:text-white text-sm"
                   />
                   <button 
                     type="submit" 
                     disabled={isChatting || !chatInput.trim()}
                     className="absolute right-2 p-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:bg-slate-200 dark:disabled:bg-slate-700 text-white dark:text-slate-900 rounded-lg transition-colors"
                   >
                     <Send className="w-4 h-4" />
                   </button>
                </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

