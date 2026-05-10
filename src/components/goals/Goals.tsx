import { useState, useMemo } from 'react';
import { useTrades } from '../../context/TradeContext';
import { Goal, GoalType, GoalStatus, GoalPeriod } from '../../types';
import { Plus, RefreshCw, X, Search, CheckCircle2, XCircle, Archive, Target, Activity } from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import { format, isWithinInterval, parseISO } from 'date-fns';

const GOAL_TYPES: GoalType[] = ['PNL TARGET', 'BALANCE GROWTH', 'TRADE LIMIT', 'PAYOUT', 'BEHAVIORAL'];
const GOAL_STATUSES: GoalStatus[] = ['Active', 'Completed', 'Failed', 'Archived'];
const GOAL_PERIODS: GoalPeriod[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'CUSTOM'];

export function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal, trades } = useTrades();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<GoalStatus | 'ALL'>('Active');
  const [selectedType, setSelectedType] = useState<GoalType | 'ALL'>('ALL');

  // Recalculate progress for all active goals
  const handleRecalculate = () => {
    goals.forEach(goal => {
      if (goal.status !== 'Active') return;
      
      const start = parseISO(goal.startDate);
      const end = goal.endDate ? parseISO(goal.endDate) : new Date(2100, 0, 1); // some far future date
      
      const relevantTrades = trades.filter(t => {
        if (goal.account && goal.account !== 'ALL' && t.account !== goal.account) return false;
        const tradeDate = parseISO(t.date);
        return isWithinInterval(tradeDate, { start, end });
      });

      let currentVal = 0;
      switch (goal.type) {
        case 'PNL TARGET':
        case 'BALANCE GROWTH':
        case 'PAYOUT':
          currentVal = relevantTrades.reduce((sum, t) => sum + t.pnl, 0);
          break;
        case 'TRADE LIMIT':
          currentVal = relevantTrades.length;
          break;
        case 'BEHAVIORAL':
          currentVal = 0; // Manual for now
          break;
      }

      updateGoal(goal.id, { currentValue: currentVal });
    });
  };

  const filteredGoals = useMemo(() => {
    return goals.filter(goal => {
      if (selectedStatus !== 'ALL' && goal.status !== selectedStatus) return false;
      if (selectedType !== 'ALL' && goal.type !== selectedType) return false;
      if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        return goal.title.toLowerCase().includes(lowerQ) || goal.description.toLowerCase().includes(lowerQ) || goal.account.toLowerCase().includes(lowerQ);
      }
      return true;
    });
  }, [goals, selectedStatus, selectedType, searchQuery]);

  const activeCount = goals.filter(g => g.status === 'Active').length;
  const completedCount = goals.filter(g => g.status === 'Completed').length;
  const totalProgress = goals.reduce((sum, g) => sum + (g.currentValue || 0), 0);

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Goals</h2>
           <p className="text-slate-500 dark:text-slate-400 mt-1">Track your trading goals and measure your progress</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRecalculate}
            className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800/80 rounded-xl transition-colors text-sm font-semibold text-slate-700 dark:text-white"
          >
            <RefreshCw className="w-4 h-4" /> Recalculate All
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#5b32f6] hover:bg-[#4a26d7] text-white rounded-xl transition-colors text-sm font-semibold shadow-md shadow-[#5b32f6]/20"
          >
            <Plus className="w-4 h-4" /> Create Goal
          </button>
        </div>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Active Goals" value={activeCount.toString()} />
        <StatCard label="Completed" value={completedCount.toString()} />
        <StatCard label="Total Progress" value={formatCurrency(totalProgress)} valueColor="text-emerald-500" />
        <StatCard label="Total Goals" value={goals.length.toString()} />
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="relative max-w-xl">
           <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search goals by title, description, or account..."
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
             className="w-full bg-slate-100 dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b32f6]/50"
           />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold mr-2">Status:</span>
            <div className="flex flex-wrap gap-2">
              <FilterPill 
                active={selectedStatus === 'Active'} 
                onClick={() => setSelectedStatus('Active')} 
                icon={Target}
                label="Active" 
              />
              <FilterPill 
                active={selectedStatus === 'Completed'} 
                onClick={() => setSelectedStatus('Completed')} 
                icon={CheckCircle2}
                label="Completed" 
              />
              <FilterPill 
                active={selectedStatus === 'Failed'} 
                onClick={() => setSelectedStatus('Failed')} 
                icon={XCircle}
                label="Failed" 
              />
              <FilterPill 
                active={selectedStatus === 'Archived'} 
                onClick={() => setSelectedStatus('Archived')} 
                icon={Archive}
                label="Archived" 
              />
              <button 
                onClick={() => setSelectedStatus('ALL')}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white px-2 py-1 text-xs"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2 text-sm pt-2">
          <span className="text-slate-500 font-semibold mr-2">Type:</span>
          <div className="flex flex-wrap gap-2">
             <Pill active={selectedType === 'ALL'} onClick={() => setSelectedType('ALL')} label="All Types" />
             {GOAL_TYPES.map(type => (
               <Pill key={type} active={selectedType === type} onClick={() => setSelectedType(type)} label={type} />
             ))}
          </div>
        </div>
      </div>

      {/* Goal List */}
      <div className={cn(
        "min-h-[300px] rounded-3xl p-6",
        filteredGoals.length === 0 ? "bg-slate-200/50 dark:bg-[#161722] flex items-center justify-center border border-slate-200 dark:border-[#2b2d3d]" : "flex flex-col"
      )}>
        {filteredGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto p-12">
             <div className="w-16 h-16 bg-slate-300/50 dark:bg-[#20212f] rounded-full flex items-center justify-center mb-6 text-slate-500 dark:text-slate-400">
                <Target className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">No goals found</h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm">
               Try adjusting your filters or search query
             </p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} onDelete={() => deleteGoal(goal.id)} onStatusChange={(s) => updateGoal(goal.id, {status: s})} />
            ))}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateGoalModal onClose={() => setIsCreateModalOpen(false)} onSave={addGoal} />
      )}
    </div>
  );
}

