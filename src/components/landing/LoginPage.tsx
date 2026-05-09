import React, { useState } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { toast } from 'sonner';

export function LoginPage({ onEnter }: { onEnter: () => void }) {
  const { signInWithGoogle, signInWithMicrosoft, signInWithApple, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // If user is already logged in, redirect them
  React.useEffect(() => {
    if (user && !loading) {
      onEnter();
    }
  }, [user, loading, onEnter]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully!");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleProviderAuth = async (providerFn: () => Promise<void>) => {
    try {
      await providerFn();
      toast.success("Successfully authenticated!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5b32f6] to-cyan-400"></div>
        
        <div className="flex items-center justify-center gap-2 mb-8">
          <TrendingUp className="w-7 h-7 text-[#5b32f6]" strokeWidth={2.5} />
          <span className="text-2xl font-bold tracking-tight text-[#5b32f6]">
            TradeEdge
          </span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{isRegistering ? "Create your account" : "Welcome back"}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {isRegistering ? "Sign up to start your 14-day free trial." : "Enter your details to access your dashboard."}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <button 
            type="button"
            onClick={() => handleProviderAuth(signInWithGoogle)}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 font-medium transition-colors"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          
          <button 
            type="button"
            onClick={() => handleProviderAuth(signInWithMicrosoft)}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 font-medium transition-colors"
          >
            <img src="https://c.s-microsoft.com/favicon.ico" alt="Microsoft" className="w-5 h-5" />
            Continue with Microsoft
          </button>
          
          <button 
            type="button"
            onClick={() => handleProviderAuth(signInWithApple)}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 font-medium transition-colors"
          >
            <img src="https://www.apple.com/favicon.ico" alt="Apple" className="w-5 h-5" />
            Continue with Apple
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
          <span className="text-xs text-slate-500 uppercase font-medium">Or continue with email</span>
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#5b32f6] transition-colors focus:ring-1 focus:ring-[#5b32f6]" 
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              {!isRegistering && <a href="#" className="text-xs text-[#5b32f6] hover:underline">Forgot password?</a>}
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#5b32f6] transition-colors focus:ring-1 focus:ring-[#5b32f6]" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#5b32f6] hover:bg-[#4a26d7] text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(91,50,246,0.2)] flex items-center justify-center gap-2 mt-2"
          >
            {isRegistering ? "Start 14-day free trial" : "Sign In"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}{' '}
          <button className="text-[#5b32f6] font-medium hover:underline" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Log In" : "Start 14-day free trial"}
          </button>
        </div>
      </div>
    </div>
  );
}
