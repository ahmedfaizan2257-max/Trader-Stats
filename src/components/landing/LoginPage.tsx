import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

export function LoginPage({ onEnter }: { onEnter: () => void }) {
  const { signInWithGoogle, signInWithMicrosoft, signInWithApple, signInWithEmail, signUpWithEmail, user } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(window.location.hash.includes('signup'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      if (!user.emailVerified && user.providerData.some(p => p.providerId === 'password')) {
        // Needs verification if signed up with email
        toast.error('Please verify your email address to continue.');
      } else {
        onEnter();
      }
    }
  }, [user, onEnter]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setProcessing(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        toast.success('Check your email for a verification link!');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setProcessing(false);
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

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{isSignUp ? 'Create an Account' : 'Welcome Back'}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {isSignUp ? 'Sign up to get started with your dashboard.' : 'Sign in to access your dashboard.'}
          </p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-8">
          <div>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5b32f6]"
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#5b32f6]"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={processing}
            className="w-full bg-[#5b32f6] hover:bg-[#4a26d7] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {processing ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-50 dark:bg-[#09090b] text-slate-500">Or continue with</span>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 hover:border-[#5b32f6] text-slate-900 dark:text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Continue with Google
          </button>
          
          <button 
            onClick={signInWithMicrosoft}
            className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 hover:border-[#5b32f6] text-slate-900 dark:text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 23 23" className="w-5 h-5">
              <path fill="#f3f3f3" d="M0 0h23v23H0z" />
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            Continue with Microsoft
          </button>

          <button 
            onClick={signInWithApple}
            className="w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800 hover:border-[#5b32f6] text-slate-900 dark:text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 384 512" className="w-5 h-5 text-slate-900 dark:text-white" fill="currentColor">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90.4-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
            </svg>
            Continue with Apple
          </button>
        </div>
        
        <div className="mt-8 text-center text-sm text-slate-500">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button onClick={() => setIsSignUp(false)} className="text-[#5b32f6] font-bold hover:underline">
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button onClick={() => setIsSignUp(true)} className="text-[#5b32f6] font-bold hover:underline">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
