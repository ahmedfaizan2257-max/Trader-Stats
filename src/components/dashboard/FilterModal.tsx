import React from 'react';
import { X, Calendar, ArrowRightLeft, Tags, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  accountFilter: string;
  setAccountFilter: (val: string) => void;
  directionFilter: string;
  setDirectionFilter: (val: string) => void;
  instrumentFilter: string;
  setInstrumentFilter: (val: string) => void;
  uniqueAccounts: string[];
  uniqueInstruments: string[];
}

export function FilterModal({ 
  isOpen, onClose, onReset,
  accountFilter, setAccountFilter,
  directionFilter, setDirectionFilter,
  instrumentFilter, setInstrumentFilter,
  uniqueAccounts, uniqueInstruments
}: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-[#09090b] border border-slate-800 rounded-3xl p-6 z-50 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-sans tracking-tight text-white">Filters</h2>
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => {
                    onReset();
                  }}
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Reset all
                </button>
                <button 
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Direction */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Direction</label>
                <div className="relative w-full md:w-4/5">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                  </div>
                  <select 
                    value={directionFilter}
                    onChange={(e) => setDirectionFilter(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#18181b] hover:bg-[#27272a] border border-slate-800 rounded-xl transition-colors text-sm font-semibold text-slate-200 focus:outline-none focus:border-[#5b32f6] appearance-none"
                  >
                    <option value="All">All directions</option>
                    <option value="Long">Long</option>
                    <option value="Short">Short</option>
                  </select>
                </div>
              </div>

              {/* Accounts & Tags */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Accounts</label>
                <div className="relative w-full md:w-4/5">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Tags className="w-4 h-4 text-slate-400" />
                  </div>
                  <select 
                    value={accountFilter}
                    onChange={(e) => setAccountFilter(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#18181b] hover:bg-[#27272a] border border-slate-800 rounded-xl transition-colors text-sm font-semibold text-slate-200 focus:outline-none focus:border-[#5b32f6] appearance-none"
                  >
                    <option value="All">All Accounts</option>
                    {uniqueAccounts.map(acc => (
                      <option key={acc} value={acc}>{acc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Instruments */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Instruments</label>
                <div className="relative w-full md:w-4/5">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Activity className="w-4 h-4 text-slate-400" />
                  </div>
                  <select 
                    value={instrumentFilter}
                    onChange={(e) => setInstrumentFilter(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#18181b] hover:bg-[#27272a] border border-slate-800 rounded-xl transition-colors text-sm font-semibold text-slate-200 focus:outline-none focus:border-[#5b32f6] appearance-none"
                  >
                    <option value="All">All Instruments</option>
                    {uniqueInstruments.map(inst => (
                      <option key={inst} value={inst}>{inst}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-4 border-t border-slate-800 pt-6">
              <button 
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-slate-300 font-bold hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-[#5b32f6] hover:bg-[#4a26d7] text-white font-bold transition-colors shadow-[0_0_15px_rgba(91,50,246,0.3)]"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
