import { useState, useEffect } from 'react';
import { 
  Building2, Search, SlidersHorizontal, HelpCircle, ShieldAlert,
  ListFilter, RefreshCw, Layers, CheckCircle 
} from 'lucide-react';
import { Header } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { ComplaintForm } from './components/ComplaintForm';
import { ComplaintCard } from './components/ComplaintCard';
import { AdminPanel } from './components/AdminPanel';
import { PRE_SEEDED_COMPLAINTS, OLTINKOL_MAHALLALARI, PROBLEM_CATEGORIES, OFFICIAL_NAMES } from './data';
import { Complaint, StatusType } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'citizen' | 'admin'>('citizen');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  
  // Filtering and searching states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMahallaFilter, setSelectedMahallaFilter] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');

  // Hydrate from localStorage or pre-seed
  useEffect(() => {
    const saved = localStorage.getItem('oltinkol_mfy_complaints');
    if (saved) {
      try {
        setComplaints(JSON.parse(saved));
      } catch (e) {
        setComplaints(PRE_SEEDED_COMPLAINTS(new Date()));
      }
    } else {
      const seeded = PRE_SEEDED_COMPLAINTS(new Date());
      setComplaints(seeded);
      localStorage.setItem('oltinkol_mfy_complaints', JSON.stringify(seeded));
    }
  }, []);

  // Save changes to localStorage helper
  const saveAndSetComplaints = (newComplaints: Complaint[]) => {
    setComplaints(newComplaints);
    localStorage.setItem('oltinkol_mfy_complaints', JSON.stringify(newComplaints));
  };

  // 1. Citizen new complaint submissions
  const handleAddComplaint = (newC: Omit<Complaint, 'id' | 'createdAt' | 'status' | 'deadlineAt' | 'officerName' | 'supportCount'>) => {
    const now = new Date();
    const deadline = new Date(now);
    deadline.setDate(deadline.getDate() + 3); // exactly 72 hours (3 days)

    // Assign a semi-random MFY official based on the problem type
    let appointedOfficial = OFFICIAL_NAMES[0];
    if (newC.problemType.includes('suv')) {
      appointedOfficial = OFFICIAL_NAMES[2]; // Sherzodbek Tojiboyev - Suv
    } else if (newC.problemType.includes('gaz') || newC.problemType.includes('isitish')) {
      appointedOfficial = OFFICIAL_NAMES[1]; // Nodirbek Karimov - Gaz
    } else if (newC.problemType.includes('Yo\'l') || newC.problemType.includes('Chiqindi') || newC.problemType.includes('yoritish')) {
      appointedOfficial = OFFICIAL_NAMES[4]; // Zafarbek - Obodonlashtirish
    } else if (newC.problemType.includes('Ta\'lim')) {
      appointedOfficial = OFFICIAL_NAMES[6]; // Baxtiyorjon - Yoshlar
    }

    const complaint: Complaint = {
      ...newC,
      id: `m-${Math.floor(100 + Math.random() * 900)}`, // m-492 e.g.
      createdAt: now.toISOString(),
      status: 'Qabul qilindi',
      deadlineAt: deadline.toISOString(),
      officerName: appointedOfficial,
      supportCount: 1,
      hasSupported: true, // Citizen who opens supports automatically
      isFree: true
    };

    const updated = [complaint, ...complaints];
    saveAndSetComplaints(updated);
  };

  // 2. Upvote or "Solidarity Support" handler
  const handleSupportComplaint = (id: string) => {
    const updated = complaints.map(c => {
      if (c.id === id) {
        const alreadySupported = c.hasSupported;
        return {
          ...c,
          supportCount: alreadySupported ? c.supportCount - 1 : c.supportCount + 1,
          hasSupported: !alreadySupported
        };
      }
      return c;
    });
    saveAndSetComplaints(updated);
  };

  // 3. Administrative status and resolution update triggers
  const handleUpdateStatus = (id: string, status: StatusType, resolutionText?: string, officerName?: string) => {
    const updated = complaints.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          ...(resolutionText !== undefined && { resolutionText }),
          ...(officerName !== undefined && { officerName })
        };
      }
      return c;
    });
    saveAndSetComplaints(updated);
  };

  // Filter computations
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMahalla = selectedMahallaFilter === '' || c.mahalla === selectedMahallaFilter;
    const matchesCategory = selectedCategoryFilter === '' || c.problemType === selectedCategoryFilter;
    const matchesStatus = selectedStatusFilter === '' || c.status === selectedStatusFilter;

    return matchesSearch && matchesMahalla && matchesCategory && matchesStatus;
  });

  return (
    <div id="portal-root" className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. Navbar and Title Header block */}
      <Header currentView={currentView} onViewChange={setCurrentView} />

      {/* 2. Primary Layout Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentView === 'citizen' ? (
          <div className="space-y-6">
            
            {/* Stats Overview */}
            <StatsDashboard complaints={complaints} />

            {/* Split layout: Form (Left) & Citizen list (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form Col */}
              <div className="lg:col-span-5 lg:sticky lg:top-6">
                <ComplaintForm onSubmit={handleAddComplaint} />
              </div>

              {/* List Col */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Visual filter container panel */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 md:p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-800 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-800" />
                        Murojaatlar ro'yxati
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Oltinko'l aholisi tomonidan yozilgan barcha muammolar ro'yxati</p>
                    </div>
                    
                    {/* Reset custom filters */}
                    {(selectedMahallaFilter || selectedCategoryFilter || selectedStatusFilter || searchQuery) && (
                      <button
                        onClick={() => {
                          setSelectedMahallaFilter('');
                          setSelectedCategoryFilter('');
                          setSelectedStatusFilter('');
                          setSearchQuery('');
                        }}
                        className="text-xs text-emerald-700 hover:text-emerald-950 underline font-medium cursor-pointer"
                      >
                        Filtrlarni tozalash
                      </button>
                    )}
                  </div>

                  {/* Filter grid inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    
                    {/* Search word */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Kalit so'z yoki ism bo'yicha qidiruv"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-2.5 rounded-lg border border-slate-200 focus:outline-emerald-500 bg-slate-50/50"
                      />
                    </div>

                    {/* Mahalla filtering */}
                    <select
                      value={selectedMahallaFilter}
                      onChange={(e) => setSelectedMahallaFilter(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer focus:outline-emerald-500"
                    >
                      <option value="">Barcha mahallalar</option>
                      {OLTINKOL_MAHALLALARI.map(m => (
                        <option key={m.slug} value={m.name}>{m.name}</option>
                      ))}
                    </select>

                    {/* Category filter */}
                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer focus:outline-emerald-500"
                    >
                      <option value="">Barcha muammo turlari</option>
                      {PROBLEM_CATEGORIES.map(cat => (
                        <option key={cat.title} value={cat.title}>{cat.title}</option>
                      ))}
                    </select>

                    {/* Status filter */}
                    <select
                      value={selectedStatusFilter}
                      onChange={(e) => setSelectedStatusFilter(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer focus:outline-emerald-500"
                    >
                      <option value="">Barcha holatlar</option>
                      <option value="Qabul qilindi">Qabul qilindi</option>
                      <option value="Ko'rib chiqilmoqda">Ko'rib chiqilmoqda</option>
                      <option value="Bajarildi">Bajarildi (Hal etilgan)</option>
                      <option value="Rad etildi">Rad etildi</option>
                    </select>

                  </div>
                </div>

                {/* Complaint tickets list */}
                {filteredComplaints.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
                    <p className="text-slate-400 font-medium font-sans">
                      Hech qanday mos keladigan murojaat topilmadi.
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Siz yangi muammo toifasini tanlab murojaat ochishingiz mumkin.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredComplaints.map((c) => (
                      <ComplaintCard 
                        key={c.id} 
                        complaint={c} 
                        onSupport={handleSupportComplaint} 
                      />
                    ))}
                  </div>
                )}

              </div>

            </div>

          </div>
        ) : (
          /* MFY Council Admin Console */
          <div className="space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/20 text-slate-800 p-4 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-900 font-display">Taqdimot & Sinov Rejimi (Morf xatti)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Oddiy sharoitda murojaatlarni MFY rasmiylari o'rganadi. Ushbu panel sizga MFY kengashi nomidan javob yozishni sinab ko'rish imkonini beradi. Chap tarafdagi ro'yxatdan biron-bir murojaatni tanlab, unga mas'ul tayinlang va <strong>3 kunlik ko'rib chiqish kafolatini</strong> amalda hal qiling!
                </p>
              </div>
            </div>

            <AdminPanel 
              complaints={complaints} 
              onUpdateStatus={handleUpdateStatus} 
            />
          </div>
        )}

      </main>

      {/* 3. Footer credits */}
      <footer className="w-full bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold text-white tracking-wide">Oltinko'l MFY</span>
              <span className="bg-emerald-800 text-emerald-100 font-mono font-medium text-[9px] py-0.25 px-1.5 rounded">
                E-Davlat
              </span>
            </div>
            <p className="text-slate-500 mt-1 font-sans">
              Andijon viloyati, Oltinko'l tumani bepul fuqarolar muammolarini boshqarish ochiq tizimi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <span>Platforma turi: <strong className="text-slate-350">Mutlaqo Tekin (Free)</strong></span>
            <span>Aloqa: <strong className="text-slate-350">+998 (74) 310-20-30</strong></span>
            <span>&copy; {new Date().getFullYear()} Oltinko'l MFY. Barcha huquqlar himoyalangan.</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
