import { useState, useEffect } from 'react';
import { Link2, Shield, Search, X, Loader2, CheckCircle2, Webhook, Upload, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { useTrades } from '../../context/TradeContext';
import { useAuth } from '../../context/AuthContext';
import { Direction } from '../../types';

const platforms = [
  { id: 'ninjatrader', name: 'NinjaTrader', icon: 'N', status: 'available', authType: 'both' },
  { id: 'tradovate', name: 'Tradovate', icon: 'T', status: 'available', authType: 'oauth' },
  { id: 'binance', name: 'Binance', icon: 'B', status: 'available', authType: 'api' },
  { id: 'bybit', name: 'Bybit', icon: 'B', status: 'available', authType: 'api' },
  { id: 'interactivebrokers', name: 'Interactive Brokers', icon: 'IB', status: 'coming_soon', authType: 'oauth' },
  { id: 'tdameritrade', name: 'Schwab', icon: 'S', status: 'coming_soon', authType: 'oauth' },
];

const generateMockTrades = (platformName: string) => {
  const symbols = platformName.includes('Binance') || platformName.includes('Bybit') 
    ? ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'] 
    : ['NQ', 'ES', 'CL'];
  
  const trades = [];
  for(let i = 0; i < 3; i++) {
    const isLong = Math.random() > 0.5;
    const entry = 100 + Math.random() * 1000;
    const exit = entry * (1 + (Math.random() * 0.05 - 0.02));
    const size = Math.floor(Math.random() * 5) + 1;
    const pnl = isLong ? (exit - entry) * size : (entry - exit) * size;
    
    trades.push({
      id: crypto.randomUUID(),
      date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
      account: platformName,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      direction: (isLong ? 'Long' : 'Short') as Direction,
      entryPrice: Number(entry.toFixed(2)),
      exitPrice: Number(exit.toFixed(2)),
      contracts: size,
      pnl: Number((pnl * (platformName.includes('NinjaTrader') ? 20 : 1)).toFixed(2)),
      notes: `Auto-synced from ${platformName}`
    });
  }
  return trades;
};

export function Integrations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<typeof platforms[0] | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>(() => {
    const saved = localStorage.getItem('TradeTrack_connected_platforms');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [currentMethod, setAuthMethod] = useState<'oauth' | 'api'>('oauth');

  const { addTrade } = useTrades();
  const { user } = useAuth();

  const [showWebhookSetup, setShowWebhookSetup] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const webhookUserId = user?.uid || 'demo-user-123';

  useEffect(() => {
    localStorage.setItem('TradeTrack_connected_platforms', JSON.stringify(connectedPlatforms));
  }, [connectedPlatforms]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const callbackPlatform = urlParams.get('oauth_callback');
    const code = urlParams.get('code');
    
    if (callbackPlatform && code) {
      const platformName = callbackPlatform.charAt(0).toUpperCase() + callbackPlatform.slice(1);
      
      const connect = async () => {
        setIsConnecting(true);
        toast.info('Exchanging special access code for broker token...');
        
        setTimeout(() => {
          setConnectedPlatforms(prev => {
            if (!prev.includes(callbackPlatform)) return [...prev, callbackPlatform];
            return prev;
          });
          
          const mockTrades = generateMockTrades(platformName);
          mockTrades.forEach(addTrade);
          toast.success(`${platformName} ✅ Connected — Live!`);
          toast.success(`Pulled ${mockTrades.length} automated trades.`);
          setIsConnecting(false);
          
          window.history.replaceState({}, document.title, window.location.pathname);
        }, 2000);
      };
      
      connect();
    }
  }, []);

  const filteredPlatforms = platforms.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const [platformToDisconnect, setPlatformToDisconnect] = useState<string | null>(null);

  const handleOAuthConnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedPlatform) return;
    
    // Redirect to "Tradovate's login page"
    window.location.href = `/?mock_oauth=${selectedPlatform.name.toLowerCase()}`;
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatform) return;
    
    setIsConnecting(true);
    
    try {
      const response = await fetch('/api/fetch-trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform.id,
          apiKey,
          apiSecret,
          environment: 'live' // or get from toggle
        })
      });

      const data = await response.json();
      
      setConnectedPlatforms(prev => [...prev, selectedPlatform.id]);
      
      if (response.ok && data.trades) {
        data.trades.forEach((t: any) => addTrade(t));
        toast.success(`Successfully connected to ${selectedPlatform.name}`);
        toast.success(`Synced ${data.trades.length} trades from ${selectedPlatform.name}`);
      } else {
        // Show the real error from the backend (e.g. Invalid API keys from CCXT)
        toast.error(`Connection failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
        console.error(err);
        toast.error('Connection failed due to a network error.');
    } finally {
        setIsConnecting(false);
        setSelectedPlatform(null);
        setApiKey('');
        setApiSecret('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim() !== '');
        if (lines.length <= 1) {
          toast.error('The CSV file appears to be empty or only contains headers.');
          return;
        }

        // Basic generic CSV parsing for demo purposes
        // Assumes a basic structure, or randomly generates mock mapped rows depending on length
        // A robust parser would read header names and map them.
        
        let importedCount = 0;
        const headers = lines[0].toLowerCase();
        const hasSpecificNinjaTraderFormat = headers.includes('instrument') && headers.includes('action');

        for (let i = 1; i < Math.min(lines.length, 50); i++) { // Limit to 50 for safety in demo
           const row = lines[i].split(',');
           if (row.length > 2) {
             const isLong = row.join('').toLowerCase().includes('buy') || row.join('').toLowerCase().includes('long');
             const entry = 100 + Math.random() * 1000;
             const exit = entry * (1 + (Math.random() * 0.05 - 0.02));
             const size = Math.floor(Math.random() * 5) + 1;
             const pnl = isLong ? (exit - entry) * size : (entry - exit) * size;
             
             addTrade({
                id: crypto.randomUUID(),
                date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
                account: 'CSV Import',
                symbol: hasSpecificNinjaTraderFormat ? (row[0] || 'ES') : 'UNKNOWN',
                direction: isLong ? 'Long' : 'Short',
                entryPrice: Number(entry.toFixed(2)),
                exitPrice: Number(exit.toFixed(2)),
                contracts: size,
                pnl: Number(pnl.toFixed(2)),
                notes: `Imported via CSV`
             });
             importedCount++;
           }
        }
        
        toast.success(`Successfully imported ${importedCount} trades from CSV`);
        setShowCSVModal(false);
      } catch (err) {
        console.error(err);
        toast.error('Failed to parse CSV file. Ensure it is a valid format.');
      }
    };
    reader.readAsText(file);
  };

  const handleDisconnect = (e: React.MouseEvent, platformId: string) => {
    e.stopPropagation();
    if (platformToDisconnect === platformId) {
      setConnectedPlatforms(prev => prev.filter(id => id !== platformId));
      setPlatformToDisconnect(null);
      toast.success('Platform disconnected successfully');
    } else {
      setPlatformToDisconnect(platformId);
      setTimeout(() => setPlatformToDisconnect(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-light tracking-tight flex items-center gap-3">
            Broker Integrations
            <span className="bg-[#5b32f6]/10 text-[#5b32f6] text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider">Beta</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">Connect your brokerages using Secure Login (OAuth) or API Keys to auto-sync trades.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex items-start gap-4 mb-8">
          <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">How do broker integrations work?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 mb-4 leading-relaxed max-w-2xl">
              We connect directly to your exchange either via <strong>Secure Login (OAuth)</strong> or <strong>Read-Only API Keys</strong>. These methods allow our system to securely sync your trade history, but mathematically prevent us from placing trades or withdrawing funds.
            </p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search platforms..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#5b32f6] transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPlatforms.map(platform => {
            const isConnected = connectedPlatforms.includes(platform.id);
            
            return (
              <div 
                key={platform.id} 
                onClick={() => {
                  if (platform.status === 'available' && !isConnected) {
                    setSelectedPlatform(platform);
                  }
                }}
                className={cn(
                  "bg-slate-50 dark:bg-slate-950 border p-5 rounded-xl flex items-center justify-between transition-colors group",
                  platform.status === 'available' && !isConnected ? "border-slate-200 dark:border-slate-800 hover:border-slate-600 cursor-pointer" : "border-slate-200 dark:border-slate-800",
                  isConnected && "border-emerald-500/30 bg-emerald-500/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center font-bold border transition-colors",
                    isConnected 
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 group-hover:border-slate-600"
                  )}>
                    {platform.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">{platform.name}</h4>
                    <p className="text-xs text-slate-500">
                      {isConnected 
                        ? <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Connected</span>
                        : platform.status === 'available' ? 'API keys required' : 'In development'}
                    </p>
                  </div>
                </div>
                
                {isConnected ? (
                  <button 
                    onClick={(e) => handleDisconnect(e, platform.id)}
                    className={cn(
                      "text-xs transition-colors px-2 py-1 rounded",
                      platformToDisconnect === platform.id ? "bg-red-500 text-slate-900 dark:text-white" : "text-slate-500 hover:text-red-400"
                    )}
                  >
                    {platformToDisconnect === platform.id ? "Confirm" : "Disconnect"}
                  </button>
                ) : (
                  <button className={cn(
                    "p-2 rounded-lg transition-colors border",
                    platform.status === 'available' 
                      ? "bg-[#5b32f6]/10 text-[#5b32f6] border-[#5b32f6]/20 group-hover:bg-[#5b32f6] group-hover:text-white"
                      : "bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed"
                  )}>
                    <Link2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
          
          {/* Custom Webhook Card */}
          <div 
            onClick={() => setShowWebhookSetup(true)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-[#5b32f6]/50 p-5 rounded-xl flex items-center justify-between transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold border border-[#5b32f6]/30 bg-[#5b32f6]/10 text-[#5b32f6] transition-colors">
                <Webhook className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800 dark:text-slate-200">Custom Connecting App</h4>
                <p className="text-xs text-[#5b32f6]">Developer API & Webhooks</p>
              </div>
            </div>
            <button className="p-2 rounded-lg transition-colors border bg-[#5b32f6]/10 text-[#5b32f6] border-[#5b32f6]/20 group-hover:bg-[#5b32f6] group-hover:text-white">
               <Link2 className="w-4 h-4" />
            </button>
          </div>

          {/* CSV Import Card */}
          <div 
            onClick={() => setShowCSVModal(true)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-[#5b32f6]/50 p-5 rounded-xl flex items-center justify-between transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold border border-[#5b32f6]/30 bg-[#5b32f6]/10 text-[#5b32f6] transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800 dark:text-slate-200">CSV File Import</h4>
                <p className="text-xs text-[#5b32f6]">Upload exported trade files</p>
              </div>
            </div>
            <button className="p-2 rounded-lg transition-colors border bg-[#5b32f6]/10 text-[#5b32f6] border-[#5b32f6]/20 group-hover:bg-[#5b32f6] group-hover:text-white">
               <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Connection Modal */}
      {selectedPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setSelectedPlatform(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-950 flex items-center justify-center font-bold text-[#5b32f6] border border-slate-200 dark:border-slate-800">
                  {selectedPlatform.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Connect {selectedPlatform.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Securely sync your trading data</p>
                </div>
              </div>
              
              {selectedPlatform.authType === 'both' && (
                <div className="flex mt-4 bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  <button 
                    onClick={() => setAuthMethod('oauth')}
                    className={cn("flex-1 py-1.5 text-sm font-medium rounded-md transition-colors", currentMethod === 'oauth' ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200")}
                  >
                    OAuth Login
                  </button>
                  <button 
                    onClick={() => setAuthMethod('api')}
                    className={cn("flex-1 py-1.5 text-sm font-medium rounded-md transition-colors", currentMethod === 'api' ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200")}
                  >
                    API Keys
                  </button>
                </div>
              )}
              {selectedPlatform.authType === 'api' && (
                <div className="flex mt-4 bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  <button 
                    onClick={() => setAuthMethod('api')}
                    className={cn("flex-1 py-1.5 text-sm font-medium rounded-md transition-colors", currentMethod === 'api' ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200")}
                  >
                    API Keys
                  </button>
                  <button 
                    onClick={() => setAuthMethod('oauth')} // Using 'oauth' bit as a placeholder for the webhook connection overlay
                    className={cn("flex-1 py-1.5 text-sm font-medium rounded-md transition-colors", currentMethod === 'oauth' ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200")}
                  >
                    Use Connecting App
                  </button>
                </div>
              )}
            </div>
            
            {currentMethod === 'oauth' ? (
              <div className="p-6 flex flex-col items-center justify-center text-center">
                {selectedPlatform.authType === 'both' ? (
                   <>
                    <Shield className="w-12 h-12 text-emerald-400 mb-4 opacity-80" />
                    <h4 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Secure Broker Login</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 max-w-[280px]">
                      You will be securely redirected to {selectedPlatform.name} to approve read-only access.
                    </p>
                    
                    <button 
                      onClick={handleOAuthConnect}
                      disabled={isConnecting}
                      className="w-full bg-[#5b32f6] hover:bg-[#4a26d7] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Redirecting...
                        </>
                      ) : (
                        `Sign in with ${selectedPlatform.name}`
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <Webhook className="w-12 h-12 text-[#5b32f6] mb-4 opacity-80" />
                    <h4 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Configure Webhook App</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-[280px]">
                      Don't have API keys? You can use a local bridging app/script to automatically push your trades here securely.
                    </p>
                    <button 
                      onClick={() => {
                        setSelectedPlatform(null);
                        setShowWebhookSetup(true);
                      }}
                      className="w-full bg-[#5b32f6] hover:bg-[#4a26d7] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      View Instructions
                    </button>
                  </>
                )}
              </div>
            ) : (
              <form onSubmit={handleConnect} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Environment</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" className="bg-[#5b32f6]/10 text-[#5b32f6] border border-[#5b32f6]/30 py-2 rounded-lg text-sm font-medium">Live</button>
                    <button type="button" className="bg-slate-50 dark:bg-slate-950 text-slate-500 border border-slate-200 dark:border-slate-800 py-2 rounded-lg text-sm font-medium hover:border-slate-300 dark:border-slate-700">Demo / Simulation</button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">API Key</label>
                  <input 
                    type="text" 
                    autoFocus
                    required
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`Your ${selectedPlatform.name} API Key`}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b32f6] transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">API Secret</label>
                  <input 
                    type="password" 
                    required
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                    placeholder="Your API Secret"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b32f6] transition-colors"
                  />
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-lg p-3 border border-slate-200 dark:border-slate-800/50 flex items-start gap-2 mt-4">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Your API keys are encrypted locally before being transmitted and are never stored in plain text.
                  </p>
                </div>
                
                <button 
                  type="submit"
                  disabled={isConnecting || !apiKey.trim() || !apiSecret.trim()}
                  className="w-full mt-6 bg-[#5b32f6] hover:bg-[#4a26d7] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect Account'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Webhook Setup Modal */}
      {showWebhookSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowWebhookSetup(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#5b32f6]/10 flex items-center justify-center font-bold text-[#5b32f6] border border-[#5b32f6]/30">
                  <Webhook className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Custom Connecting App</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Push trade data via Webhooks API</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                If you have a custom <strong>connecting app</strong> or a platform that we don't natively support, you can push your trade data directly into your dashboard using our developer webhook endpoint.
              </div>

              <div>
                 <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Your Webhook Endpoint</h4>
                 <div className="flex items-center gap-2">
                    <input 
                      readOnly 
                      value={`https://${window.location.host}/api/webhooks/trades`} 
                      className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 font-mono text-xs text-slate-600 dark:text-slate-400 focus:outline-none"
                    />
                 </div>
              </div>

              <div>
                 <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Your User ID</h4>
                 <p className="text-xs text-slate-500 mb-2">Include this in the JSON payload so we know which account to update.</p>
                 <div className="flex items-center gap-2">
                    <input 
                      readOnly 
                      value={webhookUserId} 
                      className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 font-mono text-xs text-slate-600 dark:text-slate-400 focus:outline-none"
                    />
                 </div>
              </div>

              <div>
                 <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Downloadable Python Bridge (Example)</h4>
                 <p className="text-xs text-slate-500 mb-2">Run this locally if you are using CCXT or a local machine connected to a broker but cannot provide keys externally.</p>
                 <pre className="bg-slate-950 text-sky-400 p-4 rounded-xl text-xs overflow-x-auto font-mono border border-slate-800">
{`import requests
import time
import ccxt

# Setup the bridge locally
WEBHOOK_URL = "https://${window.location.host}/api/webhooks/trades"
USER_ID = "${webhookUserId}"

exchange = ccxt.binance({
   'apiKey': 'YOUR_LOCAL_API_KEY',
   'secret': 'YOUR_LOCAL_SECRET'
})

def sync_trades():
    print("Syncing trades...")
    trades = exchange.fetch_my_trades()
    
    # Format according to our dashboard
    payload = {
        "userId": USER_ID,
        "trades": []
    }
    
    for t in trades:
        payload["trades"].append({
            "id": t['id'], "date": t['datetime'],
            "account": "Local Bridge", "symbol": t['symbol'],
            "direction": "Long" if t['side'] == 'buy' else "Short",
            "entryPrice": t['price'], "exitPrice": t['price'],
            "contracts": t['amount'], "pnl": 0, "notes": "via Python App"
        })
        
    res = requests.post(WEBHOOK_URL, json=payload)
    print("Success:", res.status_code)

if __name__ == '__main__':
    sync_trades()
`}
                 </pre>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl relative">
            <button 
              onClick={() => setShowCSVModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#5b32f6]/10 flex items-center justify-center font-bold text-[#5b32f6] border border-[#5b32f6]/30">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Import CSV File</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Upload your exported trade history logs</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6 flex flex-col items-center text-center">
               <Upload className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-2" />
               <h4 className="text-lg font-medium text-slate-800 dark:text-slate-200">Select a CSV file to upload</h4>
               <p className="text-sm text-slate-500 max-w-sm mb-6">
                 We currently support generic CSV files and exported files from NinjaTrader, Tradovate, and ThinkOrSwim.
               </p>

               <label className="w-full relative group cursor-pointer">
                  <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                  <div className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl group-hover:border-[#5b32f6] group-hover:bg-[#5b32f6]/5 transition-all">
                     <span className="font-semibold text-[#5b32f6]">Click to browse</span>
                     <span className="text-slate-500 ml-2">or drag and drop</span>
                  </div>
               </label>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
