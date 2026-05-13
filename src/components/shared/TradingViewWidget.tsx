import { useEffect, useRef, useMemo } from 'react';
import { Loader2 } from 'lucide-react';

interface TradingViewWidgetProps {
  symbol?: string;
  interval?: string;
  height?: string | number;
}

// Map common trade log symbols to TradingView format
const getTVSymbol = (sym: string) => {
  const upper = sym.toUpperCase();
  if (upper.includes('ES')) return 'CME_MINI:ES1!';
  if (upper.includes('NQ')) return 'CME_MINI:NQ1!';
  if (upper.includes('YM')) return 'CBOT_MINI:YM1!';
  if (upper.includes('RTY')) return 'CME_MINI:RTY1!';
  if (upper.includes('CL')) return 'NYMEX:CL1!';
  if (upper.includes('GC')) return 'COMEX:GC1!';
  // Fallback to exactly what the user passed, or AAPL as last resort
  return upper || 'NASDAQ:AAPL';
};

export function TradingViewWidget({ symbol = 'NASDAQ:AAPL', interval = '60', height = 500 }: TradingViewWidgetProps) {
  const containerId = useMemo(() => `tv_chart_container_${Math.random().toString(36).substring(7)}`, []);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tvScript: HTMLScriptElement | null = null;
    
    // Clear the container before initializing a new widget
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const initWidget = () => {
      if (typeof (window as any).TradingView !== 'undefined' && document.getElementById(containerId)) {
        new (window as any).TradingView.widget({
          "autosize": true,
          "symbol": getTVSymbol(symbol),
          "interval": interval,
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "backgroundColor": "#09090b",
          "gridColor": "#1f2937",
          "hide_top_toolbar": false,
          "hide_legend": false,
          "save_image": false,
          "container_id": containerId,
        });
      }
    };

    if (!(window as any).TradingView) {
      const existingScript = document.getElementById('tradingview-widget-script') as HTMLScriptElement;
      if (!existingScript) {
        tvScript = document.createElement('script');
        tvScript.id = 'tradingview-widget-script';
        tvScript.src = 'https://s3.tradingview.com/tv.js';
        tvScript.async = true;
        tvScript.onload = initWidget;
        document.head.appendChild(tvScript);
      } else {
        existingScript.addEventListener('load', initWidget);
      }
    } else {
      initWidget();
    }

    return () => {
      // Clean up the widget div contents when component unmounts or symbol changes
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, interval, containerId]);

  return (
    <div className="w-full relative" style={{ height }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none">
         <Loader2 className="w-8 h-8 animate-spin mb-4" />
         Loading Chart...
      </div>
      <div id={containerId} ref={containerRef} className="absolute inset-0 z-10" />
    </div>
  );
}
