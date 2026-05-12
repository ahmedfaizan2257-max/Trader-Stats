import { createContext, useContext, useEffect, useState } from 'react';
import { Trade, JournalEntry, Goal, TradingAccount } from '../types';
import { useAuth } from './AuthContext';
import { collection, doc, onSnapshot, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CustomSettings {
  bgImage: string;
  hexColor: string;
  angle: number;
  opacity: number;
  theme: string;
}

interface TradeContextType {
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  deleteTrade: (id: string) => void;
  clearAllTrades: () => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  accounts: TradingAccount[];
  addAccount: (account: TradingAccount) => void;
  updateAccount: (id: string, updates: Partial<TradingAccount>) => void;
  deleteAccount: (id: string) => void;
  customSettings: CustomSettings;
  updateCustomSettings: (settings: CustomSettings) => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export function TradeProvider({ children }: { children: React.ReactNode }) {
  const { user, viewingUserId } = useAuth();
  
  const targetUid = viewingUserId || user?.uid;

  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('TradeTrack_trades');
    return saved ? JSON.parse(saved) : [];
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('TradeTrack_journal');
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('TradeTrack_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [accounts, setAccounts] = useState<TradingAccount[]>(() => {
    const saved = localStorage.getItem('TradeTrack_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  const [customSettings, setCustomSettings] = useState<CustomSettings>(() => {
    const saved = localStorage.getItem('TradeTrack_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      bgImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop',
      hexColor: '#7C3AED',
      angle: 135,
      opacity: 85,
      theme: 'PURPLE TRIANGLE',
    };
  });

  useEffect(() => {
    if (!targetUid) {
      setTrades([]);
      setJournalEntries([]);
      setGoals([]);
      setAccounts([]);
      return;
    }
    
    const unsubscribeTrades = onSnapshot(collection(db, 'users', targetUid, 'trades'), (snapshot) => {
       const userTrades = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Trade));
       setTrades(userTrades.sort((a,b) => a.date.localeCompare(b.date)));
    }, (error) => {
       console.error("Trades snapshot error:", error);
    });

    const unsubscribeJournal = onSnapshot(collection(db, 'users', targetUid, 'journal'), (snapshot) => {
       const userJournal = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as JournalEntry));
       setJournalEntries(userJournal.sort((a,b) => a.date.localeCompare(b.date)));
    }, (error) => {
       console.error("Journal snapshot error:", error);
    });

    const unsubscribeGoals = onSnapshot(collection(db, 'users', targetUid, 'goals'), (snapshot) => {
       const userGoals = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Goal));
       setGoals(userGoals.sort((a,b) => a.startDate.localeCompare(b.startDate)));
    }, (error) => {
       console.error("Goals snapshot error:", error);
    });

    const unsubscribeAccounts = onSnapshot(collection(db, 'users', targetUid, 'accounts'), (snapshot) => {
       const userAccounts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as TradingAccount));
       setAccounts(userAccounts.sort((a,b) => a.createdAt.localeCompare(b.createdAt)));
    }, (error) => {
       console.error("Accounts snapshot error:", error);
    });

    return () => {
      unsubscribeTrades();
      unsubscribeJournal();
      unsubscribeGoals();
      unsubscribeAccounts();
    };
  }, [targetUid]);

  useEffect(() => {
    if (!targetUid) {
      localStorage.setItem('TradeTrack_trades', JSON.stringify(trades));
    }
  }, [trades, targetUid]);

  useEffect(() => {
    if (!targetUid) {
      localStorage.setItem('TradeTrack_journal', JSON.stringify(journalEntries));
    }
  }, [journalEntries, targetUid]);

  useEffect(() => {
    if (!targetUid) {
      localStorage.setItem('TradeTrack_goals', JSON.stringify(goals));
    }
  }, [goals, targetUid]);

  useEffect(() => {
    if (!targetUid) {
      localStorage.setItem('TradeTrack_accounts', JSON.stringify(accounts));
    }
  }, [accounts, targetUid]);

  useEffect(() => {
    localStorage.setItem('TradeTrack_settings', JSON.stringify(customSettings));
  }, [customSettings]);

  const updateCustomSettings = (settings: CustomSettings) => {
    setCustomSettings(settings);
  };

  const addTrade = async (trade: Trade) => {
    if (targetUid) {
      await setDoc(doc(db, 'users', targetUid, 'trades', trade.id), trade);
    } else {
      setTrades(prev => [...prev, trade].sort((a,b) => a.date.localeCompare(b.date)));
    }
  };

  const deleteTrade = async (id: string) => {
    if (targetUid) {
      await deleteDoc(doc(db, 'users', targetUid, 'trades', id));
    } else {
      setTrades(prev => prev.filter(t => t.id !== id));
    }
  };

  const clearAllTrades = async () => {
    if (targetUid) {
      const batch = writeBatch(db);
      trades.forEach(t => {
         batch.delete(doc(db, 'users', targetUid, 'trades', t.id));
      });
      await batch.commit();
    } else {
      setTrades([]);
    }
  };
  
  const addJournalEntry = async (entry: JournalEntry) => {
    if (targetUid) {
      // Use date as standard ID to maintain 1 entry per day
      await setDoc(doc(db, 'users', targetUid, 'journal', entry.date), entry);
    } else {
      setJournalEntries(prev => {
        const existingFilter = prev.filter(e => e.date !== entry.date);
        return [...existingFilter, entry].sort((a,b) => a.date.localeCompare(b.date));
      });
    }
  }

  const addGoal = async (goal: Goal) => {
    if (targetUid) {
      await setDoc(doc(db, 'users', targetUid, 'goals', goal.id), goal);
    } else {
      setGoals(prev => [...prev, goal].sort((a,b) => a.startDate.localeCompare(b.startDate)));
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (targetUid) {
      await setDoc(doc(db, 'users', targetUid, 'goals', id), updates, { merge: true });
    } else {
       setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    }
  }

  const deleteGoal = async (id: string) => {
    if (targetUid) {
      await deleteDoc(doc(db, 'users', targetUid, 'goals', id));
    } else {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  const addAccount = async (account: TradingAccount) => {
    if (targetUid) {
      await setDoc(doc(db, 'users', targetUid, 'accounts', account.id), account);
    } else {
      setAccounts(prev => [...prev, account].sort((a,b) => a.createdAt.localeCompare(b.createdAt)));
    }
  };

  const updateAccount = async (id: string, updates: Partial<TradingAccount>) => {
    if (targetUid) {
      await setDoc(doc(db, 'users', targetUid, 'accounts', id), updates, { merge: true });
    } else {
       setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    }
  }

  const deleteAccount = async (id: string) => {
    if (targetUid) {
      await deleteDoc(doc(db, 'users', targetUid, 'accounts', id));
    } else {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <TradeContext.Provider value={{
      trades, addTrade, deleteTrade, clearAllTrades,
      journalEntries, addJournalEntry,
      goals, addGoal, updateGoal, deleteGoal,
      accounts, addAccount, updateAccount, deleteAccount,
      customSettings, updateCustomSettings
    }}>
      {children}
    </TradeContext.Provider>
  );
}

export function useTrades() {
  const context = useContext(TradeContext);
  if (!context) throw new Error('useTrades must be used within TradeProvider');
  return context;
}
