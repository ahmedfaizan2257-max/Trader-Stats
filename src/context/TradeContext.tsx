import { createContext, useContext, useEffect, useState } from 'react';
import { Trade, JournalEntry, Goal, TradingAccount } from '../types';
import { useAuth } from './AuthContext';
import { collection, doc, onSnapshot, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export function TradeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
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

  useEffect(() => {
    if (!user) {
      setTrades([]);
      setJournalEntries([]);
      setGoals([]);
      setAccounts([]);
      return;
    }
    
    const unsubscribeTrades = onSnapshot(collection(db, 'users', user.uid, 'trades'), (snapshot) => {
       const userTrades = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Trade));
       setTrades(userTrades.sort((a,b) => a.date.localeCompare(b.date)));
    }, (error) => {
       console.error("Trades snapshot error:", error);
    });

    const unsubscribeJournal = onSnapshot(collection(db, 'users', user.uid, 'journal'), (snapshot) => {
       const userJournal = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as JournalEntry));
       setJournalEntries(userJournal.sort((a,b) => a.date.localeCompare(b.date)));
    }, (error) => {
       console.error("Journal snapshot error:", error);
    });

    const unsubscribeGoals = onSnapshot(collection(db, 'users', user.uid, 'goals'), (snapshot) => {
       const userGoals = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Goal));
       setGoals(userGoals.sort((a,b) => a.startDate.localeCompare(b.startDate)));
    }, (error) => {
       console.error("Goals snapshot error:", error);
    });

    const unsubscribeAccounts = onSnapshot(collection(db, 'users', user.uid, 'accounts'), (snapshot) => {
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
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('TradeTrack_trades', JSON.stringify(trades));
    }
  }, [trades, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('TradeTrack_journal', JSON.stringify(journalEntries));
    }
  }, [journalEntries, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('TradeTrack_goals', JSON.stringify(goals));
    }
  }, [goals, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('TradeTrack_accounts', JSON.stringify(accounts));
    }
  }, [accounts, user]);

  const addTrade = async (trade: Trade) => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid, 'trades', trade.id), trade);
    } else {
      setTrades(prev => [...prev, trade].sort((a,b) => a.date.localeCompare(b.date)));
    }
  };

  const deleteTrade = async (id: string) => {
    if (user) {
      await deleteDoc(doc(db, 'users', user.uid, 'trades', id));
    } else {
      setTrades(prev => prev.filter(t => t.id !== id));
    }
  };

  const clearAllTrades = async () => {
    if (user) {
      const batch = writeBatch(db);
      trades.forEach(t => {
         batch.delete(doc(db, 'users', user.uid, 'trades', t.id));
      });
      await batch.commit();
    } else {
      setTrades([]);
    }
  };
  
  const addJournalEntry = async (entry: JournalEntry) => {
    if (user) {
      // Use date as standard ID to maintain 1 entry per day
      await setDoc(doc(db, 'users', user.uid, 'journal', entry.date), entry);
    } else {
      setJournalEntries(prev => {
        const existingFilter = prev.filter(e => e.date !== entry.date);
        return [...existingFilter, entry].sort((a,b) => a.date.localeCompare(b.date));
      });
    }
  }

  const addGoal = async (goal: Goal) => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid, 'goals', goal.id), goal);
    } else {
      setGoals(prev => [...prev, goal].sort((a,b) => a.startDate.localeCompare(b.startDate)));
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid, 'goals', id), updates, { merge: true });
    } else {
       setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    }
  }

  const deleteGoal = async (id: string) => {
    if (user) {
      await deleteDoc(doc(db, 'users', user.uid, 'goals', id));
    } else {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  const addAccount = async (account: TradingAccount) => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid, 'accounts', account.id), account);
    } else {
      setAccounts(prev => [...prev, account].sort((a,b) => a.createdAt.localeCompare(b.createdAt)));
    }
  };

  const updateAccount = async (id: string, updates: Partial<TradingAccount>) => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid, 'accounts', id), updates, { merge: true });
    } else {
       setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    }
  }

  const deleteAccount = async (id: string) => {
    if (user) {
      await deleteDoc(doc(db, 'users', user.uid, 'accounts', id));
    } else {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <TradeContext.Provider value={{
      trades, addTrade, deleteTrade, clearAllTrades,
      journalEntries, addJournalEntry,
      goals, addGoal, updateGoal, deleteGoal,
      accounts, addAccount, updateAccount, deleteAccount
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
