import React, { useState } from 'react';
import { Shield, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function MockOAuthPage({ platform, onComplete, onCancel }: { platform: string, onComplete: (code: string) => void, onCancel: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const platformName = capitalize(platform);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      if (username.toLowerCase() === platform.toLowerCase() && password.toLowerCase() === platform.toLowerCase()) {
        toast.success(`Authorized securely with ${platformName}`);
        onComplete(`mock_code_${platform}_12345`);
      } else {
        toast.error(`Invalid credentials for ${platformName}`);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative">
        <button onClick={onCancel} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
           <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center mt-6 mb-8">
           <div className="w-16 h-16 bg-[#5b32f6]/10 text-[#5b32f6] rounded-2xl flex items-center justify-center font-bold text-3xl mb-4 border border-[#5b32f6]/20">
             {platform.charAt(0).toUpperCase()}
           </div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in to {platformName}</h2>
           <p className="text-slate-500 mt-2 text-sm leading-relaxed">
             Trade Edge is requesting read-only access to your {platformName} account to sync trades.
           </p>
           
           <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 mt-4">
              <Shield className="w-4 h-4" /> Secure OAuth Login
           </div>
           
           <p className="text-xs text-slate-400 mt-3 font-medium">✨ Use <strong className="text-slate-600 dark:text-slate-300">{platform.toLowerCase()}</strong> / <strong className="text-slate-600 dark:text-slate-300">{platform.toLowerCase()}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <input 
               type="text" 
               placeholder="Username" 
               value={username}
               onChange={e => setUsername(e.target.value)}
               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5b32f6]"
               required
             />
           </div>
           <div>
             <input 
               type="password" 
               placeholder="Password" 
               value={password}
               onChange={e => setPassword(e.target.value)}
               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5b32f6]"
               required
             />
           </div>
           
           <div className="pt-4">
             <button 
               type="submit" 
               disabled={loading}
               className="w-full bg-[#5b32f6] hover:bg-[#4a26d7] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
             >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Authorizing...</> : 'Sign In & Authorize'}
             </button>
           </div>
        </form>
      </div>
    </div>
  );
}
