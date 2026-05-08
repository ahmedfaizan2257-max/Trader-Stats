export type Direction = 'Long' | 'Short';

export interface Trade {
  id: string;
  date: string; // YYYY-MM-DD format
  symbol: string;
  direction: Direction;
  entryPrice: number;
  exitPrice: number;
  contracts: number;
  pnl: number; // For simplicity, calculated P&L 
  notes: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  notes: string;
  emotion: string; // emoji
  followedPlan: 'Yes' | 'No' | 'Partial';
}

export type Tab = 'dashboard' | 'log' | 'feedback' | 'journal' | 'analytics' | 'integrations';
