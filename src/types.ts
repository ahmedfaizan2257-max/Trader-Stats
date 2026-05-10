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
  account?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  notes: string;
  emotion: string; // emoji
  followedPlan: 'Yes' | 'No' | 'Partial';
}

export interface TradingAccount {
  id: string;
  name: string;
  size: number;
  cost: number;
  status: 'Active' | 'Funded' | 'Blown' | 'Payout';
  createdAt: string;
}

export type Tab = 'dashboard' | 'log' | 'feedback' | 'journal' | 'analytics' | 'calendar' | 'integrations' | 'goals' | 'accounts' | 'payouts' | 'customizer' | 'sharing' | 'student-dashboard' | 'settings';

export type GoalType = 'PNL TARGET' | 'BALANCE GROWTH' | 'TRADE LIMIT' | 'PAYOUT' | 'BEHAVIORAL';
export type GoalStatus = 'Active' | 'Completed' | 'Failed' | 'Archived';
export type GoalPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM';

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  account: string;
  period: GoalPeriod;
  targetValue: number;
  currentValue?: number; // Calculated or manual
  startDate: string; // YYYY-MM-DD
  endDate?: string;  // YYYY-MM-DD
  status: GoalStatus;
}
