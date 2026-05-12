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

  // Tradovate OAuth exchange endpoint
  app.post('/api/auth/tradovate/callback', async (req, res) => {
    const { code, redirectUri } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Missing OAuth code' });
    }

    const clientId = process.env.VITE_TRADOVATE_CLIENT_ID;
    const clientSecret = process.env.TRADOVATE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ 
        error: 'Missing VITE_TRADOVATE_CLIENT_ID or TRADOVATE_CLIENT_SECRET in .env file on the server. Please add them to connect live.' 
      });
    }

    try {
      // 1. Exchange code for an Access Token securely via server-to-server request
      const tokenResponse = await fetch('https://live.tradovate.com/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri
        }).toString()
      });

      if (!tokenResponse.ok) {
         const errData = await tokenResponse.json();
         throw new Error(`Tradovate API Error: ${errData.error_description || errData.error || tokenResponse.statusText}`);
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
      
      // 2. We now have the access token! In a real application, you'd store it in Firebase for this user.
      // 3. Optional: Automatically pull recent trades immediately using the access token.
      
      const accountsResponse = await fetch('https://live.tradovate.com/v1/account/list', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!accountsResponse.ok) {
        // If it fails to fetch accounts, still return success for OAuth, but no trades pulled
        return res.json({ token: accessToken, trades: [] });
      }
      
      // Example fetching code (needs adaptation based on what tradovate requires)
      /* 
      const accounts = await accountsResponse.json();
      const accountId = accounts[0]?.id; // taking the first account for demo

      const positionsResp = await fetch(`https://live.tradovate.com/v1/position/list?accountId=${accountId}`, { ... });
      ... map trades ...
      */

      // Currently return a placeholder to signal success until real trade pulling logic is finalized
      res.json({ token: accessToken, trades: [] });

    } catch (err: any) {
      console.error('Tradovate OAuth error:', err);
      res.status(500).json({ error: err.message || 'Failed to authorize with Tradovate' });
    }
  });

  // Webhook endpoint to receive trades from a connecting app
  app.post('/api/webhooks/trades', async (req, res) => {
    const { userId, trades, signature } = req.body;

    if (!userId || !trades) {
      return res.status(400).json({ error: 'Missing userId or trades in webhook payload' });
    }

    try {
      // In a real application, you would:
      // 1. Verify the webhook signature to ensure it came from your connecting app
      // 2. Validate the trades payload structure
      // 3. Save the trades to your database (e.g., Firestore using Firebase Admin SDK)
      // Example of expected trade structure:
      // trades: [{ id, date, account, symbol, direction, entryPrice, exitPrice, contracts, pnl, notes }]
      
      console.log(`[Webhook] Received ${trades.length} trades for user ${userId}`);
      console.dir(trades, { depth: null });

      // Here you would connect to Firebase Admin to securely save the data directly into the user's database.
      // e.g., await admin.firestore().collection('users').doc(userId).collection('trades').add(...)

      res.status(200).json({ success: true, message: 'Webhook received and processed' });
    } catch (err: any) {
      console.error('[Webhook Error]', err);
      res.status(500).json({ error: 'Failed to process webhook', details: err.message });
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
