import React from 'react';
import { X, Calendar, ArrowRightLeft, Tags, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export function FilterModal({ isOpen, onClose, onReset }: FilterModalProps) {
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
                  onClick={onReset}
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
              {/* Date Range */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Date Range</label>
                <button className="flex items-center gap-3 px-4 py-3 bg-[#18181b] hover:bg-[#27272a] border border-slate-800 rounded-xl transition-colors text-sm font-semibold text-slate-200 justify-start w-full md:w-4/5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  May 1, 2026 - May 31, 2026
                </button>
              </div>

              {/* Direction */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Direction</label>
                <button className="flex items-center gap-3 px-4 py-3 bg-[#18181b] hover:bg-[#27272a] border border-slate-800 rounded-xl transition-colors text-sm font-semibold text-slate-200 justify-start w-full md:w-4/5">
                  <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                  All directions
                </button>
              </div>

              {/* Accounts & Tags */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Accounts & Tags</label>
                <button className="flex items-center gap-3 px-4 py-3 bg-[#18181b] hover:bg-[#27272a] border border-slate-800 rounded-xl transition-colors text-sm font-semibold text-slate-200 justify-start w-full md:w-1/2">
                  <Tags className="w-4 h-4 text-slate-400" />
                  Accounts
                </button>
              </div>

              {/* Instruments */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Instruments</label>
                <button className="flex items-center gap-3 px-4 py-3 bg-[#18181b] hover:bg-[#27272a] border border-slate-800 rounded-xl transition-colors text-sm font-semibold text-slate-200 justify-start w-full md:w-1/2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  Instruments
                </button>
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
                className="px-6 py-2 rounded-xl bg-[#5b32f6] hover:bg-[#4a26d7] text-white font-bold transition-colors"
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
