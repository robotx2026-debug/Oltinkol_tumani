import React from 'react';
import { ShieldCheck, HelpCircle } from 'lucide-react';

interface HeaderProps {
  currentView: 'citizen' | 'admin';
  onViewChange: (view: 'citizen' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="w-full text-white shadow-md font-sans">
      {/* Upper Uzbek National flag-themed subtle line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-sky-400 to-emerald-500" />
      
      {/* Main header block */}
      <div className="uz-pattern bg-emerald-900 border-b border-amber-500/30 px-4 md:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & title block */}
          <div className="flex items-center gap-3.5">
            <div className="bg-amber-400 py-2 px-3.5 rounded-xl border-2 border-emerald-500 shadow-lg text-emerald-950 flex items-center justify-center">
              <span className="font-display font-black text-sm md:text-base tracking-wider select-none">TUMAN</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium py-0.5 px-2 bg-amber-400/20 text-amber-300 rounded border border-amber-400/30">
                  Andijon viloyati
                </span>
                <span className="text-xs font-mono font-medium py-0.5 px-2 bg-emerald-600/40 text-emerald-300 rounded border border-emerald-500/30 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Tekin va Ochiq
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
                Oltinko'l tumani <span className="text-amber-400 font-light">Portali</span>
              </h1>
              <p className="text-xs md:text-sm text-emerald-100 font-sans mt-0.5">
                Fuqarolar murojaatlarini qabul qilish va <span className="text-amber-300 font-semibold underline">3 kunlik</span> tezkor o'rganish tizimi
              </p>
            </div>
          </div>

          {/* Navigation & Mode toggles */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <button
              id="citizen-mode-btn"
              onClick={() => onViewChange('citizen')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 border cursor-pointer ${
                currentView === 'citizen'
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-md scale-[1.02]'
                  : 'bg-emerald-800/60 hover:bg-emerald-800 text-emerald-100 border-emerald-700'
              }`}
            >
              Fuqaro Bo'limi
            </button>
            <button
              id="admin-mode-btn"
              onClick={() => onViewChange('admin')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 border cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-md scale-[1.02]'
                  : 'bg-emerald-800/60 hover:bg-emerald-800 text-emerald-100 border-emerald-700'
              }`}
            >
              Tuman Boshqaruvi (Admin)
            </button>
          </div>
        </div>
      </div>
      
      {/* Notification banner */}
      <div className="bg-emerald-950 text-emerald-100 px-4 py-2.5 text-xs font-sans border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Tuman va mahalla qonunchiligiga binoan barcha murojaatlar <strong>bevosita tuman mutasaddilari va mahalla raislari nazoratida</strong> bo'lib, mutlaqo bepul xizmat ko'rsatiladi.</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-300">
            <span>E-Xizmat: <strong className="text-white">Tekin</strong></span>
            <span>Muddat: <strong className="text-white">Max. 3 kun (72 soat)</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
};
