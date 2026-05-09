import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import ccxt from 'ccxt';
import path from 'path';
import crypto from 'crypto';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API route for integrations
  app.post('/api/fetch-trades', async (req, res) => {
    const { platform, apiKey, apiSecret, environment } = req.body;

    if (!platform || !apiKey || !apiSecret) {
      return res.status(400).json({ error: 'Missing required credentials or platform' });
    }

    try {
      let exchangeName = platform.toLowerCase();
      // Handle CCXT supported exchanges (Binance, Bybit)
      if (['binance', 'bybit'].includes(exchangeName)) {
        // dynamic CCXT instanciation
        const exchangeClass = (ccxt as any)[exchangeName];
        if (!exchangeClass) throw new Error("Unsupported exchange via ccxt");

        const exchange = new exchangeClass({
          apiKey,
          secret: apiSecret,
          enableRateLimit: true,
        });

        // For demo environments, enable sandbox/testnet mode if supported
        if (environment === 'demo') {
          exchange.setSandboxMode(true);
        }

        // Fetch user trades
        // We'll fetch generally recent trades on the user's account
        const trades = await exchange.fetchMyTrades();
        
        // Map to our Trade structure
        const mappedTrades = trades.map((t: any) => {
          let direction = 'Long';
          let pnl = 0;
          
          if (t.side === 'buy') {
            direction = 'Long';
          } else {
            direction = 'Short';
          }

          // Estimating PnL based on fees/cost if real PnL is nested or missing (ccxt standardizes some info but not closed trade PnL in all fetchMyTrades)
          pnl = t.info?.realizedPnl ? parseFloat(t.info.realizedPnl) : 0;

          return {
            id: t.id || crypto.randomUUID(),
            date: t.datetime ? t.datetime.split('T')[0] : new Date().toISOString().split('T')[0],
            account: exchangeName.toUpperCase(),
            symbol: t.symbol,
            direction,
            entryPrice: t.price || 0,
            exitPrice: t.price || 0, // Without full orders logic we use entry price again 
            contracts: t.amount || 1,
            pnl,
            notes: `Auto-synced from ${platform}`
          };
        });

        res.json({ trades: mappedTrades });
      } else {
        // NinjaTrader, Tradovate, etc don't have standard REST APIs like this or are unsupported by ccxt.
        // We'll return mock data for them as a fallback since they are not in CCXT
        res.status(400).json({ error: `Real API integration for ${platform} is unsupported in this preview.` });
      }
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || 'Failed to connect to exchange' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:\${PORT}`);
  });
}

startServer();
