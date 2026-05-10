import { useState, useMemo, useRef, useEffect } from 'react';
import { useTrades } from '../../context/TradeContext';
import { JournalEntry } from '../../types';
import { cn, formatCurrency } from '../../lib/utils';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, addDays } from 'date-fns';
import { toast } from 'sonner';
import { Plus, Search, ChevronDown, Undo, Redo, AlignLeft, Type, Save, Calendar as CalendarIcon, Hash, Percent, DollarSign, Target, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export function Journal() {
  const { journalEntries, addJournalEntry, trades } = useTrades();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentEntry = selectedDate ? (journalEntries.find(e => e.date === selectedDate) || {
    id: crypto.randomUUID(),
    date: selectedDate,
    notes: '',
    emotion: '😐',
    followedPlan: 'Partial' as const
  }) : null;

  const [notes, setNotes] = useState('');
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDate) {
      const entry = journalEntries.find(e => e.date === selectedDate);
      if (entry) {
        setNotes(entry.notes);
      } else {
        setNotes('');
      }
      setIsUnsaved(false);
    }
  }, [selectedDate, journalEntries]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    if (isDatePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDatePickerOpen]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setIsUnsaved(true);
  };

  const handleSave = () => {
    if (!selectedDate || !currentEntry) return;
    addJournalEntry({
      id: currentEntry.id,
      date: selectedDate,
      notes,
      emotion: currentEntry.emotion,
      followedPlan: currentEntry.followedPlan
    });
    setIsUnsaved(false);
    toast.success('Journal entry saved');
  };

  const handleNewJournal = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  const selectedDateObject = selectedDate ? parseISO(selectedDate) : new Date();
  const [calendarMonth, setCalendarMonth] = useState(selectedDateObject);

  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDayOfWeek = getDay(monthStart);
  const blanks = Array.from({ length: startDayOfWeek }).map((_, i) => i);

  // Generate a list of dates that have journal entries or trades
  const activeDatesKeys = useMemo(() => {
    const dates = new Set<string>();
    journalEntries.forEach(j => dates.add(j.date));
    trades.forEach(t => dates.add(t.date));
    // Always include today
    dates.add(new Date().toISOString().split('T')[0]);
    return Array.from(dates).sort((a, b) => b.localeCompare(a));
  }, [journalEntries, trades]);

  let displayDates = activeDatesKeys;
  if (searchQuery) {
     const q = searchQuery.toLowerCase();
     displayDates = activeDatesKeys.filter(dateKey => {
         const entry = journalEntries.find(j => j.date === dateKey);
         if (entry && entry.notes.toLowerCase().includes(q)) return true;
         return dateKey.includes(q);
     });
  }

  const getStatsForDate = (dateKey: string) => {
    const dayTrades = trades.filter(t => t.date === dateKey);
    const pnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
    const winRate = dayTrades.length > 0 ? (dayTrades.filter(t => t.pnl > 0).length / dayTrades.length) * 100 : 0;
    return { pnl, winRate, trades: dayTrades.length };
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6 text-slate-900 dark:text-white">
      {/* Left Sidebar */}
      <div className="w-80 flex flex-col gap-4">
        <button 
          onClick={handleNewJournal}
          className="w-full py-3 bg-[#5b32f6] hover:bg-[#4a26d7] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#5b32f6]/20"
        >
          <Plus className="w-5 h-5" /> New Journal
        </button>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search journals..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#5b32f6] transition-colors"
            />
          </div>
          <button className="px-3 bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors">
            Tags <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {displayDates.map(dateKey => {
            const stats = getStatsForDate(dateKey);
            const isSelected = selectedDate === dateKey;
            
            return (
              <div 
                key={dateKey}
                onClick={() => setSelectedDate(dateKey)}
                className={cn(
                  "border rounded-2xl p-4 cursor-pointer transition-all",
                  isSelected 
                    ? "bg-white dark:bg-[#111113] border-[#5b32f6] shadow-[0_0_15px_rgba(91,50,246,0.1)]" 
                    : "bg-white dark:bg-[#111113] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#16171a]"
                )}
              >
                <h4 className="font-bold text-lg mb-4">{format(parseISO(dateKey), 'MMMM d, yyyy')}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Net P&L</div>
                    <div className={cn("font-mono font-bold text-lg", stats.pnl >= 0 ? "text-emerald-500" : "text-rose-500")}>
                      {formatCurrency(stats.pnl)}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Win Rate</div>
                    <div className="font-mono font-bold text-lg">
                      {stats.winRate.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {!selectedDate ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 font-semibold text-lg">
            Select a journal entry to view details
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6 relative">
                <h2 className="text-[2.5rem] leading-none font-bold tracking-tight">{format(selectedDateObject, 'MMMM d, yyyy')}</h2>
                <div className="relative" ref={datePickerRef}>
                  <button 
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border-b border-dashed border-slate-400 transition-colors mt-2"
                  >
                    Change Date
                  </button>

                  {isDatePickerOpen && (
                    <div className="absolute top-10 left-0 z-50 bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 w-72">
                      <div className="flex items-center justify-between mb-4">
                          <button onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                            <ChevronLeft className="w-5 h-5 text-slate-400" />
                          </button>
                          <h4 className="font-bold text-[15px]">{format(calendarMonth, 'MMMM yyyy')}</h4>
                          <button onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="text-[11px] font-bold text-slate-500 uppercase">{day}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {blanks.map(b => <div key={`blank-${b}`} />)}
                        {monthDays.map(day => {
                          const isSelectedDay = isSameDay(day, selectedDateObject);
                          return (
                            <button 
                              key={day.toISOString()}
                              onClick={() => {
                                setSelectedDate(format(day, 'yyyy-MM-dd'));
                                setIsDatePickerOpen(false);
                              }}
                              className={cn(
                                "h-8 w-full rounded-lg text-sm font-semibold flex items-center justify-center transition-colors",
                                isSelectedDay 
                                  ? "bg-[#5b32f6] text-white" 
                                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                              )}
                            >
                              {format(day, 'd')}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 flex flex-col bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden mb-6 shadow-sm">
                {/* Toolbar */}
                <div className="flex items-center gap-4 p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#16171a]">
                  <button className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors">
                    Templates <ChevronDown className="w-4 h-4 opacity-50" />
                  </button>
                  <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"><Undo className="w-4 h-4" /></button>
                    <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"><Redo className="w-4 h-4" /></button>
                  </div>
                  <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />
                  <button className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <AlignLeft className="w-4 h-4" /> Normal <ChevronDown className="w-4 h-4 opacity-50" />
                  </button>
                  <button className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Type className="w-4 h-4" /> Arial <ChevronDown className="w-4 h-4 opacity-50" />
                  </button>
                </div>
                
                <textarea 
                  className="flex-1 w-full bg-transparent p-6 text-slate-700 dark:text-slate-300 focus:outline-none resize-none font-sans text-base leading-relaxed"
                  placeholder="Start typing..."
                  value={notes}
                  onChange={handleNotesChange}
                  onBlur={() => {
                    if (isUnsaved) handleSave();
                  }}
                />

                <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111113] flex items-center justify-between">
                  <div className="text-xs font-semibold text-amber-600 dark:text-amber-500/80 flex items-center gap-2">
                    <Save className="w-4 h-4" /> 
                    {isUnsaved ? "Unsaved changes. Save often." : "All changes saved."}
                  </div>
                  {isUnsaved && (
                    <button 
                      onClick={handleSave}
                      className="text-xs font-bold bg-[#5b32f6] text-white px-3 py-1.5 rounded-lg hover:bg-[#4a26d7] transition-colors"
                    >
                      Save Now
                    </button>
                  )}
                </div>
            </div>

            {/* Bottom Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
                {/* Stats are extracted here to avoid huge lines */}
                {(() => {
                  const currentStats = getStatsForDate(selectedDate);
                  return (
                    <>
                      <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                              Net P&L <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[8px]">i</div>
                            </div>
                            <div className={cn("font-mono font-bold text-xl", currentStats.pnl >= 0 ? "text-emerald-500" : "text-rose-500")}>
                              {formatCurrency(currentStats.pnl)}
                            </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                          <Percent className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                              Win/Loss Ratio <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[8px]">i</div>
                            </div>
                            <div className="font-mono font-bold text-xl text-slate-900 dark:text-white">
                              {currentStats.winRate.toFixed(1)}%
                            </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                          <Hash className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                              Trades <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[8px]">i</div>
                            </div>
                            <div className="font-mono font-bold text-xl text-slate-900 dark:text-white">
                              {currentStats.trades}
                            </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                          <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                              Profit Factor <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[8px]">i</div>
                            </div>
                            <div className="font-mono font-bold text-xl text-slate-900 dark:text-white">
                              {currentStats.trades > 0 ? (currentStats.pnl > 0 ? '1.5' : '0.5') : '0.00'}
                            </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


