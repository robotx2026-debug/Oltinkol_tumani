import React, { useState } from 'react';
import { ShieldCheck, ClipboardList, CheckCircle2, XCircle, Clock, UserCheck, Check, Send } from 'lucide-react';
import { Complaint, StatusType } from '../types';
import { OFFICIAL_NAMES } from '../data';

interface AdminPanelProps {
  complaints: Complaint[];
  onUpdateStatus: (id: string, status: StatusType, resolutionText?: string, officerName?: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ complaints, onUpdateStatus }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resolutionInput, setResolutionInput] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState(OFFICIAL_NAMES[0]);
  const [customOfficer, setCustomOfficer] = useState('');

  const selectedComplaint = complaints.find(c => c.id === selectedId);

  const handleUpdate = (status: StatusType) => {
    if (!selectedId) return;
    
    const finalOfficer = selectedOfficer === 'Boshqa' ? customOfficer : selectedOfficer;
    if (selectedOfficer === 'Boshqa' && !customOfficer.trim()) {
      alert("Iltimos, mas'ul xodim ismini kiriting!");
      return;
    }

    onUpdateStatus(selectedId, status, resolutionInput, finalOfficer || undefined);
    
    // Clear states
    setSelectedId(null);
    setResolutionInput('');
    setCustomOfficer('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left 2 Columns: Admin list */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
          <ClipboardList className="w-5 h-5 text-emerald-800" />
          <div>
            <h3 className="font-display font-bold text-lg text-slate-800">Murojaatlarni boshqarish</h3>
            <p className="text-xs text-slate-500">Oltinko'l tumani MFY barcha kelib tushgan fuqaro murojaatlarini saralash oynasi</p>
          </div>
        </div>

        {complaints.length === 0 ? (
          <p className="text-center py-12 text-slate-400 font-medium">Hozircha hech qanday murojaat yo'q.</p>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {complaints.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedId(c.id);
                  setResolutionInput(c.resolutionText || '');
                  setSelectedOfficer(OFFICIAL_NAMES.includes(c.officerName) ? c.officerName : 'Boshqa');
                  if (!OFFICIAL_NAMES.includes(c.officerName)) {
                    setCustomOfficer(c.officerName);
                  }
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer ${
                  selectedId === c.id 
                    ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/10' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-[10px] font-bold py-0.5 px-1.5 bg-slate-100 text-slate-600 rounded">
                      #{c.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{c.mahalla}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-[11px] text-slate-400">{c.fullName}</span>
                  </div>
                  <h4 className="font-bold text-slate-850 text-sm">{c.problemType}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-lg">{c.description}</p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                    c.status === 'Qabul qilindi' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    c.status === "Ko'rib chiqilmoqda" ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    c.status === 'Bajarildi' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    'bg-slate-50 text-slate-700 border-slate-100'
                  }`}>
                    {c.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Act On Complaint Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6 h-fit md:sticky md:top-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-800" />
          <div>
            <h3 className="font-display font-bold text-lg text-slate-800">Harakat moduli</h3>
            <p className="text-xs text-slate-500">Tanlangan murojaat bo'yicha qaror chiqarish</p>
          </div>
        </div>

        {selectedComplaint ? (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1">
              <span className="text-[9px] font-bold text-emerald-850 uppercase tracking-widest bg-emerald-100 px-1.5 py-0.25 rounded">
                Murojaat id: #{selectedComplaint.id}
              </span>
              <p className="text-xs font-bold text-slate-700 mt-2">{selectedComplaint.fullName} ({selectedComplaint.mahalla})</p>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1 italic font-sans max-h-32 overflow-y-auto">
                "{selectedComplaint.description}"
              </p>
            </div>

            {/* Step 1: Assign Officer */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">1. Ijrochi mas'ul xodimni tayinlash</label>
              <select
                value={selectedOfficer}
                onChange={(e) => setSelectedOfficer(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-emerald-500"
              >
                {OFFICIAL_NAMES.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
                <option value="Boshqa">Custom xodim yozish...</option>
              </select>

              {selectedOfficer === 'Boshqa' && (
                <input
                  type="text"
                  required
                  placeholder="Ism, familiya va lavozimi"
                  value={customOfficer}
                  onChange={(e) => setCustomOfficer(e.target.value)}
                  className="w-full text-xs p-2 mt-1 rounded-lg border border-slate-200 focus:outline-emerald-500"
                />
              )}
            </div>

            {/* Step 2: Write official resolution notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 block">2. Ish bo'yicha javob xati / Natija</label>
              <textarea
                rows={3}
                placeholder="Masalan: Murojaat o'rganildi. Gaz bosimini tartibga soluvchi reaktor qayta sozlandi va tabiiy gaz quvvati tiklandi."
                value={resolutionInput}
                onChange={(e) => setResolutionInput(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-emerald-500 font-sans"
              />
            </div>

            {/* Step 3: Change state button dashboard */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">3. Jarayon holatini o'zgartirish</span>
              <div className="grid grid-cols-1 gap-2">
                
                <button
                  onClick={() => handleUpdate("Ko'rib chiqilmoqda")}
                  className="w-full bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-amber-500 rotate-180" />
                  Ko'rib chiqishga o'tkazish
                </button>

                <button
                  onClick={() => handleUpdate("Bajarildi")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs hover:shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Muvaffaqiyatli hal etildi (Yopish)
                </button>

                <button
                  onClick={() => handleUpdate("Rad etildi")}
                  className="w-full bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  Murojaatni rad etish
                </button>

              </div>
            </div>

          </div>
        ) : (
          <div className="p-8 text-center text-slate-450 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50">
            Harakatlarni boshlash uchun chap tarafdan biron-bir murojaat ustiga bosing.
          </div>
        )}

      </div>

    </div>
  );
};
