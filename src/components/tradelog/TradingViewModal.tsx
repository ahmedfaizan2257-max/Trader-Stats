import { useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';

export function TradingViewModal({ symbol, onClose }: { symbol: string, onClose: () => void }) {
  const containerId = 'tv_chart_container';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tvScript: HTMLScriptElement | null = null;

    const initWidget = () => {
      if (typeof (window as any).TradingView !== 'undefined') {
        new (window as any).TradingView.widget({
          "autosize": true,
          "symbol": symbol,
          "interval": "60",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "backgroundColor": "#0b0f19",
          "gridColor": "#1f2937",
          "hide_top_toolbar": false,
          "hide_legend": false,
          "save_image": false,
          "container_id": containerId,
        });
      }
    };

    if (!(window as any).TradingView) {
      tvScript = document.createElement('script');
      tvScript.src = 'https://s3.tradingview.com/tv.js';
      tvScript.async = true;
      tvScript.onload = initWidget;
      document.body.appendChild(tvScript);
    } else {
      initWidget();
    }

    return () => {
      // Cleanup script during unmount if we added it
      if (tvScript && document.body.contains(tvScript)) {
        document.body.removeChild(tvScript);
      }
    };
  }, [symbol]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 md:p-8 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-[#070a11]">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Reviewing Trade: {symbol}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 w-full h-full relative" id={containerId} ref={containerRef}>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 z-[-1]">
             <Loader2 className="w-8 h-8 animate-spin mb-4" />
             Loading Chart...
          </div>
        </div>
      </div>
    </div>
  );
}
