import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Clock, Gift } from 'lucide-react';
import { Complaint } from '../types';

interface StatsDashboardProps {
  complaints: Complaint[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ complaints }) => {
  const total = complaints.length;
  const solved = complaints.filter(c => c.status === 'Bajarildi').length;
  const reviewing = complaints.filter(c => c.status === 'Ko\'rib chiqilmoqda').length;
  const pending = complaints.filter(c => c.status === 'Qabul qilindi').length;

  // Calculate simulated rate
  const completionRate = total > 0 ? Math.round((solved / total) * 100) : 100;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Total Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
        <div className="bg-sky-50 p-2 rounded-lg text-sky-600 shrink-0">
          <AlertCircle className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Jami murojaatlar</p>
          <p className="text-2xl font-bold font-display text-slate-800 mt-1">{total}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Oltinko'l tumani bo'yicha</p>
        </div>
      </div>

      {/* Solved Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
        <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 shrink-0">
          <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Ijobiy hal etilgan</p>
          <p className="text-2xl font-bold font-display text-emerald-600 mt-1">{solved}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-emerald-500 font-semibold bg-emerald-50 px-1.5 py-0.25 rounded border border-emerald-100">
              {completionRate}% samaradorlik
            </span>
          </div>
        </div>
      </div>

      {/* Under Review Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
        <div className="bg-amber-50 p-2 rounded-lg text-amber-600 shrink-0">
          <Clock className="w-5 h-5 md:w-6 md:h-6 rotate-180" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Ko'rish jarayonida</p>
          <p className="text-2xl font-bold font-display text-amber-600 mt-1">{reviewing + pending}</p>
          <p className="text-[10px] text-amber-500 mt-0.5 font-medium">Muddati: max 3 kun (72s)</p>
        </div>
      </div>

      {/* Free service badge */}
      <div className="bg-linear-to-br from-emerald-800 to-teal-900 p-4 rounded-xl border border-emerald-700 shadow-sm text-white flex items-start gap-3">
        <div className="bg-amber-400 p-2 rounded-lg text-emerald-950 shrink-0 shadow-inner">
          <Gift className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <p className="text-xs text-emerald-200 font-medium">Xizmat narxi</p>
          <p className="text-xl md:text-2xl font-extrabold font-display text-amber-300 mt-1">MUTLAQO BEPUL</p>
          <p className="text-[9px] text-emerald-100 underline decoration-amber-400/50 mt-0.5">Davlat xizmati, soliq to'lovchilar hisobidan</p>
        </div>
      </div>

    </div>
  );
};