function StatCard({ label, value, valueColor = "text-slate-900 dark:text-white" }: { label: string, value: string, valueColor?: string }) {
  return (
    <div className="bg-white dark:bg-[#111113] border shadow-sm border-[#5b32f6]/40 dark:shadow-[0_0_15px_rgba(91,50,246,0.15)] p-5 rounded-2xl flex flex-col hover:border-[#5b32f6]/80 transition-colors">
      <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-2">{label}</span>
      <span className={cn("text-3xl font-bold font-mono tracking-tight", valueColor)}>{value}</span>
    </div>
  );
}

function FilterPill({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border",
        active 
          ? "bg-white dark:bg-white text-slate-900 dark:text-slate-900 border-transparent shadow-sm" 
          : "bg-transparent text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function Pill({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors border",
        active 
          ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white border-transparent" 
          : "bg-transparent text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50"
      )}
    >
      {label}
    </button>
  );
}

function GoalCard({ goal, onDelete, onStatusChange }: { goal: Goal, onDelete: () => void, onStatusChange: (s: GoalStatus) => void }) {
  const progress = Math.min(100, Math.max(0, ((goal.currentValue || 0) / goal.targetValue) * 100));
  
  return (
    <div className={cn(
      "bg-white dark:bg-[#111113] border p-5 rounded-2xl flex flex-col gap-4 shadow-sm transition-all hover:shadow-md",
      goal.status === 'Active' ? "border-[#5b32f6]/40 dark:shadow-[0_0_15px_rgba(91,50,246,0.08)]" : "border-slate-200 dark:border-slate-800"
    )}>
       <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] font-bold bg-[#5b32f6]/10 text-[#5b32f6] px-2 py-0.5 rounded-full uppercase tracking-wider">
                 {goal.type}
               </span>
               <span className={cn(
                 "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                 goal.status === 'Active' ? "bg-amber-500/10 text-amber-500" :
                 goal.status === 'Completed' ? "bg-emerald-500/10 text-emerald-500" :
                 goal.status === 'Failed' ? "bg-rose-500/10 text-rose-500" :
                 "bg-slate-500/10 text-slate-500"
               )}>
                 {goal.status}
               </span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{goal.title}</h4>
            {goal.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{goal.description}</p>}
          </div>
          <button onClick={onDelete} className="text-slate-400 hover:text-rose-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
       </div>

       <div>
          <div className="flex items-end justify-between font-mono text-sm mb-2">
            <span className="font-bold text-lg text-slate-900 dark:text-white">
              {goal.type === 'TRADE LIMIT' ? goal.currentValue : formatCurrency(goal.currentValue || 0)}
            </span>
            <span className="text-slate-500">
               / {goal.type === 'TRADE LIMIT' ? goal.targetValue : formatCurrency(goal.targetValue)}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
             <div 
               className={cn("h-full rounded-full", goal.status === 'Failed' ? 'bg-rose-500' : 'bg-[#5b32f6]')} 
               style={{width: `${progress}%`}}
             />
          </div>
       </div>

       <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/50">
          <div className="text-xs text-slate-500">
             {goal.startDate} {goal.endDate ? `to ${goal.endDate}` : ''}
          </div>
          {goal.status === 'Active' && progress >= 100 && (
             <button onClick={() => onStatusChange('Completed')} className="text-xs font-bold text-emerald-500 hover:text-emerald-400">
               Mark Completed
             </button>
          )}
       </div>
    </div>
  )
}

