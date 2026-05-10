import { Users } from 'lucide-react';

export function StudentDashboard() {
  return (
    <div className="max-w-5xl space-y-8 pb-20 text-slate-900 dark:text-white">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
      </header>

      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users className="w-6 h-6" /> My Cohorts
        </h3>
        
        <div className="bg-white dark:bg-[#111113] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-center">
           <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
             You are not enrolled in any cohorts yet. Accept an invitation from a mentor to get started.
           </p>
        </div>
      </div>
    </div>
  );
}
