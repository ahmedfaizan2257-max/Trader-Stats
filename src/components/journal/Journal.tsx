import { useState } from 'react';
import { useTrades } from '../../context/TradeContext';
import { JournalEntry } from '../../types';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

const EMOTIONS = [
  { emoji: '😊', label: 'Confident' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '🎯', label: 'Focused' },
];

export function Journal() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { journalEntries, addJournalEntry } = useTrades();

  const currentEntry = journalEntries.find(e => e.date === date) || {
    id: crypto.randomUUID(),
    date,
    notes: '',
    emotion: '😐',
    followedPlan: 'Partial' as const
  };

  const [notes, setNotes] = useState(currentEntry.notes);
  const [emotion, setEmotion] = useState(currentEntry.emotion);
  const [followedPlan, setFollowedPlan] = useState<'Yes'|'No'|'Partial'>(currentEntry.followedPlan);

  // Update local state when date changes
  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    const entry = journalEntries.find(e => e.date === newDate);
    if (entry) {
      setNotes(entry.notes);
      setEmotion(entry.emotion);
      setFollowedPlan(entry.followedPlan);
    } else {
      setNotes('');
      setEmotion('😐');
      setFollowedPlan('Partial');
    }
  };

  const handleSave = () => {
    addJournalEntry({
      id: currentEntry.id,
      date,
      notes,
      emotion,
      followedPlan
    });
    toast.success('Journal entry saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h2 className="text-3xl font-light tracking-tight">Daily Journal</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">Document your mental state and adherence to the plan.</p>
      </header>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <input 
            type="date" 
            value={date} 
            onChange={(e) => handleDateChange(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 font-mono text-cyan-400"
          />
          <span className="text-sm text-slate-500 font-medium">
            {format(new Date(date), 'EEEE, MMMM do, yyyy')}
          </span>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-semibold mb-3">Dominant Emotion</label>
            <div className="flex gap-3">
              {EMOTIONS.map(emo => (
                <button
                  key={emo.label}
                  onClick={() => setEmotion(emo.emoji)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all",
                    emotion === emo.emoji 
                      ? "bg-slate-100 dark:bg-slate-800 border-cyan-500/50 shadow-sm" 
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100"
                  )}
                >
                  <span className="text-2xl">{emo.emoji}</span>
                  <span className={cn("text-[10px] font-medium uppercase tracking-wider", emotion === emo.emoji ? "text-cyan-400" : "text-slate-500")}>
                    {emo.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Did you follow your trading plan?</label>
            <div className="flex gap-3">
              {(['Yes', 'Partial', 'No'] as const).map(opt => {
                let colorClass = "border-slate-200 dark:border-slate-800";
                if (followedPlan === opt) {
                  if (opt === 'Yes') colorClass = "border-green-500/50 bg-green-500/10 text-green-400";
                  if (opt === 'Partial') colorClass = "border-yellow-500/50 bg-yellow-500/10 text-yellow-400";
                  if (opt === 'No') colorClass = "border-red-500/50 bg-red-500/10 text-red-400";
                }
                
                return (
                  <button
                    key={opt}
                    onClick={() => setFollowedPlan(opt)}
                    className={cn(
                      "px-6 py-2 rounded-xl border font-medium text-sm transition-all",
                      followedPlan === opt ? colorClass : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-600"
                    )}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Reflections & Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you see in the market today? How did you execute? What could be improved?"
              rows={8}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Save Journal Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
