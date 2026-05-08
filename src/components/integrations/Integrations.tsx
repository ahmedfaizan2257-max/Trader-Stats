import { useState } from 'react';
import { Link2, Shield, Search, X, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const platforms = [
  { id: 'ninjatrader', name: 'NinjaTrader', icon: 'N', status: 'available' },
  { id: 'tradovate', name: 'Tradovate', icon: 'T', status: 'available' },
  { id: 'binance', name: 'Binance', icon: 'B', status: 'available' },
  { id: 'bybit', name: 'Bybit', icon: 'B', status: 'available' },
  { id: 'interactivebrokers', name: 'Interactive Brokers', icon: 'IB', status: 'coming_soon' },
  { id: 'tdameritrade', name: 'Schwab', icon: 'S', status: 'coming_soon' },
];

export function Integrations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<typeof platforms[0] | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  const filteredPlatforms = platforms.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const [platformToDisconnect, setPlatformToDisconnect] = useState<string | null>(null);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatform) return;
    
    setIsConnecting(true);
    
    // Simulate API connection verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setConnectedPlatforms(prev => [...prev, selectedPlatform.id]);
    setIsConnecting(false);
    setSelectedPlatform(null);
    setApiKey('');
    setApiSecret('');
  };

  const handleDisconnect = (e: React.MouseEvent, platformId: string) => {
    e.stopPropagation();
    if (platformToDisconnect === platformId) {
      setConnectedPlatforms(prev => prev.filter(id => id !== platformId));
      setPlatformToDisconnect(null);
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
            API Integrations
            <span className="bg-[#5b32f6]/10 text-[#5b32f6] text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider">Beta</span>
          </h2>
          <p className="text-slate-400 mt-1 text-sm">Connect your brokerages using Read-Only API Keys to auto-sync trades.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-start gap-4 mb-8">
          <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-200">How do free API integrations work?</h3>
            <p className="text-slate-400 text-sm mt-1 mb-4 leading-relaxed max-w-2xl">
              To avoid expensive middle-man services, we connect directly securely to your exchange via API. You will need to log into your brokerage and generate <strong>Read-Only API Keys</strong>. These keys allow our system to sync your trade history, but mathematically prevent us from placing trades or withdrawing funds.
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
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#5b32f6] transition-colors"
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
                  "bg-slate-950 border p-5 rounded-xl flex items-center justify-between transition-colors group",
                  platform.status === 'available' && !isConnected ? "border-slate-800 hover:border-slate-600 cursor-pointer" : "border-slate-800",
                  isConnected && "border-emerald-500/30 bg-emerald-500/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center font-bold border transition-colors",
                    isConnected 
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                      : "bg-slate-900 text-slate-300 border-slate-800 group-hover:border-slate-600"
                  )}>
                    {platform.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-200">{platform.name}</h4>
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
                      platformToDisconnect === platform.id ? "bg-red-500 text-white" : "text-slate-500 hover:text-red-400"
                    )}
                  >
                    {platformToDisconnect === platform.id ? "Confirm" : "Disconnect"}
                  </button>
                ) : (
                  <button className={cn(
                    "p-2 rounded-lg transition-colors border",
                    platform.status === 'available' 
                      ? "bg-[#5b32f6]/10 text-[#5b32f6] border-[#5b32f6]/20 group-hover:bg-[#5b32f6] group-hover:text-white"
                      : "bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed"
                  )}>
                    <Link2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Connection Modal */}
      {selectedPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setSelectedPlatform(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center font-bold text-[#5b32f6] border border-slate-800">
                  {selectedPlatform.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Connect {selectedPlatform.name}</h3>
                  <p className="text-sm text-slate-400">Enter your read-only API credentials</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleConnect} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Environment</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" className="bg-[#5b32f6]/10 text-[#5b32f6] border border-[#5b32f6]/30 py-2 rounded-lg text-sm font-medium">Live</button>
                  <button type="button" className="bg-slate-950 text-slate-500 border border-slate-800 py-2 rounded-lg text-sm font-medium hover:border-slate-700">Demo / Simulation</button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">API Key</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Your ${selectedPlatform.name} API Key`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b32f6] transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">API Secret</label>
                <input 
                  type="password" 
                  required
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  placeholder="Your API Secret"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#5b32f6] transition-colors"
                />
              </div>
              
              <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50 flex items-start gap-2 mt-4">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400">
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
          </div>
        </div>
      )}
    </div>
  );
}