function CreateGoalModal({ onClose, onSave }: { onClose: () => void, onSave: (goal: Goal) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<GoalType>('PNL TARGET');
  const [account, setAccount] = useState('ALL');
  const [period, setPeriod] = useState<GoalPeriod>('MONTHLY');
  const [targetValue, setTargetValue] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState('');

  const handleSave = () => {
    if (!title || !targetValue) return;
    
    const goal: Goal = {
      id: Date.now().toString(),
      title,
      description,
      type,
      account,
      period,
      targetValue: parseFloat(targetValue),
      currentValue: 0,
      startDate,
      endDate: endDate || undefined,
      status: 'Active'
    };
    onSave(goal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#111113] rounded-2xl w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
         
         <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold">Create Goal</h3>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-100 transition-colors rounded-lg hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
         </div>

         <div className="p-6 overflow-y-auto space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Title *</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Reach $5,000 profit this month"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5b32f6]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                placeholder="Optional description for your goal"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5b32f6] min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Goal Type *</label>
                 <select 
                   value={type} 
                   onChange={e => setType(e.target.value as GoalType)}
                   className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5b32f6]"
                 >
                   {GOAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Account *</label>
                 <select 
                   value={account} 
                   onChange={e => setAccount(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5b32f6]"
                 >
                   <option value="ALL">All Accounts</option>
                   <option value="Main Futures (NQ)">Main Futures (NQ)</option>
                 </select>
               </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Period *</label>
              <select 
                value={period} 
                onChange={e => setPeriod(e.target.value as GoalPeriod)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5b32f6]"
              >
                {GOAL_PERIODS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Target Value *</label>
              <input 
                type="number"
                value={targetValue} 
                onChange={e => setTargetValue(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5b32f6]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Start Date *</label>
                 <input 
                   type="date"
                   value={startDate} 
                   onChange={e => setStartDate(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5b32f6]"
                 />
               </div>
               <div>
                 <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">End Date (Optional)</label>
                 <input 
                   type="date"
                   value={endDate} 
                   onChange={e => setEndDate(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5b32f6]"
                 />
               </div>
            </div>

         </div>

         <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={!title || !targetValue}
              className="px-4 py-2 bg-[#5b32f6] hover:bg-[#4a26d7] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Create
            </button>
         </div>

      </div>
    </div>
  );
}
