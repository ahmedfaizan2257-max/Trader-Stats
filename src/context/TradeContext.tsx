import { createContext, useContext, useEffect, useState } from 'react';
import { Trade, JournalEntry } from '../types';

interface TradeContextType {
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  deleteTrade: (id: string) => void;
  clearAllTrades: () => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export function TradeProvider({ children }: { children: React.ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('TradeTrack_trades');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((t: any) => ({
          ...t,
          pnl: typeof t.pnl === 'number' && !isNaN(t.pnl) ? t.pnl : 0,
          entryPrice: typeof t.entryPrice === 'number' && !isNaN(t.entryPrice) ? t.entryPrice : 0,
          exitPrice: typeof t.exitPrice === 'number' && !isNaN(t.exitPrice) ? t.exitPrice : 0,
          contracts: typeof t.contracts === 'number' && !isNaN(t.contracts) ? t.contracts : 1
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('TradeTrack_journal');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('TradeTrack_trades', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem('TradeTrack_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  const addTrade = (trade: Trade) => setTrades(prev => [...prev, trade].sort((a,b) => a.date.localeCompare(b.date)));
  const deleteTrade = (id: string) => setTrades(prev => prev.filter(t => t.id !== id));
  const clearAllTrades = () => setTrades([]);
  
  const addJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => {
      const existingFilter = prev.filter(e => e.date !== entry.date);
      return [...existingFilter, entry].sort((a,b) => a.date.localeCompare(b.date));
    });
  }

  return (
    <TradeContext.Provider value={{ trades, addTrade, deleteTrade, clearAllTrades, journalEntries, addJournalEntry }}>
      {children}
    </TradeContext.Provider>
  );
}

export function useTrades() {
  const context = useContext(TradeContext);
  if (!context) throw new Error('useTrades must be used within TradeProvider');
  return context;
}
